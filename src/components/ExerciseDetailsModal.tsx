import { motion } from "framer-motion";
import type { LoggedExercise } from "../types";

interface Props {
  exercise: LoggedExercise;
  onClose: () => void;
}

export default function ExerciseDetailsModal({ exercise, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-surface w-full max-w-md p-6 rounded-3xl shadow-2xl overflow-y-auto max-h-[80vh]"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
          <button onClick={onClose} className="text-muted hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Muscle Groups */}
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

          {/* Secondary Muscles */}
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? (
            <div>
              <h4 className="text-muted font-bold text-xs uppercase tracking-widest mb-2">
                Secondary Muscles
              </h4>
              <p className="text-text-primary text-sm">
                {exercise.secondaryMuscles.join(", ")}
              </p>
            </div>
          ) : null}

          {/* Equipment */}
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

          <div>
            <h4 className="text-muted font-bold text-xs uppercase tracking-widest mb-2">
              Instructions
            </h4>
            {exercise.description ? (
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
