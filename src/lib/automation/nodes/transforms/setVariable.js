/**
 * Set Variable Transform Node
 *
 * Sets a variable that can be used by later nodes
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "set_variable",
  type: NODE_TYPES.TRANSFORM,
  category: "transforms",
  name: "Set Variable",
  description: "Store a value for later use",
  icon: "Variable",
  color: "#3b82f6",

  inputs: [{ id: "data", type: "any", label: "Input" }],

  outputs: [
    { id: "data", type: "any", label: "Output" },
    { id: "value", type: "any", label: "Variable Value" },
  ],

  properties: [
    {
      id: "variableName",
      type: PROPERTY_TYPES.TEXT,
      label: "Variable Name",
      description: "Name of the variable (use in templates as {{name}})",
      required: true,
      placeholder: "myVariable",
    },
    {
      id: "valueType",
      type: PROPERTY_TYPES.SELECT,
      label: "Value Type",
      default: "static",
      options: [
        { value: "static", label: "Static Value" },
        { value: "field", label: "From Field" },
        { value: "expression", label: "Expression" },
      ],
    },
    {
      id: "value",
      type: PROPERTY_TYPES.TEXTAREA,
      label: "Value",
      description: "The value to store",
      placeholder: "Enter value or field path...",
    },
  ],

  execute: async (context, config) => {
    const { variableName, valueType = "static", value } = config;

    if (!variableName) {
      context.log("set_variable", "No variable name configured", "error");
      return { data: context.getTriggerData() };
    }

    let finalValue = value;
    const triggerData = context.getTriggerData();

    if (valueType === "field") {
      // Get value from nested field
      finalValue = value
        .split(".")
        .reduce((obj, key) => obj?.[key], triggerData);
    } else if (valueType === "expression") {
      // Simple template processing
      finalValue = value;
      for (const [key, val] of context.variables) {
        finalValue = finalValue.replace(new RegExp(`{{${key}}}`, "g"), val);
      }
    }

    context.setVariable(variableName, finalValue);
    context.log(
      "set_variable",
      `Set ${variableName} = ${JSON.stringify(finalValue).substring(0, 50)}`,
    );

    return {
      data: triggerData,
      value: finalValue,
    };
  },
};
