/**
 * Zyllo Automation Engine - Type Definitions
 *
 * This file defines the structure for nodes, workflows, and execution context.
 */

/**
 * @typedef {Object} NodePort
 * @property {string} id - Unique port identifier
 * @property {string} type - Data type (string, number, object, array, any)
 * @property {string} label - Display label
 * @property {boolean} [required] - Whether the port is required
 */

/**
 * @typedef {Object} NodeProperty
 * @property {string} id - Property identifier
 * @property {string} type - Input type (text, number, select, array, code, boolean)
 * @property {string} label - Display label
 * @property {string} [description] - Help text
 * @property {boolean} [required] - Whether property is required
 * @property {*} [default] - Default value
 * @property {Array<{value: string, label: string}>} [options] - For select type
 * @property {string} [placeholder] - Input placeholder
 */

/**
 * @typedef {Object} NodeDefinition
 * @property {string} id - Unique node type identifier
 * @property {string} type - Node category (trigger, action, condition, transform)
 * @property {string} category - Display category for grouping
 * @property {string} name - Display name
 * @property {string} description - Short description
 * @property {string} icon - Lucide icon name
 * @property {string} color - Hex color for node accent
 * @property {NodePort[]} inputs - Input ports
 * @property {NodePort[]} outputs - Output ports
 * @property {NodeProperty[]} properties - Configurable properties
 * @property {Function} execute - Execution function
 */

/**
 * @typedef {Object} NodeInstance
 * @property {string} id - Unique instance ID
 * @property {string} nodeType - References NodeDefinition.id
 * @property {number} x - Canvas X position
 * @property {number} y - Canvas Y position
 * @property {Object} config - Configured property values
 */

/**
 * @typedef {Object} Connection
 * @property {string} id - Unique connection ID
 * @property {string} fromNode - Source node instance ID
 * @property {string} fromPort - Source output port ID
 * @property {string} toNode - Target node instance ID
 * @property {string} toPort - Target input port ID
 */

/**
 * @typedef {Object} Workflow
 * @property {string} id - Workflow ID
 * @property {string} name - Workflow name
 * @property {NodeInstance[]} nodes - Node instances
 * @property {Connection[]} connections - Node connections
 * @property {boolean} isActive - Whether workflow is active
 */

// Node type constants
export const NODE_TYPES = {
  TRIGGER: "trigger",
  ACTION: "action",
  CONDITION: "condition",
  TRANSFORM: "transform",
};

// Node categories for UI grouping
export const NODE_CATEGORIES = {
  TRIGGERS: {
    id: "triggers",
    label: "Triggers",
    description: "Start your automation",
    color: "#a855f7",
  },
  ACTIONS: {
    id: "actions",
    label: "Actions",
    description: "Perform operations",
    color: "#22c55e",
  },
  CONDITIONS: {
    id: "conditions",
    label: "Conditions",
    description: "Add logic and branching",
    color: "#f59e0b",
  },
  TRANSFORMS: {
    id: "transforms",
    label: "Transforms",
    description: "Modify data",
    color: "#3b82f6",
  },
};

// Property input types
export const PROPERTY_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  NUMBER: "number",
  SELECT: "select",
  BOOLEAN: "boolean",
  ARRAY: "array",
  CODE: "code",
  KEYWORDS: "keywords",
};

export default {
  NODE_TYPES,
  NODE_CATEGORIES,
  PROPERTY_TYPES,
};
