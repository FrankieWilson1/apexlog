/**
 * @file LandingPage.tsx
 * @description Public marketing landing page for ApexLog.
 *
 * The entry point at `/` for unauthenticated users. Consists of four sections:
 *
 * 1. **Hero** — Full-viewport gym background image (Unsplash) with a dark
 *    gradient overlay, headline, subtext, and two CTA buttons.
 * 2. **Features** — Three feature cards on a dark background
 *    ("Engineered For Results").
 * 3. **CTA Banner** — Centred "Ready to Level Up?" call to action.
 * 4. **Footer** — Logo, nav links (Features, Library, About), and
 *    placeholder policy links.
 *
 * ## Background image technique
 * The hero uses a CSS `background-image` with two layers:
 * - A directional dark gradient (`rgba(10,15,28,0.92)` → `0.55`) that
 *   keeps the left side legible for the text block.
 * - The Unsplash gym photo as the base layer.
 *
 * A bottom fade div (`linear-gradient to bottom, transparent → #0F172A`)
 * blends the hero into the features section without a hard edge.
 *
 * ## CTA routing
 * All buttons use `useNavigate` — no `<a>` tags — so navigation is handled
 * by React Router without a full page reload.
 *
 * @module pages/LandingPage
 */

import { useNavigate } from "react-router-dom";

/** Feature cards for the "Engineered For Results" section */
const FEATURES = [
  {
    icon: "📊",
    title: "Real-Time Analytics",
    desc: "Visualize your weekly volume and frequency with auto-generated charts.",
  },
  {
    icon: "⚡",
    title: "Rapid-Fire Logging",
    desc: "Optimized for the gym floor. Log sets, reps and weight without breaking your flow.",
  },
  {
    icon: "📚",
    title: "1,000+ Exercises",
    desc: "Access a massive library of movements with detailed instructions and tracking history.",
  },
];

/**
 * LandingPage
 *
 * Public marketing page at `/`. Renders the hero, features, CTA banner,
 * and footer. Unauthenticated users land here; the shared NavBar floats
 * above the hero (z-50) without being rendered by this component.
 */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* ══════════════════════════════════════════
          SECTION 1: HERO — full-viewport gym photo
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-end lg:items-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10,15,28,0.92) 40%, rgba(10,15,28,0.55) 100%),
            url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 pb-20 pt-36 lg:pt-0 mt-10">
          <div className="max-w-xl">
            {/* "v2.0 is live" badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                backgroundColor: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#3B82F6",
              }}
            >
              🏋️ v2.0 is live
            </div>

            {/* Headline — fluid font size via clamp */}
            <h1
              className="font-extrabold text-white leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Master Your Gains
              <br />
              with Precision
              <br />
              Engineering
            </h1>

            {/* Subtext */}
            <p
              className="text-lg mb-10 max-w-md leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              The engineering-first workout logger designed to track every set,
              visualize your volume, and master your progress.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 rounded-full font-bold text-base text-white transition-all active:scale-95"
                style={{
                  backgroundColor: "#3B82F6",
                  boxShadow: "0 0 30px rgba(59,130,246,0.4)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "#2563EB")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "#3B82F6")
                }
              >
                Start Training For Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-full font-bold text-base transition-all"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.65)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.15)";
                }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade — blends hero into the features section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #0F172A)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: FEATURES — "Engineered For Results"
      ══════════════════════════════════════════ */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ backgroundColor: "#0F172A" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Engineered For Results
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Built for the gym floor. No fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl flex flex-col gap-4"
                style={{
                  backgroundColor: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Icon area */}
                <div
                  className="w-full aspect-video rounded-xl flex items-center justify-center text-5xl"
                  style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: CTA BANNER — "Ready to Level Up?"
      ══════════════════════════════════════════ */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "#111827" }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6">
            Ready to Level Up?
          </h2>
          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-4 rounded-full font-extrabold text-base text-white transition-all active:scale-95"
            style={{
              backgroundColor: "#3B82F6",
              boxShadow: "0 0 30px rgba(59,130,246,0.35)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "#2563EB")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "#3B82F6")
            }
          >
            Get Started For Free
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: FOOTER
      ══════════════════════════════════════════ */}
      <footer
        className="py-8 px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: "#0F172A",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <span className="font-bold text-white text-base">
          Apex<span style={{ color: "#3B82F6" }}>Log</span>
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {["Features", "Library", "About"].map((label) => (
            <button
              key={label}
              onClick={() => navigate(`/${label.toLowerCase()}`)}
              className="text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.4)")
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Policy links — placeholder, not yet wired */}
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Privacy Policy
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Terms of Service
          </span>
        </div>
      </footer>
    </div>
  );
}
