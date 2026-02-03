/**
 * Automation Templates
 *
 * Pre-built workflow templates that users can clone.
 */

export const templates = [
  {
    id: "template-auto-reply-faq",
    name: "Auto Reply FAQ",
    description:
      "Automatically reply to common questions about pricing, shipping, etc.",
    category: "customer-support",
    icon: "💬",
    nodes: [
      {
        id: "trigger-1",
        nodeType: "keyword_match",
        x: 200,
        y: 100,
        config: {
          keywords: "price, pricing, cost, how much",
          matchType: "contains",
          caseSensitive: false,
        },
      },
      {
        id: "action-1",
        nodeType: "send_reply",
        x: 200,
        y: 350,
        config: {
          message:
            "Hi {{username}}! 👋 Our pricing starts at €49/month. Would you like me to send you more details?",
          delay: 2,
        },
      },
    ],
    connections: [{ from: "trigger-1", to: "action-1" }],
  },
  {
    id: "template-welcome-message",
    name: "Welcome New Follower",
    description: "Send a warm welcome message to new followers.",
    category: "engagement",
    icon: "👋",
    nodes: [
      {
        id: "trigger-1",
        nodeType: "new_follower",
        x: 200,
        y: 100,
        config: {},
      },
      {
        id: "action-1",
        nodeType: "send_reply",
        x: 200,
        y: 350,
        config: {
          message:
            "Hey {{username}}! 🎉 Thanks for following! We're excited to have you here. Feel free to DM us anytime with questions!",
          delay: 5,
        },
      },
    ],
    connections: [{ from: "trigger-1", to: "action-1" }],
  },
  {
    id: "template-out-of-office",
    name: "Out of Office",
    description: "Auto-reply when you're away or outside business hours.",
    category: "customer-support",
    icon: "🏖️",
    nodes: [
      {
        id: "trigger-1",
        nodeType: "any_message",
        x: 200,
        y: 100,
        config: {},
      },
      {
        id: "action-1",
        nodeType: "send_reply",
        x: 200,
        y: 350,
        config: {
          message:
            "Hi {{username}}! 👋 Thanks for reaching out. We're currently away but will get back to you within 24 hours. For urgent matters, email us at support@company.com",
          delay: 1,
        },
      },
    ],
    connections: [{ from: "trigger-1", to: "action-1" }],
  },
  {
    id: "template-lead-qualifier",
    name: "Lead Qualifier",
    description:
      "Qualify leads by asking follow-up questions based on their interest.",
    category: "sales",
    icon: "🎯",
    nodes: [
      {
        id: "trigger-1",
        nodeType: "keyword_match",
        x: 200,
        y: 80,
        config: {
          keywords: "interested, demo, trial, buy, purchase",
          matchType: "contains",
          caseSensitive: false,
        },
      },
      {
        id: "condition-1",
        nodeType: "condition",
        x: 200,
        y: 280,
        config: {
          field: "message",
          operator: "contains",
          value: "demo",
        },
      },
      {
        id: "action-demo",
        nodeType: "send_reply",
        x: 80,
        y: 480,
        config: {
          message:
            "Awesome! 🚀 I'd love to show you a demo. What time works best for you this week? Just reply with your preferred day and time.",
          delay: 2,
        },
      },
      {
        id: "action-general",
        nodeType: "send_reply",
        x: 320,
        y: 480,
        config: {
          message:
            "Great to hear you're interested! 🙌 What specifically caught your attention? I'd love to help you find the best solution.",
          delay: 2,
        },
      },
    ],
    connections: [
      { from: "trigger-1", to: "condition-1" },
      { from: "condition-1", to: "action-demo" },
      // Note: condition false path would go to action-general
    ],
  },
  {
    id: "template-product-inquiry",
    name: "Product Inquiry",
    description: "Handle product questions with detailed info.",
    category: "sales",
    icon: "📦",
    nodes: [
      {
        id: "trigger-1",
        nodeType: "keyword_match",
        x: 200,
        y: 100,
        config: {
          keywords: "product, features, what does, how does, tell me about",
          matchType: "contains",
          caseSensitive: false,
        },
      },
      {
        id: "action-1",
        nodeType: "send_reply",
        x: 200,
        y: 350,
        config: {
          message:
            "Great question! 📦 Here's a quick overview:\n\n✅ Feature 1: [Description]\n✅ Feature 2: [Description]\n✅ Feature 3: [Description]\n\nWant me to go deeper on any of these?",
          delay: 3,
        },
      },
    ],
    connections: [{ from: "trigger-1", to: "action-1" }],
  },
];

// Get templates by category
export function getTemplatesByCategory(category) {
  if (!category || category === "all") return templates;
  return templates.filter((t) => t.category === category);
}

// Get template by ID
export function getTemplateById(id) {
  return templates.find((t) => t.id === id);
}

// Clone a template (generates new IDs)
export function cloneTemplate(templateId) {
  const template = getTemplateById(templateId);
  if (!template) return null;

  const idMap = new Map();
  const timestamp = Date.now();

  // Clone nodes with new IDs
  const clonedNodes = template.nodes.map((node, index) => {
    const newId = `${node.nodeType}-${timestamp}-${index}`;
    idMap.set(node.id, newId);
    return {
      ...node,
      id: newId,
      config: { ...node.config },
    };
  });

  // Update connections with new IDs
  const clonedConnections = template.connections.map((conn) => ({
    from: idMap.get(conn.from) || conn.from,
    to: idMap.get(conn.to) || conn.to,
  }));

  return {
    name: template.name,
    nodes: clonedNodes,
    connections: clonedConnections,
  };
}

// Get all categories
export function getCategories() {
  return [
    { id: "all", name: "All Templates", icon: "📋" },
    { id: "customer-support", name: "Customer Support", icon: "💬" },
    { id: "sales", name: "Sales", icon: "💰" },
    { id: "engagement", name: "Engagement", icon: "❤️" },
  ];
}

export default templates;
