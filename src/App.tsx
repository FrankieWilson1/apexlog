import HistoryCard from "./components/HistoryCard";
import VolumeChart from "./components/VolumeChart"; // <-- New Import
import { mockRecentWorkouts, mockChartData } from "./data/mockData"; // <-- Added mockChartData

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white p-6 pt-12 flex flex-col max-w-md mx-auto">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          Good Morning, Alex
        </h1>
        <p className="text-muted text-sm">
          🔥 3 Week Streak | 12 Workouts Logged
        </p>
      </div>

      <button className="w-full bg-primary text-white text-lg font-semibold py-4 rounded-xl mb-8 active:scale-95 transition-transform">
        Start Empty Workout
      </button>

      {/* 💥 Drop the Chart right here! */}
      <VolumeChart data={mockChartData} />

      <div>
        <h2 className="text-xl font-bold mb-4 text-text-primary">
          Recent Activities
        </h2>
        <div className="flex flex-col gap-4">
          {mockRecentWorkouts.map((workout) => (
            <HistoryCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  );
}
