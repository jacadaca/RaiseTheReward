"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/cases${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-white rounded-full p-1 pl-4 max-w-[480px] border border-gray-200 shadow-sm"
    >
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-400 shrink-0 mr-2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </svg>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border-none outline-none text-[14px] bg-transparent text-black placeholder:text-gray-400"
        placeholder="Search a case, person, or location..."
      />
      <button
        type="submit"
        className="bg-[var(--color-brand)] text-white border-none rounded-full px-5 py-2.5 text-[13px] font-semibold whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
