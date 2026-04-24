/**
 * @file PRCelebration.tsx
 * @description Full-screen celebration modal shown after a workout
 * contains one or more new personal records.
 *
 * Displary each new PR exercise name with a trophy icon and
 * auto-dismisses after 5 seconds. User can also tap "let's Go" to
 * dismiss immediately.
 *
 * @module component/PRCelebrati
 */

import type { PRCelebrations } from "../types";

export default function PRCelebration({ newPRs, onDismiss }: PRCelebrations) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{
            backgroundColor: "#1E293B",
            border: "1px solid rgba(251,191,36,0.3",
            boxShadow: "0 0 60px rgba(251,191,36,0,15)",
          }}
        >
          {/* Trophy */}
          <div className="text-6xl mb-4">🏆</div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {/** Checks for a new personal records */}
            Personal Record{newPRs.length > 1 ? "s" : ""}!
          </h2>
          <p className="text-muted text-sm mb-6">
            You crushed your previous best
            {newPRs.length > 1 ? "s" : ""} today.
          </p>

          {/** PR list */}
          <div className="flex flex-col gap-2 mb-8">
            {newPRs.map((name, i) => (
              <div
                key={i}
                className="flex item-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  backgroundColor: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.2)",
                }}
              >
                <span className="text-lg">💪</span>
                <span className="text-hite font-semibold text-sm text-left">
                  {name}
                </span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(251,191,36,0.15)",
                    color: "#FBB124",
                    paddingTop: "5px",
                  }}
                >
                  NEW PR
                </span>
              </div>
            ))}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm active:scale-95 transition-all"
            style={{ backgroundColor: "#F59E0B" }}
          >
            Let's Go! 🔥
          </button>
        </div>
      </div>
    </>
  );
}
