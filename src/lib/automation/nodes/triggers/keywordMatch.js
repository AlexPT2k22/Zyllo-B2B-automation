/**
 * Keyword Match Trigger
 *
 * Triggers when a message contains specific keywords
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "keyword_match",
  type: NODE_TYPES.TRIGGER,
  category: "triggers",
  name: "Keyword Match",
  description: "Triggers when a message contains specific keywords",
  icon: "MessageSquare",
  color: "#a855f7",

  inputs: [],

  outputs: [
    { id: "message", type: "object", label: "Message Data" },
    { id: "sender", type: "object", label: "Sender Info" },
    { id: "matchedKeyword", type: "string", label: "Matched Keyword" },
  ],

  properties: [
    {
      id: "keywords",
      type: PROPERTY_TYPES.KEYWORDS,
      label: "Keywords",
      description:
        "List of keywords to match (one per line or comma-separated)",
      required: true,
      placeholder: "price, cost, how much",
    },
    {
      id: "matchType",
      type: PROPERTY_TYPES.SELECT,
      label: "Match Type",
      description: "How to match keywords",
      default: "contains",
      options: [
        { value: "contains", label: "Contains" },
        { value: "exact", label: "Exact Match" },
        { value: "starts_with", label: "Starts With" },
        { value: "ends_with", label: "Ends With" },
      ],
    },
    {
      id: "caseSensitive",
      type: PROPERTY_TYPES.BOOLEAN,
      label: "Case Sensitive",
      description: "Match keywords with exact case",
      default: false,
    },
  ],

  /**
   * Check if message matches trigger criteria
   * @param {import('../../engine').ExecutionContext} context
   * @param {Object} config
   * @returns {Object | null}
   */
  execute: async (context, config) => {
    const {
      keywords = "",
      matchType = "contains",
      caseSensitive = false,
    } = config;
    const triggerData = context.getTriggerData();
    const messageText = triggerData.message?.text || "";

    // Parse keywords
    const keywordList = keywords
      .split(/[,\n]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywordList.length === 0) {
      context.log("keyword_match", "No keywords configured", "warn");
      return null;
    }

    const textToMatch = caseSensitive ? messageText : messageText.toLowerCase();
    let matchedKeyword = null;

    for (const keyword of keywordList) {
      const kw = caseSensitive ? keyword : keyword.toLowerCase();

      switch (matchType) {
        case "exact":
          if (textToMatch === kw) matchedKeyword = keyword;
          break;
        case "starts_with":
          if (textToMatch.startsWith(kw)) matchedKeyword = keyword;
          break;
        case "ends_with":
          if (textToMatch.endsWith(kw)) matchedKeyword = keyword;
          break;
        case "contains":
        default:
          if (textToMatch.includes(kw)) matchedKeyword = keyword;
          break;
      }

      if (matchedKeyword) break;
    }

    if (!matchedKeyword) {
      return null; // Trigger doesn't match
    }

    return {
      message: triggerData.message,
      sender: triggerData.sender,
      matchedKeyword,
    };
  },
};
