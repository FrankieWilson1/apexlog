/**
 * @file SettingsPage.tsx
 * @description App-wide settings page for ApexLog.
 *
 * Organised into five sections: Account card, Preferences, App links,
 * Data management, and Account actions.
 *
 * ## Preference persistence
 * - `weightUnit` and `notifications` — persisted to the backend via
 *   `updateProfile` (PUT /api/users/profile). Follow the user across
 *   devices and sessions.
 * - `compactView` — UI-only preference, stays in localStorage since
 *   it has no backend equivalent yet.
 *
 * ## Two-tap destructive actions
 * "Clear Workout History" and "Log Out" both require a second tap to
 * confirm, preventing accidental data loss.
 *
 * @module pages/SettingsPage
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import apiFetch from "../config/apiHelper";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, token, logout, updateProfile } = useAuth();

  // ── Preferences ───────────────────────────────────────────────────────────

  /**
   * Weight unit — persisted to the backend so it follows the user
   * across devices. Reads initial value from the user object.
   */
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    user?.weightUnit || "kg",
  );

  /**
   * Notification preference — persisted to the backend.
   * Functionality (push notifications) is planned for v3.
   */
  const [notifications, setNotifications] = useState<boolean>(
    user?.notifications ?? true,
  );

  /**
   * Compact history view — UI-only preference, localStorage only.
   * No backend equivalent until v3.
   */
  const [compactView, setCompactView] = useLocalStorage<boolean>(
    "apexlog_compact",
    false,
  );

  // Restduration state declaration
  const [restDuration, setRestDuration] = useState<number>(
    user?.restDuration ?? 90,
  );

  useEffect(() => {
    if (user) {
        setWeightUnit(user.weightUnit || "kg");
        setNotifications(user.notifications ?? true);
        setRestDuration(user.restDuration ?? 90);
    }
  }, [user]);

  // ── Confirmation flags ────────────────────────────────────────────────────
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [cleared, setCleared] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Persists the weight unit to the backend immediately on change.
   * Updates local state optimistically so the UI responds instantly.
   */
  const handleWeightUnitChange = async (unit: "kg" | "lbs") => {
    setWeightUnit(unit);
    await updateProfile({ weightUnit: unit });
  };

  const handleRestDurationChange = async (seconds: number) => {
    setRestDuration(seconds);
    await updateProfile({ restDuration: seconds })
  }

  /**
   * Persists the notification preference to the backend immediately.
   */
  const handleNotificationsToggle = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await updateProfile({ notifications: newValue });
  };

  /**
   * Resets onboarding by setting hasOnboarded to false on the backend,
   * then navigates to the onboarding flow.
   */
  const handleReplayOnboarding = async () => {
    await updateProfile({ hasOnboarded: false });
    navigate("/onboarding");
  };

  /**
   * Two-tap clear history. First tap shows a warning.
   * Second tap calls DELETE /api/workouts/all on the backend.
   */
  const handleClearHistory = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    try {
      await apiFetch("/workouts/all", token, { method: "DELETE" });
      setConfirmClear(false);
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch {
      alert("Failed to clear history. Please try again.");
      setConfirmClear(false);
    }
  };

  /**
   * Two-tap logout. First tap shows a warning.
   * Second tap calls logout() and navigates to the landing page.
   */
  const handleLogout = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    logout();
    navigate("/");
  };

  // ── Reusable UI primitives ────────────────────────────────────────────────

  const ChevronRight = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const Toggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={value}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? "bg-primary" : "bg-surface"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-32 mx-auto max-w-lg lg:px-8 lg:pt-28 lg:pb-16">
        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-1">
            Settings
          </h1>
          <p className="text-muted text-sm">
            Manage your preferences and account.
          </p>
        </div>

        {/* ── ACCOUNT CARD ── */}
        <div className="bg-card/50 rounded-2xl border border-surface p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-text-primary truncate">{user?.name}</p>
            <p className="text-muted text-sm truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="ml-auto text-primary text-sm font-semibold hover:underline flex-shrink-0"
          >
            Edit
          </button>
        </div>

        {/* ── PREFERENCES ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">
            Preferences
          </p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">
            {/* Weight unit — saved to backend */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  Weight Unit
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Used throughout the app
                </p>
              </div>
              <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                {(["kg", "lbs"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleWeightUnitChange(unit)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      weightUnit === unit
                        ? "bg-primary text-white"
                        : "text-muted"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications — saved to backend, UI only in v2 */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  Workout Reminders
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Daily push notifications (coming soon)
                </p>
              </div>
              <Toggle
                value={notifications}
                onToggle={handleNotificationsToggle}
              />
            </div>

            {/* Rest duration - saved to backend */}
            <div className="flex items-center justify-between px-5 py-4">
                <div>
                    <p className="text-text-primary font-semibold text-sm">
                    Default Rest Timer
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                    Auto-starts after completing a set
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                    {([60, 90, 120, 180] as const).map((seconds) => (
                    <button
                        key={seconds}
                        onClick={() => handleRestDurationChange(seconds)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        restDuration === seconds
                            ? "bg-primary text-white"
                            : "text-muted"
                        }`}
                    >
                        {seconds}s
                    </button>
                    ))}
                </div>
            </div>

            {/* Compact view — localStorage only */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  Compact History View
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Smaller cards in Recent Activities
                </p>
              </div>
              <Toggle
                value={compactView}
                onToggle={() => setCompactView(!compactView)}
              />
            </div>
          </div>
        </div>

        {/* ── APP LINKS ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">
            App
          </p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">
            <button
              onClick={handleReplayOnboarding}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  Replay Onboarding
                </p>
                <p className="text-muted text-xs mt-0.5">
                  See the getting started guide again
                </p>
              </div>
              <ChevronRight />
            </button>

            <button
              onClick={() => navigate("/features")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  What's New in v2
                </p>
                <p className="text-muted text-xs mt-0.5">
                  See all features and roadmap
                </p>
              </div>
              <ChevronRight />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  About ApexLog
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Tech stack, developer, version history
                </p>
              </div>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* ── DATA ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">
            Data
          </p>
          <div className="bg-card/40 rounded-2xl border border-surface">
            <button
              onClick={handleClearHistory}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-500/10 transition-colors text-left rounded-2xl"
            >
              <div>
                <p
                  className={`font-semibold text-sm ${confirmClear ? "text-red-400" : "text-red-400/80"}`}
                >
                  {confirmClear
                    ? "⚠️ Tap again to confirm"
                    : "Clear Workout History"}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {cleared
                    ? "✓ History cleared"
                    : "Permanently deletes all your logged sessions"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── ACCOUNT ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">
            Account
          </p>
          <div className="bg-card/40 rounded-2xl border border-surface">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-500/10 transition-colors rounded-2xl text-left"
            >
              <div>
                <p
                  className={`font-semibold text-sm ${confirmLogout ? "text-red-400" : "text-red-400/80"}`}
                >
                  {confirmLogout ? "⚠️ Tap again to log out" : "Log Out"}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {confirmLogout
                    ? "This will end your session"
                    : `Signed in as ${user?.email}`}
                </p>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-muted text-xs">
          ApexLog v2.0 · ALX Capstone · Built by Frank Williams Ugwu
        </p>
      </div>
    </div>
  );
}
