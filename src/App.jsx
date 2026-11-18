import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Seo from "./components/seo/Seo";
import Home from "./pages/Home";
import WaitlistPage from "./pages/WaitlistPage";
import ConfirmPage from "./pages/ConfirmPage";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import DataDeletion from "./pages/legal/DataDeletion";
import LandingPage from "./pages/landing/LandingPage";
import BlogIndex from "./pages/blog/BlogIndex";
import BlogPost from "./pages/blog/BlogPost";
import NotFound from "./pages/NotFound";
import { landingPageList } from "./content/landingPages";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard pages are lazy-loaded so the public marketing pages don't ship
// the dashboard's heavy dependencies (charts, drag-and-drop, etc.).
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Inbox = lazy(() => import("./pages/dashboard/Inbox"));
const Automations = lazy(() => import("./pages/dashboard/Automations"));
const QuickReplies = lazy(() => import("./pages/dashboard/QuickReplies"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const DashboardLogin = lazy(() => import("./pages/dashboard/DashboardLogin"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="app-container">
      <Seo />
      <ScrollToTop />
      {!isDashboard && <Header />}
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/data-deletion" element={<DataDeletion />} />

            {/* SEO use-case landing pages */}
            {landingPageList.map((lp) => (
              <Route key={lp.slug} path={lp.path} element={<LandingPage slug={lp.slug} />} />
            ))}

            {/* Blog */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
