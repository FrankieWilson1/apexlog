import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomeDashboard from "./pages/HomeDashboard";
import LiveLogger from "./pages/LiveLogger";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import WorkoutDetail from "./pages/WorkoutDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logger"
        element={
          <ProtectedRoute>
            <LiveLogger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout/:id"
        element={
          <ProtectedRoute>
            <WorkoutDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
