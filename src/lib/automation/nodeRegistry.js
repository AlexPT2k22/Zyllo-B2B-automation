/**
 * Zyllo Automation Engine - Node Registry
 *
 * Central registry for all automation nodes.
 * Nodes register themselves here and the UI consumes their metadata.
 */

class NodeRegistry {
  constructor() {
    this.nodes = new Map();
    this.categories = new Map();
  }

  /**
   * Register a node definition
   * @param {import('./types').NodeDefinition} nodeDefinition
   */
  register(nodeDefinition) {
    if (this.nodes.has(nodeDefinition.id)) {
      console.warn(
        `Node "${nodeDefinition.id}" is already registered. Overwriting.`,
      );
    }

    // Validate required fields
    const required = ["id", "type", "name", "icon"];
    for (const field of required) {
      if (!nodeDefinition[field]) {
        throw new Error(`Node definition missing required field: ${field}`);
      }
    }

    // Set defaults
    const node = {
      inputs: [],
      outputs: [],
      properties: [],
      color: "#a855f7",
      category: nodeDefinition.type + "s", // triggers, actions, etc.
      ...nodeDefinition,
    };

    this.nodes.set(node.id, node);

    // Add to category
    if (!this.categories.has(node.category)) {
      this.categories.set(node.category, []);
    }
    this.categories.get(node.category).push(node.id);

    return this;
  }

  /**
   * Get a node definition by ID
   * @param {string} id
   * @returns {import('./types').NodeDefinition | undefined}
   */
  get(id) {
    return this.nodes.get(id);
  }

  /**
   * Get all registered nodes
   * @returns {import('./types').NodeDefinition[]}
   */
  getAll() {
    return Array.from(this.nodes.values());
  }

  /**
   * Get nodes by category
   * @param {string} category
   * @returns {import('./types').NodeDefinition[]}
   */
  getByCategory(category) {
    const nodeIds = this.categories.get(category) || [];
    return nodeIds.map((id) => this.nodes.get(id)).filter(Boolean);
  }

  /**
   * Get nodes by type
   * @param {string} type - trigger, action, condition, transform
   * @returns {import('./types').NodeDefinition[]}
   */
  getByType(type) {
    return this.getAll().filter((node) => node.type === type);
  }

  /**
   * Get all categories with their nodes
   * @returns {Object[]}
   */
  getCategoriesWithNodes() {
    const result = [];

    for (const [categoryId, nodeIds] of this.categories) {
      result.push({
        id: categoryId,
        nodes: nodeIds.map((id) => this.nodes.get(id)).filter(Boolean),
      });
    }

    return result;
  }

  /**
   * Search nodes by name or description
   * @param {string} query
   * @returns {import('./types').NodeDefinition[]}
   */
  search(query) {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (node) =>
        node.name.toLowerCase().includes(q) ||
        node.description?.toLowerCase().includes(q),
    );
  }

  /**
   * Create a new node instance from a definition
   * @param {string} nodeTypeId - The node definition ID
   * @param {Object} position - { x, y } position on canvas
   * @param {string} [id] - Optional custom ID (for templates)
   * @param {Object} [customConfig] - Optional custom config (for templates)
   * @returns {import('./types').NodeInstance}
   */
  createInstance(
    nodeTypeId,
    position = { x: 0, y: 0 },
    id = null,
    customConfig = {},
  ) {
    const definition = this.get(nodeTypeId);
    if (!definition) {
      throw new Error(`Unknown node type: ${nodeTypeId}`);
    }

    // Build default config from properties
    const config = {};
    for (const prop of definition.properties) {
      if (prop.default !== undefined) {
        config[prop.id] = prop.default;
      }
    }

    return {
      id:
        id ||
        `${nodeTypeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nodeType: nodeTypeId,
      x: position.x,
      y: position.y,
      config: { ...config, ...customConfig },
    };
  }
}

// Singleton instance
export const nodeRegistry = new NodeRegistry();

export default nodeRegistry;
