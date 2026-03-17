#!/usr/bin/env node
/**
 * Sync all case sources into Sanity.
 * Run: node scripts/sync-all.mjs
 *
 * This runs each sync sequentially so you can see progress per source.
 */

import { execSync } from "child_process";

const scripts = [
  { name: "FBI Wanted", cmd: "node scripts/sync-fbi.mjs" },
  { name: "NCMEC Missing Children", cmd: "node scripts/sync-ncmec.mjs" },
  { name: "NamUs Missing Persons", cmd: "node scripts/sync-namus.mjs" },
];

console.log("╔═══════════════════════════════════════╗");
console.log("║   RaiseTheReward — Full Case Sync     ║");
console.log("╚═══════════════════════════════════════╝\n");

for (const script of scripts) {
  console.log(`\n━━━ ${script.name} ━━━\n`);
  try {
    execSync(script.cmd, { stdio: "inherit" });
  } catch (err) {
    console.log(`\n  ⚠ ${script.name} sync had issues (exit code ${err.status}). Continuing...\n`);
  }
}

console.log("\n━━━ All syncs complete ━━━\n");
console.log("Go to /admin to manage visibility and featured cases.");
