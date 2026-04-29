"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  X,
  Save,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getMetricCatalog,
  listScheduledReports,
  createScheduledReport,
  updateScheduledReport,
  deleteScheduledReport,
  type MetricDefinition,
  type ScheduledReport,
} from "@/lib/api/advanced";

// ============================================================================
// SCHEDULED REPORTS CRUD
// ============================================================================

export default function ScheduledPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ScheduledPage />
    </Suspense>
  );
}

function ScheduledPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const search = useSearchParams();
  const prefillMetric = search?.get("new");

  const [catalog, setCatalog] = useState<MetricDefinition[]>([]);
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ScheduledReport | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, r] = await Promise.all([
        getMetricCatalog(),
        listScheduledReports(),
      ]);
      setCatalog(c);
      setReports(r);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-open form if ?new=<metricKey>
  useEffect(() => {
    if (prefillMetric && !creatingNew && !editing) {
      setCreatingNew(true);
    }
  }, [prefillMetric, creatingNew, editing]);

  const handleToggle = async (r: ScheduledReport) => {
    try {
      const updated = await updateScheduledReport(r.id, {
        isEnabled: !r.isEnabled,
      });
      setReports((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleDelete = async (r: ScheduledReport) => {
    if (
      !confirm(
        tr(
          `Delete "${r.name}"? This stops future deliveries.`,
          `حذف "${r.name}"؟ سيتوقف الإرسال المستقبلي.`,
          `"${r.name}" silinsin mi? Gelecekteki teslimatlar durur.`
        )
      )
    )
      return;
    try {
      await deleteScheduledReport(r.id);
      setReports((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/analytics`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">ANALYTICS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr("Scheduled reports", "التقارير المجدولة", "Zamanlanmış raporlar")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Automated email digests delivered on your schedule.",
                "ملخصات بريد إلكتروني آلية تُسلَّم حسب جدولك.",
                "Zamanlamanıza göre otomatik e-posta özetleri."
              )}
            </p>
          </div>
          {!creatingNew && !editing && (
            <button
              onClick={() => setCreatingNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {tr("New report", "تقرير جديد", "Yeni rapor")}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        {(creatingNew || editing) && (
          <ScheduledReportForm
            locale={locale}
            tr={tr}
            catalog={catalog}
            editing={editing}
            prefillMetric={prefillMetric || undefined}
            onCancel={() => {
              setCreatingNew(false);
              setEditing(null);
            }}
            onSaved={(saved) => {
              setReports((prev) => {
                const idx = prev.findIndex((r) => r.id === saved.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = saved;
                  return next;
                }
                return [saved, ...prev];
              });
              setCreatingNew(false);
              setEditing(null);
            }}
          />
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : reports.length === 0 && !creatingNew ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {tr(
                "No scheduled reports yet — create your first one.",
                "لا تقارير مجدولة بعد — أنشئ أول واحد.",
                "Henüz zamanlanmış rapor yok — ilkini oluştur."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <ReportRow
                key={r.id}
                report={r}
                catalog={catalog}
                locale={locale}
                tr={tr}
                onToggle={() => handleToggle(r)}
                onEdit={() => setEditing(r)}
                onDelete={() => handleDelete(r)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// REPORT ROW
// ============================================================================

function ReportRow({
  report,
  catalog,
  locale,
  tr,
  onToggle,
  onEdit,
  onDelete,
}: {
  report: ScheduledReport;
  catalog: MetricDefinition[];
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const metricLabels = report.metrics
    .map((k) => catalog.find((c) => c.key === k)?.label[locale] ?? k)
    .slice(0, 3);
  const extra = report.metrics.length - metricLabels.length;

  const cadenceLabel = () => {
    if (report.cadence === "daily")
      return tr(`Daily at ${report.hour}:00 UTC`, `يوميًا الساعة ${report.hour}:00 UTC`, `Günlük ${report.hour}:00 UTC`);
    if (report.cadence === "weekly") {
      const dayNames = {
        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      };
      const day = dayNames[locale][report.dayOfWeek ?? 1];
      return tr(
        `Weekly on ${day} at ${report.hour}:00 UTC`,
        `أسبوعيًا يوم ${day} الساعة ${report.hour}:00 UTC`,
        `Her ${day} ${report.hour}:00 UTC`
      );
    }
    return tr(
      `Monthly on day ${report.dayOfMonth} at ${report.hour}:00 UTC`,
      `شهريًا يوم ${report.dayOfMonth} الساعة ${report.hour}:00 UTC`,
      `Her ayın ${report.dayOfMonth}. gününde ${report.hour}:00 UTC`
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            report.isEnabled
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{report.name}</h3>
            {!report.isEnabled && (
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {tr("Paused", "متوقف", "Duraklatıldı")}
              </span>
            )}
            {report.lastError && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 border border-rose-500/30">
                <AlertTriangle className="w-2.5 h-2.5" />
                {tr("Error", "خطأ", "Hata")}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {cadenceLabel()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {report.recipients.length}{" "}
              {tr("recipients", "مستلم", "alıcı")}
            </span>
            {report.lastRunAt && (
              <span>
                {tr("Last sent", "آخر إرسال", "Son gönderim")}:{" "}
                <time dir="ltr">
                  {new Date(report.lastRunAt).toLocaleDateString(
                    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US"
                  )}
                </time>
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            {metricLabels.map((lbl, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] text-foreground"
              >
                {lbl}
              </span>
            ))}
            {extra > 0 && (
              <span className="text-[10px] text-muted-foreground">
                +{extra} {tr("more", "المزيد", "daha")}
              </span>
            )}
          </div>
          {report.lastError && (
            <div className="mt-2 text-[11px] text-rose-300 bg-rose-500/10 rounded px-2 py-1 border border-rose-100">
              {report.lastError}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onToggle}
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
              report.isEnabled
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {report.isEnabled ? tr("On", "قيد التشغيل", "Açık") : tr("Off", "متوقف", "Kapalı")}
          </button>
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded text-muted-foreground hover:text-cyan-300 hover:bg-muted flex items-center justify-center"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FORM
// ============================================================================

function ScheduledReportForm({
  locale,
  tr,
  catalog,
  editing,
  prefillMetric,
  onCancel,
  onSaved,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  catalog: MetricDefinition[];
  editing: ScheduledReport | null;
  prefillMetric?: string;
  onCancel: () => void;
  onSaved: (r: ScheduledReport) => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">(
    editing?.cadence ?? "weekly"
  );
  const [hour, setHour] = useState(editing?.hour ?? 9);
  const [dayOfWeek, setDayOfWeek] = useState<number>(editing?.dayOfWeek ?? 1);
  const [dayOfMonth, setDayOfMonth] = useState<number>(
    editing?.dayOfMonth ?? 1
  );
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    editing?.metrics ?? (prefillMetric ? [prefillMetric] : [])
  );
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>(
    editing?.recipients ?? []
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dayNames = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
  }[locale];

  const addRecipient = () => {
    const v = recipientInput.trim();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setErr(tr("Invalid email", "بريد غير صالح", "Geçersiz e-posta"));
      return;
    }
    if (recipients.includes(v)) return;
    setRecipients([...recipients, v]);
    setRecipientInput("");
    setErr(null);
  };

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setErr(tr("Name required", "الاسم مطلوب", "Ad gerekli"));
      return;
    }
    if (selectedMetrics.length === 0) {
      setErr(
        tr("Select at least one metric", "اختر مقياس واحد على الأقل", "En az bir metrik seç")
      );
      return;
    }
    if (recipients.length === 0) {
      setErr(tr("Add at least one recipient", "أضف مستلم واحد على الأقل", "En az bir alıcı ekle"));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: name.trim(),
        cadence,
        hour,
        dayOfWeek: cadence === "weekly" ? dayOfWeek : null,
        dayOfMonth: cadence === "monthly" ? dayOfMonth : null,
        metrics: selectedMetrics,
        recipients,
      };
      const saved = editing
        ? await updateScheduledReport(editing.id, payload)
        : await createScheduledReport(payload);
      onSaved(saved);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          {editing
            ? tr("Edit report", "تعديل التقرير", "Raporu düzenle")
            : tr("New scheduled report", "تقرير مجدول جديد", "Yeni zamanlanmış rapor")}
        </h2>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded text-muted-foreground hover:bg-muted flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-300">
          {err}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
          {tr("Name", "الاسم", "Ad")}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={tr(
            "Weekly Sales Digest",
            "ملخص المبيعات الأسبوعي",
            "Haftalık Satış Özeti"
          )}
          maxLength={120}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
        />
      </div>

      {/* Cadence */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
          {tr("Cadence", "التكرار", "Sıklık")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["daily", "weekly", "monthly"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCadence(c)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                cadence === c
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              {c === "daily"
                ? tr("Daily", "يومي", "Günlük")
                : c === "weekly"
                  ? tr("Weekly", "أسبوعي", "Haftalık")
                  : tr("Monthly", "شهري", "Aylık")}
            </button>
          ))}
        </div>
      </div>

      {/* Day + hour pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cadence === "weekly" && (
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
              {tr("Day", "اليوم", "Gün")}
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            >
              {dayNames.map((d, i) => (
                <option key={i} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
        {cadence === "monthly" && (
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
              {tr("Day of month", "يوم الشهر", "Ayın günü")}
            </label>
            <select
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
            {tr("Hour (UTC)", "الساعة (UTC)", "Saat (UTC)")}
          </label>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
          >
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
          {tr("Include metrics", "المقاييس المضمنة", "Dahil edilen metrikler")}
        </label>
        <div className="rounded-lg border border-border bg-card p-2 space-y-1 max-h-48 overflow-y-auto">
          {catalog.map((m) => (
            <label
              key={m.key}
              className="flex items-start gap-2 p-2 rounded hover:bg-muted cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMetrics.includes(m.key)}
                onChange={() => toggleMetric(m.key)}
                className="mt-0.5 accent-sky-500"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {m.label[locale]}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {m.description[locale]}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
          {tr("Recipients", "المستلمون", "Alıcılar")}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addRecipient();
              }
            }}
            placeholder="team@example.com"
            dir="ltr"
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
          />
          <button
            onClick={addRecipient}
            disabled={!recipientInput.trim()}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
          >
            {tr("Add", "إضافة", "Ekle")}
          </button>
        </div>
        {recipients.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            {recipients.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border text-xs text-foreground"
                dir="ltr"
              >
                {r}
                <button
                  onClick={() =>
                    setRecipients(recipients.filter((x) => x !== r))
                  }
                  className="text-muted-foreground hover:text-rose-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {editing ? tr("Save changes", "حفظ", "Kaydet") : tr("Create", "إنشاء", "Oluştur")}
        </button>
      </div>
    </div>
  );
}
