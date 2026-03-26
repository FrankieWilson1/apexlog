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
 * | `apexlog_token` | JWT token returned by the backend on login/register |
 * | `apexlog_user`  | Serialised AuthUser object for session restoration |
 * | `apexlog_history_${id}` | Per-user workout history (temporary — will migrate to backend) |
 *
 * @module context/AuthContext
 */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types";
import API_URL from "../config/api";

/** React context object — consumed exclusively via the `useAuth` hook. */
export const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * AuthProvider
 *
 * Top-level context provider that wraps the application and exposes
 * authentication state and actions to all descendant components.
 *
 * @param {{ children: ReactNode }} props
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount — restore session from localStorage.
   * Runs once on app load so the user stays logged in
   * across page refreshes without re-entering credentials.
   */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("apexlog_token");
      const storedUser = localStorage.getItem("apexlog_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Malformed storage — start fresh
      localStorage.removeItem("apexlog_token");
      localStorage.removeItem("apexlog_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────

  /** True when both user and token are present */
  const isAuthenticated = !!user && !!token;

  /**
   * Per-user history key — temporary during migration period.
   * Will be removed once workout routes are fully connected to the backend.
   */
  const historyKey = user
    ? `apexlog_history_${user.id}`
    : "apexlog_history_guest";

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Persists the user and token to localStorage and React state together.
   * Called after both register and login succeed.
   */
  const persistSession = (userData: AuthUser, tokenData: string) => {
    localStorage.setItem("apexlog_token", tokenData);
    localStorage.setItem("apexlog_user", JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  /**
   * Maps the raw API response to the AuthUser shape used throughout the app.
   */
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
  });

  // ── Auth actions ──────────────────────────────────────────────────────────

  /**
   * signup
   *
   * Registers a new user via POST /api/auth/register.
   * On success, persists the session and sets React state.
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean; error?: string }>}
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

      if (!response.ok) {
        return { success: false, error: data.message };
      }

      persistSession(mapApiUser(data), data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  /**
   * login
   *
   * Authenticates an existing user via POST /api/auth/login.
   * On success, persists the session and sets React state.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean; error?: string }>}
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

      if (!response.ok) {
        return { success: false, error: data.message };
      }

      persistSession(mapApiUser(data), data.token);

      return { success: true, hasOnboarded: data.hasOnboarded };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  /**
   * logout
   *
   * Clears the session from both localStorage and React state.
   */
  const logout = () => {
    localStorage.removeItem("apexlog_token");
    localStorage.removeItem("apexlog_user");
    setToken(null);
    setUser(null);
  };

  /**
   * updateProfile
   *
   * Sends a partial profile update to PUT /api/users/profile,
   * then merges the changes into local state and localStorage.
   *
   * @param {Partial<AuthUser>} updates
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

      const updatedUser = { ...user, ...updates } as AuthUser;
      setUser(updatedUser);
      localStorage.setItem("apexlog_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
