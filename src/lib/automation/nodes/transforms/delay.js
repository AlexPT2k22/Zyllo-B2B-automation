/**
 * Delay Transform Node
 *
 * Adds a delay before continuing the workflow
 */

import { NODE_TYPES, PROPERTY_TYPES } from "../../types";

export default {
  id: "delay",
  type: NODE_TYPES.TRANSFORM,
  category: "transforms",
  name: "Delay",
  description: "Wait before continuing",
  icon: "Clock",
  color: "#3b82f6",

  inputs: [{ id: "data", type: "any", label: "Input" }],

  outputs: [{ id: "data", type: "any", label: "Output" }],

  properties: [
    {
      id: "duration",
      type: PROPERTY_TYPES.NUMBER,
      label: "Duration",
      description: "How long to wait",
      required: true,
      default: 5,
      placeholder: "5",
    },
    {
      id: "unit",
      type: PROPERTY_TYPES.SELECT,
      label: "Unit",
      default: "seconds",
      options: [
        { value: "seconds", label: "Seconds" },
        { value: "minutes", label: "Minutes" },
        { value: "hours", label: "Hours" },
      ],
    },
  ],

  execute: async (context, config) => {
    const { duration = 5, unit = "seconds" } = config;

    const multipliers = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
    };

    const ms = duration * multipliers[unit];
    context.log("delay", `Waiting for ${duration} ${unit}...`);

    await new Promise((resolve) => setTimeout(resolve, ms));

    context.log("delay", `Delay complete`);

    return {
      data: context.getTriggerData(),
    };
  },
};
