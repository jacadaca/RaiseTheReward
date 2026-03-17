#!/usr/bin/env node
/**
 * Sync NCMEC (National Center for Missing & Exploited Children) cases into Sanity.
 *
 * Strategy:
 *   1. Fetch the RSS feed to get case numbers (one feed per US state)
 *   2. For each case number, fetch full details via the JSON detail endpoint
 *   3. Upsert into Sanity
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

// ── NCMEC Endpoints ──
const RSS_URL = "https://api.missingkids.org/missingkids/servlet/XmlServlet?act=rss&LanguageCountry=en_US&orgPrefix=NCMC";
const DETAIL_URL = "https://api.missingkids.org/missingkids/servlet/JSONDataServlet";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","PR",
];

/** Extract case numbers from RSS XML */
function extractCaseNumbers(xml) {
  const caseNums = new Set();
  // Match caseNum= in URLs within the RSS
  const urlPattern = /caseNum=(\d+)/g;
  let match;
  while ((match = urlPattern.exec(xml)) !== null) {
    caseNums.add(match[1]);
  }
  // Also try matching <link> tags that contain case info
  const linkPattern = /case\/(\d+)/g;
  while ((match = linkPattern.exec(xml)) !== null) {
    caseNums.add(match[1]);
  }
  return [...caseNums];
}

/** Fetch case detail by case number */
async function fetchCaseDetail(caseNum) {
  const params = new URLSearchParams({
    action: "childDetail",
    orgPrefix: "NCMC",
    caseNum,
    seqNum: "1",
    caseLang: "en_US",
    searchLang: "en_US",
    LanguageId: "en_US",
  });

  const res = await fetch(`${DETAIL_URL}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "RaiseTheReward/1.0 (missing-persons-awareness-platform)",
    },
  });

  if (!res.ok) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function sync() {
  console.log("Starting NCMEC sync...\n");

  // Step 1: Collect case numbers from RSS feeds (national + per-state)
  console.log("  Step 1: Collecting case numbers from RSS feeds...");
  const allCaseNums = new Set();

  // National feed first
  try {
    const res = await fetch(RSS_URL, {
      headers: { "User-Agent": "RaiseTheReward/1.0" },
    });
    if (res.ok) {
      const xml = await res.text();
      const nums = extractCaseNumbers(xml);
      nums.forEach(n => allCaseNums.add(n));
      console.log(`    National feed: ${nums.length} cases`);
    }
  } catch (err) {
    console.log(`    National feed error: ${err.message}`);
  }

  // Per-state feeds
  let statesProcessed = 0;
  for (const state of US_STATES) {
    try {
      const url = `${RSS_URL}&state=${state}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "RaiseTheReward/1.0" },
      });
      if (res.ok) {
        const xml = await res.text();
        const nums = extractCaseNumbers(xml);
        nums.forEach(n => allCaseNums.add(n));
      }
      statesProcessed++;
      if (statesProcessed % 10 === 0) {
        process.stdout.write(`    States: ${statesProcessed}/${US_STATES.length} (${allCaseNums.size} unique cases so far)\r`);
      }
    } catch { /* skip failed states */ }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n    Total unique case numbers found: ${allCaseNums.size}\n`);

  if (allCaseNums.size === 0) {
    console.log("  No case numbers found. NCMEC RSS may have changed format.");
    console.log("  Try visiting this URL in your browser to check:");
    console.log(`  ${RSS_URL}\n`);
    return;
  }

  // Step 2: Fetch details for each case and upsert into Sanity
  console.log("  Step 2: Fetching case details and importing...\n");
  const caseNumArray = [...allCaseNums];
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < caseNumArray.length; i++) {
    const caseNum = caseNumArray[i];

    if (i % 25 === 0) {
      process.stdout.write(`    Progress: ${i}/${caseNumArray.length} (${imported} imported)\r`);
    }

    const detail = await fetchCaseDetail(caseNum);
    if (!detail) { skipped++; continue; }

    // NCMEC detail response can have varying structures
    const child = detail.childBean ?? detail.child ?? detail;
    const firstName = child.firstName ?? child.orgContactFirst ?? "";
    const lastName = child.lastName ?? child.orgContactLast ?? "";
    const name = `${firstName} ${lastName}`.trim();
    if (!name) { skipped++; continue; }

    const ncmcNumber = child.caseNumber ?? child.orgCaseNum ?? caseNum;
    const id = `ncmec-${ncmcNumber}`;
    const slug = slugify(name);

    // Image
    let imageUrl;
    if (child.imgLrg) {
      imageUrl = child.imgLrg.startsWith("http") ? child.imgLrg : `https://api.missingkids.org${child.imgLrg}`;
    } else if (child.imgMed) {
      imageUrl = child.imgMed.startsWith("http") ? child.imgMed : `https://api.missingkids.org${child.imgMed}`;
    } else {
      imageUrl = `https://api.missingkids.org/poster/NCMC/${ncmcNumber}/1/screen`;
    }

    const state = child.missingState ?? child.missState ?? "";
    const city = child.missingCity ?? child.missCity ?? "";
    const location = [city, state].filter(Boolean).join(", ") || "United States";

    const missingDate = child.missingDate ?? child.dateMissing ?? "";
    const age = child.approxAge ?? child.age ?? "";
    const race = child.race ?? "";
    const sex = child.sex ?? "";

    let summary = `${name} has been missing since ${missingDate || "unknown date"}.`;
    if (age) summary += ` Approximate current age: ${age}.`;
    if (sex || race) summary += ` ${[sex, race].filter(Boolean).join(", ")}.`;
    summary += ` Last seen in ${location}.`;
    if (child.circumstance) {
      summary += " " + child.circumstance.replace(/<[^>]*>/g, "").slice(0, 300);
    }

    try {
      await sanity.createOrReplace({
        _id: id,
        _type: "case",
        name,
        slug,
        caseType: "Missing Person",
        category: "Missing Child",
        location,
        summary: summary.slice(0, 800),
        source: "NCMEC",
        sourceUrl: `https://www.missingkids.org/poster/NCMC/${ncmcNumber}`,
        sourceId: String(ncmcNumber),
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
    } catch (err) {
      errors++;
      if (errors <= 3) console.log(`\n    Error on "${name}": ${err.message}`);
    }

    // Respectful delay
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);
}

sync().catch(err => { console.error("Fatal:", err); process.exit(1); });
