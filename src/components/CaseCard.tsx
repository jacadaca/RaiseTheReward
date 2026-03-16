import Link from "next/link";
import type { Case } from "@/lib/cases";

export default function CaseCard({ c }: { c: Case }) {
  return (
    <Link
      href={`/case/${c.id}`}
      className="block rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {/* Photo placeholder */}
      <div
        className="h-[180px] flex items-center justify-center relative"
        style={{ background: c.color }}
      >
        <span className="text-white/30 text-[64px] font-serif font-bold">
          {c.initials}
        </span>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {c.loc}
        </div>
      </div>

      <div className="p-4">
        <div className="text-[15px] font-semibold text-black leading-tight mb-1">
          {c.name}
        </div>

        {/* Progress bar */}
        <div className="h-[5px] bg-gray-100 rounded-full mt-3 mb-2">
          <div
            className="h-[5px] bg-[var(--color-brand)] rounded-full"
            style={{ width: `${c.pct}%` }}
          />
        </div>

        <div className="text-[14px] font-semibold text-black">
          {c.reward} raised
        </div>
      </div>
    </Link>
  );
}
