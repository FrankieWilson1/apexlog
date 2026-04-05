/**
 * @file AboutPage.tsx
 * @description About page for ApexLog — product story, developer bio,
 * version history, and open source section.
 *
 * Sections:
 * 1. Hero — logo, tagline, badge pills
 * 2. The Problem We Solve — why ApexLog exists
 * 3. Who It's For — target audience
 * 4. Developer bio card
 * 5. Version history timeline
 * 6. Open Source CTA
 * 7. Tech Stack — for developers (at the bottom, not the main event)
 *
 * @module pages/AboutPage
 */

import { useNavigate } from "react-router-dom";

/** Version timeline — label drives dot and badge styles */
const TIMELINE = [
  {
    version: "v1.0",
    label: "MVP",
    items: [
      "Live workout logger with session timer",
      "Per-set weight and reps tracking",
      "Volume bar chart (Recharts)",
      "Multi-user auth",
      "Workout history and detail view",
      "Exercise search (WGER API)",
    ],
  },
  {
    version: "v2.0",
    label: "Current",
    items: [
      "Cloud backend — Node.js + Express + MongoDB",
      "JWT authentication — real secure auth",
      "Floating pill navbar (desktop) + bottom nav (mobile)",
      "5-slide onboarding slideshow",
      "Exercise Library — 1,000+ exercises",
      "Settings — preferences synced to backend",
      "Workout templates, detail view, streak counter",
      "Deployed: Vercel (frontend) + Render (backend)",
    ],
  },
  {
    version: "v3.0",
    label: "Planned",
    items: [
      "Rest timer — configurable between-set countdown",
      "Personal Records — auto-detected, celebrated",
      "Progressive Overload Hints — what to aim for next",
      "Workout Templates — save and reuse sessions",
      "Cardio & Bodyweight Logging — bike, run, yoga, and more",
      "Body Measurements Tracker — weight trends, circumference",
      "Progress Export — shareable image card for social media",
      "Offline Mode — log without WiFi, sync on reconnect",
    ],
  },
  {
    version: "v4.0",
    label: "Coming",
    items: [
      "Achievements & Badges",
      "Friends & Social Feed",
      "Challenges",
      "Coach / Trainer Mode",
    ],
  },
];

/** Full tech stack — frontend + backend */
const FRONTEND_STACK = [
  { name: "React 18", role: "UI Framework", color: "#61DAFB" },
  { name: "TypeScript", role: "Type Safety", color: "#3178C6" },
  { name: "Tailwind CSS v4", role: "Styling", color: "#38BDF8" },
  { name: "React Router v6", role: "Navigation", color: "#F44250" },
  { name: "Recharts", role: "Data Visualization", color: "#8B5CF6" },
  { name: "Vite", role: "Build Tool", color: "#646CFF" },
];

