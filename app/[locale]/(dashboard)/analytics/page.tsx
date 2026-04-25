"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  LineChart,
  PieChart,
  Table as TableIcon,
  Mail,
  ArrowRight,
  Loader2,
  DollarSign,
  Briefcase,
  Users,
  Activity,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getMetricCatalog,
  type MetricDefinition,
} from "@/lib/api/advanced";

// ============================================================================
// ANALYTICS HUB
// ----------------------------------------------------------------------------
// New pivot-style metric browser. Lives alongside the existing /reports
// page (which is a single-page pre-baked revenue+pipeline report).
// Users who want a specific-metric drill-down come here; users who want
// the classic financial overview stay on /reports.
// ============================================================================

const CATEGORY_META: Record<
  string,
  { en: string; ar: string; tr: string; icon: any; tone: string }
> = {
  revenue: {
    en: "Revenue",
    ar: "الإيرادات",
    tr: "Gelir",
    icon: DollarSign,
    tone: "from-emerald-500 to-teal-600",
  },
  pipeline: {
    en: "Pipeline",
    ar: "المسار",
    tr: "Pipeline",
    icon: Briefcase,
    tone: "from-sky-400 to-sky-600",
  },
  customers: {
    en: "Customers",
    ar: "العملاء",
    tr: "Müşteriler",
    icon: Users,
    tone: "from-indigo-500 to-purple-600",
  },
  activity: {
    en: "Activity",
    ar: "النشاط",
    tr: "Etkinlik",
    icon: Activity,
    tone: "from-amber-500 to-orange-600",
  },
};

export default function AnalyticsHubPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetricCatalog()
      .then(setMetrics)
      .catch((e) => setError(e?.message))
      .finally(() => setLoading(false));
  }, []);

  const byCategory: Record<string, MetricDefinition[]> = {};
  for (const m of metrics) {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  }

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-5xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">
                {tr("Analytics", "التحليلات", "Analitik")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Drill into a specific metric or schedule an email digest.",
                  "تعمق في مقياس محدد أو جدول ملخصًا بالبريد.",
                  "Belirli bir metriğe dal veya e-posta özeti zamanla."
                )}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/analytics/scheduled`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold"
          >
            <Mail className="w-3.5 h-3.5" />
            {tr(
              "Scheduled reports",
              "التقارير المجدولة",
              "Zamanlanmış raporlar"
            )}
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byCategory).map(([cat, items]) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta?.icon ?? BarChart3;
              return (
                <section key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${meta?.tone ?? "from-slate-500 to-slate-700"} text-white flex items-center justify-center`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-sm font-bold text-sky-900">
                      {meta?.[locale] ?? cat}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((m) => (
                      <Link
                        key={m.key}
                        href={`/${locale}/analytics/builder?m=${m.key}`}
                        className="group rounded-xl border border-sky-100 bg-white hover:border-sky-300 hover:shadow-sm transition-all p-4 flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                          {chartIcon(m.chart)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-sky-900">
                            {m.label[locale]}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {m.description[locale]}
                          </p>
                        </div>
                        <ArrowRight
                          className={`w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors flex-shrink-0 mt-1 ${
                            isRtl ? "-scale-x-100" : ""
                          }`}
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function chartIcon(chart: string) {
  switch (chart) {
    case "bar":
      return <BarChart3 className="w-4 h-4" />;
    case "line":
      return <LineChart className="w-4 h-4" />;
    case "pie":
      return <PieChart className="w-4 h-4" />;
    default:
      return <TableIcon className="w-4 h-4" />;
  }
}
