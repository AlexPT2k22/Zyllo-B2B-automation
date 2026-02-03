import React, { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { instagramService } from "@/lib/instagramService";
import { tiktokService } from "@/lib/tiktokService";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const [instagramAccount, setInstagramAccount] = useState(null);
  const [tiktokAccount, setTiktokAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isTiktokDisconnecting, setIsTiktokDisconnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [user]);

  const checkConnection = async () => {
    setIsLoading(true);

    // Check Instagram
    const igResult = await instagramService.checkConnection();
    if (igResult.connected) {
      setInstagramAccount(igResult.account);
    } else {
      setInstagramAccount(null);
    }

    // Check TikTok
    const ttResult = await tiktokService.checkConnection();
    if (ttResult.connected) {
      setTiktokAccount(ttResult.account);
    } else {
      setTiktokAccount(null);
    }

    setIsLoading(false);
  };

  const handleConnect = async () => {
    try {
      const url = await instagramService.getAuthUrl();
      window.location.href = url;
    } catch (e) {
      toast.error("Failed to start Instagram connection: " + e.message);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your Instagram account? Automations will stop working.",
      )
    )
      return;

    setIsDisconnecting(true);
    const result = await instagramService.disconnect();

    if (result.success) {
      setInstagramAccount(null);
      toast.success("Instagram account disconnected");
    } else {
      toast.error("Failed to disconnect: " + result.error);
    }
    setIsDisconnecting(false);
  };

  const handleTiktokConnect = async () => {
    try {
      const url = await tiktokService.getAuthUrl();
      window.location.href = url;
    } catch (e) {
      toast.error("Failed to start TikTok connection: " + e.message);
    }
  };

  const handleTiktokDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your TikTok account? Automations will stop working.",
      )
    )
      return;

    setIsTiktokDisconnecting(true);
    const result = await tiktokService.disconnect();

    if (result.success) {
      setTiktokAccount(null);
      toast.success("TikTok account disconnected");
    } else {
      toast.error("Failed to disconnect: " + result.error);
    }
    setIsTiktokDisconnecting(false);
  };

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
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="profile-fallback">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="profile-details">
                <h3 className="profile-name">
                  {user?.user_metadata?.full_name || "User"}
                </h3>
                <p className="profile-email">{user?.email}</p>
                <Badge variant="default" className="plan-badge">
                  Beta Access
                </Badge>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Connected Account */}
        <Card className="connected-card">
          <CardHeader>
            <CardTitle className="connected-title">
              Instagram Connection
            </CardTitle>
            <CardDescription>
              {instagramAccount
                ? "Your trusted account for automation"
                : "Connect your Instagram Logic to enable automations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin text-purple-500" />
              </div>
            ) : instagramAccount ? (
              <div className="connected-account">
                <div className="account-info">
                  <div className="instagram-icon">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="account-username">
                      @{instagramAccount.username}
                    </p>
                    <p className="account-followers">
                      {instagramAccount.media_count || 0} posts
                    </p>
                  </div>
                </div>
                <div className="account-status">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Connected</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-secondary/20 rounded-lg border border-dashed border-white/10">
                <Instagram className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Connect your Instagram Professional account to use
                  automations.
                </p>
                <Button
                  onClick={handleConnect}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Connect Invoice Logic
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TikTok Connection */}
        <Card className="connected-card">
          <CardHeader>
            <CardTitle className="connected-title">TikTok Connection</CardTitle>
            <CardDescription>
              {tiktokAccount
                ? "Your TikTok account for automation"
                : "Connect your TikTok account to enable automations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin text-purple-500" />
              </div>
            ) : tiktokAccount ? (
              <div className="connected-account">
                <div className="account-info">
                  <div className="tiktok-icon">
                    <img
                      src="/icons8-tiktok.svg"
                      alt="TikTok"
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <p className="account-username">
                      @{tiktokAccount.username}
                    </p>
                    <p className="account-followers">
                      {tiktokAccount.display_name || tiktokAccount.username}
                    </p>
                  </div>
                </div>
                <div className="account-status">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Connected</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-secondary/20 rounded-lg border border-dashed border-white/10">
                <img
                  src="/icons8-tiktok.svg"
                  alt="TikTok"
                  className="w-8 h-8 mb-3 opacity-50"
                />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Connect your TikTok Business account to use automations.
                </p>
                <Button
                  onClick={handleTiktokConnect}
                  className="bg-black hover:bg-gray-900 text-white border border-white/20"
                >
                  <img
                    src="/icons8-tiktok.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />
                  Connect TikTok
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global CSS for this page (from original file) */}
        <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 0.5rem;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin: 0 0 0.25rem;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: #94a3b8;
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
          background-color: rgba(255, 255, 255, 0.03);
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
          color: white;
          margin: 0;
        }

        .profile-email {
          font-size: 0.875rem;
          color: #94a3b8;
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
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
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

        .tiktok-icon {
          width: 40px;
          height: 40px;
          background: #000000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .account-username {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .account-followers {
          font-size: 0.75rem;
          color: #94a3b8;
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
      `}</style>

        {/* Settings Menu */}
        <Card className="settings-menu-card bg-white/5 border-white/10">
          <CardContent className="menu-content p-2!">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className="settings-menu-item flex w-full items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group"
              >
                <div className="menu-item-left flex items-center gap-3">
                  <div className="menu-icon-wrapper w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <section.icon className="menu-icon w-5 h-5 text-muted-foreground group-hover:text-white" />
                  </div>
                  <div className="menu-item-text text-left">
                    <span className="menu-item-title block text-sm font-medium text-white">
                      {section.title}
                    </span>
                    <span className="menu-item-desc block text-xs text-muted-foreground">
                      {section.description}
                    </span>
                  </div>
                </div>
                <ChevronRight className="menu-chevron w-5 h-5 text-muted-foreground/50 group-hover:text-white" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="danger-card border-red-900/30 bg-red-900/10">
          <CardHeader>
            <CardTitle className="danger-title text-red-400">
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="danger-actions flex flex-col gap-4">
              {instagramAccount && (
                <div className="danger-item flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-900/30">
                  <div>
                    <p className="danger-action-title font-medium text-white">
                      Disconnect Instagram
                    </p>
                    <p className="danger-action-desc text-xs text-red-300/70">
                      Remove your Instagram connection
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="danger-btn border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                  >
                    {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                  </Button>
                </div>
              )}
              {tiktokAccount && (
                <div className="danger-item flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-900/30">
                  <div>
                    <p className="danger-action-title font-medium text-white">
                      Disconnect TikTok
                    </p>
                    <p className="danger-action-desc text-xs text-red-300/70">
                      Remove your TikTok connection
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="danger-btn border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleTiktokDisconnect}
                    disabled={isTiktokDisconnecting}
                  >
                    {isTiktokDisconnecting ? "Disconnecting..." : "Disconnect"}
                  </Button>
                </div>
              )}
              <div className="danger-item flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-900/30">
                <div>
                  <p className="danger-action-title font-medium text-white">
                    Delete Account
                  </p>
                  <p className="danger-action-desc text-xs text-red-300/70">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
