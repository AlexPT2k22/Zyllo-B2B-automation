/**
 * Workflow Store - Zustand
 *
 * State management for automations with persistence.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nodeRegistry } from "./nodeRegistry";
import { automationEngine } from "./engine";

// Generate unique ID
const generateId = () =>
  `workflow-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Default empty workflow
const createEmptyWorkflow = () => ({
  id: generateId(),
  name: "Untitled Automation",
  isActive: false,
  nodes: [],
  connections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Demo workflow for first time
const createDemoWorkflow = () => ({
  id: "demo-workflow",
  name: "Welcome Automation",
  isActive: false,
  nodes: [
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
  ],
  connections: [{ from: "trigger-demo-1", to: "action-demo-1" }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useWorkflowStore = create(
  persist(
    (set, get) => ({
      // State
      workflows: [createDemoWorkflow()],
      currentWorkflowId: "demo-workflow",
      isDirty: false,
      validationErrors: [],

      // Execution state
      executionState: "idle", // idle | running | success | error
      executionLogs: [],
      nodeStates: {}, // { nodeId: 'idle' | 'running' | 'success' | 'error' }

      // Getters
      getCurrentWorkflow: () => {
        const state = get();
        return (
          state.workflows.find((w) => w.id === state.currentWorkflowId) || null
        );
      },

      // Actions
      setCurrentWorkflow: (id) =>
        set({ currentWorkflowId: id, isDirty: false }),

      createWorkflow: () => {
        const newWorkflow = createEmptyWorkflow();
        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
          currentWorkflowId: newWorkflow.id,
          isDirty: false,
        }));
        return newWorkflow.id;
      },

      deleteWorkflow: (id) => {
        set((state) => {
          const remaining = state.workflows.filter((w) => w.id !== id);
          const newCurrentId = remaining.length > 0 ? remaining[0].id : null;
          return {
            workflows: remaining,
            currentWorkflowId:
              state.currentWorkflowId === id
                ? newCurrentId
                : state.currentWorkflowId,
          };
        });
      },

      updateWorkflow: (updates) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.currentWorkflowId
              ? { ...w, ...updates, updatedAt: new Date().toISOString() }
              : w,
          ),
          isDirty: true,
        }));
      },

      // Node operations
      addNode: (nodeTypeId, position) => {
        const newNode = nodeRegistry.createInstance(nodeTypeId, position);
        get().updateWorkflow({
          nodes: [...(get().getCurrentWorkflow()?.nodes || []), newNode],
        });
        return newNode;
      },

      updateNode: (nodeId, updates) => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return;

        get().updateWorkflow({
          nodes: workflow.nodes.map((n) =>
            n.id === nodeId ? { ...n, ...updates } : n,
          ),
        });
      },

      updateNodeConfig: (nodeId, config) => {
        get().updateNode(nodeId, { config });
      },

      deleteNode: (nodeId) => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return;

        get().updateWorkflow({
          nodes: workflow.nodes.filter((n) => n.id !== nodeId),
          connections: workflow.connections.filter(
            (c) => c.from !== nodeId && c.to !== nodeId,
          ),
        });
      },

      moveNode: (nodeId, x, y) => {
        get().updateNode(nodeId, { x, y });
      },

      // Connection operations
      addConnection: (from, to) => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return false;

        // Check if exists
        if (workflow.connections.some((c) => c.from === from && c.to === to)) {
          return false;
        }

        get().updateWorkflow({
          connections: [...workflow.connections, { from, to }],
        });
        return true;
      },

      removeConnection: (from, to) => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return;

        get().updateWorkflow({
          connections: workflow.connections.filter(
            (c) => !(c.from === from && c.to === to),
          ),
        });
      },

      // Workflow control
      toggleActive: () => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return;

        // Validate before activating
        if (!workflow.isActive) {
          const validation = get().validate();
          if (!validation.valid) {
            return { success: false, errors: validation.errors };
          }
        }

        get().updateWorkflow({ isActive: !workflow.isActive });
        set({ isDirty: false });
        return { success: true };
      },

      save: () => {
        const validation = get().validate();
        if (!validation.valid) {
          set({ validationErrors: validation.errors });
          return { success: false, errors: validation.errors };
        }

        set({ isDirty: false, validationErrors: [] });
        // Persistence is handled by zustand-persist middleware
        return { success: true };
      },

      validate: () => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow)
          return { valid: false, errors: ["No workflow selected"] };

        const errors = [];
        const warnings = [];

        // Must have at least one trigger
        const triggers = workflow.nodes.filter((n) => {
          const def = nodeRegistry.get(n.nodeType);
          return def?.type === "trigger";
        });

        if (triggers.length === 0) {
          errors.push("Workflow must have at least one trigger");
        }

        // Must have at least one action
        const actions = workflow.nodes.filter((n) => {
          const def = nodeRegistry.get(n.nodeType);
          return def?.type === "action";
        });

        if (actions.length === 0) {
          errors.push("Workflow must have at least one action");
        }

        // Check for disconnected nodes
        if (workflow.nodes.length > 1) {
          const connectedNodes = new Set();
          workflow.connections.forEach((c) => {
            connectedNodes.add(c.from);
            connectedNodes.add(c.to);
          });

          workflow.nodes.forEach((n) => {
            if (!connectedNodes.has(n.id)) {
              const def = nodeRegistry.get(n.nodeType);
              warnings.push(`"${def?.name || n.nodeType}" is not connected`);
            }
          });
        }

        // Check required properties
        workflow.nodes.forEach((node) => {
          const def = nodeRegistry.get(node.nodeType);
          if (!def) return;

          def.properties?.forEach((prop) => {
            if (prop.required && !node.config?.[prop.id]) {
              errors.push(`${def.name}: "${prop.label}" is required`);
            }
          });
        });

        set({ validationErrors: errors });
        return { valid: errors.length === 0, errors, warnings };
      },

      // Execution
      setExecutionState: (state) => set({ executionState: state }),

      setNodeState: (nodeId, state) => {
        set((prev) => ({
          nodeStates: { ...prev.nodeStates, [nodeId]: state },
        }));
      },

      addExecutionLog: (log) => {
        set((prev) => ({
          executionLogs: [
            ...prev.executionLogs,
            { ...log, id: Date.now(), timestamp: new Date().toISOString() },
          ],
        }));
      },

      clearExecutionLogs: () => set({ executionLogs: [], nodeStates: {} }),

      // Test execution
      runTest: async (mockTriggerData = {}) => {
        const workflow = get().getCurrentWorkflow();
        if (!workflow) return { success: false, error: "No workflow selected" };

        const validation = get().validate();
        if (!validation.valid) {
          return { success: false, error: validation.errors[0] };
        }

        // Clear previous state
        get().clearExecutionLogs();
        set({ executionState: "running" });

        try {
          // Execute with callbacks for real-time updates
          const engine = automationEngine;
          const context = await engine.execute(workflow, mockTriggerData, {
            onNodeStart: (nodeId, nodeName) => {
              get().setNodeState(nodeId, "running");
              get().addExecutionLog({
                nodeId,
                nodeName,
                status: "running",
                message: `Starting: ${nodeName}`,
              });
            },
            onNodeComplete: (nodeId, nodeName, result) => {
              get().setNodeState(nodeId, "success");
              get().addExecutionLog({
                nodeId,
                nodeName,
                status: "success",
                message: `Completed: ${nodeName}`,
                result,
              });
            },
            onNodeError: (nodeId, nodeName, error) => {
              get().setNodeState(nodeId, "error");
              get().addExecutionLog({
                nodeId,
                nodeName,
                status: "error",
                message: `Error: ${error.message}`,
              });
            },
          });

          set({ executionState: "success" });
          return { success: true, context };
        } catch (error) {
          set({ executionState: "error" });
          get().addExecutionLog({
            nodeId: "engine",
            nodeName: "Engine",
            status: "error",
            message: error.message,
          });
          return { success: false, error: error.message };
        }
      },

      resetExecutionState: () => {
        set({
          executionState: "idle",
          nodeStates: {},
        });
      },
    }),
    {
      name: "zyllo-automations",
      partialize: (state) => ({
        workflows: state.workflows,
        currentWorkflowId: state.currentWorkflowId,
      }),
    },
  ),
);

export default useWorkflowStore;
