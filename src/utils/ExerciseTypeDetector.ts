/**
 * @file ExerciseTypeDEtector.ts
 * @description Utility function to determine the type of an exercise based on its name.
 *
 * @module utils/ExerciseTypeDEtector
 */

import type { ExerciseType } from "../types";

// WGER category names -> ExerciseType
const WGER_CATEGORY_MAP: Record<string, string> = {
  cardio: "cardio",
  stretching: "flexibillity",
};

const BODYWEIGHT_INDICATORS = [
  "push",
  "pull",
  "dip",
  "plank",
  "burpee",
  "crunch",
  "sit-up",
  "lunge",
  "squat",
  "bear",
  "mountain climber",
];

export function detectExerciseType(
    name: string,
    wgerCategory?: string
): ExerciseType {
    if (wgerCategory) {
        const mapped = WGER_CATEGORY_MAP[wgerCategory.toLowerCase()];
        if (mapped) return mapped as ExerciseType;
    }

    // Fall back to name-based detection for bodyweight exercises
    const lower = name.toLowerCase();
    if (BODYWEIGHT_INDICATORS.some((kw) => lower.includes(kw))) {
        return "bodyweight";
    }

    return "strength";
}

/**
 * getDefualtTrackedFields
 *
 * Returns the default fields to track for a given exercise type.
 * Used to pre-select sensible defaults when a cardio exercise is added.
 *
 * @param type - The detected exercise type
 * @param name - The exercise name (used to specific defaults)
 * @returns string[] - Array of field names to track.
 */
export function getDefaultTrackedFields(type: string, name: string): string[] {
  const lower = name.toLowerCase();

  if (type === "strength") return [];

  if (type === "cardio") {
    // Distance-based cardio
    if (
      [
        "treadmill",
        "bike",
        "elliptical",
        "rowing",
        "run",
        "walk",
        "swim",
        "cycling",
        "spin",
      ].some((kw) => lower.includes(kw))
    ) {
      return ["distance", "duration"];
    }
    // Duration-only cardio
    return ["duration"];
  }

  if (type === "bodyweight") return ["reps"]; //  can switch to duration
  if (type === "flexibility") return ["duration"];

  return [];
}
