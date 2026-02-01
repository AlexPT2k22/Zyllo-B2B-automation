/**
 * Comment Trigger
 *
 * Triggers when someone comments on your post
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "comment_trigger",
  type: NODE_TYPES.TRIGGER,
  category: "triggers",
  name: "New Comment",
  description: "Triggers when someone comments on your post",
  icon: "MessageCircle",
  color: "#a855f7",

  inputs: [],

  outputs: [
    { id: "comment", type: "object", label: "Comment Data" },
    { id: "commenter", type: "object", label: "Commenter Info" },
    { id: "post", type: "object", label: "Post Data" },
    { id: "commentText", type: "string", label: "Comment Text" },
  ],

  properties: [
    {
      id: "keywords",
      type: PROPERTY_TYPES.KEYWORDS,
      label: "Filter Keywords",
      description:
        "Only trigger if comment contains these keywords (leave empty for all comments)",
      placeholder: "interested, want, price",
    },
    {
      id: "postIds",
      type: PROPERTY_TYPES.TEXTAREA,
      label: "Specific Posts",
      description:
        "Post IDs to monitor (one per line, leave empty for all posts)",
      placeholder: "Leave empty for all posts",
    },
  ],

  execute: async (context, config) => {
    const triggerData = context.getTriggerData();
    const { keywords = "", postIds = "" } = config;

    const comment = triggerData.comment;
    const commenter = triggerData.commenter;
    const post = triggerData.post;

    if (!comment) return null;

    // Check post filter
    const postIdList = postIds
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p);
    if (postIdList.length > 0 && !postIdList.includes(post?.id)) {
      context.log(
        "comment_trigger",
        "Skipped: comment is not on monitored post",
      );
      return null;
    }

    // Check keyword filter
    const keywordList = keywords
      .split(/[,\n]/)
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k);
    if (keywordList.length > 0) {
      const commentLower = comment.text?.toLowerCase() || "";
      const hasKeyword = keywordList.some((kw) => commentLower.includes(kw));
      if (!hasKeyword) {
        context.log("comment_trigger", "Skipped: no matching keywords");
        return null;
      }
    }

    return {
      comment,
      commenter,
      post,
      commentText: comment.text,
    };
  },
};
