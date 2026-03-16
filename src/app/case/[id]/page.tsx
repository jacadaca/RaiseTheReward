import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";

export default async function CaseHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = CASES.find((cs) => cs.id === id) ?? CASES[0];

  const tabs = [
    "Case info",
    "Official tip directory",
    "Official updates",
    "Media & articles",
    "Community discussion",
    "Donor wall",
  ];

  return (
    <>
      <Nav />

      {/* Hero header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
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
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`px-3.5 py-2 text-[13px] border-b-2 whitespace-nowrap ${
                i === 0
                  ? "text-gray-900 border-gray-900 font-medium"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-6">
          <div>
            {/* About */}
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
                    <div className="text-[11px] text-gray-400">{item.l}</div>
                    <div className="text-[13px] font-medium">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout criteria */}
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
                <div
                  key={i}
                  className="flex gap-2 mb-1.5 text-[13px]"
                >
                  <span className="text-gray-400">{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2.5 text-[13px] text-black mb-3">
              <strong>Important:</strong> RTR is not a tip intake platform.
              Submit all tips directly to law enforcement via the
              &ldquo;Official tip directory&rdquo; tab.
            </div>
          </div>

          {/* Sidebar timeline */}
          <div>
            <div className="bg-white border border-gray-200 rounded-[10px] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                Timeline
              </div>
              {[
                "Case submitted to RTR",
                "Board review & approval",
                "Case went live",
                "Reward passed $10,000",
              ].map((e, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <div className="w-[18px] h-[18px] rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[13px]">{e}</span>
                </div>
              ))}
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
