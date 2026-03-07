import { useState } from "react";
import type { ExerciseCardProps } from "../types";
import SetRow from "./SetRow";
import ExerciseDetailsModal from "./ExerciseDetailsModal";
export default function ExerciseCard({
  exercise,
  onUpdateSet,
  onToggleSetComplete,
  onAddSet,
  onRemoveExercise,
  onRemoveLastSet,
}: ExerciseCardProps) {
  // State to control the card drop-down menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="bg-card/50 p-6 rounded-3xl border border-surface shadow-lg backdrop-blur-sm flex flex-col gap-4">
      {/* Header area with 3-dot button */}
      <div className="flex justify-between items-center mb-2 relative">
        <h3 className="text-text-primary tracking-tight font-bold text-xl">
          {exercise.name}
        </h3>
        {/* 3-dot menu icon */}
        <button
          className="text-muted hover:text-white transition-colors active:scale-95"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* 3-dot SVG Icon */}
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
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-10 right-0 w-48 bg-surface rounded-xl border-white/10 shadow overflow-hidden z-20">
              <button
                onClick={() => {
                  onRemoveLastSet(exercise.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                Remove Last Set
              </button>
              <button
                onClick={() => {
                  onRemoveExercise(exercise.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red/10 transition-colors font-semibold"
              >
                Delete Exercise
              </button>
              <button
                onClick={() => {
                  setIsDetailsOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                View Details
              </button>
            </div>
          </>
        )}
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

      {isDetailsOpen && (
        <ExerciseDetailsModal
          exercise={exercise}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}
