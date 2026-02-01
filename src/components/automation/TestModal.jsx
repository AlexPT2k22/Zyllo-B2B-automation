/**
 * Test Modal Component
 *
 * Modal for testing automations with mock trigger data.
 * Zyllo Style: Professional SaaS Split-Pane
 */

import React, { useState, useEffect } from "react";
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
  Zap,
  Code,
  Layout,
  Check,
  ChevronRight,
} from "lucide-react";

const triggerPresets = {
  keyword_match: {
    label: "Message Received",
    desc: "Simulate a user sending a message",
    icon: MessageSquare,
    data: {
      message: { text: "Hi! How much does this cost?" },
      sender: { username: "test_user", name: "John Doe" },
    },
  },
  new_follower: {
    label: "New Follower",
    desc: "Simulate a new Instagram follower",
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
    label: "Story Mention",
    desc: "Simulate being mentioned in a story",
    icon: AtSign,
    data: {
      story: { url: "https://instagram.com/stories/..." },
      mentioner: { username: "brand_ambassador", is_following: true },
    },
  },
  comment_trigger: {
    label: "New Comment",
    desc: "Simulate a comment on a post",
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
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [jsonContent, setJsonContent] = useState("");
  const [isEditingJson, setIsEditingJson] = useState(false);

  // Auto-select based on workflow trigger
  useEffect(() => {
    if (isOpen) {
      const workflow = getCurrentWorkflow();
      const firstTrigger = workflow?.nodes.find((n) => {
        const def = nodeRegistry.get(n.nodeType);
        return def?.type === "trigger";
      });

      const suggested = firstTrigger?.nodeType;

      if (suggested && triggerPresets[suggested]) {
        setSelectedPresetId(suggested);
        setJsonContent(JSON.stringify(triggerPresets[suggested].data, null, 2));
      } else {
        setSelectedPresetId("custom");
        setJsonContent('{\n  "key": "value"\n}');
      }
      setIsEditingJson(false);
    }
  }, [isOpen, getCurrentWorkflow]);

  const handleSelectPreset = (key) => {
    setSelectedPresetId(key);
    if (triggerPresets[key]) {
      setJsonContent(JSON.stringify(triggerPresets[key].data, null, 2));
      setIsEditingJson(false);
    }
  };

  const handleJsonChange = (val) => {
    setJsonContent(val);
    setIsEditingJson(true);
    if (selectedPresetId !== "custom") {
      setSelectedPresetId("custom");
    }
  };

  const handleRunTest = async () => {
    const validation = validate();
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    let triggerData;
    try {
      triggerData = JSON.parse(jsonContent);
    } catch (e) {
      toast.error("Invalid JSON format");
      return;
    }

    onClose();
    const result = await runTest(triggerData);
    if (result.success) {
      toast.success("Test started successfully");
    } else {
      toast.error(result.error || "Execution failed");
    }
  };

  const workflow = getCurrentWorkflow();
  if (!isOpen || !workflow) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[600px] flex bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/5 mx-6">
        {/* Sidebar: Presets */}
        <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Scenarios
            </h3>
            <p className="text-[10px] text-muted-foreground/50">
              Select a trigger event
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Object.entries(triggerPresets).map(([key, preset]) => {
              const Icon = preset.icon;
              const isSelected = selectedPresetId === key;

              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`
                     w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group
                     ${
                       isSelected
                         ? "bg-purple-500/10 text-white"
                         : "text-muted-foreground hover:bg-white/5 hover:text-white"
                     }
                   `}
                >
                  <div
                    className={`
                     w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors
                     ${isSelected ? "bg-purple-500 text-white" : "bg-white/5 group-hover:bg-white/10"}
                   `}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs mb-0.5">
                      {preset.label}
                    </div>
                  </div>
                  {isSelected && (
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </button>
              );
            })}

            <div className="my-2 h-px bg-white/5 mx-2" />

            <button
              onClick={() => setSelectedPresetId("custom")}
              className={`
                 w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group
                 ${
                   selectedPresetId === "custom"
                     ? "bg-purple-500/10 text-white"
                     : "text-muted-foreground hover:bg-white/5 hover:text-white"
                 }
               `}
            >
              <div
                className={`
                     w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors
                     ${selectedPresetId === "custom" ? "bg-purple-500 text-white" : "bg-white/5 group-hover:bg-white/10"}
                   `}
              >
                <Code className="w-4 h-4" />
              </div>
              <div className="font-medium text-xs">Custom JSON</div>
            </button>
          </div>
        </div>

        {/* Main Content: JSON Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d14]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Trigger Payload
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure the data sent to the trigger
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative group">
            <div className="absolute inset-0 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  JSON Payload
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50" />
                  <span className="text-[10px] text-green-500/80">
                    Valid JSON
                  </span>
                </div>
              </div>

              <textarea
                value={jsonContent}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck="false"
                className="
                   w-full h-[calc(100%-2rem)] bg-[#08080c] border border-white/10 rounded-xl p-4
                   text-sm font-mono text-blue-100/90 leading-relaxed resize-none
                   focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30
                   selection:bg-purple-500/20 placeholder:text-white/10
                 "
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Simulating{" "}
              <span className="text-white font-medium">{workflow.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-muted-foreground hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRunTest}
                className="bg-purple-600 hover:bg-purple-500 text-white min-w-[140px] shadow-lg shadow-purple-500/20"
              >
                <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                Run Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestModal;
