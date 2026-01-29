import React, { useState } from "react";
import { Plus, Edit2, Trash2, Copy, Search, MessageSquare } from "lucide-react";
import "./QuickReplies.css";

// Mock data - will come from Supabase
const mockReplies = [
  {
    id: 1,
    title: "Greeting",
    shortcut: "/hi",
    message:
      "Hey there! 👋 Welcome to Porto Fashion! How can I help you today?",
    useCount: 156,
  },
  {
    id: 2,
    title: "Pricing Info",
    shortcut: "/price",
    message:
      "Hi! Most of our dresses range from €40-€50. Which item are you interested in? 😊",
    useCount: 234,
  },
  {
    id: 3,
    title: "Shipping Info",
    shortcut: "/ship",
    message:
      "We ship to all of Portugal! 🚚 Standard shipping is €4.99 or free for orders over €50. Delivery takes 2-3 business days.",
    useCount: 89,
  },
  {
    id: 4,
    title: "Thank You",
    shortcut: "/thanks",
    message:
      "Thank you so much for your order! 🙏 You'll receive a tracking number as soon as it ships. Have a great day!",
    useCount: 67,
  },
  {
    id: 5,
    title: "Return Policy",
    shortcut: "/return",
    message:
      "No problem! You can return any unworn item within 14 days for a full refund. Just send us a DM and we'll arrange the pickup. 📦",
    useCount: 45,
  },
];

const QuickReplies = () => {
  const [replies, setReplies] = useState(mockReplies);
  const [showModal, setShowModal] = useState(false);
  const [editingReply, setEditingReply] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortcut: "",
    message: "",
  });

  const filteredReplies = replies.filter(
    (reply) =>
      reply.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.shortcut.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.message.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenModal = (reply = null) => {
    if (reply) {
      setEditingReply(reply);
      setFormData({
        title: reply.title,
        shortcut: reply.shortcut,
        message: reply.message,
      });
    } else {
      setEditingReply(null);
      setFormData({ title: "", shortcut: "", message: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.message) return;

    if (editingReply) {
      setReplies(
        replies.map((r) =>
          r.id === editingReply.id ? { ...r, ...formData } : r,
        ),
      );
    } else {
      setReplies([
        ...replies,
        {
          id: Date.now(),
          ...formData,
          useCount: 0,
        },
      ]);
    }

    setShowModal(false);
    setFormData({ title: "", shortcut: "", message: "" });
    setEditingReply(null);
  };

  const handleDelete = (id) => {
    setReplies(replies.filter((r) => r.id !== id));
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    // Could add a toast notification here
  };

  return (
    <div className="quick-replies-page">
      <div className="qr-header">
        <div>
          <h2>Quick Replies</h2>
          <p className="subtitle">
            Create shortcuts for frequently used responses
          </p>
        </div>
        <button className="create-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          New Reply
        </button>
      </div>

      {/* Search */}
      <div className="qr-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search replies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="qr-stats">
        <div className="stat">
          <span className="stat-value">{replies.length}</span>
          <span className="stat-label">Total Replies</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {replies.reduce((sum, r) => sum + r.useCount, 0)}
          </span>
          <span className="stat-label">Times Used</span>
        </div>
      </div>

      {/* Replies Grid */}
      <div className="replies-grid">
        {filteredReplies.map((reply) => (
          <div key={reply.id} className="reply-card">
            <div className="reply-header">
              <div className="reply-icon">
                <MessageSquare size={18} />
              </div>
              <div className="reply-title-section">
                <h4>{reply.title}</h4>
                <span className="shortcut">{reply.shortcut}</span>
              </div>
              <div className="reply-actions">
                <button
                  className="action-btn"
                  onClick={() => handleCopy(reply.message)}
                  title="Copy"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleOpenModal(reply)}
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(reply.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="reply-message">{reply.message}</p>
            <div className="reply-footer">
              <span className="use-count">Used {reply.useCount} times</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingReply ? "Edit Reply" : "New Quick Reply"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., Greeting"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Shortcut (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., /hi"
                  value={formData.shortcut}
                  onChange={(e) =>
                    setFormData({ ...formData, shortcut: e.target.value })
                  }
                />
                <span className="hint">
                  Type this in the chat to quickly insert the reply
                </span>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Your quick reply message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                {editingReply ? "Save Changes" : "Create Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickReplies;
