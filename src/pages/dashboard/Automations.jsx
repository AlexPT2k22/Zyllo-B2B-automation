/**
 * Automations Builder
 *
 * Professional automation canvas with Node Registry, Node Picker, and Property Panel.
 * Inspired by Zapier, n8n, Retool, and Linear Automations.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Save,
  Undo,
  Redo,
  Settings,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";

// Import automation engine
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import "@/lib/automation/nodes"; // Auto-registers all nodes

// Import components
import { NodePicker } from "@/components/automation/NodePicker";
import { PropertyPanel } from "@/components/automation/PropertyPanel";
import { AutomationNode } from "@/components/automation/AutomationNode";

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

  // Get color based on source node type
  const nodeDef = nodeRegistry.get(fromNode.nodeType);
  const color = nodeDef?.color || "#a855f7";

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
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
        <linearGradient
          id={`gradient-${from}-${to}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
        stroke={`url(#gradient-${from}-${to})`}
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrowhead-${from}-${to})`}
      />
    </g>
  );
}

// Initial demo workflow
const INITIAL_NODES = [
  {
    id: "trigger-demo-1",
    nodeType: "keyword_match",
    x: 200,
    y: 100,
    config: {
      keywords: "price, cost, how much",
      matchType: "contains",
      caseSensitive: false,
    },
  },
  {
    id: "action-demo-1",
    nodeType: "send_reply",
    x: 200,
    y: 350,
    config: {
      message:
        "Hi {{username}}! Our product costs €50. Would you like more details?",
      delay: 2,
    },
  },
];

const INITIAL_CONNECTIONS = [{ from: "trigger-demo-1", to: "action-demo-1" }];

function Automations() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // UI state
  const [showNodePicker, setShowNodePicker] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);

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
        setSelectedNode(null); // Deselect on canvas click
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

  // Handle drop from Node Picker
  const handleCanvasDrop = useCallback(
    (e) => {
      e.preventDefault();

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));

        if (data.type === "new-node") {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
          const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

          addNode(data.nodeType, { x, y });
        }
      } catch (err) {
        // Not a valid drop
      }
    },
    [viewport],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Connection handling
  const handleStartConnection = (nodeId) => {
    setConnectingFrom(nodeId);
    toast.info("Click on another node to connect");
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
  const addNode = (nodeTypeId, position) => {
    const newNode = nodeRegistry.createInstance(
      nodeTypeId,
      position || {
        x: 300 - viewport.x,
        y: 200 - viewport.y,
      },
    );

    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
    toast.success(`Added ${nodeRegistry.get(nodeTypeId)?.name}`);
  };

  // Handle node selection from picker
  const handleNodePickerSelect = (nodeTypeId) => {
    addNode(nodeTypeId);
    setShowNodePicker(false);
  };

  // Update node config
  const updateNodeConfig = (nodeId, config) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, config } : node)),
    );

    // Update selected node reference
    setSelectedNode((prev) =>
      prev?.id === nodeId ? { ...prev, config } : prev,
    );

    toast.success("Node updated");
  };

  // Delete node
  const deleteNode = (id) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));

    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }

    toast.success("Node deleted");
  };

  // Select node
  const handleSelectNode = (node) => {
    setSelectedNode(node);
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

          {/* Toggle Node Picker */}
          <Button
            size="sm"
            variant={showNodePicker ? "default" : "outline"}
            className={`h-8 ${
              showNodePicker
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
            }`}
            onClick={() => setShowNodePicker(!showNodePicker)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Node
          </Button>

          {connectingFrom && (
            <div className="flex items-center gap-2 text-sm text-purple-400 animate-pulse">
              <span>Connecting... Click a node</span>
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
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-2">
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

          <div className="h-6 w-px bg-white/10" />

          {/* Action Buttons */}
          <Button size="sm" variant="outline" className="h-8 border-white/10">
            <Save className="w-3.5 h-3.5 mr-1" />
            Save
          </Button>
          <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
            <Play className="w-3.5 h-3.5 mr-1" />
            Test
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Node Picker Panel */}
        <NodePicker
          isOpen={showNodePicker}
          onClose={() => setShowNodePicker(false)}
          onSelectNode={handleNodePickerSelect}
        />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`flex-1 relative overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDrop={handleCanvasDrop}
          onDragOver={handleDragOver}
          style={{
            marginLeft: showNodePicker ? "320px" : "0",
            marginRight: selectedNode ? "320px" : "0",
            transition: "margin 0.2s ease-in-out",
          }}
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
          <DndContext onDragEnd={handleDragEnd}>
            <div
              className="absolute"
              style={{
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
                transformOrigin: "0 0",
              }}
            >
              {/* Connection Arrows */}
              <svg
                className="absolute top-0 left-0 w-[4000px] h-[4000px] pointer-events-none"
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
                <AutomationNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  isConnecting={connectingFrom !== null}
                  onSelect={handleSelectNode}
                  onDelete={deleteNode}
                  onStartConnection={handleStartConnection}
                  onEndConnection={handleEndConnection}
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
                  Click "Add Node" to get started
                </p>
                <Button
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={() => setShowNodePicker(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Node
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Property Panel */}
        {selectedNode && (
          <PropertyPanel
            nodeInstance={selectedNode}
            onUpdate={updateNodeConfig}
            onDelete={deleteNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Automations;
