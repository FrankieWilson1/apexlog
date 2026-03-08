import { useState, useEffect } from "react";
import type { WgerExercise } from "../types";

const FILTER_CHIPS = [
  { label: "All", value: "" },
  { label: "Chest", value: "Chest" },
  { label: "Back", value: "Back" },
  { label: "Legs", value: "Legs" },
  { label: "Arms", value: "Arms" },
  { label: "Shoulders", value: "Shoulders" },
  { label: "Core", value: "Core" },
];

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#3B82F6",
  Back: "#10B981",
  Legs: "#F97316",
  Arms: "#8B5CF6",
  Shoulders: "#EC4899",
  Core: "#F59E0B",
  Default: "#94A3B8",
};

export default function LibraryPage() {
  const [exercises, setExercises] = useState<WgerExercise[]>([]);
  const [filtered, setFiltered] = useState<WgerExercise[]>([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

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

  const getColor = (category: string) => {
    return MUSCLE_COLORS[category] || MUSCLE_COLORS.Default;
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-32 mx-auto max-w-2xl lg:px-8 lg:pt-28 lg:pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Exercise Library
          </h1>
          <p className="text-muted text-sm">
            {loading ? "Loading..." : `${filtered.length} exercises`} — browse
            without logging
          </p>
        </div>

        {/* Search */}
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

        {/* Filter chips */}
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

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm">Loading exercise library...</p>
          </div>
        ) : filtered.length === 0 ? (
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
          <div className="space-y-2">
            {filtered.map((ex) => {
              const color = getColor(ex.category);
              const isOpen = expanded === ex.id;
              return (
                <div
                  key={ex.id}
                  className="bg-card/50 rounded-2xl border border-surface overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : ex.id)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 border-t border-surface">
                      {ex.description ? (
                        <p className="text-muted text-sm leading-relaxed mt-3">
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
