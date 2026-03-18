#!/usr/bin/env node
/**
 * Generate vanity slugs for all cases that don't have one.
 * Format: firstname + last initial, e.g. "Nancy Guthrie" → "nancyg"
 * Duplicates get a number appended: "nancyg2", "nancyg3", etc.
 *
 * Run: node scripts/generate-vanity-slugs.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load env ──
const envPath = resolve(process.cwd(), ".env.local");
let envVars = {};
try {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    envVars[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const TOKEN = envVars.SANITY_API_TOKEN;
if (!TOKEN) { console.error("SANITY_API_TOKEN missing"); process.exit(1); }

const sanity = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

function generateBase(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "unknown";
  const first = parts[0].toLowerCase().replace(/[^a-z]/g, "");
  const lastInitial = parts.length > 1
    ? (parts[parts.length - 1][0] || "").toLowerCase().replace(/[^a-z]/g, "")
    : "";
  return `${first}${lastInitial}` || "unknown";
}

// Reserved slugs — these are existing Next.js routes
const RESERVED = new Set([
  "admin", "cases", "case", "submit", "claim", "how-it-works",
  "sign-in", "terms", "privacy", "pricing", "removal-request",
  "api", "_next", "favicon.ico",
]);

async function run() {
  console.log("Generating vanity slugs for all cases...\n");

  // Get all cases without a vanity slug
  const cases = await sanity.fetch(
    `*[_type == "case" && !defined(vanitySlug)] { _id, name }`
  );

  console.log(`  ${cases.length} cases need vanity slugs\n`);
  if (cases.length === 0) {
    console.log("  All cases already have vanity slugs.\n");
    return;
  }

  // Also get all existing vanity slugs to avoid collisions
  const existing = await sanity.fetch(
    `*[_type == "case" && defined(vanitySlug)].vanitySlug`
  );
  const taken = new Set(existing);
  RESERVED.forEach(r => taken.add(r));

  let updated = 0;
  let errors = 0;

  // Process in batches of 100 for transaction efficiency
  const BATCH = 100;
  for (let i = 0; i < cases.length; i += BATCH) {
    const batch = cases.slice(i, i + BATCH);
    const tx = sanity.transaction();

    for (const c of batch) {
      const base = generateBase(c.name);
      let vanity = base;
      let counter = 2;

      // Find a unique slug
      while (taken.has(vanity)) {
        vanity = `${base}${counter}`;
        counter++;
      }

      taken.add(vanity);
      tx.patch(c._id, (p) => p.set({ vanitySlug: vanity }));
    }

    try {
      await tx.commit();
      updated += batch.length;
      process.stdout.write(`  Progress: ${updated}/${cases.length}\r`);
    } catch (err) {
      errors++;
      if (errors <= 3) console.log(`\n  Batch error: ${err.message}`);
    }
  }

  console.log(`\n\n========================================`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`========================================\n`);
  console.log("  Vanity URLs are now live. Example:");
  console.log("  raisethereward.com/nancyg\n");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
