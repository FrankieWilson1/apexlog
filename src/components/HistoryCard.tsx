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
import type { HistoryCardProps } from "../types";

export default function HistoryCard({ workout, hasPR }: HistoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/workout/${workout.id}`)}
      className="w-full text-left py-4 border-b border-surface last:border-b-0 hover:bg-surface/20 active:bg-surface/40 transition-colors rounded-lg px-1 -mx-1"
      aria-label={`View details for ${workout.title} on ${workout.date}`}
    >
      {/* ── Row 1: title + date + PR badge ── */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-white font-bold text-lg truncate">
            {workout.title}
          </h3>
          {/* PR badge — only shown when this session set a new record */}
          {hasPR && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: "rgba(251,191,36,0.12)",
                color: "#FBB124",
                border: "1px solid rgba(251,191,36,0.25)",
              }}
            >
              🏆 PR
            </span>
          )}
        </div>
        <span className="text-muted text-sm flex-shrink-0 ml-2">
          {workout.date}
        </span>
      </div>

      {/* ── Row 2: volume · duration · exercise count ── */}
      <div className="flex items-center gap-2 text-muted text-sm font-mono">
        <span>{workout.volumeKg.toLocaleString()} kg Volume</span>
        <span className="text-surface">•</span>
        <span>{workout.durationMinutes}m</span>
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
