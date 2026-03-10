/**
 * @file WorkoutDetail.tsx
 * @description Full set-by-set breakdown page for a single completed workout.
 *
 * Reads the workout id from the URL param (`/workout/:id`), looks it up in
 * the user's localStorage history, and renders a detailed summary including:
 * - Three stat cards: duration, total volume (kg), and exercise count
 * - A per-exercise breakdown table (set number, previous, weight, reps)
 * - A footer note with completed-set totals
 *
 * ## Not-found handling
 * If no workout matches the id (e.g. stale URL, cleared history), a
 * friendly not-found state is rendered with a back link to `/dashboard`.
 *
 * ## Completed set styling
 * Sets where `isCompleted === true` render their weight and reps cells in
 * the secondary (green) colour at reduced opacity to visually distinguish
 * them from incomplete sets.
 *
 * @module pages/WorkoutDetail
 */

import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../context/useAuth";
import type { WorkoutSummary } from "../types";

/**
 * WorkoutDetail
 *
 * Reads `/workout/:id` from the URL, finds the matching session in the
 * user's history, and renders a full set-by-set breakdown. Shows a
 * not-found state if the id is invalid.
 */
export default function WorkoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { historyKey } = useAuth();
  const [history] = useLocalStorage<WorkoutSummary[]>(historyKey, []);

  const workout = history.find((w) => w.id === id);

  // ── Not-found guard ───────────────────────────────────────────────────────
  if (!workout) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6">
        <p className="text-muted text-lg mb-4">Workout not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-primary font-semibold hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────────

  /** Total number of sets across all exercises in this session */
  const totalSets =
    workout.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) ?? 0;

  /** Number of sets that were marked as completed */
  const completedSets =
    workout.exercises?.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.isCompleted).length,
      0,
    ) ?? 0;

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-6 pb-32 mx-auto max-w-lg lg:pt-28 lg:pb-16">
        {/* ── HEADER: back chevron | title + date ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted hover:text-white transition-colors"
            aria-label="Back to dashboard"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {workout.title}
            </h1>
            <p className="text-muted text-sm">{workout.date}</p>
          </div>
        </div>

        {/* ── STAT CARDS: duration | volume | exercises ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card/50 rounded-2xl border border-surface p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {workout.durationMinutes}m
            </p>
            <p className="text-muted text-xs mt-1">Duration</p>
          </div>
          <div className="bg-card/50 rounded-2xl border border-surface p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {workout.volumeKg.toLocaleString()}
            </p>
            <p className="text-muted text-xs mt-1">kg Volume</p>
          </div>
          <div className="bg-card/50 rounded-2xl border border-surface p-4 text-center">
            <p className="text-2xl font-bold text-text-primary">
              {workout.exercises?.length ?? "—"}
            </p>
            <p className="text-muted text-xs mt-1">Exercises</p>
          </div>
        </div>

        {/* ── EXERCISE BREAKDOWN ── */}
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">
              Exercise Breakdown
            </h2>

            {workout.exercises.map((ex, i) => (
              <div
                key={i}
                className="bg-card/50 rounded-2xl border border-surface p-5"
              >
                <h3 className="font-bold text-text-primary text-base mb-3">
                  {ex.name}
                </h3>

                {/* Column headers */}
                <div className="grid grid-cols-[40px_1fr_60px_60px] gap-2 text-xs font-semibold text-muted mb-2 px-1">
                  <span className="text-center">Set</span>
                  <span>Previous</span>
                  <span className="text-center">Kg</span>
                  <span className="text-center">Reps</span>
                </div>

                {/* Set rows */}
                {ex.sets.map((set, j) => (
                  <div
                    key={j}
                    className={`grid grid-cols-[40px_1fr_60px_60px] gap-2 items-center py-2 border-t border-surface/50 ${
                      set.isCompleted ? "opacity-60" : ""
                    }`}
                  >
                    <span className="text-white font-bold text-center text-sm">
                      {set.setNumber}
                    </span>
                    <span className="text-muted text-sm font-mono truncate">
                      {set.previousStr}
                    </span>
                    {/* Weight cell — green tint when completed */}
                    <div
                      className={`rounded-lg py-1.5 text-center text-sm font-bold ${
                        set.isCompleted
                          ? "bg-secondary/20 text-secondary"
                          : "bg-surface text-white"
                      }`}
                    >
                      {set.weight || "—"}
                    </div>
                    {/* Reps cell — green tint when completed */}
                    <div
                      className={`rounded-lg py-1.5 text-center text-sm font-bold ${
                        set.isCompleted
                          ? "bg-secondary/20 text-secondary"
                          : "bg-surface text-white"
                      }`}
                    >
                      {set.reps || "—"}
                    </div>
                  </div>
                ))}

                {/* Per-exercise completion summary */}
                <p className="text-muted text-xs mt-3 text-right">
                  {ex.sets.filter((s) => s.isCompleted).length} /{" "}
                  {ex.sets.length} sets completed
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback for legacy sessions saved before exercise snapshot was added */
          <div className="bg-card/50 rounded-2xl border border-surface p-8 text-center">
            <p className="text-muted text-sm">
              Detailed exercise data isn't available for this session.
            </p>
            <p className="text-muted text-xs mt-2">
              Future workouts will show full exercise breakdown here.
            </p>
          </div>
        )}

        {/* ── FOOTER: overall completion count ── */}
        {totalSets > 0 && (
          <p className="text-center text-muted text-xs mt-6">
            {completedSets} of {totalSets} total sets completed
          </p>
        )}
      </div>
    </div>
  );
}
