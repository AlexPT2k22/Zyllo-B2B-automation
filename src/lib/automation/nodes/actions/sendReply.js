/**
 * Send Reply Action
 *
 * Sends a reply message to the sender
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "send_reply",
  type: NODE_TYPES.ACTION,
  category: "actions",
  name: "Send Reply",
  description: "Send a reply message to the user",
  icon: "Send",
  color: "#22c55e",

  inputs: [
    { id: "recipient", type: "object", label: "Recipient", required: true },
  ],

  outputs: [
    { id: "sent", type: "boolean", label: "Message Sent" },
    { id: "messageId", type: "string", label: "Message ID" },
  ],

  properties: [
    {
      id: "message",
      type: PROPERTY_TYPES.TEXTAREA,
      label: "Message",
      description: "The message to send. Use {{variable}} for dynamic content.",
      required: true,
      placeholder: "Hi {{username}}! Thanks for your message...",
    },
    {
      id: "delay",
      type: PROPERTY_TYPES.NUMBER,
      label: "Delay (seconds)",
      description: "Wait before sending (makes it feel more human)",
      default: 0,
      placeholder: "0",
    },
    {
      id: "quickReplies",
      type: PROPERTY_TYPES.KEYWORDS,
      label: "Quick Replies",
      description: "Add quick reply buttons (one per line)",
      placeholder: "Yes\nNo\nTell me more",
    },
  ],

  execute: async (context, config) => {
    const { message, delay = 0, quickReplies = "" } = config;

    if (!message) {
      context.log("send_reply", "No message configured", "error");
      return { sent: false };
    }

    // Apply delay
    if (delay > 0) {
      context.log("send_reply", `Waiting ${delay} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }

    // Process template variables
    let processedMessage = message;
    const triggerData = context.getTriggerData();

    // Replace common variables
    const variables = {
      username: triggerData.sender?.username || "there",
      name: triggerData.sender?.name || triggerData.sender?.username || "there",
      ...Object.fromEntries(context.variables),
    };

    for (const [key, value] of Object.entries(variables)) {
      processedMessage = processedMessage.replace(
        new RegExp(`{{${key}}}`, "gi"),
        value,
      );
    }

    // Parse quick replies
    const quickReplyList = quickReplies
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    context.log(
      "send_reply",
      `Sending: "${processedMessage.substring(0, 50)}..."`,
    );

    // Here you would call the Instagram API
    // For now, we just simulate success
    const messageId = `msg_${Date.now()}`;

    return {
      sent: true,
      messageId,
      processedMessage,
      quickReplies: quickReplyList,
    };
  },
};
