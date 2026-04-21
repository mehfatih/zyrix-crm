"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Mail,
  Download,
  BarChart3 as BarChart3Icon,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getMetricCatalog,
  runMetric,
  type MetricDefinition,
  type MetricResult,
  type MetricColumn,
} from "@/lib/api/advanced";
import {
  BarChart,
  LineChart,
  PieChart,
} from "@/components/charts/SvgCharts";

// ============================================================================
// ANALYTICS BUILDER
// ----------------------------------------------------------------------------
// ?m=<metricKey> selects the metric. Renders the catalog picker at the
// top, runs the metric, and shows the result as either a chart or a
// table. "Schedule this" CTA links to /analytics/scheduled with the
// current metric pre-selected.
// ============================================================================

export default function BuilderPageWrapper() {
  return (
    <Suspense fallback={null}>
      <BuilderPage />
    </Suspense>
  );
}

function BuilderPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const search = useSearchParams();
  const router = useRouter();
  const selectedKey = search?.get("m") || "";

  const [catalog, setCatalog] = useState<MetricDefinition[]>([]);
  const [result, setResult] = useState<MetricResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = catalog.find((m) => m.key === selectedKey);

  useEffect(() => {
    getMetricCatalog()
      .then((c) => {
        setCatalog(c);
      })
      .catch((e) => setError(e?.message))
      .finally(() => setLoading(false));
  }, []);

  const run = useCallback(async (key: string) => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const r = await runMetric(key);
      setResult(r);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    if (selectedKey && catalog.length > 0) {
      run(selectedKey);
    }
  }, [selectedKey, catalog.length, run]);

  const handlePickMetric = (key: string) => {
    router.push(`/${locale}/analytics/builder?m=${key}`);
  };

  const handleExportCsv = () => {
    if (!result || !selected) return;
    const headers = selected.columns.map((c) => c.label[locale]).join(",");
    const rows = result.rows.map((row) =>
      selected.columns
        .map((c) => {
          const v = (row as any)[c.key];
          if (v === null || v === undefined) return "";
          const str = String(v).replace(/"/g, '""');
          return /[,"\n]/.test(str) ? `"${str}"` : str;
        })
        .join(",")
    );
    const csv = `${headers}\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.key}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-5xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/analytics`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-cyan-700"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <BarChart3Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-cyan-900 truncate">
              {selected
                ? selected.label[locale]
                : tr("Pick a metric", "اختر مقياس", "Metrik seç")}
            </h1>
            {selected && (
              <p className="text-sm text-slate-600 mt-0.5">
                {selected.description[locale]}
              </p>
            )}
          </div>
          {selected && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => run(selected.key)}
                disabled={running}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-xs font-semibold"
              >
                {running ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {tr("Refresh", "تحديث", "Yenile")}
              </button>
              <button
                onClick={handleExportCsv}
                disabled={!result || result.rows.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <Link
                href={`/${locale}/analytics/scheduled?new=${selected.key}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold"
              >
                <Mail className="w-3.5 h-3.5" />
                {tr("Schedule", "جدولة", "Zamanla")}
              </Link>
            </div>
          )}
        </div>

        {/* Metric picker */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
          </div>
        ) : (
          <select
            value={selectedKey}
            onChange={(e) => handlePickMetric(e.target.value)}
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
          >
            <option value="">
              {tr(
                "— Choose a metric —",
                "— اختر مقياسًا —",
                "— Bir metrik seç —"
              )}
            </option>
            {catalog.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label[locale]}
              </option>
            ))}
          </select>
        )}

        {/* Result */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {selected && !running && result && (
          <MetricRenderer definition={selected} result={result} locale={locale} />
        )}
        {selected && running && (
          <div className="flex items-center justify-center py-16 rounded-xl border border-sky-100 bg-white">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// RENDERER — picks chart vs table based on metric.chart
// ============================================================================

function MetricRenderer({
  definition,
  result,
  locale,
}: {
  definition: MetricDefinition;
  result: MetricResult;
  locale: "en" | "ar" | "tr";
}) {
  const rows = result.rows;
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-sky-200 bg-white p-10 text-center">
        <BarChart3Icon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">
          {locale === "ar"
            ? "لا توجد بيانات بعد."
            : locale === "tr"
              ? "Henüz veri yok."
              : "No data yet."}
        </p>
      </div>
    );
  }

  const formatCell = (value: unknown, kind: MetricColumn["kind"]): string => {
    if (value === null || value === undefined) return "—";
    if (kind === "currency") {
      return Number(value).toLocaleString(
        locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
        { style: "currency", currency: "USD", maximumFractionDigits: 0 }
      );
    }
    if (kind === "percent") {
      return `${(Number(value) * 100).toFixed(1)}%`;
    }
    if (kind === "number") {
      return Number(value).toLocaleString();
    }
    return String(value);
  };

  // Chart view
  const chartCol = definition.columns[0]; // x-axis
  const yCol =
    definition.columns.find((c) => c.kind === "currency" || c.kind === "number" || c.kind === "percent") ??
    definition.columns[1];

  return (
    <div className="space-y-4">
      {/* Chart — skipped for 'table' kind */}
      {definition.chart !== "table" && yCol && (
        <div className="rounded-xl border border-sky-100 bg-white p-4">
          {definition.chart === "bar" && (
            <BarChart
              rows={rows}
              xKey={chartCol.key}
              yKey={yCol.key}
              formatY={(v) => formatCell(v, yCol.kind)}
            />
          )}
          {definition.chart === "line" && (
            <LineChart
              rows={rows}
              xKey={chartCol.key}
              yKey={yCol.key}
              formatY={(v) => formatCell(v, yCol.kind)}
            />
          )}
          {definition.chart === "pie" && (
            <PieChart
              rows={rows}
              xKey={chartCol.key}
              yKey={yCol.key}
              formatY={(v) => formatCell(v, yCol.kind)}
            />
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-sky-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50/50 border-b border-sky-100">
              <tr>
                {definition.columns.map((c) => (
                  <th
                    key={c.key}
                    className="px-3 py-2 text-start font-semibold text-cyan-900 text-xs whitespace-nowrap"
                  >
                    {c.label[locale]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-sky-50 last:border-b-0 hover:bg-sky-50/30"
                >
                  {definition.columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-3 py-2 text-slate-800 ${
                        c.kind === "number" ||
                        c.kind === "currency" ||
                        c.kind === "percent"
                          ? "font-mono tabular-nums"
                          : ""
                      }`}
                    >
                      {formatCell((row as any)[c.key], c.kind)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
