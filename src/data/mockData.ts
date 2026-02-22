import { LoggedExercise, WorkoutSummary } from "../types";

// Data for the "Volume This Week" Chart
export const mockChartData = [
  { day: "Sun", volume: 0 },
  { day: "Mon", volume: 3800 },
  { day: "Tue", volume: 6100 },
  { day: "Wed", volume: 0 },
  { day: "Thu", volume: 4200 },
  { day: "Fri", volume: 0 },
  { day: "Sat", volume: 0 },
];

// Data for the "Recent Activities" section on the Home Dashboard
export const mockRecentWorkouts: WorkoutSummary[] = [
  {
    id: 'w1',
    title: 'Upper Body Power',
    date: 'Yesterday',
    volumeKg: 4200,
    durationMinutes: 45,
  },
  {
    id: 'w2',
    title: 'Leg Day',
    date: 'Tuesday',
    volumeKg: 6100,
    durationMinutes: 60,
  },
  {
    id: 'w3',
    title: 'Pull Day',
    date: 'Last Sunday',
    volumeKg: 3800,
    durationMinutes: 50,
  }
];

// Data for the Live Workout Logger screen
export const mockLiveWorkout: LoggedExercise[] = [
  {
    id: 'e1',
    name: 'Barbell Bench Press',
    muscleGroups: ['Chest', 'Triceps'],
    sets: [
      { id: 's1', setNumber: 1, previousStr: '100x8', weight: 100, reps: 8, isCompleted: true },
      { id: 's2', setNumber: 2, previousStr: '100x8', weight: 100, reps: 8, isCompleted: false },
      { id: 's3', setNumber: 3, previousStr: '100x7', weight: 100, reps: '', isCompleted: false },
    ]
  },
  {
    id: 'e2',
    name: 'Incline Dumbbell Press',
    muscleGroups: ['Chest', 'Shoulders'],
    sets: [
      { id: 's4', setNumber: 1, previousStr: '40x10', weight: 40, reps: 10, isCompleted: false },
      { id: 's5', setNumber: 2, previousStr: '40x9', weight: 40, reps: '', isCompleted: false },
    ]
  }
];
