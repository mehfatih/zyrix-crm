"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ExecutionsList } from "../[id]/page";
import {
  listWorkflowExecutions,
  type WorkflowExecution,
} from "@/lib/api/advanced";

const STATUSES = [
  "",
  "pending",
  "running",
  "completed",
  "failed",
  "skipped_conditions",
];

export default function ExecutionsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [items, setItems] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [total, setTotal] = useState(0);

  const load = async (opts: { silent?: boolean } = {}) => {
    if (!opts.silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await listWorkflowExecutions({
        status: status || undefined,
        limit: 100,
      });
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const statusLabel = (s: string) => {
    if (!s) return tr("All", "الكل", "Tümü");
    return s === "completed"
      ? tr("Success", "نجاح", "Başarılı")
      : s === "failed"
        ? tr("Failed", "فشل", "Başarısız")
        : s === "pending"
          ? tr("Pending", "معلَّق", "Beklemede")
          : s === "running"
            ? tr("Running", "قيد التنفيذ", "Çalışıyor")
            : tr("Skipped", "تم التخطي", "Atlandı");
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-5xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/workflows`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
            <History className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">AUTOMATIONS</p>
            <h1 className="text-xl font-bold text-foreground">
              {tr("Execution history", "سجل التنفيذ", "Yürütme geçmişi")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {total}{" "}
              {tr("total executions", "إجمالي تنفيذ", "toplam yürütme")}
            </p>
          </div>
          <button
            onClick={() => load({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {tr("Refresh", "تحديث", "Yenile")}
          </button>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s || "all"}
              onClick={() => setStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                status === s
                  ? "bg-sky-500 text-white"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : (
          <ExecutionsList
            execs={items}
            locale={locale}
            isRtl={isRtl}
            tr={tr}
            showWorkflowName
          />
        )}
      </div>
    </DashboardShell>
  );
}
