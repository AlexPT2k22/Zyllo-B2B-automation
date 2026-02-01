/**
 * Property Panel Component
 *
 * Dynamic form for configuring node properties based on schema.
 */

import React, { useState, useEffect } from "react";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import { PROPERTY_TYPES } from "@/lib/automation/types";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Save, Trash2 } from "lucide-react";

// Property input components
function TextInput({ property, value, onChange }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={property.placeholder}
      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg
        text-sm text-white placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-purple-500/50"
    />
  );
}

function TextAreaInput({ property, value, onChange }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={property.placeholder}
      rows={4}
      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg
        text-sm text-white placeholder:text-muted-foreground resize-none
        focus:outline-none focus:ring-2 focus:ring-purple-500/50"
    />
  );
}

function NumberInput({ property, value, onChange }) {
  return (
    <input
      type="number"
      value={value ?? property.default ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={property.placeholder}
      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg
        text-sm text-white placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-purple-500/50"
    />
  );
}

function SelectInput({ property, value, onChange }) {
  return (
    <select
      value={value ?? property.default ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg
        text-sm text-white
        focus:outline-none focus:ring-2 focus:ring-purple-500/50"
    >
      {property.options?.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#0d0d14]">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function BooleanInput({ property, value, onChange }) {
  const isChecked = value ?? property.default ?? false;

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!isChecked)}
        className={`w-10 h-6 rounded-full transition-colors relative ${
          isChecked ? "bg-purple-500" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            isChecked ? "left-5" : "left-1"
          }`}
        />
      </div>
      <span className="text-sm text-white">
        {isChecked ? "Enabled" : "Disabled"}
      </span>
    </label>
  );
}

function KeywordsInput({ property, value, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const keywords = value
    ? value
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
    : [];

  const addKeyword = () => {
    if (inputValue.trim()) {
      const newKeywords = [...keywords, inputValue.trim()];
      onChange(newKeywords.join(", "));
      setInputValue("");
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onChange(newKeywords.join(", "));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addKeyword())
          }
          placeholder={property.placeholder || "Add keyword..."}
          className="flex-1 h-9 px-3 bg-white/5 border border-white/10 rounded-lg
            text-sm text-white placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <Button
          type="button"
          size="sm"
          onClick={addKeyword}
          className="h-9 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
        >
          Add
        </Button>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 
                bg-purple-500/20 text-purple-300 text-xs rounded-md"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Property field wrapper
function PropertyField({ property, value, onChange }) {
  const inputComponents = {
    [PROPERTY_TYPES.TEXT]: TextInput,
    [PROPERTY_TYPES.TEXTAREA]: TextAreaInput,
    [PROPERTY_TYPES.NUMBER]: NumberInput,
    [PROPERTY_TYPES.SELECT]: SelectInput,
    [PROPERTY_TYPES.BOOLEAN]: BooleanInput,
    [PROPERTY_TYPES.KEYWORDS]: KeywordsInput,
    [PROPERTY_TYPES.ARRAY]: KeywordsInput,
    [PROPERTY_TYPES.CODE]: TextAreaInput,
  };

  const InputComponent = inputComponents[property.type] || TextInput;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-white">
          {property.label}
          {property.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {property.description && (
          <div className="group relative">
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            <div
              className="absolute left-0 bottom-full mb-2 w-48 p-2 
              bg-black/90 border border-white/10 rounded-lg text-xs text-muted-foreground
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
            >
              {property.description}
            </div>
          </div>
        )}
      </div>
      <InputComponent property={property} value={value} onChange={onChange} />
    </div>
  );
}

export function PropertyPanel({ nodeInstance, onUpdate, onDelete, onClose }) {
  const [config, setConfig] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const nodeDefinition = nodeInstance
    ? nodeRegistry.get(nodeInstance.nodeType)
    : null;

  useEffect(() => {
    if (nodeInstance) {
      setConfig(nodeInstance.config || {});
      setHasChanges(false);
    }
  }, [nodeInstance?.id]);

  if (!nodeInstance || !nodeDefinition) {
    return (
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0d0d14] border-l border-white/10 z-50 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Select a node to configure
        </p>
      </div>
    );
  }

  const handlePropertyChange = (propertyId, value) => {
    setConfig((prev) => ({ ...prev, [propertyId]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(nodeInstance.id, config);
    setHasChanges(false);
  };

  // Category colors
  const categoryColors = {
    triggers: "#a855f7",
    actions: "#22c55e",
    conditions: "#f59e0b",
    transforms: "#3b82f6",
  };

  const nodeColor = categoryColors[nodeDefinition.category] || "#a855f7";

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0d0d14] border-l border-white/10 z-50 flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-white/10"
        style={{ borderTopColor: nodeColor, borderTopWidth: "2px" }}
      >
        <div>
          <h2 className="font-semibold text-white">{nodeDefinition.name}</h2>
          <p className="text-xs text-muted-foreground">
            {nodeDefinition.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {nodeDefinition.properties?.length > 0 ? (
          nodeDefinition.properties.map((property) => (
            <PropertyField
              key={property.id}
              property={property}
              value={config[property.id]}
              onChange={(value) => handlePropertyChange(property.id, value)}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            This node has no configurable properties.
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {hasChanges && (
          <Button
            className="w-full bg-purple-500 hover:bg-purple-600"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => onDelete(nodeInstance.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}

export default PropertyPanel;
