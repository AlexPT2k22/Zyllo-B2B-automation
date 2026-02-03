/**
 * Automations Builder
 *
 * Professional automation canvas with workflow store, testing, and execution feedback.
 * Inspired by Zapier, n8n, Retool, and Linear Automations.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Save,
  Power,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Loader2,
  Cloud,
  CloudOff,
  Clock
} from "lucide-react";

// Import automation engine
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import { useWorkflowStore } from "@/lib/automation/useWorkflowStore";
import "@/lib/automation/nodes"; // Auto-registers all nodes

// Import components
import { NodePicker } from "@/components/automation/NodePicker";
import { PropertyPanel } from "@/components/automation/PropertyPanel";
import { AutomationNode } from "@/components/automation/AutomationNode";
import { ExecutionPanel } from "@/components/automation/ExecutionPanel";
import { TestModal } from "@/components/automation/TestModal";
import { LogsPanel } from "@/components/automation/LogsPanel";

// Connection Arrow Component - now accepts dragOffset for real-time updates
function ConnectionArrow({ from, to, nodes, dragOffset }) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  // Apply drag offset to dragging node
  let fromX = fromNode.x;
  let fromY = fromNode.y;
  let toX = toNode.x;
  let toY = toNode.y;

  if (dragOffset?.nodeId === from) {
    fromX += dragOffset.x;
    fromY += dragOffset.y;
  }
  if (dragOffset?.nodeId === to) {
    toX += dragOffset.x;
    toY += dragOffset.y;
  }

  const startX = fromX + 140;
  const startY = fromY + 110;
  const endX = toX + 140;
  const endY = toY - 5;

  const midY = (startY + endY) / 2;

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

function Automations() {
  const canvasRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // UI state
  const [showNodePicker, setShowNodePicker] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [activeDrag, setActiveDrag] = useState(null); // Track active drag for live arrow updates

  // Connection drag state
  const [connectionDrag, setConnectionDrag] = useState(null); // { fromNodeId, startPos, currentPos }

  // Workflow store
  const {
    getCurrentWorkflow,
    updateWorkflow,
    addNode: storeAddNode,
    updateNodeConfig,
    deleteNode: storeDeleteNode,
    moveNode,
    addConnection,
    toggleActive,
    save,
    validate,
    isDirty,
    validationErrors,
    executionState,
    nodeStates,
    executionLogs,
    loadFromCloud,
    isLoading,
    isSaving,
    syncError,
  } = useWorkflowStore();

  // Auth context
  const { user } = useAuth();

  // Load workflows from cloud on mount
  useEffect(() => {
    if (user?.email) {
      loadFromCloud(user.email).then((result) => {
        if (!result.success) {
          toast.error("Failed to load automations: " + result.error);
        }
      });
    }
  }, [user?.email, loadFromCloud]);

  const workflow = getCurrentWorkflow();
  const nodes = workflow?.nodes || [];
  const connections = workflow?.connections || [];

  // Handle node drag end
  const handleDragEnd = useCallback(
    (event) => {
      const { active, delta } = event;
      setActiveDrag(null); // Clear drag state
      if (!active) return;

      const node = nodes.find((n) => n.id === active.id);
      if (node) {
        moveNode(active.id, node.x + delta.x, node.y + delta.y);
      }
    },
    [nodes, moveNode],
  );

  // Handle node drag move for real-time arrow updates
  const handleDragMove = useCallback((event) => {
    const { active, delta } = event;
    if (active) {
      setActiveDrag({ nodeId: active.id, x: delta.x, y: delta.y });
    }
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
        setSelectedNode(null);
      }
    },
    [viewport],
  );

  const handleCanvasMouseMove = useCallback(
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
    // Connection cancelation is handled by global mouseup listener
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
          handleAddNode(data.nodeType, { x, y });
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

  // Connection drag handling (drag-to-connect)
  const handleConnectionDragStart = useCallback(
    (nodeId, startPos, e) => {
      setConnectionDrag({
        fromNodeId: nodeId,
        startPos,
        currentPos: startPos,
      });

      // Add global mouse listeners
      const handleGlobalMouseMove = (e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
          const y = (e.clientY - rect.top - viewport.y) / viewport.scale;
          setConnectionDrag((prev) =>
            prev ? { ...prev, currentPos: { x, y } } : null,
          );
        }
      };

      const handleGlobalMouseUp = () => {
        setConnectionDrag(null);
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    },
    [viewport],
  );

  const handleConnectionDragEnd = useCallback(
    (targetNodeId) => {
      if (connectionDrag && connectionDrag.fromNodeId !== targetNodeId) {
        const success = addConnection(connectionDrag.fromNodeId, targetNodeId);
        if (success) {
          toast.success("Nodes connected!");
        } else {
          toast.info("Connection already exists");
        }
      }
      setConnectionDrag(null);
    },
    [connectionDrag, addConnection],
  );

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
  const handleAddNode = (nodeTypeId, position) => {
    const newNode = storeAddNode(
      nodeTypeId,
      position || { x: 300 - viewport.x, y: 200 - viewport.y },
    );
    setSelectedNode(newNode);
    toast.success(`Added ${nodeRegistry.get(nodeTypeId)?.name}`);
  };

  // Handle node selection from picker
  const handleNodePickerSelect = (nodeTypeId) => {
    handleAddNode(nodeTypeId);
    setShowNodePicker(false);
  };

  // Handle template selection - adds all nodes and connections from template
  const handleTemplateSelect = (template) => {
    if (!template || !template.nodes) return;

    // Add all nodes from template
    template.nodes.forEach((node) => {
      storeAddNode(
        node.nodeType,
        { x: node.x, y: node.y },
        node.id,
        node.config,
      );
    });

    // Add all connections from template
    template.connections.forEach((conn) => {
      addConnection(conn.from, conn.to);
    });

    // Update workflow name if template has one
    if (template.name) {
      updateWorkflow({ name: template.name });
    }

    setShowNodePicker(false);
    toast.success(`Template "${template.name}" added!`);
  };

  // Update node config
  const handleUpdateNodeConfig = (nodeId, config) => {
    updateNodeConfig(nodeId, config);
    setSelectedNode((prev) =>
      prev?.id === nodeId ? { ...prev, config } : prev,
    );
    toast.success("Node updated");
  };

  // Delete node
  const handleDeleteNode = (id) => {
    storeDeleteNode(id);
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
    toast.success("Node deleted");
  };

  // Select node
  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  // Save workflow to cloud
  const handleSave = async () => {
    const result = await save();
    if (result.success) {
      toast.success("Automation saved to cloud!");
    } else {
      toast.error(result.errors?.[0] || result.error || "Failed to save");
    }
  };

  // Toggle active
  const handleToggleActive = () => {
    const result = toggleActive();
    if (result.success) {
      toast.success(
        workflow?.isActive ? "Automation disabled" : "Automation enabled!",
      );
    } else {
      toast.error(result.errors?.[0] || "Cannot enable automation");
    }
  };

  // Open test modal
  const handleTest = () => {
    const validation = validate();
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }
    setShowTestModal(true);
    setShowExecutionPanel(true);
  };

  // Show loading screen while fetching from cloud
  if (isLoading) {
    return (
      <div className="h-screen -m-8 flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading automations...</p>
      </div>
    );
  }

  return (
    <div className="h-screen -m-8 flex flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Toolbar */}
      <div className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* Workflow Name & Status */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">
              {workflow?.name || "Untitled"}
            </h1>

            {/* Status Badge */}
            <div
              className={`
              px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1
              ${
                workflow?.isActive
                  ? "bg-green-500/20 text-green-400"
                  : isDirty
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-white/10 text-muted-foreground"
              }
            `}
            >
              {workflow?.isActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </>
              ) : isDirty ? (
                "Unsaved"
              ) : (
                "Draft"
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Toggle Node Picker */}
          <Button
            size="sm"
            variant={showNodePicker ? "default" : "outline"}
            className={`h-8 ${
              showNodePicker
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-white"
            }`}
            onClick={() => setShowNodePicker(!showNodePicker)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Node
          </Button>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>
                {validationErrors.length} issue
                {validationErrors.length > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {connectionDrag && (
            <div className="flex items-center gap-2 text-sm text-purple-400 animate-pulse">
              <span>Drag to a node to connect</span>
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

          {/* Toggle Logs Panel */}
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${showLogsPanel ? "text-purple-400" : ""}`}
            onClick={() => setShowLogsPanel(!showLogsPanel)}
            title="Execution Logs"
          >
            <Clock className="w-4 h-4" />
          </Button>

          {/* Toggle Execution Panel */}
          {executionLogs.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className={`h-8 w-8 ${showExecutionPanel ? "text-purple-400" : ""}`}
              onClick={() => setShowExecutionPanel(!showExecutionPanel)}
            >
              <Terminal className="w-4 h-4" />
            </Button>
          )}

          {/* ON/OFF Toggle */}
          <Button
            size="sm"
            variant="outline"
            className={`h-8 ${
              workflow?.isActive
                ? " text-green-400 hover:bg-transparent hover:text-green-400/50"
                : "border-white/10 text-muted-foreground hover:text-white hover:bg-transparent"
            }`}
            onClick={handleToggleActive}
          >
            <Power className="w-3.5 h-3.5 mr-1" />
            {workflow?.isActive ? "ON" : "OFF"}
          </Button>

          {/* Action Buttons */}
          <Button
            size="sm"
            variant="outline"
            className={`h-8 border-white/10 ${isDirty ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 hover:text-yellow-400/50" : "text-muted-foreground hover:bg-transparent hover:text-white"}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 mr-1" />
                Save
              </>
            )}
          </Button>

          <Button
            size="sm"
            className="h-8 bg-transparent hover:bg-transparent hover:text-purple-400"
            onClick={handleTest}
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            Test
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Logs Panel */}
        {showLogsPanel && <LogsPanel onClose={() => setShowLogsPanel(false)} />}

        {/* Node Picker Panel */}
        <NodePicker
          isOpen={showNodePicker}
          onClose={() => setShowNodePicker(false)}
          onSelectNode={handleNodePickerSelect}
          onSelectTemplate={handleTemplateSelect}
        />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`flex-1 relative overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleCanvasMouseMove}
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
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: "30px 30px",
              backgroundPosition: `${viewport.x % 30}px ${viewport.y % 30}px`,
            }}
          />

          {/* Viewport Container */}
          <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
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
                    dragOffset={activeDrag}
                  />
                ))}

                {/* Preview arrow during connection drag */}
                {connectionDrag && (
                  <g>
                    <defs>
                      <marker
                        id="preview-arrowhead"
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
                      d={`M ${connectionDrag.startPos.x} ${connectionDrag.startPos.y} 
                         C ${connectionDrag.startPos.x} ${(connectionDrag.startPos.y + connectionDrag.currentPos.y) / 2}, 
                           ${connectionDrag.currentPos.x} ${(connectionDrag.startPos.y + connectionDrag.currentPos.y) / 2}, 
                           ${connectionDrag.currentPos.x} ${connectionDrag.currentPos.y}`}
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      fill="none"
                      markerEnd="url(#preview-arrowhead)"
                      className="animate-pulse"
                    />
                  </g>
                )}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                <AutomationNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  isConnecting={connectionDrag !== null}
                  isConnectionTarget={
                    connectionDrag !== null &&
                    connectionDrag.fromNodeId !== node.id
                  }
                  executionState={nodeStates[node.id] || "idle"}
                  onSelect={handleSelectNode}
                  onDelete={handleDeleteNode}
                  onConnectionDragStart={handleConnectionDragStart}
                  onConnectionDragEnd={handleConnectionDragEnd}
                />
              ))}
            </div>
          </DndContext>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                  <Plus className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start building your automation
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Add a trigger to define when your automation runs, then add
                  actions to define what happens.
                </p>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 px-6"
                  onClick={() => setShowNodePicker(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trigger
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Property Panel */}
        {selectedNode && (
          <PropertyPanel
            nodeInstance={selectedNode}
            onUpdate={handleUpdateNodeConfig}
            onDelete={handleDeleteNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Execution Panel */}
        <ExecutionPanel
          isOpen={showExecutionPanel}
          onClose={() => setShowExecutionPanel(false)}
        />
      </div>

      {/* Test Modal */}
      <TestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </div>
  );
}

export default Automations;
