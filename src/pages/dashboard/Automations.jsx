import React, { useState, useRef, useCallback } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MessageSquare,
  Tag,
  Bell,
  Send,
  GripVertical,
  Trash2,
  X,
  Circle,
} from "lucide-react";

// Node types configuration
const NODE_TYPES = {
  triggers: [
    { id: "keyword", label: "Keyword Match", icon: MessageSquare },
    { id: "new_follower", label: "New Follower", icon: MessageSquare },
    { id: "story_mention", label: "Story Mention", icon: MessageSquare },
  ],
  actions: [
    { id: "send_reply", label: "Send Reply", icon: Send },
    { id: "add_tag", label: "Add Tag", icon: Tag },
    { id: "notify", label: "Notify Team", icon: Bell },
  ],
};

// Initial demo nodes
const INITIAL_NODES = [
  {
    id: "trigger-1",
    type: "trigger",
    nodeType: "keyword",
    label: "TRIGGER",
    content: 'If message contains "price"',
    x: 200,
    y: 150,
  },
  {
    id: "action-1",
    type: "action",
    nodeType: "send_reply",
    label: "ACTION",
    content: 'Reply "It costs €50..."',
    x: 200,
    y: 380,
  },
];

// Draggable Node Component
function DraggableNode({
  node,
  onDelete,
  onStartConnection,
  onEndConnection,
  isConnecting,
  onDoubleClick,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: node.id,
    });

  const style = {
    position: "absolute",
    left: node.x,
    top: node.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div
        onDoubleClick={() => onDoubleClick(node)}
        className={`
          w-[280px] rounded-xl overflow-hidden
          bg-[#0d0d14] border-l-4 border-l-purple-500
          border border-white/10 shadow-xl
          transition-all duration-200
          ${isDragging ? "shadow-2xl shadow-purple-500/20" : "hover:shadow-lg hover:shadow-purple-500/10"}
          ${isConnecting ? "ring-2 ring-purple-500/50" : ""}
        `}
      >
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
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {node.label}
            </span>
          </div>
          <button
            onClick={() => onDelete(node.id)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Node Content */}
        <div className="px-4 py-4">
          <p className="text-sm text-white font-medium">{node.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Double-click to edit
          </p>
        </div>

        {/* Connection Points */}
        {node.type === "trigger" && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onStartConnection(node.id)}
              className="w-6 h-6 rounded-full bg-purple-500 border-2 border-[#0d0d14] flex items-center justify-center hover:scale-110 transition-transform cursor-crosshair"
              title="Drag to connect"
            >
              <Circle className="w-2 h-2 text-white fill-white" />
            </button>
          </div>
        )}
        {node.type === "action" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onEndConnection(node.id)}
              className="w-6 h-6 rounded-full bg-purple-500/50 border-2 border-[#0d0d14] flex items-center justify-center hover:bg-purple-500 hover:scale-110 transition-all cursor-crosshair"
              title="Connect here"
            >
              <Circle className="w-2 h-2 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Connection Arrow Component
