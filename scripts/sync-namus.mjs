#!/usr/bin/env node
/**
 * Sync NamUs (National Missing and Unidentified Persons System) cases into Sanity.
 *
 * NamUs uses an internal search API at namus.nij.ojp.gov. The API is undocumented
 * but publicly accessible — same calls the search page makes.
 *
 * Run: node scripts/sync-namus.mjs
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

// ── NamUs API ──
// NamUs search API used by namus.nij.ojp.gov internally
const NAMUS_SEARCH = "https://namus.nij.ojp.gov/api/CaseSets/NamUs/MissingPersons/Results";
const PAGE_SIZE = 100;

async function fetchPage(skip) {
  // NamUs uses a POST body for search with projections
  const body = {
    take: PAGE_SIZE,
    skip,
    projections: [
      "npisMissingPerson",
    ],
    conditions: [],
  };

  const res = await fetch(NAMUS_SEARCH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "RaiseTheReward/1.0 (missing-persons-awareness-platform)",
      // NamUs may require these headers
      Origin: "https://namus.nij.ojp.gov",
      Referer: "https://namus.nij.ojp.gov/",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

async function sync() {
  console.log("Starting NamUs sync...\n");

  // Try the search API first
  let skip = 0;
  let total = 0;
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let pageNum = 1;
  let apiWorks = true;

  // Test first page
  process.stdout.write("  Testing NamUs API... ");
  try {
    const testData = await fetchPage(0);
    // Figure out the response shape
    if (testData.count !== undefined) {
      total = testData.count;
    } else if (testData.totalCount !== undefined) {
      total = testData.totalCount;
    } else if (Array.isArray(testData)) {
      total = testData.length;
    } else {
      console.log(`Unexpected response format. Keys: ${Object.keys(testData).join(", ")}`);
      // Try to extract what we can
      const snippet = JSON.stringify(testData).slice(0, 300);
      console.log(`  Snippet: ${snippet}`);
      apiWorks = false;
    }

    if (apiWorks) {
      console.log(`found ${total} cases\n`);
    }
  } catch (err) {
    console.log(`API error: ${err.message}`);
    apiWorks = false;
  }

  if (!apiWorks) {
    console.log("\n  NamUs internal API may require authentication or has changed.");
    console.log("  NamUs does not have a public API — their data is only accessible");
    console.log("  through their website at namus.nij.ojp.gov.");
    console.log("  Consider reaching out to NamUs/NIJ for data partnership.\n");
    return;
  }

  // Cap at a reasonable number
  const maxCases = Math.min(total, 15000);
  console.log(`  Will import up to ${maxCases} cases...\n`);

  while (skip < maxCases) {
    process.stdout.write(`  Page ${pageNum} (${skip}–${skip + PAGE_SIZE} of ${maxCases})... `);

    let data;
    try {
      data = await fetchPage(skip);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errors++;
      if (errors > 5) { console.log("  Too many errors, stopping."); break; }
      skip += PAGE_SIZE;
      pageNum++;
      continue;
    }

    const results = data.results ?? data.records ?? (Array.isArray(data) ? data : []);
    if (results.length === 0) {
      console.log("done (no more results)");
      break;
    }

    let pageImported = 0;

    for (const r of results) {
      // NamUs nests data under npisMissingPerson
      const mp = r.npisMissingPerson ?? r;

      const firstName = mp.firstName ?? mp.FirstName ?? r.firstName ?? "";
      const lastName = mp.lastName ?? mp.LastName ?? r.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim();
      if (!name) { skipped++; continue; }

      const namusId = mp.namusId ?? mp.NamusId ?? r.id ?? r.namusId ?? "";
      const idStr = String(namusId);
      const id = idStr ? `namus-${idStr}` : `namus-${slugify(name)}`;
      const slug = slugify(name);

      const state = mp.stateOfLastContact ?? mp.StateOfLastContact ?? r.stateOfLastContact ?? "";
      const city = mp.cityOfLastContact ?? mp.CityOfLastContact ?? r.cityOfLastContact ?? "";
      const county = mp.countyOfLastContact ?? "";
      const location = [city, county, state].filter(Boolean).join(", ") || "United States";

      const dateOfLastContact = mp.dateOfLastContact ?? mp.DateOfLastContact ?? r.dateOfLastContact ?? "";
      const currentAge = mp.computedMissingMaxAge ?? r.computedMissingMaxAge ?? "";
      const missingAge = mp.missingAge ?? "";
      const sex = mp.gender ?? mp.sex ?? "";
      const race = mp.raceEthnicity ?? mp.race ?? "";

      let summary = `${name} has been missing since ${dateOfLastContact || "unknown date"}.`;
      if (currentAge) summary += ` Estimated current age: ${currentAge}.`;
      else if (missingAge) summary += ` Age when missing: ${missingAge}.`;
      if (sex || race) summary += ` ${[sex, race].filter(Boolean).join(", ")}.`;
      summary += ` Last known location: ${location}.`;

      // NamUs image
      const imageUrl = namusId
        ? `https://namus.nij.ojp.gov/api/CaseSets/NamUs/MissingPersons/Cases/${namusId}/Images/Primary`
        : undefined;

      try {
        await sanity.createOrReplace({
          _id: id,
          _type: "case",
          name,
          slug,
          caseType: "Missing Person",
          category: "NamUs Missing Person",
          location,
          summary: summary.slice(0, 800),
          source: "NamUs",
          sourceUrl: `https://namus.nij.ojp.gov/case/MP${namusId}`,
          sourceId: idStr,
          leContact: "NamUs: namus.nij.ojp.gov or contact your local law enforcement",
          imageUrl,
          dateAdded: dateOfLastContact || new Date().toISOString().split("T")[0],
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

    console.log(`${pageImported} imported`);

    skip += PAGE_SIZE;
    pageNum++;
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);
}

sync().catch(err => { console.error("Fatal:", err); process.exit(1); });
