"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASES } from "@/lib/cases";

interface CaseImage {
  url: string;
  caption?: string;
}

interface FullCase {
  id: string;
  name: string;
  type: string;
  reward: string;
  rewardNum: number;
  donors: number;
  loc: string;
  summary: string;
  color: string;
  initials: string;
  source: string;
  sourceUrl: string;
  leContact: string;
  imageUrl?: string;
  dateAdded: string;
  // Expanded
  images?: CaseImage[];
  aliases?: string[];
  sex?: string;
  race?: string;
  hair?: string;
  eyes?: string;
  height?: string;
  weight?: string;
  build?: string;
  complexion?: string;
  scarsMarks?: string;
  ageRange?: string;
  datesOfBirth?: string[];
  placeOfBirth?: string;
  nationality?: string;
  languages?: string[];
  caution?: string;
  warningMessage?: string;
  officialRewardText?: string;
  remarks?: string;
  occupations?: string[];
  missingDate?: string;
  missingAge?: string;
  currentAge?: string;
  circumstance?: string;
}

function mapSanityToFull(c: Record<string, unknown>): FullCase {
  return {
    id: (c.slug as string) ?? "",
    name: (c.name as string) ?? "",
    type: (c.caseType as string) ?? "Wanted Individual",
    reward: (c.rewardNum as number) > 0 ? `$${(c.rewardNum as number).toLocaleString()}` : "$0",
    rewardNum: (c.rewardNum as number) ?? 0,
    donors: (c.donors as number) ?? 0,
    loc: (c.location as string) ?? "",
    summary: (c.summary as string) ?? "",
    color: (c.color as string) ?? "#999",
    initials: (c.initials as string) ?? "?",
    source: (c.source as string) ?? "FBI",
    sourceUrl: (c.sourceUrl as string) ?? "",
    leContact: (c.leContact as string) ?? "",
    imageUrl: c.imageUrl as string | undefined,
    dateAdded: (c.dateAdded as string) ?? "",
    images: c.images as CaseImage[] | undefined,
    aliases: c.aliases as string[] | undefined,
    sex: c.sex as string | undefined,
    race: c.race as string | undefined,
    hair: c.hair as string | undefined,
    eyes: c.eyes as string | undefined,
    height: c.height as string | undefined,
    weight: c.weight as string | undefined,
    build: c.build as string | undefined,
    complexion: c.complexion as string | undefined,
    scarsMarks: c.scarsMarks as string | undefined,
    ageRange: c.ageRange as string | undefined,
    datesOfBirth: c.datesOfBirth as string[] | undefined,
    placeOfBirth: c.placeOfBirth as string | undefined,
    nationality: c.nationality as string | undefined,
    languages: c.languages as string[] | undefined,
    caution: c.caution as string | undefined,
    warningMessage: c.warningMessage as string | undefined,
    officialRewardText: c.officialRewardText as string | undefined,
    remarks: c.remarks as string | undefined,
    occupations: c.occupations as string[] | undefined,
    missingDate: c.missingDate as string | undefined,
    missingAge: c.missingAge as string | undefined,
    currentAge: c.currentAge as string | undefined,
    circumstance: c.circumstance as string | undefined,
  };
}

function mapStaticToFull(c: typeof CASES[number]): FullCase {
  return { ...c, type: c.type, loc: c.loc };
}

