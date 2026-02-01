import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import WaitlistPage from "./pages/WaitlistPage";
import ConfirmPage from "./pages/ConfirmPage";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import DataDeletion from "./pages/legal/DataDeletion";

// Dashboard pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Inbox from "./pages/dashboard/Inbox";
import Automations from "./pages/dashboard/Automations";
import QuickReplies from "./pages/dashboard/QuickReplies";
import Settings from "./pages/dashboard/Settings";
import DashboardLogin from "./pages/dashboard/DashboardLogin";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="app-container">
      {!isDashboard && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<DataDeletion />} />

          {/* Dashboard Login */}
          <Route path="/dashboard/login" element={<DashboardLogin />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="automations" element={<Automations />} />
            <Route path="quick-replies" element={<QuickReplies />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
