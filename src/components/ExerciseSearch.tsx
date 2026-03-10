/**
 * @file ExerciseSearch.tsx
 * @description Full-screen exercise search modal used inside the Live Logger.
 *
 * Fetches up to 100 English-language exercises from the WGER API on mount,
 * then lets the user search by name and filter by muscle group. Selecting
 * an exercise calls `onSelectExercise` and the parent closes the modal.
 *
 * ## Layout
 * The modal takes over the full screen (`fixed inset-0 z-[100]`) and slides
 * up from the bottom using Tailwind's `animate-in slide-in-from-bottom-full`.
 * Content is constrained to `max-w-md` with a centre-aligned column layout.
 *
 * ## Data flow
 * - On mount, fetches WGER `/exerciseinfo/` and maps the raw payload to
 *   `ExerciseDefinition[]`, extracting the English translation name,
 *   category as the primary muscle group, and equipment as secondary muscles.
 * - `filteredExercises` is computed inline (no `useEffect`) by applying the
 *   active muscle-group chip and the search query together on every render.
 *
 * ## No sessionStorage caching here
 * Unlike `LibraryPage`, this component does not cache results — it refetches
 * on every mount. Caching is a planned v3 improvement.
 *
 * @module components/ExerciseSearch
 */

import { useState, useEffect } from "react";
import type { ExerciseDefinition } from "../types";

interface ExerciseSearchProps {
  /** Called when the user dismisses the modal without selecting an exercise */
  onClose: () => void;
  /**
   * Called when the user taps the `+` button on an exercise row.
   * The parent (`LiveLogger`) uses this to append the exercise to the
   * active workout and close the modal.
   */
  onSelectExercise: (exercise: ExerciseDefinition) => void;
}

/**
 * ExerciseSearch
 *
 * Full-screen slide-up modal for searching and adding exercises to the
 * active workout session. Fetches from the WGER API on mount.
 *
 * @param {ExerciseSearchProps} props
 */
export default function ExerciseSearch({
  onClose,
  onSelectExercise,
}: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiExercises, setApiExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /** Available muscle-group filter chips */
  const muscleFilters = ["All", "Chest", "Back", "Legs", "Arms", "Shoulders"];
  const [activeFilter, setActiveFilter] = useState("All");

  /**
   * Fetch exercises from WGER on mount.
   * Maps the raw API payload to `ExerciseDefinition[]`:
   * - `name` from the English translation (language id 2)
   * - `muscleGroups` from the exercise category name
   * - `secondaryMuscles` from the equipment list (repurposed field)
   * - `description` from the English translation HTML
   */
  useEffect(() => {
    const fetchWgerExercises = async () => {
      try {
        const response = await fetch(
          "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100",
        );
        const data = await response.json();

        const formattedExercises: ExerciseDefinition[] = data.results.map(
          (ex: any) => {
            const englishTranslation = ex.translations?.find(
              (t: any) => t.language === 2,
            );
            const exerciseName = englishTranslation?.name || "Unnamed Exercise";
            return {
              id: ex.id.toString() || Math.random().toString(),
              name: exerciseName,
              muscleGroups: [ex.category?.name || "General"],
              secondaryMuscles: ex.equipment?.map((e: any) => e.name) || [],
              description: englishTranslation?.description || "",
            };
          },
        );

        setApiExercises(formattedExercises);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWgerExercises();
  }, []);

  /**
   * Inline filtered list — recomputed on every render.
   * Applies the active muscle-group chip first, then the search query.
   */
  const filteredExercises = apiExercises.filter((ex) => {
    const matchesSearch = (ex.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || ex.muscleGroups.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-md mx-auto w-full flex flex-col h-full border-x border-surface">
        {/* ── TOP BAR: close button | title | spacer ── */}
        <div className="flex justify-between items-center p-6 pb-2">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-muted hover:text-white transition-colors"
            aria-label="Close exercise search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Add Exercise
          </h2>
          {/* Right spacer keeps the title visually centred */}
          <div className="w-10" />
        </div>

        {/* ── SEARCH INPUT — auto-focused on open ── */}
        <div className="px-6 py-4">
          <div className="relative group">
            <span className="absolute left-4 top-3.5 text-muted group-focus-within:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </span>
            <input
              type="text"
              placeholder="Search 1,000+ exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 text-white pl-12 pr-4 py-3.5 rounded-2xl border border-white/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50"
              autoFocus
            />
          </div>
        </div>

        {/* ── MUSCLE GROUP FILTER CHIPS — horizontally scrollable ── */}
        <div className="flex gap-2 overflow-x-auto px-6 py-2 no-scrollbar">
          {muscleFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface border-white/5 text-muted hover:border-white/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── RESULTS LIST ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 mt-2 space-y-3 no-scrollbar">
          {isLoading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center h-40">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted font-medium animate-pulse">
                Consulting library...
              </p>
            </div>
          ) : filteredExercises.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <p className="text-muted text-lg italic">
                No movements found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            /* Exercise rows — tap `+` to add to active workout */
            filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="group flex justify-between items-center py-4 border-b border-surface last:border-b-0"
              >
                <div className="flex-1 pr-4">
                  <h4 className="text-white font-bold text-base leading-tight">
                    {ex.name}
                  </h4>
                  <p className="text-muted text-sm mt-0.5">
                    {ex.muscleGroups.join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => onSelectExercise(ex)}
                  className="w-9 h-9 flex items-center justify-center bg-surface border border-white/10 rounded-full text-primary hover:bg-primary hover:text-white transition-all"
                  aria-label={`Add ${ex.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
