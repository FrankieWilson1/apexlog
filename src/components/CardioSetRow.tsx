/**
 * @file CardioSetRow.tsx
 * @description A single set row for cardio, bodyweight, and flexibility exercises.
 *
 * Unlike StrengthSetRow (weight × reps), this component renders only the
 * fields the user chose to track for that exercise (trackedFields).
 *
 * ## Field selector
 * A small "+" button on the first row opens an inline field picker
 * where the user can toggle which fields they want to track.
 * The selection is saved to the exercise's trackedFields array via
 * the onUpdateTrackedFields callback.
 *
 * @module components/CardioSetRow
 */

import { useState } from "react";
import type { ExerciseType, CardioSetRowProps } from "../types";

/** All possible cardio/bodyweight fields with labels and units */
const ALL_FIELDS: Record<string, { label: string; unit: string; placeholder: string }> = {
  duration:     { label: "Duration",  unit: "sec",    placeholder: "0" },
  distance:     { label: "Distance",  unit: "km",     placeholder: "0.0" },
  pace:         { label: "Pace",      unit: "min/km", placeholder: "0.0" },
  calories:     { label: "Calories",  unit: "kcal",   placeholder: "0" },
  floors:       { label: "Floors",    unit: "fl",     placeholder: "0" },
  laps:         { label: "Laps",      unit: "laps",   placeholder: "0" },
  skips:        { label: "Skips",     unit: "skips",  placeholder: "0" },
  reps:         { label: "Reps",      unit: "reps",   placeholder: "0" },
  holdDuration: { label: "Hold",      unit: "sec",    placeholder: "0" },
};

/** Fields available per exercise type */
const FIELDS_BY_TYPE: Record<ExerciseType, string[]> = {
  strength:    [],
  cardio:      ["duration", "distance", "pace", "calories", "floors", "laps", "skips"],
  bodyweight:  ["reps", "holdDuration", "duration"],
  flexibility: ["duration", "holdDuration"],
};

export default function CardioSetRow({
  set,
  setNumber,
  exerciseType,
  trackedFields,
  isFirstRow,
  onUpdate,
  onToggleComplete,
  onUpdateTrackedFields,
}: CardioSetRowProps) {
  const [showFieldPicker, setShowFieldPicker] = useState(false);

  const availableFields = FIELDS_BY_TYPE[exerciseType] || [];

  // A set is valid if at least one tracked field has a value
  const isValid =
    trackedFields.length > 0 &&
    trackedFields.some((field) => {
      const val = (set as any)[field];
      return val !== "" && val !== null && val !== undefined && Number(val) > 0;
    });

  const handleToggle = () => {
    if (!isValid && !set.isCompleted) return;
    onToggleComplete(set.id);
  };

  const toggleField = (field: string) => {
    const updated = trackedFields.includes(field)
      ? trackedFields.filter((f) => f !== field)
      : [...trackedFields, field];
    onUpdateTrackedFields(updated);
  };

  return (
    <div className={`py-2 transition-opacity ${set.isCompleted ? "opacity-50" : ""}`}>

      {/* Field selector — only on first row */}
      {isFirstRow && (
        <div className="mb-2">
          <button
            onClick={() => setShowFieldPicker(!showFieldPicker)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {showFieldPicker ? "Done" : "Choose fields to track"}
          </button>

          {showFieldPicker && (
            <div className="flex flex-wrap gap-2 mt-2">
              {availableFields.map((field) => {
                const isSelected = trackedFields.includes(field);
                const info = ALL_FIELDS[field];
                return (
                  <button
                    key={field}
                    onClick={() => toggleField(field)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: isSelected ? "#3B82F6" : "#334155",
                      color: isSelected ? "#ffffff" : "#94A3B8",
                    }}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Set row */}
      {trackedFields.length === 0 ? (
        <p className="text-muted text-xs py-1">
          Tap "Choose fields to track" above to start logging.
        </p>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Set number */}
          <span className="text-white font-bold text-sm w-6 flex-shrink-0">
            {setNumber}
          </span>

          {/* Dynamic field inputs */}
          {trackedFields.map((field) => {
            const info = ALL_FIELDS[field];
            if (!info) return null;
            const value = (set as any)[field] ?? "";

            return (
              <div key={field} className="flex flex-col items-center gap-0.5">
                <span className="text-muted text-[10px] font-medium">
                  {info.unit}
                </span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    onUpdate(
                      set.id,
                      field,
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  disabled={set.isCompleted}
                  placeholder={info.placeholder}
                  min={0}
                  className="bg-surface text-white text-center font-bold rounded-lg h-10 w-16 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 appearance-none text-sm"
                  aria-label={`${info.label} for set ${setNumber}`}
                />
              </div>
            );
          })}

          {/* Complete button */}
          <button
            onClick={handleToggle}
            disabled={!isValid && !set.isCompleted}
            className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ml-auto flex-shrink-0 ${
              set.isCompleted
                ? "bg-secondary text-white"
                : isValid
                  ? "bg-surface text-muted hover:text-white hover:bg-surface/80"
                  : "bg-surface text-surface cursor-not-allowed opacity-40"
            }`}
            aria-label={set.isCompleted ? `Undo set ${setNumber}` : `Complete set ${setNumber}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
              viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
