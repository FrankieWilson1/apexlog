import { Routes, Route } from "react-router-dom";
import HomeDashboard from "./pages/HomeDashboard";
import LiveLogger from "./pages/LiveLogger";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/logger" element={<LiveLogger />} />
    </Routes>
  );
}
