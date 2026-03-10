/**
 * @file SetRow.tsx
 * @description A single set input row inside an ExerciseCard.
 *
 * Renders one row in the set table with: the set number, the previous
 * performance string, a weight input, a reps input, and a checkmark
 * button to mark the set as complete.
 *
 * ## Completion validation
 * A set can only be marked complete if both `weight` and `reps` have been
 * filled in with values greater than zero. The checkmark button is visually
 * disabled and non-interactive until this condition is met. Once completed,
 * the inputs are locked (`disabled`) and the row dims to 50% opacity to
 * signal it is done.
 *
 * ## State ownership
 * This component holds no local state. All values come from the parent
 * `ExerciseCard` (which receives them from `LiveLogger`). Updates are
 * propagated upward via `onUpdate` and `onToggleComplete` callbacks.
 *
 * @module components/SetRow
 */

import type { SetRowProps } from "../types";

/**
 * SetRow
 *
 * Renders a single set row inside an exercise's set table during a live
 * workout session.
 *
 * @param {SetRowProps} props
 * @param {ExerciseSet} props.set              - The set data to display and edit.
 * @param {Function}    props.onUpdate         - Called when weight or reps changes.
 *                                               Signature: `(id, field, value) => void`
 * @param {Function}    props.onToggleComplete - Called when the checkmark is pressed.
 *                                               Signature: `(id) => void`
 *
 * @example
 * <SetRow
 *   set={set}
 *   onUpdate={(id, field, value) => handleUpdate(exerciseId, id, field, value)}
 *   onToggleComplete={(id) => handleToggle(exerciseId, id)}
 * />
 */
export default function SetRow({
  set,
  onUpdate,
  onToggleComplete,
}: SetRowProps) {
  /**
   * A set is valid (and can be marked complete) when both weight and reps
   * are filled in with positive numbers. Empty strings or zero values block completion.
   */
  const isValid =
    set.weight !== "" &&
    set.reps !== "" &&
    Number(set.weight) > 0 &&
    Number(set.reps) > 0;

  /**
   * Guards the toggle action.
   * Prevents marking an incomplete/empty set as done while still allowing
   * an already-completed set to be un-toggled.
   */
  const handleToggle = () => {
    if (!isValid && !set.isCompleted) return;
    onToggleComplete(set.id);
  };

  return (
    <div
      className={`grid grid-cols-[40px_1fr_60px_60px_40px] gap-2 items-center py-2 transition-colors duration-300 ${
        set.isCompleted ? "opacity-50" : ""
      }`}
    >
      {/* Set number indicator */}
      <span className="text-white font-bold text-center">{set.setNumber}</span>

      {/* Previous performance — shows last logged weight × reps for this exercise */}
      <span className="text-muted text-sm font-mono truncate">
        {set.previousStr || "-"}
      </span>

      {/* Weight input — disabled once the set is marked complete */}
      <input
        type="number"
        value={set.weight}
        onChange={(e) =>
          onUpdate(
            set.id,
            "weight",
            e.target.value === "" ? "" : Number(e.target.value),
          )
        }
        disabled={set.isCompleted}
        className="bg-surface text-white text-center font-bold rounded-lg h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 appearance-none"
        placeholder="-"
        min={0}
        aria-label={`Set ${set.setNumber} weight`}
      />

      {/* Reps input — disabled once the set is marked complete */}
      <input
        type="number"
        value={set.reps}
        onChange={(e) =>
          onUpdate(
            set.id,
            "reps",
            e.target.value === "" ? "" : Number(e.target.value),
          )
        }
        disabled={set.isCompleted}
        className="bg-surface text-white text-center font-bold rounded-lg h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 appearance-none"
        placeholder="-"
        min={0}
        aria-label={`Set ${set.setNumber} reps`}
      />

      {/*
       * Complete checkmark button
       * Three visual states:
       *   1. Completed  → green background (--color-secondary), white tick
       *   2. Valid      → grey background, tick visible on hover
       *   3. Invalid    → grey background, tick invisible, cursor blocked
       */}
      <button
        onClick={handleToggle}
        disabled={!isValid && !set.isCompleted}
        title={
          !isValid && !set.isCompleted ? "Enter weight and reps first" : ""
        }
        aria-label={
          set.isCompleted
            ? `Undo set ${set.setNumber}`
            : `Complete set ${set.setNumber}`
        }
        className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
          set.isCompleted
            ? "bg-secondary text-white"
            : isValid
              ? "bg-surface text-muted hover:text-white hover:bg-surface/80"
              : "bg-surface text-surface cursor-not-allowed opacity-40"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
