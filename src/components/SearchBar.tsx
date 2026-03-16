"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/cases${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex bg-white rounded-full p-1.5 pl-5 max-w-[520px] mx-auto mb-3.5 border border-gray-200 shadow-sm"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border-none outline-none text-[14px] bg-transparent text-black placeholder:text-gray-400"
        placeholder="Search a case, person, or location&hellip;"
      />
      <button
        type="submit"
        className="bg-black text-white border-none rounded-full px-5 py-2 text-[13px] font-semibold whitespace-nowrap"
      >
        Find a case
      </button>
    </form>
  );
}
