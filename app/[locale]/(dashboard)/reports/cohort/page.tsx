"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Loader2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getCohortReport,
  type CohortReport,
} from "@/lib/api/advanced";

// ============================================================================
// COHORT RETENTION HEATMAP
// ----------------------------------------------------------------------------
// Each row is a monthly acquisition cohort; each column is a month-offset
// since acquisition. Cell color intensity = retention percentage.
// ============================================================================

const WINDOW_PRESETS = [
  { months: 6, label: { en: "Last 6 mo", ar: "آخر 6 أشهر", tr: "Son 6 ay" } },
  { months: 12, label: { en: "Last 12 mo", ar: "آخر 12 شهر", tr: "Son 12 ay" } },
  { months: 24, label: { en: "Last 24 mo", ar: "آخر 24 شهر", tr: "Son 24 ay" } },
];

/**
 * Retention % → HSL cyan with lightness driven by value. 0% = near white,
 * 100% = saturated cyan. Using HSL not a lookup table so we render any
 * percentage smoothly.
 */
function cellColor(pct: number): { bg: string; text: string } {
  if (pct === 0) return { bg: "#F8FAFC", text: "#94A3B8" };
  // 0–100 → lightness 94% → 35%
  const lightness = 94 - pct * 0.59;
  // Text goes dark on light backgrounds, white on dark
  const textColor = lightness < 55 ? "#ffffff" : "#0C4A6E";
  return {
    bg: `hsl(193, 82%, ${lightness}%)`,
    text: textColor,
  };
}

function formatMonth(ym: string, locale: "en" | "ar" | "tr"): string {
  const [y, m] = ym.split("-");
  const d = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, 1));
  const localeCode = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  return d.toLocaleDateString(localeCode, {
    year: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export default function CohortReportPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [report, setReport] = useState<CohortReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthsBack, setMonthsBack] = useState(12);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCohortReport({ monthsBack });
      setReport(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message || e?.message || "Failed to load"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthsBack]);

  // Max columns across all cohorts (the first cohort has the most offsets)
  const maxOffset =
    report?.cohorts.reduce(
      (m, c) => Math.max(m, c.retention.length - 1),
      0
    ) ?? 0;

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-6xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {tr("Cohort retention", "الاحتفاظ بالعملاء", "Müşteri tutma")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "What % of each monthly cohort is still active N months later.",
                  "نسبة العملاء من كل مجموعة شهرية اللي لسه نشطين بعد N شهور.",
                  "Her aylık grupta N ay sonra hâlâ aktif olan müşteri yüzdesi."
                )}
              </p>
            </div>
          </div>

          {/* Window toggle */}
          <div className="inline-flex items-center bg-white border border-sky-200 rounded-lg p-0.5">
            {WINDOW_PRESETS.map((p) => (
              <button
                key={p.months}
                onClick={() => setMonthsBack(p.months)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  monthsBack === p.months
                    ? "bg-cyan-600 text-white"
                    : "text-slate-600 hover:bg-sky-50"
                }`}
              >
                {p.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-cyan-900 leading-relaxed">
            {tr(
              "A customer counts as 'active' in a month if they had a deal created/updated, an activity completed, or their record was touched. Month 0 is always 100% by definition.",
              "يُحتسب العميل 'نشطًا' في شهر معين إذا تم إنشاء/تحديث صفقة، أو إكمال نشاط، أو تم تحديث بياناته. الشهر 0 دائمًا 100% بالتعريف.",
              "Bir müşteri, bir anlaşma oluşturulmuş/güncellenmiş, bir etkinlik tamamlanmış veya kaydı güncellenmişse o ay 'aktif' sayılır. Ay 0 tanım gereği her zaman %100'dür."
            )}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        ) : !report || report.cohorts.length === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-white p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <p className="text-sm font-semibold text-cyan-900">
              {tr(
                "Not enough data yet",
                "لا توجد بيانات كافية بعد",
                "Henüz yeterli veri yok"
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                "Cohort charts need at least one month of customer history.",
                "مخططات المجموعات تحتاج شهرًا واحدًا على الأقل من تاريخ العملاء.",
                "Kohort grafikleri en az bir aylık müşteri geçmişi gerektirir."
              )}
            </p>
          </div>
        ) : (
          <>
            {/* Heatmap table */}
            <div className="rounded-xl border border-sky-100 bg-white overflow-x-auto">
              <table
                className="w-full text-xs border-separate"
                style={{ borderSpacing: "2px" }}
              >
                <thead>
                  <tr>
                    <th
                      className="text-left rtl:text-right px-3 py-2 text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap sticky left-0 rtl:left-auto rtl:right-0 bg-white z-10"
                      rowSpan={2}
                    >
                      {tr("Cohort", "المجموعة", "Kohort")}
                    </th>
                    <th
                      className="text-center px-3 py-2 text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap"
                      rowSpan={2}
                    >
                      {tr("Size", "الحجم", "Boyut")}
                    </th>
                    <th
                      className="text-center px-3 py-2 text-[10px] font-bold uppercase text-slate-500"
                      colSpan={maxOffset + 1}
                    >
                      {tr(
                        "Months since acquisition",
                        "الشهور منذ الاكتساب",
                        "Edinimden sonraki aylar"
                      )}
                    </th>
                  </tr>
                  <tr>
                    {Array.from({ length: maxOffset + 1 }).map((_, i) => (
                      <th
                        key={i}
                        className="text-center px-1 py-1 text-[10px] font-semibold text-slate-500 tabular-nums"
                        style={{ minWidth: "48px" }}
                      >
                        {i === 0 ? "M0" : `M${i}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.cohorts
                    .slice()
                    .reverse()
                    .map((cohort) => (
                      <tr key={cohort.cohortMonth}>
                        <td className="px-3 py-2 text-xs font-semibold text-cyan-900 whitespace-nowrap sticky left-0 rtl:left-auto rtl:right-0 bg-white">
                          {formatMonth(cohort.cohortMonth, locale)}
                        </td>
                        <td className="text-center px-2 py-2 text-xs tabular-nums text-slate-700">
                          {cohort.cohortSize}
                        </td>
                        {Array.from({ length: maxOffset + 1 }).map(
                          (_, offset) => {
                            const cell = cohort.retention.find(
                              (r) => r.monthOffset === offset
                            );
                            if (!cell) {
                              return (
                                <td
                                  key={offset}
                                  className="text-center px-1 py-2"
                                >
                                  <div
                                    className="inline-block rounded w-full h-7 bg-slate-50"
                                    title="Future"
                                  />
                                </td>
                              );
                            }
                            const color = cellColor(cell.retentionPct);
                            return (
                              <td
                                key={offset}
                                className="text-center px-1 py-2"
                                title={`${cell.activeCount} / ${cohort.cohortSize} active`}
                              >
                                <div
                                  className="rounded h-7 flex items-center justify-center text-[10px] font-semibold tabular-nums"
                                  style={{
                                    backgroundColor: color.bg,
                                    color: color.text,
                                  }}
                                >
                                  {cell.retentionPct.toFixed(0)}%
                                </div>
                              </td>
                            );
                          }
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
              <span>{tr("Retention", "الاحتفاظ", "Tutma")}:</span>
              <div className="inline-flex items-center gap-1">
                {[0, 20, 40, 60, 80, 100].map((pct) => {
                  const c = cellColor(pct);
                  return (
                    <div
                      key={pct}
                      className="w-10 h-5 rounded flex items-center justify-center text-[10px] font-semibold"
                      style={{ backgroundColor: c.bg, color: c.text }}
                    >
                      {pct}%
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
