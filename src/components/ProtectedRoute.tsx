import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "./LoadingScreen";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for session restore to complete before deciding
  if (isLoading) {
    return <LoadingScreen message="Loading your session..." />;
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}
