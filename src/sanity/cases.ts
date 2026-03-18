/**
 * Sanity case queries and types.
 * The Sanity document type is "case" — schema is created automatically
 * when the first document is written via the sync API.
 */
import { client, writeClient } from "./client";

// ─── TYPES ──────────────────────────────────────────────────
export interface SanityCase {
  _id: string;
  _type: "case";
  name: string;
  slug: string;
  caseType: "Missing Person" | "Unsolved Crime" | "Wanted Individual";
  /** FBI sub-category (e.g. "White-Collar Crime", "Violent Crime") */
  category?: string;
  location: string;
  summary: string;
  source: "FBI" | "NCMEC" | "NamUs" | "Crime Stoppers" | "User Submitted";
  sourceUrl: string;
  sourceId?: string;
  leContact: string;
  imageUrl?: string;
  dateAdded: string;
  visible: boolean;
  featured: boolean;
  rewardNum: number;
  donors: number;
  /** Color for avatar placeholder */
  color: string;
  initials: string;
  /** When this record was last synced from the source */
  lastSynced?: string;
  /** Short vanity URL slug, e.g. "nancyg" → raisethereward.com/nancyg */
  vanitySlug?: string;
}

// ─── COLOR + INITIALS (same logic as before) ────────────────
const COLORS = [
  "#4A90D9", "#D94A4A", "#7B68A7", "#D4A24E", "#5BA55B",
  "#C06090", "#4AAAA0", "#8B6E4E", "#6B8ED6", "#CC7A3E",
  "#5C7C3E", "#9B59B6", "#2E86AB", "#A23B72", "#E8543E",
  "#3D8EB9", "#6C5B7B", "#C0A062", "#2D6A4F", "#B5495B",
];

export function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/** Generate a default vanity slug from a name: "Nancy Guthrie" → "nancyg" */
export function generateVanitySlug(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  const first = parts[0].toLowerCase().replace(/[^a-z]/g, "");
  const lastInitial = parts.length > 1
    ? parts[parts.length - 1][0]?.toLowerCase().replace(/[^a-z]/g, "") ?? ""
    : "";
  return `${first}${lastInitial}`;
}

// ─── QUERIES ────────────────────────────────────────────────
const CASE_FIELDS = `
  _id, name, slug, caseType, category, location, summary,
  source, sourceUrl, sourceId, leContact, imageUrl, dateAdded,
  visible, featured, rewardNum, donors, color, initials, lastSynced, vanitySlug
`;

/** All visible cases (for browse page) */
export async function getVisibleCases(): Promise<SanityCase[]> {
  return client.fetch(
    `*[_type == "case" && visible == true] | order(dateAdded desc) { ${CASE_FIELDS} }`
  );
}

/** Featured cases (for homepage) */
export async function getFeaturedCases(): Promise<SanityCase[]> {
  return client.fetch(
    `*[_type == "case" && visible == true && featured == true] | order(dateAdded desc) [0...8] { ${CASE_FIELDS} }`
  );
}

/** Single case by slug */
export async function getCaseBySlug(slug: string): Promise<SanityCase | null> {
  return client.fetch(
    `*[_type == "case" && slug == $slug][0] { ${CASE_FIELDS} }`,
    { slug }
  );
}

/** Single case by vanity slug */
export async function getCaseByVanity(vanitySlug: string): Promise<SanityCase | null> {
  return client.fetch(
    `*[_type == "case" && vanitySlug == $vanitySlug][0] { ${CASE_FIELDS} }`,
    { vanitySlug }
  );
}

/** Check if a vanity slug is already taken */
export async function isVanityTaken(vanitySlug: string): Promise<boolean> {
  const count = await client.fetch(
    `count(*[_type == "case" && vanitySlug == $vanitySlug])`,
    { vanitySlug }
  );
  return count > 0;
}

/** Set a vanity slug for a case */
export async function setVanitySlug(id: string, vanitySlug: string): Promise<void> {
  await writeClient.patch(id).set({ vanitySlug }).commit();
}

/** All cases (for admin — includes hidden ones) */
export async function getAllCases(): Promise<SanityCase[]> {
  return client.fetch(
    `*[_type == "case"] | order(dateAdded desc) { ${CASE_FIELDS} }`
  );
}

/** Count by source */
export async function getCaseCounts(): Promise<Record<string, number>> {
  const results = await client.fetch(`{
    "total": count(*[_type == "case"]),
    "visible": count(*[_type == "case" && visible == true]),
    "featured": count(*[_type == "case" && featured == true]),
    "fbi": count(*[_type == "case" && source == "FBI"]),
    "ncmec": count(*[_type == "case" && source == "NCMEC"]),
    "crimestoppers": count(*[_type == "case" && source == "Crime Stoppers"]),
    "user": count(*[_type == "case" && source == "User Submitted"])
  }`);
  return results;
}

// ─── MUTATIONS ──────────────────────────────────────────────
/** Upsert a case (create or update by sourceId) */
export async function upsertCase(c: Omit<SanityCase, "_type">): Promise<void> {
  await writeClient.createOrReplace({
    _type: "case" as const,
    ...c,
  });
}

/** Toggle a case field (visible or featured) */
export async function toggleCaseField(
  id: string,
  field: "visible" | "featured",
  value: boolean
): Promise<void> {
  await writeClient.patch(id).set({ [field]: value }).commit();
}

/** Bulk set visibility by category */
export async function bulkSetVisibility(
  category: string,
  visible: boolean
): Promise<number> {
  // Fetch matching IDs first
  const ids: string[] = await client.fetch(
    `*[_type == "case" && category == $category]._id`,
    { category }
  );
  if (ids.length === 0) return 0;

  const tx = writeClient.transaction();
  for (const id of ids) {
    tx.patch(id, (p) => p.set({ visible }));
  }
  await tx.commit();
  return ids.length;
}

/** Bulk set visibility by caseType */
export async function bulkSetVisibilityByType(
  caseType: string,
  visible: boolean
): Promise<number> {
  const ids: string[] = await client.fetch(
    `*[_type == "case" && caseType == $caseType]._id`,
    { caseType }
  );
  if (ids.length === 0) return 0;

  const tx = writeClient.transaction();
  for (const id of ids) {
    tx.patch(id, (p) => p.set({ visible }));
  }
  await tx.commit();
  return ids.length;
}

/** Get all unique categories */
export async function getCategories(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "case" && defined(category)].category)`
  );
}
