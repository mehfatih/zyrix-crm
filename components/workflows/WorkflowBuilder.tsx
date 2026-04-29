"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  ChevronDown,
  Zap,
  GripVertical,
  AlertCircle,
  Webhook as WebhookIcon,
  Info,
} from "lucide-react";
import {
  getWorkflowCatalog,
  createWorkflow,
  updateWorkflow,
  type Workflow,
  type WorkflowCatalog,
  type WorkflowTriggerSpec,
  type WorkflowActionSpec,
  type WorkflowAction,
  type WorkflowCondition,
  type CreateWorkflowDto,
} from "@/lib/api/advanced";

// ============================================================================
// BUILDER — shared between /workflows/new and /workflows/:id/edit
// ============================================================================

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface Props {
  locale: "en" | "ar" | "tr";
  initial?: Workflow;
  onSaved?: () => void;
}

export function WorkflowBuilder({ locale, initial, onSaved }: Props) {
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const router = useRouter();

  const [catalog, setCatalog] = useState<WorkflowCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [triggerType, setTriggerType] = useState(initial?.trigger.type ?? "");
  const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>(
    initial?.trigger.config ?? {}
  );
  const [actions, setActions] = useState<WorkflowAction[]>(
    initial?.actions ?? []
  );
  const [conditions, setConditions] = useState<WorkflowCondition[]>(
    initial?.conditions ?? []
  );
  const [isEnabled, setIsEnabled] = useState(initial?.isEnabled ?? true);

  useEffect(() => {
    getWorkflowCatalog()
      .then(setCatalog)
      .catch((e) => setErr(e?.message || "Failed to load catalog"))
      .finally(() => setCatalogLoading(false));
  }, []);

  const currentTriggerSpec: WorkflowTriggerSpec | undefined = useMemo(
    () => catalog?.triggers.find((t) => t.type === triggerType),
    [catalog, triggerType]
  );

  const handleSave = async () => {
    setErr(null);
    if (!name.trim()) {
      setErr(
        tr("Please enter a name", "أدخل اسمًا", "Lütfen bir ad girin")
      );
      return;
    }
    if (!triggerType) {
      setErr(
        tr(
          "Please pick a trigger",
          "اختر مُحفّزًا",
          "Lütfen bir tetikleyici seçin"
        )
      );
      return;
    }
    if (actions.length === 0) {
      setErr(
        tr(
          "Add at least one action",
          "أضف إجراء واحد على الأقل",
          "En az bir eylem ekleyin"
        )
      );
      return;
    }

    setSaving(true);
    try {
      const dto: CreateWorkflowDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        trigger: { type: triggerType, config: triggerConfig },
        actions,
        conditions,
        isEnabled,
      };
      if (initial) {
        await updateWorkflow(initial.id, dto);
      } else {
        await createWorkflow(dto);
      }
      if (onSaved) onSaved();
      else router.push(`/${locale}/workflows`);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  if (catalogLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
        {tr(
          "Could not load the workflow catalog.",
          "تعذّر تحميل كتالوج الـ workflow.",
          "İş akışı kataloğu yüklenemedi."
        )}
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/workflows`}
          className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
        </Link>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {initial
              ? tr("Edit workflow", "تعديل workflow", "İş akışını düzenle")
              : tr(
                  "New workflow",
                  "workflow جديد",
                  "Yeni iş akışı"
                )}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {tr(
              "Trigger + conditions + action chain = one automation.",
              "مُحفِّز + شروط + سلسلة إجراءات = أتمتة واحدة.",
              "Tetikleyici + koşullar + eylem zinciri = bir otomasyon."
            )}
          </p>
        </div>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {err}
        </div>
      )}

      {/* Basic info */}
      <SectionCard>
        <div className="space-y-3">
          <div>
            <Label>{tr("Name", "الاسم", "Ad")}</Label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr(
                "Welcome new customers via WhatsApp",
                "رحّب بالعملاء الجدد عبر واتساب",
                "Yeni müşterileri WhatsApp ile karşıla"
              )}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <Label>
              {tr(
                "Description (optional)",
                "الوصف (اختياري)",
                "Açıklama (isteğe bağlı)"
              )}
            </Label>
            <input
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-300 focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              {tr(
                "Enable this workflow (fires when triggered)",
                "فعّل هذا الـ workflow (يشتغل عند التحفيز)",
                "Bu iş akışını etkinleştir (tetiklendiğinde çalışır)"
              )}
            </span>
          </label>
        </div>
      </SectionCard>

      {/* Trigger */}
      <SectionCard
        title={tr("1. When this happens", "1. عندما يحدث", "1. Bu olduğunda")}
        subtitle={tr(
          "Pick the event that starts the workflow",
          "اختر الحدث الذي يبدأ الـ workflow",
          "İş akışını başlatan olayı seçin"
        )}
      >
        <TriggerPicker
          triggers={catalog.triggers}
          selected={triggerType}
          onChange={(type) => {
            setTriggerType(type);
            setTriggerConfig({});
          }}
          locale={locale}
        />
        {currentTriggerSpec &&
          currentTriggerSpec.configFields.length > 0 && (
            <div className="mt-3 space-y-3 pt-3 border-t border-border">
              {currentTriggerSpec.configFields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={triggerConfig[field.key]}
                  onChange={(v) =>
                    setTriggerConfig({ ...triggerConfig, [field.key]: v })
                  }
                  locale={locale}
                />
              ))}
            </div>
          )}
        {triggerType === "webhook.received" && initial && (
          <div className="mt-3 rounded-lg bg-muted border border-border p-3 text-xs">
            <div className="flex items-start gap-2">
              <WebhookIcon className="w-4 h-4 text-cyan-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground">
                  {tr(
                    "External webhook URL",
                    "رابط الـ webhook الخارجي",
                    "Harici webhook URL'si"
                  )}
                </div>
                <code className="block mt-1 px-2 py-1 bg-card border border-border rounded text-[10px] text-foreground overflow-x-auto break-all" dir="ltr">
                  {typeof window !== "undefined"
                    ? `${window.location.protocol}//api.${window.location.host.replace(/^(www\.|crm\.)/, "")}/wh/${initial.id}`
                    : `/wh/${initial.id}`}
                </code>
                <p className="text-muted-foreground mt-1">
                  {tr(
                    "POST JSON to this URL from your external system.",
                    "ابعت POST JSON إلى هذا الرابط من نظامك الخارجي.",
                    "Harici sisteminizden bu URL'ye JSON POST gönderin."
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Conditions */}
      <SectionCard
        title={tr(
          "2. Only if (optional)",
          "2. فقط إذا (اختياري)",
          "2. Yalnızca şunlar varsa (isteğe bağlı)"
        )}
        subtitle={tr(
          "All conditions must match for the actions to run",
          "يجب أن تتطابق كل الشروط لتنفيذ الإجراءات",
          "Eylemlerin çalışması için tüm koşulların eşleşmesi gerekir"
        )}
      >
        <ConditionBuilder
          conditions={conditions}
          onChange={setConditions}
          operators={catalog.conditionOperators}
          locale={locale}
          tr={tr}
        />
      </SectionCard>

      {/* Actions */}
      <SectionCard
        title={tr(
          "3. Then do these",
          "3. ثم نفّذ هذه",
          "3. Sonra bunları yap"
        )}
        subtitle={tr(
          "Actions run in order. If one fails and stop-on-error is on, the rest skip.",
          "الإجراءات تعمل بالترتيب. لو فشل إجراء وخاصية التوقف عند الخطأ مُفعَّلة، الباقي يُتخطى.",
          "Eylemler sırayla çalışır. Bir eylem başarısız olursa ve hata durdurma açıksa, kalanlar atlanır."
        )}
      >
        <ActionChain
          actions={actions}
          availableActions={catalog.actions}
          onChange={setActions}
          locale={locale}
          tr={tr}
          triggerPayloadFields={currentTriggerSpec?.payloadFields ?? []}
        />
      </SectionCard>

      {/* Save */}
      <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2 z-10">
        <Link
          href={`/${locale}/workflows`}
          className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-50 shadow"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {initial
            ? tr("Save changes", "حفظ التغييرات", "Değişiklikleri kaydet")
            : tr("Create workflow", "إنشاء workflow", "İş akışı oluştur")}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {title && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
      {children}
    </label>
  );
}

function TriggerPicker({
  triggers,
  selected,
  onChange,
  locale,
}: {
  triggers: WorkflowTriggerSpec[];
  selected: string;
  onChange: (type: string) => void;
  locale: "en" | "ar" | "tr";
}) {
  const byCategory: Record<string, WorkflowTriggerSpec[]> = {};
  for (const t of triggers) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }
  const catLabels: Record<string, { en: string; ar: string; tr: string }> = {
    crm: { en: "CRM events", ar: "أحداث CRM", tr: "CRM olayları" },
    schedule: { en: "Schedule", ar: "الجدولة", tr: "Zamanlama" },
    external: { en: "External", ar: "خارجي", tr: "Harici" },
  };

  return (
    <div className="space-y-4">
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat}>
          <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
            {catLabels[cat]?.[locale] ?? cat}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((t) => {
              const isSelected = selected === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => onChange(t.type)}
                  className={`text-left rtl:text-right p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-sky-400 bg-muted ring-2 ring-cyan-500/30"
                      : "border-border bg-card hover:border-sky-300"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">
                    {t.label[locale]}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {t.description[locale]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  locale,
}: {
  field: {
    key: string;
    label: { en: string; ar: string; tr: string };
    type: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: { en: string; ar: string; tr: string };
  };
  value: unknown;
  onChange: (v: unknown) => void;
  locale: "en" | "ar" | "tr";
}) {
  const labelStr = field.label[locale];
  return (
    <div>
      <Label>
        {labelStr}
        {field.required && <span className="text-rose-300 ms-1">*</span>}
      </Label>
      {field.type === "textarea" ? (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
        />
      ) : field.type === "select" ? (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
        >
          <option value="">
            {locale === "ar"
              ? "— اختر —"
              : locale === "tr"
                ? "— seç —"
                : "— select —"}
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt || "(any)"}
            </option>
          ))}
        </select>
      ) : field.type === "number" ? (
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={field.placeholder}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ) : field.type === "boolean" ? (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-300 focus:ring-primary"
          />
          <span className="text-sm text-foreground">{labelStr}</span>
        </label>
      ) : (
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}
      {field.helpText && (
        <p className="text-[11px] text-muted-foreground mt-1 flex items-start gap-1">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          {field.helpText[locale]}
        </p>
      )}
    </div>
  );
}

function ConditionBuilder({
  conditions,
  onChange,
  operators,
  locale,
  tr,
}: {
  conditions: WorkflowCondition[];
  onChange: (v: WorkflowCondition[]) => void;
  operators: string[];
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const add = () =>
    onChange([...conditions, { field: "", operator: "eq", value: "" }]);
  const remove = (i: number) =>
    onChange(conditions.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<WorkflowCondition>) =>
    onChange(conditions.map((c, idx) => (idx === i ? { ...c, ...p } : c)));

  return (
    <div className="space-y-2">
      {conditions.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          {tr(
            "No conditions — the workflow always runs when triggered.",
            "لا شروط — الـ workflow دائمًا يعمل عند التحفيز.",
            "Koşul yok — iş akışı tetiklendiğinde her zaman çalışır."
          )}
        </p>
      )}
      {conditions.map((c, i) => (
        <div
          key={i}
          className="flex items-center gap-2 flex-wrap bg-muted border border-border rounded-lg p-2"
        >
          <input
            type="text"
            value={c.field}
            onChange={(e) => patch(i, { field: e.target.value })}
            placeholder={tr(
              "field (e.g. deal.value)",
              "حقل (مثال deal.value)",
              "alan (örn. deal.value)"
            )}
            className="flex-1 min-w-[140px] px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary font-mono bg-card"
          />
          <select
            value={c.operator}
            onChange={(e) => patch(i, { operator: e.target.value })}
            className="px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-card"
          >
            {operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {!["isTrue", "isFalse", "isEmpty", "isNotEmpty"].includes(
            c.operator
          ) && (
            <input
              type="text"
              value={String(c.value ?? "")}
              onChange={(e) => patch(i, { value: e.target.value })}
              placeholder={tr("value", "قيمة", "değer")}
              className="flex-1 min-w-[100px] px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            />
          )}
          <button
            onClick={() => remove(i)}
            className="w-7 h-7 rounded text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center"
            title={tr("Remove", "إزالة", "Kaldır")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-dashed border-sky-300 hover:border-sky-300 hover:bg-muted rounded-lg text-xs font-semibold text-muted-foreground"
      >
        <Plus className="w-3.5 h-3.5" />
        {tr("Add condition", "إضافة شرط", "Koşul ekle")}
      </button>
    </div>
  );
}

function ActionChain({
  actions,
  availableActions,
  onChange,
  locale,
  tr,
  triggerPayloadFields,
}: {
  actions: WorkflowAction[];
  availableActions: WorkflowActionSpec[];
  onChange: (v: WorkflowAction[]) => void;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  triggerPayloadFields: string[];
}) {
  const [showPicker, setShowPicker] = useState(false);

  const addAction = (type: string) => {
    const spec = availableActions.find((a) => a.type === type);
    if (!spec) return;
    onChange([
      ...actions,
      { id: uid(), type, config: {}, stopOnError: true },
    ]);
    setShowPicker(false);
  };
  const removeAction = (id: string) =>
    onChange(actions.filter((a) => a.id !== id));
  const patchAction = (id: string, p: Partial<WorkflowAction>) =>
    onChange(actions.map((a) => (a.id === id ? { ...a, ...p } : a)));
  const patchConfig = (id: string, key: string, val: unknown) =>
    onChange(
      actions.map((a) =>
        a.id === id ? { ...a, config: { ...a.config, [key]: val } } : a
      )
    );
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...actions];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === actions.length - 1) return;
    const next = [...actions];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {actions.map((a, i) => {
        const spec = availableActions.find((x) => x.type === a.type);
        if (!spec) {
          return (
            <div
              key={a.id}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between"
            >
              <span>
                {tr(
                  `Unknown action: ${a.type}`,
                  `إجراء غير معروف: ${a.type}`,
                  `Bilinmeyen eylem: ${a.type}`
                )}
              </span>
              <button onClick={() => removeAction(a.id)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }
        return (
          <div
            key={a.id}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Action header */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="w-5 h-5 text-muted-foreground hover:text-cyan-300 disabled:opacity-30 text-xs"
                title={tr("Move up", "فوق", "Yukarı")}
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === actions.length - 1}
                className="w-5 h-5 text-muted-foreground hover:text-cyan-300 disabled:opacity-30 text-xs"
                title={tr("Move down", "تحت", "Aşağı")}
              >
                ▼
              </button>
              <GripVertical className="w-3.5 h-3.5 text-slate-300" />
              <span className="w-5 h-5 rounded-full bg-sky-100 text-cyan-300 text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-foreground flex-1 truncate">
                {spec.label[locale]}
              </span>
              <button
                onClick={() => removeAction(a.id)}
                className="text-muted-foreground hover:text-rose-300"
                title={tr("Remove", "إزالة", "Kaldır")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Config */}
            <div className="p-3 space-y-3">
              {spec.configFields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={a.config[field.key]}
                  onChange={(v) => patchConfig(a.id, field.key, v)}
                  locale={locale}
                />
              ))}

              {/* Advanced */}
              <details className="text-xs">
                <summary className="text-muted-foreground cursor-pointer hover:text-foreground select-none flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  {tr("Advanced", "متقدم", "Gelişmiş")}
                </summary>
                <div className="mt-2 space-y-2 pt-2 border-t border-sky-50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={a.stopOnError !== false}
                      onChange={(e) =>
                        patchAction(a.id, { stopOnError: e.target.checked })
                      }
                      className="w-3.5 h-3.5 rounded text-cyan-300"
                    />
                    <span className="text-xs text-muted-foreground">
                      {tr(
                        "Stop the chain if this action fails",
                        "أوقف السلسلة لو فشل هذا الإجراء",
                        "Bu eylem başarısız olursa zinciri durdur"
                      )}
                    </span>
                  </label>
                  <div>
                    <Label>
                      {tr(
                        "Delay before running (seconds, max 3600)",
                        "تأخير قبل التشغيل (ثواني، حد أقصى 3600)",
                        "Çalıştırmadan önce gecikme (saniye, maks 3600)"
                      )}
                    </Label>
                    <input
                      type="number"
                      min={0}
                      max={3600}
                      value={a.delaySeconds ?? ""}
                      onChange={(e) =>
                        patchAction(a.id, {
                          delaySeconds:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>
        );
      })}

      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-card border border-dashed border-sky-300 hover:border-sky-300 hover:bg-muted rounded-lg text-xs font-semibold text-muted-foreground"
        >
          <Plus className="w-3.5 h-3.5" />
          {tr("Add action", "إضافة إجراء", "Eylem ekle")}
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-muted/40 p-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-semibold text-foreground">
              {tr("Pick an action", "اختر إجراء", "Eylem seç")}
            </span>
            <button
              onClick={() => setShowPicker(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {availableActions.map((a) => (
              <button
                key={a.type}
                onClick={() => addAction(a.type)}
                className="text-left rtl:text-right p-2 bg-card border border-border hover:border-sky-300 rounded text-xs"
              >
                <div className="font-semibold text-foreground">
                  {a.label[locale]}
                </div>
                <div className="text-muted-foreground line-clamp-1 text-[10px] mt-0.5">
                  {a.description[locale]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Templating hint */}
      {triggerPayloadFields.length > 0 && actions.length > 0 && (
        <div className="rounded-lg bg-muted/60 border border-border p-2.5 text-[11px]">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">
                {tr(
                  "Available variables for this trigger",
                  "المتغيرات المتاحة لهذا المُحفِّز",
                  "Bu tetikleyici için kullanılabilir değişkenler"
                )}
              </div>
              <div className="text-muted-foreground font-mono text-[10px] mt-1 flex flex-wrap gap-1" dir="ltr">
                {triggerPayloadFields.map((f) => (
                  <code
                    key={f}
                    className="px-1.5 py-0.5 bg-card border border-border rounded"
                  >
                    {`{{${f}}}`}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
