import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseSearch from "../components/ExerciseSearch";
import { mockLiveWorkouts } from "../data/mockData";
import {
  type LoggedExercise,
  type ExerciseSet,
  type ExerciseDefinition,
  type WorkoutSummary,
} from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useAuth from "../context/useAuth";

export default function LiveLogger() {
  const navigate = useNavigate();
  const { historyKey } = useAuth();

  const [activeWorkout, setActiveWorkout] = useLocalStorage<LoggedExercise[]>(
    "apexlog_active_workout",
    mockLiveWorkouts,
  );
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutSummary[]>(
    historyKey,
    [],
  );

  // Persistent wall-clock timer
  const [startTime, setStartTime] = useLocalStorage<number>(
    "apexlog_workout_start",
    Date.now(),
  );
  const [secondsElapsed, setSecondsElapsed] = useState(() =>
    Math.floor((Date.now() - startTime) / 1000),
  );
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleUpdateSet = (
    setId: string,
    field: "weight" | "reps",
    value: number | "",
  ) => {
    setActiveWorkout((prev) =>
      prev.map((ex) => ({
        ...ex,
        sets: ex.sets.map((set) =>
          set.id === setId ? { ...set, [field]: value } : set,
        ),
      })),
    );
  };

  const handleToggleSetComplete = (setId: string) => {
    setActiveWorkout((prev) =>
      prev.map((ex) => ({
        ...ex,
        sets: ex.sets.map((set) =>
          set.id === setId ? { ...set, isCompleted: !set.isCompleted } : set,
        ),
      })),
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setActiveWorkout((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSet: ExerciseSet = {
          id: `s-new-${Date.now()}`,
          setNumber: ex.sets.length + 1,
          previousStr: "-",
          weight: "",
          reps: "",
          isCompleted: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }),
    );
  };

  const handleAddNewExercise = (exerciseDef: ExerciseDefinition) => {
    const newEx: LoggedExercise = {
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
    setActiveWorkout([...activeWorkout, newEx]);
    setIsSearchModalOpen(false);
  };

  const handleFinishWorkout = () => {
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

    if (completedSetCount === 0) {
      alert("Complete at least one set before finishing your workout.");
      return;
    }

    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));

    const exerciseSnapshots: import("../types").LoggedExercise[] =
      activeWorkout.map((ex) => ({
        id: ex.id,
        name: ex.name,
        muscleGroups: ex.muscleGroups,
        sets: ex.sets.map((s) => ({
          id: s.id,
          setNumber: s.setNumber,
          previousStr: s.previousStr,
          weight: s.weight,
          reps: s.reps,
          isCompleted: s.isCompleted,
        })),
      }));

    const completedWorkout: WorkoutSummary = {
      id: `wo-${Date.now()}`,
      title: activeWorkout[0]?.name || "Custom Workout",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volumeKg: totalVolume,
      durationMinutes,
      exercises: exerciseSnapshots,
    };

    setWorkoutHistory([completedWorkout, ...workoutHistory]);
    setActiveWorkout([]);
    setStartTime(Date.now());
    navigate("/dashboard");
  };

  const handleDiscard = () => {
    if (confirm("Discard this workout?")) {
      setActiveWorkout([]);
      setStartTime(Date.now());
      navigate("/dashboard");
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setActiveWorkout((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0F172A", color: "#ffffff" }}
    >
      {/* ── STICKY HEADER — matches Figma image 2 exactly ── */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          backgroundColor: "#1E293B",
          borderBottom: "1px solid #334155",
        }}
      >
        {/* Timer pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: "#334155" }}
        >
          <button
            onClick={handleDiscard}
            style={{ color: "rgba(255,255,255,0.35)" }}
            className="hover:text-red-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
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
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: "#94A3B8" }}
          >
            {formatTime(secondsElapsed)}
          </span>
        </div>

        {/* Workout name — centered */}
        <h2 className="flex-1 text-center font-bold text-sm text-white truncate px-2">
          {activeWorkout[0]?.name || "New Workout"}
        </h2>

        {/* Finish pill */}
        <button
          onClick={handleFinishWorkout}
          className="font-bold text-sm px-5 py-2 rounded-full flex-shrink-0 active:scale-95 transition-all"
          style={{ backgroundColor: "#10B981", color: "#ffffff" }}
        >
          Finish
        </button>
      </div>

      {/* ── EXERCISE CARDS ── */}
      <div className="px-3 pt-3 pb-4 lg:px-10 lg:py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
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

          {/* Desktop add card */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden lg:flex items-center justify-center w-full rounded-2xl font-bold py-8 transition-colors min-h-[160px]"
            style={{
              border: "2px dashed #334155",
              color: "#3B82F6",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1E293B")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            + Add New Exercise
          </button>
        </div>

        {/* Mobile spacer above fixed button */}
        <div className="h-28 lg:hidden" />
      </div>

      {/* ── MOBILE ADD EXERCISE — fixed bottom, matches image 2 style ── */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-30 lg:hidden">
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{
            backgroundColor: "#1E293B",
            border: "1px solid rgba(59,130,246,0.35)",
            color: "#3B82F6",
          }}
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

      {isSearchModalOpen && (
        <ExerciseSearch
          onClose={() => setIsSearchModalOpen(false)}
          onSelectExercise={handleAddNewExercise}
        />
      )}
    </div>
  );
}
