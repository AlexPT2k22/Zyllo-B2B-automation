/**
 * Notify Team Action
 *
 * Sends a notification to team members
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "notify_team",
  type: NODE_TYPES.ACTION,
  category: "actions",
  name: "Notify Team",
  description: "Send a notification to your team",
  icon: "Bell",
  color: "#22c55e",

  inputs: [{ id: "data", type: "object", label: "Notification Data" }],

  outputs: [{ id: "notified", type: "boolean", label: "Notification Sent" }],

  properties: [
    {
      id: "channel",
      type: PROPERTY_TYPES.SELECT,
      label: "Notification Channel",
      description: "How to notify",
      default: "email",
      options: [
        { value: "email", label: "Email" },
        { value: "slack", label: "Slack" },
        { value: "webhook", label: "Webhook" },
        { value: "in_app", label: "In-App Notification" },
      ],
    },
    {
      id: "recipients",
      type: PROPERTY_TYPES.KEYWORDS,
      label: "Recipients",
      description: "Email addresses or Slack channels",
      placeholder: "team@company.com, #sales",
    },
    {
      id: "message",
      type: PROPERTY_TYPES.TEXTAREA,
      label: "Notification Message",
      description:
        "The notification message. Use {{variable}} for dynamic content.",
      required: true,
      placeholder: "🔔 New lead from {{username}}!",
    },
    {
      id: "priority",
      type: PROPERTY_TYPES.SELECT,
      label: "Priority",
      default: "normal",
      options: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
  ],

  execute: async (context, config) => {
    const { channel, recipients, message, priority } = config;

    if (!message) {
      context.log("notify_team", "No message configured", "error");
      return { notified: false };
    }

    // Process template variables
    let processedMessage = message;
    const triggerData = context.getTriggerData();
    const contact =
      triggerData.sender || triggerData.follower || triggerData.commenter;

    const variables = {
      username: contact?.username || "Unknown",
      name: contact?.name || contact?.username || "Unknown",
      timestamp: new Date().toLocaleString(),
    };

    for (const [key, value] of Object.entries(variables)) {
      processedMessage = processedMessage.replace(
        new RegExp(`{{${key}}}`, "gi"),
        value,
      );
    }

    context.log(
      "notify_team",
      `Sending ${priority} notification via ${channel}: "${processedMessage.substring(0, 50)}..."`,
    );

    // Here you would integrate with email/Slack/webhook
    return {
      notified: true,
      channel,
      processedMessage,
    };
  },
};
