"use client";

import { useState, useEffect, useCallback } from "react";

interface CaseItem {
  _id: string;
  name: string;
  slug: string;
  caseType: string;
  category?: string;
  location: string;
  source: string;
  imageUrl?: string;
  visible: boolean;
  featured: boolean;
  rewardNum: number;
  donors: number;
  lastSynced?: string;
}

interface Counts {
  total: number;
  visible: number;
  featured: number;
  fbi: number;
  ncmec: number;
  crimestoppers: number;
  user: number;
}

const TABS = [
  "Case management",
  "Reward claims",
  "Case review queue",
  "Disbursements",
];

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Filters
  const [filterSource, setFilterSource] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterVisibility, setFilterVisibility] = useState("All");
  const [search, setSearch] = useState("");

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch("/api/cases");
      const data = await res.json();
      setCases(data.cases ?? []);
      setCounts(data.counts ?? null);
      setCategories(data.categories ?? []);
    } catch {
      console.error("Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // ── Sync from FBI ──
  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync-fbi", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncResult(
          `Synced ${data.imported} cases from FBI (${data.totalPages} pages)`
        );
        await fetchCases();
      } else {
        setSyncResult(`Sync failed: ${data.error}`);
      }
    } catch (err) {
      setSyncResult(`Sync error: ${String(err)}`);
    } finally {
      setSyncing(false);
    }
  };

  // ── Toggle single case ──
  const handleToggle = async (
    id: string,
    field: "visible" | "featured",
    value: boolean
  ) => {
    // Optimistic update
    setCases((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    );
    try {
      await fetch("/api/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id, field, value }),
      });
    } catch {
      // Revert on error
      setCases((prev) =>
        prev.map((c) => (c._id === id ? { ...c, [field]: !value } : c))
      );
    }
  };

  // ── Bulk operations ──
  const handleBulkType = async (caseType: string, visible: boolean) => {
    try {
      const res = await fetch("/api/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulkType", caseType, visible }),
      });
      const data = await res.json();
      setSyncResult(
        `${visible ? "Showed" : "Hid"} ${data.affected} "${caseType}" cases`
      );
      await fetchCases();
    } catch (err) {
      setSyncResult(`Bulk update failed: ${String(err)}`);
    }
  };

  const handleBulkCategory = async (category: string, visible: boolean) => {
    try {
      const res = await fetch("/api/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulkCategory", category, visible }),
      });
      const data = await res.json();
      setSyncResult(
        `${visible ? "Showed" : "Hid"} ${data.affected} "${category}" cases`
      );
      await fetchCases();
    } catch (err) {
      setSyncResult(`Bulk update failed: ${String(err)}`);
    }
  };

  // ── Filter cases ──
  const filtered = cases.filter((c) => {
    if (filterSource !== "All" && c.source !== filterSource) return false;
    if (filterType !== "All" && c.caseType !== filterType) return false;
    if (filterVisibility === "Visible" && !c.visible) return false;
    if (filterVisibility === "Hidden" && c.visible) return false;
    if (filterVisibility === "Featured" && !c.featured) return false;
    if (
      search.trim() &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.location.toLowerCase().includes(search.toLowerCase()) &&
      !(c.category ?? "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <>
      {/* Dark admin nav */}
      <nav className="flex items-center justify-between px-8 h-14 bg-[#0d0d0d] border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-[17px] text-white">
            <span className="text-[var(--color-brand)]">Raise</span>
            <span className="text-gray-400">the</span>
            <span className="text-[var(--color-brand)]">Reward</span>
          </span>
          <span className="text-[12px] text-gray-600 ml-2">
            / Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-600">Internal only</span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-2"
            title="Connected to Sanity"
          />
        </div>
      </nav>

      <div className="px-8 py-6 max-w-[1200px] mx-auto">
        <div className="mb-5">
          <h1 className="font-serif text-[26px] tracking-tight mb-1">
            Admin Dashboard
          </h1>
          <p className="text-[13px] text-gray-400">
            Manage cases, sync from law enforcement databases, control what
            appears on the site
          </p>
        </div>

        {/* Stats */}
        {counts && (
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { v: String(counts.total), l: "Total cases" },
              { v: String(counts.visible), l: "Visible on site" },
              { v: String(counts.featured), l: "Featured on homepage" },
              { v: String(counts.fbi), l: "From FBI" },
              {
                v: String(counts.ncmec + counts.crimestoppers),
                l: "NCMEC / Crime Stoppers",
              },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white border border-gray-200 rounded-[10px] p-4"
              >
                <div className="text-[22px] font-semibold mb-0.5">{s.v}</div>
                <div className="text-[12px] text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-3.5 py-2 text-[13px] border-b-2 ${
                tab === i
                  ? "text-gray-900 border-gray-900 font-medium"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── CASE MANAGEMENT TAB ── */}
        {tab === 0 && (
          <div>
            {/* Sync + bulk actions bar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 rounded-full text-[13px] bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? "Syncing from FBI..." : "Sync from FBI"}
              </button>

              {/* Bulk type controls */}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[12px] text-gray-400 mr-1">
                  Bulk by type:
                </span>
                {[
                  "Missing Person",
                  "Unsolved Crime",
                  "Wanted Individual",
                ].map((t) => (
                  <div key={t} className="relative group">
                    <button className="px-2.5 py-1 rounded text-[11px] border border-gray-200 text-gray-600 hover:bg-gray-50">
                      {t}
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 hidden group-hover:block min-w-[120px]">
                      <button
                        onClick={() => handleBulkType(t, true)}
                        className="block w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50"
                      >
                        Show all
                      </button>
                      <button
                        onClick={() => handleBulkType(t, false)}
                        className="block w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 text-red-600"
                      >
                        Hide all
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk category controls */}
            {categories.length > 0 && (
              <div className="flex items-center gap-1 mb-4 flex-wrap">
                <span className="text-[12px] text-gray-400 mr-1">
                  Bulk by FBI category:
                </span>
                {categories.map((cat) => (
                  <div key={cat} className="relative group">
                    <button className="px-2.5 py-1 rounded text-[11px] border border-gray-200 text-gray-600 hover:bg-gray-50">
                      {cat}
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 hidden group-hover:block min-w-[120px]">
                      <button
                        onClick={() => handleBulkCategory(cat, true)}
                        className="block w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50"
                      >
                        Show all
                      </button>
                      <button
                        onClick={() => handleBulkCategory(cat, false)}
                        className="block w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 text-red-600"
                      >
                        Hide all
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status message */}
            {syncResult && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 mb-4 text-[13px]">
                {syncResult}
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <input
                type="text"
                placeholder="Search cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] w-[200px]"
              />
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px]"
              >
                <option>All</option>
                <option>FBI</option>
                <option>NCMEC</option>
                <option>Crime Stoppers</option>
                <option>User Submitted</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px]"
              >
                <option>All</option>
                <option>Missing Person</option>
                <option>Unsolved Crime</option>
                <option>Wanted Individual</option>
              </select>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px]"
              >
                <option>All</option>
                <option>Visible</option>
                <option>Hidden</option>
                <option>Featured</option>
              </select>
              <span className="text-[12px] text-gray-400 ml-auto">
                {filtered.length} of {cases.length} cases
              </span>
            </div>

            {/* Case table */}
            {loading ? (
              <div className="py-20 text-center text-gray-400 text-[14px]">
                Loading cases from Sanity...
              </div>
            ) : cases.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-[14px] mb-4">
                  No cases in Sanity yet. Click &quot;Sync from FBI&quot; to
                  import hundreds of cases from the FBI Wanted database.
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-400">
                      <th className="px-4 py-2.5">Case</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Source</th>
                      <th className="px-4 py-2.5">Location</th>
                      <th className="px-4 py-2.5 text-center">Visible</th>
                      <th className="px-4 py-2.5 text-center">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c._id}
                        className={`border-t border-gray-100 hover:bg-gray-50 ${
                          !c.visible ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            {c.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={c.imageUrl}
                                alt=""
                                className="w-8 h-8 rounded object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gray-200 shrink-0" />
                            )}
                            <span className="font-medium truncate max-w-[200px]">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ${
                              c.caseType === "Missing Person"
                                ? "bg-blue-50 text-blue-700"
                                : c.caseType === "Unsolved Crime"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {c.caseType}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 truncate max-w-[140px]">
                          {c.category ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500">
                          {c.source}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 truncate max-w-[120px]">
                          {c.location}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() =>
                              handleToggle(c._id, "visible", !c.visible)
                            }
                            className={`w-9 h-5 rounded-full relative transition-colors ${
                              c.visible ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                c.visible
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() =>
                              handleToggle(c._id, "featured", !c.featured)
                            }
                            className={`w-9 h-5 rounded-full relative transition-colors ${
                              c.featured ? "bg-yellow-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                c.featured
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {tab > 0 && (
          <div className="py-20 text-center text-gray-400 text-[14px]">
            {TABS[tab]} — coming soon
          </div>
        )}
      </div>
    </>
  );
}
