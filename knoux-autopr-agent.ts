/**
 * knoux-autopr-agent.ts
 * Codex/Copilot-ready PR Automation + Smart Repair Agent for KNOUX Player X™
 *
 * Usage:
 *   NODE_ENV=production GITHUB_TOKEN=... OPENAI_API_KEY=... node knoux-autopr-agent.ts
 *
 * Installs (one-time):
 *   npm i @octokit/rest simple-git execa fs-extra dotenv openai jsdiff
 *
 * What it does (automation summary - for coder consumption only):
 * - Creates a feature branch
 * - Runs install, lint, build, tests
 * - Collects failing commands + stacktraces + relevant source files
 * - If OPENAI_API_KEY present: asks Codex/ChatGPT to propose patches (unified diff)
 * - Applies patches, re-runs checks
 * - If green, pushes branch, opens PR via Octokit, assigns reviewers/labels
 * - Optionally polls GitHub checks and merges when green
 *
 * NOTE: This file is intentionally "Codex-ready" (structured & prompt-embedded) so an LLM
 * can be instructed to run/modify it or to generate improved fixes when called.
 */

import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";
import execa from "execa";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { OpenAIApi, Configuration } from "openai";
import * as jsdiff from "diff";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const OPENAI_KEY = process.env.OPENAI_API_KEY || null;
if (!GITHUB_TOKEN) {
  console.error("Missing GITHUB_TOKEN in environment. Exiting.");
  process.exit(1);
}

const git = simpleGit();
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const openai = OPENAI_KEY ? new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY })) : null;

const OWNER = process.env.PR_OWNER || "YOUR_GITHUB_USERNAME";
const REPO = process.env.PR_REPO || "knoux-player-x";
const BASE_BRANCH = process.env.PR_BASE || "main";
const HEAD_BRANCH = `auto/pr-ai-fix-${Date.now()}`;
const REVIEWERS = (process.env.PR_REVIEWERS || "team-lead,qa-engineer")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const LABELS = (process.env.PR_LABELS || "auto-fix,ai-suggested,pr-auto")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MERGE_METHOD: "squash" | "merge" | "rebase" =
  (process.env.PR_MERGE_METHOD as "squash" | "merge" | "rebase") || "squash";
const CI_POLL_INTERVAL = 20 * 1000;
const CI_POLL_TIMEOUT = 30 * 60 * 1000;

/* ------------------------------
   Helpers
   ------------------------------ */

async function runCmd(cmd: string, args: string[], opts: Record<string, unknown> = {}) {
  try {
    const res = await execa(cmd, args, { stdio: "pipe", ...opts });
    return { ok: true, stdout: res.stdout, stderr: res.stderr };
  } catch (e: any) {
    return { ok: false, stdout: e.stdout || "", stderr: e.stderr || e.message, exitCode: e.exitCode || 1 };
  }
}

async function collectRelevantFilesFromErrors(stderr: string, repoRoot: string) {
  const candidates = new Set<string>();
  const regex =
    /(?:(?:at )?[^()\s]*\()?([/\\\w\-.]+(?:\.(?:ts|tsx|js|jsx|json|css|scss|html)))\)?/g;
  let m;
  while ((m = regex.exec(stderr)) !== null) {
    const p = path.resolve(repoRoot, m[1]);
    if (await fs.pathExists(p)) candidates.add(p);
  }
  // Always include package.json, tsconfig, lint configs
  ["package.json", "tsconfig.json", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.json", ".prettierrc", "vite.config.ts", "webpack.config.js"]
    .forEach((f) => {
      const p = path.resolve(repoRoot, f);
      if (fs.existsSync(p)) candidates.add(p);
    });
  return Array.from(candidates).slice(0, 40); // limit
}

async function generatePatchWithOpenAI(prompt: string) {
  if (!openai) throw new Error("OpenAI key missing");
  const resp = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an expert TypeScript/Electron/React engineer. Produce a unified diff patch only." },
      { role: "user", content: prompt }
    ],
    max_tokens: 3000,
    temperature: 0.0
  });
  const text = resp.data.choices[0].message?.content || "";
  const diffStart = text.indexOf("diff --git");
  const patch = diffStart >= 0 ? text.slice(diffStart) : text;
  return patch;
}

