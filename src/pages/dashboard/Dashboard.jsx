import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Mock data for charts (3 months)
const chartData = [
  { date: "2024-04-01", messages: 222, responses: 150 },
  { date: "2024-04-02", messages: 97, responses: 180 },
  { date: "2024-04-03", messages: 167, responses: 120 },
  { date: "2024-04-04", messages: 242, responses: 260 },
  { date: "2024-04-05", messages: 373, responses: 290 },
  { date: "2024-04-06", messages: 301, responses: 340 },
  { date: "2024-04-07", messages: 245, responses: 180 },
  { date: "2024-04-08", messages: 409, responses: 320 },
  { date: "2024-04-09", messages: 59, responses: 110 },
  { date: "2024-04-10", messages: 261, responses: 190 },
  { date: "2024-04-11", messages: 327, responses: 350 },
  { date: "2024-04-12", messages: 292, responses: 210 },
  { date: "2024-04-13", messages: 342, responses: 380 },
  { date: "2024-04-14", messages: 137, responses: 220 },
  { date: "2024-04-15", messages: 120, responses: 170 },
  { date: "2024-04-16", messages: 138, responses: 190 },
  { date: "2024-04-17", messages: 446, responses: 360 },
  { date: "2024-04-18", messages: 364, responses: 410 },
  { date: "2024-04-19", messages: 243, responses: 180 },
  { date: "2024-04-20", messages: 89, responses: 150 },
  { date: "2024-04-21", messages: 137, responses: 200 },
  { date: "2024-04-22", messages: 224, responses: 170 },
  { date: "2024-04-23", messages: 138, responses: 230 },
  { date: "2024-04-24", messages: 387, responses: 290 },
  { date: "2024-04-25", messages: 215, responses: 250 },
  { date: "2024-04-26", messages: 75, responses: 130 },
  { date: "2024-04-27", messages: 383, responses: 420 },
  { date: "2024-04-28", messages: 122, responses: 180 },
  { date: "2024-04-29", messages: 315, responses: 240 },
  { date: "2024-04-30", messages: 454, responses: 380 },
  { date: "2024-05-01", messages: 165, responses: 220 },
  { date: "2024-05-02", messages: 293, responses: 310 },
  { date: "2024-05-03", messages: 247, responses: 190 },
  { date: "2024-05-04", messages: 385, responses: 420 },
  { date: "2024-05-05", messages: 481, responses: 390 },
  { date: "2024-05-06", messages: 498, responses: 520 },
  { date: "2024-05-07", messages: 388, responses: 300 },
  { date: "2024-05-08", messages: 149, responses: 210 },
  { date: "2024-05-09", messages: 227, responses: 180 },
  { date: "2024-05-10", messages: 293, responses: 330 },
  { date: "2024-05-11", messages: 335, responses: 270 },
  { date: "2024-05-12", messages: 197, responses: 240 },
  { date: "2024-05-13", messages: 197, responses: 160 },
  { date: "2024-05-14", messages: 448, responses: 490 },
  { date: "2024-05-15", messages: 473, responses: 380 },
  { date: "2024-05-16", messages: 338, responses: 400 },
  { date: "2024-05-17", messages: 499, responses: 420 },
  { date: "2024-05-18", messages: 315, responses: 350 },
  { date: "2024-05-19", messages: 235, responses: 180 },
  { date: "2024-05-20", messages: 177, responses: 230 },
  { date: "2024-05-21", messages: 82, responses: 140 },
  { date: "2024-05-22", messages: 81, responses: 120 },
  { date: "2024-05-23", messages: 252, responses: 290 },
  { date: "2024-05-24", messages: 294, responses: 220 },
  { date: "2024-05-25", messages: 201, responses: 250 },
  { date: "2024-05-26", messages: 213, responses: 170 },
  { date: "2024-05-27", messages: 420, responses: 460 },
  { date: "2024-05-28", messages: 233, responses: 190 },
  { date: "2024-05-29", messages: 78, responses: 130 },
  { date: "2024-05-30", messages: 340, responses: 280 },
  { date: "2024-05-31", messages: 178, responses: 230 },
  { date: "2024-06-01", messages: 178, responses: 200 },
  { date: "2024-06-02", messages: 470, responses: 410 },
  { date: "2024-06-03", messages: 103, responses: 160 },
  { date: "2024-06-04", messages: 439, responses: 380 },
  { date: "2024-06-05", messages: 88, responses: 140 },
  { date: "2024-06-06", messages: 294, responses: 250 },
  { date: "2024-06-07", messages: 323, responses: 370 },
  { date: "2024-06-08", messages: 385, responses: 320 },
  { date: "2024-06-09", messages: 438, responses: 480 },
  { date: "2024-06-10", messages: 155, responses: 200 },
  { date: "2024-06-11", messages: 92, responses: 150 },
  { date: "2024-06-12", messages: 492, responses: 420 },
  { date: "2024-06-13", messages: 81, responses: 130 },
  { date: "2024-06-14", messages: 426, responses: 380 },
  { date: "2024-06-15", messages: 307, responses: 350 },
  { date: "2024-06-16", messages: 371, responses: 310 },
  { date: "2024-06-17", messages: 475, responses: 520 },
  { date: "2024-06-18", messages: 107, responses: 170 },
  { date: "2024-06-19", messages: 341, responses: 290 },
  { date: "2024-06-20", messages: 408, responses: 450 },
  { date: "2024-06-21", messages: 169, responses: 210 },
  { date: "2024-06-22", messages: 317, responses: 270 },
  { date: "2024-06-23", messages: 480, responses: 530 },
  { date: "2024-06-24", messages: 132, responses: 180 },
  { date: "2024-06-25", messages: 141, responses: 190 },
  { date: "2024-06-26", messages: 434, responses: 380 },
  { date: "2024-06-27", messages: 448, responses: 490 },
  { date: "2024-06-28", messages: 149, responses: 200 },
  { date: "2024-06-29", messages: 103, responses: 160 },
  { date: "2024-06-30", messages: 446, responses: 400 },
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
  const [timeRange, setTimeRange] = useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30"); // Matching the mock data end
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="dashboard-page">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardContent className="p-6">
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                {stat.icon && <stat.icon className="icon" />}
              </div>
              <div className="stat-value">
                {stat.value}
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
              <div className="stat-label">
                <span className="stat-description">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Interactive Area Chart - Messages Over Time */}
        <Card className="chart-card area-chart-card">
          <CardHeader className="chart-header-row">
            <div>
              <CardTitle className="chart-title">Messages Overview</CardTitle>
              <CardDescription>
                Showing total messages for the last{" "}
                {timeRange === "90d"
                  ? "3 months"
                  : timeRange === "30d"
                    ? "30 days"
                    : "7 days"}
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="fillMessages"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#a855f7"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillResponses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0f0e17",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)",
                      color: "#fff",
                    }}
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                  <Area
                    dataKey="messages"
                    type="natural"
                    fill="url(#fillMessages)"
                    stroke="#a855f7"
                    strokeWidth={2}
                    stackId="1"
                    name="Messages"
                  />
                  <Area
                    dataKey="responses"
                    type="natural"
                    fill="url(#fillResponses)"
                    stroke="#22c55e"
                    strokeWidth={2}
                    stackId="1"
                    name="Responses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot messages"></span>
                <span>Messages</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot responses"></span>
                <span>Responses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Response Distribution */}
        <Card className="chart-card pie-chart-card">
          <CardHeader>
            <CardTitle className="chart-title">Response Types</CardTitle>
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
                      background: "#0f0e17",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)",
                      color: "#fff",
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
            <CardTitle className="chart-title">Hourly Activity</CardTitle>
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
                    stroke="rgba(255,255,255,0.1)"
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
                      background: "#0f0e17",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)",
                      color: "#fff",
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
              <CardTitle className="chart-title">Recent Messages</CardTitle>
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
    </div>
  );
}

export default Dashboard;
