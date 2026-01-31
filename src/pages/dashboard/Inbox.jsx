import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Inbox as InboxIcon,
  MessageCircle,
  Instagram,
  Users,
  CheckCircle2,
  Pin,
  Mail,
  MapPin,
  Tag,
  Sparkles,
  Clock,
  X,
  Music2,
  Play,
} from "lucide-react";

// Platform icons mapping
const PlatformIcon = ({ platform }) => {
  const icons = {
    instagram: <img src="/icons8-instagram.svg" className="w-6 h-6" />,
    tiktok: <img src="/icons8-tiktok.svg" className="w-6 h-6" />,
  };
  return icons[platform] || null;
};

// Mock Data
const conversations = [
  {
    id: 1,
    user: "Herry Brooks",
    role: "Visitor 1234567",
    avatar: "https://i.pravatar.cc/150?u=herry",
    lastMessage: "I recently filled out the form on your website...",
    time: "10:44 AM",
    unread: 3,
    status: "open",
    platform: "instagram",
    tags: ["High Intent", "Pricing"],
    email: "herrybrooks@gmail.com",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    user: "Jonas Smith",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?u=jonas",
    lastMessage: "I believe a subtle blue or green would be...",
    time: "Jul 2024",
    unread: 1,
    status: "open",
    platform: "tiktok",
    tags: ["Beta"],
    email: "jonas@smith.com",
    location: "New York, NY",
  },
  {
    id: 3,
    user: "Sahid Ajmol",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?u=sahid",
    lastMessage: "Ready your last final project",
    time: "Jul 2024",
    unread: 0,
    status: "closed",
    platform: "instagram",
    tags: [],
    email: "sahid@ajmol.com",
    location: "London, UK",
  },
];

const messages = [
  {
    id: 1,
    sender: "user",
    text: "Hi there 👋",
    time: "Jul 07, 2024",
  },
  {
    id: 2,
    sender: "user",
    text: "I recently filled out the form on your website to sign up for a demo account and am now waiting for further instructions. Is there anything else I need to do at this point?",
    time: "10:44 AM",
  },
  {
    id: 3,
    sender: "agent",
    text: "Hello Brooks! 👋\n\nThank you for your interest in our product. I've added you to the waitlist for our private beta. You'll receive an access key via email in the next few days.\n\nThanks again for your patience and enthusiasm!",
    time: "12:02 PM",
    agent: { name: "Tahsan", avatar: "https://i.pravatar.cc/150?u=tahsan" },
  },
  {
    id: 4,
    sender: "user",
    text: "That's Perfect, looking forward! my email is herrybro@pixem.com",
    time: "10:44 AM",
  },
  {
    id: 5,
    sender: "user",
    type: "voice",
    duration: "00:24",
    time: "10:44 AM",
  },
];

