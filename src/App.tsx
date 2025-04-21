
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "@/components/ui/toaster";
import ApplicationSubmitted from "./pages/ApplicationSubmitted";
import OREAFormPage from "./pages/OREAFormPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/forms/orea410/:id" element={<OREAFormPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/application-submitted" element={<ApplicationSubmitted />} />
        <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
