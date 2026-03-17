#!/usr/bin/env node
/**
 * Sync FBI Wanted cases into Sanity.
 *
 * Run from your local machine (not Vercel — FBI blocks cloud IPs):
 *   node scripts/sync-fbi.mjs
 *
 * Requires: SANITY_API_TOKEN in .env.local
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load env from .env.local ──
const envPath = resolve(process.cwd(), ".env.local");
let envVars = {};
try {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    envVars[key] = val;
  }
} catch {
  console.error("Could not read .env.local — make sure you're in the project root.");
  process.exit(1);
}

const PROJECT_ID = envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = envVars.NEXT_PUBLIC_SANITY_DATASET;
const TOKEN = envVars.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error("SANITY_API_TOKEN is missing from .env.local");
  process.exit(1);
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

// ── Helpers ──
const COLORS = [
  "#4A90D9", "#D94A4A", "#7B68A7", "#D4A24E", "#5BA55B",
  "#C06090", "#4AAAA0", "#8B6E4E", "#6B8ED6", "#CC7A3E",
  "#5C7C3E", "#9B59B6", "#2E86AB", "#A23B72", "#E8543E",
];

function nameToColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name) {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function mapCaseType(subjects) {
  if (!subjects) return "Wanted Individual";
  const joined = subjects.join(" ").toLowerCase();
  if (joined.includes("missing")) return "Missing Person";
  if (joined.includes("seeking") || joined.includes("unsolved")) return "Unsolved Crime";
  return "Wanted Individual";
}

function extractCategory(subjects) {
  if (!subjects || subjects.length === 0) return "Uncategorized";
  return subjects[0];
}

// ── Main sync ──
const FBI_API = "https://api.fbi.gov/wanted/v1/list";
const PAGE_SIZE = 20;

async function sync() {
  console.log("Starting FBI sync...\n");

  let page = 1;
  let totalPages = 1;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  while (page <= totalPages && page <= 100) {
    const url = `${FBI_API}?page=${page}&pageSize=${PAGE_SIZE}`;
    process.stdout.write(`  Page ${page}/${totalPages}... `);

    let res;
    try {
      res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "RaiseTheReward/1.0 (case-awareness-platform)",
        },
      });
    } catch (err) {
      console.log(`FETCH ERROR: ${err.message}`);
      errors++;
      break;
    }

    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      errors++;
      break;
    }

    const data = await res.json();

    if (page === 1) {
      if (data.total) {
        totalPages = Math.ceil(data.total / PAGE_SIZE);
        console.log(`(${data.total} total cases, ${totalPages} pages)`);
      } else {
        console.log("(no total count returned)");
      }
    }

    const items = data.items ?? [];
    if (items.length === 0) {
      console.log("no items");
      break;
    }

    let pageImported = 0;

    for (const item of items) {
      if (!item.title || !item.uid) {
        skipped++;
        continue;
      }

      const name = item.title;
      const slug = slugify(name);

      let imageUrl;
      if (item.images && item.images.length > 0) {
        const img = item.images[0];
        imageUrl = img.large || img.original || img.thumb;
      }

      let summary = "";
      if (item.description) {
        summary = item.description.replace(/<[^>]*>/g, "").slice(0, 500);
      } else if (item.caution) {
        summary = item.caution.replace(/<[^>]*>/g, "").slice(0, 500);
      } else if (item.details) {
        summary = item.details.replace(/<[^>]*>/g, "").slice(0, 500);
      }

      const location =
        item.field_offices?.join(", ") ||
        item.locations?.join(", ") ||
        "United States";

      try {
        await sanity.createOrReplace({
          _id: `fbi-${item.uid}`,
          _type: "case",
          name,
          slug,
          caseType: mapCaseType(item.subjects),
          category: extractCategory(item.subjects),
          location,
          summary,
          source: "FBI",
          sourceUrl: item.url || `https://www.fbi.gov/wanted/${slug}`,
          sourceId: item.uid,
          leContact: "Contact your local FBI field office or submit a tip at tips.fbi.gov",
          imageUrl,
          dateAdded: item.publication || new Date().toISOString().split("T")[0],
          visible: true,
          featured: false,
          rewardNum: 0,
          donors: 0,
          color: nameToColor(name),
          initials: getInitials(name),
          lastSynced: new Date().toISOString(),
        });
        imported++;
        pageImported++;
      } catch (err) {
        errors++;
        if (errors <= 3) {
          console.log(`\n    Error on "${name}": ${err.message}`);
        }
      }
    }

    if (page > 1 || !data.total) {
      console.log(`${pageImported} imported`);
    }

    page++;

    // Small delay to be respectful to the FBI API
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);

  if (imported > 0) {
    console.log("Cases are now in Sanity. Go to /admin to manage visibility and featured status.");
  }
}

sync().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
