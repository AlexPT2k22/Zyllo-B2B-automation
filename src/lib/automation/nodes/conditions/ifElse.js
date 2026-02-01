/**
 * If/Else Condition Node
 *
 * Branches the workflow based on a condition
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "if_else",
  type: NODE_TYPES.CONDITION,
  category: "conditions",
  name: "If / Else",
  description: "Branch based on a condition",
  icon: "GitBranch",
  color: "#f59e0b",

  inputs: [{ id: "data", type: "any", label: "Input Data" }],

  outputs: [
    { id: "true", type: "any", label: "True Branch" },
    { id: "false", type: "any", label: "False Branch" },
  ],

  properties: [
    {
      id: "field",
      type: PROPERTY_TYPES.TEXT,
      label: "Field to Check",
      description:
        "The data field to evaluate (e.g., message.text, sender.followers)",
      required: true,
      placeholder: "message.text",
    },
    {
      id: "operator",
      type: PROPERTY_TYPES.SELECT,
      label: "Operator",
      default: "contains",
      options: [
        { value: "equals", label: "Equals" },
        { value: "not_equals", label: "Not Equals" },
        { value: "contains", label: "Contains" },
        { value: "not_contains", label: "Does Not Contain" },
        { value: "starts_with", label: "Starts With" },
        { value: "ends_with", label: "Ends With" },
        { value: "greater_than", label: "Greater Than" },
        { value: "less_than", label: "Less Than" },
        { value: "is_empty", label: "Is Empty" },
        { value: "is_not_empty", label: "Is Not Empty" },
      ],
    },
    {
      id: "value",
      type: PROPERTY_TYPES.TEXT,
      label: "Value",
      description: "Value to compare against",
      placeholder: "Enter value...",
    },
  ],

  execute: async (context, config) => {
    const { field, operator, value } = config;
    const triggerData = context.getTriggerData();

    // Get nested field value
    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((current, key) => current?.[key], obj);
    };

    const fieldValue = getNestedValue(triggerData, field);
    let result = false;

    switch (operator) {
      case "equals":
        result = String(fieldValue) === String(value);
        break;
      case "not_equals":
        result = String(fieldValue) !== String(value);
        break;
      case "contains":
        result = String(fieldValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
        break;
      case "not_contains":
        result = !String(fieldValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
        break;
      case "starts_with":
        result = String(fieldValue)
          .toLowerCase()
          .startsWith(String(value).toLowerCase());
        break;
      case "ends_with":
        result = String(fieldValue)
          .toLowerCase()
          .endsWith(String(value).toLowerCase());
        break;
      case "greater_than":
        result = Number(fieldValue) > Number(value);
        break;
      case "less_than":
        result = Number(fieldValue) < Number(value);
        break;
      case "is_empty":
        result =
          !fieldValue ||
          fieldValue === "" ||
          (Array.isArray(fieldValue) && fieldValue.length === 0);
        break;
      case "is_not_empty":
        result =
          Boolean(fieldValue) &&
          fieldValue !== "" &&
          !(Array.isArray(fieldValue) && fieldValue.length === 0);
        break;
    }

    context.log("if_else", `${field} ${operator} ${value} = ${result}`);

    return {
      [result ? "true" : "false"]: triggerData,
      result,
    };
  },
};
