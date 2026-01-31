import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Zap,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import "./Dashboard.css";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src="/Zolly Logo.png" alt="Zyllo" className="logo-image"/>
            </div>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
          </button>
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
                title={item.name}
              >
                <item.icon className="nav-icon" />
                {!isCollapsed && <span className="nav-text">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {!isCollapsed && (
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
          )}
          {isCollapsed && (
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
          {!isCollapsed && (
            <Button variant="ghost" size="icon" className="logout-btn">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-main ${isCollapsed ? "collapsed" : ""}`}>

        {/* Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
