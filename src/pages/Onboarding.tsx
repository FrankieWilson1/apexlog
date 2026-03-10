/**
 * @file Onboarding.tsx
 * @description First-run onboarding slideshow for new ApexLog users.
 *
 * Renders a 5-slide walkthrough covering: welcome, workout logging,
 * progress tracking, the exercise library, and a final CTA. Each slide
 * has its own accent colour, emoji icon, headline, and description.
 * Slides 2 and 3 additionally render numbered step lists.
 *
 * ## Navigation
 * - **Next / Finish** — advances slides; on the last slide writes
 *   `apexlog_onboarded = "true"` to `localStorage` and navigates to
 *   `/dashboard`.
 * - **Back** — retreats one slide; disabled (but not hidden) on slide 1.
 * - **Skip** — jumps straight to `/dashboard` from any non-last slide,
 *   also writing the `apexlog_onboarded` key.
 *
 * Dot indicators below the card are clickable for direct navigation.
 *
 * ## Personalisation
 * The first slide heading is personalised: if `user.name` is available
 * (i.e. the user just signed up), it renders "Welcome, {firstName} 👋"
 * instead of the default slide title.
 *
 * @module pages/Onboarding
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// ─────────────────────────────────────────────────────────────────────────────
// Slide data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Slide definition.
 * `steps` is optional — only slides 2 and 3 include it.
 */
interface Slide {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  steps?: string[];
}

const SLIDES: Slide[] = [
  {
    emoji: "🏋️",
    title: "Welcome to ApexLog",
    subtitle: "Your personal fitness OS",
    description:
      "ApexLog helps you log every rep, track your volume over time, and see exactly how far you've come. Built for athletes who take progress seriously.",
    accent: "#3B82F6",
  },
  {
    emoji: "📋",
    title: "Log Your Workouts",
    subtitle: "Every session. Every set.",
    description:
      "Start a session, search exercises, log your reps and weight, then finish. Everything is saved to your personal history instantly.",
    accent: "#10B981",
    steps: [
      "Tap '+ Start Training'",
      "Search & add exercises",
      "Enter weight & reps",
      "Tap ✓ to complete each set",
      "Hit Finish when done",
    ],
  },
  {
    emoji: "📈",
    title: "Track Your Progress",
    subtitle: "Numbers don't lie.",
    description:
      "Your Dashboard shows weekly volume charts, current streak, and total volume. Tap any past session for the full set-by-set breakdown.",
    accent: "#8B5CF6",
    steps: [
      "Volume chart updates after every session",
      "Streak counts consecutive workout days",
      "Tap history cards for full detail",
    ],
  },
  {
    emoji: "📚",
    title: "Explore the Library",
    subtitle: "1000+ exercises.",
    description:
      "Browse exercises by muscle group — even outside a workout. Perfect for planning your next training block.",
    accent: "#F97316",
  },
  {
    emoji: "🔥",
    title: "You're All Set",
    subtitle: "Let's get to work.",
    description:
      "Your account is ready. Start your first workout now — your streak begins today. Every elite athlete started with a single rep.",
    accent: "#EF4444",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Onboarding
 *
 * Full-screen 5-slide onboarding flow shown once to new users after login.
 * Writes `apexlog_onboarded` to `localStorage` on completion or skip so the
 * flow is never shown again.
 */
export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  const isFirst = current === 0;

  /**
   * handleNext
   *
   * Advances to the next slide. On the last slide, marks onboarding as
   * complete and navigates to the dashboard.
   */
  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("apexlog_onboarded", "true");
      navigate("/dashboard");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  /**
   * handleBack
   *
   * Retreats one slide. No-ops on the first slide.
   */
  const handleBack = () => {
    if (!isFirst) setCurrent((c) => c - 1);
  };

  /**
   * handleSkip
   *
   * Marks onboarding as complete and navigates to the dashboard immediately.
   * Available on all slides except the last.
   */
  const handleSkip = () => {
    localStorage.setItem("apexlog_onboarded", "true");
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0F172A", color: "#ffffff" }}
    >
      {/* ── TOP BAR: logo + skip ── */}
      <div className="flex items-center justify-between px-6 pt-10 pb-2 flex-shrink-0">
        <span className="text-lg font-bold text-white">
          Apex<span style={{ color: "#3B82F6" }}>Log</span>
        </span>
        {!isLast && (
          <button
            onClick={handleSkip}
            className="text-sm font-semibold transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
            }
          >
            Skip
          </button>
        )}
      </div>

      {/* ── SLIDE AREA ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-lg mx-auto w-full">
        {/* Slide card */}
        <div
          className="w-full rounded-3xl p-8 flex flex-col items-center gap-6 mb-8"
          style={{
            backgroundColor: "#1E293B",
            border: `1px solid ${slide.accent}25`,
            boxShadow: `0 0 60px ${slide.accent}10`,
          }}
        >
          {/* Emoji icon */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
            style={{
              backgroundColor: `${slide.accent}15`,
              border: `1px solid ${slide.accent}30`,
              boxShadow: `0 8px 32px ${slide.accent}20`,
            }}
          >
            {slide.emoji}
          </div>

          {/* Text */}
          <div className="text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: slide.accent }}
            >
              {slide.subtitle}
            </p>
            <h1 className="text-2xl font-bold text-white mb-3 leading-snug">
              {/* Personalise first slide with the user's first name */}
              {current === 0 && user?.name
                ? `Welcome, ${user.name.split(" ")[0]} 👋`
                : slide.title}
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {slide.description}
            </p>
          </div>

          {/* Optional step list — slides 2 and 3 only */}
          {slide.steps && (
            <div className="w-full flex flex-col gap-2">
              {slide.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: `${slide.accent}0D`,
                    border: `1px solid ${slide.accent}18`,
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${slide.accent}22`,
                      color: slide.accent,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dot progress indicators — clickable for direct navigation */}
        <div className="flex items-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                backgroundColor: i === current ? slide.accent : "#334155",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Back + Next/Finish row */}
        <div className="flex items-center gap-3 w-full">
          {/* Back button — visually dimmed on first slide */}
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="flex items-center justify-center w-14 h-14 rounded-2xl border transition-all flex-shrink-0 active:scale-95"
            style={{
              backgroundColor: "#1E293B",
              borderColor: isFirst
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.12)",
              color: isFirst
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.6)",
              cursor: isFirst ? "not-allowed" : "pointer",
            }}
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

          {/* Next / Finish */}
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-all"
            style={{ backgroundColor: slide.accent }}
          >
            {isLast ? "🚀 Start My First Workout" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
