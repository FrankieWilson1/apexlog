
// Blueprint for a single Set row
export interface ExerciseSet {
    id: string;
    setNumber: number;
    previousStr: string;
    weight: number | '';
    reps: number | '';
    isCompleted: boolean;
}

// Blueprint for an Exercise Card
export interface LoggedExercise {
    id: string;
    name: string;
    muscleGroups: string[];
    sets: ExerciseSet[];
}

// Blueprint for a Past Workout
export interface WorkoutSummary {
    id: string;
    title: string;
    date: string;
    volumeKg: number;
    durationMinutes: number;
}