import { NextRequest, NextResponse } from "next/server";
import {
  getAllCases,
  getCaseCounts,
  getCategories,
  toggleCaseField,
  bulkSetVisibility,
  bulkSetVisibilityByType,
} from "@/sanity/cases";

/**
 * GET /api/cases
 * Returns all cases (including hidden) for the admin panel.
 */
export async function GET() {
  try {
    const [cases, counts, categories] = await Promise.all([
      getAllCases(),
      getCaseCounts(),
      getCategories(),
    ]);
    return NextResponse.json({ cases, counts, categories });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cases
 * Toggle a single case field, or bulk-update by category/type.
 *
 * Body shapes:
 *   { action: "toggle", id: string, field: "visible"|"featured", value: boolean }
 *   { action: "bulkCategory", category: string, visible: boolean }
 *   { action: "bulkType", caseType: string, visible: boolean }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "toggle") {
      await toggleCaseField(body.id, body.field, body.value);
      return NextResponse.json({ success: true });
    }

    if (body.action === "bulkCategory") {
      const count = await bulkSetVisibility(body.category, body.visible);
      return NextResponse.json({ success: true, affected: count });
    }

    if (body.action === "bulkType") {
      const count = await bulkSetVisibilityByType(body.caseType, body.visible);
      return NextResponse.json({ success: true, affected: count });
    }

    return NextResponse.json(
      { error: "Unknown action" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