function ConnectionArrow({ from, to, nodes }) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  const startX = fromNode.x + 140;
  const startY = fromNode.y + 110;
  const endX = toNode.x + 140;
  const endY = toNode.y - 5;

  const midY = (startY + endY) / 2;

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${from}-${to}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
        </marker>
      </defs>
      <path
        d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
        stroke="#a855f7"
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrowhead-${from}-${to})`}
      />
    </g>
  );
}

// Edit Modal Component
function EditModal({ node, onClose, onSave }) {
  const [content, setContent] = useState(node.content);

  const handleSave = () => {
    onSave(node.id, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d0d14] border border-white/10 rounded-xl w-[400px] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Edit {node.label}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Condition / Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Enter your condition or message..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Automations() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState([
    { from: "trigger-1", to: "action-1" },
  ]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [editingNode, setEditingNode] = useState(null);

  // Handle node drag end
  const handleDragEnd = useCallback((event) => {
    const { active, delta } = event;
    if (!active) return;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === active.id
          ? { ...node, x: node.x + delta.x, y: node.y + delta.y }
          : node,
      ),
    );
    setActiveId(null);
  }, []);

  // Handle canvas panning
  const handleMouseDown = useCallback(
    (e) => {
      if (
        e.target === canvasRef.current ||
        e.target.classList.contains("canvas-grid")
      ) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      }
    },
    [viewport],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isPanning) {
        setViewport((prev) => ({
          ...prev,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        }));
      }
    },
    [isPanning, panStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Connection handling
  const handleStartConnection = (nodeId) => {
    setConnectingFrom(nodeId);
    toast.info("Click on an Action node to connect");
  };

  const handleEndConnection = (nodeId) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      // Check if connection already exists
      const exists = connections.some(
        (c) => c.from === connectingFrom && c.to === nodeId,
      );
      if (!exists) {
        setConnections((prev) => [
          ...prev,
          { from: connectingFrom, to: nodeId },
        ]);
        toast.success("Nodes connected!");
      } else {
        toast.info("Connection already exists");
      }
    }
    setConnectingFrom(null);
  };

  // Edit node
  const handleEditNode = (nodeId, newContent) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, content: newContent } : node,
      ),
    );
    toast.success("Node updated");
  };

  // Zoom controls
  const zoomIn = () =>
    setViewport((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }));
  const zoomOut = () =>
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5),
    }));
  const resetView = () => setViewport({ x: 0, y: 0, scale: 1 });

  // Add new node
  const addNode = (type, nodeType) => {
    const config = NODE_TYPES[type === "trigger" ? "triggers" : "actions"].find(
      (n) => n.id === nodeType,
    );
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      nodeType,
      label: type.toUpperCase(),
      content: `${config?.label || type} - Double-click to edit`,
      x: 300 - viewport.x,
      y: type === "trigger" ? 150 - viewport.y : 380 - viewport.y,
    };
    setNodes((prev) => [...prev, newNode]);
    toast.success(`Added new ${type}`);
  };

  // Delete node
  const deleteNode = (id) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    toast.success("Node deleted");
  };

  return (
    <div className="h-screen -m-8 flex flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Toolbar */}
      <div className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">
            Automations Builder
          </h1>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              onClick={() => addNode("trigger", "keyword")}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Trigger
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              onClick={() => addNode("action", "send_reply")}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Action
            </Button>
          </div>
          {connectingFrom && (
            <div className="flex items-center gap-2 text-sm text-purple-400 animate-pulse">
              <span>Connecting... Click an Action node</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConnectingFrom(null)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(viewport.scale * 100)}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={resetView}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Background */}
        <div
          className="canvas-grid absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)
            `,
            backgroundSize: "30px 30px",
            backgroundPosition: `${viewport.x % 30}px ${viewport.y % 30}px`,
          }}
        />

        {/* Viewport Container */}
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={(e) => setActiveId(e.active?.id)}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Connection Arrows */}
            <svg
              className="absolute top-0 left-0 w-[2000px] h-[2000px] pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {connections.map((conn) => (
                <ConnectionArrow
                  key={`${conn.from}-${conn.to}`}
                  from={conn.from}
                  to={conn.to}
                  nodes={nodes}
                />
              ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <DraggableNode
                key={node.id}
                node={node}
                onDelete={deleteNode}
                onStartConnection={handleStartConnection}
                onEndConnection={handleEndConnection}
                isConnecting={connectingFrom !== null}
                onDoubleClick={setEditingNode}
              />
            ))}
          </div>
        </DndContext>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No automations yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a trigger to get started
              </p>
              <Button
                className="bg-purple-500 hover:bg-purple-600"
                onClick={() => addNode("trigger", "keyword")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Trigger
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingNode && (
        <EditModal
          node={editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleEditNode}
        />
      )}
    </div>
  );
}

export default Automations;
