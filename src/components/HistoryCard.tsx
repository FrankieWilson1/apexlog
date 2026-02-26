import type { WorkoutSummary } from "../types";

// We tell React exactly what props this component expects
interface HistoryCardProps {
  workout: WorkoutSummary;
}

export default function HistoryCard({ workout }: HistoryCardProps) {
  return (
    // bg-card pulls the #1E293B color straight from your index.css!
    <div className="bg-card p-4 rounded-2xl w-full flex flex-col gap-3">
      {/* Top Row: Title and Date */}
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">{workout.title}</h3>
        <span className="text-muted text-sm">{workout.date}</span>
      </div>

      {/* Bottom Row: Duration and Volume */}
      {/* font-mono perfectly matches your Figma design choice here */}
      <div className="flex gap-4 text-muted text-sm font-mono">
        <div className="flex items-center gap-1.5">
          <span>⏱️</span>
          <span>{workout.durationMinutes}m</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>⚖️</span>
          {/* toLocaleString() adds the comma so 4200 becomes 4,200 */}
          <span>{workout.volumeKg.toLocaleString()} kg Volume</span>
        </div>
      </div>
    </div>
  );
}