export default function CasePage({
  params,
}: {
  params: Promise<{ vanity: string }>;
}) {
  const { vanity } = use(params);
  const slug = vanity.toLowerCase();

  const staticCase = CASES.find((cs) => cs.id === slug);
  const [c, setC] = useState<FullCase | null>(staticCase ? mapStaticToFull(staticCase) : null);
  const [imgError, setImgError] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (staticCase) return;
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        if (data.cases) {
          const match = (data.cases as Record<string, unknown>[]).find(
            (sc) => sc.slug === slug || sc.vanitySlug === slug
          );
          if (match) setC(mapSanityToFull(match));
          else setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug, staticCase]);

  if (notFound) {
    return (
      <>
        <Nav />
        <div className="max-w-[960px] mx-auto px-8 py-20 text-center">
          <h1 className="font-serif text-[36px] tracking-tight mb-3">Case not found</h1>
          <p className="text-[15px] text-gray-500 mb-6">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <Link href="/cases" className="text-[14px] font-medium text-[var(--color-brand)] hover:underline">
            Browse all cases &rarr;
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!c) {
    return (
      <>
        <Nav />
        <div className="max-w-[960px] mx-auto px-8 py-20 text-center text-gray-400">Loading case...</div>
        <Footer />
      </>
    );
  }

  const allImages = c.images && c.images.length > 0
    ? c.images
    : c.imageUrl
    ? [{ url: c.imageUrl, caption: "Primary" }]
    : [];

  const hasPhysicalDesc = c.sex || c.race || c.hair || c.eyes || c.height || c.weight || c.build || c.complexion;
  const hasAliases = c.aliases && c.aliases.length > 0;
  const hasWarning = c.warningMessage || c.caution;

  return (
    <>
      <Nav />
      <div className="max-w-[960px] mx-auto px-8 py-6">
        <Link href="/cases" className="text-[13px] text-gray-400 hover:text-gray-600 mb-4 inline-block">
          &larr; All cases
        </Link>

        <h1 className="font-serif text-[clamp(24px,3.5vw,36px)] tracking-tight mb-4">{c.name}</h1>

        {/* Warning banner */}
        {hasWarning && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-[13px] text-red-800">
            <strong>Warning:</strong> {c.warningMessage || c.caution}
          </div>
        )}

        <div className="grid grid-cols-[1fr_320px] gap-8">
          {/* ── Left column ── */}
          <div>
            {/* Image gallery */}
            <div
              className="w-full h-[400px] rounded-2xl flex items-center justify-center mb-2 relative overflow-hidden"
              style={{ background: c.color }}
            >
              {allImages.length > 0 && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={allImages[selectedImg]?.url}
                  alt={c.name}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-white/20 text-[120px] font-serif font-bold">{c.initials}</span>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">{c.type}</span>
                <span className="bg-white/90 backdrop-blur text-[12px] font-medium px-3 py-1 rounded-full text-black">Active</span>
              </div>
            </div>

            {/* Image thumbnails (if multiple) */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mb-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImg(i); setImgError(false); }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImg === i ? "border-[var(--color-brand)]" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Source attribution */}
            <div className="flex items-center gap-2 mb-4 text-[13px] text-gray-400">
              Sourced from{" "}
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline font-medium">
                {c.source}
              </a>
              <span>&middot; Added {c.dateAdded}</span>
            </div>

            {/* Official reward from source (if any) */}
            {c.officialRewardText && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-[13px] text-amber-900">
                <strong>Official reward:</strong> {c.officialRewardText}
              </div>
            )}

            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 text-[13px] text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg mb-6">
              Board verified &middot; Donations protected
            </div>

            {/* Summary */}
            <div className="mb-6">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                {c.summary} All tips should be submitted directly to law enforcement. RaiseTheReward is not a tip intake platform and does not evaluate tips. The reward pool is held by RaiseTheReward and will only be disbursed upon verified case resolution with official documentation reviewed and approved by the RaiseTheReward board.
              </p>
            </div>

            {/* Remarks (additional details from FBI) */}
            {c.remarks && (
              <div className="mb-6">
                <h3 className="text-[16px] font-semibold mb-2">Additional details</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">{c.remarks}</p>
              </div>
            )}

            {/* Donate + Share */}
            <div className="flex gap-3 mb-8 pb-8 border-b border-gray-100">
              <Link href={`/${slug}/donate`} className="flex-1 text-center py-3 rounded-full text-[15px] font-semibold border-[1.5px] border-gray-200 text-black hover:bg-gray-50">
                Donate
              </Link>
              <button className="flex-1 text-center py-3 rounded-full text-[15px] font-semibold border-[1.5px] border-gray-200 text-black hover:bg-gray-50">
                Share
              </button>
            </div>

            {/* Aliases */}
            {hasAliases && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-[18px] font-semibold mb-3">Known aliases</h3>
                <div className="flex flex-wrap gap-2">
                  {c.aliases!.map((alias, i) => (
                    <span key={i} className="text-[13px] bg-gray-100 px-3 py-1 rounded-full">{alias}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Physical description */}
            {hasPhysicalDesc && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-[18px] font-semibold mb-3">Physical description</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Sex", v: c.sex },
                    { l: "Race", v: c.race },
                    { l: "Hair", v: c.hair },
                    { l: "Eyes", v: c.eyes },
                    { l: "Height", v: c.height },
                    { l: "Weight", v: c.weight },
                    { l: "Build", v: c.build },
                    { l: "Complexion", v: c.complexion },
                    { l: "Age range", v: c.ageRange },
                    { l: "Nationality", v: c.nationality },
                    { l: "Place of birth", v: c.placeOfBirth },
                  ]
                    .filter((item) => item.v)
                    .map((item) => (
                      <div key={item.l}>
                        <div className="text-[12px] text-gray-400">{item.l}</div>
                        <div className="text-[14px] font-medium">{item.v}</div>
                      </div>
                    ))}
                </div>
                {c.scarsMarks && (
                  <div className="mt-3">
                    <div className="text-[12px] text-gray-400">Scars / marks / tattoos</div>
                    <div className="text-[14px] text-gray-700 mt-1">{c.scarsMarks}</div>
                  </div>
                )}
                {c.languages && c.languages.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[12px] text-gray-400">Languages</div>
                    <div className="text-[14px] font-medium">{c.languages.join(", ")}</div>
                  </div>
                )}
                {c.occupations && c.occupations.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[12px] text-gray-400">Occupations</div>
                    <div className="text-[14px] font-medium">{c.occupations.join(", ")}</div>
                  </div>
                )}
              </div>
            )}

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
                  ...(c.missingDate ? [{ l: "Missing since", v: c.missingDate }] : []),
                  ...(c.currentAge ? [{ l: "Current age (approx)", v: c.currentAge }] : []),
                  ...(c.datesOfBirth && c.datesOfBirth.length > 0 ? [{ l: "DOB used", v: c.datesOfBirth.join(", ") }] : []),
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

            {/* Tip directory */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold mb-2">Where to submit tips</h3>
              <p className="text-[14px] text-gray-500 mb-3">
                RaiseTheReward does not accept or handle tips. Contact law enforcement directly:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                <div className="text-[14px] font-medium text-black mb-1">Case-specific contact</div>
                <div className="text-[14px] text-[var(--color-brand)]">{c.leContact}</div>
              </div>
              {[
                { agency: "FBI Tip Line", contact: "tips.fbi.gov or 1-800-CALL-FBI" },
                { agency: "Crime Stoppers", contact: "1-800-222-TIPS" },
              ].map((a) => (
                <div key={a.agency} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-[14px] font-medium">{a.agency}</span>
                  <span className="text-[14px] font-medium text-[var(--color-brand)]">{a.contact}</span>
                </div>
              ))}
            </div>

            {/* Words of support */}
            <div className="mb-8">
              <h3 className="text-[18px] font-semibold mb-1">Words of support</h3>
              <p className="text-[14px] text-gray-400 mt-2">
                {c.donors > 0 ? "Donate to share words of support." : "No donations yet. Be the first to contribute to this reward pool."}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-[13px] text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Disclaimer:</strong> This case was sourced from
              public law enforcement databases ({c.source}). RaiseTheReward is not affiliated
              with the investigating agency. All case information is sourced from public records.
              Tips should be submitted directly to law enforcement &mdash; RaiseTheReward does not collect,
              relay, or evaluate tips. If you are associated with this case and wish to have it
              removed, please{" "}
              <Link href={`/removal-request?case=${c.id}`} className="text-[var(--color-brand)] hover:underline">
                submit a removal request
              </Link>.
            </div>

            <div className="border-t border-gray-100 py-5 text-center">
              <Link href="/claim" className="text-[13px] text-gray-400 hover:text-gray-600 hover:underline">
                Are you the qualifying tipster? Submit a claim &rarr;
              </Link>
            </div>
          </div>

          {/* ── Right column: sticky sidebar ── */}
          <div>
            <div className="sticky top-[76px]">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="mb-4">
                  <div className="text-[22px] font-bold text-black">
                    {c.rewardNum === 0 ? "No donations yet" : `${c.reward} raised`}
                  </div>
                  {c.donors > 0 && <div className="text-[13px] text-gray-400">{c.donors} donations</div>}
                </div>

                <Link href={`/${slug}/donate`} className="flex items-center justify-center w-full py-3 rounded-full bg-[var(--color-brand)] text-white text-[15px] font-semibold mb-2">
                  {c.donors === 0 ? "Be the first to donate" : "Donate now"}
                </Link>
                <button className="flex items-center justify-center w-full py-3 rounded-full bg-black text-white text-[15px] font-semibold mb-4">
                  Share
                </button>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="text-[12px] text-gray-400 mb-1">Sourced from</div>
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[var(--color-brand)] hover:underline">
                    {c.source} &rarr;
                  </a>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-[12px] text-gray-400 mb-1">Have a tip?</div>
                  <div className="text-[13px] text-gray-600 leading-relaxed">{c.leContact}</div>
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
