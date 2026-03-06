import { Routes, Route } from "react-router-dom";
import HomeDashboard from "./pages/HomeDashboard";
import LiveLogger from "./pages/LiveLogger";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/logger" element={<LiveLogger />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
