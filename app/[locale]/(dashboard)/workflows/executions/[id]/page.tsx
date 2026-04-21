"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  SkipForward,
  Clock,
  Play,
  AlertCircle,
  Code2,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getWorkflowExecution,
  type WorkflowExecution,
  type WorkflowExecutionStep,
} from "@/lib/api/advanced";

export default function ExecutionDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const id = params?.id;

  const [exec, setExec] = useState<WorkflowExecution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getWorkflowExecution(id)
      .then(setExec)
      .catch((e) => setError(e?.message || "Failed"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-3xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/workflows/executions`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-cyan-700"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
            <WorkflowIcon className="w-5 h-5" />
          </div>
          {loading || !exec ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
          ) : (
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-cyan-900 truncate">
                {exec.workflowName ??
                  tr("Execution", "تنفيذ", "Yürütme")}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {exec.id}
              </p>
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : exec ? (
          <>
            {/* Summary */}
            <div className="rounded-xl border border-sky-100 bg-white p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">
                    {tr("Status", "الحالة", "Durum")}
                  </div>
                  <StatusPill
                    status={exec.status}
                    locale={locale}
                    tr={tr}
                    large
                  />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">
                    {tr("Attempts", "محاولات", "Denemeler")}
                  </div>
                  <div className="text-sm font-semibold text-cyan-900 mt-1 tabular-nums">
                    {exec.attempts}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">
                    {tr("Queued", "في الانتظار", "Sıraya alındı")}
                  </div>
                  <div
                    className="text-[11px] text-slate-700 mt-1 tabular-nums"
                    dir="ltr"
                  >
                    {new Date(exec.queuedAt).toLocaleString(
                      locale === "ar"
                        ? "ar-SA"
                        : locale === "tr"
                          ? "tr-TR"
                          : "en-US",
                      { dateStyle: "short", timeStyle: "medium" }
                    )}
                  </div>
                </div>
                {exec.finishedAt && (
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-semibold">
                      {tr("Finished", "انتهى", "Bitti")}
                    </div>
                    <div
                      className="text-[11px] text-slate-700 mt-1 tabular-nums"
                      dir="ltr"
                    >
                      {new Date(exec.finishedAt).toLocaleString(
                        locale === "ar"
                          ? "ar-SA"
                          : locale === "tr"
                            ? "tr-TR"
                            : "en-US",
                        { dateStyle: "short", timeStyle: "medium" }
                      )}
                    </div>
                  </div>
                )}
              </div>

              {exec.lastError && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-0.5">
                      {tr("Last error", "آخر خطأ", "Son hata")}
                    </div>
                    <span>{exec.lastError}</span>
                  </div>
                </div>
              )}

              {exec.nextRetryAt && exec.status === "pending" && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {tr(
                      "Retrying at",
                      "إعادة المحاولة في",
                      "Yeniden deneme zamanı"
                    )}{" "}
                    <time dir="ltr" className="tabular-nums">
                      {new Date(exec.nextRetryAt).toLocaleString(
                        locale === "ar"
                          ? "ar-SA"
                          : locale === "tr"
                            ? "tr-TR"
                            : "en-US",
                        { dateStyle: "short", timeStyle: "medium" }
                      )}
                    </time>
                  </span>
                </div>
              )}
            </div>

            {/* Step timeline */}
            <div>
              <h2 className="text-sm font-bold text-cyan-900 mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                {tr("Action steps", "خطوات الإجراءات", "Eylem adımları")}
              </h2>
              <StepTimeline
                steps={exec.stepResults}
                locale={locale}
                tr={tr}
              />
            </div>

            {/* Trigger payload */}
            <details className="rounded-xl border border-sky-100 bg-white">
              <summary className="cursor-pointer p-3 flex items-center gap-2 text-sm font-semibold text-cyan-900 hover:bg-sky-50/40">
                <Code2 className="w-4 h-4" />
                {tr(
                  "Trigger payload",
                  "محتوى المُحفِّز",
                  "Tetikleyici yükü"
                )}
              </summary>
              <div className="border-t border-sky-100 p-3">
                <pre
                  className="text-[11px] font-mono bg-slate-50 border border-slate-200 rounded p-2 overflow-x-auto text-slate-700"
                  dir="ltr"
                >
                  {JSON.stringify(exec.triggerPayload, null, 2)}
                </pre>
              </div>
            </details>
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// STEP TIMELINE
// ============================================================================

function StepTimeline({
  steps,
  locale,
  tr,
}: {
  steps: WorkflowExecutionStep[];
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  if (steps.length === 0) {
    return (
      <div className="rounded-xl border border-sky-100 bg-white p-6 text-center text-xs text-slate-500">
        {tr(
          "No steps recorded yet.",
          "لا خطوات مُسجَّلة بعد.",
          "Henüz kayıtlı adım yok."
        )}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const duration =
          new Date(step.finishedAt).getTime() -
          new Date(step.startedAt).getTime();
        return (
          <div
            key={`${step.actionId}-${i}`}
            className={`rounded-xl border overflow-hidden ${
              step.status === "success"
                ? "border-emerald-100 bg-white"
                : step.status === "failed"
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-slate-200 bg-slate-50/30"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <StepIcon status={step.status} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-cyan-900">
                  {step.actionType}
                </div>
                <div className="text-[11px] text-slate-500 tabular-nums">
                  {duration}ms
                </div>
              </div>
              <StatusPill status={step.status} locale={locale} tr={tr} />
            </div>
            {step.error && (
              <div className="px-3 pb-3">
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
                  {step.error}
                </div>
              </div>
            )}
            {step.output !== undefined && step.output !== null && (
              <details className="px-3 pb-3">
                <summary className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-700">
                  {tr("Output", "المخرجات", "Çıktı")}
                </summary>
                <pre
                  className="mt-1 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded p-2 overflow-x-auto text-slate-700"
                  dir="ltr"
                >
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepIcon({
  status,
}: {
  status: WorkflowExecutionStep["status"];
}) {
  if (status === "success")
    return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
  if (status === "failed")
    return <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
  return <SkipForward className="w-4 h-4 text-slate-500 flex-shrink-0" />;
}

function StatusPill({
  status,
  locale,
  tr,
  large,
}: {
  status: string;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  large?: boolean;
}) {
  const labels: Record<string, string> = {
    completed: tr("Success", "نجاح", "Başarılı"),
    success: tr("Success", "نجاح", "Başarılı"),
    failed: tr("Failed", "فشل", "Başarısız"),
    pending: tr("Pending", "معلَّق", "Beklemede"),
    running: tr("Running", "قيد التنفيذ", "Çalışıyor"),
    skipped: tr("Skipped", "تم التخطي", "Atlandı"),
    skipped_conditions: tr("Skipped", "تم التخطي", "Atlandı"),
  };
  const tones: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    running: "bg-cyan-50 text-cyan-700 border-cyan-200",
    skipped: "bg-slate-50 text-slate-600 border-slate-200",
    skipped_conditions: "bg-slate-50 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center border rounded font-semibold uppercase ${
        large ? "px-2 py-1 text-xs mt-1" : "px-1.5 py-0.5 text-[10px]"
      } ${tones[status] ?? tones.pending}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
