import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Zap,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import "./dashboard.css";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  {
    name: "Quick Replies",
    href: "/dashboard/quick-replies",
    icon: MessageSquare,
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="logo-text">Zyllo</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                location.pathname.startsWith(item.href));

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="user-details">
              <p className="user-name">John Doe</p>
              <p className="user-email">john@example.com</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="logout-btn">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {navigation.find(
                (n) =>
                  location.pathname === n.href ||
                  (n.href !== "/dashboard" &&
                    location.pathname.startsWith(n.href)),
              )?.name || "Dashboard"}
            </h1>
          </div>
          <div className="header-right">
            <Button variant="ghost" size="icon" className="notification-btn">
              <Bell className="w-5 h-5" />
              <span className="notification-badge">3</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
