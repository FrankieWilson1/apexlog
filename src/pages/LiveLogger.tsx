import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseSearch from "../components/ExerciseSearch"; // <-- Import the new modal
import { mockLiveWorkout } from "../data/mockData";
import type { LoggedExercise, ExerciseSet, ExerciseDefinition } from "../types"; // <-- Import ExerciseDefinition

export default function LiveLogger() {
  const [activeWorkout, setActiveWorkout] =
    useState<LoggedExercise[]>(mockLiveWorkout);

  // State to control the Search Modal visibility
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleUpdateSet = (
    setId: string,
    field: "weight" | "reps",
    value: number | "",
  ) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((ex) => ({
        ...ex,
        sets: ex.sets.map((set) =>
          set.id === setId ? { ...set, [field]: value } : set,
        ),
      })),
    );
  };

  const handleToggleSetComplete = (setId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((ex) => ({
        ...ex,
        sets: ex.sets.map((set) =>
          set.id === setId ? { ...set, isCompleted: !set.isCompleted } : set,
        ),
      })),
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.map((ex) => {
        if (ex.id === exerciseId) {
          const newSet: ExerciseSet = {
            id: `s-new-${Date.now()}`,
            setNumber: ex.sets.length + 1,
            previousStr: "-",
            weight: "",
            reps: "",
            isCompleted: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      }),
    );
  };

  // Converting a Dictionary Definition into a Logged Exercise
  const handleAddNewExercise = (exerciseDef: ExerciseDefinition) => {
    const newLoggedExercise: LoggedExercise = {
      id: `log-${Date.now()}`,
      name: exerciseDef.name,
      muscleGroups: exerciseDef.muscleGroups,
      sets: [
        {
          id: `s-new-${Date.now()}`,
          setNumber: 1,
          previousStr: "-",
          weight: "",
          reps: "",
          isCompleted: false,
        },
      ],
    };

    // Add it to the bottom of the workout list and close the modal
    setActiveWorkout([...activeWorkout, newLoggedExercise]);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 pt-12 flex flex-col gap-6 max-w-md mx-auto relative">
      <div className="sticky top-0 bg-background/90 backdrop-blur-md z-10 py-4 flex justify-between items-center border-b border-surface mb-2">
        <span className="text-muted font-mono text-lg">45:12</span>
        <h2 className="font-bold text-lg text-text-primary">
          Upper Body Power
        </h2>
        <button className="bg-emerald text-white px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">
          Finish
        </button>
      </div>

      <div className="flex flex-col gap-6 pb-24">
        {activeWorkout.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={handleUpdateSet}
            onToggleSetComplete={handleToggleSetComplete}
            onAddSet={handleAddSet}
          />
        ))}

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full border-2 border-dashed border-surface text-primary font-bold py-4 rounded-2xl hover:bg-surface/50 transition-colors"
        >
          + Add New Exercise
        </button>
      </div>

      {isSearchModalOpen && (
        <ExerciseSearch
          onClose={() => setIsSearchModalOpen(false)}
          onSelectExercise={handleAddNewExercise}
        />
      )}
    </div>
  );
}
