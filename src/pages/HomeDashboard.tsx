import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import HistoryCard from "../components/HistoryCard";
import VolumeChart from "../components/VolumeChart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useAuth from "../context/useAuth";
import type { WorkoutSummary } from "../types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <p className="text-text-primary font-semibold mb-1">No workouts yet</p>
      <p className="text-muted text-sm">
        Complete your first session to see your stats here.
      </p>
    </div>
  );
}

interface ActivityListProps {
  history: WorkoutSummary[];
  onNavigate: () => void;
}

function ActivityList({ history, onNavigate }: ActivityListProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted text-sm">
          Your completed workouts will appear here.
        </p>
        <button
          onClick={onNavigate}
          className="mt-4 text-primary text-sm font-semibold hover:underline"
        >
          Start your first workout →
        </button>
      </div>
    );
  }
  return (
    <div>
      {history.map((workout) => (
        <HistoryCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

interface StatsCardsProps {
  history: WorkoutSummary[];
}

function StatsCards({ history }: StatsCardsProps) {
  const isEmpty = history.length === 0;
  const totalVolume = history.reduce((sum, w) => sum + w.volumeKg, 0);
  return (
    <div className="grid grid-cols-2 gap-4 pb-8">
      <div className="bg-surface p-5 rounded-2xl border border-white/5">
        <h4 className="text-muted text-xs uppercase font-bold mb-2">
          Top Muscle Group
        </h4>
        <p className="text-2xl font-bold text-primary">
          {isEmpty ? "—" : "Chest"}
        </p>
      </div>
      <div className="bg-surface p-5 rounded-2xl border border-white/5">
        <h4 className="text-muted text-xs uppercase font-bold mb-2">
          Total Volume (kg)
        </h4>
        <p className="text-2xl font-bold text-emerald-400">
          {isEmpty ? "—" : totalVolume.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ── Main component ──

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user, historyKey } = useAuth();
  const [history] = useLocalStorage<WorkoutSummary[]>(historyKey, []);

  const dynamicChartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return [...history]
      .slice(0, 7)
      .reverse()
      .map((w) => ({
        day: w.date,
        volume: w.volumeKg,
      }));
  }, [history]);

  const firstName = user?.name?.split(" ")[0] || "Athlete";
  const greeting = `Good ${getGreeting()}, ${firstName}`;
  const isEmpty = history.length === 0;

  const avatarContent = user?.avatar ? (
    <img
      src={user.avatar}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span>{user?.name?.charAt(0).toUpperCase() || "?"}</span>
  );

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-12 mx-auto max-w-7xl lg:p-10 lg:pt-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-text-primary mb-1">
                {greeting}
              </h1>
              <p className="text-muted lg:text-lg">
                {isEmpty
                  ? "Start your first workout to build your streak!"
                  : `🔥 3 Week Streak | ${history.length} Workouts Logged`}
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="lg:hidden w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 flex-shrink-0 overflow-hidden"
            >
              {avatarContent}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/logger")}
              className="flex-1 lg:flex-none px-8 bg-primary text-white text-base font-semibold py-4 rounded-xl active:scale-95 transition-transform"
            >
              Start Empty Workout
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="hidden lg:flex w-12 h-12 rounded-full bg-primary items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity overflow-hidden"
            >
              {avatarContent}
            </button>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden space-y-8">
          {isEmpty ? (
            <div className="bg-card rounded-2xl border border-surface">
              <div className="px-4 pt-4">
                <h3 className="text-xl font-bold text-text-primary">
                  Volume This Week
                </h3>
              </div>
              <EmptyState />
            </div>
          ) : (
            <VolumeChart data={dynamicChartData} />
          )}
          <div>
            <h2 className="text-xl font-bold mb-2 text-text-primary">
              Recent Activities
            </h2>
            <ActivityList
              history={history}
              onNavigate={() => navigate("/logger")}
            />
          </div>
          <StatsCards history={history} />
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {isEmpty ? (
              <div className="bg-card rounded-2xl border border-surface">
                <div className="px-6 pt-6">
                  <h3 className="text-xl font-bold text-text-primary">
                    Volume This Week
                  </h3>
                </div>
                <EmptyState />
              </div>
            ) : (
              <VolumeChart data={dynamicChartData} />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-6 rounded-2xl border border-white/5">
                <h4 className="text-muted text-xs uppercase font-bold mb-2">
                  Top Muscle Group
                </h4>
                <p className="text-2xl font-bold text-primary">
                  {isEmpty ? "—" : "Chest"}
                </p>
              </div>
              <div className="bg-surface p-6 rounded-2xl border border-white/5">
                <h4 className="text-muted text-xs uppercase font-bold mb-2">
                  Total Volume (kg)
                </h4>
                <p className="text-2xl font-bold text-emerald-400">
                  {isEmpty
                    ? "—"
                    : history
                        .reduce((sum, w) => sum + w.volumeKg, 0)
                        .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-[calc(100vh-200px)] sticky top-24">
            <div className="bg-card/50 p-6 rounded-3xl border border-surface h-full flex flex-col">
              <h2 className="text-xl font-bold mb-2 text-text-primary">
                Recent Activities
              </h2>
              {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-muted text-sm mb-3">
                    Your completed workouts will appear here.
                  </p>
                  <button
                    onClick={() => navigate("/logger")}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Start your first workout →
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {history.map((workout) => (
                    <HistoryCard key={workout.id} workout={workout} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
