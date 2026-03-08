import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "⚡",
    title: "Live Workout Logger",
    description:
      "Log exercises in real time with a built-in timer. Add sets, track reps and weight, and finish with a single tap. Your data is saved instantly.",
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
      "Stay consistent with a daily workout streak tracker. Auto-calculates from your real history — no manual input needed.",
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
      "Every session is stored. Tap any past workout to see the full set-by-set breakdown — exercises, reps, weight, and duration.",
    accent: "#EC4899",
    badge: "History",
  },
  {
    icon: "👤",
    title: "User Profiles",
    description:
      "Personalize with a profile photo, fitness goal, height, and weight. Your data lives locally — fast, private, no server required.",
    accent: "#14B8A6",
    badge: "Profile",
  },
  {
    icon: "🔒",
    title: "Secure Auth",
    description:
      "Multi-user account system with session management. Each user has isolated workout data — safe to share a device.",
    accent: "#F59E0B",
    badge: "Security",
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

const ROADMAP = [
  { label: "Rest Timer", status: "planned" },
  { label: "Personal Records (PRs)", status: "planned" },
  { label: "Custom Workout Templates", status: "planned" },
  { label: "Export to CSV", status: "planned" },
  { label: "Dark / Light Theme", status: "planned" },
  { label: "Cloud Sync", status: "future" },
  { label: "Social / Friends", status: "future" },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-6 pb-32 mx-auto max-w-4xl lg:px-10 lg:pt-28 lg:pb-16">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            v2.0 — Live
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mt-4 mb-3 leading-tight">
            Everything ApexLog Can Do
          </h1>
          <p className="text-muted text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
            A full-stack fitness tracking experience. Here's what's live right
            now.
          </p>
        </div>

        {/* Feature grid */}
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

        {/* Roadmap */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            What's Coming
          </h2>
          <p className="text-muted text-sm mb-5">
            Features actively planned or on the horizon.
          </p>
          <div className="flex flex-wrap gap-3">
            {ROADMAP.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-surface/60 border border-surface px-4 py-2 rounded-xl"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === "planned" ? "bg-primary" : "bg-muted"}`}
                />
                <span className="text-sm font-medium text-text-primary">
                  {item.label}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase ${item.status === "planned" ? "text-primary" : "text-muted"}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
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
