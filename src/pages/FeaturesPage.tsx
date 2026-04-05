/**
 * @file FeaturesPage.tsx
 * @description Full feature showcase and roadmap page for ApexLog.
 *
 * Displays all shipped v2.0 features in a two-column card grid, each with
 * an icon, category badge, title, and description. Below the grid, the
 * roadmap section groups upcoming features by version (v3, v4, v5).
 * The page closes with a CTA linking to the live logger.
 *
 * @module pages/FeaturesPage
 */

import { useNavigate } from "react-router-dom";

/** All shipped v2.0 features — rendered as a two-column card grid */
const FEATURES = [
  {
    icon: "⚡",
    title: "Live Workout Logger",
    description:
      "Log exercises in real time with a built-in timer. Add sets, track reps and weight, and finish with a single tap. Data is saved to the cloud instantly.",
    accent: "#3B82F6",
    badge: "Core",
  },
  {
    icon: "📊",
    title: "Volume Analytics",
    description:
      "Visualize your weekly training volume with an auto-updating bar chart. See whether your training load is growing week over week.",
    accent: "#10B981",
    badge: "Analytics",
  },
  {
    icon: "🔥",
    title: "Streak Counter",
    description:
      "Stay consistent with a daily workout streak tracker. Auto-calculates from your real session history — no manual input needed.",
    accent: "#F97316",
    badge: "Motivation",
  },
  {
    icon: "📚",
    title: "Exercise Library",
    description:
      "Browse 1,000+ exercises from the WGER open fitness API. Filter by muscle group. Plan sessions or discover new movements.",
    accent: "#8B5CF6",
    badge: "Library",
  },
  {
    icon: "🗂️",
    title: "Workout History",
    description:
      "Every session is stored in the cloud. Tap any past workout to see the full set-by-set breakdown — exercises, reps, weight, and duration.",
    accent: "#EC4899",
    badge: "History",
  },
  {
    icon: "👤",
    title: "User Profiles",
    description:
      "Personalize with a profile photo, fitness goal, height, and weight. Your data syncs to the cloud and follows you across devices.",
    accent: "#14B8A6",
    badge: "Profile",
  },
  {
    icon: "🔒",
    title: "Secure Auth",
    description:
      "JWT-based authentication with bcrypt password hashing. Each user has fully isolated workout data — safe to share a device.",
    accent: "#F59E0B",
    badge: "Security",
  },
  {
    icon: "☁️",
    title: "Cloud Sync",
    description:
      "All data stored in MongoDB Atlas. Log a workout on your phone, review it on your laptop. Your progress is always where you are.",
    accent: "#38BDF8",
    badge: "Cloud",
  },
  {
    icon: "📱",
    title: "Mobile-First Design",
    description:
      "Built for the gym floor. Full-screen mobile layout with bottom nav, large tap targets, and native-feeling interactions.",
    accent: "#6366F1",
    badge: "UX",
  },
];

/**
 * Roadmap groups — organised by version.
 * status: "v3" | "v4" | "v5"
 */
const ROADMAP = [
  // v3.0
  {
    label: "Rest Timer",
    status: "v3",
    description: "Auto-starts between sets. Configurable duration.",
  },
  {
    label: "Personal Records (PRs)",
    status: "v3",
    description: "Auto-detected. Celebrated. Tracked per exercise.",
  },
  {
    label: "Progressive Overload Hints",
    status: "v3",
    description: '"Last time: 80kg×8. Try 82.5kg today."',
  },
  {
    label: "Workout Templates",
    status: "v3",
    description: "Save Push/Pull/Leg days. Start with one tap.",
  },
  {
    label: "Cardio & Bodyweight Logging",
    status: "v3",
    description: "Bike, run, plank, yoga, stretching, and more.",
  },
  {
    label: "Body Measurements Tracker",
    status: "v3",
    description: "Weight trends, circumference, body fat %.",
  },
  {
    label: "Progress Export",
    status: "v3",
    description: "Shareable image card for Instagram, WhatsApp, X.",
  },
  {
    label: "Offline Mode",
    status: "v3",
    description: "Log without WiFi. Sync when back online.",
  },
  // v4.0
  {
    label: "Achievements & Badges",
    status: "v4",
    description: "Reward consistency, not perfection.",
  },
  {
    label: "Friends & Social Feed",
    status: "v4",
    description: "See workout summaries from friends.",
  },
  {
    label: "Challenges",
    status: "v4",
    description: "30-day consistency, volume competitions.",
  },
  {
    label: "Coach / Trainer Mode",
    status: "v4",
    description: "Assign programs to clients. Track progress.",
  },
  // v5.0
  {
    label: "AI Workout Suggestions",
    status: "v5",
    description: "Smart programming from your history.",
  },
  {
    label: "Wearable Integration",
    status: "v5",
    description: "Apple Watch, Google Fit, Garmin.",
  },
  {
    label: "Mobile App",
    status: "v5",
    description: "React Native — iOS + Android.",
  },
];

const VERSION_COLORS = {
  v3: {
    dot: "bg-primary",
    label: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  v4: {
    dot: "bg-violet-400",
    label: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  v5: { dot: "bg-muted", label: "text-muted", bg: "bg-surface border-surface" },
};

export default function FeaturesPage() {
  const navigate = useNavigate();

  const v3 = ROADMAP.filter((r) => r.status === "v3");
  const v4 = ROADMAP.filter((r) => r.status === "v4");
  const v5 = ROADMAP.filter((r) => r.status === "v5");

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-6 pb-32 mx-auto max-w-4xl lg:px-10 lg:pt-28 lg:pb-16">
        {/* ── PAGE HEADER ── */}
        <div className="mb-10 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            v2.0 — Live
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mt-4 mb-3 leading-tight">
            Everything ApexLog Can Do
          </h1>
          <p className="text-muted text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
            A full-stack fitness tracking experience. Here's what's live right
            now — and where we're going next.
          </p>
        </div>

        {/* ── FEATURE CARDS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-14">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-card/50 rounded-2xl border border-surface p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    backgroundColor: `${f.accent}18`,
                    border: `1px solid ${f.accent}33`,
                  }}
                >
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-text-primary">{f.title}</h3>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${f.accent}18`,
                        color: f.accent,
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROADMAP ── */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            What's Coming
          </h2>
          <p className="text-muted text-sm mb-8">
            Features planned across the next three versions.
          </p>

          {/* v3.0 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base font-bold text-text-primary">
                v3.0
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                Planned — Building Next
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {v3.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-surface/40 border border-surface px-4 py-3 rounded-xl"
                >
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* v4.0 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base font-bold text-text-primary">
                v4.0
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-400/15 text-violet-400">
                Coming
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {v4.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-surface/40 border border-surface px-4 py-3 rounded-xl"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* v5.0 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base font-bold text-text-primary">
                v5.0
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface text-muted">
                Future
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {v5.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-surface/40 border border-surface px-4 py-3 rounded-xl"
                >
                  <span className="w-2 h-2 rounded-full bg-muted flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-br from-primary/20 to-blue-900/10 rounded-3xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Ready to train smarter?
          </h3>
          <p className="text-muted text-sm mb-6">
            Start logging your first workout and watch your dashboard come
            alive.
          </p>
          <button
            onClick={() => navigate("/logger")}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold active:scale-95 transition-all hover:bg-primary/90"
          >
            + Log a Workout
          </button>
        </div>
      </div>
    </div>
  );
}
