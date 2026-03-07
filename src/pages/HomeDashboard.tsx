import { useNavigate } from "react-router-dom";
import HistoryCard from "../components/HistoryCard";
import VolumeChart from "../components/VolumeChart";
import { mockRecentWorkouts } from "../data/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { WorkoutSummary } from "../types";
import { useMemo } from "react";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [history] = useLocalStorage<WorkoutSummary[]>(
    "apexlog_history",
    mockRecentWorkouts,
  );

  const dynamicChartData = useMemo(() => {
    if (!history || history.length === 0) return [];

    const recent = [...history].slice(0, 7).reverse();

    return recent.map((workout) => ({
      day: workout.date,
      volume: workout.volumeKg,
    }));
  }, [history]);

  return (
    <div className="min-h-screen bg-background text-white p-6 lg:p-10 pt-12 mx-auto max-w-7xl">
      {/* Header stays full width */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold text-text-primary mb-2">
            Good Morning, Alex
          </h1>
          <p className="text-muted lg:text-lg">
            🔥 3 Week Streak | 12 Workouts Logged
          </p>
        </div>

        <button
          onClick={() => navigate("/logger")}
          className="w-full lg:w-auto px-8 bg-primary text-white text-lg font-semibold py-4 rounded-xl active:scale-95 transition-transform"
        >
          Start Empty Workout
        </button>
      </div>

      {/*  1 column on mobile, 12 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side (Chart takes up 8/12 of the screen) */}
        <div className="lg:col-span-8">
          <VolumeChart data={dynamicChartData} />
        </div>

        {/* Right Side ) */}
        <div className="lg:col-span-4 bg-card/50 p-6 rounded-3xl border border-surface">
          <h2 className="text-xl font-bold mb-6 text-text-primary">
            Recent Activities
          </h2>
          <div className="flex flex-col gap-4">
            {history.map((workout) => (
              <HistoryCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
