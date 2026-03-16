"use client";

import { useState, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";

const TABS = [
  "Case info",
  "Official tip directory",
  "Official updates",
  "Media & articles",
  "Community discussion",
  "Donor wall",
];

export default function CaseHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = CASES.find((cs) => cs.id === id) ?? CASES[0];
  const [tab, setTab] = useState(0);

  return (
    <>
      <Nav />

      {/* Hero header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="flex items-start gap-1.5 mb-1">
          <Link
            href="/cases"
            className="text-[12px] text-gray-400 hover:text-gray-600"
          >
            &larr; All cases
          </Link>
        </div>
        <div className="grid grid-cols-[1fr_260px] gap-6 items-start">
          <div>
            <div className="flex gap-1.5 mb-2.5">
              <span className="inline-flex px-2.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">
                {c.type}
              </span>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-black">
                Active
              </span>
            </div>
            <h1 className="font-serif text-[30px] tracking-tight mb-1.5">
              {c.name}
            </h1>
            <p className="text-[14px] text-gray-400">
              {c.loc} &middot; Case opened {c.days} days ago
            </p>
          </div>

          {/* Reward box */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-4.5 sticky top-[76px]">
            <div className="text-[11px] text-gray-400 mb-1">
              Total reward pool
            </div>
            <div className="font-serif text-[36px] text-gray-900 tracking-tight">
              {c.reward}
            </div>
            <div className="text-[12px] text-gray-400 mb-2">
              {c.donors} donors &middot; Growing in real time
            </div>
            <div className="h-1 bg-gray-100 rounded-sm mb-3">
              <div
                className="h-1 bg-[var(--color-brand)] rounded-sm"
                style={{ width: `${c.pct}%` }}
              />
            </div>
            <Link
              href={`/case/${c.id}/donate`}
              className="flex items-center justify-center w-full py-2 rounded-full bg-[var(--color-brand)] text-white text-[13px] font-medium mb-1.5"
            >
              Donate to this reward
            </Link>
            <div className="text-[11px] text-gray-300 text-center">
              All donations irrevocable &middot; 4% fee
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="px-8">
        <div className="flex border-b-[1.5px] border-gray-100 mb-4.5 overflow-x-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-3.5 py-2 text-[13px] border-b-2 whitespace-nowrap ${
                tab === i
                  ? "text-gray-900 border-gray-900 font-medium"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-6">
          <div>
            {/* ── Tab 0: Case info ── */}
            {tab === 0 && (
              <>
                <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                    About this case
                  </div>
                  <p className="text-[14px] mb-3.5">{c.summary}</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { l: "Case type", v: c.type },
                      { l: "Status", v: "Active" },
                      { l: "Location", v: c.loc },
                      { l: "Days open", v: String(c.days) },
                    ].map((item) => (
                      <div key={item.l}>
                        <div className="text-[11px] text-gray-400">
                          {item.l}
                        </div>
                        <div className="text-[13px] font-medium">{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                    Reward payout criteria
                  </div>
                  {[
                    "Law enforcement confirms the case resolution",
                    "Tipster identified and confirmed by law enforcement",
                    "Claimant submits official documentation to RTR",
                    "Platform board reviews and approves disbursement",
                  ].map((s, i) => (
                    <div key={i} className="flex gap-2 mb-1.5 text-[13px]">
                      <span className="text-gray-400">{i + 1}.</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-3">
                  <strong>Important:</strong> RTR is not a tip intake platform.
                  Submit all tips directly to law enforcement via the
                  &ldquo;Official tip directory&rdquo; tab.
                </div>
              </>
            )}

            {/* ── Tab 1: Tip directory ── */}
            {tab === 1 && (
              <>
                <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                    Where to submit tips
                  </div>
                  <p className="text-[14px] text-gray-500 mb-3.5">
                    RTR does not accept tips. If you have information about this
                    case, contact the appropriate agency directly:
                  </p>
                  {[
                    {
                      agency: "Local Law Enforcement",
                      detail: `${c.loc} Police Department`,
                      phone: "(555) 555-0100",
                    },
                    {
                      agency: "FBI",
                      detail: "Federal Bureau of Investigation tip line",
                      phone: "1-800-CALL-FBI",
                    },
                    {
                      agency: "Crime Stoppers",
                      detail: "Anonymous tip submission",
                      phone: "1-800-222-TIPS",
                    },
                  ].map((a) => (
                    <div
                      key={a.agency}
                      className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div className="text-[14px] font-medium">
                          {a.agency}
                        </div>
                        <div className="text-[12px] text-gray-400">
                          {a.detail}
                        </div>
                      </div>
                      <div className="text-[13px] font-medium text-[var(--color-brand)]">
                        {a.phone}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-3">
                  <strong>Never</strong> submit tips through RTR, social media,
                  or directly to the family. Always go through official law
                  enforcement channels.
                </div>
              </>
            )}

            {/* ── Tab 2: Updates ── */}
            {tab === 2 && (
              <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                  Official updates
                </div>
                {[
                  {
                    date: "Mar 10, 2026",
                    text: "Reward pool passed $" + c.reward.replace("$", "").replace(",", "") + " mark.",
                  },
                  {
                    date: "Feb 28, 2026",
                    text: "Case reviewed and renewed by RTR board.",
                  },
                  {
                    date: "Jan 15, 2026",
                    text: "Case went live on the platform.",
                  },
                  {
                    date: "Jan 12, 2026",
                    text: "Case submitted and approved by RTR board.",
                  },
                ].map((u, i) => (
                  <div
                    key={i}
                    className="flex gap-3 mb-3 last:mb-0 items-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[12px] text-gray-400">{u.date}</div>
                      <div className="text-[14px]">{u.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab 3: Media ── */}
            {tab === 3 && (
              <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                  Media &amp; articles
                </div>
                {[
                  {
                    t: "Local News: Search continues for " + c.name.split(" \u2014")[0],
                    src: "Channel 5 News",
                    date: "Feb 2026",
                  },
                  {
                    t: "Community rallies behind reward fund",
                    src: "Daily Herald",
                    date: "Jan 2026",
                  },
                  {
                    t: "Family speaks out on case progress",
                    src: "AP News",
                    date: "Jan 2026",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <div className="text-[14px] font-medium text-[var(--color-brand)] cursor-pointer hover:underline">
                      {a.t}
                    </div>
                    <div className="text-[12px] text-gray-400">
                      {a.src} &middot; {a.date}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab 4: Discussion ── */}
            {tab === 4 && (
              <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                  Community discussion
                </div>
                {[
                  {
                    user: "Sarah M.",
                    time: "2 hours ago",
                    text: "Shared this on my neighborhood Facebook group. Hoping someone knows something.",
                  },
                  {
                    user: "Anonymous",
                    time: "1 day ago",
                    text: "Donated $50. Every bit helps. Praying for a resolution.",
                  },
                  {
                    user: "Mike R.",
                    time: "3 days ago",
                    text: "I live in the area. Will keep an eye out and share with neighbors.",
                  },
                ].map((comment, i) => (
                  <div
                    key={i}
                    className="py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-medium">
                        {comment.user}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-600">{comment.text}</p>
                  </div>
                ))}
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                    placeholder="Add a comment..."
                  />
                  <button className="px-4 py-2 rounded-full bg-black text-white text-[13px] font-medium">
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* ── Tab 5: Donor wall ── */}
            {tab === 5 && (
              <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                  Donor wall &middot; {c.donors} donors
                </div>
                {[
                  { name: "Anonymous", amt: "$500", time: "1 hour ago" },
                  { name: "Jennifer T.", amt: "$100", time: "3 hours ago" },
                  { name: "The Williams Family", amt: "$250", time: "6 hours ago" },
                  { name: "Anonymous", amt: "$25", time: "1 day ago" },
                  { name: "David K.", amt: "$50", time: "1 day ago" },
                  { name: "Maria G.", amt: "$10", time: "2 days ago" },
                  { name: "Anonymous", amt: "$1,000", time: "3 days ago" },
                  { name: "Robert P.", amt: "$75", time: "4 days ago" },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <span className="text-[14px] font-medium">{d.name}</span>
                      <span className="text-[12px] text-gray-400 ml-2">
                        {d.time}
                      </span>
                    </div>
                    <span className="text-[14px] font-semibold">{d.amt}</span>
                  </div>
                ))}
                <div className="text-center mt-3">
                  <button className="text-[13px] text-gray-400 hover:text-gray-600">
                    View all {c.donors} donors &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar timeline */}
          <div>
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                Timeline
              </div>
              {[
                "Case submitted to RTR",
                "Board review & approval",
                "Case went live",
                `Reward passed ${c.reward}`,
              ].map((e, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <div className="w-[18px] h-[18px] rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[13px]">{e}</span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-[10px] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                Share this case
              </div>
              <div className="flex gap-2">
                {["Twitter", "Facebook", "Copy link"].map((s) => (
                  <button
                    key={s}
                    className="flex-1 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Claim footer */}
        <div className="border-t border-gray-100 py-5 text-center mt-4 mb-8">
          <Link
            href="/claim"
            className="text-[12px] text-gray-300 hover:text-gray-500 hover:underline"
          >
            Are you the qualifying tipster for this case? Learn how to submit a
            claim.
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
