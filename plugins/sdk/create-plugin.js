#!/usr/bin/env node
/**
KNOUX SDK CLI
A simple utility to scaffold new plugins.
*/
const fs = require('fs');
const path = require('path');
const pluginName = process.argv[2];
if (!pluginName) {
console.error("❌ Usage: node create-plugin.js <plugin-folder-name>");
process.exit(1);
}
const targetDir = path.resolve(__dirname, '..', pluginName);
if (fs.existsSync(targetDir)) {
console.error(❌ Directory ${pluginName} already exists!);
process.exit(1);
}
console.log(✨ Scaffolding plugin: ${pluginName}...);
fs.mkdirSync(targetDir);
fs.mkdirSync(path.join(targetDir, 'src'));
// 1. Create Manifest
const manifest = require('./templates/manifest.template.json');
manifest.id = com.user.${pluginName.toLowerCase()};
manifest.name = pluginName;
fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
// 2. Create TSConfig
const tsconfig = fs.readFileSync(path.join(__dirname, 'templates', 'tsconfig.template.json'));
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), tsconfig);
// 3. Create Entry File
const entryCode = `
import { KnouxPlugin } from "@knoux/plugin-sdk";
export default class ${pluginName.replace(/[^a-zA-Z]/g, '')} extends KnouxPlugin {
async onLoad() {
this.context.logger.info("Hello from ${pluginName}!");
}
code
Code
async onUnload() {
    // Clean up
}
}
`;
fs.writeFileSync(path.join(targetDir, 'src', 'index.ts'), entryCode.trim());
console.log(✅ Plugin created at: ${targetDir});
console.log(\nNext steps:);
console.log(1. cd ../${pluginName});
console.log(2. npm install);
console.log(3. npm run build);
