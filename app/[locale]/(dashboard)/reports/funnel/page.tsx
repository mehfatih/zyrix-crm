"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GitBranch,
  Loader2,
  TrendingDown,
  TrendingUp,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getFunnelReport,
  type FunnelReport,
  type FunnelStage,
} from "@/lib/api/advanced";

// ============================================================================
// PIPELINE FUNNEL ANALYTICS
// ----------------------------------------------------------------------------
// For deals created in the chosen window, shows how many reached each
// pipeline stage + the drop-off rate between stages + avg time per stage.
// ============================================================================

const WINDOW_PRESETS = [
  { days: 30, label: { en: "30d", ar: "30ي", tr: "30g" } },
  { days: 90, label: { en: "90d", ar: "90ي", tr: "90g" } },
  { days: 180, label: { en: "6mo", ar: "6ش", tr: "6a" } },
  { days: 365, label: { en: "1yr", ar: "1س", tr: "1y" } },
];

const STAGE_LABELS: Record<string, { en: string; ar: string; tr: string }> = {
  lead: { en: "Lead", ar: "عميل محتمل", tr: "Aday" },
  qualified: { en: "Qualified", ar: "مؤهل", tr: "Nitelikli" },
  proposal: { en: "Proposal", ar: "عرض", tr: "Teklif" },
  negotiation: { en: "Negotiation", ar: "تفاوض", tr: "Müzakere" },
  won: { en: "Won", ar: "مكسوب", tr: "Kazanıldı" },
  lost: { en: "Lost", ar: "مفقود", tr: "Kaybedildi" },
};

function stageLabel(stage: string, locale: "en" | "ar" | "tr"): string {
  return STAGE_LABELS[stage]?.[locale] ?? stage;
}

