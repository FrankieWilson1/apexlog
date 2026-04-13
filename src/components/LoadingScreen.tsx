/**
 * @file LoadingScreen.tsx
 * @description Custom animated loading screen for ApexLog.
 *
 * Renders an athlete silhouette inside a pulsing circle performing
 * an overhead barbell press. The barbell and arms animate up and down
 * in sync, mimicking a real press movement.
 *
 * Used everywhere the app waits for API data — replacing generic spinners.
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 240"
        width="160"
        height="192"
        aria-label="Loading"
      >
        {/* Pulse ring */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1.5"
          className="apex-pulse"
        />
        {/* Circle background */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="#1E293B"
          stroke="#3B82F6"
          strokeWidth="2.5"
        />

        {/* Head */}
        <circle cx="100" cy="48" r="11" fill="#3B82F6" />
        {/* Neck */}
        <rect x="96" y="58" width="8" height="7" rx="2" fill="#3B82F6" />
        {/* Torso */}
        <rect x="82" y="65" width="36" height="30" rx="5" fill="#3B82F6" />
        {/* Hips */}
        <rect x="86" y="90" width="28" height="14" rx="3" fill="#1D4ED8" />
        {/* Left leg */}
        <rect x="86" y="102" width="11" height="22" rx="3" fill="#3B82F6" />
        {/* Left foot */}
        <rect x="81" y="122" width="18" height="6" rx="2" fill="#2563EB" />
        {/* Right leg */}
        <rect x="103" y="102" width="11" height="22" rx="3" fill="#3B82F6" />
        {/* Right foot */}
        <rect x="101" y="122" width="18" height="6" rx="2" fill="#2563EB" />

        {/* Left arm — animates with barbell */}
        <g className="apex-left-arm">
          <rect x="69" y="65" width="13" height="32" rx="6" fill="#3B82F6" />
          <rect x="66" y="78" width="11" height="26" rx="5" fill="#2563EB" />
        </g>

        {/* Right arm — animates with barbell */}
        <g className="apex-right-arm">
          <rect x="118" y="65" width="13" height="32" rx="6" fill="#3B82F6" />
          <rect x="123" y="78" width="11" height="26" rx="5" fill="#2563EB" />
        </g>

        {/* Barbell — the main moving piece */}
        <g className="apex-barbell">
          {/* Left large plate */}
          <rect x="44" y="62" width="9" height="22" rx="2.5" fill="#60A5FA" />
          {/* Left small plate */}
          <rect x="53" y="66" width="6" height="14" rx="2" fill="#93C5FD" />
          {/* Bar */}
          <rect x="59" y="70" width="82" height="8" rx="3" fill="#BFDBFE" />
          {/* Right small plate */}
          <rect x="141" y="66" width="6" height="14" rx="2" fill="#93C5FD" />
          {/* Right large plate */}
          <rect x="147" y="62" width="9" height="22" rx="2.5" fill="#60A5FA" />
        </g>

        {/* Loading text */}
        <text
          x="100"
          y="208"
          textAnchor="middle"
          fontFamily="ui-monospace,monospace"
          fontSize="9"
          fontWeight="500"
          letterSpacing="3"
          fill="#64748B"
        >
          {message.toUpperCase()}
        </text>

        {/* Animated dots */}
        <circle cx="88" cy="220" r="2.5" fill="#3B82F6" className="apex-d1" />
        <circle cx="100" cy="220" r="2.5" fill="#3B82F6" className="apex-d2" />
        <circle cx="112" cy="220" r="2.5" fill="#3B82F6" className="apex-d3" />
      </svg>
    </div>
  );
}
