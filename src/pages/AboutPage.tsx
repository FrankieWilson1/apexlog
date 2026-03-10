/**
 * @file AboutPage.tsx
 * @description About page for ApexLog — project info, developer bio, tech stack, version history.
 *
 * Static informational page with four sections:
 * 1. **Hero** — logo icon, tagline, and badge pills (v2.0, Open Source, ALX Capstone).
 * 2. **Developer** — bio card for Frank Williams Ugwu.
 * 3. **Tech Stack** — 2×4 grid of technology cards with colour-coded dots.
 * 4. **Version History** — vertical timeline (v1 → v2 → v3 planned) with dot
 *    indicators and feature bullet lists.
 * 5. **Open Source CTA** — closes the page with a dashboard link.
 *
 * ## Timeline styling
 * The timeline uses a single vertical line (`position: absolute; left: 3px`)
 * with dot elements absolutely positioned at `-left-5`. The current version
 * dot (`v2.0`) is highlighted in `bg-primary` with a glow shadow.
 *
 * @module pages/AboutPage
 */

import { useNavigate } from "react-router-dom";

/** Tech stack entries — colour dots match each technology's brand colour */
const STACK = [
  { name: "React 18", role: "UI Framework", color: "#61DAFB" },
  { name: "TypeScript", role: "Type Safety", color: "#3178C6" },
  { name: "Tailwind CSS v4", role: "Styling", color: "#38BDF8" },
  { name: "React Router v6", role: "Navigation", color: "#F44250" },
  { name: "Recharts", role: "Data Visualization", color: "#8B5CF6" },
  { name: "Vite", role: "Build Tool", color: "#646CFF" },
  { name: "WGER API", role: "Exercise Data", color: "#10B981" },
  { name: "Vercel", role: "Deployment", color: "#FFFFFF" },
];

/** Version timeline — label drives dot and badge styles */
const TIMELINE = [
  {
    version: "v1.0",
    label: "MVP",
    items: ["Workout logger", "Exercise search", "Dashboard", "Auth system"],
  },
  {
    version: "v2.0",
    label: "Current",
    items: [
      "Navbar",
      "Onboarding slideshow",
      "Exercise Library",
      "Features + About pages",
      "Settings",
      "Protected routes",
      "Persistent timer",
    ],
  },
  {
    version: "v3.0",
    label: "Planned",
    items: [
      "Rest timer",
      "Personal records",
      "Workout templates",
      "CSV export",
    ],
  },
];

/**
 * AboutPage
 *
 * Static informational page covering the project background, developer bio,
 * tech stack, version history, and an open-source CTA.
 */
export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-6 pb-32 mx-auto max-w-3xl lg:px-10 lg:pt-28 lg:pb-16">
        {/* ── HERO ── */}
        <div className="text-center mb-14">
          {/* "A" logo icon */}
          <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl font-bold text-primary mx-auto mb-5">
            A
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">ApexLog</h1>
          <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
            A data-driven workout tracker built as an ALX Software Engineering
            capstone project. Designed for athletes who want clarity on their
            progress.
          </p>
          {/* Badge pills */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
              v2.0
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
              Open Source
            </span>
            <span className="bg-surface text-muted text-xs font-bold px-3 py-1.5 rounded-full border border-surface">
              ALX Capstone
            </span>
          </div>
        </div>

        {/* ── DEVELOPER BIO CARD ── */}
        <div className="bg-card/50 rounded-3xl border border-surface p-8 mb-10 text-center">
          {/* Avatar initial */}
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            F
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Frank Williams Ugwu
          </h2>
          <p className="text-muted text-sm mb-4">
            Full-Stack Developer · ALX SE Graduate
          </p>
          <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
            Built ApexLog to solve a personal problem: most fitness apps are
            either too simple or too cluttered. ApexLog is minimal, fast, and
            focused on the one thing that matters — tracking your lifts.
          </p>
        </div>

        {/* ── TECH STACK GRID ── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Tech Stack
          </h2>
          <p className="text-muted text-sm mb-5">
            Everything powering this app.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STACK.map((tech, i) => (
              <div
                key={i}
                className="bg-card/40 rounded-2xl border border-surface p-4 flex flex-col items-center text-center gap-2"
              >
                {/* Brand colour dot */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                <p className="text-text-primary font-bold text-sm">
                  {tech.name}
                </p>
                <p className="text-muted text-xs">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── VERSION TIMELINE ── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Version History
          </h2>
          <div className="relative pl-8">
            {/* Vertical connector line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-surface" />

            {TIMELINE.map((t, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                {/* Timeline dot — colour varies by label */}
                <div
                  className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 ${
                    t.label === "Current"
                      ? "bg-primary border-primary shadow-lg shadow-primary/40"
                      : t.label === "Planned"
                        ? "bg-background border-muted"
                        : "bg-emerald-500 border-emerald-500"
                  }`}
                />

                {/* Version label + status badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-text-primary font-bold">
                    {t.version}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      t.label === "Current"
                        ? "bg-primary/15 text-primary"
                        : t.label === "Planned"
                          ? "bg-surface text-muted"
                          : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {t.label}
                  </span>
                </div>

                {/* Feature bullet list */}
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
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/5 rounded-3xl border border-emerald-500/20 p-8 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Open Source
          </h3>
          <p className="text-muted text-sm mb-5 leading-relaxed">
            ApexLog is a capstone project built in public. The full source code
            is available on GitHub. Contributions, feedback, and stars are
            always welcome.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold active:scale-95 transition-all hover:bg-emerald-500/90 text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
