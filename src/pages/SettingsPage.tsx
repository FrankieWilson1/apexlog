/**
 * @file SettingsPage.tsx
 * @description App-wide settings page for ApexLog.
 *
 * Organised into four sections:
 * - **Account** — mini profile card with edit shortcut
 * - **Preferences** — weight unit toggle, workout reminders toggle,
 *   compact history view toggle
 * - **App** — replay onboarding, What's New, About links
 * - **Data** — clear workout history (two-tap confirmation)
 * - **Account** — logout (two-tap confirmation)
 *
 * ## Preferences persistence
 * All preference values are stored in `localStorage` via `useLocalStorage`:
 * - `apexlog_weight_unit` — `"kg" | "lbs"`
 * - `apexlog_notifications` — `boolean`
 * - `apexlog_compact` — `boolean`
 *
 * Note: the notifications and compact-view toggles are UI-only in v2;
 * the actual functionality (push notifications, compact card rendering)
 * is on the v3 roadmap.
 *
 * ## Two-tap destructive actions
 * Both "Clear Workout History" and "Log Out" require a second tap to
 * confirm. State flags `confirmClear` and `confirmLogout` track whether
 * the first tap has been registered, causing the button label to update
 * to a warning before executing on the second tap.
 *
 * @module pages/SettingsPage
 */

import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * SettingsPage
 *
 * Displays user preferences and account management options. All preference
 * state is persisted to `localStorage` immediately on change.
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, historyKey } = useAuth();

  /** Write-only setter for the user's workout history (used to clear it) */
  const [, setHistory] = useLocalStorage(historyKey, []);

  /** Weight unit displayed throughout the app */
  const [weightUnit, setWeightUnit] = useLocalStorage<"kg" | "lbs">(
    "apexlog_weight_unit",
    "kg",
  );

  /** Whether daily workout reminder notifications are enabled (UI only in v2) */
  const [notifications, setNotifications] = useLocalStorage<boolean>(
    "apexlog_notifications",
    true,
  );

  /** Whether to render compact history cards (UI only in v2) */
  const [compactView, setCompactView] = useLocalStorage<boolean>(
    "apexlog_compact",
    false,
  );

  /** First-tap flag for the clear-history confirmation flow */
  const [confirmClear, setConfirmClear] = useState(false);

  /** First-tap flag for the logout confirmation flow */
  const [confirmLogout, setConfirmLogout] = useState(false);

  /** Whether history was just cleared — shows a brief success message */
  const [cleared, setCleared] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /**
   * handleClearHistory
   *
   * Two-tap destructive action. First tap sets `confirmClear` to show the
   * warning label. Second tap clears the history array and shows a
   * "✓ History cleared" confirmation for 3 seconds.
   */
  const handleClearHistory = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setHistory([]);
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  /**
   * handleLogout
   *
   * Two-tap logout. First tap updates the label to a warning. Second tap
   * calls `logout()` and navigates to the landing page.
   */
  const handleLogout = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    logout();
    navigate("/");
  };

  /**
   * handleReplayOnboarding
   *
   * Removes the `apexlog_onboarded` key from `localStorage` so the
   * onboarding flow will show again, then navigates to `/onboarding`.
   */
  const handleReplayOnboarding = () => {
    localStorage.removeItem("apexlog_onboarded");
    navigate("/onboarding");
  };

  /** Reusable chevron icon for row-style navigation items */
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

  /**
   * Toggle
   *
   * Inline iOS-style toggle switch. Rendered as a `<button>` with a
   * sliding white knob.
   */
  const Toggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? "bg-primary" : "bg-surface"}`}
      role="switch"
      aria-checked={value}
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
            {/* Weight unit toggle pill */}
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
                    onClick={() => setWeightUnit(unit)}
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

            {/* Notifications toggle (UI only in v2) */}
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
                onToggle={() => setNotifications(!notifications)}
              />
            </div>

            {/* Compact view toggle (UI only in v2) */}
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

        {/* ── APP NAVIGATION ROWS ── */}
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

        {/* ── DATA — clear history ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">
            Data
          </p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">
            <button
              onClick={handleClearHistory}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-500/10 transition-colors text-left"
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

        {/* ── ACCOUNT — logout ── */}
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

        {/* Footer */}
        <p className="text-center text-muted text-xs">
          ApexLog v2.0 · ALX Capstone · Built by Frank Williams Ugwu
        </p>
      </div>
    </div>
  );
}
