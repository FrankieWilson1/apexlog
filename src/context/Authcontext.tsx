/**
 * @file AuthContext.tsx
 * @description Global authentication context for ApexLog.
 *
 * Provides user session management, signup, login, logout, and profile
 * updates to the entire component tree via React Context.
 *
 * ## Storage keys
 * | Key | Purpose |
 * |-----|---------|
 * | `apexlog_users` | Map of all registered accounts: `email → { password, user }` |
 * | `apexlog_session` | The currently active user session object |
 * | `apexlog_history_${id}` | Per-user workout history array, initialised as `[]` on signup |
 *
 * @module context/AuthContext
 */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types";

/** React context object — consumed exclusively via the `useAuth` hook. */
export const AuthContext = createContext<AuthContextType | null>(null);

/** localStorage key for the registered-users map */
const USERS_KEY = "apexlog_users";

/** localStorage key for the persisted active session */
const SESSION_KEY = "apexlog_session";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * AuthProvider
 *
 * Top-level context provider that wraps the application and exposes
 * authentication state and actions to all descendant components.
 *
 * Must sit inside `<BrowserRouter>` in `main.tsx` so that post-auth
 * navigation (`useNavigate`) works inside child pages.
 *
 * @param {{ children: ReactNode }} props
 *
 * @example
 * // main.tsx
 * <BrowserRouter>
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * </BrowserRouter>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * Active user state.
   * Initialised lazily from `localStorage` so the session survives
   * full page refreshes without requiring a re-login.
   */
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  /**
   * Session persistence effect.
   * Keeps `apexlog_session` in sync with React state on every change:
   * - Sets the key on login / profile update.
   * - Removes the key on logout.
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Reads the full registered-users map from localStorage.
   * Returns an empty object if the key is missing or the JSON is malformed,
   * ensuring all callers always receive a valid object to work with.
   *
   * @returns {Record<string, { password: string; user: AuthUser }>}
   */
  const getUsers = (): Record<string, { password: string; user: AuthUser }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  // ── Auth actions ───────────────────────────────────────────────────────────

  /**
   * signup
   *
   * Registers a new user account and logs them in immediately.
   *
   * Validation rules:
   * - All three fields must be non-empty.
   * - Password must be at least 6 characters.
   * - Email must not already exist in the users map.
   *
   * On success:
   * - Persists the new user to `apexlog_users`.
   * - Initialises an empty `apexlog_history_${id}` array.
   * - Sets the active session via `setUser`.
   *
   * @param {string} name     - Full display name.
   * @param {string} email    - Email address (used as the unique account key).
   * @param {string} password - Plain-text password (minimum 6 characters).
   * @returns {{ success: boolean; error?: string }}
   *
   * @example
   * const { success, error } = signup("Frank", "frank@example.com", "secret123");
   */
  const signup = (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim())
      return { success: false, error: "All fields are required." };
    if (password.length < 6)
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };

    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key])
      return {
        success: false,
        error: "An account with this email already exists.",
      };

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      goal: "Build Muscle",
      height: "",
      weight: "",
      joinedDate: new Date().toISOString(),
    };

    users[key] = { password, user: newUser };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Initialise an empty workout history scoped to this specific user
    localStorage.setItem(`apexlog_history_${newUser.id}`, JSON.stringify([]));

    setUser(newUser);
    return { success: true };
  };

  /**
   * login
   *
   * Authenticates an existing user by verifying their email and password
   * against the registered-users map, then sets the active session.
   *
   * @param {string} email    - The registered email address.
   * @param {string} password - The plain-text password to verify.
   * @returns {{ success: boolean; error?: string }}
   *
   * @example
   * const { success, error } = login("frank@example.com", "secret123");
   * if (success) navigate("/dashboard");
   */
  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim())
      return { success: false, error: "Please enter your email and password." };

    const users = getUsers();
    const key = email.toLowerCase();
    const record = users[key];

    if (!record)
      return { success: false, error: "No account found with this email." };
    if (record.password !== password)
      return { success: false, error: "Incorrect password." };

    setUser(record.user);
    return { success: true };
  };

  /**
   * logout
   *
   * Clears the active user session from React state.
   * The `useEffect` above automatically removes `apexlog_session`
   * from localStorage when `user` becomes `null`.
   */
  const logout = () => setUser(null);

  /**
   * updateProfile
   *
   * Merges a partial update into the current user's profile, then persists
   * the change to both the active session and the registered-users map.
   * No-ops silently if no user is currently logged in.
   *
   * @param {Partial<AuthUser>} data - Fields to update (e.g. `{ avatar, height, weight, goal }`).
   *
   * @example
   * updateProfile({ height: "180", weight: "80", goal: "Lose Fat" });
   */
  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    // Persist the updated user object back to the users map
    const users = getUsers();
    const key = user.email.toLowerCase();
    if (users[key]) {
      users[key].user = updated;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  /**
   * historyKey
   *
   * The localStorage key used to read and write this user's workout history.
   * Scoping by user ID ensures complete data isolation between accounts.
   * Falls back to a guest key when no user is signed in.
   *
   * @example
   * "apexlog_history_user_1741234567890"
   */
  const historyKey = user
    ? `apexlog_history_${user.id}`
    : "apexlog_history_guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        historyKey,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
