import type { ExerciseCardProps } from '../types';
import SetRow from './SetRow';

export default function ExerciseCard({ exercise, onUpdateSet, onToggleSetComplete, onAddSet }: ExerciseCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 w-full flex flex-col gap-3 border border-surface shadow-sm">
      
      {/* Header: Title and Menu */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-text-primary font-bold text-lg">{exercise.name}</h3>
        {/* 3-dot menu icon */}
        <button className="text-muted hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[40px_1fr_60px_60px_40px] gap-2 items-center text-xs font-semibold text-muted tracking-wide px-1">
        <span className="text-center">Set</span>
        <span>Previous</span>
        <span className="text-center">kg</span>
        <span className="text-center">Reps</span>
        <span></span> {/* Empty space for the checkmark column */}
      </div>

      {/* The Set Rows */}
      <div className="flex flex-col">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onUpdate={onUpdateSet}
            onToggleComplete={onToggleSetComplete}
          />
        ))}
      </div>

      {/* The Ghost Button */}
      <button
        onClick={() => onAddSet(exercise.id)}
        className="mt-2 text-primary font-medium text-sm py-2 hover:bg-surface rounded-lg transition-colors w-full"
      >
        + Add Set
      </button>
      
    </div>
  );
}