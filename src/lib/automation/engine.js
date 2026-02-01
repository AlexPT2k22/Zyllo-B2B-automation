/**
 * Zyllo Automation Engine - Execution Engine
 *
 * Separated from the UI, this engine handles workflow execution.
 */

import nodeRegistry from "./nodeRegistry";

/**
 * Execution context passed between nodes
 */
export class ExecutionContext {
  constructor(triggerData = {}) {
    this.triggerData = triggerData;
    this.outputs = new Map();
    this.variables = new Map();
    this.logs = [];
    this.startTime = Date.now();
  }

  /**
   * Get the original trigger data
   */
  getTriggerData() {
    return this.triggerData;
  }

  /**
   * Set output from a node
   */
  setOutput(nodeId, portId, value) {
    const key = `${nodeId}.${portId}`;
    this.outputs.set(key, value);
  }

  /**
   * Get output from a previous node
   */
  getOutput(nodeId, portId) {
    const key = `${nodeId}.${portId}`;
    return this.outputs.get(key);
  }

  /**
   * Set a variable
   */
  setVariable(name, value) {
    this.variables.set(name, value);
  }

  /**
   * Get a variable
   */
  getVariable(name) {
    return this.variables.get(name);
  }

  /**
   * Log execution step
   */
  log(nodeId, message, level = "info") {
    this.logs.push({
      timestamp: Date.now(),
      nodeId,
      message,
      level,
    });
  }

  /**
   * Get execution duration
   */
  getDuration() {
    return Date.now() - this.startTime;
  }

  /**
   * Get all outputs
   */
  getAllOutputs() {
    return Object.fromEntries(this.outputs);
  }

  /**
   * Get execution logs
   */
  getLogs() {
    return this.logs;
  }
}

/**
 * Main Automation Engine
 */
export class AutomationEngine {
  constructor(registry = nodeRegistry) {
    this.registry = registry;
  }

  /**
   * Get execution order by topologically sorting nodes based on connections
   * @param {import('./types').NodeInstance[]} nodes
   * @param {import('./types').Connection[]} connections
   * @returns {import('./types').NodeInstance[]}
   */
  getExecutionOrder(nodes, connections) {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const inDegree = new Map(nodes.map((n) => [n.id, 0]));
    const adjacency = new Map(nodes.map((n) => [n.id, []]));

    // Build graph
    for (const conn of connections) {
      adjacency.get(conn.fromNode)?.push(conn.toNode);
      inDegree.set(conn.toNode, (inDegree.get(conn.toNode) || 0) + 1);
    }

    // Kahn's algorithm for topological sort
    const queue = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    const result = [];
    while (queue.length > 0) {
      const current = queue.shift();
      result.push(nodeMap.get(current));

      for (const neighbor of adjacency.get(current) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result.filter(Boolean);
  }

  /**
   * Execute a workflow
   * @param {import('./types').Workflow} workflow
   * @param {Object} triggerData - Data from the trigger event
   * @param {Object} callbacks - Optional callbacks for UI updates
   * @returns {Promise<ExecutionContext>}
   */
  async execute(workflow, triggerData = {}, callbacks = {}) {
    const { onNodeStart, onNodeComplete, onNodeError } = callbacks;
    const context = new ExecutionContext(triggerData);

    // Handle both 'from/to' and 'fromNode/toNode' connection formats
    const normalizedConnections = workflow.connections.map((c) => ({
      fromNode: c.fromNode || c.from,
      toNode: c.toNode || c.to,
    }));

    const executionOrder = this.getExecutionOrder(
      workflow.nodes,
      normalizedConnections,
    );

    context.log("engine", `Starting workflow: ${workflow.name || workflow.id}`);

    for (const nodeInstance of executionOrder) {
      const nodeDef = this.registry.get(nodeInstance.nodeType);

      if (!nodeDef) {
        context.log(
          nodeInstance.id,
          `Unknown node type: ${nodeInstance.nodeType}`,
          "error",
        );
        continue;
      }

      // Notify UI that node is starting
      if (onNodeStart) {
        onNodeStart(nodeInstance.id, nodeDef.name);
      }

      context.log(nodeInstance.id, `Executing: ${nodeDef.name}`);

      // Add small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        if (typeof nodeDef.execute === "function") {
          const result = await nodeDef.execute(
            context,
            nodeInstance.config,
            nodeInstance,
          );

          // Store outputs
          if (result && nodeDef.outputs) {
            for (const output of nodeDef.outputs) {
              if (result[output.id] !== undefined) {
                context.setOutput(
                  nodeInstance.id,
                  output.id,
                  result[output.id],
                );
              }
            }
          }

          context.log(nodeInstance.id, `Completed successfully`);

          // Notify UI that node completed
          if (onNodeComplete) {
            onNodeComplete(nodeInstance.id, nodeDef.name, result);
          }
        }
      } catch (error) {
        context.log(nodeInstance.id, `Error: ${error.message}`, "error");

        // Notify UI of error
        if (onNodeError) {
          onNodeError(nodeInstance.id, nodeDef.name, error);
        }

        throw error;
      }
    }

    context.log("engine", `Workflow completed in ${context.getDuration()}ms`);
    return context;
  }

  /**
   * Validate a workflow
   * @param {import('./types').Workflow} workflow
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate(workflow) {
    const errors = [];

    // Check for at least one trigger
    const triggers = workflow.nodes.filter((n) => {
      const def = this.registry.get(n.nodeType);
      return def?.type === "trigger";
    });

    if (triggers.length === 0) {
      errors.push("Workflow must have at least one trigger");
    }

    // Check for orphan nodes (not connected)
    const connectedNodes = new Set();
    for (const conn of workflow.connections) {
      connectedNodes.add(conn.fromNode);
      connectedNodes.add(conn.toNode);
    }

    for (const node of workflow.nodes) {
      if (!connectedNodes.has(node.id) && workflow.nodes.length > 1) {
        const def = this.registry.get(node.nodeType);
        errors.push(`Node "${def?.name || node.nodeType}" is not connected`);
      }
    }

    // Validate required properties
    for (const node of workflow.nodes) {
      const def = this.registry.get(node.nodeType);
      if (!def) {
        errors.push(`Unknown node type: ${node.nodeType}`);
        continue;
      }

      for (const prop of def.properties) {
        if (prop.required && !node.config?.[prop.id]) {
          errors.push(`${def.name}: "${prop.label}" is required`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Singleton instance
export const automationEngine = new AutomationEngine();

export default automationEngine;
