/**
 * Execution Panel Component
 *
 * Shows execution logs during workflow testing.
 * Zyllo Style: Floating Glass Panel
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
  Activity,
  ArrowRight,
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
    <div className="group relative flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 border border-white/5 transition-all duration-200">
      {/* Status Bar */}

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-1.5"
        style={{ backgroundColor: config.bg }}
      >
        <Icon
          className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`}
          style={{ color: config.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white/90 truncate">
            {log.nodeName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono shrink-0 opacity-60">
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate group-hover:whitespace-normal group-hover:text-white/70 transition-colors">
          {log.message}
        </p>

        {log.result && (
          <div className="mt-2 text-[10px] font-mono p-2 rounded bg-black/40 border border-white/5 text-emerald-400 overflow-hidden">
            {JSON.stringify(log.result).substring(0, 50)}
            {JSON.stringify(log.result).length > 50 && "..."}
          </div>
        )}
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
    idle: {
      label: "Ready",
      color: "text-muted-foreground",
      dot: "bg-white/20",
    },
    running: {
      label: "Executing...",
      color: "text-purple-400",
      dot: "bg-purple-500 animate-pulse",
    },
    success: {
      label: "Completed",
      color: "text-green-400",
      dot: "bg-green-500",
    },
    error: { label: "Failed", color: "text-red-400", dot: "bg-red-500" },
  };

  const state = stateConfig[executionState] || stateConfig.idle;

  return (
    <div className="absolute bottom-6 right-6 w-96 max-h-[500px] z-50 flex flex-col pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      {/* Glass Container */}
      <div className="flex-1 flex flex-col bg-[#0d0d14]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 relative">
          {executionState === "running" && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-purple-500 animate-[loading_2s_ease-in-out_infinite] w-full" />
          )}

          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${state.dot}`} />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                Execution Logs
              </h3>
              <p className={`text-[10px] font-medium ${state.color}`}>
                {state.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={copyLogs}
              className="h-6 w-6 text-muted-foreground hover:text-white rounded-lg hover:bg-white/10"
              title="Copy logs"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearExecutionLogs}
              className="h-6 w-6 text-muted-foreground hover:text-white rounded-lg hover:bg-white/10"
              title="Clear logs"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 text-muted-foreground hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-80 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
          {executionLogs.length > 0 ? (
            executionLogs.map((log) => <LogEntry key={log.id} log={log} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Terminal className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-sm font-medium">Ready to run</p>
              <p className="text-xs opacity-50 mt-1 max-w-[150px] text-center">
                Click Test to start execution
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {executionLogs.length > 0 && (
          <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                {executionLogs.filter((l) => l.status === "success").length} OK
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                {executionLogs.filter((l) => l.status === "error").length} Err
              </span>
            </div>

            {executionLogs.length > 0 && (
              <span>
                Time:{" "}
                {new Date(
                  executionLogs[executionLogs.length - 1].timestamp,
                ).getTime() - new Date(executionLogs[0].timestamp).getTime()}
                ms
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutionPanel;
