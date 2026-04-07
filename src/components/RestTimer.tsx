/**
 * @file RestTimer.tsx
 * @description Bottom sheet rest timer for the Live Logger.
 *
 * Slides up from the bottom when a set is completed. Counts down from
 * the user's configured rest duration. Plays an audio beep and vibrates
 * (mobile) when the timer hits zero. Dismissible at any point.
 *
 * ## Design
 * - Sits above the "Add Exercise" fixed button at z-40
 * - Animated progress arc shows time remaining visually
 * - Three quick-adjust buttons (+15s, -15s, skip)
 * - Auto-dismisses 2 seconds after hitting zero
 *
 * @module components/RestTimer
 */

import { useEffect, useState, useRef } from "react";

interface RestTimerProps {
  /** Duration in seconds — comes from user.restDuration */
  duration: number;
  /** Called when the user dismisses or the timer completes */
  onDismiss: () => void;
}

/**
 * Plays a short beep using the Web Audio API.
 * Falls back silently if the browser doesn't support it.
 */
function playBeep() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 880;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not supported — fail silently
  }
}

/**
 * Triggers device vibration if supported.
 * Pattern: 200ms on, 100ms off, 200ms on.
 */
function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
}

export default function RestTimer({ duration, onDismiss }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Countdown effect ───────────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsComplete(true);
          playBeep();
          vibrate();
          // Auto-dismiss 2 seconds after completion
          setTimeout(onDismiss, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────
  const adjust = (delta: number) => {
    setSecondsLeft((prev) => Math.max(0, Math.min(600, prev + delta)));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
  };

  // Progress arc — percentage of time remaining
  const progress = secondsLeft / duration;
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-6 pb-10"
        style={{
          backgroundColor: "#1E293B",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-surface rounded-full mx-auto mb-6" />

        {/* Label */}
        <p className="text-center text-muted text-xs font-bold uppercase tracking-widest mb-4">
          {isComplete ? "Rest Complete!" : "Rest Timer"}
        </p>

        {/* Progress arc + time display */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              {/* Background track */}
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              {/* Progress arc */}
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={isComplete ? "#10B981" : "#3B82F6"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 1s linear, stroke 0.3s",
                }}
              />
            </svg>
            {/* Time text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-3xl font-bold font-mono"
                style={{ color: isComplete ? "#10B981" : "#ffffff" }}
              >
                {isComplete ? "✓" : formatTime(secondsLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Adjust buttons */}
        {!isComplete && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => adjust(-15)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-muted transition-all"
              style={{ backgroundColor: "#334155" }}
            >
              −15s
            </button>
            <button
              onClick={() => adjust(15)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-muted transition-all"
              style={{ backgroundColor: "#334155" }}
            >
              +15s
            </button>
          </div>
        )}

        {/* Skip / Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            backgroundColor: isComplete ? "#10B981" : "#334155",
            color: "#ffffff",
          }}
        >
          {isComplete ? "Start Next Set" : "Skip Rest"}
        </button>
      </div>
    </>
  );
}
