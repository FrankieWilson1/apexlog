import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(user?.goal || "Build Muscle");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [saved, setSaved] = useState(false);

  const goals = [
    "Build Muscle",
    "Lose Weight",
    "Improve Endurance",
    "Stay Active",
    "Increase Strength",
  ];

  const handleSave = () => {
    updateProfile({ goal, height, weight });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const joinedDate = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  // Get first letter of name for avatar
  const avatar = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-12 mx-auto max-w-lg">
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-text-primary">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* ── AVATAR & NAME ── */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/30">
            {avatar}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              {user?.name}
            </h2>
            <p className="text-muted text-sm">{user?.email}</p>
            <p className="text-muted text-xs mt-1">Member since {joinedDate}</p>
          </div>
        </div>

        {/* ── BIOMETRICS ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-6 mb-4">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
            Biometrics
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Height */}
            <div>
              <label className="text-muted text-xs mb-1.5 block">
                Height (cm)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 180"
                  className="w-full bg-surface border border-white/10 text-white text-center font-bold rounded-xl py-3 focus:border-primary focus:outline-none transition-colors placeholder:text-muted/50 text-sm"
                />
              ) : (
                <div className="bg-surface rounded-xl py-3 text-center">
                  <span className="text-text-primary font-bold text-lg">
                    {height || "—"}
                  </span>
                  {height && (
                    <span className="text-muted text-xs ml-1">cm</span>
                  )}
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="text-muted text-xs mb-1.5 block">
                Weight (kg)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 80"
                  className="w-full bg-surface border border-white/10 text-white text-center font-bold rounded-xl py-3 focus:border-primary focus:outline-none transition-colors placeholder:text-muted/50 text-sm"
                />
              ) : (
                <div className="bg-surface rounded-xl py-3 text-center">
                  <span className="text-text-primary font-bold text-lg">
                    {weight || "—"}
                  </span>
                  {weight && (
                    <span className="text-muted text-xs ml-1">kg</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="text-muted text-xs mb-1.5 block">
              Fitness Goal
            </label>
            {isEditing ? (
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-surface border border-white/10 text-white rounded-xl py-3 px-4 focus:border-primary focus:outline-none transition-colors text-sm appearance-none"
              >
                {goals.map((g) => (
                  <option key={g} value={g} className="bg-card">
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-surface rounded-xl py-3 px-4">
                <span className="text-text-primary font-semibold text-sm">
                  {goal}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── SAVE BUTTON ── */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl active:scale-95 transition-all mb-4"
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        )}

        {/* ── APP INFO ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-6 mb-4">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
            App
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-text-primary text-sm">Version</span>
              <span className="text-muted text-sm font-mono">1.0.0 MVP</span>
            </div>
            <div className="h-px bg-surface" />
            <div className="flex justify-between items-center py-1">
              <span className="text-text-primary text-sm">Data Storage</span>
              <span className="text-muted text-sm">Local Device</span>
            </div>
            <div className="h-px bg-surface" />
            <div className="flex justify-between items-center py-1">
              <span className="text-text-primary text-sm">
                Exercise Library
              </span>
              <span className="text-muted text-sm">WGER API</span>
            </div>
          </div>
        </div>

        {/* ── LOGOUT ── */}
        <button
          onClick={handleLogout}
          className="w-full border border-red-400/30 text-red-400 font-bold py-4 rounded-xl hover:bg-red-400/10 active:scale-95 transition-all mt-2 mb-10"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
