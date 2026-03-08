// Blueprint for a single Set row
export interface ExerciseSet {
  id: string;
  setNumber: number;
  previousStr: string;
  weight: number | "";
  reps: number | "";
  isCompleted: boolean;
}

// Blueprint for an Exercise in the searchable library
export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroups: string[];
  secondaryMuscles?: string[];
  equipment?: string[];
  description?: string;
}

// Blueprint for an Exercise Card (extends definition with sets)
export interface LoggedExercise extends ExerciseDefinition {
  sets: ExerciseSet[];
}

// Blueprint for a Past Workout
export interface WorkoutSummary {
  id: string;
  title: string;
  date: string;
  volumeKg: number;
  durationMinutes: number;
  exercises?: LoggedExercise[];
}

// Blueprint for Chart Data
export interface ChartData {
  day: string;
  volume: number;
}

// ********************PROPS FOR COMPONENTS *****************************//

// Volume Chart Props
export interface VolumeChartProps {
  data: ChartData[];
}

// Set Row Props
export interface SetRowProps {
  set: ExerciseSet;
  onUpdate: (id: string, field: "weight" | "reps", value: number | "") => void;
  onToggleComplete: (id: string) => void;
}

// Exercise Card Props
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

// Blueprint for AuthContext
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  goal: string;
  height: string;
  weight: string;
  joinedDate: string;
  avatar?: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  historyKey: string;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

// Settings Blueprint
export interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  id: string;
  label: string;
  description?: string;
  type: "toggle" | "action" | "link" | "select";
  danger?: boolean;
  value?: string;
  options?: string[];
}

// Wger API Exercise
export interface WgerExercise {
  id: number;
  name: string;
  description: string;
  muscles: string[];
  category: string;
}
