import React, { useState } from "react";
import {
  User,
  Instagram,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  Trash2,
} from "lucide-react";
import "./Settings.css";

// Mock data
const mockAccount = {
  name: "Porto Fashion",
  handle: "@portofashionshop",
  instagramId: "17841400123456789",
  connected: true,
  tokenExpiry: "2026-03-15",
  tokenStatus: "valid", // 'valid', 'expiring_soon', 'expired'
};

const mockLogs = [
  {
    id: 1,
    type: "success",
    action: "Auto-reply sent",
    details: "Responded to @mariasantos",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "success",
    action: "Message received",
    details: "New DM from @pedrolima",
    time: "15 mins ago",
  },
  {
    id: 3,
    type: "warning",
    action: "Token refresh",
    details: "Access token will expire in 7 days",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "success",
    action: "Rule triggered",
    details: "FAQ - Pricing rule matched",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "error",
    action: "API Error",
    details: "Rate limit exceeded, retrying...",
    time: "3 hours ago",
  },
  {
    id: 6,
    type: "success",
    action: "Webhook received",
    details: "Instagram webhook event processed",
    time: "4 hours ago",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  const getTokenStatusColor = (status) => {
    switch (status) {
      case "valid":
        return "success";
      case "expiring_soon":
        return "warning";
      case "expired":
        return "error";
      default:
        return "neutral";
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="log-icon success" />;
      case "warning":
        return <AlertTriangle size={16} className="log-icon warning" />;
      case "error":
        return <XCircle size={16} className="log-icon error" />;
      default:
        return <Clock size={16} className="log-icon" />;
    }
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <Instagram size={18} />
            <span>Connected Accounts</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            <Clock size={18} />
            <span>Activity Logs</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "billing" ? "active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            <CreditCard size={18} />
            <span>Billing</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {/* Connected Accounts Tab */}
          {activeTab === "account" && (
            <div className="settings-section">
              <h3>Connected Instagram Accounts</h3>
              <p className="section-description">
                Manage your connected Instagram business accounts
              </p>

              {/* Connected Account Card */}
              <div className="account-card-large">
                <div className="account-main">
                  <div className="account-avatar-large">
                    {mockAccount.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="account-details">
                    <h4>{mockAccount.name}</h4>
                    <p className="account-handle-large">{mockAccount.handle}</p>
                    <p className="account-id">ID: {mockAccount.instagramId}</p>
                  </div>
                  <div
                    className={`connection-status ${mockAccount.connected ? "connected" : ""}`}
                  >
                    <CheckCircle size={16} />
                    <span>Connected</span>
                  </div>
                </div>

                <div className="account-token-info">
                  <div className="token-row">
                    <span className="token-label">Token Status</span>
                    <span
                      className={`token-status ${getTokenStatusColor(mockAccount.tokenStatus)}`}
                    >
                      {mockAccount.tokenStatus === "valid" && "Valid"}
                      {mockAccount.tokenStatus === "expiring_soon" &&
                        "Expiring Soon"}
                      {mockAccount.tokenStatus === "expired" && "Expired"}
                    </span>
                  </div>
                  <div className="token-row">
                    <span className="token-label">Expires</span>
                    <span className="token-value">
                      {mockAccount.tokenExpiry}
                    </span>
                  </div>
                </div>

                <div className="account-actions">
                  <button className="action-btn-secondary">
                    <RefreshCw size={16} />
                    Refresh Token
                  </button>
                  <button className="action-btn-danger">
                    <Trash2 size={16} />
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Add Account Button */}
              <button className="add-account-btn-large">
                <Instagram size={20} />
                <span>Connect Another Account</span>
              </button>
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === "logs" && (
            <div className="settings-section">
              <h3>Activity Logs</h3>
              <p className="section-description">
                View recent activity and system events
              </p>

              <div className="logs-list">
                {mockLogs.map((log) => (
                  <div key={log.id} className={`log-item ${log.type}`}>
                    {getLogIcon(log.type)}
                    <div className="log-content">
                      <span className="log-action">{log.action}</span>
                      <span className="log-details">{log.details}</span>
                    </div>
                    <span className="log-time">{log.time}</span>
                  </div>
                ))}
              </div>

              <button className="load-more-btn">Load More</button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <p className="section-description">
                Configure how you want to be notified
              </p>

              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Notifications</h4>
                    <p>
                      Receive daily summaries and important alerts via email
                    </p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Token Expiry Warnings</h4>
                    <p>Get notified 7 days before your token expires</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>New Message Alerts</h4>
                    <p>Real-time notifications for new Instagram DMs</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="settings-section">
              <h3>Billing & Subscription</h3>
              <p className="section-description">
                Manage your subscription and payment details
              </p>

              <div className="plan-card">
                <div className="plan-badge">Current Plan</div>
                <h4>Pro Plan</h4>
                <p className="plan-price">
                  €29<span>/month</span>
                </p>
                <ul className="plan-features">
                  <li>
                    <CheckCircle size={14} /> Unlimited automations
                  </li>
                  <li>
                    <CheckCircle size={14} /> Up to 3 Instagram accounts
                  </li>
                  <li>
                    <CheckCircle size={14} /> Analytics & insights
                  </li>
                  <li>
                    <CheckCircle size={14} /> Priority support
                  </li>
                </ul>
                <button className="manage-plan-btn">
                  Manage Subscription
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
