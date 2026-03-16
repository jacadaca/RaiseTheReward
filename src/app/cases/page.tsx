"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/lib/cases";

const FILTERS = [
  "All",
  "Missing Person",
  "Unsolved Crime",
  "Wanted Individual",
];

function CasesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState(initialQuery);

  const filtered = CASES.filter((c) => {
    const matchesFilter = filter === "All" || c.type === filter;
    const matchesSearch =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.loc.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="bg-white border-b border-gray-100 px-8 py-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[32px] tracking-tight mb-1">
              Open cases
            </h1>
            <p className="text-[14px] text-gray-400">
              {filtered.length} case{filtered.length !== 1 ? "s" : ""} found
              {search.trim() ? ` for \u201c${search}\u201d` : ""} &middot;
              $251,750 total held
            </p>
          </div>
          <Link
            href="/submit"
            className="px-4 py-2 rounded-full text-[13px] font-medium bg-[var(--color-brand)] text-white"
          >
            + Start a reward
          </Link>
        </div>

        <div className="mt-4 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[400px] px-3.5 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
            placeholder="Search by name, location, or type..."
          />
        </div>

        <div className="flex gap-2 flex-wrap">
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
        {filtered.length === 0 && (
          <div className="col-span-3 flex items-center justify-center min-h-[240px] text-center">
            <div>
              <div className="text-[28px] text-gray-300 mb-2">&#128269;</div>
              <div className="text-[16px] font-medium text-gray-400 mb-1">
                No cases found
              </div>
              <div className="text-[14px] text-gray-400">
                Try a different search or filter
              </div>
            </div>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center min-h-[240px] bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <div className="text-center text-gray-400">
              <div className="text-[28px] mb-2">&rarr;</div>
              <div className="text-[14px] font-semibold">Load more cases</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CasesPage() {
  return (
    <>
      <Nav />
      <Suspense>
        <CasesContent />
      </Suspense>
      <Footer />
    </>
  );
}
