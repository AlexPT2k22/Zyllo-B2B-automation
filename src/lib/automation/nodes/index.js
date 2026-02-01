/**
 * Zyllo Automation Nodes - Auto-loader
 *
 * This file imports all node definitions and registers them with the registry.
 * Add new nodes here to make them available in the automation builder.
 */

import { nodeRegistry } from "../nodeRegistry";

// Triggers
import keywordMatch from "./triggers/keywordMatch";
import newFollower from "./triggers/newFollower";
import storyMention from "./triggers/storyMention";
import commentTrigger from "./triggers/commentTrigger";

// Actions
import sendReply from "./actions/sendReply";
import sendDM from "./actions/sendDM";
import addTag from "./actions/addTag";
import notifyTeam from "./actions/notifyTeam";

// Conditions
import ifElse from "./conditions/ifElse";

// Transforms
import delay from "./transforms/delay";
import setVariable from "./transforms/setVariable";

// Register all nodes
const allNodes = [
  // Triggers
  keywordMatch,
  newFollower,
  storyMention,
  commentTrigger,

  // Actions
  sendReply,
  sendDM,
  addTag,
  notifyTeam,

  // Conditions
  ifElse,

  // Transforms
  delay,
  setVariable,
];

// Register each node
for (const node of allNodes) {
  nodeRegistry.register(node);
}

// Export for convenience
export {
  // Triggers
  keywordMatch,
  newFollower,
  storyMention,
  commentTrigger,

  // Actions
  sendReply,
  sendDM,
  addTag,
  notifyTeam,

  // Conditions
  ifElse,

  // Transforms
  delay,
  setVariable,
};

export default allNodes;
