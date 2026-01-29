import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Zap,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Search,
  ChevronDown,
} from "lucide-react";
import "./Automations.css";

// Mock data - will come from Supabase
const mockRules = [
  {
    id: 1,
    name: "FAQ - Pricing",
    triggerType: "keyword",
    keywords: ["price", "cost", "how much", "quanto custa"],
    response:
      "Hi! Most of our dresses range from €40-€50. Which item are you interested in? 😊",
    active: true,
    triggerCount: 234,
  },
  {
    id: 2,
    name: "Welcome Message",
    triggerType: "keyword",
    keywords: ["hello", "hi", "olá", "oi"],
    response:
      "Hey there! 👋 Welcome to Porto Fashion! How can I help you today?",
    active: true,
    triggerCount: 156,
  },
  {
    id: 3,
    name: "Shipping Info",
    triggerType: "keyword",
    keywords: ["shipping", "delivery", "envio", "entrega"],
    response:
      "We ship to all of Portugal! 🚚 Standard shipping is €4.99 or free for orders over €50. Delivery takes 2-3 business days.",
    active: true,
    triggerCount: 89,
  },
  {
    id: 4,
    name: "Cart Recovery",
    triggerType: "keyword",
    keywords: ["abandoned", "cart"],
    response:
      "Hey! We noticed you left something in your cart. Use code COMEBACK10 for 10% off! 🛒",
    active: false,
    triggerCount: 45,
  },
];

const Automations = () => {
  const [rules, setRules] = useState(mockRules);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: "",
    keywords: "",
    response: "",
    active: true,
  });

  const toggleRule = (id) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule,
      ),
    );
  };

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.keywords || !newRule.response) return;

    const rule = {
      id: Date.now(),
      name: newRule.name,
      triggerType: "keyword",
      keywords: newRule.keywords.split(",").map((k) => k.trim()),
      response: newRule.response,
      active: true,
      triggerCount: 0,
    };

    setRules([...rules, rule]);
    setNewRule({ name: "", keywords: "", response: "", active: true });
    setShowBuilder(false);
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  return (
    <div className="automations-page">
      <div className="automations-header">
        <div>
          <h2>Automation Rules</h2>
          <p className="subtitle">
            Create rules to automatically respond to messages
          </p>
        </div>
        <button
          className="create-rule-btn"
          onClick={() => setShowBuilder(true)}
        >
          <Plus size={18} />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="automation-stats">
        <div className="stat-item">
          <span className="stat-value">{rules.length}</span>
          <span className="stat-label">Total Rules</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {rules.filter((r) => r.active).length}
          </span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
          </span>
          <span className="stat-label">Total Triggers</span>
        </div>
      </div>

      {/* Rule Builder Modal */}
      {showBuilder && (
        <div className="rule-builder-overlay">
          <div className="rule-builder-modal">
            <div className="modal-header">
              <h3>Create New Rule</h3>
              <button
                className="close-btn"
                onClick={() => setShowBuilder(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g., Price Inquiry Reply"
                  value={newRule.name}
                  onChange={(e) =>
                    setNewRule({ ...newRule, name: e.target.value })
                  }
                />
              </div>

              <div className="rule-builder-visual">
                <div className="builder-block trigger">
                  <div className="block-header">
                    <span className="block-label">IF</span>
                  </div>
                  <div className="block-content">
                    <span>Message contains</span>
                    <input
                      type="text"
                      placeholder="price, cost, how much (comma separated)"
                      value={newRule.keywords}
                      onChange={(e) =>
                        setNewRule({ ...newRule, keywords: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="builder-arrow">↓</div>

                <div className="builder-block action">
                  <div className="block-header">
                    <span className="block-label">THEN</span>
                  </div>
                  <div className="block-content">
                    <span>Reply with</span>
                    <textarea
                      placeholder="Your automatic response message..."
                      value={newRule.response}
                      onChange={(e) =>
                        setNewRule({ ...newRule, response: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowBuilder(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleCreateRule}>
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="rules-list">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`rule-card ${!rule.active ? "inactive" : ""}`}
          >
            <div className="rule-icon">
              <MessageSquare size={22} />
            </div>

            <div className="rule-info">
              <div className="rule-name-row">
                <h4>{rule.name}</h4>
                <div className="rule-actions">
                  <button
                    className="action-btn"
                    onClick={() => setEditingRule(rule)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="rule-trigger">
                <span className="trigger-label">Keywords:</span>
                <div className="trigger-keywords">
                  {rule.keywords.map((kw, i) => (
                    <span key={i} className="keyword-tag">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rule-response">
                <span className="response-label">Response:</span>
                <p>{rule.response}</p>
              </div>

              <div className="rule-footer">
                <div className="trigger-count">
                  <Zap size={14} />
                  <span>Triggered {rule.triggerCount} times</span>
                </div>
                <div
                  className={`rule-toggle ${rule.active ? "active" : ""}`}
                  onClick={() => toggleRule(rule.id)}
                >
                  <span className="toggle-label">
                    {rule.active ? "Active" : "Paused"}
                  </span>
                  {rule.active ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Automations;
