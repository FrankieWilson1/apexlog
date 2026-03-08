import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(user?.goal || "Build Muscle");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null,
  );

  const goals = [
    "Build Muscle",
    "Lose Weight",
    "Improve Endurance",
    "Stay Active",
    "Increase Strength",
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      updateProfile({ avatar: base64 });
    };
    reader.readAsDataURL(file);
  };

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

  const avatarInitial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-6 pt-6 pb-32 mx-auto max-w-lg lg:pt-28 lg:pb-16">
        {/* HEADER */}
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

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/30 overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarInitial
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background hover:opacity-90 transition-opacity shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              {user?.name}
            </h2>
            <p className="text-muted text-sm">{user?.email}</p>
            <p className="text-muted text-xs mt-1">Member since {joinedDate}</p>
          </div>
        </div>

        {/* BIOMETRICS */}
        <div className="bg-card/50 rounded-3xl border border-surface p-6 mb-4">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
            Biometrics
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
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

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl active:scale-95 transition-all mb-4"
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        )}

        {/* APP INFO */}
        <div className="bg-card/50 rounded-3xl border border-surface p-6 mb-4">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
            App
          </h3>
          <div className="space-y-3">
            {[
              ["Version", "1.0.0 MVP"],
              ["Data Storage", "Local Device"],
              ["Exercise Library", "WGER API"],
            ].map(([k, v], i, arr) => (
              <div key={k}>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-primary text-sm">{k}</span>
                  <span className="text-muted text-sm font-mono">{v}</span>
                </div>
                {i < arr.length - 1 && <div className="h-px bg-surface" />}
              </div>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
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
