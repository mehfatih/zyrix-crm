"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Power,
  Loader2,
  Zap,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  SkipForward,
  Play,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getWorkflow,
  listWorkflowExecutions,
  updateWorkflow,
  testRunWorkflow,
  type Workflow,
  type WorkflowExecution,
} from "@/lib/api/advanced";

export default function WorkflowDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const id = params?.id;

  const [wf, setWf] = useState<Workflow | null>(null);
  const [execs, setExecs] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [testing, setTesting] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [w, ex] = await Promise.all([
        getWorkflow(id),
        listWorkflowExecutions({ workflowId: id, limit: 20 }),
      ]);
      setWf(w);
      setExecs(ex.items);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleToggle = async () => {
    if (!wf) return;
    setToggling(true);
    try {
      const updated = await updateWorkflow(wf.id, {
        isEnabled: !wf.isEnabled,
      });
      setWf(updated);
    } finally {
      setToggling(false);
    }
  };

  const handleTest = async () => {
    if (!wf) return;
    setTesting(true);
    try {
      await testRunWorkflow(wf.id, {});
      setTimeout(load, 2000);
    } finally {
      setTesting(false);
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
            href={`/${locale}/workflows`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
            <Zap className="w-5 h-5" />
          </div>
          {loading || !wf ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">AUTOMATIONS</p>
              <h1 className="text-xl font-bold text-foreground truncate">
                {wf.name}
              </h1>
              {wf.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {wf.description}
                </p>
              )}
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : wf ? (
          <>
            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 ${
                  wf.isEnabled
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 hover:bg-emerald-100"
                    : "bg-muted border border-border text-foreground hover:bg-slate-200"
                }`}
              >
                {toggling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Power className="w-3.5 h-3.5" />
                )}
                {wf.isEnabled
                  ? tr("Enabled", "مُفعَّل", "Etkin")
                  : tr("Disabled", "مُعطَّل", "Devre dışı")}
              </button>
              <button
                onClick={handleTest}
                disabled={testing || !wf.isEnabled}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground disabled:opacity-50"
              >
                {testing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                {tr("Test run", "تجربة", "Test çalıştır")}
              </button>
              <Link
                href={`/${locale}/workflows/${wf.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground"
              >
                <Pencil className="w-3.5 h-3.5" />
                {tr("Edit", "تعديل", "Düzenle")}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox
                label={tr("Total runs", "إجمالي التشغيل", "Toplam çalıştırma")}
                value={String(wf.runCount)}
                tone="cyan"
              />
              <StatBox
                label={tr("Succeeded", "نجحت", "Başarılı")}
                value={String(wf.successCount)}
                tone="emerald"
              />
              <StatBox
                label={tr("Failed", "فشلت", "Başarısız")}
                value={String(wf.failureCount)}
                tone={wf.failureCount > 0 ? "rose" : "slate"}
              />
              <StatBox
                label={tr("Success rate", "نسبة النجاح", "Başarı oranı")}
                value={
                  wf.runCount > 0
                    ? `${Math.round((wf.successCount / wf.runCount) * 100)}%`
                    : "—"
                }
                tone="sky"
              />
            </div>

            {/* Executions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-cyan-300" />
                <h2 className="text-sm font-bold text-foreground">
                  {tr(
                    "Recent executions",
                    "تشغيلات أخيرة",
                    "Son çalıştırmalar"
                  )}
                </h2>
              </div>
              <ExecutionsList
                execs={execs}
                locale={locale}
                isRtl={isRtl}
                tr={tr}
              />
            </div>
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "rose" | "sky" | "slate";
}) {
  const toneClass: Record<string, string> = {
    cyan: "bg-muted border-border text-foreground",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-900",
    rose: "bg-rose-500/10 border-rose-100 text-rose-900",
    sky: "bg-muted border-border text-foreground",
    slate: "bg-muted border-border text-foreground",
  };
  return (
    <div className={`rounded-lg border p-3 ${toneClass[tone]}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
    </div>
  );
}

export function ExecutionsList({
  execs,
  locale,
  isRtl,
  tr,
  showWorkflowName = false,
}: {
  execs: WorkflowExecution[];
  locale: "en" | "ar" | "tr";
  isRtl: boolean;
  tr: (en: string, ar: string, trk: string) => string;
  showWorkflowName?: boolean;
}) {
  if (execs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {tr(
          "No executions yet. Trigger the workflow to see runs here.",
          "لا تشغيلات بعد. شغّل الـ workflow لرؤية التشغيل هنا.",
          "Henüz çalıştırma yok. Çalıştırmaları burada görmek için iş akışını tetikleyin."
        )}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-sky-50">
      {execs.map((e) => (
        <Link
          key={e.id}
          href={`/${locale}/workflows/executions/${e.id}`}
          className="flex items-center gap-3 p-3 hover:bg-muted/40"
        >
          <StatusIcon status={e.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {showWorkflowName && e.workflowName && (
                <span className="text-sm font-semibold text-foreground truncate">
                  {e.workflowName}
                </span>
              )}
              <StatusBadge status={e.status} locale={locale} tr={tr} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
              <time dir="ltr" className="tabular-nums">
                {new Date(e.queuedAt).toLocaleString(
                  locale === "ar"
                    ? "ar-SA"
                    : locale === "tr"
                      ? "tr-TR"
                      : "en-US",
                  { dateStyle: "short", timeStyle: "short" }
                )}
              </time>
              {e.attempts > 1 && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>
                    {e.attempts} {tr("attempts", "محاولات", "deneme")}
                  </span>
                </>
              )}
              {e.lastError && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-rose-300 truncate max-w-md">
                    {e.lastError}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: WorkflowExecution["status"] }) {
  if (status === "completed")
    return <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />;
  if (status === "failed")
    return <XCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />;
  if (status === "skipped_conditions")
    return <SkipForward className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
  if (status === "running")
    return <Loader2 className="w-4 h-4 text-cyan-300 animate-spin flex-shrink-0" />;
  return <Clock className="w-4 h-4 text-amber-300 flex-shrink-0" />;
}

function StatusBadge({
  status,
  locale,
  tr,
}: {
  status: WorkflowExecution["status"];
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const labels: Record<WorkflowExecution["status"], string> = {
    completed: tr("Success", "نجاح", "Başarılı"),
    failed: tr("Failed", "فشل", "Başarısız"),
    pending: tr("Pending", "معلَّق", "Beklemede"),
    running: tr("Running", "قيد التنفيذ", "Çalışıyor"),
    skipped_conditions: tr("Skipped", "تم التخطي", "Atlandı"),
  };
  const tones: Record<WorkflowExecution["status"], string> = {
    completed: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    failed: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
    pending: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    running: "bg-muted text-cyan-300 border-border",
    skipped_conditions: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] font-semibold uppercase ${tones[status]}`}
    >
      {labels[status]}
    </span>
  );
}
