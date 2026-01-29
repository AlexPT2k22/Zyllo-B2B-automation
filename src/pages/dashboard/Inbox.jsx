import React, { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
} from "lucide-react";
import "./Inbox.css";

// Mock data - will come from Supabase
const mockConversations = [
  {
    id: 1,
    sender: "Maria Santos",
    handle: "@mariasantos",
    preview: "How much is it?",
    time: "8 mins ago",
    initials: "MS",
    unread: true,
    status: "online",
    tags: ["Hot Lead"],
  },
  {
    id: 2,
    sender: "Pedro Lima",
    handle: "@pedrolima",
    preview: "Olá! Tem envio para Lisboa?",
    time: "1 hour ago",
    initials: "PL",
    unread: true,
    status: "offline",
    tags: ["VIP"],
  },
  {
    id: 3,
    sender: "Ana Beauty",
    handle: "@anabeauty",
    preview: "Olá! Tem envio para Lisboa?",
    time: "1 hour ago",
    initials: "AB",
    unread: false,
    status: "online",
    tags: [],
  },
  {
    id: 4,
    sender: "Joana e Sofia",
    handle: "@joanaesofia",
    preview: "Hello! Can I return items if they don't fit?",
    time: "4 hours ago",
    initials: "JS",
    unread: false,
    status: "offline",
    tags: ["New"],
  },
  {
    id: 5,
    sender: "Daniel Andrade",
    handle: "@danielandrade",
    preview: "Obrigado, chegou tudo ótimo!",
    time: "1 day",
    initials: "DA",
    unread: false,
    status: "offline",
    tags: [],
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hey sarah, jones, wu can see the first pace for the chat? 😊",
    time: "10:23 AM",
  },
  {
    id: 2,
    sender: "them",
    text: "Hey, would you want to evenathine and bolly for my diam is meicive herin?",
    time: "10:24 AM",
  },
  {
    id: 3,
    sender: "me",
    text: "Thank you some ris omoe for Instagram before and: aeoar nganw?",
    time: "10:25 AM",
  },
  {
    id: 4,
    sender: "them",
    text: "How do you everast on your schedue call on marmrying this weekend?",
    time: "10:26 AM",
  },
  {
    id: 5,
    sender: "me",
    text: "Mayin tlis you grale 😊",
    time: "10:27 AM",
    status: "delivered",
  },
];

const quickReplies = ["Thank you!", "Schedule Call", "Send Discount"];

const Inbox = () => {
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0],
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  return (
    <div className="inbox-container">
      {/* Conversations List */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <div className="conversations-tabs">
            <button className="conv-tab active">All Messages</button>
            <button className="conv-tab">Unread</button>
          </div>
        </div>

        <div className="conversations-list">
          {mockConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""} ${conv.unread ? "unread" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="conv-avatar-wrapper">
                <div className="conv-avatar">{conv.initials}</div>
                {conv.status === "online" && (
                  <span className="status-dot online"></span>
                )}
              </div>
              <div className="conv-content">
                <div className="conv-header">
                  <span className="conv-sender">{conv.sender}</span>
                  <span className="conv-time">{conv.time}</span>
                </div>
                <div className="conv-preview">{conv.preview}</div>
                {conv.tags.length > 0 && (
                  <div className="conv-tags">
                    {conv.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`conv-tag ${tag.toLowerCase().replace(" ", "-")}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {conv.unread && <span className="unread-indicator"></span>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {selectedConversation.initials}
                </div>
                <div>
                  <div className="chat-user-name">
                    {selectedConversation.sender}
                    {selectedConversation.status === "online" && (
                      <span className="online-badge">Online</span>
                    )}
                  </div>
                  <div className="chat-user-handle">
                    {selectedConversation.handle}
                  </div>
                </div>
              </div>
              <div className="chat-header-tags">
                {selectedConversation.tags.map((tag, i) => (
                  <span key={i} className="header-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn">
                  <Phone size={18} />
                </button>
                <button className="chat-action-btn">
                  <Video size={18} />
                </button>
                <button className="chat-action-btn">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-meta">
                    <span className="message-time">{msg.time}</span>
                    {msg.status && (
                      <span className="message-status">{msg.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="quick-replies-bar">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  className="quick-reply-btn"
                  onClick={() => setMessageInput(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Text a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="input-actions">
                  <button className="input-action-btn">
                    <Smile size={20} />
                  </button>
                  <button className="input-action-btn">
                    <Paperclip size={20} />
                  </button>
                  <button className="send-btn" onClick={handleSendMessage}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
