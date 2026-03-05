import { useState } from "react";
import { exerciseLibrary } from "../data/mockData";
import type { ExerciseDefinition } from "../types";

interface ExerciseSearchProps {
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseDefinition) => void;
}

export default function ExerciseSearch({
  onClose,
  onSelectExercise,
}: ExerciseSearchProps) {
  // State to hold whatever the user types in the box
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the library based on the search query
  // Everything converted to lowercase so "bench" finds "Bench"
  const filteredExercises = exerciseLibrary.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((m) =>
        m.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="fixed inset-0 bg-background z-50 max-w-md mx-auto border-x flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center p-4 border-b border-surface">
        <h2 className="text-xl font-bold text-text-primary">Add Exercise</h2>
        <button
          onClick={onClose}
          className="p-2 text-muted hover:text-white transition-colors"
        >
          {/* Simple X icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </div>

      {/* The Search Input */}
      <div className="p-4 border-b border-surface">
        <input
          type="text"
          placeholder="Search exercise or muscle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted"
          autoFocus
        />
      </div>

      {/* The Filtered List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 pb-10">
        {filteredExercises.length === 0 ? (
          <p className="text-center text-muted mt-8">No exercises found.</p>
        ) : (
          filteredExercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="bg-card p-4 rounded-xl flex flex-col items-start text-left w-full hover:bg-surface active:scale-[0.98] transition-all border border-transparent hover:border-primary/50"
            >
              <span className="text-white font-bold">{ex.name}</span>
              <span className="text-muted text-xs mt-1">
                {ex.muscleGroups.join(", ")}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
