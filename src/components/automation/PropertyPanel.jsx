/**
 * Property Panel Component
 *
 * Dynamic form for configuring node properties based on schema.
 * Zyllo Style: Floating Glass Right Panel
 */

import React, { useState, useEffect } from "react";
import { nodeRegistry } from "@/lib/automation/nodeRegistry";
import { PROPERTY_TYPES } from "@/lib/automation/types";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Save, Trash2, ArrowRight } from "lucide-react";

// Shared Input Style
const INPUT_BASE_CLASS = `
  w-full px-3 py-2
  bg-black/20 hover:bg-black/30 
  border border-white/5 hover:border-white/10 focus:border-purple-500/30
  rounded-xl
  text-sm text-white placeholder:text-muted-foreground/40
  focus:outline-none focus:ring-2 focus:ring-purple-500/10
  transition-all duration-200
`;

function TextInput({ property, value, onChange }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={property.placeholder}
      className={`${INPUT_BASE_CLASS} h-10`}
    />
  );
}

function TextAreaInput({ property, value, onChange }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={property.placeholder}
      rows={5}
      className={`${INPUT_BASE_CLASS} resize-none leading-relaxed`}
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
      className={`${INPUT_BASE_CLASS} h-10 font-mono`}
    />
  );
}

function SelectInput({ property, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value ?? property.default ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_BASE_CLASS} h-10 appearance-none cursor-pointer pr-10`}
      >
        {property.options?.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a20]">
            {opt.label}
          </option>
        ))}
      </select>
      <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50 rotate-90" />
    </div>
  );
}

function BooleanInput({ property, value, onChange }) {
  const isChecked = value ?? property.default ?? false;

  return (
    <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
      <span className="text-sm text-white/80">
        {isChecked ? "Enable Feature" : "Disable Feature"}
      </span>
      <div
        onClick={(e) => {
          e.preventDefault();
          onChange(!isChecked);
        }}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          isChecked ? "bg-purple-500" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
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
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addKeyword())
          }
          placeholder={property.placeholder || "Add keyword..."}
          className={`${INPUT_BASE_CLASS} h-10 flex-1`}
        />
        <Button
          type="button"
          onClick={addKeyword}
          className="h-10 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl"
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-black/10 rounded-xl border border-dashed border-white/5">
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 
                bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-lg animate-in zoom-in-50 duration-200"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="hover:bg-purple-500/20 rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground p-1">
            No keywords added
          </span>
        )}
      </div>
    </div>
  );
}

function PropertyField({ property, value, onChange }) {
  const inputComponents = {
    [PROPERTY_TYPES.TEXT]: TextInput,
    [PROPERTY_TYPES.TEXTAREA]: TextAreaInput,
    [PROPERTY_TYPES.NUMBER]: NumberInput,
    [PROPERTY_TYPES.SELECT]: SelectInput,
    [PROPERTY_TYPES.BOOLEAN]: BooleanInput,
    [PROPERTY_TYPES.KEYWORDS]: KeywordsInput,
  };

  const InputComponent = inputComponents[property.type] || TextInput;

  return (
    <div className="space-y-2.5 animate-in slide-in-from-right-4 duration-500 fill-mode-backwards">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {property.label}
          {property.required && <span className="text-purple-400 ml-1">*</span>}
        </label>
        {property.description && (
          <div className="group relative">
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-white cursor-help transition-colors" />
            <div
              className="absolute right-0 bottom-full mb-2 w-64 p-3
              bg-[#1a1a20] border border-white/10 rounded-xl text-xs text-white/80 leading-relaxed shadow-xl
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 backdrop-blur-md"
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

  if (!nodeInstance || !nodeDefinition) return null;

  const handleSave = () => {
    onUpdate(nodeInstance.id, config);
    setHasChanges(false);
  };

  return (
    <div className="absolute right-6 top-6 bottom-6 w-96 z-50 flex flex-col pointer-events-auto animate-in slide-in-from-right-4 duration-300">
      <div className="flex-1 flex flex-col bg-[#0d0d14]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 bg-white/5 relative overflow-hidden">
          {/* Background Accent */}
          <div
            className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none"
            style={{ backgroundColor: nodeDefinition.color }}
          />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2"
                style={{
                  backgroundColor: `${nodeDefinition.color}20`,
                  color: nodeDefinition.color,
                }}
              >
                {nodeDefinition.category.slice(0, -1)}
              </div>
              <h2 className="text-lg font-semibold text-white">
                {nodeDefinition.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {nodeDefinition.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Properties Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {nodeDefinition.properties?.length > 0 ? (
            nodeDefinition.properties.map((property) => (
              <PropertyField
                key={property.id}
                property={property}
                value={config[property.id]}
                onChange={(value) => {
                  setConfig((prev) => ({ ...prev, [property.id]: value }));
                  setHasChanges(true);
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/5">
              <p>No configurable properties</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur space-y-3">
          {hasChanges && (
            <Button
              className="w-full h-11 bg-white hover:bg-white/90 text-black font-medium rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full h-10 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
            onClick={() => onDelete(nodeInstance.id)}
          >
            <Trash2 className="w-4 h-4 mr-2 opacity-70" />
            Delete Node
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertyPanel;
