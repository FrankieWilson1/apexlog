import type { WorkoutSummary } from "../types";

/**
 * Calculates the current streak in days.
 * A streak is the number of consecutive calendar days (going backwards from today)
 * on which at least one workout was logged.
 */
export function calculateStreak(history: WorkoutSummary[]): number {
  if (!history || history.length === 0) return 0;

  // Normalize all workout dates to "YYYY-MM-DD" for comparison
  const workoutDays = new Set(
    history
      .map((w) => {
        const d = new Date(w.date);
        // Handle "Mar 7" style dates from toLocaleDateString
        if (isNaN(d.getTime())) {
          // Try parsing "Mar 7" by adding current year
          const parsed = new Date(`${w.date} ${new Date().getFullYear()}`);
          return isNaN(parsed.getTime()) ? null : toDateKey(parsed);
        }
        return toDateKey(d);
      })
      .filter(Boolean) as string[],
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = toDateKey(day);

    if (workoutDays.has(key)) {
      streak++;
    } else if (i > 0) {
      // Gap found — streak is broken
      break;
    }
    // If today (i === 0) has no workout, keep checking yesterday
  }

  return streak;
}

/**
 * Returns total volume lifted across all workouts.
 */
export function calculateTotalVolume(history: WorkoutSummary[]): number {
  return history.reduce((sum, w) => sum + (w.volumeKg || 0), 0);
}

/**
 * Returns the most frequent exercise name across all workouts.
 * Falls back to "—" if no data.
 */
export function calculateTopExercise(history: WorkoutSummary[]): string {
  if (!history || history.length === 0) return "—";
  // WorkoutSummary doesn't carry exercise breakdown, so derive from title
  const counts: Record<string, number> = {};
  history.forEach((w) => {
    const name = w.title || "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
