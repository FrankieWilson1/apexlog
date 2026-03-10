/**
 * @file ExerciseDetailsModal.tsx
 * @description Modal overlay showing the full details of a logged exercise.
 *
 * Displays the exercise name, primary muscle groups (as pill badges),
 * secondary muscles, equipment, and HTML instructions from the WGER API.
 * Uses `framer-motion` for a scale-fade entrance animation.
 *
 * ## Animation
 * The modal panel animates in from `scale: 0.9, opacity: 0` to
 * `scale: 1, opacity: 1` via `framer-motion`'s `motion.div`. The backdrop
 * is a semi-transparent `bg-background/80` blur overlay.
 *
 * ## HTML description
 * The `exercise.description` field contains raw HTML from the WGER API.
 * It is rendered via `dangerouslySetInnerHTML` inside a `prose prose-invert`
 * container. Content comes from a trusted third-party API (WGER) and is
 * not user-generated, so XSS risk is acceptable here. A future improvement
 * would be to sanitize with DOMPurify.
 *
 * ## Optional fields
 * `secondaryMuscles` and `equipment` sections are only rendered if the
 * arrays are non-empty, keeping the modal clean for exercises with minimal
 * metadata.
 *
 * @module components/ExerciseDetailsModal
 */

import { motion } from "framer-motion";
import type { LoggedExercise } from "../types";

interface Props {
  /** The exercise whose details are being displayed */
  exercise: LoggedExercise;
  /** Called when the user closes the modal */
  onClose: () => void;
}

/**
 * ExerciseDetailsModal
 *
 * Animated modal showing full details for a single exercise: name,
 * primary muscles, secondary muscles, equipment, and instructions.
 * Rendered on top of the Live Logger via `z-[60]`.
 *
 * @param {Props} props
 */
export default function ExerciseDetailsModal({ exercise, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-surface w-full max-w-md p-6 rounded-3xl shadow-2xl overflow-y-auto max-h-[80vh]"
      >
        {/* ── HEADER: exercise name + close button ── */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white p-1 transition-colors"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* ── PRIMARY MUSCLES — pill badges ── */}
          <div>
            <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-2">
              Primary Focus
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((m) => (
                <span
                  key={m}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* ── SECONDARY MUSCLES — only rendered if non-empty ── */}
          {exercise.secondaryMuscles &&
            exercise.secondaryMuscles.length > 0 && (
              <div>
                <h4 className="text-muted font-bold text-xs uppercase tracking-widest mb-2">
                  Secondary Muscles
                </h4>
                <p className="text-text-primary text-sm">
                  {exercise.secondaryMuscles.join(", ")}
                </p>
              </div>
            )}

          {/* ── EQUIPMENT — only rendered if non-empty ── */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div>
              <h4 className="text-muted font-bold text-xs uppercase tracking-widest mb-2">
                Equipment
              </h4>
              <p className="text-text-primary text-sm">
                {exercise.equipment.join(", ")}
              </p>
            </div>
          )}

          {/* ── INSTRUCTIONS — raw HTML from WGER API ── */}
          <div>
            <h4 className="text-muted font-bold text-xs uppercase tracking-widest mb-2">
              Instructions
            </h4>
            {exercise.description ? (
              /*
               * dangerouslySetInnerHTML is used here because the WGER API
               * returns HTML-formatted descriptions. Content is from a
               * trusted API (not user-generated). A future improvement
               * would sanitize with DOMPurify before rendering.
               */
              <div
                className="text-muted text-sm leading-relaxed prose prose-invert"
                dangerouslySetInnerHTML={{ __html: exercise.description }}
              />
            ) : (
              <p className="text-muted/50 text-sm italic">
                No detailed instructions available for this movement.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
