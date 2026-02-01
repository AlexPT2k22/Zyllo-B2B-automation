/**
 * Node Picker Component
 *
 * A searchable, categorized palette for selecting nodes to add to the canvas.
 */

import React, { useState, useMemo } from "react";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import { NODE_CATEGORIES } from "@/lib/automation/types";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronDown,
  ChevronRight,
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
  X,
  Plus,
  GripVertical,
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

// Category metadata with enhanced styling
const categoryMeta = {
  triggers: {
    label: "Triggers",
    description: "Start your automation",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
  },
  actions: {
    label: "Actions",
    description: "Perform operations",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
  },
  conditions: {
    label: "Conditions",
    description: "Add logic & branching",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  transforms: {
    label: "Transforms",
    description: "Modify & delay",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
};

function NodePickerItem({ node, onSelect, onDragStart }) {
  const Icon = iconMap[node.icon] || MessageSquare;
  const category = categoryMeta[node.category] || categoryMeta.actions;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={() => onSelect(node)}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
        bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10
        transition-all duration-150 group"
      style={{ "--node-color": category.color }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.bgColor }}
      >
        <Icon className="w-4 h-4" style={{ color: category.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{node.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {node.description}
        </p>
      </div>
      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-50 shrink-0" />
    </div>
  );
}

function NodeCategory({
  category,
  nodes,
  onSelect,
  onDragStart,
  isExpanded,
  onToggle,
}) {
  const meta = categoryMeta[category] || {};

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <span
          className="text-xs font-bold tracking-wider uppercase"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {nodes.length}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-1 mt-1 pl-2">
          {nodes.map((node) => (
            <NodePickerItem
              key={node.id}
              node={node}
              onSelect={onSelect}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function NodePicker({ onSelectNode, onClose, isOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    triggers: true,
    actions: true,
    conditions: true,
    transforms: true,
  });

  // Get all nodes from registry
  const allNodes = useMemo(() => nodeRegistry.getAll(), []);

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return allNodes;
    return nodeRegistry.search(searchQuery);
  }, [allNodes, searchQuery]);

  // Group by category
  const nodesByCategory = useMemo(() => {
    const grouped = {
      triggers: [],
      actions: [],
      conditions: [],
      transforms: [],
    };

    for (const node of filteredNodes) {
      if (grouped[node.category]) {
        grouped[node.category].push(node);
      }
    }

    return grouped;
  }, [filteredNodes]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (e, node) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "new-node",
        nodeType: node.id,
      }),
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleSelect = (node) => {
    onSelectNode(node.id);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#0d0d14] border-r border-white/10 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="font-semibold text-white">Add Node</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full h-9 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg
              text-sm text-white placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(nodesByCategory).map(
          ([category, nodes]) =>
            nodes.length > 0 && (
              <NodeCategory
                key={category}
                category={category}
                nodes={nodes}
                onSelect={handleSelect}
                onDragStart={handleDragStart}
                isExpanded={expandedCategories[category]}
                onToggle={() => toggleCategory(category)}
              />
            ),
        )}

        {filteredNodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No nodes found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-white/5 text-xs text-muted-foreground text-center">
        Click to add • Drag to position
      </div>
    </div>
  );
}

export default NodePicker;
