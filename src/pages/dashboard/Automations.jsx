import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Zap,
  MessageSquare,
  Clock,
  MoreVertical,
  Play,
  Pause,
  Settings2,
} from "lucide-react";

const automations = [
  {
    id: 1,
    name: "Welcome Message",
    description: "Send a greeting to new followers",
    trigger: "New Follower",
    status: "active",
    stats: { sent: 1247, rate: "98%" },
  },
  {
    id: 2,
    name: "FAQ Auto-Reply",
    description: "Answer common questions automatically",
    trigger: "Keyword Match",
    status: "active",
    stats: { sent: 892, rate: "85%" },
  },
  {
    id: 3,
    name: "Story Reply",
    description: "Respond to story mentions and replies",
    trigger: "Story Mention",
    status: "paused",
    stats: { sent: 456, rate: "92%" },
  },
  {
    id: 4,
    name: "Product Inquiry",
    description: "Handle product-related questions",
    trigger: "Keyword Match",
    status: "active",
    stats: { sent: 623, rate: "89%" },
  },
];

function Automations() {
  return (
    <div className="automations-page">
      {/* Header */}
      <div className="automations-header">
        <div>
          <h2 className="automations-title">Automations</h2>
          <p className="automations-subtitle">
            Create and manage your automated responses
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="automations-stats">
        <Card>
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper purple">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="stat-value">4</p>
              <p className="stat-label">Active Automations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper green">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="stat-value">3,218</p>
              <p className="stat-label">Messages Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper blue">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="stat-value">1.2s</p>
              <p className="stat-label">Avg. Response Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <div className="automations-grid">
        {automations.map((automation) => (
          <Card key={automation.id} className="automation-card">
            <CardHeader className="automation-header">
              <div className="automation-title-row">
                <CardTitle className="automation-name">
                  {automation.name}
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>{automation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="automation-meta">
                <div className="meta-item">
                  <span className="meta-label">Trigger</span>
                  <Badge variant="outline">{automation.trigger}</Badge>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <Badge
                    variant={
                      automation.status === "active" ? "success" : "secondary"
                    }
                  >
                    {automation.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>
              <div className="automation-stats">
                <div className="stat-item">
                  <span className="stat-number">{automation.stats.sent}</span>
                  <span className="stat-text">messages sent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{automation.stats.rate}</span>
                  <span className="stat-text">success rate</span>
                </div>
              </div>
              <div className="automation-actions">
                <Button variant="outline" size="sm" className="action-btn">
                  {automation.status === "active" ? (
                    <>
                      <Pause className="w-3 h-3" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="action-btn">
                  <Settings2 className="w-3 h-3" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style>{`
        .automations-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .automations-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .automations-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem;
        }

        .automations-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .automations-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem !important;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.purple {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        }

        .stat-icon-wrapper.green {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }

        .stat-icon-wrapper.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .automations-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .automation-card {
          transition: box-shadow 0.2s;
        }

        .automation-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .automation-header {
          padding-bottom: 0.5rem;
        }

        .automation-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .automation-name {
          font-size: 1rem;
        }

        .automation-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .meta-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .automation-stats {
          display: flex;
          gap: 1.5rem;
          padding: 1rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 0.375rem;
        }

        .stat-number {
          font-size: 1.125rem;
          font-weight: 600;
          color: #ffffff;
        }

        .stat-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .automation-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        @media (max-width: 1024px) {
          .automations-stats {
            grid-template-columns: 1fr;
          }

          .automations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Automations;
