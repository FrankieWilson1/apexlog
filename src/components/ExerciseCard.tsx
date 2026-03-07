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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="bg-card/50 p-5 rounded-3xl border border-surface shadow-lg backdrop-blur-sm flex flex-col gap-3">
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center relative">
        <div>
          <h3 className="text-text-primary tracking-tight font-bold text-xl">
            {exercise.name}
          </h3>
          {exercise.muscleGroups?.length > 0 && (
            <p className="text-muted text-xs mt-0.5">
              {exercise.muscleGroups.join(" · ")}
            </p>
          )}
        </div>

        {/* 3-dot menu */}
        <button
          className="text-muted hover:text-white transition-colors active:scale-95 p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-8 right-0 w-48 bg-surface rounded-xl border border-white/10 shadow-xl overflow-hidden z-20">
              <button
                onClick={() => {
                  setIsDetailsOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                View Details
              </button>
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
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors font-semibold"
              >
                Delete Exercise
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── COLUMN HEADERS ── */}
      <div className="grid grid-cols-[40px_1fr_60px_60px_40px] gap-2 items-center text-xs font-semibold text-muted tracking-wide px-1">
        <span className="text-center">Set</span>
        <span>Previous</span>
        <span className="text-center">Kg</span>
        <span className="text-center">Reps</span>
        <span></span>
      </div>

      {/* ── SET ROWS ── */}
      <div className="flex flex-col divide-y divide-surface/50">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onUpdate={onUpdateSet}
            onToggleComplete={onToggleSetComplete}
          />
        ))}
      </div>

      {/* ── ADD SET BUTTON (matches Figma outlined style) ── */}
      <button
        onClick={() => onAddSet(exercise.id)}
        className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface text-primary text-sm font-semibold hover:bg-surface/50 active:scale-95 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Set
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
