import { useState, useEffect } from "react";
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

  const [apiExercises, setApiExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API FETCH ENGINE
  useEffect(() => {
    const fetchWgerExercises = async () => {
      try {
        const response = await fetch(
          "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100",
        );
        const data = await response.json();

        console.log("Real WGER API Object:", data.results[0]);

        // Map the messy API data into strict TypeScript blueprint
        const formattedExercises: ExerciseDefinition[] = data.results.map(
          (ex: any) => {
            // English name for the Exercise
            const englishTranslation = ex.translations?.find(
              (t: any) => t.language === 2,
            );
            const exerciseName = englishTranslation?.name || "Unamed Exercise";

            return {
              id: ex.id.toString() || Math.random().toString(),
              name: exerciseName,
              muscleGroups: [ex.category?.name || "Target Muscle"],
              secondaryMuscles: ex.equipment?.map((e: any) => e.name) || [],
              description: englishTranslation?.description || "",
            };
          },
        );

        setApiExercises(formattedExercises);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWgerExercises();
  }, []);
  const filteredExercises = apiExercises.filter((ex) =>
    (ex.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 max-w-md mx-auto border-x border-surface bg-background z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="flex justify-between items-center p-4 border-b border-surface">
        <h2 className="text-xl font-bold text-text-primary">Add Exercise</h2>
        <button
          onClick={onClose}
          className="p-2 text-muted hover:text-white transition-colors"
        >
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

      <div className="p-4 border-b border-surface">
        <input
          type="text"
          placeholder="Search internet library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted"
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 pb-10">
        {/* Show a loading spinner if the API is still thinking */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Fetching database...</p>
          </div>
        ) : filteredExercises.length === 0 ? (
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
