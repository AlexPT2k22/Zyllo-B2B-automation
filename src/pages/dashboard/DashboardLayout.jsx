import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Zap,
  MessageSquareText,
  Settings,
  LogOut,
  Menu,
  Plus,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";
import "./Dashboard.css";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Mock connected account - will come from Supabase
  const connectedAccount = {
    name: "Porto Fashion",
    handle: "@portofashionshop",
    connected: true,
    initials: "PF",
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      exact: true,
    },
    { path: "/dashboard/inbox", icon: Inbox, label: "Inbox", badge: 12 },
    { path: "/dashboard/automations", icon: Zap, label: "Automations" },
    {
      path: "/dashboard/quick-replies",
      icon: MessageSquareText,
      label: "Quick Replies",
    },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("inbox")) return "Inbox";
    if (path.includes("automations")) return "Automations";
    if (path.includes("quick-replies")) return "Quick Replies";
    if (path.includes("settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Zyllo</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <item.icon />
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>

          {/* Products Section */}
          <div className="nav-section">
            <div className="nav-section-title">Products</div>

            {/* Connected Account */}
            {connectedAccount && (
              <div
                className="sidebar-account"
                style={{ padding: "0.5rem 1.5rem" }}
              >
                <div className="account-card">
                  <div className="account-avatar">
                    {connectedAccount.initials}
                  </div>
                  <div className="account-info">
                    <div className="account-name">{connectedAccount.name}</div>
                    <div className="account-handle">
                      {connectedAccount.handle}
                    </div>
                    {connectedAccount.connected && (
                      <div className="account-status">Connected</div>
                    )}
                  </div>
                </div>
                <button className="add-account-btn">
                  <Plus size={16} />
                  <span>Connected</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <NavLink to="/dashboard/settings" className="nav-item">
            <Menu size={18} />
            <span>Menu</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button
            className="nav-item logout-btn"
            onClick={() => console.log("Logout")}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <h1>{getPageTitle()}</h1>
          </div>

          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn">
              <Bell size={20} />
            </button>
            <button className="header-icon-btn">
              <HelpCircle size={20} />
            </button>
            <div className="header-user">
              <div className="header-user-info">
                <div className="header-user-name">{connectedAccount.name}</div>
                <div className="header-user-role">
                  {connectedAccount.handle}
                </div>
              </div>
              <div className="header-user-avatar"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
