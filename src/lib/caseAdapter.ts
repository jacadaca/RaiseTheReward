/**
 * Adapter to normalize Sanity cases into the shape CaseCard expects.
 * This lets public pages work with Sanity data while keeping CaseCard
 * backwards-compatible with the old static data during migration.
 */
import type { SanityCase } from "@/sanity/cases";
import type { Case } from "@/lib/cases";

export function sanityCaseToDisplay(c: SanityCase): Case {
  return {
    id: c.slug,
    name: c.name,
    type: c.caseType as Case["type"],
    reward: c.rewardNum > 0 ? `$${c.rewardNum.toLocaleString()}` : "$0",
    rewardNum: c.rewardNum,
    donors: c.donors,
    loc: c.location,
    summary: c.summary,
    color: c.color,
    initials: c.initials,
    source: c.source as Case["source"],
    sourceUrl: c.sourceUrl,
    leContact: c.leContact,
    imageUrl: c.imageUrl,
    dateAdded: c.dateAdded,
  };
}
