import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MoreVertical, Send } from "lucide-react";

const conversations = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "",
    lastMessage: "Hi! I'm interested in your product pricing",
    time: "2 min ago",
    unread: true,
    status: "pending",
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "",
    lastMessage: "Thanks for the quick response! 🙌",
    time: "15 min ago",
    unread: false,
    status: "replied",
  },
  {
    id: 3,
    user: "Emma Davis",
    avatar: "",
    lastMessage: "Do you ship internationally?",
    time: "1 hour ago",
    unread: false,
    status: "auto-replied",
  },
  {
    id: 4,
    user: "Alex Turner",
    avatar: "",
    lastMessage: "When will the new collection drop?",
    time: "2 hours ago",
    unread: false,
    status: "replied",
  },
  {
    id: 5,
    user: "Lisa Wang",
    avatar: "",
    lastMessage: "Can I get a discount code?",
    time: "3 hours ago",
    unread: true,
    status: "pending",
  },
  {
    id: 6,
    user: "James Miller",
    avatar: "",
    lastMessage: "Your product changed my life!",
    time: "5 hours ago",
    unread: false,
    status: "replied",
  },
];

function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [message, setMessage] = useState("");

  return (
    <div className="inbox-page">
      {/* Conversation List */}
      <Card className="conversation-list-card">
        <CardHeader className="conversation-list-header">
          <CardTitle>Inbox</CardTitle>
          <div className="inbox-actions">
            <Button variant="ghost" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="search-input"
          />
        </div>
        <div className="conversation-list">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={`conversation-item ${selectedConversation?.id === convo.id ? "active" : ""}`}
              onClick={() => setSelectedConversation(convo)}
            >
              <div className="conversation-avatar-wrapper">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={convo.avatar} alt={convo.user} />
                  <AvatarFallback>
                    {convo.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {convo.unread && <span className="unread-indicator"></span>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <span
                    className={`conversation-name ${convo.unread ? "unread" : ""}`}
                  >
                    {convo.user}
                  </span>
                  <span className="conversation-time">{convo.time}</span>
                </div>
                <p
                  className={`conversation-preview ${convo.unread ? "unread" : ""}`}
                >
                  {convo.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat View */}
      <Card className="chat-view-card">
        {selectedConversation ? (
          <>
            <CardHeader className="chat-header">
              <div className="chat-user-info">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedConversation.avatar}
                    alt={selectedConversation.user}
                  />
                  <AvatarFallback>
                    {selectedConversation.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="chat-user-name">
                    {selectedConversation.user}
                  </h3>
                  <Badge
                    variant={
                      selectedConversation.status === "pending"
                        ? "warning"
                        : selectedConversation.status === "auto-replied"
                          ? "default"
                          : "success"
                    }
                  >
                    {selectedConversation.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="chat-messages">
              <div className="message received">
                <p>{selectedConversation.lastMessage}</p>
                <span className="message-time">
                  {selectedConversation.time}
                </span>
              </div>
              {selectedConversation.status !== "pending" && (
                <div className="message sent">
                  <p>Thanks for reaching out! We'll get back to you shortly.</p>
                  <span className="message-time">Just now</span>
                </div>
              )}
            </CardContent>
            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Type your message..."
                className="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button className="send-button">
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </Card>

      <style>{`
        .inbox-page {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1rem;
          height: calc(100vh - 180px);
        }

        .conversation-list-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .conversation-list-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0;
        }

        .search-wrapper {
          position: relative;
          padding: 0 1rem 1rem;
        }

        .search-icon {
          position: absolute;
          left: 1.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          background-color: #0f0e17;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #a855f7;
        }

        .conversation-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .conversation-item:hover {
          background-color: rgba(255,255,255,0.05);
        }

        .conversation-item.active {
          background-color: rgba(168, 85, 247, 0.1);
          border-left: 3px solid #a855f7;
        }

        .conversation-avatar-wrapper {
          position: relative;
        }

        .unread-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background-color: #a855f7;
          border-radius: 50%;
          border: 2px solid #0f0e17;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .conversation-name {
          font-size: 0.875rem;
          color: #ffffff;
        }

        .conversation-name.unread {
          font-weight: 600;
        }

        .conversation-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .conversation-preview {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .conversation-preview.unread {
          color: #ffffff;
          font-weight: 500;
        }

        .chat-view-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .chat-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.25rem;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1.5rem !important;
        }

        .message {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
        }

        .message p {
          margin: 0 0 0.25rem;
          font-size: 0.875rem;
        }

        .message-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .message.received {
          background-color: rgba(255,255,255,0.1);
          color: #ffffff;
          border-bottom-left-radius: 0.25rem;
          align-self: flex-start;
        }

        .message.sent {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          color: white;
          border-bottom-right-radius: 0.25rem;
          align-self: flex-end;
        }

        .message.sent .message-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .chat-input-wrapper {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background-color: #0f0e17;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: #a855f7;
        }

        .send-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .inbox-page {
            grid-template-columns: 1fr;
          }

          .chat-view-card {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Inbox;
