#!/usr/bin/env node
/**
 * Sync NCMEC (National Center for Missing & Exploited Children) cases into Sanity.
 *
 * Pulls from the NCMEC RSS feeds (national + per-state) which contain
 * name, description, image, and case link for each missing child.
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

function generateVanity(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "unknown";
  const first = parts[0].toLowerCase().replace(/[^a-z]/g, "");
  const lastInitial = parts.length > 1
    ? (parts[parts.length - 1][0] || "").toLowerCase().replace(/[^a-z]/g, "")
    : "";
  return `${first}${lastInitial}` || "unknown";
}

const usedVanity = new Set();

async function loadExistingVanity() {
  try {
    const existing = await sanity.fetch(`*[_type == "case" && defined(vanitySlug)].vanitySlug`);
    existing.forEach(v => usedVanity.add(v));
  } catch { /* ok */ }
}

function uniqueVanity(name) {
  const base = generateVanity(name);
  let vanity = base;
  let counter = 2;
  while (usedVanity.has(vanity)) { vanity = `${base}${counter}`; counter++; }
  usedVanity.add(vanity);
  return vanity;
}

async function smartUpsert(id, sourceData, name) {
  const exists = await sanity.fetch(`count(*[_id == $id])`, { id });
  if (exists > 0) {
    await sanity.patch(id).set({
      name: sourceData.name, slug: sourceData.slug,
      caseType: sourceData.caseType, category: sourceData.category,
      location: sourceData.location, summary: sourceData.summary,
      sourceUrl: sourceData.sourceUrl, leContact: sourceData.leContact,
      imageUrl: sourceData.imageUrl, color: sourceData.color,
      initials: sourceData.initials, lastSynced: new Date().toISOString(),
    }).commit();
  } else {
    await sanity.create({
      _id: id, _type: "case", ...sourceData,
      visible: true, featured: false, rewardNum: 0, donors: 0,
      vanitySlug: uniqueVanity(name), lastSynced: new Date().toISOString(),
    });
  }
}

// ── RSS XML Parsing ──
// Extract <item> blocks from the RSS XML and parse their fields
function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const block = itemMatch[1];

    const getTag = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].trim() : "";
    };

    const title = getTag("title");
    const link = getTag("link");
    const description = getTag("description");
    const guid = getTag("guid");

    // Image from <enclosure url="..."/>
    const enclosureMatch = block.match(/enclosure[^>]*url="([^"]+)"/);
    const imageUrl = enclosureMatch ? enclosureMatch[1] : "";

    // Extract case number from guid like "NCMC/2080073/1"
    const guidMatch = guid.match(/NCMC\/(\d+)/);
    const caseNum = guidMatch ? guidMatch[1] : "";

    // Extract name from title like ": Shaniah Isom (MS)"
    const nameMatch = title.match(/:\s*(.+?)(?:\s*\([A-Z]{2}\))?$/);
    const name = nameMatch ? nameMatch[1].trim() : title.replace(/^:\s*/, "").trim();

    // Parse description for details
    // Format: "Name, Age Now: 11, Missing: 03/07/2026. Missing From City, ST. ANYONE HAVING..."
    const ageMatch = description.match(/Age Now:\s*(\d+)/);
    const age = ageMatch ? ageMatch[1] : "";

    const missingDateMatch = description.match(/Missing:\s*([\d\/]+)/);
    const missingDate = missingDateMatch ? missingDateMatch[1] : "";

    const locationMatch = description.match(/Missing From\s+([^.]+)\./);
    const location = locationMatch ? locationMatch[1].trim() : "";

    const contactMatch = description.match(/CONTACT:\s*(.+?)(?:\.|$)/);
    const contact = contactMatch ? contactMatch[1].trim() : "NCMEC: 1-800-THE-LOST";

    items.push({
      caseNum,
      name,
      age,
      missingDate,
      location,
      contact,
      imageUrl: imageUrl.replace("http://", "https://"),
      link: link.replace("http://", "https://"),
      description,
    });
  }

  return items;
}