function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState(
    selectedConversation.platform,
  );

  // Sync activeChannel with selected conversation's platform
  React.useEffect(() => {
    setActiveChannel(selectedConversation.platform);
  }, [selectedConversation]);

  const channels = [
    { id: "instagram", label: "Instagram", icon: Instagram },
    { id: "tiktok", label: "TikTok", icon: Music2 },
  ];

  return (
    <div className="inbox-container flex h-screen overflow-hidden rounded-none border-0 bg-black/20 shadow-sm backdrop-blur-sm -m-8">
      {/* 1. Inbox Navigation Sidebar */}
      <div className="inbox-nav-sidebar w-[240px] shrink-0 flex-col border-r border-white/10 bg-black/20 hidden lg:flex">
        {/* Real Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Live Chats Section */}
          <div className="px-3 mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Live Chats
            </h3>
            <nav className="space-y-0.5">
              <NavItem icon={InboxIcon} label="Unassigned" count={2} active />
              <NavItem icon={Users} label="My open" />
              <NavItem icon={CheckCircle2} label="Solved" />
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Conversation List */}
      <div className="inbox-conversation-list w-full sm:w-[280px] md:w-[320px] shrink-0 flex flex-col border-r border-white/10 bg-black/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-white">
            <span className="text-primary">
              <Pin className="w-4 h-4 text-white" />
            </span>{" "}
            Pinned
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-white"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`
                p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5
                ${selectedConversation.id === convo.id ? "bg-white/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.user[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`font-medium truncate ${convo.unread > 0 ? "text-white" : "text-muted-foreground"}`}
                  >
                    {convo.user}
                  </span>
                  {/* Platform Indicator - Always show */}
                  <PlatformIcon platform={convo.platform} />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {convo.time}
                </span>
              </div>

              <div className="pl-10 flex items-center gap-2">
                <p
                  className={`text-sm line-clamp-1 ${convo.unread > 0 ? "text-gray-300 font-medium" : "text-muted-foreground"}`}
                >
                  {convo.lastMessage}
                </p>
                {convo.unread > 0 && (
                  <Badge
                    variant="default"
                    className="h-5 px-1.5 bg-purple-500 text-primary-foreground"
                  >
                    {convo.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Conversation Details / Chat */}
      <div className="inbox-chat flex-1 flex flex-col relative min-w-0 bg-transparent hidden sm:flex">
        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>{selectedConversation.user[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm text-white flex items-center gap-2">
                {selectedConversation.user}
                <PlatformIcon platform={selectedConversation.platform} />
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Assignee{" "}
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-white/20 bg-transparent text-muted-foreground hover:text-white hover:bg-white/10"
            >
              Mark as Done
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-white"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "agent" ? "justify-end" : ""}`}
            >
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col max-w-[70%] ${msg.sender === "agent" ? "items-end" : "items-start"}`}
              >
                {msg.sender === "user" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs text-white">
                      {selectedConversation.user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                )}

                {msg.type === "voice" ? (
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-3 w-72 border border-white/10">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-500 hover:text-purple-500/30 shrink-0"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    {/* Waveform visualization */}
                    <div className="flex-1 flex items-center gap-[2px] h-6">
                      {[
                        40, 70, 30, 80, 50, 90, 40, 60, 75, 35, 85, 45, 70, 55,
                        80, 30, 65, 50, 75, 40, 60, 85, 35, 70,
                      ].map((height, i) => (
                        <div
                          key={i}
                          className={`w-[3px] rounded-full ${i < 8 ? "bg-purple-500" : "bg-white/20"}`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-white shrink-0">
                      {msg.duration}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`
                                p-4 text-sm shadow-sm
                                ${
                                  msg.sender === "agent"
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                                    : "bg-white/10 text-white border border-white/10 rounded-2xl rounded-tl-none"
                                }
                            `}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}

                {msg.sender === "agent" && (
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <span className="text-xs text-muted-foreground">
                      {msg.time}
                    </span>
                    <Avatar className="h-5 w-5 border border-white/10">
                      <AvatarImage src={msg.agent?.avatar} />
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          {/* Platform indicator - Read only */}
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="text-xs text-muted-foreground">Replying via</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 px-2 py-1 rounded-full">
              {channels.find((c) => c.id === selectedConversation.platform)
                ?.icon &&
                React.createElement(
                  channels.find((c) => c.id === selectedConversation.platform)
                    .icon,
                  { className: "w-3.5 h-3.5" },
                )}
              <span className="capitalize">
                {selectedConversation.platform}
              </span>
            </div>
          </div>
          <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
            <textarea
              className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none min-h-[50px] max-h-[150px] text-white placeholder:text-muted-foreground"
              placeholder={`Write a message via ${activeChannel}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex items-center justify-between p-2 bg-white/5 border-t border-white/10">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                className="h-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Send <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Customer Details Panel - Coming Soon */}
      <div className="inbox-customer-panel w-[280px] shrink-0 border-l border-white/10 bg-black/20 flex-col hidden xl:flex">
        {/* Customer Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>{selectedConversation.user[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">
                {selectedConversation.user}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.role}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 space-y-4 border-b border-white/10">
          <InfoItem
            icon={Mail}
            label="Email"
            value={selectedConversation.email}
          />
          <InfoItem
            icon={MapPin}
            label="Location"
            value={selectedConversation.location}
          />
          <InfoItem icon={Clock} label="First seen" value="Jul 07, 2024" />
        </div>

        {/* Tags */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-white">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedConversation.tags.length > 0 ? (
              selectedConversation.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-white/20 text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No tags</span>
            )}
          </div>
        </div>

        {/* AI Suggestions - Coming Soon */}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">
              AI Suggestions
            </span>
          </div>
          <div className="bg-white/5 rounded-lg border border-white/10 border-dashed p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Coming Soon</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              AI-powered response suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, badgeColor }) {
  return (
    <div
      className={`
      flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all
      ${active ? "bg-purple-500/20 text-purple-500" : "text-muted-foreground hover:bg-white/5 hover:text-white"}
    `}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-purple-500" : "text-muted-foreground"}`}
        />
        <span>{label}</span>
      </div>
      {count && (
        <Badge
          className={`h-5 px-1.5 ${active ? "bg-purple-500 text-white" : "bg-white/10 text-white"}`}
        >
          {count}
        </Badge>
      )}
      {badgeColor && (
        <span className={`w-2 h-2 rounded-full ${badgeColor}`}></span>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
        <p className="font-medium text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export default Inbox;
