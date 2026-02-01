/**
 * Automation Node Component
 *
 * Generic node renderer that reads visual properties from node definition.
 * Zyllo Style: Glassmorphism Card
 */

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import {
  GripVertical,
  Trash2,
  Circle,
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

// Simplified category colors for logic
const categoryColors = {
  triggers: "#a855f7",
  actions: "#22c55e",
  conditions: "#f59e0b",
  transforms: "#3b82f6",
};

export function AutomationNode({
  node,
  isSelected,
  isConnecting,
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
        zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
        opacity: isDragging ? 0.9 : 1,
        // Disable touch actions to prevent native scrolling while dragging
        touchAction: "none",
      }}
      className="group"
      // Apply drag listeners to the entire container
      {...attributes}
      {...listeners}
      onDoubleClick={(e) => {
        // Prevent double click from triggering drag issues if any
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <div
        className={`
          relative w-[280px] rounded-2xl overflow-visible transition-all duration-300 cursor-grab active:cursor-grabbing
          ${
            isSelected
              ? "bg-[#13131a] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] ring-1"
              : "bg-[#0d0d14] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-white/5 hover:border-white/10 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]"
          }
        `}
        style={{
          boxShadow: isSelected
            ? `0 0 0 1px ${accentColor}, 0 20px 60px -10px ${accentColor}20`
            : undefined,
        }}
      >
        {/* Glow effect on hover/select */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${accentColor}10, transparent 70%)`,
            opacity: isSelected ? 1 : 0,
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 p-3 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {categoryLabel}
              </span>
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

        {/* Delete Button (Floating) - Stop propagation to prevent drag */}
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

        {/* Connection Points - Stop propagation to prevent drag */}
        {hasInputs && (
          <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-20">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEndConnection(node.id);
              }}
              className={`
                group/port w-7 h-7 rounded-full bg-[#0d0d14] border flex items-center justify-center 
                transition-all duration-200 shadow-lg relative cursor-crosshair
                ${
                  isConnecting
                    ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "border-white/20 hover:border-white hover:scale-110"
                }
              `}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${isConnecting ? "bg-white" : "bg-white/40 group-hover/port:bg-white"}`}
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
              className="group/port w-7 h-7 rounded-full bg-[#0d0d14] border border-white/20 hover:border-[var(--color)] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg relative cursor-crosshair"
              style={{ "--color": accentColor }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/40 transition-colors duration-200 group-hover/port:bg-[var(--color)]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationNode;