export default function FunnelReportPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [report, setReport] = useState<FunnelReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowDays, setWindowDays] = useState(90);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFunnelReport({ windowDays });
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
  }, [windowDays]);

  // Non-terminal stages (the funnel bars) vs terminal outcomes
  const bars = report?.stages.filter(
    (s) => s.stage !== "won" && s.stage !== "lost"
  );
  const wonStage = report?.stages.find((s) => s.stage === "won");
  const lostStage = report?.stages.find((s) => s.stage === "lost");
  const maxCount = bars
    ? Math.max(...bars.map((b) => b.totalDeals), 1)
    : 1;

  const fmtMoney = (n: number, currency: string) => {
    try {
      return new Intl.NumberFormat(
        locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
        { style: "currency", currency, maximumFractionDigits: 0 }
      ).format(n);
    } catch {
      return `${n.toFixed(0)} ${currency}`;
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-6xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">
                {tr("Pipeline funnel", "مسار التحويل", "Satış hunisi")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Where deals die between stages — and how long they spend in each.",
                  "أين تموت الصفقات بين المراحل — وكم تقضي في كل مرحلة.",
                  "Anlaşmalar aşamalar arasında nerede ölüyor — ve her aşamada ne kadar zaman geçiriyor."
                )}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center bg-white border border-sky-200 rounded-lg p-0.5">
            {WINDOW_PRESETS.map((p) => (
              <button
                key={p.days}
                onClick={() => setWindowDays(p.days)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  windowDays === p.days
                    ? "bg-sky-500 text-white"
                    : "text-slate-600 hover:bg-sky-50"
                }`}
              >
                {p.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        ) : !report || report.totalDeals === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-white p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
              <GitBranch className="w-6 h-6 text-sky-500" />
            </div>
            <p className="text-sm font-semibold text-sky-900">
              {tr(
                "No deals in this window",
                "لا توجد صفقات في هذه الفترة",
                "Bu pencerede anlaşma yok"
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                "Create some deals or widen the window.",
                "أنشئ صفقات أو وسّع الفترة.",
                "Anlaşma oluşturun veya pencereyi genişletin."
              )}
            </p>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard
                icon={<Target className="w-4 h-4" />}
                label={tr("Total deals", "إجمالي الصفقات", "Toplam anlaşma")}
                value={report.totalDeals.toString()}
                hint={tr(
                  `Last ${report.windowDays} days`,
                  `آخر ${report.windowDays} يوم`,
                  `Son ${report.windowDays} gün`
                )}
              />
              <KpiCard
                icon={<CheckCircle2 className="w-4 h-4" />}
                label={tr("Won", "مكسوبة", "Kazanılan")}
                value={report.wonDeals.toString()}
                hint={`${report.overallConversionRate}% ${tr("conv.", "تحويل", "dönüşüm")}`}
                accent="emerald"
              />
              <KpiCard
                icon={<XCircle className="w-4 h-4" />}
                label={tr("Lost", "مفقودة", "Kaybedilen")}
                value={report.lostDeals.toString()}
                accent="rose"
              />
              <KpiCard
                icon={<Clock className="w-4 h-4" />}
                label={tr(
                  "Avg cycle",
                  "متوسط الدورة",
                  "Ort. döngü"
                )}
                value={
                  report.avgDealCycleDays !== null
                    ? `${report.avgDealCycleDays}d`
                    : "—"
                }
                hint={tr(
                  "creation → won",
                  "الإنشاء → المكسب",
                  "oluşum → kazanç"
                )}
              />
            </div>

            {/* Info banner */}
            <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-sky-900 leading-relaxed">
                {tr(
                  "Each bar counts deals that REACHED that stage at any point (including those that moved past it). The drop-off arrow shows the conversion rate from one stage to the next.",
                  "كل شريط يحسب الصفقات اللي وصلت للمرحلة دي في أي وقت (بما فيها اللي عدّت منها). سهم التسرب يوضّح نسبة التحويل من مرحلة للي بعدها.",
                  "Her çubuk, o aşamaya herhangi bir noktada ULAŞAN anlaşmaları (o aşamayı geçenler dahil) sayar. Düşüş oku, bir aşamadan sonrakine dönüşüm oranını gösterir."
                )}
              </p>
            </div>

            {/* Funnel bars */}
            <div className="rounded-xl border border-sky-100 bg-white p-5 space-y-2">
              {bars &&
                bars.map((stage, idx) => {
                  const widthPct = (stage.totalDeals / maxCount) * 100;
                  const isFirst = idx === 0;
                  const nextBar = bars[idx + 1];
                  return (
                    <div key={stage.stage}>
                      <div className="flex items-center gap-3">
                        <div className="w-32 flex-shrink-0 text-xs font-semibold text-sky-900">
                          {stageLabel(stage.stage, locale)}
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-10 rounded-lg bg-slate-50 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg transition-all flex items-center px-3"
                              style={{ width: `${widthPct}%` }}
                            >
                              <span
                                className="text-xs font-bold text-white tabular-nums"
                                dir="ltr"
                              >
                                {stage.totalDeals}
                              </span>
                            </div>
                          </div>
                          <div className="absolute inset-y-0 right-3 rtl:right-auto rtl:left-3 flex items-center gap-3 text-[10px] text-slate-500 tabular-nums pointer-events-none">
                            <span title={tr("Open now", "مفتوحة الآن", "Şu an açık")}>
                              {stage.openDeals} {tr("open", "مفتوحة", "açık")}
                            </span>
                            {stage.avgDaysInStage > 0 && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {stage.avgDaysInStage}d
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Drop-off arrow to next stage */}
                      {nextBar && stage.conversionToNext !== null && (
                        <div className="flex items-center gap-3 ml-32 my-1">
                          <div className="w-0" />
                          <div className="flex items-center gap-2 text-[11px]">
                            <TrendingDown
                              className={`w-3.5 h-3.5 ${
                                stage.conversionToNext >= 50
                                  ? "text-emerald-600"
                                  : stage.conversionToNext >= 25
                                    ? "text-amber-600"
                                    : "text-rose-600"
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                stage.conversionToNext >= 50
                                  ? "text-emerald-700"
                                  : stage.conversionToNext >= 25
                                    ? "text-amber-700"
                                    : "text-rose-700"
                              }`}
                            >
                              {stage.conversionToNext}%
                            </span>
                            <span className="text-slate-500">
                              {tr(
                                "conversion to next",
                                "تحويل للمرحلة التالية",
                                "sonraki aşamaya dönüşüm"
                              )}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">
                              {stage.totalDeals - nextBar.totalDeals}{" "}
                              {tr("lost here", "خسرت هنا", "burada kaybedildi")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Terminal outcomes — won/lost side-by-side */}
              {(wonStage || lostStage) && (
                <div className="pt-3 mt-3 border-t border-sky-100 grid grid-cols-2 gap-3">
                  {wonStage && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-emerald-900">
                          {tr("Won", "مكسوبة", "Kazanılan")}
                        </div>
                        <div className="text-lg font-bold text-emerald-900 tabular-nums">
                          {wonStage.totalDeals}
                        </div>
                      </div>
                    </div>
                  )}
                  {lostStage && (
                    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-rose-900">
                          {tr("Lost", "مفقودة", "Kaybedilen")}
                        </div>
                        <div className="text-lg font-bold text-rose-900 tabular-nums">
                          {lostStage.totalDeals}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detailed stages table */}
            <div className="rounded-xl border border-sky-100 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-sky-50 text-xs text-slate-600 uppercase">
                  <tr>
                    <th className="text-left rtl:text-right px-4 py-2.5">
                      {tr("Stage", "المرحلة", "Aşama")}
                    </th>
                    <th className="text-right rtl:text-left px-4 py-2.5">
                      {tr("Reached", "وصل", "Ulaşan")}
                    </th>
                    <th className="text-right rtl:text-left px-4 py-2.5">
                      {tr("Open", "مفتوحة", "Açık")}
                    </th>
                    <th className="text-right rtl:text-left px-4 py-2.5">
                      {tr("Conv.", "التحويل", "Dön.")}
                    </th>
                    <th className="text-right rtl:text-left px-4 py-2.5">
                      {tr("Avg days", "متوسط الأيام", "Ort. gün")}
                    </th>
                    <th className="text-right rtl:text-left px-4 py-2.5">
                      {tr("Open value", "قيمة المفتوحة", "Açık değer")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.stages.map((s, idx) => (
                    <tr
                      key={s.stage}
                      className={
                        idx !== report.stages.length - 1
                          ? "border-b border-sky-50"
                          : ""
                      }
                    >
                      <td className="px-4 py-2.5 font-medium text-sky-900">
                        {stageLabel(s.stage, locale)}
                      </td>
                      <td className="text-right rtl:text-left px-4 py-2.5 tabular-nums text-slate-700">
                        {s.totalDeals}
                      </td>
                      <td className="text-right rtl:text-left px-4 py-2.5 tabular-nums text-slate-700">
                        {s.openDeals}
                      </td>
                      <td className="text-right rtl:text-left px-4 py-2.5 tabular-nums">
                        {s.conversionToNext !== null ? (
                          <span
                            className={
                              s.conversionToNext >= 50
                                ? "text-emerald-700 font-semibold"
                                : s.conversionToNext >= 25
                                  ? "text-amber-700"
                                  : "text-rose-700 font-semibold"
                            }
                          >
                            {s.conversionToNext}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="text-right rtl:text-left px-4 py-2.5 tabular-nums text-slate-600">
                        {s.avgDaysInStage > 0 ? `${s.avgDaysInStage}d` : "—"}
                      </td>
                      <td
                        className="text-right rtl:text-left px-4 py-2.5 tabular-nums text-slate-700"
                        dir="ltr"
                      >
                        {s.totalValue > 0
                          ? fmtMoney(s.totalValue, s.currency)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: "emerald" | "rose";
}) {
  const accentBg =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : accent === "rose"
        ? "bg-rose-50 text-rose-700"
        : "bg-sky-50 text-sky-600";
  return (
    <div className="rounded-xl border border-sky-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xs font-medium text-slate-600">{label}</div>
        <div className="text-xl font-bold text-sky-900 tabular-nums mt-0.5">
          {value}
        </div>
        {hint && <div className="text-[10px] text-slate-500 mt-1">{hint}</div>}
      </div>
    </div>
  );
}
