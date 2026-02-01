/**
 * Add Tag Action
 *
 * Adds a tag/label to a contact for organization
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "add_tag",
  type: NODE_TYPES.ACTION,
  category: "actions",
  name: "Add Tag",
  description: "Add a tag to the contact for organization",
  icon: "Tag",
  color: "#22c55e",

  inputs: [{ id: "contact", type: "object", label: "Contact" }],

  outputs: [
    { id: "tagged", type: "boolean", label: "Tag Added" },
    { id: "tags", type: "array", label: "All Tags" },
  ],

  properties: [
    {
      id: "tags",
      type: PROPERTY_TYPES.KEYWORDS,
      label: "Tags",
      description: "Tags to add (comma or line separated)",
      required: true,
      placeholder: "interested, hot-lead",
    },
    {
      id: "replaceExisting",
      type: PROPERTY_TYPES.BOOLEAN,
      label: "Replace Existing",
      description: "Replace existing tags instead of adding",
      default: false,
    },
  ],

  execute: async (context, config) => {
    const { tags = "", replaceExisting = false } = config;

    const tagList = tags
      .split(/[,\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (tagList.length === 0) {
      context.log("add_tag", "No tags configured", "warn");
      return { tagged: false, tags: [] };
    }

    const triggerData = context.getTriggerData();
    const contact =
      triggerData.sender || triggerData.follower || triggerData.commenter;

    if (!contact) {
      context.log("add_tag", "No contact found to tag", "error");
      return { tagged: false, tags: [] };
    }

    context.log(
      "add_tag",
      `Adding tags: ${tagList.join(", ")} to ${contact.username}`,
    );

    // Here you would update the contact in your database
    const allTags = replaceExisting
      ? tagList
      : [...(contact.tags || []), ...tagList];

    return {
      tagged: true,
      tags: [...new Set(allTags)], // Remove duplicates
    };
  },
};
