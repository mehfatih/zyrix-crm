"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Filter,
  Plus,
  X,
  Loader2,
  Download,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  advancedFilter,
  type FilterCondition,
  type FilterOperator,
  type AdvancedFilterRequest,
} from "@/lib/api/advanced";

// ============================================================================
// ADVANCED FILTER BUILDER — reusable on any entity page
// ============================================================================

interface Props {
  entityType: "customers" | "deals" | "quotes" | "contracts" | "tasks";
  fields: { key: string; label: string; type: "text" | "number" | "date" | "select" | "enum"; options?: string[] }[];
  onResults: (items: any[], total: number) => void;
  onClose: () => void;
}

const OPERATORS_BY_TYPE: Record<string, FilterOperator[]> = {
  text: ["contains", "starts_with", "equals", "not_equals", "is_empty", "is_not_empty"],
  number: ["equals", "not_equals", "greater_than", "less_than", "greater_or_equal", "less_or_equal", "between", "is_empty"],
  date: ["equals", "greater_than", "less_than", "between", "is_empty", "is_not_empty"],
  select: ["equals", "not_equals", "in", "not_in", "is_empty"],
  enum: ["equals", "not_equals", "in", "not_in"],
};

export default function AdvancedFilterBuilder({
  entityType,
  fields,
  onResults,
  onClose,
}: Props) {
  const t = useTranslations("Filter");
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { field: fields[0]?.key || "", operator: "contains", value: "" },
  ]);
  const [logic, setLogic] = useState<"AND" | "OR">("AND");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCondition = () => {
    if (conditions.length >= 10) return;
    setConditions([
      ...conditions,
      { field: fields[0]?.key || "", operator: "contains", value: "" },
    ]);
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const updateCondition = (idx: number, update: Partial<FilterCondition>) => {
    setConditions(
      conditions.map((c, i) => (i === idx ? { ...c, ...update } : c))
    );
  };

  const apply = async () => {
    setLoading(true);
    setError(null);
    try {
      const validConditions = conditions.filter((c) => {
        if (!c.field || !c.operator) return false;
        if (c.operator === "is_empty" || c.operator === "is_not_empty") return true;
        return c.value !== undefined && c.value !== "";
      });

      const req: AdvancedFilterRequest = {
        entityType,
        conditions: validConditions,
        logic,
        limit: 200,
      };
      const result = await advancedFilter(req);
      onResults(result.items, result.total);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || "Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const getOperatorsForField = (fieldKey: string): FilterOperator[] => {
    const field = fields.find((f) => f.key === fieldKey);
    if (!field) return OPERATORS_BY_TYPE.text;
    return OPERATORS_BY_TYPE[field.type] || OPERATORS_BY_TYPE.text;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("title")}
          </h3>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Logic toggle */}
      {conditions.length > 1 && (
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit">
          {(["AND", "OR"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLogic(l)}
              className={`px-3 py-1 text-xs font-medium rounded ${
                logic === l
                  ? "bg-card text-cyan-300 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l === "AND" ? t("matchAll") : t("matchAny")}
            </button>
          ))}
        </div>
      )}

      {/* Conditions */}
      <div className="space-y-2">
        {conditions.map((c, idx) => (
          <ConditionRow
            key={idx}
            condition={c}
            fields={fields}
            operators={getOperatorsForField(c.field)}
            onUpdate={(u) => updateCondition(idx, u)}
            onRemove={() => removeCondition(idx)}
            canRemove={conditions.length > 1}
            t={t}
          />
        ))}
      </div>

      {/* Add button */}
      {conditions.length < 10 && (
        <button
          onClick={addCondition}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-cyan-300 hover:bg-muted rounded"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("addCondition")}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-red-100 text-rose-300 text-xs rounded-lg p-2">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-sky-50">
        <span className="text-[10px] text-muted-foreground">
          {conditions.length} {conditions.length === 1 ? t("condition") : t("conditions")}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={apply}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConditionRow({
  condition,
  fields,
  operators,
  onUpdate,
  onRemove,
  canRemove,
  t,
}: {
  condition: FilterCondition;
  fields: { key: string; label: string; type: string; options?: string[] }[];
  operators: FilterOperator[];
  onUpdate: (u: Partial<FilterCondition>) => void;
  onRemove: () => void;
  canRemove: boolean;
  t: any;
}) {
  const fieldDef = fields.find((f) => f.key === condition.field);
  const needsValue = !["is_empty", "is_not_empty"].includes(condition.operator);
  const isBetween = condition.operator === "between";
  const isMulti = condition.operator === "in" || condition.operator === "not_in";

  const inputType =
    fieldDef?.type === "number"
      ? "number"
      : fieldDef?.type === "date"
        ? "date"
        : "text";

  return (
    <div className="flex items-start gap-2 flex-wrap">
      {/* Field */}
      <select
        value={condition.field}
        onChange={(e) => {
          const newField = fields.find((f) => f.key === e.target.value);
          const newOperators = OPERATORS_BY_TYPE[newField?.type || "text"] || OPERATORS_BY_TYPE.text;
          onUpdate({
            field: e.target.value,
            operator: newOperators[0],
            value: "",
            value2: undefined,
          });
        }}
        className="px-2 py-1.5 text-xs border border-border rounded-lg bg-card min-w-[140px]"
      >
        {fields.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Operator */}
      <select
        value={condition.operator}
        onChange={(e) =>
          onUpdate({
            operator: e.target.value as FilterOperator,
            value: "",
            value2: undefined,
          })
        }
        className="px-2 py-1.5 text-xs border border-border rounded-lg bg-card"
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {t(`operators.${op}`)}
          </option>
        ))}
      </select>

      {/* Value input */}
      {needsValue && (
        <>
          {fieldDef?.options ? (
            isMulti ? (
              <MultiSelect
                options={fieldDef.options}
                value={Array.isArray(condition.value) ? condition.value : []}
                onChange={(v) => onUpdate({ value: v })}
              />
            ) : (
              <select
                value={condition.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                className="px-2 py-1.5 text-xs border border-border rounded-lg bg-card min-w-[120px]"
              >
                <option value="">—</option>
                {fieldDef.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )
          ) : (
            <>
              <input
                type={inputType}
                value={condition.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                placeholder={t("valuePlaceholder")}
                className="px-2 py-1.5 text-xs border border-border rounded-lg bg-card min-w-[140px]"
              />
              {isBetween && (
                <>
                  <span className="text-xs text-muted-foreground self-center">—</span>
                  <input
                    type={inputType}
                    value={condition.value2 || ""}
                    onChange={(e) => onUpdate({ value2: e.target.value })}
                    className="px-2 py-1.5 text-xs border border-border rounded-lg bg-card min-w-[140px]"
                  />
                </>
              )}
            </>
          )}
        </>
      )}

      {canRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs border border-border rounded-lg bg-card min-w-[140px]"
      >
        {value.length === 0 ? "—" : `${value.length} selected`}
        <ChevronDown className="w-3 h-3 ltr:ml-auto rtl:mr-auto" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-full max-h-48 overflow-y-auto">
          {options.map((o) => (
            <label
              key={o}
              className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(o)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...value, o]);
                  } else {
                    onChange(value.filter((v) => v !== o));
                  }
                }}
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
