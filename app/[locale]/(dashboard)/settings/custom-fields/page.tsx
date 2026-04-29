"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Settings2,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  X,
  Sparkles,
  Users,
  Briefcase,
  Type,
  Hash,
  Calendar,
  List,
  ToggleLeft,
  Link as LinkIcon,
  Mail,
  ArrowUpDown,
} from "lucide-react";
import {
  listCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  type CustomField,
  type CreateFieldDto,
} from "@/lib/api/advanced";

// ============================================================================
// CUSTOM FIELDS SETTINGS
// ============================================================================

const FIELD_TYPES: { id: CustomField["fieldType"]; Icon: typeof Type; color: string }[] = [
  { id: "text", Icon: Type, color: "text-muted-foreground" },
  { id: "number", Icon: Hash, color: "text-emerald-300" },
  { id: "date", Icon: Calendar, color: "text-cyan-300" },
  { id: "select", Icon: List, color: "text-indigo-600" },
  { id: "multi_select", Icon: List, color: "text-violet-600" },
  { id: "boolean", Icon: ToggleLeft, color: "text-amber-300" },
  { id: "url", Icon: LinkIcon, color: "text-cyan-300" },
  { id: "email", Icon: Mail, color: "text-pink-600" },
];

export default function CustomFieldsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("CustomFields");

  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"customer" | "deal">("customer");
  const [editing, setEditing] = useState<CustomField | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const load = async () => {
    try {
      const data = await listCustomFields();
      setFields(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = fields.filter((f) => f.entityType === activeTab);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(t("confirmDelete", { label }))) return;
    try {
      await deleteCustomField(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Delete failed");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setShowEditor(true);
  };

  return (
    <>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-cyan-300" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("createNew")}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          <TabButton
            active={activeTab === "customer"}
            onClick={() => setActiveTab("customer")}
            Icon={Users}
            label={t("customers")}
            count={fields.filter((f) => f.entityType === "customer").length}
          />
          <TabButton
            active={activeTab === "deal"}
            onClick={() => setActiveTab("deal")}
            Icon={Briefcase}
            label={t("deals")}
            count={fields.filter((f) => f.entityType === "deal").length}
          />
        </div>

        {/* Fields list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Sparkles className="w-10 h-10 text-sky-300 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t("empty.title", { entity: t(activeTab === "customer" ? "customers" : "deals") })}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{t("empty.subtitle")}</p>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg"
            >
              {t("createFirst")}
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr className="text-left rtl:text-right text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">{t("table.label")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table.key")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table.type")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table.required")}</th>
                  <th className="px-4 py-3 font-semibold w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {filtered.map((f) => {
                  const typeMeta = FIELD_TYPES.find((t) => t.id === f.fieldType);
                  const Icon = typeMeta?.Icon || Type;
                  return (
                    <tr key={f.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-foreground font-medium">
                        {f.label}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                          {f.fieldKey}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-foreground">
                          <Icon className={`w-3.5 h-3.5 ${typeMeta?.color}`} />
                          {t(`types.${f.fieldType}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {f.required ? (
                          <span className="inline-block text-[10px] font-bold text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            {t("required")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditing(f);
                              setShowEditor(true);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded"
                            title={t("edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(f.id, f.label)}
                            className="p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 rounded"
                            title={t("delete")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEditor && (
        <FieldEditor
          field={editing}
          defaultEntity={activeTab}
          onClose={() => setShowEditor(false)}
          onSaved={async () => {
            setShowEditor(false);
            await load();
          }}
          t={t}
        />
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Users;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 ${
        active
          ? "border-sky-500 text-cyan-300"
          : "border-transparent text-muted-foreground hover:text-cyan-300"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      <span
        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
          active ? "bg-sky-100 text-cyan-300" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function FieldEditor({
  field,
  defaultEntity,
  onClose,
  onSaved,
  t,
}: {
  field: CustomField | null;
  defaultEntity: "customer" | "deal";
  onClose: () => void;
  onSaved: () => void;
  t: any;
}) {
  const [form, setForm] = useState<CreateFieldDto>({
    entityType: field?.entityType || defaultEntity,
    fieldKey: field?.fieldKey || "",
    label: field?.label || "",
    fieldType: field?.fieldType || "text",
    options: field?.options || [],
    required: field?.required ?? false,
    defaultValue: field?.defaultValue || "",
    position: field?.position ?? 0,
  });
  const [optionsText, setOptionsText] = useState(field?.options?.join("\n") || "");
  const [saving, setSaving] = useState(false);

  const needsOptions = form.fieldType === "select" || form.fieldType === "multi_select";

  const save = async () => {
    if (!form.label) {
      alert(t("errors.labelRequired"));
      return;
    }
    const data = { ...form };
    if (!field) {
      data.fieldKey = form.fieldKey.trim() || form.label.trim().toLowerCase().replace(/\s+/g, "_");
    }
    if (needsOptions) {
      data.options = optionsText.split("\n").map((o) => o.trim()).filter(Boolean);
      if (data.options.length === 0) {
        alert(t("errors.optionsRequired"));
        return;
      }
    }
    setSaving(true);
    try {
      if (field) {
        await updateCustomField(field.id, data);
      } else {
        await createCustomField(data);
      }
      onSaved();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl max-w-xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {field ? t("editor.titleEdit") : t("editor.titleNew")}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("editor.entityType")} *
              </label>
              <select
                value={form.entityType}
                onChange={(e) => setForm({ ...form, entityType: e.target.value as any })}
                disabled={!!field}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card disabled:bg-muted"
              >
                <option value="customer">{t("customers")}</option>
                <option value="deal">{t("deals")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("editor.type")} *
              </label>
              <select
                value={form.fieldType}
                onChange={(e) => setForm({ ...form, fieldType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card"
              >
                {FIELD_TYPES.map((ty) => (
                  <option key={ty.id} value={ty.id}>
                    {t(`types.${ty.id}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("editor.label")} *
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder={t("editor.labelPlaceholder")}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {!field && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("editor.key")}
              </label>
              <input
                type="text"
                value={form.fieldKey}
                onChange={(e) => setForm({ ...form, fieldKey: e.target.value })}
                placeholder={t("editor.keyPlaceholder")}
                className="w-full px-3 py-2 text-sm font-mono border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t("editor.keyHint")}</p>
            </div>
          )}

          {needsOptions && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("editor.options")} *
              </label>
              <textarea
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                rows={5}
                placeholder={t("editor.optionsPlaceholder")}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t("editor.optionsHint")}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("editor.default")}
            </label>
            <input
              type="text"
              value={form.defaultValue || ""}
              onChange={(e) => setForm({ ...form, defaultValue: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.required ?? false}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              className="rounded border-sky-300 text-cyan-300 focus:ring-primary"
            />
            {t("editor.required")}
          </label>
        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground text-sm font-medium rounded-lg"
          >
            {t("editor.cancel")}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("editor.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
