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
  Hash,
  Instagram,
  Users,
  CheckCircle2,
  MoreHorizontal,
  Pin,
} from "lucide-react";

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
    platform: "chat",
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
    platform: "email",
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
    platform: "whatsapp",
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

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-sm backdrop-blur-sm">
      {/* 1. Inbox Navigation Sidebar */}
      <div className="w-[240px] flex flex-col border-r border-white/10 bg-black/20">
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-dashed border-white/20 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
          >
            <Search className="w-4 h-4" />
            <span>Search inbox...</span>
          </Button>
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
      <div className="w-[320px] flex flex-col border-r border-white/10 bg-black/10">
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
                  {convo.platform === "instagram" && (
                    <Instagram className="w-3 h-3 text-pink-500" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {convo.time}
                </span>
              </div>

              <div className="pl-10">
                <p
                  className={`text-sm line-clamp-2 mb-2 ${convo.unread > 0 ? "text-gray-300 font-medium" : "text-muted-foreground"}`}
                >
                  {convo.lastMessage}
                </p>
                {convo.unread > 0 && (
                  <Badge
                    variant="default"
                    className="h-5 px-1.5 bg-primary text-primary-foreground"
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
      <div className="flex-1 flex flex-col relative min-w-0 bg-transparent">
        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>{selectedConversation.user[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm text-white">
                {selectedConversation.user}
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
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-3 w-64 border border-white/10">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <span className="text-xs">▶️</span>
                    </Button>
                    <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-primary"></div>
                    </div>
                    <span className="text-xs font-medium text-white">
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
          <div className="flex items-center gap-4 mb-2 text-muted-foreground px-2">
            <div className="flex items-center gap-4 text-xs font-medium">
              <button className="text-white hover:text-primary transition-colors flex items-center gap-1 border-b-2 border-primary pb-0.5">
                <MessageCircle className="w-3.5 h-3.5" /> Chat
              </button>
              <button className="hover:text-white transition-colors flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Messenger
              </button>
              <button className="hover:text-white transition-colors flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </button>
            </div>
          </div>
          <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
            <textarea
              className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none min-h-[50px] max-h-[150px] text-white placeholder:text-muted-foreground"
              placeholder="Write a message..."
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

function InfoItem({ icon: Icon, label, value, dashed }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
        <p
          className={`font-medium ${dashed ? "text-muted-foreground border-b border-dashed border-muted-foreground/50 inline-block pb-0.5 cursor-pointer" : "text-white"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default Inbox;
