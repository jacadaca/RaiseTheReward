import Link from "next/link";
import type { Case } from "@/lib/cases";

export default function CaseCard({ c }: { c: Case }) {
  return (
    <Link
      href={`/case/${c.id}`}
      className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div
        className="h-[120px] flex items-center justify-center text-4xl relative"
        style={{
          background: c.type === "Lost Pet" ? "#f5f5f5" : "#111",
        }}
      >
        <span>{c.emoji}</span>
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase">
          {c.type}
        </div>
      </div>
      <div className="p-3.5">
        <div className="text-[14px] font-semibold text-black mb-0.5">
          {c.name}
        </div>
        <div className="text-[12px] text-gray-400 mb-2.5">{c.loc}</div>
        <div className="flex justify-between items-baseline mb-1.5">
          <div className="text-[18px] font-semibold text-black">{c.reward}</div>
          <div className="text-[12px] text-gray-400">{c.donors} donors</div>
        </div>
        <div className="h-[3px] bg-gray-200 rounded-sm mb-2.5">
          <div
            className="h-[3px] bg-[var(--color-brand)] rounded-sm"
            style={{ width: `${c.pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[11px] text-gray-400">{c.days} days open</div>
          <span className="bg-black text-white text-[12px] px-3.5 py-1 rounded-full">
            Donate
          </span>
        </div>
      </div>
    </Link>
  );
}
