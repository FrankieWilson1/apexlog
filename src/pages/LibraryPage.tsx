/**
 * @file LibraryPage.tsx
 * @description Browsable exercise library page powered by the WGER API.
 *
 * Fetches up to 100 English-language exercises from the WGER open fitness
 * API on first mount, caches the result in `sessionStorage` for the
 * duration of the browser session, and presents them in a searchable,
 * filterable accordion list.
 *
 * ## Data flow
 * 1. On mount, check `sessionStorage` for `apexlog_library_cache`.
 * 2. Cache hit → parse and hydrate state immediately (no network request).
 * 3. Cache miss → fetch from WGER, map the raw payload to `WgerExercise[]`,
 *    cache the result, then hydrate state.
 *
 * ## Filtering
 * Two independent filter mechanisms, applied together via a `useEffect`:
 * - **Filter chips** — map to `ex.category` or `ex.muscles` substring match.
 * - **Search input** — matches `ex.name` case-insensitively.
 *
 * ## Accordion
 * Each exercise row is a button that toggles its description + muscle tags
 * panel open/closed. Only one row is open at a time (`expanded` holds the
 * id of the currently open row, or `null`).
 *
 * ## Colour coding
 * Each exercise is colour-coded by category via `MUSCLE_COLORS`. The colour
 * is used for the left accent bar, muscle tag backgrounds, and the category
 * label in the collapsed row.
 *
 * @module pages/LibraryPage
 */

import { useState, useEffect } from "react";
import type { WgerExercise } from "../types";

/** Filter chip definitions — value is matched against category and muscle names */
const FILTER_CHIPS = [
  { label: "All", value: "" },
  { label: "Chest", value: "Chest" },
  { label: "Back", value: "Back" },
  { label: "Legs", value: "Legs" },
  { label: "Arms", value: "Arms" },
  { label: "Shoulders", value: "Shoulders" },
  { label: "Core", value: "Core" },
];

/** Colour map from category name to hex — used for accent bars and tags */
const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#3B82F6",
  Back: "#10B981",
  Legs: "#F97316",
  Arms: "#8B5CF6",
  Shoulders: "#EC4899",
  Core: "#F59E0B",
  Default: "#94A3B8",
};

/**
 * LibraryPage
 *
 * Displays a searchable, filterable list of exercises from the WGER API.
 * Results are cached in `sessionStorage` for the duration of the session.
 */
export default function LibraryPage() {
  /** Full fetched/cached exercise list */
  const [exercises, setExercises] = useState<WgerExercise[]>([]);

  /** Filtered subset currently visible in the list */
  const [filtered, setFiltered] = useState<WgerExercise[]>([]);

  /** Active muscle-group filter chip value ("" = All) */
  const [activeFilter, setActiveFilter] = useState("");

  /** Search query string */
  const [search, setSearch] = useState("");

  /** Whether the API fetch is in progress */
  const [loading, setLoading] = useState(true);

  /** Id of the currently expanded accordion row, or null */
  const [expanded, setExpanded] = useState<number | null>(null);

  /**
   * Fetch / hydrate exercise data on mount.
   * Checks sessionStorage first; falls back to WGER API fetch.
   */
  useEffect(() => {
    const cached = sessionStorage.getItem("apexlog_library_cache");
    if (cached) {
      const data = JSON.parse(cached);
      setExercises(data);
      setFiltered(data);
      setLoading(false);
      return;
    }

    fetch(
      "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&format=json",
    )
      .then((r) => r.json())
      .then((data) => {
        const mapped: WgerExercise[] = data.results.map((ex: any) => ({
          id: ex.id,
          name:
            ex.translations?.find((t: any) => t.language === 2)?.name ||
            ex.name ||
            "Unknown",
          description:
            ex.translations
              ?.find((t: any) => t.language === 2)
              ?.description?.replace(/<[^>]*>/g, "") || "",
          muscles: ex.muscles?.map((m: any) => m.name_en) || [],
          category: ex.category?.name || "General",
        }));
        setExercises(mapped);
        setFiltered(mapped);
        sessionStorage.setItem("apexlog_library_cache", JSON.stringify(mapped));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /**
   * Re-filter whenever the active chip, search query, or exercise list changes.
   * Chip filter matches against category name and muscle names (case-insensitive).
   * Search filter matches against exercise name.
   */
  useEffect(() => {
    let result = exercises;
    if (activeFilter) {
      result = result.filter(
        (ex) =>
          ex.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
          ex.muscles.some((m) =>
            m.toLowerCase().includes(activeFilter.toLowerCase()),
          ),
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((ex) => ex.name.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeFilter, search, exercises]);

  /**
   * getColor
   *
   * Returns the hex accent colour for a given exercise category.
   *
   * @param {string} category - The WGER category name (e.g. "Chest").
   * @returns {string} Hex colour string.
   */
  const getColor = (category: string): string =>
    MUSCLE_COLORS[category] || MUSCLE_COLORS.Default;

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-32 mx-auto max-w-2xl lg:px-8 lg:pt-28 lg:pb-16">
        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Exercise Library
          </h1>
          <p className="text-muted text-sm">
            {loading ? "Loading..." : `${filtered.length} exercises`} — browse
            without logging
          </p>
        </div>

        {/* ── SEARCH INPUT ── */}
        <div className="relative mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-4 top-3.5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-surface text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors placeholder:text-muted text-sm"
          />
        </div>

        {/* ── FILTER CHIPS — horizontally scrollable on mobile ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveFilter(chip.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === chip.value
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* ── RESULTS ── */}
        {loading ? (
          /* Loading spinner */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm">Loading exercise library...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state with clear-filters CTA */
          <div className="text-center py-16">
            <p className="text-muted text-lg mb-2">No exercises found</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("");
              }}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Accordion list */
          <div className="space-y-2">
            {filtered.map((ex) => {
              const color = getColor(ex.category);
              const isOpen = expanded === ex.id;
              return (
                <div
                  key={ex.id}
                  className="bg-card/50 rounded-2xl border border-surface overflow-hidden"
                >
                  {/* Collapsed row — tap to expand */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : ex.id)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Category accent bar */}
                      <div
                        className="w-2 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">
                          {ex.name}
                        </p>
                        <p className="text-muted text-xs">
                          {ex.category}
                          {ex.muscles.length > 0
                            ? ` · ${ex.muscles.slice(0, 2).join(", ")}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    {/* Chevron — rotates when open */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-muted flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded panel — description + muscle tags */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 border-t border-surface">
                      {ex.description ? (
                        <p className="text-muted text-sm leading-relaxed mt-3">
                          {/* Truncate long descriptions at 300 chars */}
                          {ex.description.slice(0, 300)}
                          {ex.description.length > 300 ? "..." : ""}
                        </p>
                      ) : (
                        <p className="text-muted text-sm mt-3 italic">
                          No description available.
                        </p>
                      )}
                      {ex.muscles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {ex.muscles.map((m, i) => (
                            <span
                              key={i}
                              className="text-xs font-semibold px-3 py-1 rounded-full"
                              style={{ backgroundColor: `${color}22`, color }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
