#!/usr/bin/env node
/**
 * Sync NamUs (National Missing and Unidentified Persons System) cases into Sanity.
 *
 * NamUs is a DOJ database. Their public search makes internal API calls
 * that return JSON. We replicate those calls.
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

// ── NamUs Search API ──
// The NamUs site uses an internal API for search results
const NAMUS_API = "https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Results";
const PAGE_SIZE = 100;

async function fetchPage(skip) {
  const body = {
    take: PAGE_SIZE,
    skip,
    projections: [
      "npisTattoosScarsBirthmarks",
      "npisDmp",
      "npisMissingPerson",
      "npisImage",
    ],
    conditions: [],
    orderSpecifications: [
      { fieldPath: "npisMissingPerson.DateOfLastContact", direction: "Descending" }
    ],
  };

  const res = await fetch(NAMUS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "RaiseTheReward/1.0 (missing-persons-awareness-platform)",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`NamUs API HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

async function sync() {
  console.log("Starting NamUs sync...\n");

  let skip = 0;
  let total = 0;
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let pageNum = 1;

  while (true) {
    process.stdout.write(`  Page ${pageNum}... `);

    let data;
    try {
      data = await fetchPage(skip);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      // If NamUs API doesn't work, try the alternative endpoint
      if (pageNum === 1) {
        console.log("\n  NamUs internal API may have changed. Trying public search...");
        try {
          data = await tryPublicSearch();
        } catch (err2) {
          console.log(`  Public search also failed: ${err2.message}`);
          console.log("  NamUs sync cannot proceed — their API may require authentication.");
          break;
        }
      } else {
        errors++;
        break;
      }
    }

    if (!data) break;

    // Handle response format
    const results = data.results ?? data.records ?? data;
    if (!Array.isArray(results) || results.length === 0) {
      if (pageNum === 1) {
        console.log("No results returned. NamUs may have changed their API format.");
        console.log(`  Response keys: ${Object.keys(data).join(", ")}`);
      } else {
        console.log("done (no more results)");
      }
      break;
    }

    if (pageNum === 1) {
      total = data.count ?? data.totalCount ?? data.total ?? results.length;
      console.log(`(${total} total cases)`);
    }

    let pageImported = 0;

    for (const r of results) {
      // NamUs response structure varies — try common field paths
      const firstName = r.firstName ?? r.npisMissingPerson?.FirstName ?? "";
      const lastName = r.lastName ?? r.npisMissingPerson?.LastName ?? "";
      const name = `${firstName} ${lastName}`.trim();
      if (!name || name === "null null") { skipped++; continue; }

      const caseId = r.id ?? r.npisMissingPerson?.NamusId ?? r.caseNumber ?? "";
      const id = caseId ? `namus-${caseId}` : `namus-${slugify(name)}`;
      const slug = slugify(name);

      const state = r.stateOfLastContact ?? r.npisMissingPerson?.StateOfLastContact ?? "";
      const city = r.cityOfLastContact ?? r.npisMissingPerson?.CityOfLastContact ?? "";
      const location = [city, state].filter(Boolean).join(", ") || "United States";

      const dateOfLastContact = r.dateOfLastContact ?? r.npisMissingPerson?.DateOfLastContact ?? "";
      const age = r.computedMissingMaxAge ?? r.currentAge ?? "";

      const summary = `${name} has been missing since ${dateOfLastContact || "unknown date"}. ${age ? `Current estimated age: ${age}.` : ""} Last known location: ${location}.`;

      // Image
      let imageUrl;
      const imageData = r.npisImage ?? r.image;
      if (imageData?.url) {
        imageUrl = imageData.url.startsWith("http") ? imageData.url : `https://www.namus.gov${imageData.url}`;
      } else if (caseId) {
        imageUrl = `https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Cases/${caseId}/Images/Primary`;
      }

      try {
        await sanity.createOrReplace({
          _id: id,
          _type: "case",
          name,
          slug,
          caseType: "Missing Person",
          category: "NamUs Missing Person",
          location,
          summary,
          source: "NamUs",
          sourceUrl: `https://namus.nij.ojp.gov/case/MP${caseId}`,
          sourceId: String(caseId),
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

    // Safety cap
    if (skip >= 20000) {
      console.log("  Reached 20,000 case cap.");
      break;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);
}

/** Fallback: try NamUs public search page API */
async function tryPublicSearch() {
  const res = await fetch("https://namus.nij.ojp.gov/api/CaseSets/NamUs/MissingPersons/Search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "RaiseTheReward/1.0",
    },
    body: JSON.stringify({ take: PAGE_SIZE, skip: 0 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

sync().catch(err => { console.error("Fatal:", err); process.exit(1); });
