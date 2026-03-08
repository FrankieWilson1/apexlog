import { useNavigate } from "react-router-dom";
import type { WorkoutSummary } from "../types";

interface HistoryCardProps {
  workout: WorkoutSummary;
}

export default function HistoryCard({ workout }: HistoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/workout/${workout.id}`)}
      className="w-full text-left py-4 border-b border-surface last:border-b-0 hover:bg-surface/20 active:bg-surface/40 transition-colors rounded-lg px-1 -mx-1"
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-bold text-lg">{workout.title}</h3>
        <span className="text-muted text-sm">{workout.date}</span>
      </div>
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
