/**
 * @file useAuth.ts
 * @description Custom hook for consuming the AuthContext.
 *
 * Intentionally kept in a **separate file** from `AuthContext.tsx`.
 * React Fast Refresh requires that any file exporting a component
 * (like `AuthProvider`) must not also export non-component values
 * (like a hook). Splitting them keeps hot-module reload stable in dev.
 *
 * @module context/useAuth
 */

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * useAuth
 *
 * Returns the full authentication context including the current user object,
 * auth status flag, user-scoped history key, and all auth action functions.
 *
 * Must be called from a component that is a descendant of `<AuthProvider>`.
 * Throws a clear descriptive error if used outside the provider tree so
 * misconfigured usages are caught immediately during development.
 *
 * @returns {AuthContextType} The full authentication context value.
 *
 * @throws {Error} If called outside of `<AuthProvider>`.
 *
 * @example
 * // Inside any protected component
 * const { user, isAuthenticated, login, logout, updateProfile } = useAuth();
 *
 * @example
 * // Redirect unauthenticated users
 * const { isAuthenticated } = useAuth();
 * if (!isAuthenticated) return <Navigate to="/login" />;
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
