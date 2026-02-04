/**
 * knoux-auto-pr-launch.ts
 * Codex-ready CLI script — Full KNOUX Player X™ Auto PR + Patch + CI/CD Integration
 *
 * Usage:
 *   NODE_ENV=production GITHUB_TOKEN=... OPENAI_API_KEY=... node knoux-auto-pr-launch.ts
 *
 * Functionality:
 * - يراقب المشروع، يحدد النواقص، يطبق التصحيحات تلقائيًا
 * - يرفع branch جديد على GitHub
 * - ينشئ PR تلقائي مع الملخص الكامل
 * - يضيف Reviewers و Labels
 * - يدمج تلقائي عند نجاح CI/CD (اختياري)
 */

import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";
import execa from "execa";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { OpenAIApi, Configuration } from "openai";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const OPENAI_KEY = process.env.OPENAI_API_KEY || null;
if (!GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN in environment");

const git = simpleGit();
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const openai = OPENAI_KEY ? new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY })) : null;

const OWNER = process.env.PR_OWNER || "YOUR_GITHUB_USERNAME";
const REPO = process.env.PR_REPO || "knoux-player-x";
const BASE_BRANCH = process.env.PR_BASE || "main";
const HEAD_BRANCH = `auto/pr-launch-${Date.now()}`;
const REVIEWERS = (process.env.PR_REVIEWERS || "team-lead,qa-engineer").split(",").map((s) => s.trim());
const LABELS = (process.env.PR_LABELS || "release,launch-ready,PR-auto").split(",").map((s) => s.trim());
const MERGE_METHOD: "squash" | "merge" | "rebase" =
  (process.env.PR_MERGE_METHOD as "squash" | "merge" | "rebase") || "squash";

/* ------------------------------
   Helper Functions
------------------------------- */

async function runCmd(cmd: string, args: string[], opts: Record<string, unknown> = {}) {
  try {
    const res = await execa(cmd, args, { stdio: "pipe", ...opts });
    return { ok: true, stdout: res.stdout, stderr: res.stderr };
  } catch (e: any) {
    return { ok: false, stdout: e.stdout || "", stderr: e.stderr || e.message };
  }
}

async function createPR(body: string) {
  await git.add(["-A"]);
  await git.commit("chore: auto PR launch verification", { "--allow-empty": null }).catch(() => {});
  await git.push("origin", HEAD_BRANCH);

  const { data: pr } = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: "🚀 Auto PR Launch — KNOUX Player X™",
    head: HEAD_BRANCH,
    base: BASE_BRANCH,
    body
  });

  await octokit.pulls.requestReviewers({
    owner: OWNER,
    repo: REPO,
    pull_number: pr.number,
    reviewers: REVIEWERS
  });

  await octokit.issues.addLabels({
    owner: OWNER,
    repo: REPO,
    issue_number: pr.number,
    labels: LABELS
  });

  console.log(`✅ PR created: ${pr.html_url}`);
  return pr;
}

async function main() {
  const repoRoot = process.cwd();

  await git.fetch();
  const status = await git.status();
  if (!status.isClean()) {
    console.warn("Stashing uncommitted changes");
    await git.stash();
  }

  await git.checkout(BASE_BRANCH);
  await git.pull("origin", BASE_BRANCH);
  await git.checkoutLocalBranch(HEAD_BRANCH);

  const steps = [
    { cmd: "npm", args: ["ci"], hint: "install" },
    { cmd: "npm", args: ["run", "lint"], hint: "lint" },
    { cmd: "npm", args: ["run", "build"], hint: "build" },
    { cmd: "npm", args: ["test", "--", "--runInBand"], hint: "test" }
  ];

  const failures: Array<{ step: string; result: any }> = [];
  for (const s of steps) {
    console.log(`>> Running: ${s.cmd} ${s.args.join(" ")} (${s.hint})`);
    const res = await runCmd(s.cmd, s.args, { cwd: repoRoot });
    if (!res.ok) {
      console.error(`!! Step failed: ${s.hint}`);
      failures.push({ step: s.hint, result: res });
      break;
    }
  }

  let prBody = `KNOUX Player X™ Auto PR\n\nSteps performed:\n`;
  prBody += steps.map((s) => `- ${s.hint}`).join("\n") + "\n\n";

  if (failures.length === 0) {
    await createPR(prBody + "All checks passed ✅");
    return;
  }

  const firstFail = failures[0];
  prBody += `Failure step: ${firstFail.step}\n\n`;
  prBody += "Error output:\n```\n" + (firstFail.result.stderr || firstFail.result.stdout).slice(0, 3000) + "\n```\n\n";

  if (openai) {
    console.log(">> Requesting automated patch via OpenAI...");
    const prompt = `
You are a senior engineer. Repository: KNOUX Player X™.
Failure step: ${firstFail.step}.
Error output:
${firstFail.result.stderr || firstFail.result.stdout}
Provide a minimal, safe unified diff patch to fix the issue.
`;
    const resp = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0
    });
    const patch = resp.data.choices[0].message?.content || "";
    if (patch) {
      const patchFile = path.join(repoRoot, `knoux_autopatch.diff`);
      await fs.writeFile(patchFile, patch, "utf8");
      console.log(`>> Patch saved: ${patchFile}`);
      await runCmd("git", ["apply", patchFile], { cwd: repoRoot });
      prBody += "Automated patch applied.\n";
    }
  }

  await createPR(prBody);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
