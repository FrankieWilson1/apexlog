/**
 * @file HistoryCard.tsx
 * @description A tappable past workout summary row for the HomeDashboard.
 *
 * Renders one `WorkoutSummary` as a full-width button that navigates to the
 * `/workout/:id` detail page on press. Displays the workout title, date,
 * total volume, duration, and exercise count.
 *
 * The component is a `<button>` (not a `<div>`) so it is keyboard accessible
 * and correctly communicates its interactive role to screen readers.
 *
 * @module components/HistoryCard
 */

import { useNavigate } from "react-router-dom";
import type { WorkoutSummary } from "../types";

interface HistoryCardProps {
  /** The workout session data to display */
  workout: WorkoutSummary;
}

/**
 * HistoryCard
 *
 * Renders a single past workout as a tappable list row. Tapping navigates
 * to the full `WorkoutDetail` page for that session.
 *
 * @param {HistoryCardProps} props
 * @param {WorkoutSummary}   props.workout - The workout summary to display.
 *
 * @example
 * <HistoryCard workout={workout} />
 */
export default function HistoryCard({ workout }: HistoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/workout/${workout.id}`)}
      className="w-full text-left py-4 border-b border-surface last:border-b-0 hover:bg-surface/20 active:bg-surface/40 transition-colors rounded-lg px-1 -mx-1"
      aria-label={`View details for ${workout.title} on ${workout.date}`}
    >
      {/* ── Row 1: title + date ── */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-bold text-lg">{workout.title}</h3>
        <span className="text-muted text-sm">{workout.date}</span>
      </div>

      {/* ── Row 2: volume · duration · exercise count ── */}
      <div className="flex items-center gap-2 text-muted text-sm font-mono">
        <span>{workout.volumeKg.toLocaleString()} kg Volume</span>
        <span className="text-surface">•</span>
        <span>{workout.durationMinutes}m</span>

        {/* Exercise count is only shown when the exercises snapshot exists */}
        {workout.exercises && workout.exercises.length > 0 && (
          <>
            <span className="text-surface">•</span>
            <span>{workout.exercises.length} exercises</span>
          </>
        )}
      </div>
    </button>
  );
}
