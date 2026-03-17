import { NextResponse } from "next/server";
import { upsertCase, nameToColor, getInitials } from "@/sanity/cases";

/**
 * POST /api/sync-fbi
 * Fetches all wanted persons from the FBI API and upserts them into Sanity.
 *
 * The FBI API returns ~20 items per page. We paginate through all pages.
 * Each person gets a deterministic Sanity _id based on their FBI UID so
 * re-syncing updates rather than duplicates.
 */

const FBI_API = "https://api.fbi.gov/wanted/v1/list";
const PAGE_SIZE = 20;

/** Map FBI "subjects" field to our caseType */
function mapCaseType(
  subjects: string[] | undefined
): "Missing Person" | "Unsolved Crime" | "Wanted Individual" {
  if (!subjects) return "Wanted Individual";
  const joined = subjects.join(" ").toLowerCase();
  if (joined.includes("missing")) return "Missing Person";
  if (joined.includes("seeking") || joined.includes("unsolved"))
    return "Unsolved Crime";
  return "Wanted Individual";
}

/** Extract the primary FBI category from subjects */
function extractCategory(subjects: string[] | undefined): string {
  if (!subjects || subjects.length === 0) return "Uncategorized";
  return subjects[0];
}

/** Build a slug from a name */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

interface FBIImage {
  original?: string;
  large?: string;
  thumb?: string;
}

interface FBIItem {
  uid: string;
  title: string;
  subjects?: string[];
  description?: string;
  caution?: string;
  details?: string;
  field_offices?: string[];
  locations?: string[];
  images?: FBIImage[];
  url?: string;
  modified?: string;
  publication?: string;
  reward_text?: string;
}

export async function POST() {
  try {
    let page = 1;
    let totalImported = 0;
    let totalPages = 1;
    const errors: string[] = [];
    let debug = "";

    // Paginate through the FBI API
    while (page <= totalPages && page <= 50) { // Cap at 50 pages for safety
      const url = `${FBI_API}?page=${page}&pageSize=${PAGE_SIZE}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        errors.push(`FBI API page ${page}: HTTP ${res.status}`);
        break;
      }

      const data = await res.json();

      // Debug: capture info about what the API returned on page 1
      if (page === 1) {
        const keys = Object.keys(data);
        const itemCount = Array.isArray(data.items) ? data.items.length : 0;
        const firstKeys = data.items?.[0] ? Object.keys(data.items[0]).slice(0, 8).join(",") : "none";
        debug = `keys=[${keys}] total=${data.total} items=${itemCount} firstItemFields=[${firstKeys}]`;
      }

      // Calculate total pages on first request
      if (page === 1 && data.total) {
        totalPages = Math.ceil(data.total / PAGE_SIZE);
      }

      const items: FBIItem[] = data.items ?? [];

      for (const item of items) {
        if (!item.title || !item.uid) continue;

        const name = item.title;
        const slug = slugify(name);
        const caseType = mapCaseType(item.subjects);
        const category = extractCategory(item.subjects);

        // Get best image URL
        let imageUrl: string | undefined;
        if (item.images && item.images.length > 0) {
          const img = item.images[0];
          imageUrl = img.large || img.original || img.thumb;
        }

        // Build summary from available text fields
        let summary = "";
        if (item.description) {
          // Strip HTML tags from FBI descriptions
          summary = item.description.replace(/<[^>]*>/g, "").slice(0, 500);
        } else if (item.caution) {
          summary = item.caution.replace(/<[^>]*>/g, "").slice(0, 500);
        } else if (item.details) {
          summary = item.details.replace(/<[^>]*>/g, "").slice(0, 500);
        }

        // Location from field offices
        const location =
          item.field_offices?.join(", ") ||
          item.locations?.join(", ") ||
          "United States";

        try {
          await upsertCase({
            _id: `fbi-${item.uid}`,
            name,
            slug,
            caseType,
            category,
            location,
            summary,
            source: "FBI",
            sourceUrl: item.url || `https://www.fbi.gov/wanted/topten/${slug}`,
            sourceId: item.uid,
            leContact:
              "Contact your local FBI field office or submit a tip at tips.fbi.gov",
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
          totalImported++;
        } catch (err) {
          errors.push(`Failed to upsert ${name}: ${String(err)}`);
        }
      }

      page++;
    }

    return NextResponse.json({
      success: true,
      imported: totalImported,
      totalPages,
      errors: errors.length > 0 ? errors : undefined,
      debug,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
