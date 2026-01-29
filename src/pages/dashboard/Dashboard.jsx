import React from "react";
import {
  MessageSquare,
  HelpCircle,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css";

// Mock data - will come from Supabase
const mockMetrics = {
  totalDMs: {
    value: 243,
    change: 28,
    positive: true,
    subtitle: "Last 7 days: +189",
  },
  repeatedQuestions: {
    value: 108,
    change: 35,
    positive: true,
    subtitle: 'Top: "How much is it?"',
  },
  autoReplies: {
    value: 73,
    change: 44,
    positive: true,
    subtitle: "Last 7 days: +54",
  },
  timeSaved: {
    value: "4.3",
    unit: "hrs",
    change: null,
    subtitle: "Avg / Day Saved",
  },
};

const mockChartData = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 40 },
  { day: "Fri", value: 58 },
  { day: "Lat", value: 65 },
  { day: "Sun", value: 52 },
];

const mockMessages = [
  {
    id: 1,
    sender: "Maria Santos",
    preview: "How much is it?",
    time: "8 mins ago",
    initials: "MS",
  },
  {
    id: 2,
    sender: "Pedro Lima",
    preview: "Olá! Tem envio para Lisboa?",
    time: "1 hour ago",
    initials: "PL",
  },
  {
    id: 3,
    sender: "Ana Beauty",
    preview: "Olá! Tem envio para Lisboa?",
    time: "1 hour ago",
    initials: "AB",
  },
  {
    id: 4,
    sender: "Joana e Sofia",
    preview: "Hello! Can I return items if they don't fit?",
    time: "4 hours ago",
    initials: "JS",
  },
  {
    id: 5,
    sender: "Daniel Andrade",
    preview: "Obrigado, peb envio, chegou tudo ótimo!",
    time: "1 day",
    initials: "DA",
  },
];

const mockRules = [
  {
    id: 1,
    name: "FAQ - Pricing",
    trigger: 'If message contains "price", icost, "how much"',
    response: "Auto reply: Hi! Most of our dresses range from €40-€50...",
    active: true,
  },
];

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  change,
  positive,
  subtitle,
}) => (
  <div className="metric-card">
    <div className="metric-header">
      <span className="metric-label">{label}</span>
      <div className="metric-icon">
        <Icon />
      </div>
    </div>
    <div className="metric-value">
      {value}
      {unit && <span style={{ fontSize: "1.5rem" }}>{unit}</span>}
      {change !== null && (
        <span className={`metric-change ${positive ? "positive" : "negative"}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {positive ? "+" : "-"}
          {change}%
        </span>
      )}
    </div>
    {subtitle && <div className="metric-subtitle">{subtitle}</div>}
  </div>
);

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="chart-container">
      {data.map((item, index) => (
        <div key={index} className="chart-bar-wrapper">
          <div
            className="chart-bar"
            style={{ height: `${(item.value / maxValue) * 200}px` }}
          >
            <span className="chart-bar-value">{item.value}</span>
          </div>
          <span className="chart-bar-label">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: "#1f2937",
        }}
      >
        Conversations Analytics
      </h2>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard
          icon={MessageSquare}
          label="Total DMs"
          value={mockMetrics.totalDMs.value}
          change={mockMetrics.totalDMs.change}
          positive={mockMetrics.totalDMs.positive}
          subtitle={mockMetrics.totalDMs.subtitle}
        />
        <MetricCard
          icon={HelpCircle}
          label="Repeated Questions"
          value={mockMetrics.repeatedQuestions.value}
          change={mockMetrics.repeatedQuestions.change}
          positive={mockMetrics.repeatedQuestions.positive}
          subtitle={mockMetrics.repeatedQuestions.subtitle}
        />
        <MetricCard
          icon={Zap}
          label="Auto Replies Sent"
          value={mockMetrics.autoReplies.value}
          change={mockMetrics.autoReplies.change}
          positive={mockMetrics.autoReplies.positive}
          subtitle={mockMetrics.autoReplies.subtitle}
        />
        <MetricCard
          icon={Clock}
          label="Responses Saved"
          value={mockMetrics.timeSaved.value}
          unit={mockMetrics.timeSaved.unit}
          change={null}
          subtitle={mockMetrics.timeSaved.subtitle}
        />
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          {/* Chart Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Conversations Analytics</h3>
              <div className="card-tabs">
                <button className="card-tab active">This Week</button>
                <button className="card-tab">Last Week</button>
                <button className="card-tab">Last 30 Days</button>
              </div>
            </div>
            <div className="card-content">
              <BarChart data={mockChartData} />
            </div>
          </div>

          {/* Metrics Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <div className="metric-card" style={{ padding: "1rem" }}>
              <div className="metric-label">Total Messages</div>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                243
              </div>
            </div>
            <div className="metric-card" style={{ padding: "1rem" }}>
              <div className="metric-label">New Leads</div>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                57{" "}
                <span
                  className="metric-change positive"
                  style={{ fontSize: "0.8rem" }}
                >
                  +22%
                </span>
              </div>
            </div>
            <div className="metric-card" style={{ padding: "1rem" }}>
              <div className="metric-label">Auto-Saved Time</div>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                4.3<span style={{ fontSize: "1rem" }}>hrs</span>
                <span
                  className="metric-change positive"
                  style={{ fontSize: "0.8rem" }}
                >
                  +30%
                </span>
              </div>
            </div>
            <div className="metric-card" style={{ padding: "1rem" }}>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                4.3<span style={{ fontSize: "1rem" }}>hrs</span>
              </div>
              <div className="metric-subtitle">+20 mins ↓</div>
            </div>
          </div>

          {/* Active Rules */}
          <div className="rules-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Active Rules
                <span
                  style={{
                    background: "#f97316",
                    color: "white",
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "10px",
                  }}
                >
                  Activis
                </span>
              </h3>
            </div>

            {mockRules.map((rule) => (
              <div key={rule.id} className="rule-item">
                <div className="rule-icon">
                  <MessageSquare />
                </div>
                <div className="rule-content">
                  <div className="rule-header">
                    <span className="rule-name">{rule.name}</span>
                    <div
                      className={`rule-toggle ${rule.active ? "active" : ""}`}
                    ></div>
                  </div>
                  <div className="rule-trigger">{rule.trigger}</div>
                  <div className="rule-response">{rule.response}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Messages */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Messages</h3>
            <button className="card-tab">Base</button>
          </div>
          <div className="messages-list">
            {mockMessages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-avatar">{message.initials}</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <div className="message-preview">{message.preview}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Chats</button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
