/**
 * @file LoadingScreen.tsx
 * @description Custom animated loading screen for ApexLog.
 * Replaces generic spinners with a branding-appropriate dumbbell curl.
 *
 * The animation pivots from the bottom-center, mimicking an arm curl —
 * weight rises, pauses at the top, then lowers back down.
 *
 * @module components/LoadingScreen
 */

export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Dumbbell curl animation */}
        <div
          className="animate-curl py-6"
          style={{ filter: "drop-shadow(0 0 12px rgba(59,130,246,0.5))" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 24"
            width="64"
            height="24"
            fill="#3B82F6"
          >
            {/* Left plate */}
            <rect x="0" y="4" width="8" height="16" rx="2" />
            {/* Left collar */}
            <rect x="8" y="7" width="4" height="10" rx="1" />
            {/* Bar */}
            <rect x="12" y="10" width="40" height="4" rx="2" />
            {/* Right collar */}
            <rect x="52" y="7" width="4" height="10" rx="1" />
            {/* Right plate */}
            <rect x="56" y="4" width="8" height="16" rx="2" />
          </svg>
        </div>

        {/* Message */}
        <p className="text-muted text-sm font-semibold tracking-widest uppercase animate-pulse py-6">
          {message}
        </p>
      </div>
    </div>
  );
}
