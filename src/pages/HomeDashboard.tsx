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
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-12 mx-auto max-w-7xl lg:p-10 lg:pt-12">
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold text-text-primary mb-1">
              Good Morning, Alex
            </h1>
            <p className="text-muted lg:text-lg">
              🔥 3 Week Streak | 12 Workouts Logged
            </p>
          </div>
          <button
            onClick={() => navigate("/logger")}
            className="w-full lg:w-auto px-8 bg-primary text-white text-base font-semibold py-4 rounded-xl active:scale-95 transition-transform"
          >
            Start Empty Workout
          </button>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="lg:hidden space-y-8">
          {/* Chart — VolumeChart handles its own card */}
          <VolumeChart data={dynamicChartData} />

          {/* Recent Activities */}
          <div className="overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold mb-2 text-text-primary">
              Recent Activities
            </h2>
            <div>
              {history.map((workout) => (
                <HistoryCard key={workout.id} workout={workout} />
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 pb-8">
            <div className="bg-surface p-5 rounded-2xl border border-white/5">
              <h4 className="text-muted text-xs uppercase font-bold mb-2">
                Top Muscle Group
              </h4>
              <p className="text-2xl font-bold text-primary">Chest</p>
            </div>
            <div className="bg-surface p-5 rounded-2xl border border-white/5">
              <h4 className="text-muted text-xs uppercase font-bold mb-2">
                Total Volume (kg)
              </h4>
              <p className="text-2xl font-bold text-emerald-400">42,500</p>
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          {/* LEFT: Chart + Stats */}
          <div className="lg:col-span-8 space-y-8">
            <VolumeChart data={dynamicChartData} />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-6 rounded-2xl border border-white/5">
                <h4 className="text-muted text-xs uppercase font-bold mb-2">
                  Top Muscle Group
                </h4>
                <p className="text-2xl font-bold text-primary">Chest</p>
              </div>
              <div className="bg-surface p-6 rounded-2xl border border-white/5">
                <h4 className="text-muted text-xs uppercase font-bold mb-2">
                  Total Volume (kg)
                </h4>
                <p className="text-2xl font-bold text-emerald-400">42,500</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Recent Activities sticky */}
          <div className="lg:col-span-4 h-[calc(100vh-200px)] sticky top-24">
            <div className="bg-card/50 p-6 rounded-3xl border border-surface h-full flex flex-col">
              <h2 className="text-xl font-bold mb-2 text-text-primary">
                Recent Activities
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                {history.map((workout) => (
                  <HistoryCard key={workout.id} workout={workout} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
