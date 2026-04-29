"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Pencil,
  History,
  Power,
  ArrowRight,
  Calendar,
  Webhook,
  Users as UsersIcon,
  Briefcase,
  CheckSquare as CheckSquareIcon,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listWorkflows,
  updateWorkflow,
  deleteWorkflow,
  testRunWorkflow,
  type Workflow,
} from "@/lib/api/advanced";

// ============================================================================
// WORKFLOWS LIST
// ============================================================================

export default function WorkflowsListPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const router = useRouter();

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; ok: boolean; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listWorkflows();
      setWorkflows(data);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (w: Workflow) => {
    setToggling(w.id);
    try {
      await updateWorkflow(w.id, { isEnabled: !w.isEnabled });
      setWorkflows((ws) =>
        ws.map((x) => (x.id === w.id ? { ...x, isEnabled: !x.isEnabled } : x))
      );
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    } finally {
      setToggling(null);
    }
  };

  const handleTestRun = async (w: Workflow) => {
    setTesting(w.id);
    setTestResult(null);
    try {
      const res = await testRunWorkflow(w.id, {});
      setTestResult({
        id: w.id,
        ok: true,
        msg: tr(
          `Test queued (execution ${res.executionId.slice(0, 8)})`,
          `تجربة في قائمة الانتظار (${res.executionId.slice(0, 8)})`,
          `Test sıraya alındı (${res.executionId.slice(0, 8)})`
        ),
      });
      setTimeout(() => setTestResult(null), 4000);
    } catch (e: any) {
      setTestResult({
        id: w.id,
        ok: false,
        msg: e?.response?.data?.error?.message || e?.message,
      });
    } finally {
      setTesting(null);
    }
  };

  const handleDelete = async (w: Workflow) => {
    if (
      !confirm(
        tr(
          `Delete workflow "${w.name}"? Its execution history will be removed too.`,
          `حذف الـ workflow "${w.name}"؟ سيتم حذف سجل التنفيذ أيضًا.`,
          `"${w.name}" iş akışı silinsin mi? Yürütme geçmişi de silinir.`
        )
      )
    )
      return;
    try {
      await deleteWorkflow(w.id);
      setWorkflows((ws) => ws.filter((x) => x.id !== w.id));
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-6xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">AUTOMATIONS</p>
              <h1 className="text-2xl font-bold text-foreground">
                {tr("Automations", "الأتمتة", "Otomasyonlar")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {tr(
                  "Build workflows that react to CRM events and run actions automatically.",
                  "ابنِ workflows بتتفاعل مع أحداث CRM وتنفذ إجراءات تلقائيًا.",
                  "CRM olaylarına tepki veren ve otomatik eylemler çalıştıran iş akışları oluşturun."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/workflows/executions`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground"
            >
              <History className="w-3.5 h-3.5" />
              {tr("History", "السجل", "Geçmiş")}
            </Link>
            <Link
              href={`/${locale}/workflows/new`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {tr("New workflow", "workflow جديد", "Yeni iş akışı")}
            </Link>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : workflows.length === 0 ? (
          <EmptyState locale={locale} tr={tr} />
        ) : (
          <div className="space-y-3">
            {workflows.map((w) => (
              <WorkflowCard
                key={w.id}
                workflow={w}
                locale={locale}
                isRtl={isRtl}
                tr={tr}
                isToggling={toggling === w.id}
                isTesting={testing === w.id}
                testResult={testResult?.id === w.id ? testResult : null}
                onToggle={() => handleToggle(w)}
                onTest={() => handleTestRun(w)}
                onDelete={() => handleDelete(w)}
                onEdit={() => router.push(`/${locale}/workflows/${w.id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function EmptyState({
  locale,
  tr,
}: {
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center mb-4">
        <Zap className="w-8 h-8 text-cyan-300" />
      </div>
      <h2 className="text-lg font-bold text-foreground">
        {tr(
          "No automations yet",
          "لا أتمتة بعد",
          "Henüz otomasyon yok"
        )}
      </h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
        {tr(
          "Build your first automation: send a WhatsApp welcome when a customer signs up, or create a follow-up task when a deal hits proposal stage.",
          "ابنِ أول أتمتة: ابعت رسالة ترحيب واتساب لما عميل يسجّل، أو أنشئ مهمة متابعة لما صفقة توصل لمرحلة العرض.",
          "İlk otomasyonunuzu oluşturun: bir müşteri kaydolduğunda WhatsApp karşılama gönderin veya bir anlaşma teklif aşamasına geldiğinde takip görevi oluşturun."
        )}
      </p>
      <Link
        href={`/${locale}/workflows/new`}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        {tr("Create workflow", "إنشاء workflow", "İş akışı oluştur")}
      </Link>
    </div>
  );
}

function WorkflowCard({
  workflow,
  locale,
  isRtl,
  tr,
  isToggling,
  isTesting,
  testResult,
  onToggle,
  onTest,
  onDelete,
  onEdit,
}: {
  workflow: Workflow;
  locale: "en" | "ar" | "tr";
  isRtl: boolean;
  tr: (en: string, ar: string, trk: string) => string;
  isToggling: boolean;
  isTesting: boolean;
  testResult: { ok: boolean; msg: string } | null;
  onToggle: () => void;
  onTest: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const totalRuns = workflow.runCount;
  const successRate =
    totalRuns > 0
      ? Math.round((workflow.successCount / totalRuns) * 100)
      : 0;

  const triggerIcon = triggerIconFor(workflow.trigger.type);
  const triggerLabel = triggerLabelFor(workflow.trigger.type, locale);

  return (
    <div
      className={`rounded-xl border bg-card p-4 ${
        workflow.isEnabled ? "border-border" : "border-border opacity-75"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Trigger icon */}
        <div
          className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${
            workflow.isEnabled
              ? "bg-gradient-to-br from-sky-100 to-sky-200 text-cyan-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {triggerIcon}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <Link
                href={`/${locale}/workflows/${workflow.id}`}
                className="text-base font-semibold text-foreground hover:text-cyan-300 truncate block"
              >
                {workflow.name}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>{triggerLabel}</span>
                <span className="text-slate-300">·</span>
                <span>
                  {workflow.actions.length}{" "}
                  {tr("actions", "إجراءات", "eylem")}
                </span>
                {workflow.conditions.length > 0 && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>
                      {workflow.conditions.length}{" "}
                      {tr("conditions", "شروط", "koşul")}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <StatChip
                icon={<Play className="w-3 h-3" />}
                value={workflow.runCount}
                label={tr("runs", "تشغيل", "çalıştırma")}
                tone="cyan"
              />
              {totalRuns > 0 && (
                <>
                  <StatChip
                    icon={<CheckCircle2 className="w-3 h-3" />}
                    value={workflow.successCount}
                    label={tr("ok", "تمام", "ok")}
                    tone="emerald"
                  />
                  {workflow.failureCount > 0 && (
                    <StatChip
                      icon={<XCircle className="w-3 h-3" />}
                      value={workflow.failureCount}
                      label={tr("fail", "فشل", "hata")}
                      tone="rose"
                    />
                  )}
                  <StatChip
                    icon={null}
                    value={`${successRate}%`}
                    label=""
                    tone={
                      successRate >= 90
                        ? "emerald"
                        : successRate >= 60
                          ? "amber"
                          : "rose"
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* Last error */}
          {workflow.lastError && (
            <div className="mt-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2 py-1.5 text-xs text-rose-300 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{workflow.lastError}</span>
            </div>
          )}

          {/* Test result toast */}
          {testResult && (
            <div
              className={`mt-2 rounded-lg border px-2 py-1.5 text-xs flex items-start gap-1.5 ${
                testResult.ok
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.msg}</span>
            </div>
          )}

          {/* Actions row */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onToggle}
              disabled={isToggling}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold disabled:opacity-50 ${
                workflow.isEnabled
                  ? "bg-emerald-500/10 text-emerald-800 hover:bg-emerald-100 border border-emerald-500/30"
                  : "bg-muted text-foreground hover:bg-slate-200 border border-border"
              }`}
            >
              {isToggling ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Power className="w-3 h-3" />
              )}
              {workflow.isEnabled
                ? tr("Enabled", "مُفعَّل", "Etkin")
                : tr("Disabled", "مُعطَّل", "Devre dışı")}
            </button>
            <button
              onClick={onTest}
              disabled={isTesting || !workflow.isEnabled}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-border hover:bg-muted rounded-md text-[11px] font-semibold text-foreground disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              {tr("Test run", "تجربة", "Test çalıştır")}
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-border hover:bg-muted rounded-md text-[11px] font-semibold text-foreground"
            >
              <Pencil className="w-3 h-3" />
              {tr("Edit", "تعديل", "Düzenle")}
            </button>
            <Link
              href={`/${locale}/workflows/${workflow.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-border hover:bg-muted rounded-md text-[11px] font-semibold text-foreground"
            >
              <History className="w-3 h-3" />
              {tr("Runs", "تشغيلات", "Çalıştırmalar")}
            </Link>
            <div className="flex-1" />
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-rose-500/30 hover:bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-md text-[11px] font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              {tr("Delete", "حذف", "Sil")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tone: "cyan" | "emerald" | "rose" | "amber";
}) {
  const toneClass: Record<string, string> = {
    cyan: "bg-muted text-cyan-300 border-border",
    emerald: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    rose: "bg-rose-500/10 text-rose-300 border border-rose-500/30 border-rose-100",
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${toneClass[tone]}`}
    >
      {icon}
      {value}
      {label && <span className="opacity-70">{label}</span>}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────

function triggerIconFor(type: string) {
  if (type.startsWith("customer"))
    return <UsersIcon className="w-5 h-5" />;
  if (type.startsWith("deal")) return <Briefcase className="w-5 h-5" />;
  if (type.startsWith("activity"))
    return <CheckSquareIcon className="w-5 h-5" />;
  if (type.startsWith("schedule")) return <Clock className="w-5 h-5" />;
  if (type.startsWith("webhook")) return <Webhook className="w-5 h-5" />;
  return <Zap className="w-5 h-5" />;
}

function triggerLabelFor(type: string, locale: string): string {
  const labels: Record<string, { en: string; ar: string; tr: string }> = {
    "customer.created": {
      en: "New customer",
      ar: "عميل جديد",
      tr: "Yeni müşteri",
    },
    "customer.status_changed": {
      en: "Customer status changed",
      ar: "تغيّر حالة العميل",
      tr: "Müşteri durumu değişti",
    },
    "deal.created": {
      en: "New deal",
      ar: "صفقة جديدة",
      tr: "Yeni anlaşma",
    },
    "deal.stage_changed": {
      en: "Deal moved stage",
      ar: "تغيّر مرحلة الصفقة",
      tr: "Anlaşma aşaması",
    },
    "deal.won": { en: "Deal won", ar: "فوز بصفقة", tr: "Anlaşma kazanıldı" },
    "deal.lost": { en: "Deal lost", ar: "فقدان صفقة", tr: "Anlaşma kaybedildi" },
    "activity.completed": {
      en: "Activity completed",
      ar: "نشاط مكتمل",
      tr: "Etkinlik tamamlandı",
    },
    "schedule.daily": { en: "Daily", ar: "يومي", tr: "Günlük" },
    "schedule.weekly": { en: "Weekly", ar: "أسبوعي", tr: "Haftalık" },
    "webhook.received": {
      en: "Webhook",
      ar: "webhook",
      tr: "Webhook",
    },
  };
  const label = labels[type];
  return label ? label[locale as "en" | "ar" | "tr"] : type;
}
