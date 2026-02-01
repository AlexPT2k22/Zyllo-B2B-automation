/**
 * Story Mention Trigger
 *
 * Triggers when someone mentions you in their story
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "story_mention",
  type: NODE_TYPES.TRIGGER,
  category: "triggers",
  name: "Story Mention",
  description: "Triggers when someone mentions you in their story",
  icon: "AtSign",
  color: "#a855f7",

  inputs: [],

  outputs: [
    { id: "story", type: "object", label: "Story Data" },
    { id: "mentioner", type: "object", label: "Who Mentioned" },
    { id: "storyUrl", type: "string", label: "Story URL" },
  ],

  properties: [
    {
      id: "onlyFollowers",
      type: PROPERTY_TYPES.BOOLEAN,
      label: "Only Followers",
      description: "Only trigger for mentions from accounts you follow",
      default: false,
    },
  ],

  execute: async (context, config) => {
    const triggerData = context.getTriggerData();
    const { onlyFollowers = false } = config;

    const story = triggerData.story;
    const mentioner = triggerData.mentioner;

    if (!story || !mentioner) return null;

    if (onlyFollowers && !mentioner.is_following) {
      context.log("story_mention", "Skipped: mentioner is not a follower");
      return null;
    }

    return {
      story,
      mentioner,
      storyUrl: story.url || null,
    };
  },
};
