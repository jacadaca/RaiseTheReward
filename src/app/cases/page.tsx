"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/lib/cases";

const FILTERS = [
  "All",
  "Missing Person",
  "Unsolved Crime",
  "Wanted Individual",
  "Lost Pet",
];

export default function CasesPage() {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All" ? CASES : CASES.filter((c) => c.type === filter);

  return (
    <>
      <Nav />

      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[32px] tracking-tight mb-1">
              Open cases
            </h1>
            <p className="text-[14px] text-gray-400">
              47 active reward pools &middot; $251,750 total held
            </p>
          </div>
          <button className="px-4 py-2 rounded-full text-[13px] font-medium bg-[var(--color-brand)] text-white">
            + Submit a case
          </button>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] border-[1.5px] ${
                filter === f
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6 px-8">
        {filtered.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
        <div className="flex items-center justify-center min-h-[240px] bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <div className="text-center text-gray-400">
            <div className="text-[28px] mb-2">&rarr;</div>
            <div className="text-[14px] font-semibold">Load more cases</div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
