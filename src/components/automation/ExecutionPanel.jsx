/**
 * Execution Panel Component
 *
 * Shows execution logs during workflow testing.
 */

import React from "react";
import { useWorkflowStore } from "@/lib/automation/useWorkflowStore";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Copy,
  Trash2,
  Terminal,
} from "lucide-react";

const statusConfig = {
  running: {
    icon: Loader2,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.1)",
    label: "Running",
  },
  success: {
    icon: CheckCircle2,
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.1)",
    label: "Success",
  },
  error: {
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    label: "Error",
  },
};

function LogEntry({ log }) {
  const config = statusConfig[log.status] || statusConfig.running;
  const Icon = config.icon;
  const isRunning = log.status === "running";

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 animate-in slide-in-from-left-2 duration-200"
      style={{ borderLeftColor: config.color, borderLeftWidth: "2px" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: config.bg }}
      >
        <Icon
          className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`}
          style={{ color: config.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-white truncate">
            {log.nodeName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {log.message}
        </p>
      </div>
    </div>
  );
}

export function ExecutionPanel({ isOpen, onClose }) {
  const { executionState, executionLogs, clearExecutionLogs } =
    useWorkflowStore();

  if (!isOpen) return null;

  const copyLogs = () => {
    const text = executionLogs
      .map((l) => `[${l.timestamp}] ${l.nodeName}: ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const stateConfig = {
    idle: { label: "Ready", color: "text-muted-foreground" },
    running: { label: "Executing...", color: "text-purple-400" },
    success: { label: "Completed", color: "text-green-400" },
    error: { label: "Failed", color: "text-red-400" },
  };

  const state = stateConfig[executionState] || stateConfig.idle;

  return (
    <div className="absolute bottom-6 right-6 w-96 max-h-[60vh] z-50 flex flex-col pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex-1 flex flex-col bg-[#0d0d14]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Execution Logs
              </h3>
              <p className={`text-xs ${state.color}`}>{state.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={copyLogs}
              className="h-7 w-7 text-muted-foreground hover:text-white"
              title="Copy logs"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearExecutionLogs}
              className="h-7 w-7 text-muted-foreground hover:text-white"
              title="Clear logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-muted-foreground hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-80 scrollbar-hide">
          {executionLogs.length > 0 ? (
            executionLogs.map((log) => <LogEntry key={log.id} log={log} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Clock className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-sm">No execution logs yet</p>
              <p className="text-xs opacity-50">Run a test to see results</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {executionLogs.length > 0 && (
          <div className="p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {executionLogs.filter((l) => l.status === "success").length}{" "}
                succeeded
              </span>
              <span className="text-muted-foreground">
                {executionLogs.filter((l) => l.status === "error").length}{" "}
                failed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutionPanel;
