/**
 * Node Picker Component
 *
 * A searchable, categorized palette for selecting nodes to add to the canvas.
 * Zyllo Style: Floating Glass Panel
 */

import React, { useState, useMemo } from "react";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
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

// Category metadata
const categoryMeta = {
  triggers: { label: "Triggers", color: "#a855f7" },
  actions: { label: "Actions", color: "#22c55e" },
  conditions: { label: "Conditions", color: "#f59e0b" },
  transforms: { label: "Transforms", color: "#3b82f6" },
};

function NodePickerItem({ node, onSelect, onDragStart }) {
  const Icon = iconMap[node.icon] || MessageSquare;
  const category = categoryMeta[node.category] || categoryMeta.actions;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={() => onSelect(node)}
      className="group relative flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing
        hover:bg-white/5 border border-transparent hover:border-white/5
        transition-all duration-200"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0
          bg-opacity-10 transition-colors duration-200"
        style={{
          backgroundColor: `${category.color}15`,
        }}
      >
        <Icon
          className="w-5 h-5 transition-transform group-hover:scale-110 duration-200"
          style={{ color: category.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90 group-hover:text-white truncate">
          {node.name}
        </p>
        <p className="text-xs text-muted-foreground truncate opacity-80 group-hover:opacity-100">
          {node.description}
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-white/20" />
      </div>

      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 20px ${category.color}05`,
        }}
      />
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
    <div className="mb-4 last:mb-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 mb-1 text-left 
          hover:bg-white/5 rounded-lg transition-colors group"
      >
        <span
          className={`p-0.5 rounded transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
        >
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white" />
        </span>
        <span
          className="text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="text-[10px] text-white/20 ml-auto font-mono bg-white/5 px-1.5 py-0.5 rounded">
          {nodes.length}
        </span>
      </button>

      <div
        className={`space-y-1 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "opacity-100 max-h-[1000px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {nodes.map((node) => (
          <NodePickerItem
            key={node.id}
            node={node}
            onSelect={onSelect}
            onDragStart={onDragStart}
          />
        ))}
      </div>
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

  const filteredNodes = useMemo(() => {
    const nodes = nodeRegistry.getAll();
    if (!searchQuery.trim()) return nodes;
    return nodeRegistry.search(searchQuery);
  }, [searchQuery]);

  const nodesByCategory = useMemo(() => {
    const grouped = {
      triggers: [],
      actions: [],
      conditions: [],
      transforms: [],
    };
    for (const node of filteredNodes) {
      if (grouped[node.category]) grouped[node.category].push(node);
    }
    return grouped;
  }, [filteredNodes]);

  if (!isOpen) return null;

  return (
    <div className="absolute left-6 top-6 bottom-6 w-80 z-50 flex flex-col pointer-events-auto animate-in slide-in-from-left-4 duration-300">
      {/* Glass Container */}
      <div className="flex-1 flex flex-col bg-[#0d0d14]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Add Node</h2>
              <p className="text-xs text-muted-foreground">
                Drag nodes to canvas
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 text-muted-foreground hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="w-full h-9 pl-9 pr-3 bg-black/20 border border-white/10 rounded-xl
                text-sm text-white placeholder:text-muted-foreground/50
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30
                transition-all duration-200"
              autoFocus
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {Object.entries(nodesByCategory).map(
            ([category, nodes]) =>
              nodes.length > 0 && (
                <NodeCategory
                  key={category}
                  category={category}
                  nodes={nodes}
                  onSelect={(node) => onSelectNode(node.id)}
                  onDragStart={(e, node) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({
                        type: "new-node",
                        nodeType: node.id,
                      }),
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  isExpanded={expandedCategories[category]}
                  onToggle={() =>
                    setExpandedCategories((p) => ({
                      ...p,
                      [category]: !p[category],
                    }))
                  }
                />
              ),
          )}

          {filteredNodes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center p-4">
              <Search className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-sm">No nodes found</p>
              <p className="text-xs opacity-50">
                Try searching for triggers or actions
              </p>
            </div>
          )}
        </div>

        {/* Footer Gradient */}
        <div className="h-4 bg-gradient-to-t from-[#0d0d14]/50 to-transparent pointer-events-none shrink-0" />
      </div>
    </div>
  );
}

export default NodePicker;
