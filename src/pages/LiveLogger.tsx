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

  const [activeWorkout, setActiveWorkout] = useLocalStorage<LoggedExercise[]>(
    "appexlog_active_workout",
    mockLiveWorkouts,
  );

  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutSummary[]>(
    "apexlog_history",
    mockRecentWorkouts,
  );

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

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

  const handleFinishWorkout = () => {
    // Count only completed sets with valid data
    let totalVolume = 0;
    let completedSetCount = 0;

    activeWorkout.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (
          set.isCompleted &&
          set.weight !== "" &&
          set.reps !== "" &&
          Number(set.weight) > 0 &&
          Number(set.reps) > 0
        ) {
          totalVolume += Number(set.weight) * Number(set.reps);
          completedSetCount++;
        }
      });
    });

    // Block finish if nothing was actually logged
    if (completedSetCount === 0) {
      alert("Complete at least one set before finishing your workout.");
      return;
    }

    const completedWorkout: WorkoutSummary = {
      id: `wo-${Date.now()}`,
      title: activeWorkout[0]?.name || "Custom Workout",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volumeKg: totalVolume,
      durationMinutes: Math.round(secondsElapsed / 60) || 1,
    };

    setWorkoutHistory([completedWorkout, ...workoutHistory]);
    setActiveWorkout([]);
    setSecondsElapsed(0);
    navigate("/dashboard");
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setActiveWorkout((prevWorkout) =>
      prevWorkout.filter((ex) => ex.id !== exerciseId),
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-md z-40 px-4 lg:px-10 py-3 flex justify-between items-center border-b border-surface">
        {/* Left: close + timer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Discard workout?")) {
                setActiveWorkout([]);
                navigate("/dashboard");
              }
            }}
            className="text-muted hover:text-red-400 p-1 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span className="text-muted font-mono text-base bg-surface px-3 py-1 rounded-lg">
            {formatTime(secondsElapsed)}
          </span>
        </div>

        {/* Center: workout name */}
        <h2 className="font-bold text-base lg:text-xl text-text-primary tracking-wide uppercase">
          {activeWorkout[0]?.name || "New Workout"}
        </h2>

        {/* Right: Finish button */}
        <button
          onClick={handleFinishWorkout}
          className="bg-secondary text-white px-5 py-2 rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          Finish
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 lg:p-10 mx-auto max-w-7xl">
        {/* Exercise cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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

          {/* Desktop: dashed add card */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden lg:flex items-center justify-center w-full border-2 border-dashed border-surface text-primary font-bold py-4 rounded-2xl hover:bg-surface/30 transition-colors min-h-[150px]"
          >
            + Add New Exercise
          </button>
        </div>

        {/* Mobile: bottom padding so FAB doesn't cover last card */}
        <div className="h-28 lg:hidden" />
      </div>

      {/* ── MOBILE FIXED BOTTOM BUTTON ── */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-30 lg:hidden">
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full bg-surface border border-white/10 text-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Exercise
        </button>
      </div>

      {/* ── SEARCH MODAL ── */}
      {isSearchModalOpen && (
        <ExerciseSearch
          onClose={() => setIsSearchModalOpen(false)}
          onSelectExercise={handleAddNewExercise}
        />
      )}
    </div>
  );
}
