import { Routes, Route } from "react-router";
import AppLayout from "../layout/AppLayout";
import ProtectedOutlet from "./ProtectedOutlet";
import NotFound from "@/pages/OtherPage/NotFound";
import { LandingPage } from "@/features/landing";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route element={<AppLayout />}>
        {/* Protected routes */}
        <Route element={<ProtectedOutlet />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
