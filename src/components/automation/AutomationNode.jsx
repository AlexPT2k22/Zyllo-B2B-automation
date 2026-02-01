/**
 * Automation Node Component
 *
 * Generic node renderer that reads visual properties from node definition.
 * Zyllo Style: Glassmorphism Card with Execution State
 */

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import {
  Trash2,
  MessageSquare,
  UserPlus,
  AtSign,
  MessageCircle,
  Send,
  Mail,
  Tag,
  Bell,
  GitBranch,
  Clock,
  Variable,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const iconMap = {
  MessageSquare,
  UserPlus,
  AtSign,
  MessageCircle,
  Send,
  Mail,
  Tag,
  Bell,
  GitBranch,
  Clock,
  Variable,
};

// Category colors
const categoryColors = {
  triggers: "#a855f7",
  actions: "#22c55e",
  conditions: "#f59e0b",
  transforms: "#3b82f6",
};

// Execution state styles
const executionStyles = {
  idle: { border: null, glow: null },
  running: { border: "#a855f7", glow: "0 0 30px rgba(168, 85, 247, 0.4)" },
  success: { border: "#22c55e", glow: "0 0 20px rgba(34, 197, 94, 0.3)" },
  error: { border: "#ef4444", glow: "0 0 20px rgba(239, 68, 68, 0.3)" },
};

export function AutomationNode({
  node,
  isSelected,
  isConnecting,
  executionState = "idle",
  onSelect,
  onDelete,
  onStartConnection,
  onEndConnection,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: node.id });
  const nodeDefinition = nodeRegistry.get(node.nodeType);
  if (!nodeDefinition) return null;

  const Icon = iconMap[nodeDefinition.icon] || MessageSquare;
  const accentColor = categoryColors[nodeDefinition.category] || "#a855f7";
  const categoryLabel =
    nodeDefinition.category?.slice(0, -1).toUpperCase() || "NODE";
  const execStyle = executionStyles[executionState] || executionStyles.idle;

  const getDisplayContent = () => {
    const config = node.config || {};
    if (config.message)
      return (
        config.message.substring(0, 40) +
        (config.message.length > 40 ? "..." : "")
      );
    if (config.keywords)
      return `Keywords: ${config.keywords.substring(0, 25)}...`;
    if (config.field)
      return `${config.field} ${config.operator} ${config.value}`;
    if (config.duration) return `Wait ${config.duration} ${config.unit}`;
    if (config.variableName) return `Set: ${config.variableName}`;
    return nodeDefinition.description;
  };

  const hasOutputs = nodeDefinition.outputs?.length > 0;
  const hasInputs =
    nodeDefinition.inputs?.length > 0 || nodeDefinition.type !== "trigger";

  // Get execution indicator
  const getExecutionIndicator = () => {
    switch (executionState) {
      case "running":
        return <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        zIndex: isDragging
          ? 1000
          : isSelected
            ? 100
            : executionState !== "idle"
              ? 50
              : 1,
        opacity: isDragging ? 0.9 : 1,
        touchAction: "none",
      }}
      className="group"
      {...attributes}
      {...listeners}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <div
        className={`
          relative w-[280px] rounded-2xl overflow-visible cursor-grab active:cursor-grabbing
          ${executionState === "running" ? "animate-pulse" : ""}
          ${
            isSelected
              ? "bg-[#13131a] ring-1"
              : "bg-[#0d0d14] border border-white/5 hover:border-white/10"
          }
        `}
        style={{
          boxShadow:
            execStyle.glow ||
            (isSelected
              ? `0 0 0 1px ${accentColor}, 0 20px 60px -10px ${accentColor}20`
              : "0 10px 30px -10px rgba(0,0,0,0.5)"),
          borderColor: execStyle.border || undefined,
          transition: "all 0.3s ease",
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at top right, ${execStyle.border || accentColor}10, transparent 70%)`,
            opacity: isSelected || executionState !== "idle" ? 1 : 0,
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-2 p-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner relative">
            <Icon className="w-5 h-5" style={{ color: accentColor }} />

            {/* Execution state indicator overlay */}
            {executionState !== "idle" && (
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#0d0d14] rounded-full">
                {getExecutionIndicator()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {categoryLabel}
              </span>
              {executionState === "running" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 animate-pulse">
                  Running
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white truncate leading-none pb-0.5">
              {nodeDefinition.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 pb-3 relative z-10">
          <div className="p-2.5 bg-black/20 rounded-lg border border-white/5">
            <p className="text-xs text-white/70 font-mono leading-relaxed">
              {getDisplayContent()}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-[#1a1a20] border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg scale-75 group-hover:scale-100 z-20 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Connection Points */}
        {hasInputs && (
          <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-20">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEndConnection(node.id);
              }}
              className={`
                group/port w-7 h-7 rounded-full flex items-center justify-center 
                transition-all duration-200 shadow-lg relative cursor-crosshair
                ${
                  isConnecting
                    ? "border-white"
                    : "border-white hover:border-white"
                }
              `}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${isConnecting ? "bg-white" : "bg-white transition-colors duration-200 group-hover/port:bg-purple-400"}`}
              />
            </button>
          </div>
        )}

        {hasOutputs && (
          <div className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 z-20">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onStartConnection(node.id);
              }}
              className="group/port w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg relative cursor-crosshair"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white transition-colors duration-200 group-hover/port:bg-purple-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationNode;
