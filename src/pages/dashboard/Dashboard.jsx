import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  Zap,
  Users,
  ArrowUpRight,
} from "lucide-react";

// Mock data for charts
const messageData = [
  { name: "Mon", messages: 120, responses: 95 },
  { name: "Tue", messages: 180, responses: 168 },
  { name: "Wed", messages: 240, responses: 210 },
  { name: "Thu", messages: 200, responses: 185 },
  { name: "Fri", messages: 320, responses: 290 },
  { name: "Sat", messages: 280, responses: 250 },
  { name: "Sun", messages: 150, responses: 130 },
];

const responseTypeData = [
  { name: "Auto Reply", value: 450, color: "#a855f7" },
  { name: "Quick Reply", value: 280, color: "#22c55e" },
  { name: "Manual", value: 120, color: "#64748b" },
];

const recentMessages = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "",
    message: "Hi! I'm interested in your product pricing",
    time: "2 min ago",
    status: "pending",
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "",
    message: "Thanks for the quick response! 🙌",
    time: "15 min ago",
    status: "replied",
  },
  {
    id: 3,
    user: "Emma Davis",
    avatar: "",
    message: "Do you ship internationally?",
    time: "1 hour ago",
    status: "auto-replied",
  },
  {
    id: 4,
    user: "Alex Turner",
    avatar: "",
    message: "When will the new collection drop?",
    time: "2 hours ago",
    status: "replied",
  },
];

const stats = [
  {
    title: "Total DMs",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    description: "vs last week",
  },
  {
    title: "Response Rate",
    value: "94.2%",
    change: "+3.1%",
    trend: "up",
    icon: Zap,
    description: "vs last week",
  },
  {
    title: "Avg. Response Time",
    value: "1.4 min",
    change: "-18%",
    trend: "up",
    icon: Clock,
    description: "vs last week",
  },
  {
    title: "Active Conversations",
    value: "156",
    change: "+24",
    trend: "up",
    icon: Users,
    description: "currently active",
  },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardContent className="p-6">
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <stat.icon className="stat-icon" />
                </div>
                <div
                  className={`stat-change ${stat.trend === "up" ? "positive" : "negative"}`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">
                <span className="stat-title">{stat.title}</span>
                <span className="stat-description">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Area Chart - Messages Over Time */}
        <Card className="chart-card area-chart-card">
          <CardHeader>
            <CardTitle>Messages Overview</CardTitle>
            <CardDescription>
              Your DM activity for the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={messageData}>
                  <defs>
                    <linearGradient
                      id="colorMessages"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorResponses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                    name="Messages"
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResponses)"
                    name="Responses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot messages"></span>
                <span>Messages Received</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot responses"></span>
                <span>Responses Sent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Response Distribution */}
        <Card className="chart-card pie-chart-card">
          <CardHeader>
            <CardTitle>Response Types</CardTitle>
            <CardDescription>How your DMs are being handled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container pie-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={responseTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {responseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-legend">
              {responseTypeData.map((item) => (
                <div key={item.name} className="pie-legend-item">
                  <span
                    className="pie-legend-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="pie-legend-name">{item.name}</span>
                  <span className="pie-legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="bottom-grid">
        {/* Bar Chart */}
        <Card className="chart-card bar-chart-card">
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
            <CardDescription>Peak hours for DM engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { hour: "6am", messages: 20 },
                    { hour: "9am", messages: 85 },
                    { hour: "12pm", messages: 120 },
                    { hour: "3pm", messages: 95 },
                    { hour: "6pm", messages: 150 },
                    { hour: "9pm", messages: 180 },
                    { hour: "12am", messages: 45 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
                  />
                  <Bar
                    dataKey="messages"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                    name="Messages"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="recent-messages-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest DMs from your followers</CardDescription>
            </div>
            <a href="/dashboard/inbox" className="view-all-link">
              View all
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="messages-list">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="message-item">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={msg.avatar} alt={msg.user} />
                    <AvatarFallback>
                      {msg.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <p className="message-text">{msg.message}</p>
                  </div>
                  <Badge
                    variant={
                      msg.status === "pending"
                        ? "warning"
                        : msg.status === "auto-replied"
                          ? "default"
                          : "success"
                    }
                    className="message-status"
                  >
                    {msg.status === "auto-replied" ? "Auto" : msg.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .stat-card {
          overflow: hidden;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-icon-wrapper {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon {
          width: 20px;
          height: 20px;
          color: white;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }

        .stat-change.positive {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .stat-change.negative {
          background-color: #fef2f2;
          color: #dc2626;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .stat-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }

        .stat-description {
          font-size: 0.75rem;
          color: #64748b;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }

        .chart-card {
          overflow: hidden;
        }

        .chart-container {
          width: 100%;
        }

        .chart-legend {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .legend-dot.messages {
          background-color: #a855f7;
        }

        .legend-dot.responses {
          background-color: #22c55e;
        }

        .pie-container {
          display: flex;
          justify-content: center;
        }

        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .pie-legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .pie-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .pie-legend-name {
          flex: 1;
          font-size: 0.875rem;
          color: #64748b;
        }

        .pie-legend-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #a855f7;
          font-weight: 500;
          text-decoration: none;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }

        .message-item:hover {
          background-color: #f8fafc;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .message-user {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .message-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .message-text {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .message-status {
          flex-shrink: 0;
        }

        @media (max-width: 1280px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
