import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseSearch from "../components/ExerciseSearch";
import { mockLiveWorkouts, mockRecentWorkouts } from "../data/mockData";
import {
  type LoggedExercise,
  type ExerciseSet,
  type ExerciseDefinition,
  type WorkoutSummary,
} from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function LiveLogger() {
  const navigate = useNavigate();

  // Pulls in the active workout state
  const [activeWorkout, setActiveWorkout] = useLocalStorage<LoggedExercise[]>(
    "appexlog_active_workout",
    mockLiveWorkouts,
  );

  // Pulls in the history state
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutSummary[]>(
    "apexlog_history",
    mockRecentWorkouts,
  );

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

    setActiveWorkout([...activeWorkout, newLoggedExercise]);
    setIsSearchModalOpen(false);
  };

  // Finishing the Workout
  const handleFinishWorkout = () => {
    let totalVolume = 0;
    activeWorkout.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.isCompleted && set.weight && set.reps) {
          totalVolume += Number(set.weight) * Number(set.reps);
        }
      });
    });

    const completedWorkout: WorkoutSummary = {
      id: `wo-${Date.now()}`,
      title: activeWorkout[0]?.name || "Custom Workout",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volumeKg: totalVolume,
      durationMinutes: 45,
    };

    setWorkoutHistory([completedWorkout, ...workoutHistory]);
    setActiveWorkout([]);
    navigate("/dashboard");
  };

  // Deletes an entire exercise card
  const handleRemoveExercise = (exercseId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.filter((ex) => ex.id !== exercseId),
    );
  };

  // Removes button set from an exercise
  // const handleRemoveLastSet = (exerciseId: string) => {
  //   setActiveWorkout((prevWorkout) =>
  //     prevWorkout.map((ex) => {
  //       if (ex.id === exerciseId && ex.sets.length > 0) {
  //         // Create a new array without the last item
  //         return { ...ex, sets: ex.sets.slice(0, -1) };
  //       }
  //       return ex;
  //     }),
  //   );
  // };

  // Workout Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formats to 75 seconds into "01:15"
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 lg:p-10 pt-12 flex flex-col gap-6 mx-auto max-w-7xl relative">
      <div className="sticky top-0 bg-background/90 backdrop-blur-md z-10 py-4 flex justify-between items-center border-b border-surface mb-2">
        <span className="text-muted font-mono text-lg">{formatTime(secondsElapsed)}</span>
        <h2 className="font-bold text-lg lg:text-2xl text-text-primary">
          Upper Body Power
        </h2>

        <button
          onClick={handleFinishWorkout}
          className="bg-emerald text-white px-4 lg:px-8 py-1.5 lg:py-2 rounded-lg text-sm lg:text-base font-bold active:scale-95 transition-transform"
        >
          Finish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 items-start">
        {activeWorkout.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={handleUpdateSet}
            onToggleSetComplete={handleToggleSetComplete}
            onAddSet={handleAddSet}
            onRemoveExercise={handleRemoveExercise}
            onRemoveLastSet={handleRemoveExercise}
          />
        ))}

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full border-2 border-dashed border-surface text-primary font-bold py-4 rounded-2xl hover:bg-surface/50 transition-colors h-full min-h-[150px]"
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
