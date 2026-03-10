/**
 * @file ExerciseCard.tsx
 * @description Renders a single exercise card within the Live Logger session.
 *
 * Each card displays the exercise name, targeted muscle groups, a column-header
 * row, all logged sets (via `SetRow`), an "Add Set" button, and a 3-dot context
 * menu with options to view details, remove the last set, or delete the exercise.
 *
 * ## State ownership
 * This component is intentionally **presentation-only** for workout data — all
 * mutations (add set, remove exercise, toggle complete) are delegated upward to
 * `LiveLogger` via props callbacks. The only local state managed here is UI state:
 * whether the dropdown menu is open, and whether the details modal is open.
 *
 * @module components/ExerciseCard
 */

import { useState } from "react";
import type { ExerciseCardProps } from "../types";
import SetRow from "./SetRow";
import ExerciseDetailsModal from "./ExerciseDetailsModal";

/**
 * ExerciseCard
 *
 * Renders one logged exercise card inside an active workout session, including
 * its full set table and all interaction controls.
 *
 * @param {ExerciseCardProps}  props
 * @param {LoggedExercise}     props.exercise            - The exercise data to display.
 * @param {Function}           props.onUpdateSet         - Called when weight or reps changes on a set.
 *                                                         Signature: `(setId, field, value) => void`
 * @param {Function}           props.onToggleSetComplete - Called when the checkmark on a set is toggled.
 *                                                         Signature: `(setId) => void`
 * @param {Function}           props.onAddSet            - Called when the "Add Set" button is pressed.
 *                                                         Signature: `(exerciseId) => void`
 * @param {Function}           props.onRemoveExercise    - Called when "Delete Exercise" is selected.
 *                                                         Signature: `(exerciseId) => void`
 * @param {Function}           props.onRemoveLastSet     - Called when "Remove Last Set" is selected.
 *                                                         Signature: `(exerciseId) => void`
 *
 * @example
 * <ExerciseCard
 *   exercise={ex}
 *   onUpdateSet={(setId, field, value) => handleUpdate(ex.id, setId, field, value)}
 *   onToggleSetComplete={(setId) => handleToggle(ex.id, setId)}
 *   onAddSet={(exerciseId) => handleAddSet(exerciseId)}
 *   onRemoveExercise={(exerciseId) => handleRemove(exerciseId)}
 *   onRemoveLastSet={(exerciseId) => handleRemoveLast(exerciseId)}
 * />
 */
export default function ExerciseCard({
  exercise,
  onUpdateSet,
  onToggleSetComplete,
  onAddSet,
  onRemoveExercise,
  onRemoveLastSet,
}: ExerciseCardProps) {
  /** Controls visibility of the 3-dot overflow dropdown menu */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** Controls visibility of the full Exercise Details modal */
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="bg-card/50 p-5 rounded-3xl border border-surface shadow-lg backdrop-blur-sm flex flex-col gap-3">
      {/* ── HEADER: name, muscle groups, 3-dot menu ─────────────────────── */}
      <div className="flex justify-between items-center relative">
        <div>
          <h3 className="text-text-primary tracking-tight font-bold text-xl">
            {exercise.name}
          </h3>
          {/* Only render muscle group tags if the exercise has them */}
          {exercise.muscleGroups?.length > 0 && (
            <p className="text-muted text-xs mt-0.5">
              {exercise.muscleGroups.join(" · ")}
            </p>
          )}
        </div>

        {/* 3-dot overflow menu trigger */}
        <button
          className="text-muted hover:text-white transition-colors active:scale-95 p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={`Options for ${exercise.name}`}
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

        {/* Dropdown menu — absolutely positioned, layered above other cards */}
        {isMenuOpen && (
          <>
            {/*
             * Invisible full-screen backdrop — clicking anywhere outside the
             * dropdown closes it without requiring an explicit close button.
             */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-8 right-0 w-48 bg-surface rounded-xl border border-white/10 shadow-xl overflow-hidden z-20">
              {/* View Details — opens the ExerciseDetailsModal */}
              <button
                onClick={() => {
                  setIsDetailsOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                View Details
              </button>

              {/* Remove Last Set — non-destructive, only removes the last row */}
              <button
                onClick={() => {
                  onRemoveLastSet(exercise.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                Remove Last Set
              </button>

              {/* Delete Exercise — destructive, styled red to signal danger */}
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

      {/* ── COLUMN HEADERS for the set table ────────────────────────────── */}
      <div className="grid grid-cols-[40px_1fr_60px_60px_40px] gap-2 items-center text-xs font-semibold text-muted tracking-wide px-1">
        <span className="text-center">Set</span>
        <span>Previous</span>
        <span className="text-center">Kg</span>
        <span className="text-center">Reps</span>
        <span></span>
      </div>

      {/* ── SET ROWS — one SetRow component per logged set ───────────────── */}
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

      {/* ── ADD SET — outlined button, positioned at the bottom of the card */}
      <button
        onClick={() => onAddSet(exercise.id)}
        className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface text-primary text-sm font-semibold hover:bg-surface/50 active:scale-95 transition-all"
        aria-label={`Add a set to ${exercise.name}`}
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

      {/* Exercise details modal — only mounted when opened to save memory */}
      {isDetailsOpen && (
        <ExerciseDetailsModal
          exercise={exercise}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}
