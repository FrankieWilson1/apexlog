/**
 * @file NavBar.tsx
 * @description Application-wide navigation bar for ApexLog.
 *
 * Renders two distinct navigation layouts depending on viewport size:
 *
 * - **Desktop (lg+):** A floating, glassmorphic pill centered at the top of the
 *   screen. Contains the logo, three centre links (Features, Library, About),
 *   a Settings gear icon (app pages only), and a "Start Training" CTA button.
 *
 * - **Mobile (<lg):** A fixed bottom tab bar with 4 core tabs (Dashboard,
 *   Features, Library, Profile) and a "More ···" button that opens a smooth
 *   slide-up sheet containing About and Settings.
 *
 * ## Visibility rules
 * The NavBar is **hidden** on `/login`, `/signup`, `/onboarding`, and `/logger`
 * — pages that are either full-screen flows or have their own headers.
 * It renders on `/` (landing page) and all authenticated app pages.
 *
 * ## Spacing contract
 * The NavBar does **not** inject spacer divs. Each page is responsible for
 * its own top padding (`lg:pt-28`) to clear the floating desktop pill.
 * On mobile, a single `80px` spacer div clears the bottom tab bar.
 *
 * @module components/NavBar
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Core tab definitions for the mobile bottom tab bar.
 * Each entry has a label, route path, and a render function for its icon
 * that accepts an `active` boolean to switch between filled and outlined styles.
 */
const CORE_TABS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "Features",
    path: "/features",
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    label: "Library",
    path: "/library",
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

/**
 * Secondary navigation items shown in the mobile "More" slide-up sheet
 * and in the desktop centre links. These are lower-frequency destinations
 * that don't need a dedicated tab on the bottom bar.
 */
const MORE_ITEMS = [
  {
    label: "About",
    path: "/about",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

/**
 * Centre link definitions for the desktop pill navbar.
 * Intentionally excludes Dashboard (accessed via the logo) and
 * Settings (accessed via the gear icon).
 */
const DESKTOP_LINKS = [
  { label: "Features", path: "/features" },
  { label: "Library", path: "/library" },
  { label: "About", path: "/about" },
];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * NavBar
 *
 * Renders the appropriate navigation layout for the current viewport and route.
 * Returns `null` (no output) on auth/flow pages where a navbar would be intrusive.
 *
 * @example
 * // Placed once in App.tsx, outside all route definitions
 * <BrowserRouter>
 *   <NavBar />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 */
export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /** Controls the mobile "More" slide-up sheet visibility */
  const [moreOpen, setMoreOpen] = useState(false);

  // ── Visibility guard ───────────────────────────────────────────────────────
  const hideOn = ["/login", "/signup", "/onboarding", "/logger"];
  if (hideOn.includes(pathname)) return null;

  /** True when the user is on the public landing page */
  const isLanding = pathname === "/";

  /** Returns true if the given path matches the current route exactly */
  const isActive = (path: string) => pathname === path;

  /** True when a "More" item (About/Settings) is the current active route */
  const isMoreActive = MORE_ITEMS.some((i) => i.path === pathname);

  /**
   * Navigates to a "More" sheet item and closes the sheet.
   * @param {string} path - The route to navigate to.
   */
  const handleMoreNav = (path: string) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP PILL NAV
          Fixed, centered, frosted-glass pill. Min-width 580px prevents
          it from collapsing on narrower laptop screens.
          Inline styles are used instead of Tailwind classes for hover
          effects to avoid Tailwind v4 purge issues with dynamic values.
      ══════════════════════════════════════════════════════════════════ */}
      <nav
        className="hidden lg:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 items-center gap-1 px-2 py-2 rounded-full"
        style={{
          backgroundColor: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          minWidth: "580px",
        }}
      >
        {/* Logo — navigates to landing on public pages, dashboard on app pages */}
        <button
          onClick={() => navigate(isLanding ? "/" : "/dashboard")}
          className="text-base font-bold text-white px-4 py-1.5 rounded-full transition-colors"
          style={{ color: "#ffffff" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Apex<span style={{ color: "#3B82F6" }}>Log</span>
        </button>

        {/* Visual separator between logo and centre links */}
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            margin: "0 4px",
          }}
        />

        {/* Centre navigation links */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {DESKTOP_LINKS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
                  backgroundColor: active
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Settings gear (app pages only) + CTA */}
        <div className="flex items-center gap-2">
          {/* Settings gear — hidden on landing page, shown on all app pages */}
          {!isLanding && (
            <button
              onClick={() => navigate("/settings")}
              title="Settings"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                color: isActive("/settings")
                  ? "#ffffff"
                  : "rgba(255,255,255,0.4)",
                backgroundColor: isActive("/settings")
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ffffff";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive("/settings")) {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.4)";
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}

          {/* Primary CTA — "Sign up" on landing, "Start workout" on app pages */}
          <button
            onClick={() => navigate(isLanding ? "/signup" : "/logger")}
            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all active:scale-95"
            style={{ backgroundColor: "#3B82F6" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "#2563EB")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "#3B82F6")
            }
          >
            Start Training
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV + MORE SHEET
          Hidden on the landing page (isLanding check). The landing page
          has its own inline CTA buttons that serve the same purpose.
      ══════════════════════════════════════════════════════════════════ */}
      {!isLanding && (
        <>
          {/* Semi-transparent backdrop — closes the More sheet on outside tap */}
          {moreOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setMoreOpen(false)}
            />
          )}

          {/*
           * More slide-up sheet
           * Animates in/out using CSS `bottom` transition.
           * `pointerEvents: none` when hidden prevents accidental taps on invisible buttons.
           */}
          <div
            className="lg:hidden fixed left-4 right-4 z-50 rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              bottom: moreOpen ? "90px" : "-200px",
              backgroundColor: "#1E293B",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
              opacity: moreOpen ? 1 : 0,
              pointerEvents: moreOpen ? "auto" : "none",
            }}
          >
            {MORE_ITEMS.map((item, i) => (
              <button
                key={item.path}
                onClick={() => handleMoreNav(item.path)}
                className="w-full flex items-center gap-4 px-5 py-4 transition-colors text-left"
                style={{
                  borderBottom:
                    i < MORE_ITEMS.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  backgroundColor: isActive(item.path)
                    ? "rgba(59,130,246,0.1)"
                    : "transparent",
                  color: isActive(item.path)
                    ? "#3B82F6"
                    : "rgba(255,255,255,0.75)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path))
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path))
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                }}
              >
                <span
                  style={{
                    color: isActive(item.path)
                      ? "#3B82F6"
                      : "rgba(255,255,255,0.4)",
                  }}
                >
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.label}</span>
                {/* Blue dot indicator for the currently active route */}
                {isActive(item.path) && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#3B82F6" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Bottom tab bar — 4 core tabs + More trigger */}
          <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pt-2 pb-5"
            style={{
              backgroundColor: "#0F172A",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
            }}
          >
            {CORE_TABS.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setMoreOpen(false);
                    navigate(item.path);
                  }}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
                  style={{
                    color: active ? "#3B82F6" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {item.icon(active)}
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: active ? "#3B82F6" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* More ··· button — highlighted when a More-sheet route is active */}
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
              style={{
                color:
                  isMoreActive || moreOpen
                    ? "#3B82F6"
                    : "rgba(255,255,255,0.35)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </nav>

          {/* Bottom spacer — ensures page content scrolls above the tab bar */}
          <div className="lg:hidden" style={{ height: "80px" }} />
        </>
      )}
    </>
  );
}