// ── Feeds ──
const RSS_BASE = "https://api.missingkids.org/missingkids/servlet/XmlServlet?act=rss&LanguageCountry=en_US&orgPrefix=NCMC";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","PR",
];

async function sync() {
  console.log("Starting NCMEC sync...\n");
  await loadExistingVanity();

  // Step 1: Collect all items from RSS feeds
  console.log("  Step 1: Fetching RSS feeds (national + 52 states/territories)...\n");
  const allItems = new Map(); // keyed by caseNum+name to deduplicate

  // National feed
  try {
    const res = await fetch(RSS_BASE, {
      headers: { "User-Agent": "RaiseTheReward/1.0 (missing-persons-awareness)" },
    });
    if (res.ok) {
      const xml = await res.text();
      const items = parseRSSItems(xml);
      for (const item of items) {
        const key = item.caseNum || item.name;
        if (!allItems.has(key)) allItems.set(key, item);
      }
      console.log(`    National: ${items.length} cases`);
    } else {
      console.log(`    National: HTTP ${res.status}`);
    }
  } catch (err) {
    console.log(`    National: ${err.message}`);
  }

  // Per-state feeds
  let statesProcessed = 0;
  for (const state of US_STATES) {
    try {
      const res = await fetch(`${RSS_BASE}&state=${state}`, {
        headers: { "User-Agent": "RaiseTheReward/1.0" },
      });
      if (res.ok) {
        const xml = await res.text();
        const items = parseRSSItems(xml);
        for (const item of items) {
          const key = item.caseNum || item.name;
          if (!allItems.has(key)) allItems.set(key, item);
        }
      }
    } catch { /* skip */ }

    statesProcessed++;
    if (statesProcessed % 10 === 0) {
      process.stdout.write(`    States: ${statesProcessed}/${US_STATES.length} (${allItems.size} unique cases)\r`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n    Total unique cases found: ${allItems.size}\n`);

  if (allItems.size === 0) {
    console.log("  No cases found. NCMEC RSS may have changed format.\n");
    return;
  }

  // Step 2: Upsert into Sanity
  console.log("  Step 2: Importing into Sanity...\n");
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const itemArray = [...allItems.values()];

  for (let i = 0; i < itemArray.length; i++) {
    const item = itemArray[i];
    if (!item.name) { skipped++; continue; }

    const id = item.caseNum ? `ncmec-${item.caseNum}` : `ncmec-${slugify(item.name)}`;
    const slug = slugify(item.name);

    let summary = `${item.name} has been missing since ${item.missingDate || "unknown date"}.`;
    if (item.age) summary += ` Current age: ${item.age}.`;
    if (item.location) summary += ` Last seen in ${item.location}.`;

    try {
      await smartUpsert(id, {
        name: item.name,
        slug,
        caseType: "Missing Person",
        category: "Missing Child",
        location: item.location || "United States",
        summary,
        source: "NCMEC",
        sourceUrl: item.link || `https://www.missingkids.org/poster/NCMC/${item.caseNum}`,
        sourceId: item.caseNum,
        leContact: item.contact || "NCMEC: 1-800-THE-LOST (1-800-843-5678)",
        imageUrl: item.imageUrl || undefined,
        dateAdded: item.missingDate || new Date().toISOString().split("T")[0],
        color: nameToColor(item.name),
        initials: getInitials(item.name),
      }, item.name);
      imported++;
    } catch (err) {
      errors++;
      if (errors <= 3) console.log(`    Error on "${item.name}": ${err.message}`);
    }

    if ((i + 1) % 10 === 0) {
      process.stdout.write(`    Progress: ${i + 1}/${itemArray.length} (${imported} imported)\r`);
    }
  }

  console.log(`\n\n========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`========================================\n`);

  if (imported > 0) {
    console.log("  Go to /admin to manage visibility and featured status.\n");
  }
}

sync().catch(err => { console.error("Fatal:", err); process.exit(1); });
