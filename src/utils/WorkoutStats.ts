/**
 * @file WorkoutStats.ts
 * @description Pure utility functions for computing statistics from workout history.
 *
 * All functions are stateless and side-effect free — they accept a
 * `WorkoutSummary[]` array and return a computed scalar value.
 * This makes them trivially unit-testable and safely reusable across
 * Dashboard, Profile, and any future analytics pages.
 *
 * @module utils/WorkoutStats
 */

import type { WorkoutSummary } from "../types";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateStreak
 *
 * Calculates the user's current consecutive workout streak in calendar days.
 *
 * ## Algorithm
 * 1. Normalises every workout date to a `"YYYY-MM-DD"` key and stores them in a Set.
 * 2. Walks backwards from today (day 0, day 1, day 2…).
 * 3. Increments the streak counter for each day that has at least one workout.
 * 4. Stops and returns as soon as a gap day is found (i > 0 and no workout).
 *
 * ## Edge cases
 * - If today has no workout yet, the algorithm looks back to yesterday before
 *   deciding whether the streak is broken (so a streak earned yesterday is preserved).
 * - Handles both ISO date strings (`"2026-03-09T…"`) and short-form dates
 *   produced by `toLocaleDateString` (e.g. `"Mar 9"`).
 *
 * @param {WorkoutSummary[]} history - The user's full workout history array.
 * @returns {number} Number of consecutive days with at least one logged workout.
 *                   Returns `0` if history is empty.
 *
 * @example
 * // Three workouts: today, yesterday, and two days ago → streak of 3
 * calculateStreak([
 *   { date: "Mar 9", volumeKg: 1200, ... },
 *   { date: "Mar 8", volumeKg: 900, ... },
 *   { date: "Mar 7", volumeKg: 1100, ... },
 * ]); // → 3
 *
 * @example
 * // Gap on Mar 8 breaks the streak
 * calculateStreak([
 *   { date: "Mar 9", ... },
 *   { date: "Mar 7", ... },   // skipped Mar 8
 * ]); // → 1
 */
export function calculateStreak(history: WorkoutSummary[]): number {
  if (!history || history.length === 0) return 0;

  // Normalise all workout dates to "YYYY-MM-DD" strings for reliable day comparison
  const workoutDays = new Set(
    history
      .map((w) => {
        const d = new Date(w.date);
        if (isNaN(d.getTime())) {
          // Attempt to parse short-form locale dates like "Mar 7"
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
      // A gap has been found — streak is broken, stop counting
      break;
    }
    // If i === 0 (today) has no workout yet, continue to yesterday before breaking
  }

  return streak;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateTotalVolume
 *
 * Sums the total weight volume in kilograms across all recorded workout sessions.
 *
 * Volume per session = Σ (weight × reps) for all completed sets.
 * This function simply sums the pre-calculated `volumeKg` field from each session.
 *
 * @param {WorkoutSummary[]} history - The user's full workout history array.
 * @returns {number} Total cumulative volume in kg. Returns `0` for empty history.
 *
 * @example
 * calculateTotalVolume([
 *   { volumeKg: 1200, ... },
 *   { volumeKg: 800, ... },
 *   { volumeKg: 950, ... },
 * ]); // → 2950
 */
export function calculateTotalVolume(history: WorkoutSummary[]): number {
  return history.reduce((sum, w) => sum + (w.volumeKg || 0), 0);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateTopExercise
 *
 * Returns the most frequently logged exercise name across all workout sessions,
 * derived from workout titles.
 *
 * > **Note:** This uses the workout `title` as a proxy for the primary exercise.
 * > In v3, when every session stores a full `exercises[]` breakdown, this will be
 * > updated to count individual exercise names across all sessions.
 *
 * @param {WorkoutSummary[]} history - The user's full workout history array.
 * @returns {string} The most frequently occurring workout title, or `"—"` if empty.
 *
 * @example
 * calculateTopExercise([
 *   { title: "Bench Press", ... },
 *   { title: "Bench Press", ... },
 *   { title: "Squat", ... },
 * ]); // → "Bench Press"
 */
export function calculateTopExercise(history: WorkoutSummary[]): string {
  if (!history || history.length === 0) return "—";

  const counts: Record<string, number> = {};
  history.forEach((w) => {
    const name = w.title || "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * toDateKey  (internal)
 *
 * Formats a `Date` object as a zero-padded `"YYYY-MM-DD"` string.
 * Used internally by `calculateStreak` to produce consistent keys for
 * the Set-based day lookup.
 *
 * @param {Date} date - The date to format.
 * @returns {string} e.g. `"2026-03-09"`
 */
function toDateKey(date: Date): string {
  return (
    `${date.getFullYear()}-` +
    `${String(date.getMonth() + 1).padStart(2, "0")}-` +
    `${String(date.getDate()).padStart(2, "0")}`
  );
}
