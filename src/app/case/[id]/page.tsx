"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";
import type { Case } from "@/lib/cases";

/** Map a Sanity case record to our Case shape */
function mapSanityCase(c: Record<string, unknown>): Case {
  return {
    id: (c.slug as string) ?? "",
    name: (c.name as string) ?? "",
    type: (c.caseType as Case["type"]) ?? "Wanted Individual",
    reward: (c.rewardNum as number) > 0 ? `$${(c.rewardNum as number).toLocaleString()}` : "$0",
    rewardNum: (c.rewardNum as number) ?? 0,
    donors: (c.donors as number) ?? 0,
    loc: (c.location as string) ?? "",
    summary: (c.summary as string) ?? "",
    color: (c.color as string) ?? "#999",
    initials: (c.initials as string) ?? "?",
    source: (c.source as Case["source"]) ?? "FBI",
    sourceUrl: (c.sourceUrl as string) ?? "",
    leContact: (c.leContact as string) ?? "",
    imageUrl: c.imageUrl as string | undefined,
    dateAdded: (c.dateAdded as string) ?? "",
    visible: true,
    featured: (c.featured as boolean) ?? false,
  };
}

export default function CaseHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Try static first, then try Sanity
  const staticCase = CASES.find((cs) => cs.id === id);
  const [c, setC] = useState<Case | null>(staticCase ?? null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (staticCase) return;
    // Not found in static data — try Sanity
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        if (data.cases) {
          const match = (data.cases as Record<string, unknown>[]).find(
            (sc) => sc.slug === id
          );
          if (match) setC(mapSanityCase(match));
        }
      })
      .catch(() => {});
  }, [id, staticCase]);

  if (!c) {
    return (
      <>
        <Nav />
        <div className="max-w-[960px] mx-auto px-8 py-20 text-center text-gray-400">
          Loading case...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="max-w-[960px] mx-auto px-8 py-6">
        {/* Back link */}
        <Link
          href="/cases"
          className="text-[13px] text-gray-400 hover:text-gray-600 mb-4 inline-block"
        >
          &larr; All cases
        </Link>

        {/* Title */}
        <h1 className="font-serif text-[clamp(24px,3.5vw,36px)] tracking-tight mb-4">
          {c.name}
        </h1>

        <div className="grid grid-cols-[1fr_320px] gap-8">
          {/* ── Left column: content ── */}
          <div>
            {/* Case photo placeholder */}
            <div
              className="w-full h-[340px] rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden"
              style={{ background: c.color }}
            >
              {c.imageUrl && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-white/20 text-[120px] font-serif font-bold">
                  {c.initials}
                </span>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">
                  {c.type}
                </span>
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">
                  Active
                </span>
              </div>
            </div>

            {/* Source attribution */}
            <div className="flex items-center gap-2 mb-4 text-[13px] text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Sourced from{" "}
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand)] hover:underline font-medium"
              >
                {c.source}
              </a>
              <span>&middot; Added {c.dateAdded}</span>
            </div>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 text-[13px] text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Board verified &middot; Donations protected
            </div>

            {/* Summary */}
            <div className="mb-6">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                {c.summary} All tips should be submitted directly to law enforcement. RaiseTheReward is not a tip intake platform and does not evaluate tips. The reward pool is held by RaiseTheReward and will only be disbursed upon verified case resolution with official documentation reviewed and approved by the RaiseTheReward board.
              </p>
            </div>

            {/* Inline Donate + Share buttons */}
            <div className="flex gap-3 mb-8 pb-8 border-b border-gray-100">
              <Link
                href={`/case/${c.id}/donate`}
                className="flex-1 text-center py-3 rounded-full text-[15px] font-semibold border-[1.5px] border-gray-200 text-black hover:bg-gray-50"
              >
                Donate
              </Link>
              <button className="flex-1 text-center py-3 rounded-full text-[15px] font-semibold border-[1.5px] border-gray-200 text-black hover:bg-gray-50">
                Share
              </button>
            </div>

            {/* Case details */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-3">Case details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Case type", v: c.type },
                  { l: "Status", v: "Active" },
                  { l: "Location", v: c.loc },
                  { l: "Source", v: c.source },
                  { l: "Donors", v: String(c.donors) },
                  { l: "Platform fee", v: "4%" },
                ].map((item) => (
                  <div key={item.l}>
                    <div className="text-[12px] text-gray-400">{item.l}</div>
                    <div className="text-[14px] font-medium">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout criteria */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-3">Reward payout criteria</h3>
              {[
                "Law enforcement confirms the case resolution",
                "Tipster identified and confirmed by law enforcement",
                "Claimant submits official documentation to RaiseTheReward",
                "Platform board reviews and approves disbursement",
              ].map((s, i) => (
                <div key={i} className="flex gap-2.5 mb-2 text-[14px] text-gray-600">
                  <span className="text-gray-400 font-medium">{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Tip directory — case-specific */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-2">Where to submit tips</h3>
              <p className="text-[14px] text-gray-500 mb-3">
                RaiseTheReward does not accept or handle tips. Contact law enforcement directly:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                <div className="text-[14px] font-medium text-black mb-1">
                  Case-specific contact
                </div>
                <div className="text-[14px] text-[var(--color-brand)]">
                  {c.leContact}
                </div>
              </div>
              {[
                { agency: "FBI Tip Line", contact: "tips.fbi.gov or 1-800-CALL-FBI" },
                { agency: "Crime Stoppers", contact: "1-800-222-TIPS" },
              ].map((a) => (
                <div
                  key={a.agency}
                  className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-[14px] font-medium">{a.agency}</span>
                  <span className="text-[14px] font-medium text-[var(--color-brand)]">
                    {a.contact}
                  </span>
                </div>
              ))}
            </div>

            {/* Words of support — empty state for new cases */}
            <div className="mb-8">
              <h3 className="text-[18px] font-semibold mb-1">
                Words of support
              </h3>
              {c.donors > 0 ? (
                <p className="text-[13px] text-gray-400 mb-4">
                  Donate to share words of support.
                </p>
              ) : (
                <p className="text-[14px] text-gray-400 mt-2">
                  No donations yet. Be the first to contribute to this reward pool.
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-[13px] text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Disclaimer:</strong> This case was sourced from
              public law enforcement databases ({c.source}). Raise The Reward is not affiliated
              with the investigating agency. All case information is sourced from public records.
              Tips should be submitted directly to law enforcement &mdash; RTR does not collect,
              relay, or evaluate tips. If you are associated with this case and wish to have it
              removed, please{" "}
              <Link href={`/removal-request?case=${c.id}`} className="text-[var(--color-brand)] hover:underline">
                submit a removal request
              </Link>.
            </div>

            {/* Claim footer */}
            <div className="border-t border-gray-100 py-5 text-center">
              <Link
                href="/claim"
                className="text-[13px] text-gray-400 hover:text-gray-600 hover:underline"
              >
                Are you the qualifying tipster? Submit a claim &rarr;
              </Link>
            </div>
          </div>

          {/* ── Right column: sticky sidebar ── */}
          <div>
            <div className="sticky top-[76px]">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                {/* Amount raised */}
                <div className="mb-4">
                  <div className="text-[22px] font-bold text-black">
                    {c.rewardNum === 0 ? "No donations yet" : `${c.reward} raised`}
                  </div>
                  {c.donors > 0 && (
                    <div className="text-[13px] text-gray-400">
                      {c.donors} donations
                    </div>
                  )}
                </div>

                {/* Donate button */}
                <Link
                  href={`/case/${c.id}/donate`}
                  className="flex items-center justify-center w-full py-3 rounded-full bg-[var(--color-brand)] text-white text-[15px] font-semibold mb-2"
                >
                  {c.donors === 0 ? "Be the first to donate" : "Donate now"}
                </Link>

                {/* Share button */}
                <button className="flex items-center justify-center w-full py-3 rounded-full bg-black text-white text-[15px] font-semibold mb-4">
                  Share
                </button>

                {/* Source info */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="text-[12px] text-gray-400 mb-1">Sourced from</div>
                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-[var(--color-brand)] hover:underline"
                  >
                    {c.source} &rarr;
                  </a>
                </div>

                {/* LE Contact */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-[12px] text-gray-400 mb-1">Have a tip?</div>
                  <div className="text-[13px] text-gray-600 leading-relaxed">
                    {c.leContact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
