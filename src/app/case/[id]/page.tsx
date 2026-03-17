"use client";

import { useState, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";

export default function CaseHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = CASES.find((cs) => cs.id === id) ?? CASES[0];
  const [showFullSummary, setShowFullSummary] = useState(false);

  const recentDonors = [
    { name: "Anonymous", amt: "$500", time: "1 hour ago" },
    { name: "Jennifer T.", amt: "$100", time: "3 hours ago" },
    { name: "The Williams Family", amt: "$250", time: "6 hours ago" },
    { name: "Anonymous", amt: "$25", time: "1 day ago" },
    { name: "David K.", amt: "$50", time: "1 day ago" },
  ];

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
              className="w-full h-[340px] rounded-2xl flex items-center justify-center mb-4 relative"
              style={{ background: c.color }}
            >
              <span className="text-white/20 text-[120px] font-serif font-bold">
                {c.initials}
              </span>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">
                  {c.type}
                </span>
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">
                  Active
                </span>
              </div>
            </div>

            {/* Organizer + trust badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-[13px] font-bold text-gray-500">
                R
              </div>
              <div>
                <div className="text-[14px] font-medium">RTR Board</div>
                <div className="text-[12px] text-gray-400">
                  Verified &middot; {c.loc}
                </div>
              </div>
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
                {showFullSummary
                  ? c.summary +
                    " All tips should be submitted directly to law enforcement. RTR is not a tip intake platform and does not evaluate tips. The reward pool is held by RTR and will only be disbursed upon verified case resolution with official documentation reviewed and approved by the RTR board."
                  : c.summary}
              </p>
              <button
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="text-[14px] font-medium text-black mt-2 hover:underline"
              >
                {showFullSummary ? "Show less" : "Read more"}
              </button>
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

            {/* Organizer section */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-3">Case details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Case type", v: c.type },
                  { l: "Status", v: "Active" },
                  { l: "Location", v: c.loc },
                  { l: "Days open", v: String(c.days) },
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
                "Claimant submits official documentation to RTR",
                "Platform board reviews and approves disbursement",
              ].map((s, i) => (
                <div key={i} className="flex gap-2.5 mb-2 text-[14px] text-gray-600">
                  <span className="text-gray-400 font-medium">{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Tip directory */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-2">Where to submit tips</h3>
              <p className="text-[14px] text-gray-500 mb-3">
                RTR does not accept tips. Contact the appropriate agency directly:
              </p>
              {[
                { agency: "Local Law Enforcement", phone: "(555) 555-0100" },
                { agency: "FBI Tip Line", phone: "1-800-CALL-FBI" },
                { agency: "Crime Stoppers", phone: "1-800-222-TIPS" },
              ].map((a) => (
                <div
                  key={a.agency}
                  className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-[14px] font-medium">{a.agency}</span>
                  <span className="text-[14px] font-medium text-[var(--color-brand)]">
                    {a.phone}
                  </span>
                </div>
              ))}
            </div>

            {/* Words of support */}
            <div className="mb-8">
              <h3 className="text-[18px] font-semibold mb-1">
                Words of support{" "}
                <span className="text-[13px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                  3
                </span>
              </h3>
              <p className="text-[13px] text-gray-400 mb-4">
                Donate to share words of support.
              </p>
              {[
                {
                  name: "Sarah M.",
                  amt: "$50",
                  time: "2 hours ago",
                  text: "Shared this on my neighborhood Facebook group. Hoping someone knows something.",
                },
                {
                  name: "Anonymous",
                  amt: "$25",
                  time: "1 day ago",
                  text: "Praying for a resolution. Every bit helps.",
                },
                {
                  name: "Mike R.",
                  amt: "$100",
                  time: "3 days ago",
                  text: "I live in the area. Will keep an eye out.",
                },
              ].map((comment, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-400 shrink-0">
                    {comment.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px]">
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-gray-400 ml-1.5">
                        {comment.amt} &middot; {comment.time}
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-600 mt-0.5">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
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
                {/* Progress ring + amount */}
                <div className="mb-4">
                  <div className="text-[22px] font-bold text-black">
                    {c.reward} raised
                  </div>
                  <div className="text-[13px] text-gray-400">
                    {c.donors} donations
                  </div>
                </div>

                {/* Donate button */}
                <Link
                  href={`/case/${c.id}/donate`}
                  className="flex items-center justify-center w-full py-3 rounded-full bg-[var(--color-brand)] text-white text-[15px] font-semibold mb-2"
                >
                  Donate now
                </Link>

                {/* Share button */}
                <button className="flex items-center justify-center w-full py-3 rounded-full bg-black text-white text-[15px] font-semibold mb-4">
                  Share
                </button>

                {/* Recent donations */}
                <div className="flex items-center gap-2 text-[13px] text-[var(--color-brand)] font-medium mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  {c.donors} recent donations
                </div>

                {recentDonors.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-400 shrink-0">
                      {d.name[0]}
                    </div>
                    <div className="text-[13px]">
                      <span className="font-medium">{d.name}</span>
                      <div className="text-gray-400">
                        {d.amt} &middot; {d.time}
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="#"
                  className="text-[13px] font-medium text-black hover:underline mt-1 inline-block"
                >
                  See all donations &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
