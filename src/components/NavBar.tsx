/**
 * @file NavBar.tsx
 * @description Application-wide navigation bar for ApexLog.
 *
 * Desktop: floating pill — Logo | Features | Library | About | Start Training
 * Mobile: 4-tab bottom bar — Dashboard | Log | Library | Profile
 *         + More sheet — Records | About | Settings
 *
 * @module components/NavBar
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    label: "Log",
    path: "/logger",
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

const MORE_ITEMS = [
  {
    label: "Records",
    path: "/records",
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
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    label: "Features",
    path: "/features",
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
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

const DESKTOP_LINKS = [
  { label: "Features", path: "/features" },
  { label: "Library", path: "/library" },
  { label: "Records", path: "/records" },
  { label: "About", path: "/about" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  // Hide on full-screen flows — logger has its own header
  const hideOn = ["/login", "/signup", "/onboarding", "/logger"];
  if (hideOn.includes(pathname)) return null;

  const isLanding = pathname === "/";
  const isActive = (path: string) => pathname === path;
  const isMoreActive = MORE_ITEMS.some((i) => i.path === pathname);

  const handleMoreNav = (path: string) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ── DESKTOP PILL ── */}
      <nav
        className="hidden lg:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 items-center px-2 py-1.5 rounded-full"
        style={{
          backgroundColor: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          whiteSpace: "nowrap",
          gap: "2px",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate(isLanding ? "/" : "/dashboard")}
          className="text-sm font-bold text-white px-3 py-2 rounded-full transition-colors flex-shrink-0"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Apex<span style={{ color: "#3B82F6" }}>Log</span>
        </button>

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "18px",
            backgroundColor: "rgba(255,255,255,0.1)",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />

        {/* Centre links */}
        {DESKTOP_LINKS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="px-3 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0"
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

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "18px",
            backgroundColor: "rgba(255,255,255,0.1)",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />

        {/* CTA */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => navigate(isLanding ? "/signup" : "/logger")}
            className="px-4 py-2 rounded-full text-sm font-bold text-white transition-all active:scale-95 flex-shrink-0"
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

      {/* ── MOBILE BOTTOM NAV + MORE SHEET ── */}
      {!isLanding && (
        <>
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

          {/* More sheet */}
          <div
            className="lg:hidden fixed left-4 right-4 z-50 rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              bottom: moreOpen ? "90px" : "-300px",
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
                {isActive(item.path) && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#3B82F6" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Bottom tab bar */}
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

          <div className="lg:hidden" style={{ height: "80px" }} />
        </>
      )}
    </>
  );
}
