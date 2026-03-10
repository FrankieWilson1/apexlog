/**
 * @file ProtectedRoute.tsx
 * @description Authentication guard for protected React Router routes.
 *
 * Wraps any route that requires a logged-in user. If the user is not
 * authenticated, they are immediately redirected to `/login` using React
 * Router's `<Navigate>` with `replace` — this replaces the current history
 * entry so pressing the browser back button doesn't loop back to the
 * protected page.
 *
 * @module components/ProtectedRoute
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  /** The route content to render when the user is authenticated */
  children: ReactNode;
}

/**
 * ProtectedRoute
 *
 * An authentication guard component. Renders its children when the user
 * is authenticated, otherwise redirects to `/login`.
 *
 * Used in `App.tsx` to wrap every route that should not be accessible
 * without a valid session.
 *
 * @param {ProtectedRouteProps} props
 * @param {ReactNode} props.children - The page component to protect.
 *
 * @example
 * // In App.tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <HomeDashboard />
 *     </ProtectedRoute>
 *   }
 * />
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  /**
   * Redirect unauthenticated users to login.
   * `replace` prevents the protected URL from being added to browser history,
   * so the user can't navigate back to it with the back button.
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
