#!/usr/bin/env node
/**
 * Sync NCMEC (National Center for Missing & Exploited Children) cases into Sanity.
 *
 * Uses the public search JSON endpoint that powers missingkids.org/search.
 * This is the same data the public website displays.
 *
 * Run: node scripts/sync-ncmec.mjs
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
    envVars[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
} catch {
  console.error("Could not read .env.local — make sure you're in the project root.");
  process.exit(1);
}

const TOKEN = envVars.SANITY_API_TOKEN;
if (!TOKEN) { console.error("SANITY_API_TOKEN missing from .env.local"); process.exit(1); }

const sanity = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

// ── Helpers ──
const COLORS = [
  "#4A90D9", "#D94A4A", "#7B68A7", "#D4A24E", "#5BA55B",
  "#C06090", "#4AAAA0", "#8B6E4E", "#6B8ED6", "#CC7A3E",
];

function nameToColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name) {
  return name.split(" ").filter(w => w.length > 0 && w[0] === w[0].toUpperCase()).slice(0, 2).map(w => w[0]).join("");
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

// ── NCMEC Search API ──
// The missingkids.org search page makes POST requests to this endpoint
const NCMEC_SEARCH = "https://api.missingkids.org/missingkids/servlet/JSONDataServlet";
const PAGE_SIZE = 50;

async function fetchPage(page) {
  const params = new URLSearchParams({
    action: "publicSearch",
    search: "new",
    subjToSearch: "child",
    missState: "US",
    missCountry: "US",
    LanguageId: "en_US",
    goToPage: String(page),
    pageSize: String(PAGE_SIZE),
  });

  const res = await fetch(`${NCMEC_SEARCH}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "RaiseTheReward/1.0 (missing-persons-awareness-platform)",
    },
  });

  if (!res.ok) {
    throw new Error(`NCMEC API HTTP ${res.status}`);
  }

  return res.json();
}

async function sync() {
  console.log("Starting NCMEC sync...\n");

  let page = 1;
  let totalPages = 1;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  while (page <= totalPages && page <= 200) {
    process.stdout.write(`  Page ${page}/${totalPages}... `);

    let data;
    try {
      data = await fetchPage(page);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errors++;
      break;
    }

    // First page: get total
    if (page === 1) {
      const total = data.totalRecords ?? data.totalChildren ?? 0;
      totalPages = Math.ceil(total / PAGE_SIZE);
      console.log(`(${total} total cases, ${totalPages} pages)`);
      if (total === 0) {
        console.log("  No results returned. NCMEC may have changed their API.");
        break;
      }
    }

    const children = data.persons ?? data.children ?? [];
    if (children.length === 0) {
      console.log("no items");
      break;
    }

    let pageImported = 0;

    for (const child of children) {
      const firstName = child.firstName ?? "";
      const lastName = child.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim();
      if (!name) { skipped++; continue; }

      const caseNum = child.caseNumber ?? child.orgCaseNum ?? "";
      const ncmcNum = child.ncmcNumber ?? child.caseNum ?? caseNum;
      const id = ncmcNum ? `ncmec-${ncmcNum}` : `ncmec-${slugify(name)}`;
      const slug = slugify(name);

      // Image URL
      let imageUrl;
      if (child.thumbnailUrl) {
        imageUrl = child.thumbnailUrl.startsWith("http")
          ? child.thumbnailUrl
          : `https://api.missingkids.org${child.thumbnailUrl}`;
      } else if (child.hasPoster && ncmcNum) {
        imageUrl = `https://api.missingkids.org/poster/NCMC/${ncmcNum}/1/screen`;
      }

      const state = child.missingState ?? child.missState ?? "";
      const city = child.missingCity ?? child.missCity ?? "";
      const location = [city, state].filter(Boolean).join(", ") || "United States";

      const missingDate = child.missingDate ?? "";
      const age = child.approxAge ?? child.age ?? "";
      const summary = `${name} has been missing since ${missingDate || "unknown date"}. ${age ? `Approximate age now: ${age}.` : ""} Last seen in ${location}.`;

      try {
        await sanity.createOrReplace({
          _id: id,
          _type: "case",
          name,
          slug,
          caseType: "Missing Person",
          category: "Missing Child",
          location,
          summary,
          source: "NCMEC",
          sourceUrl: `https://www.missingkids.org/poster/NCMC/${ncmcNum}`,
          sourceId: ncmcNum,
          leContact: "NCMEC: 1-800-THE-LOST (1-800-843-5678) or missingkids.org",
          imageUrl,
          dateAdded: missingDate || new Date().toISOString().split("T")[0],
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
        if (errors <= 3) console.log(`\n    Error on "${name}": ${err.message}`);
      }
    }

    if (page > 1 || !data.totalRecords) console.log(`${pageImported} imported`);
    page++;
    await new Promise(r => setTimeout(r, 500)); // Be respectful
  }

  console.log(`\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);
}

sync().catch(err => { console.error("Fatal:", err); process.exit(1); });
