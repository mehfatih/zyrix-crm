"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AdminAnnouncement,
  type CreateAnnouncementDto,
  type Paginated,
} from "@/lib/api/admin";
import {
  Megaphone,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Info,
  AlertTriangle,
  AlertOctagon,
  X,
  Check,
  Power,
  PowerOff,
} from "lucide-react";

// ============================================================================
// ADMIN ANNOUNCEMENTS VIEW
// ============================================================================

interface Props {
  locale: string;
}

const TYPE_META: Record<
  string,
  { bg: string; text: string; ring: string; icon: typeof Info }
> = {
  info: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    icon: Info,
  },
  warn: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    icon: AlertTriangle,
  },
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    icon: AlertOctagon,
  },
};

export default function AdminAnnouncementsView({ locale }: Props) {
  const t = useTranslations("Admin.announcements");

  const [data, setData] = useState<Paginated<AdminAnnouncement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [editing, setEditing] = useState<AdminAnnouncement | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params: { active?: boolean; limit: number } = { limit: 100 };
      if (activeFilter === "active") params.active = true;
      if (activeFilter === "inactive") params.active = false;
      const res = await fetchAnnouncements(params);
      setData(res);
    } catch (err) {
      console.error(err);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  async function handleToggleActive(a: AdminAnnouncement) {
    try {
      await updateAnnouncement(a.id, { isActive: !a.isActive });
      await load();
    } catch (err) {
      console.error(err);
      alert(t("updateError"));
    }
  }

  async function handleDelete(a: AdminAnnouncement) {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteAnnouncement(a.id);
      await load();
    } catch (err) {
      console.error(err);
      alert(t("deleteError"));
    }
  }

  function localizedTitle(a: AdminAnnouncement) {
    if (locale === "ar" && a.titleAr) return a.titleAr;
    if (locale === "tr" && a.titleTr) return a.titleTr;
    return a.title;
  }

  function localizedContent(a: AdminAnnouncement) {
    if (locale === "ar" && a.contentAr) return a.contentAr;
    if (locale === "tr" && a.contentTr) return a.contentTr;
    return a.content;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow-sm"
        >
          <Plus size={16} />
          {t("create")}
        </button>
      </div>

      {/* Filter */}
      <div className="inline-flex rounded-lg border border-cyan-200 bg-white p-1 shadow-sm">
        {(
          [
            { k: "all", label: t("all") },
            { k: "active", label: t("activeOnly") },
            { k: "inactive", label: t("inactiveOnly") },
          ] as { k: typeof activeFilter; label: string }[]
        ).map((opt) => (
          <button
            key={opt.k}
            onClick={() => setActiveFilter(opt.k)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === opt.k
                ? "bg-cyan-600 text-white"
                : "text-slate-600 hover:text-cyan-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-cyan-600" size={28} />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl bg-white border border-cyan-100 p-10 text-center">
          <Megaphone
            size={32}
            className="mx-auto text-cyan-300"
            strokeWidth={1.5}
          />
          <p className="mt-3 text-sm text-slate-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((a) => {
            const meta = TYPE_META[a.type] ?? TYPE_META.info;
            const Icon = meta.icon;
            return (
              <div
                key={a.id}
                className={`rounded-xl bg-white border p-5 ${
                  a.isActive ? "border-cyan-100" : "border-slate-200 opacity-75"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-2.5 ${meta.bg} ring-1 ${meta.ring} flex-shrink-0`}
                  >
                    <Icon size={18} className={meta.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {localizedTitle(a)}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-xs font-medium ${meta.bg} ${meta.text} ${meta.ring}`}
                      >
                        {t(`type.${a.type}`)}
                      </span>
                      {a.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2 py-0.5 text-xs font-medium">
                          <Check size={12} />
                          {t("active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 px-2 py-0.5 text-xs font-medium">
                          {t("inactive")}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {t(`target.${a.target}`)}
                        {a.targetValue ? `: ${a.targetValue}` : ""}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {localizedContent(a)}
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(a.startsAt).toLocaleDateString(locale)}
                      {a.endsAt
                        ? ` → ${new Date(a.endsAt).toLocaleDateString(locale)}`
                        : ` → ${t("noEnd")}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(a)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                      title={a.isActive ? t("disable") : t("enable")}
                    >
                      {a.isActive ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(a);
                        setCreating(false);
                      }}
                      className="p-1.5 rounded hover:bg-sky-50 text-sky-600"
                      title={t("edit")}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      title={t("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {(creating || editing) && (
        <AnnouncementModal
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={async (dto) => {
            setSaving(true);
            try {
              if (editing) {
                await updateAnnouncement(editing.id, dto);
              } else {
                await createAnnouncement(dto);
              }
              setCreating(false);
              setEditing(null);
              await load();
            } catch (err) {
              console.error(err);
              alert(t("saveError"));
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
          t={t}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────
function AnnouncementModal({
  initial,
  onClose,
  onSave,
  saving,
  t,
}: {
  initial: AdminAnnouncement | null;
  onClose: () => void;
  onSave: (dto: CreateAnnouncementDto) => Promise<void>;
  saving: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleAr, setTitleAr] = useState(initial?.titleAr ?? "");
  const [titleTr, setTitleTr] = useState(initial?.titleTr ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [contentAr, setContentAr] = useState(initial?.contentAr ?? "");
  const [contentTr, setContentTr] = useState(initial?.contentTr ?? "");
  const [type, setType] = useState(initial?.type ?? "info");
  const [target, setTarget] = useState(initial?.target ?? "all");
  const [targetValue, setTargetValue] = useState(initial?.targetValue ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [startsAt, setStartsAt] = useState(
    initial?.startsAt
      ? new Date(initial.startsAt).toISOString().slice(0, 16)
      : ""
  );
  const [endsAt, setEndsAt] = useState(
    initial?.endsAt ? new Date(initial.endsAt).toISOString().slice(0, 16) : ""
  );

  function submit() {
    if (!title.trim() || !content.trim()) {
      alert(t("validationError"));
      return;
    }
    onSave({
      title: title.trim(),
      titleAr: titleAr.trim() || undefined,
      titleTr: titleTr.trim() || undefined,
      content: content.trim(),
      contentAr: contentAr.trim() || undefined,
      contentTr: contentTr.trim() || undefined,
      type,
      target,
      targetValue:
        target === "all" ? undefined : targetValue.trim() || undefined,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      isActive,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-cyan-100 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-cyan-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {initial ? t("editTitle") : t("createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Titles */}
          <Field label={`${t("fieldTitle")} (EN)`} required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`${t("fieldTitle")} (AR)`}>
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                dir="rtl"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </Field>
            <Field label={`${t("fieldTitle")} (TR)`}>
              <input
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </Field>
          </div>

          {/* Content */}
          <Field label={`${t("fieldContent")} (EN)`} required>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-y"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`${t("fieldContent")} (AR)`}>
              <textarea
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                rows={3}
                dir="rtl"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-y"
              />
            </Field>
            <Field label={`${t("fieldContent")} (TR)`}>
              <textarea
                value={contentTr}
                onChange={(e) => setContentTr(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-y"
              />
            </Field>
          </div>

          {/* Type + target */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("fieldType")}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="info">{t("type.info")}</option>
                <option value="warn">{t("type.warn")}</option>
                <option value="critical">{t("type.critical")}</option>
              </select>
            </Field>
            <Field label={t("fieldTarget")}>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="all">{t("target.all")}</option>
                <option value="plan">{t("target.plan")}</option>
                <option value="company">{t("target.company")}</option>
              </select>
            </Field>
          </div>
          {target !== "all" && (
            <Field
              label={
                target === "plan"
                  ? t("targetValuePlan")
                  : t("targetValueCompany")
              }
            >
              <input
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={
                  target === "plan"
                    ? "starter / business / enterprise"
                    : "company-id"
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none font-mono"
              />
            </Field>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("fieldStartsAt")}>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </Field>
            <Field label={t("fieldEndsAt")}>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </Field>
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500"
            />
            {t("fieldActive")}
          </label>
        </div>
        <div className="px-6 py-4 border-t border-cyan-100 flex items-center justify-end gap-2 bg-sky-50/50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {initial ? t("save") : t("create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ms-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
