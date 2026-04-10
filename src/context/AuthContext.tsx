/**
 * @file AuthContext.tsx
 * @description Global authentication context for ApexLog.
 *
 * Manages user session state and exposes auth actions to the entire
 * component tree. All API communication goes through this context —
 * components never call auth endpoints directly.
 *
 * ## Session lifecycle
 * 1. On mount: restore token + user from localStorage instantly, then
 *    fetch fresh profile data from the backend to replace stale cache.
 * 2. On login/register: persist token + user to localStorage and state.
 * 3. On logout: clear all ApexLog keys from localStorage and reset state.
 *
 * ## localStorage keys
 * | Key                      | Purpose                                       |
 * |--------------------------|-----------------------------------------------|
 * | `apexlog_token`          | JWT for authenticating API requests           |
 * | `apexlog_user`           | Cached user object for instant session restore|
 * | `apexlog_active_workout` | In-progress workout (cleared on logout)       |
 * | `apexlog_workout_start`  | Timer start timestamp (cleared on logout)     |
 *
 * @module context/AuthContext
 */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types";
import API_URL from "../config/api";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Session restore on mount.
   * Reads localStorage synchronously for an instant render, then
   * fires a background refresh to replace any stale cached data.
   */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("apexlog_token");
      const storedUser = localStorage.getItem("apexlog_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        refreshUser(storedToken); // background refresh — doesn't block render
      }
    } catch {
      localStorage.removeItem("apexlog_token");
      localStorage.removeItem("apexlog_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Maps a raw backend response to the AuthUser shape */
  const mapApiUser = (data: any): AuthUser => ({
    id: data._id,
    name: data.name,
    email: data.email,
    goal: data.goal,
    height: data.height,
    weight: data.weight,
    avatar: data.avatar,
    weightUnit: data.weightUnit,
    notifications: data.notifications,
    hasOnboarded: data.hasOnboarded,
    createdAt: data.createdAt,
    restDuration: data.restDuration,
  });

  /** Persists a user and token to both localStorage and React state */
  const persistSession = (userData: AuthUser, tokenData: string) => {
    localStorage.setItem("apexlog_token", tokenData);
    localStorage.setItem("apexlog_user", JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  // ── Auth actions ──────────────────────────────────────────────────────────

  /**
   * Fetches the latest profile from the backend and syncs local state.
   * Called on session restore and from the Profile page on mount.
   * Fails silently — stale cache is acceptable if the network is down.
   */
  const refreshUser = async (currentToken: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response.ok) return;

      const freshUser = mapApiUser(await response.json());
      setUser(freshUser);
      localStorage.setItem("apexlog_user", JSON.stringify(freshUser));
    } catch {
      // Silent fail
    }
  };

  /**
   * Registers a new account via POST /api/auth/register.
   * On success, persists the session immediately.
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, error: data.message };

      persistSession(mapApiUser(data), data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  /**
   * Authenticates an existing user via POST /api/auth/login.
   * Returns hasOnboarded directly so the caller can route correctly
   * without waiting for React state to update.
   */
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; hasOnboarded?: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, error: data.message };

      persistSession(mapApiUser(data), data.token);
      return { success: true, hasOnboarded: data.hasOnboarded };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  /**
   * Clears all session data from localStorage and resets React state.
   * Also removes in-progress workout data to prevent stale state
   * if a different user logs in on the same device.
   */
  const logout = () => {
    [
      "apexlog_token",
      "apexlog_user",
      "apexlog_active_workout",
      "apexlog_workout_start",
    ].forEach((key) => localStorage.removeItem(key));

    // Remove legacy per-user history keys from the old localStorage system
    Object.keys(localStorage)
      .filter((key) => key.startsWith("apexlog_history_"))
      .forEach((key) => localStorage.removeItem(key));

    setToken(null);
    setUser(null);
  };

  /**
   * Sends a partial profile update to PUT /api/users/profile.
   * Uses the backend response as the source of truth to keep
   * localStorage and React state consistent.
   */
  const updateProfile = async (updates: Partial<AuthUser>): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) return;

      const updatedUser = mapApiUser(await response.json());
      setUser(updatedUser);
      localStorage.setItem("apexlog_user", JSON.stringify(updatedUser));
    } catch {
      console.error("Failed to update profile");
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  const isAuthenticated = !!user && !!token;

  /**
   * Per-user key for the active workout in localStorage.
   * Temporary — will be removed once the active workout session
   * is fully managed server-side in a future release.
   */
  const historyKey = user
    ? `apexlog_history_${user.id}`
    : "apexlog_history_guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        historyKey,
        signup,
        login,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
