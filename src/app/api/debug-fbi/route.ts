import { NextResponse } from "next/server";

/**
 * GET /api/debug-fbi
 * Fetches one page from the FBI API and returns the raw response
 * so we can see what fields/structure it uses.
 */
export async function GET() {
  try {
    const url = "https://api.fbi.gov/wanted/v1/list?page=1&pageSize=3";
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    const status = res.status;
    const text = await res.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      httpStatus: status,
      responseKeys: parsed ? Object.keys(parsed) : null,
      total: parsed?.total,
      itemCount: parsed?.items?.length ?? 0,
      firstItemKeys: parsed?.items?.[0] ? Object.keys(parsed.items[0]) : null,
      firstItemTitle: parsed?.items?.[0]?.title,
      firstItemUid: parsed?.items?.[0]?.uid,
      rawSnippet: text.slice(0, 500),
    });
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      message: "Failed to reach FBI API",
    });
  }
}
