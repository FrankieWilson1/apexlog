/**
 * @file Login.tsx
 * @description Email/password login form for ApexLog.
 *
 * Validates credentials against the `AuthContext`, simulates a short loading
 * delay for UX feedback, and routes the user based on onboarding status:
 * - First-time users (no `apexlog_onboarded` key) → `/onboarding`
 * - Returning users → `/dashboard`
 *
 * Also supports password visibility toggle and Enter-key submission.
 *
 * @module pages/Login
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Login
 *
 * Full-screen centred login form. On success, checks localStorage for the
 * `apexlog_onboarded` key to decide whether to show onboarding first.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSubmit
   *
   * Validates inputs, calls `login()`, and routes based on onboarding status.
   * A 400ms artificial delay gives users visual feedback before navigating.
   */
  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid email or password.");
      return;
    }

    const hasOnboarded = localStorage.getItem("apexlog_onboarded");
    navigate(hasOnboarded ? "/dashboard" : "/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* ── CLOSE BUTTON — pill with border, left-aligned (matches design) ── */}
        <button
          onClick={() => navigate("/")}
          className="self-start flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-white transition-colors"
          style={{
            border: "1.5px solid rgba(255,255,255,0.15)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")
          }
          aria-label="Back to landing page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Apex<span className="text-primary">Log</span>
          </h1>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h2>
          <p className="text-muted text-sm">Log in to continue your streak.</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-muted">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-surface text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors placeholder:text-muted text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-muted">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-transparent border border-surface text-white pl-12 pr-12 py-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors placeholder:text-muted text-sm"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-muted hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-xl">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60 mt-1"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>→</span>
                <span>Log In</span>
              </>
            )}
          </button>
        </div>

        {/* Switch to signup */}
        <p className="text-center text-muted text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
}
