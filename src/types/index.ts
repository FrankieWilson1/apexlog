/**
 * @file types/index.ts
 * @description Central type definitions for ApexLog.
 *
 * All interfaces and types used across the application are defined here.
 * Import from this file rather than defining types locally in components.
 *
 * @module types
 */

// ─────────────────────────────────────────────────────────────────────────────
// Workout & Exercise
// ─────────────────────────────────────────────────────────────────────────────

/** A single logged set within an exercise */
export interface ExerciseSet {
    id: string;
    setNumber: number;
    /** Display string for the previous session's performance e.g. "80kg × 8" */
    previousStr: string;
    weight: number | "";
    reps: number | "";
    isCompleted: boolean;
}

/** An exercise definition from the WGER library or user input */
export interface ExerciseDefinition {
    id: string;
    name: string;
    muscleGroups: string[];
    secondaryMuscles?: string[];
    equipment?: string[];
    description?: string;
}

/** An exercise being actively logged — extends definition with sets */
export interface LoggedExercise extends ExerciseDefinition {
    sets: ExerciseSet[];
}

/** A completed workout session stored in history */
export interface WorkoutSummary {
    id: string;
    title: string;
    date: string;
    volumeKg: number;
    durationMinutes: number;
    exercises?: LoggedExercise[];
}

/** A single data point for the volume bar chart */
export interface ChartData {
    day: string;
    volume: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth & User
// ─────────────────────────────────────────────────────────────────────────────

/** The authenticated user's profile data */
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    goal?: string;
    height?: string;
    weight?: string;
    weightUnit?: "kg" | "lbs";
    notifications?: boolean;
    hasOnboarded?: boolean;
    avatar?: string | null;
    /** ISO date string from MongoDB's createdAt timestamp */
    createdAt?: string;
    restDuration?: number;
}

/** Shape of the global auth context exposed to all components */
export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    /** True while session is being restored from localStorage on mount */
    isLoading: boolean;
    /** Per-user localStorage key for the active workout (temporary) */
    historyKey: string;
    signup: (
        name: string,
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string; hasOnboarded?: boolean }>;
    logout: () => void;
    updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
    /** Fetches fresh profile data from the backend and updates local state */
    refreshUser: (currentToken: string) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────

export interface VolumeChartProps {
    data: ChartData[];
}

export interface SetRowProps {
    set: ExerciseSet;
    onUpdate: (id: string, field: "weight" | "reps", value: number | "") => void;
    onToggleComplete: (id: string) => void;
}

export interface ExerciseCardProps {
    exercise: LoggedExercise;
    onUpdateSet: (
        setId: string,
        field: "weight" | "reps",
        value: number | "",
    ) => void;
    onToggleSetComplete: (setId: string) => void;
    onAddSet: (exerciseId: string) => void;
    onRemoveExercise: (exerciseId: string) => void;
    onRemoveLastSet: (exerciseId: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────

export interface SettingsItem {
    id: string;
    label: string;
    description?: string;
    type: "toggle" | "action" | "link" | "select";
    danger?: boolean;
    value?: string;
    options?: string[];
}

export interface SettingsSection {
    title: string;
    items: SettingsItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// External APIs
// ─────────────────────────────────────────────────────────────────────────────

/** Exercise data shape returned by the WGER fitness API */
export interface WgerExercise {
    id: number;
    name: string;
    description: string;
    muscles: string[];
    category: string;
}

/** Options for the centralised apiFetch helper */
export interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding
// ─────────────────────────────────────────────────────────────────────────────

/** A single onboarding slide definition */
export interface Slide {
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    accent: string;
    /** Numbered step list — only used on slides 2 and 3 */
    steps?: string[];
}
