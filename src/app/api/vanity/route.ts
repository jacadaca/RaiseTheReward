import { NextRequest, NextResponse } from "next/server";
import { isVanityTaken, setVanitySlug } from "@/sanity/cases";
import { client } from "@/sanity/client";

// Reserved paths that can never be vanity slugs
const RESERVED = new Set([
  "admin", "cases", "case", "submit", "claim", "how-it-works",
  "sign-in", "terms", "privacy", "pricing", "removal-request",
  "api", "favicon.ico",
]);

// Naming convention: 3-30 chars, lowercase letters and numbers only
const VANITY_REGEX = /^[a-z][a-z0-9]{2,29}$/;

/**
 * GET /api/vanity?slug=nancyg
 * Check if a vanity slug is available.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.toLowerCase();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  if (!VANITY_REGEX.test(slug)) {
    return NextResponse.json({
      available: false,
      reason: "Must be 3-30 characters, lowercase letters and numbers only, starting with a letter.",
    });
  }

  if (RESERVED.has(slug)) {
    return NextResponse.json({
      available: false,
      reason: "This URL is reserved.",
    });
  }

  const taken = await isVanityTaken(slug);
  return NextResponse.json({ available: !taken });
}

/**
 * PATCH /api/vanity
 * Set or update a vanity slug for a case.
 * Body: { caseId: string, vanitySlug: string }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { caseId, vanitySlug: rawSlug } = await req.json();
    const vanitySlug = rawSlug?.toLowerCase();

    if (!caseId || !vanitySlug) {
      return NextResponse.json({ error: "Missing caseId or vanitySlug" }, { status: 400 });
    }

    if (!VANITY_REGEX.test(vanitySlug)) {
      return NextResponse.json({
        error: "Must be 3-30 characters, lowercase letters and numbers only, starting with a letter.",
      }, { status: 400 });
    }

    if (RESERVED.has(vanitySlug)) {
      return NextResponse.json({ error: "This URL is reserved." }, { status: 400 });
    }

    // Check if taken by a different case
    const existing = await client.fetch(
      `*[_type == "case" && vanitySlug == $vanitySlug && _id != $caseId][0]._id`,
      { vanitySlug, caseId }
    );

    if (existing) {
      return NextResponse.json({ error: "This vanity URL is already taken." }, { status: 409 });
    }

    await setVanitySlug(caseId, vanitySlug);
    return NextResponse.json({ success: true, vanitySlug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
