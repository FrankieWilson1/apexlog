/**
 * @file HomeDashboard.tsx
 * @description The main authenticated dashboard for ApexLog.
 *
 * Displays a personalised greeting, workout streak, the weekly volume bar
 * chart, recent activity list, and two stat cards (streak + total volume).
 *
 * ## Layout strategy
 * The component renders two independent layouts in parallel:
 * - **Mobile** (`lg:hidden`) — stacked single-column layout.
 * - **Desktop** (`hidden lg:grid`) — 12-column grid: 8-col chart/stats on
 *   the left, 4-col sticky recent activities panel on the right.
 *
 * ## Data flow
 * All workout history is read from `localStorage` via `useLocalStorage`.
 * The history key is user-scoped (`apexlog_history_${user.id}`) so data
 * is fully isolated between accounts. Derived stats (streak, total volume,
 * chart data) are computed with `useMemo` to avoid redundant recalculation.
 *
 * ## Sub-components
 * `EmptyState` and `ActivityList` are defined in this file (not exported)
 * because they are tightly coupled to the dashboard layout and not reused
 * elsewhere.
 *
 * @module pages/HomeDashboard
 */

import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import HistoryCard from "../components/HistoryCard";
import VolumeChart from "../components/VolumeChart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../context/useAuth";
import type { WorkoutSummary } from "../types";
import { calculateStreak, calculateTotalVolume } from "../utils/WorkoutStats";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getGreeting
 *
 * Returns a time-appropriate greeting word based on the current hour.
 *
 * @returns {"Morning" | "Afternoon" | "Evening"}
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (private — not exported)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EmptyState
 *
 * Placeholder UI shown inside the Volume Chart card when the user has
 * no workout history yet.
 */
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
  /** The user's full workout history to render */
  history: WorkoutSummary[];
  /** Called when the user taps the "Start your first workout" CTA */
  onNavigate: () => void;
}

/**
 * ActivityList
 *
 * Renders a scrollable list of `HistoryCard` rows, or an empty-state prompt
 * with a CTA if the user has no workouts yet.
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HomeDashboard
 *
 * The main authenticated landing page shown after login. Renders a
 * personalised greeting, weekly volume chart, streak/volume stat cards,
 * and a scrollable recent activities list.
 */
export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user, historyKey } = useAuth();
  const [history] = useLocalStorage<WorkoutSummary[]>(historyKey, []);

  /**
   * Chart data derived from the most recent 7 sessions, reversed so the
   * oldest appears on the left and newest on the right.
   */
  const dynamicChartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return [...history]
      .slice(0, 7)
      .reverse()
      .map((w) => ({ day: w.date, volume: w.volumeKg }));
  }, [history]);

  /** Current consecutive workout streak in days */
  const streak = useMemo(() => calculateStreak(history), [history]);

  /** Cumulative total volume across all recorded sessions */
  const totalVolume = useMemo(() => calculateTotalVolume(history), [history]);

  const firstName = user?.name?.split(" ")[0] || "Athlete";
  const greeting = `Good ${getGreeting()}, ${firstName}`;
  const isEmpty = history.length === 0;

  /** Avatar renders a photo if available, otherwise the user's initial */
  const avatarContent = user?.avatar ? (
    <img
      src={user.avatar}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span>{user?.name?.charAt(0).toUpperCase() || "?"}</span>
  );

  /** Streak subtitle text — motivational prompt when streak is 0 */
  const streakLabel =
    streak > 0
      ? `🔥 ${streak} Day Streak | ${history.length} Workouts Logged`
      : "Start your first workout to build your streak!";

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-6 pb-32 mx-auto max-w-7xl lg:p-10 lg:pt-28 lg:pb-16">
        {/* ── PAGE HEADER: greeting, streak subtitle, CTA, avatar ── */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-text-primary mb-1">
                {greeting}
              </h1>
              <p className="text-muted lg:text-lg">{streakLabel}</p>
            </div>
            {/* Mobile avatar — hidden on desktop (desktop version is in the flex row below) */}
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
            {/* Desktop avatar */}
            <button
              onClick={() => navigate("/profile")}
              className="hidden lg:flex w-12 h-12 rounded-full bg-primary items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity overflow-hidden"
            >
              {avatarContent}
            </button>
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
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

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 pb-8">
            <div className="bg-surface p-5 rounded-2xl border border-white/5">
              <h4 className="text-muted text-xs uppercase font-bold mb-2">
                Current Streak
              </h4>
              <p className="text-2xl font-bold text-primary">
                {isEmpty ? "—" : `${streak}d`}
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
        </div>

        {/* ── DESKTOP LAYOUT — 12-column grid ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          {/* Left: chart + stat cards */}
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
                  Current Streak
                </h4>
                <p className="text-2xl font-bold text-primary">
                  {isEmpty ? "—" : `${streak}d`}
                </p>
              </div>
              <div className="bg-surface p-6 rounded-2xl border border-white/5">
                <h4 className="text-muted text-xs uppercase font-bold mb-2">
                  Total Volume (kg)
                </h4>
                <p className="text-2xl font-bold text-emerald-400">
                  {isEmpty ? "—" : totalVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: sticky recent activities panel */}
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
                /* Scrollable list — `no-scrollbar` hides the scrollbar visually */
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
