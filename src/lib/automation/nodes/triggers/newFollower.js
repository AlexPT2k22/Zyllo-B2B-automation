/**
 * New Follower Trigger
 *
 * Triggers when someone follows your Instagram account
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "new_follower",
  type: NODE_TYPES.TRIGGER,
  category: "triggers",
  name: "New Follower",
  description: "Triggers when you get a new follower",
  icon: "UserPlus",
  color: "#a855f7",

  inputs: [],

  outputs: [
    { id: "follower", type: "object", label: "Follower Info" },
    { id: "username", type: "string", label: "Username" },
    { id: "followedAt", type: "string", label: "Follow Time" },
  ],

  properties: [
    {
      id: "minFollowers",
      type: PROPERTY_TYPES.NUMBER,
      label: "Min Follower Count",
      description:
        "Only trigger if the new follower has at least this many followers",
      placeholder: "0",
      default: 0,
    },
    {
      id: "requireBio",
      type: PROPERTY_TYPES.BOOLEAN,
      label: "Require Bio",
      description: "Only trigger if the follower has a bio (to filter bots)",
      default: false,
    },
  ],

  execute: async (context, config) => {
    const triggerData = context.getTriggerData();
    const { minFollowers = 0, requireBio = false } = config;

    const follower = triggerData.follower;
    if (!follower) return null;

    // Check min followers
    if (minFollowers > 0 && (follower.followers_count || 0) < minFollowers) {
      context.log(
        "new_follower",
        `Skipped: follower has ${follower.followers_count} followers (min: ${minFollowers})`,
      );
      return null;
    }

    // Check bio requirement
    if (requireBio && !follower.bio) {
      context.log("new_follower", "Skipped: follower has no bio");
      return null;
    }

    return {
      follower,
      username: follower.username,
      followedAt: triggerData.timestamp || new Date().toISOString(),
    };
  },
};