const BACKEND_STACK = [
  { name: "Node.js", role: "Server Runtime", color: "#339933" },
  { name: "Express.js", role: "REST API", color: "#FFFFFF" },
  { name: "MongoDB", role: "Database", color: "#47A248" },
  { name: "JWT", role: "Authentication", color: "#F59E0B" },
  { name: "WGER API", role: "Exercise Data", color: "#10B981" },
  { name: "Vercel + Render", role: "Deployment", color: "#8B5CF6" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-6 pb-32 mx-auto max-w-3xl lg:px-10 lg:pt-28 lg:pb-16">
        {/* ── HERO ── */}
        <div className="text-center mb-14">
          <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl font-bold text-primary mx-auto mb-5">
            A
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">ApexLog</h1>
          <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
            The workout logger built for serious gym goers. Minimal, fast, and
            built around the one thing that matters — tracking your progress and
            watching the numbers go up.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
              v2.0 — Live
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
              Open Source
            </span>
            <span className="bg-surface text-muted text-xs font-bold px-3 py-1.5 rounded-full border border-surface">
              Full Stack
            </span>
          </div>
        </div>

        {/* ── THE PROBLEM WE SOLVE ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-8 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            The Problem We Solve
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: "😤",
                text: "Most apps shame you for missing a streak instead of celebrating your progress.",
              },
              {
                icon: "🤷",
                text: "Most apps log your numbers but never tell you what weight to aim for next session.",
              },
              {
                icon: "🏋️",
                text: "Most apps only support weight lifting — ignoring cardio, yoga, mobility, and bodyweight training.",
              },
              {
                icon: "📱",
                text: "Most apps are built for casual users, not serious gym goers who care about progressive overload.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <p className="text-muted text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHO IT'S FOR ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-8 mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Who It's For
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              "Serious gym goers who train 3+ days a week",
              "Athletes focused on progressive overload and strength",
              "Anyone who wants data-driven progress, not motivation fluff",
              "People who do cardio, yoga, or bodyweight training too — not just lifting",
              "Those who want their data in the cloud and accessible anywhere",
              "Developers who want to contribute to an open-source fitness app",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                <p className="text-muted text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DEVELOPER BIO ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-8 mb-10 text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            F
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Frank Williams Ugwu
          </h2>
          <p className="text-muted text-sm mb-4">Full-Stack Developer</p>
          <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
            Built ApexLog to solve a personal problem: most fitness apps are
            either too simple or too cluttered. ApexLog is minimal, fast, and
            focused on the one thing that matters — tracking your lifts and
            watching the numbers go up.
          </p>
        </div>

        {/* ── VERSION TIMELINE ── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Version History
          </h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-surface" />

            {TIMELINE.map((t, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div
                  className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 ${
                    t.label === "Current"
                      ? "bg-primary border-primary shadow-lg shadow-primary/40"
                      : t.label === "Planned" || t.label === "Coming"
                        ? "bg-background border-muted"
                        : "bg-emerald-500 border-emerald-500"
                  }`}
                />
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-text-primary font-bold">
                    {t.version}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      t.label === "Current"
                        ? "bg-primary/15 text-primary"
                        : t.label === "Planned" || t.label === "Coming"
                          ? "bg-surface text-muted"
                          : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {t.label}
                  </span>
                </div>
                <ul className="space-y-1">
                  {t.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-muted text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-muted flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── OPEN SOURCE CTA ── */}
        <div className="bg-gradient-to-br from-primary/20 to-blue-900/10 rounded-3xl border border-primary/20 p-8 text-center mb-12">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Open Source
          </h3>
          <p className="text-muted text-sm mb-5 leading-relaxed">
            ApexLog is built in public. The full source code — frontend and
            backend — is available on GitHub. Contributions, feedback, and stars
            are always welcome.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold active:scale-95 transition-all hover:bg-primary/90 text-sm"
            >
              Back to Dashboard
            </button>
            <a
              href="https://github.com/frankiewilson1/apexlog"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white px-8 py-3.5 rounded-2xl font-bold active:scale-95 transition-all hover:border-white/30 text-sm"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* ── TECH STACK — for developers, not the main event ── */}
        <div>
          <h2 className="text-lg font-bold text-muted uppercase tracking-wider mb-4 text-center">
            For Developers
          </h2>

          <div className="mb-4">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 px-1">
              Frontend
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FRONTEND_STACK.map((tech, i) => (
                <div
                  key={i}
                  className="bg-card/30 rounded-xl border border-surface p-3 flex flex-col items-center text-center gap-1.5"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  <p className="text-text-primary font-bold text-xs">
                    {tech.name}
                  </p>
                  <p className="text-muted text-[10px]">{tech.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 px-1">
              Backend
            </p>
            <div className="grid grid-cols-3 gap-2">
              {BACKEND_STACK.map((tech, i) => (
                <div
                  key={i}
                  className="bg-card/30 rounded-xl border border-surface p-3 flex flex-col items-center text-center gap-1.5"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  <p className="text-text-primary font-bold text-xs">
                    {tech.name}
                  </p>
                  <p className="text-muted text-[10px]">{tech.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
