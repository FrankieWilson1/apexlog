import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

// Onboarding (protected but no navbar)
import Onboarding from "./pages/Onboarding";

// Protected pages
import HomeDashboard from "./pages/HomeDashboard";
import LiveLogger from "./pages/LiveLogger";
import Profile from "./pages/Profile";
import WorkoutDetail from "./pages/WorkoutDetails";

// v2 pages
import FeaturesPage from "./pages/FeaturesPage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <>
      {/* NavBar renders itself only on protected routes */}
      <NavBar />

      <Routes>
        {/* ── PUBLIC ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── ONBOARDING (protected, no navbar) ── */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* ── PROTECTED ── */}
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

        {/* ── v2 PAGES ── */}
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <FeaturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
