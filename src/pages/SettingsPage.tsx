import useAuth from "../context/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, historyKey } = useAuth();
  const [, setHistory] = useLocalStorage(historyKey, []);

  const [weightUnit, setWeightUnit] = useLocalStorage<"kg" | "lbs">("apexlog_weight_unit", "kg");
  const [notifications, setNotifications] = useLocalStorage<boolean>("apexlog_notifications", true);
  const [compactView, setCompactView] = useLocalStorage<boolean>("apexlog_compact", false);

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearHistory = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    setHistory([]);
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const handleLogout = () => {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    logout();
    navigate("/");
  };

  const handleReplayOnboarding = () => {
    localStorage.removeItem("apexlog_onboarded");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-32 mx-auto max-w-lg lg:px-8 lg:pt-28 lg:pb-16">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-1">Settings</h1>
          <p className="text-muted text-sm">Manage your preferences and account.</p>
        </div>

        {/* Account card */}
        <div className="bg-card/50 rounded-2xl border border-surface p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : user?.name?.charAt(0).toUpperCase()
            }
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

        {/* Preferences */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">Preferences</p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">

            {/* Weight unit */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">Weight Unit</p>
                <p className="text-muted text-xs mt-0.5">Used throughout the app</p>
              </div>
              <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                {(["kg", "lbs"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setWeightUnit(unit)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      weightUnit === unit ? "bg-primary text-white" : "text-muted"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout reminders */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">Workout Reminders</p>
                <p className="text-muted text-xs mt-0.5">Daily push notifications (coming soon)</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifications ? "bg-primary" : "bg-surface"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? "left-7" : "left-1"}`}
                />
              </button>
            </div>

            {/* Compact view */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-text-primary font-semibold text-sm">Compact History View</p>
                <p className="text-muted text-xs mt-0.5">Smaller cards in Recent Activities</p>
              </div>
              <button
                onClick={() => setCompactView(!compactView)}
                className={`w-12 h-6 rounded-full transition-all relative ${compactView ? "bg-primary" : "bg-surface"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${compactView ? "left-7" : "left-1"}`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* App */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">App</p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">

            <button
              onClick={handleReplayOnboarding}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">Replay Onboarding</p>
                <p className="text-muted text-xs mt-0.5">See the getting started guide again</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate("/features")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">What's New in v2</p>
                <p className="text-muted text-xs mt-0.5">See all features and roadmap</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate("/about")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/30 transition-colors text-left"
            >
              <div>
                <p className="text-text-primary font-semibold text-sm">About ApexLog</p>
                <p className="text-muted text-xs mt-0.5">Tech stack, developer, version history</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

        {/* Data */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">Data</p>
          <div className="bg-card/40 rounded-2xl border border-surface divide-y divide-surface">

            <button
              onClick={handleClearHistory}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-500/10 transition-colors text-left"
            >
              <div>
                <p className={`font-semibold text-sm ${confirmClear ? "text-red-400" : "text-red-400/80"}`}>
                  {confirmClear ? "⚠️ Tap again to confirm" : "Clear Workout History"}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {cleared ? "✓ History cleared" : "Permanently deletes all your logged sessions"}
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Account */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3 px-1">Account</p>
          <div className="bg-card/40 rounded-2xl border border-surface">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-500/10 transition-colors rounded-2xl text-left"
            >
              <div>
                <p className={`font-semibold text-sm ${confirmLogout ? "text-red-400" : "text-red-400/80"}`}>
                  {confirmLogout ? "⚠️ Tap again to log out" : "Log Out"}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {confirmLogout ? "This will end your session" : `Signed in as ${user?.email}`}
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
