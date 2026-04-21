"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Mail,
  Plus,
  Search,
  Trash2,
  Pencil,
  Copy,
  Loader2,
  X,
  Sparkles,
  Tag,
  Eye,
  FileText,
} from "lucide-react";
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  type EmailTemplate,
  type CreateTemplateDto,
} from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// EMAIL TEMPLATES LIBRARY
// ============================================================================

const CATEGORIES = [
  { id: "general", color: "slate" },
  { id: "welcome", color: "emerald" },
  { id: "follow_up", color: "cyan" },
  { id: "promotional", color: "amber" },
  { id: "transactional", color: "indigo" },
  { id: "reminder", color: "violet" },
  { id: "announcement", color: "pink" },
] as const;

export default function TemplatesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Templates");

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const load = async () => {
    try {
      const data = await listTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = templates.filter((tp) => {
    if (categoryFilter !== "all" && tp.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        tp.name.toLowerCase().includes(q) ||
        tp.subject.toLowerCase().includes(q) ||
        tp.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("confirmDelete", { name }))) return;
    try {
      await deleteTemplate(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Delete failed");
    }
  };

  const handleDuplicate = async (tp: EmailTemplate) => {
    try {
      await createTemplate({
        name: `${tp.name} (copy)`,
        description: tp.description || undefined,
        category: tp.category,
        subject: tp.subject,
        bodyHtml: tp.bodyHtml,
        bodyText: tp.bodyText || undefined,
        isShared: tp.isShared,
      });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Duplicate failed");
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
              <Mail className="w-6 h-6 text-cyan-600" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setShowEditor(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("createNew")}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <CategoryChip
              label={t("allCategories")}
              active={categoryFilter === "all"}
              onClick={() => setCategoryFilter("all")}
              color="slate"
              count={templates.length}
            />
            {CATEGORIES.map((c) => {
              const count = templates.filter((tp) => tp.category === c.id).length;
              if (count === 0) return null;
              return (
                <CategoryChip
                  key={c.id}
                  label={t(`categories.${c.id}`)}
                  active={categoryFilter === c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  color={c.color}
                  count={count}
                />
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-xl p-12 text-center">
            <Sparkles className="w-10 h-10 text-sky-300 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-cyan-900 mb-1">
              {templates.length === 0 ? t("empty.title") : t("empty.noResults")}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {templates.length === 0 ? t("empty.subtitle") : t("empty.tryDifferent")}
            </p>
            {templates.length === 0 && (
              <button
                onClick={() => {
                  setEditing(null);
                  setShowEditor(true);
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg"
              >
                {t("createFirst")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tp) => (
              <TemplateCard
                key={tp.id}
                template={tp}
                t={t}
                onEdit={() => {
                  setEditing(tp);
                  setShowEditor(true);
                }}
                onDelete={() => handleDelete(tp.id, tp.name)}
                onDuplicate={() => handleDuplicate(tp)}
                onPreview={() => setPreviewTemplate(tp)}
              />
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <TemplateEditor
          template={editing}
          onClose={() => setShowEditor(false)}
          onSaved={async () => {
            setShowEditor(false);
            await load();
          }}
          t={t}
        />
      )}

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          t={t}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Template card
// ============================================================================
function TemplateCard({
  template,
  t,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: {
  template: EmailTemplate;
  t: any;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPreview: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === template.category);
  const categoryColors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    cyan: "bg-cyan-100 text-cyan-700",
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-indigo-100 text-indigo-700",
    violet: "bg-violet-100 text-violet-700",
    pink: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded ${
            categoryColors[cat?.color || "slate"]
          }`}
        >
          <Tag className="w-2.5 h-2.5" />
          {t(`categories.${template.category}`)}
        </span>
        {template.usageCount > 0 && (
          <span className="text-[10px] text-slate-500">
            {t("usedCount", { count: template.usageCount })}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-cyan-900 mb-1 truncate">
        {template.name}
      </h3>
      <p className="text-xs text-slate-600 mb-2 line-clamp-1">
        {template.subject}
      </p>
      {template.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {template.description}
        </p>
      )}

      {template.variables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {template.variables.slice(0, 3).map((v, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 text-[10px] font-mono bg-sky-50 text-cyan-700 rounded"
            >
              {`{{${v}}}`}
            </span>
          ))}
          {template.variables.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{template.variables.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-1 pt-2 border-t border-sky-50">
        <button
          onClick={onPreview}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded"
        >
          <Eye className="w-3 h-3" />
          {t("preview")}
        </button>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded"
            title={t("edit")}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded"
            title={t("duplicate")}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
            title={t("delete")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Editor modal
// ============================================================================
function TemplateEditor({
  template,
  onClose,
  onSaved,
  t,
}: {
  template: EmailTemplate | null;
  onClose: () => void;
  onSaved: () => void;
  t: any;
}) {
  const [form, setForm] = useState<CreateTemplateDto>({
    name: template?.name || "",
    description: template?.description || "",
    category: template?.category || "general",
    subject: template?.subject || "",
    bodyHtml: template?.bodyHtml || "",
    isShared: template?.isShared ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name || !form.subject || !form.bodyHtml) {
      alert(t("errors.requiredFields"));
      return;
    }
    setSaving(true);
    try {
      if (template) {
        await updateTemplate(template.id, form);
      } else {
        await createTemplate(form);
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
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cyan-900">
            {template ? t("editor.titleEdit") : t("editor.titleNew")}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t("editor.name")} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </Field>
            <Field label={t("editor.category")}>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(`categories.${c.id}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("editor.description")}>
            <input
              type="text"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </Field>

          <Field label={t("editor.subject")} required>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={t("editor.subjectPlaceholder")}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </Field>

          <Field label={t("editor.body")} required hint={t("editor.bodyHint")}>
            <textarea
              value={form.bodyHtml}
              onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
              rows={12}
              placeholder={t("editor.bodyPlaceholder")}
              className="w-full px-3 py-2 text-sm font-mono border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isShared ?? true}
              onChange={(e) => setForm({ ...form, isShared: e.target.checked })}
              className="rounded border-sky-300 text-cyan-600 focus:ring-cyan-500"
            />
            {t("editor.shared")}
          </label>
        </div>

        <div className="p-4 border-t border-sky-100 bg-sky-50/30 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {t("editor.variableHint")}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
            >
              {t("editor.cancel")}
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("editor.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Preview modal
// ============================================================================
function TemplatePreview({
  template,
  onClose,
  t,
}: {
  template: EmailTemplate;
  onClose: () => void;
  t: any;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-cyan-900">{t("preview")}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <div className="text-xs text-slate-500 mb-1">{t("editor.subject")}</div>
            <div className="text-sm font-semibold text-slate-900 bg-sky-50/40 p-3 rounded border border-sky-100">
              {template.subject}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">{t("editor.body")}</div>
            <div
              className="text-sm text-slate-800 bg-white p-4 rounded border border-sky-100"
              dangerouslySetInnerHTML={{ __html: template.bodyHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
  color,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
  count: number;
}) {
  const activeColors: Record<string, string> = {
    slate: "bg-slate-800 text-white",
    emerald: "bg-emerald-600 text-white",
    cyan: "bg-cyan-600 text-white",
    amber: "bg-amber-600 text-white",
    indigo: "bg-indigo-600 text-white",
    violet: "bg-violet-600 text-white",
    pink: "bg-pink-600 text-white",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
        active
          ? `${activeColors[color]} border-transparent`
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
      <span className={`text-[10px] font-bold ${active ? "opacity-80" : "text-slate-500"}`}>
        {count}
      </span>
    </button>
  );
}
