"use client";

import { useState } from "react";
import Link from "next/link";
import type { Case } from "@/lib/cases";

export default function CaseCard({ c }: { c: Case }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/${c.id}`}
      className="block rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {/* Photo or placeholder */}
      <div
        className="h-[220px] flex items-center justify-center relative overflow-hidden"
        style={{ background: c.color }}
      >
        {c.imageUrl && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={c.imageUrl}
            alt={c.name}
            className="h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-white/30 text-[64px] font-serif font-bold">
            {c.initials}
          </span>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {c.loc}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          {c.source}
        </div>
      </div>

      <div className="p-4">
        <div className="text-[15px] font-semibold text-black leading-tight mb-1">
          {c.name}
        </div>

        <div className="text-[14px] font-semibold text-black mt-2">
          {c.rewardNum === 0 ? "No donations yet" : `${c.reward} raised`}
        </div>
        <div className="text-[12px] text-gray-400">
          {c.donors === 0 ? "Be the first to donate" : `${c.donors} donations`}
        </div>
      </div>
    </Link>
  );
}
