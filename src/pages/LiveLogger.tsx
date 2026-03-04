import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { mockLiveWorkout } from "../data/mockData";
import type { LoggedExercise, ExerciseSet } from "../types";

export default function LiveLogger() {
  // Initialize state with mock data
  const [activeWorkout, setActiveWorkout] =
    useState<LoggedExercise[]>(mockLiveWorkout);

  const handleUpdateSet = (
    setId: string,
    field: "weight" | "reps",
    value: number | "",
  ) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId ? { ...set, [field]: value } : set,
        ),
      })),
    );
  };

  // Toggling the checkmark
  const handleToggleSetComplete = (setId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId
            ? {
                ...set,
                isCompleted: !set.isCompleted,
              }
            : set,
        ),
      })),
    );
  };

  // Adds a new row
  const handleAddSet = (exerciseId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSetNumber = exercise.sets.length + 1;
          const newSet: ExerciseSet = {
            id: `s-new-${Date.now()}`, // Generate a unique ID
            setNumber: newSetNumber,
            previousStr: "-", // For empty data
            weight: "",
            reps: "",
            isCompleted: false,
          };
          return { ...exercise, sets: [...exercise.sets, newSet] };
        }
        return exercise;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 pt-12 flex flex-col gap-6 max-w-md mx-auto">
      <div className="sticky top-0 bg-background/90 backdrop-blur-md z-10 py-4 flex justify-between items-center border-b border-surface mb-2">
        <span className="text-muted font-mono text-lg">45:12</span>
        <h2 className="font-bold text-lg text-text-primary">
          Upper Body Power
        </h2>
        <button className="bg-emerald text-white px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">
          Finish
        </button>
      </div>

      <div className="flex flex-col gap-6 pb-20">
        {activeWorkout.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={handleUpdateSet}
            onToggleSetComplete={handleToggleSetComplete}
            onAddSet={handleAddSet}
          />
        ))}
      </div>
    </div>
  );
}
