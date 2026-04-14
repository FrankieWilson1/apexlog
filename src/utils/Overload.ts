/**
 * @file Overload.ts
 * @description Utility for calculating progressive overload targets.
 * Rules:
 * 1. Weighted (e.g., "80kg x 8") -> suggests +2.5 to the weight.
 * 2. Bodyweight (e.g., "15 reps" or "0kg x 15") -> Suggests +1 to reps.
 * Fallback -> Returns "-" if parsing fails.
 * 
 * @module Utils/Overload
 */

export function calculateOverload(previousStr: string): string {
    if (!previousStr || previousStr === "-" || previousStr.trim() === "") {
        return "-";
    }

    // Rule 1 & 2: Match Weighted Sets (e.g., "80kg x 8", "80 lbs x 8")
    // Regex Captures: [1] Weight, [2] Unit, [3] Reps
    const weightRegex = /([\d.]+)\s*(kg|lbs)\s*[Xx*]\s*(\d+)/i;
    const weightMatch = previousStr.match(weightRegex);

    if (weightMatch) {
        const weight = parseFloat(weightMatch[1]);
        const unit = weightMatch[2].toLowerCase();
        const reps = parseInt(weightMatch[3], 10);

        if (weight === 0) {
            // Bodyweight case logged as 0kg
            return `Try ${reps + 1} reps`;
        }

        // Add 2.5kg/lbs.  -- Increment configurtion would be made availble in settings in version 4
        return `Try ${weight + 2.5}${unit} today`;
    }

    // Rule 2
    const repRegex = /^(\d+)\s*reps?/i;
    const repMatch = previousStr.match(repRegex);

    if (repMatch) {
        const reps = parseInt(repMatch[1], 10);
        return `Try ${reps + 1} reps`;
    }

    const noUnitRegex = /([\d.]+)\s*[Xx*]\s*(\d+)/i;
    const noUnitMatch = previousStr.match(noUnitRegex);

    if (noUnitMatch) {
        const weight = parseFloat(noUnitMatch[1]);
        const reps = parseInt(noUnitMatch[2], 10);
        if (weight === 0) return `Try ${reps + 1} reps`;
        return `Try ${weight + 2.5} today`;
    }

    return "-";
}