function applyUnifiedDiff(patch: string, repoRoot: string) {
  const tmpPatch = path.join(repoRoot, `.knoux_patch_${Date.now()}.diff`);
  fs.writeFileSync(tmpPatch, patch, "utf8");
  return execa("git", ["apply", tmpPatch], { cwd: repoRoot })
    .then(() => {
      fs.unlinkSync(tmpPatch);
      return { applied: true };
    })
    .catch(async () => {
      try {
        const files = jsdiff.parsePatch(patch);
        for (const f of files) {
          const target = path.join(repoRoot, f.newFileName.replace(/^a\//, "").replace(/^b\//, ""));
          if (!f.hunks || f.hunks.length === 0) continue;
          let original = "";
          if (await fs.pathExists(target)) original = await fs.readFile(target, "utf8");
          const patched = jsdiff.applyPatch(original, f);
          if (patched === false) {
            throw new Error(`Failed to apply patch to ${target}`);
          }
          await fs.outputFile(target, patched as string, "utf8");
        }
        return { applied: true };
      } catch (err) {
        return { applied: false, error: (err as Error).message };
      }
    });
}

/* ------------------------------
   Main flow
   ------------------------------ */

async function main() {
  const repoRoot = process.cwd();

  console.log(`>> Starting autopr agent in ${repoRoot}`);
  await git.fetch();
  const status = await git.status();
  if (!status.isClean()) {
    console.warn("Working directory is not clean. Stashing changes.");
    await git.stash();
  }

  await git.checkout(BASE_BRANCH);
  await git.pull("origin", BASE_BRANCH);

  console.log(`>> Creating branch ${HEAD_BRANCH}`);
  await git.checkoutLocalBranch(HEAD_BRANCH);

  const sequence = [
    { cmd: "npm", args: ["ci"], hint: "install" },
    { cmd: "npm", args: ["run", "lint"], hint: "lint" },
    { cmd: "npm", args: ["run", "build"], hint: "build" },
    { cmd: "npm", args: ["test", "--", "--runInBand"], hint: "test" }
  ];

  const failures: Array<{ step: string; result: any }> = [];
  for (const s of sequence) {
    console.log(`>> Running: ${s.cmd} ${s.args.join(" ")} (${s.hint})`);
    const res = await runCmd(s.cmd, s.args, { cwd: repoRoot, env: process.env });
    if (!res.ok) {
      console.error(`!! Step failed: ${s.hint}`);
      failures.push({ step: s.hint, result: res });
      break;
    } else {
      console.log(`✅ ${s.hint} OK`);
    }
  }

  let prBody = `Automated PR created by knoux-autopr-agent.\n\nChecks performed:\n`;
  prBody += sequence.map((s) => `- ${s.hint}`).join("\n") + "\n\n";

  if (failures.length === 0) {
    console.log(">> All checks green. Preparing PR.");
    await git.add(["-A"]);
    const commitMsg = "chore: automated baseline verification (no changes required)";
    await git.commit(commitMsg).catch(() => {});
    await git.push("origin", HEAD_BRANCH);

    const { data: pr } = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title: "chore: baseline verification — auto PR (no fixes required)",
      head: HEAD_BRANCH,
      base: BASE_BRANCH,
      body: prBody
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
    return;
  }

  const firstFail = failures[0];
  prBody += `Failure step: ${firstFail.step}\n\n`;
  prBody += "Error output (truncated):\n```\n" + (firstFail.result.stderr || firstFail.result.stdout).slice(0, 3000) + "\n```\n\n";

  const relevantFiles = await collectRelevantFilesFromErrors(firstFail.result.stderr || firstFail.result.stdout, repoRoot);
  prBody += `Relevant files (${relevantFiles.length}):\n` + relevantFiles.map((f) => `- ${path.relative(repoRoot, f)}`).join("\n") + "\n\n";

  const fileContents: Record<string, string> = {};
  for (const f of relevantFiles) {
    try {
      fileContents[path.relative(repoRoot, f)] = await fs.readFile(f, "utf8");
    } catch {
      fileContents[path.relative(repoRoot, f)] = "<could not read>";
    }
  }

  const llmPrompt = [
    "You are a senior engineer with deep knowledge of TypeScript, Electron, React, Redux Toolkit, and CI systems.",
    `Repository: ${OWNER}/${REPO}`,
    `Failure step: ${firstFail.step}`,
    "Provide a minimal, safe set of code changes (unified diff) that fix the root cause of the failure.",
    "Requirements:",
    "- Produce only a unified diff (git-style) in your response, no additional commentary.",
    "- Keep changes minimal and focused. If unsure, add TODO comments instead of large refactors.",
    "- If tests are failing, prioritize making tests pass without disabling them.",
    "",
    "Error output (truncated):",
    "```",
    (firstFail.result.stderr || firstFail.result.stdout).slice(0, 4000),
    "```",
    "",
    "Relevant files and their contents:"
  ].join("\n");

  let promptBody = llmPrompt + "\n\n";
  for (const [rel, content] of Object.entries(fileContents)) {
    promptBody += `--- FILE: ${rel} ---\n`;
    promptBody += content.slice(0, 20000) + "\n\n";
  }
  promptBody += "\n--- END ---\n";
  promptBody += "\nProvide a unified diff patch only.";

  let patch = "";
  if (openai) {
    console.log(">> Requesting patch from OpenAI...");
    try {
      patch = await generatePatchWithOpenAI(promptBody);
      if (!patch || patch.trim().length === 0) throw new Error("Empty patch returned");
      console.log(">> Patch received (truncated):\n", patch.slice(0, 1000));
    } catch (err) {
      console.error("OpenAI patch generation failed:", (err as Error).message);
      patch = "";
    }
  } else {
    console.warn("No OPENAI_API_KEY set: skipping automated patch generation. Creating diagnostic PR instead.");
  }

  if (!patch) {
    await git.add(["-A"]);
    await git.commit(`chore: diagnostic PR — ${firstFail.step} failure`, { "--allow-empty": null }).catch(() => {});
    await git.push("origin", HEAD_BRANCH);

    const { data: pr } = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title: `wip: diagnostic — automatic analysis (${firstFail.step})`,
      head: HEAD_BRANCH,
      base: BASE_BRANCH,
      body: prBody + "\n\n_No automated patch was generated (no OpenAI key or LLM failed). Please triage manually._"
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

    console.log(`✅ Diagnostic PR created: ${pr.html_url}`);
    return;
  }

  console.log(">> Applying patch...");
  const applyRes = await applyUnifiedDiff(patch, repoRoot);
  if (!applyRes.applied) {
    console.error("Patch apply failed:", applyRes.error || "unknown");
    const patchFile = path.join(repoRoot, "knoux_autopatch.diff");
    await fs.writeFile(patchFile, patch, "utf8");
    await git.add(["-A", patchFile]);
    await git.commit("chore: add autopatch (failed to apply automatically)", { "--allow-empty": null }).catch(() => {});
    await git.push("origin", HEAD_BRANCH);

    const { data: pr } = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title: `wip: autopatch attached — manual apply required (${firstFail.step})`,
      head: HEAD_BRANCH,
      base: BASE_BRANCH,
      body: prBody + "\n\nAutomated patch could not be applied cleanly. Patch attached at `knoux_autopatch.diff`."
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

    console.log(`✅ PR created with patch attached: ${pr.html_url}`);
    return;
  }

  console.log(">> Committing applied patch changes...");
  await git.add(["-A"]);
  const commitMsg = "fix: automated patch applied by knoux-autopr-agent";
  await git.commit(commitMsg).catch(() => {});
  await git.push("origin", HEAD_BRANCH);

  console.log(">> Re-running build & tests after patch...");
  const buildRes = await runCmd("npm", ["run", "build"], { cwd: repoRoot, env: process.env });
  const testRes = await runCmd("npm", ["test", "--", "--runInBand"], { cwd: repoRoot, env: process.env });

  prBody += "\nPost-patch results:\n";
  prBody += `- build: ${buildRes.ok ? "OK" : "FAIL"}\n`;
  prBody += `- test: ${testRes.ok ? "OK" : "FAIL"}\n`;

  const { data: pr } = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: "fix: automated patch — knoux-autopr-agent",
    head: HEAD_BRANCH,
    base: BASE_BRANCH,
    body: prBody + "\n\nPatch applied automatically by knoux-autopr-agent."
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

  console.log(`✅ PR created with automated fixes: ${pr.html_url}`);

  if (process.env.PR_AUTO_MERGE === "1") {
    console.log(">> Auto-merge enabled. Polling checks...");
    const start = Date.now();
    while (Date.now() - start < CI_POLL_TIMEOUT) {
      const { data: prCheck } = await octokit.pulls.get({
        owner: OWNER,
        repo: REPO,
        pull_number: pr.number
      });

      const headSha = prCheck.head.sha;
      const { data: combined } = await octokit.repos.getCombinedStatusForRef({
        owner: OWNER,
        repo: REPO,
        ref: headSha
      });

      console.log(`Checks: state=${combined.state} (${combined.statuses.length} statuses)`);

      if (combined.state === "success") {
        try {
          await octokit.pulls.merge({
            owner: OWNER,
            repo: REPO,
            pull_number: pr.number,
            merge_method: MERGE_METHOD
          });
          console.log("🔥 PR merged automatically.");
          break;
        } catch (err) {
          console.error("Auto-merge failed:", (err as Error).message);
          break;
        }
      } else if (combined.state === "failure") {
        console.warn("Checks failed. Not merging.");
        break;
      } else {
        await new Promise((r) => setTimeout(r, CI_POLL_INTERVAL));
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
