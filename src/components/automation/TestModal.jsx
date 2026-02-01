/**
 * Test Modal Component
 *
 * Modal for testing automations with mock trigger data.
 */

import React, { useState } from "react";
import { useWorkflowStore } from "@/lib/automation/useWorkflowStore";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  X,
  Play,
  Loader2,
  MessageSquare,
  UserPlus,
  AtSign,
  MessageCircle,
  Sparkles,
} from "lucide-react";

// Preset mock data for different trigger types
const triggerPresets = {
  keyword_match: {
    label: "Message with keyword",
    icon: MessageSquare,
    data: {
      message: { text: "Hi! How much does this cost?" },
      sender: { username: "potential_customer", name: "John Doe" },
    },
  },
  new_follower: {
    label: "New follower",
    icon: UserPlus,
    data: {
      follower: {
        username: "new_fan",
        name: "Jane Smith",
        followers_count: 1500,
        bio: "Design lover",
      },
      timestamp: new Date().toISOString(),
    },
  },
  story_mention: {
    label: "Story mention",
    icon: AtSign,
    data: {
      story: { url: "https://instagram.com/stories/..." },
      mentioner: { username: "brand_ambassador", is_following: true },
    },
  },
  comment_trigger: {
    label: "Comment on post",
    icon: MessageCircle,
    data: {
      comment: { text: "This looks amazing! Where can I buy?" },
      commenter: { username: "interested_user" },
      post: { id: "post_123" },
    },
  },
};

export function TestModal({ isOpen, onClose }) {
  const { getCurrentWorkflow, runTest, executionState, validate } =
    useWorkflowStore();
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customData, setCustomData] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen) return null;

  const workflow = getCurrentWorkflow();
  if (!workflow) return null;

  // Get the first trigger in the workflow to suggest presets
  const firstTrigger = workflow.nodes.find((n) => {
    const def = nodeRegistry.get(n.nodeType);
    return def?.type === "trigger";
  });

  const suggestedPreset = firstTrigger
    ? triggerPresets[firstTrigger.nodeType]
    : null;

  const handleRunTest = async () => {
    // Validate first
    const validation = validate();
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    let triggerData;

    if (useCustom) {
      try {
        triggerData = JSON.parse(customData);
      } catch (e) {
        toast.error("Invalid JSON format");
        return;
      }
    } else if (selectedPreset) {
      triggerData = triggerPresets[selectedPreset]?.data || {};
    } else if (suggestedPreset) {
      triggerData = suggestedPreset.data;
    } else {
      triggerData = {};
    }

    const result = await runTest(triggerData);

    if (result.success) {
      toast.success("Automation executed successfully!");
    } else {
      toast.error(result.error || "Execution failed");
    }
  };

  const isRunning = executionState === "running";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg mx-4 bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Test Automation
              </h2>
              <p className="text-sm text-muted-foreground">{workflow.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isRunning}
            className="h-8 w-8 text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trigger Data Section */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
              Mock Trigger Data
            </label>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(triggerPresets).map(([key, preset]) => {
                const Icon = preset.icon;
                const isSelected = selectedPreset === key && !useCustom;
                const isSuggested = firstTrigger?.nodeType === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPreset(key);
                      setUseCustom(false);
                    }}
                    className={`
                      flex items-center gap-2 p-3 rounded-xl text-left transition-all
                      ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500/40 text-white"
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      }
                      border
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate">
                      {preset.label}
                    </span>
                    {isSuggested && !isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 ml-auto">
                        Suggested
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom JSON Toggle */}
            <button
              onClick={() => setUseCustom(!useCustom)}
              className={`
                w-full p-3 rounded-xl text-left text-sm transition-all border
                ${
                  useCustom
                    ? "bg-purple-500/20 border-purple-500/40 text-white"
                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                }
              `}
            >
              Use custom JSON data
            </button>

            {/* Custom JSON Input */}
            {useCustom && (
              <textarea
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder='{"message": {"text": "Hello!"}, "sender": {"username": "test_user"}}'
                className="w-full h-32 mt-3 p-3 bg-black/30 border border-white/10 rounded-xl text-sm text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            )}
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <p className="text-xs text-purple-300/80 leading-relaxed">
              This will simulate the automation with the selected trigger data.
              Watch the nodes highlight as they execute and check the logs panel
              for results.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-black/20">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isRunning}
            className="text-muted-foreground hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRunTest}
            disabled={isRunning}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Test
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestModal;
