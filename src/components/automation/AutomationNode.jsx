/**
 * Automation Node Component
 *
 * Generic node renderer that reads visual properties from node definition.
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

// Icon mapping
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
  triggers: {
    accent: "#a855f7",
    bg: "rgba(168, 85, 247, 0.1)",
    border: "rgba(168, 85, 247, 0.3)",
  },
  actions: {
    accent: "#22c55e",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.3)",
  },
  conditions: {
    accent: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  transforms: {
    accent: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
  },
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
    useDraggable({
      id: node.id,
    });

  const nodeDefinition = nodeRegistry.get(node.nodeType);

  if (!nodeDefinition) {
    return null;
  }

  const Icon = iconMap[nodeDefinition.icon] || MessageSquare;
  const colors =
    categoryColors[nodeDefinition.category] || categoryColors.actions;
  const categoryLabel =
    nodeDefinition.category?.toUpperCase().slice(0, -1) || "NODE";

  // Get display content from config
  const getDisplayContent = () => {
    const config = node.config || {};

    // Try common properties in order
    if (config.message)
      return (
        config.message.substring(0, 50) +
        (config.message.length > 50 ? "..." : "")
      );
    if (config.keywords)
      return `Keywords: ${config.keywords.substring(0, 30)}...`;
    if (config.field)
      return `${config.field} ${config.operator || ""} ${config.value || ""}`;
    if (config.duration)
      return `Wait ${config.duration} ${config.unit || "seconds"}`;
    if (config.variableName) return `Set: ${config.variableName}`;

    return nodeDefinition.description;
  };

  const style = {
    position: "absolute",
    left: node.x,
    top: node.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const hasOutputs = nodeDefinition.outputs?.length > 0;
  const hasInputs =
    nodeDefinition.inputs?.length > 0 || nodeDefinition.type !== "trigger";

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div
        onClick={() => onSelect(node)}
        className={`
          w-[280px] rounded-xl overflow-hidden
          bg-[#0d0d14]
          border border-white/10 shadow-xl
          transition-all duration-200
          ${isDragging ? "shadow-2xl" : "hover:shadow-lg"}
          ${isSelected ? "ring-2" : ""}
          ${isConnecting ? "ring-2 ring-purple-500/50" : ""}
        `}
        style={{
          boxShadow: isDragging
            ? `0 25px 50px -12px ${colors.accent}40`
            : isSelected
              ? `0 10px 30px -5px ${colors.accent}30`
              : undefined,
          ringColor: isSelected ? colors.accent : undefined,
        }}
      >
        {/* Color accent bar */}
        <div className="h-1" style={{ backgroundColor: colors.accent }} />

        {/* Node Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase block">
                {categoryLabel}
              </span>
              <span className="text-sm font-medium text-white">
                {nodeDefinition.name}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Node Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-white/80 font-mono leading-relaxed">
            {getDisplayContent()}
          </p>
        </div>

        {/* Input Port (top) */}
        {hasInputs && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onEndConnection(node.id)}
              className="w-6 h-6 rounded-full border-2 border-[#0d0d14] flex items-center justify-center 
                hover:scale-110 transition-all cursor-crosshair"
              style={{
                backgroundColor: isConnecting
                  ? colors.accent
                  : `${colors.accent}80`,
              }}
              title="Connect here"
            >
              <Circle className="w-2 h-2 text-white" />
            </button>
          </div>
        )}

        {/* Output Port (bottom) */}
        {hasOutputs && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onStartConnection(node.id)}
              className="w-6 h-6 rounded-full border-2 border-[#0d0d14] flex items-center justify-center 
                hover:scale-110 transition-transform cursor-crosshair"
              style={{ backgroundColor: colors.accent }}
              title="Drag to connect"
            >
              <Circle className="w-2 h-2 text-white fill-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationNode;
