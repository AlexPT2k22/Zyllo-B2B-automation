import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Terminal,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logService } from "@/lib/automation/logService";
import { useWorkflowStore } from "@/lib/automation/useWorkflowStore";

export function LogsPanel({ onClose }) {
  const { getCurrentWorkflow } = useWorkflowStore();
  const workflow = getCurrentWorkflow();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Fetch logs on mount
  useEffect(() => {
    loadLogs();
  }, [workflow?.id]);

  const loadLogs = async () => {
    if (!workflow?.id) return;
    setIsLoading(true);
    const result = await logService.fetchLogs(workflow.id);
    if (result.success) {
      setLogs(result.data);
    }
    setIsLoading(false);
  };

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (!workflow) return null;

  return (
    <div className="absolute right-0 top-14 bottom-0 w-96 bg-[#0a0a0f] border-l border-white/10 flex flex-col z-20 shadow-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">
            Execution History
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={loadLogs}
            className="h-7 w-7 text-muted-foreground hover:text-white"
            title="Refresh logs"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-2 opacity-50" />
              <p className="text-xs">Loading history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center">
              <Terminal className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm font-medium">No executions yet</p>
              <p className="text-xs opacity-50 mt-1 max-w-[200px]">
                Run a test or trigger the automation to see logs here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                  expandedLogId === log.id
                    ? "bg-white/5 border-white/10"
                    : "bg-black/20 border-white/5 hover:border-white/10"
                }`}
              >
                <div
                  className="p-3 flex items-start gap-3 cursor-pointer"
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="mt-0.5">
                    {log.metadata.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          log.metadata.status === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {log.metadata.status === "success"
                          ? "Success"
                          : "Failed"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.metadata.duration_ms || 0}ms
                      </div>
                      {/* Trigger info could go here */}
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      expandedLogId === log.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Expanded Details */}
                {expandedLogId === log.id && (
                  <div className="px-3 pb-3 pt-0 border-t border-white/5 mt-1">
                    {/* Error Message */}
                    {log.metadata.error_message && (
                      <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded p-2 text-xs text-red-300 font-mono break-all">
                        {log.metadata.error_message}
                      </div>
                    )}

                    {/* Step Execution Summary */}
                    {log.metadata.execution_details &&
                      log.metadata.execution_details.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                            Steps Executed
                          </p>
                          {log.metadata.execution_details.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  step.status === "success"
                                    ? "bg-green-500"
                                    : step.status === "error"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }`}
                              />
                              <span className="text-white/80">
                                {step.nodeName || step.nodeId}
                              </span>
                              {step.status === "error" && (
                                <span className="text-red-400 text-[10px] ml-auto">
                                  Error
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Raw Data Toggle (Future) */}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
