import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Link2,
  HelpCircle,
  ChevronRight,
  Instagram,
  Check,
} from "lucide-react";

const settingsSections = [
  {
    id: "profile",
    icon: User,
    title: "Profile Settings",
    description: "Manage your account information",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Configure notification preferences",
  },
  {
    id: "security",
    icon: Lock,
    title: "Security",
    description: "Password and authentication settings",
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing",
    description: "Manage your subscription and payments",
  },
  {
    id: "integrations",
    icon: Link2,
    title: "Integrations",
    description: "Connect third-party services",
  },
  {
    id: "help",
    icon: HelpCircle,
    title: "Help & Support",
    description: "Get help and contact support",
  },
];

function Settings() {
  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-layout">
        {/* Profile Card */}
        <Card className="profile-card">
          <CardContent className="profile-content">
            <div className="profile-info">
              <Avatar className="profile-avatar">
                <AvatarImage src="" alt="John Doe" />
                <AvatarFallback className="profile-fallback">JD</AvatarFallback>
              </Avatar>
              <div className="profile-details">
                <h3 className="profile-name">John Doe</h3>
                <p className="profile-email">john@example.com</p>
                <Badge variant="default" className="plan-badge">
                  Pro Plan
                </Badge>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Connected Account */}
        <Card className="connected-card">
          <CardHeader>
            <CardTitle className="connected-title">Connected Account</CardTitle>
            <CardDescription>Your linked Instagram account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="connected-account">
              <div className="account-info">
                <div className="instagram-icon">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="account-username">@johndoe_official</p>
                  <p className="account-followers">12.5k followers</p>
                </div>
              </div>
              <div className="account-status">
                <Check className="w-4 h-4 text-green-500" />
                <span>Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card className="settings-menu-card">
          <CardContent className="menu-content">
            {settingsSections.map((section) => (
              <button key={section.id} className="settings-menu-item">
                <div className="menu-item-left">
                  <div className="menu-icon-wrapper">
                    <section.icon className="menu-icon" />
                  </div>
                  <div className="menu-item-text">
                    <span className="menu-item-title">{section.title}</span>
                    <span className="menu-item-desc">
                      {section.description}
                    </span>
                  </div>
                </div>
                <ChevronRight className="menu-chevron" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="danger-card">
          <CardHeader>
            <CardTitle className="danger-title">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="danger-actions">
              <div className="danger-item">
                <div>
                  <p className="danger-action-title">Disconnect Instagram</p>
                  <p className="danger-action-desc">
                    Remove your Instagram connection
                  </p>
                </div>
                <Button variant="outline" className="danger-btn">
                  Disconnect
                </Button>
              </div>
              <div className="danger-item">
                <div>
                  <p className="danger-action-title">Delete Account</p>
                  <p className="danger-action-desc">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
        }

        .page-header {
          margin-bottom: 0.5rem;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .settings-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-card .profile-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem !important;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-avatar {
          width: 64px;
          height: 64px;
        }

        .profile-fallback {
          font-size: 1.25rem;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .profile-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .profile-email {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 0.375rem;
        }

        .plan-badge {
          width: fit-content;
        }

        .connected-title {
          font-size: 1rem;
        }

        .connected-account {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .instagram-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .account-username {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .account-followers {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .account-status {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #22c55e;
        }

        .menu-content {
          padding: 0.5rem !important;
        }

        .settings-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .settings-menu-item:hover {
          background-color: #f8fafc;
        }

        .menu-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .menu-icon-wrapper {
          width: 40px;
          height: 40px;
          background-color: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          color: #64748b;
        }

        .menu-item-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.125rem;
        }

        .menu-item-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }

        .menu-item-desc {
          font-size: 0.75rem;
          color: #64748b;
        }

        .menu-chevron {
          width: 20px;
          height: 20px;
          color: #94a3b8;
        }

        .danger-title {
          font-size: 1rem;
          color: #ef4444;
        }

        .danger-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .danger-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background-color: #fef2f2;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
        }

        .danger-action-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
          margin: 0;
        }

        .danger-action-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .danger-btn {
          border-color: #ef4444;
          color: #ef4444;
        }

        .danger-btn:hover {
          background-color: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default Settings;
