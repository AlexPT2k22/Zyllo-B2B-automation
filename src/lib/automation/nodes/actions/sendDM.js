/**
 * Send DM Action
 *
 * Sends a direct message to a user
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "send_dm",
  type: NODE_TYPES.ACTION,
  category: "actions",
  name: "Send DM",
  description: "Send a direct message to a specific user",
  icon: "Mail",
  color: "#22c55e",

  inputs: [{ id: "userId", type: "string", label: "User ID" }],

  outputs: [
    { id: "sent", type: "boolean", label: "DM Sent" },
    { id: "messageId", type: "string", label: "Message ID" },
  ],

  properties: [
    {
      id: "message",
      type: PROPERTY_TYPES.TEXTAREA,
      label: "Message",
      description: "The DM to send",
      required: true,
      placeholder: "Hi! Thanks for following...",
    },
    {
      id: "attachImage",
      type: PROPERTY_TYPES.TEXT,
      label: "Image URL",
      description: "Optional image to attach",
      placeholder: "https://...",
    },
  ],

  execute: async (context, config) => {
    const { message, attachImage } = config;

    if (!message) {
      context.log("send_dm", "No message configured", "error");
      return { sent: false };
    }

    const triggerData = context.getTriggerData();
    const recipient = triggerData.sender || triggerData.follower;

    if (!recipient) {
      context.log("send_dm", "No recipient found", "error");
      return { sent: false };
    }

    context.log("send_dm", `Sending DM to ${recipient.username}`);

    // Here you would call the Instagram API
    const messageId = `dm_${Date.now()}`;

    return {
      sent: true,
      messageId,
    };
  },
};
