"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  DollarSign,
  TrendingUp,
  PieChart,
  Settings2,
  X,
  Save,
  RefreshCw,
  ArrowRightLeft,
  Store,
  ArrowRight,
  Users,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import {
  fetchRates,
  upsertRate,
  deleteRate,
  fetchRevenueReport,
  fetchPipelineReport,
  fetchFinancialSummary,
  type ExchangeRate,
  type RevenueReport,
  type PipelineReport,
  type FinancialSummary,
} from "@/lib/api/reports";
import { DashboardShell } from "@/components/layout/DashboardShell";
import ExportButton from "@/components/advanced/ExportButton";
import { useAuth } from "@/lib/auth/context";
import { getCountryProfile } from "@/lib/locale/country-profiles";

// ============================================================================
// MULTI-CURRENCY REPORTS
// ============================================================================

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "TRY",
  "SAR",
  "AED",
  "EGP",
  "QAR",
  "KWD",
  "IQD",
];

type Tab = "summary" | "revenue" | "pipeline";

export default function ReportsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Reports");

  // Default reports to the merchant's base currency, fall back to their
  // country's primary currency, last-resort USD. The old default was a
  // hardcoded "USD" which confused merchants whose business never
  // touches dollars.
  const { company } = useAuth();
  const merchantCurrency =
    company?.baseCurrency ||
    getCountryProfile(company?.country)?.currency ||
    "USD";

  const [tab, setTab] = useState<Tab>("summary");
  const [baseCurrency, setBaseCurrency] = useState(merchantCurrency);

  // Re-sync once company loads (initial render happens before useAuth
  // hydrates, so the first baseCurrency value may be USD until the
  // company arrives — this effect catches up the moment it does).
  useEffect(() => {
    if (merchantCurrency && baseCurrency !== merchantCurrency && baseCurrency === "USD") {
      // Only auto-switch if user hasn't explicitly toggled to USD
      if (!userChangedCurrency.current) {
        setBaseCurrency(merchantCurrency);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantCurrency]);

  // Track whether user manually toggled currency; once they do, we
  // respect their choice and don't auto-sync anymore.
  const userChangedCurrency = useRef(false);

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [pipeline, setPipeline] = useState<PipelineReport | null>(null);
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratesModalOpen, setRatesModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r, p, rt] = await Promise.all([
        fetchFinancialSummary(baseCurrency),
        fetchRevenueReport(baseCurrency),
        fetchPipelineReport(baseCurrency),
        fetchRates(),
      ]);
      setSummary(s);
      setRevenue(r);
      setPipeline(p);
      setRates(rt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency]);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-600" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* 2-pill toggle — Base (merchant currency) vs USD (converted).
                Keeps the interaction simple: most merchants just want to
                see their own numbers, with a single click to compare in
                USD when talking to investors or foreign partners. The
                advanced multi-currency dropdown is still available in
                "More" for users who need it. */}
            <div className="inline-flex rounded-lg border border-sky-200 bg-white p-0.5">
              <button
                onClick={() => {
                  userChangedCurrency.current = true;
                  setBaseCurrency(merchantCurrency);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  baseCurrency === merchantCurrency
                    ? "bg-cyan-600 text-white"
                    : "text-slate-700 hover:bg-sky-50"
                }`}
              >
                {merchantCurrency}
                <span className="ms-1 opacity-80 font-normal text-[10px]">
                  {locale === "ar"
                    ? "(عملتك)"
                    : locale === "tr"
                      ? "(Sizin)"
                      : "(Yours)"}
                </span>
              </button>
              {merchantCurrency !== "USD" && (
                <button
                  onClick={() => {
                    userChangedCurrency.current = true;
                    setBaseCurrency("USD");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    baseCurrency === "USD"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  USD
                  <span className="ms-1 opacity-80 font-normal text-[10px]">
                    {locale === "ar"
                      ? "(محوّل)"
                      : locale === "tr"
                        ? "(Çevrilmiş)"
                        : "(Converted)"}
                  </span>
                </button>
              )}
            </div>

            {/* Advanced: full currency dropdown for power users */}
            <details className="relative">
              <summary className="list-none cursor-pointer px-2 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-cyan-700">
                {locale === "ar" ? "المزيد" : locale === "tr" ? "Daha fazla" : "More"}
              </summary>
              <select
                value={baseCurrency}
                onChange={(e) => {
                  userChangedCurrency.current = true;
                  setBaseCurrency(e.target.value);
                }}
                className="absolute top-8 end-0 px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg z-10"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </details>
            <button
              onClick={() => setRatesModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-medium"
            >
              <Settings2 className="w-4 h-4" />
              {t("manageRates")}
              {rates.length > 0 && (
                <span className="bg-cyan-100 text-cyan-700 text-xs px-1.5 py-0.5 rounded-full">
                  {rates.length}
                </span>
              )}
            </button>
            <ExportButton entityType="deals" label={t("exportDeals") ?? "Export deals"} />
            <ExportButton entityType="customers" label={t("exportCustomers") ?? "Export customers"} />
            <button
              onClick={load}
              className="p-2 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg"
              title={t("refresh")}
            >
              <RefreshCw className="w-4 h-4 text-cyan-600" />
            </button>
          </div>
        </div>

        {/* Conversion banner — shown only when USD toggle is active and
            the merchant's home currency is something other than USD.
            Makes it explicit that these figures are converted from the
            merchant's multi-currency deals using the rates configured
            in "Manage rates". */}
        {baseCurrency === "USD" && merchantCurrency !== "USD" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 px-3 flex items-center gap-2 text-[11px] text-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>
              {locale === "ar"
                ? `تم تحويل الأرقام إلى USD حسب أسعار الصرف المحفوظة. قيمتك الأصلية بالـ ${merchantCurrency}.`
                : locale === "tr"
                  ? `Rakamlar kayıtlı kur üzerinden USD'ye çevrildi. Orijinal ${merchantCurrency} değerleriniz korunuyor.`
                  : `Amounts converted to USD using stored rates. Your native ${merchantCurrency} values are preserved.`}
            </span>
          </div>
        )}

        {/* Related reports — deep links to specialized dashboards */}
        <Link
          href={`/${locale}/reports/ecommerce`}
          className="group flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-sky-50 border border-sky-100 rounded-xl p-3.5 hover:border-cyan-300 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-white border border-sky-200 flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-cyan-900">
              {locale === "ar"
                ? "تحليلات التجارة الإلكترونية"
                : locale === "tr"
                  ? "E-ticaret analitiği"
                  : "E-commerce analytics"}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {locale === "ar"
                ? "الأداء عبر جميع المتاجر المتصلة — تفصيل المنصات، أفضل العملاء، واتجاه الإيرادات"
                : locale === "tr"
                  ? "Tüm bağlı mağazalardaki performans — platform dağılımı, en iyi müşteriler ve gelir trendi"
                  : "Performance across all connected stores — platform breakdown, top customers, revenue trend"}
            </p>
          </div>
          <ArrowRight
            className={`w-4 h-4 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
              locale === "ar" ? "-scale-x-100" : ""
            }`}
          />
        </Link>

        {/* Cohort + Funnel — two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href={`/${locale}/reports/cohort`}
            className="group flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-sky-50 border border-sky-100 rounded-xl p-3.5 hover:border-cyan-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-sky-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-cyan-900">
                {locale === "ar"
                  ? "الاحتفاظ بالعملاء"
                  : locale === "tr"
                    ? "Müşteri tutma"
                    : "Cohort retention"}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {locale === "ar"
                  ? "نسبة العملاء اللي لسه نشطين شهر بعد شهر — هل أحدث عملائك أفضل من القدامى؟"
                  : locale === "tr"
                    ? "Müşterilerin ay ay ne kadarı hâlâ aktif — yeni müşteriler eskilerden daha mı iyi?"
                    : "How many customers stay active month over month — are newer cohorts better than older ones?"}
              </p>
            </div>
            <ArrowRight
              className={`w-4 h-4 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                locale === "ar" ? "-scale-x-100" : ""
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/reports/funnel`}
            className="group flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-sky-50 border border-sky-100 rounded-xl p-3.5 hover:border-cyan-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-sky-200 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-cyan-900">
                {locale === "ar"
                  ? "مسار التحويل"
                  : locale === "tr"
                    ? "Satış hunisi"
                    : "Pipeline funnel"}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {locale === "ar"
                  ? "أين تموت الصفقات بين المراحل — وكم تقضي في كل مرحلة"
                  : locale === "tr"
                    ? "Anlaşmalar aşamalar arasında nerede ölüyor — ve her aşamada ne kadar zaman geçiriyor"
                    : "Where deals die between stages — and how long they spend in each"}
              </p>
            </div>
            <ArrowRight
              className={`w-4 h-4 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                locale === "ar" ? "-scale-x-100" : ""
              }`}
            />
          </Link>
        </div>

        {/* Warning banner for unconvertible currencies */}
        {summary?.hasUnconvertible && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>{t("warnings.unconvertible")}</strong>
              <div className="text-xs mt-1">{t("warnings.unconvertibleHint")}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-sky-100 flex gap-1 overflow-x-auto">
          {(
            [
              { id: "summary", label: t("tabs.summary"), Icon: BarChart3 },
              { id: "revenue", label: t("tabs.revenue"), Icon: DollarSign },
              { id: "pipeline", label: t("tabs.pipeline"), Icon: TrendingUp },
            ] as { id: Tab; label: string; Icon: typeof BarChart3 }[]
          ).map((tb) => {
            const active = tab === tb.id;
            const Icon = tb.Icon;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap ${
                  active
                    ? "border-cyan-600 text-cyan-700"
                    : "border-transparent text-slate-600 hover:text-cyan-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tb.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : (
          <>
            {tab === "summary" && summary && (
              <SummaryView summary={summary} t={t} baseCurrency={baseCurrency} />
            )}
            {tab === "revenue" && revenue && (
              <RevenueView
                revenue={revenue}
                t={t}
                baseCurrency={baseCurrency}
                locale={locale}
              />
            )}
            {tab === "pipeline" && pipeline && (
              <PipelineView
                pipeline={pipeline}
                t={t}
                baseCurrency={baseCurrency}
              />
            )}
          </>
        )}
      </div>

      {ratesModalOpen && (
        <RatesModal
          t={t}
          rates={rates}
          onClose={() => setRatesModalOpen(false)}
          onChanged={async () => {
            setRates(await fetchRates());
            await load();
          }}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Summary View
// ============================================================================
function SummaryView({
  summary,
  t,
  baseCurrency,
}: {
  summary: FinancialSummary;
  t: ReturnType<typeof useTranslations>;
  baseCurrency: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BigKpi
          label={t("summary.revenue30d")}
          value={summary.revenue30d.total}
          currency={baseCurrency}
          hint={`${summary.revenue30d.dealCount} ${t("summary.deals")}`}
          gradient="from-emerald-500 to-teal-600"
        />
        <BigKpi
          label={t("summary.revenue90d")}
          value={summary.revenue90d.total}
          currency={baseCurrency}
          hint={`${summary.revenue90d.dealCount} ${t("summary.deals")}`}
          gradient="from-cyan-500 to-sky-600"
        />
        <BigKpi
          label={t("summary.openPipeline")}
          value={summary.openPipeline.total}
          currency={baseCurrency}
          hint={`${formatMoneyCurrency(
            summary.openPipeline.weighted,
            baseCurrency
          )} ${t("summary.weighted")}`}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      <div className="bg-white border border-sky-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-cyan-900 mb-3 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          {t("summary.currenciesInUse")}
        </h3>
        {summary.currenciesInUse.length === 0 ? (
          <p className="text-sm text-slate-500">{t("empty.noCurrencies")}</p>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {summary.currenciesInUse.map((c, i) => (
              <span
                key={i}
                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono font-semibold ${
                  c === baseCurrency
                    ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {c}
                {c === baseCurrency && (
                  <span className="ltr:ml-1 rtl:mr-1 text-[10px] text-cyan-500">
                    ({t("summary.base")})
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Revenue View
// ============================================================================
function RevenueView({
  revenue,
  t,
  baseCurrency,
  locale,
}: {
  revenue: RevenueReport;
  t: ReturnType<typeof useTranslations>;
  baseCurrency: string;
  locale: string;
}) {
  const currencyKeys = Object.keys(revenue.byCurrency);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="text-sm opacity-80 mb-1">{t("revenue.totalRevenue")}</div>
        <div className="text-4xl font-bold">
          {formatMoneyCurrency(revenue.totalRevenue, baseCurrency)}
        </div>
        <div className="text-xs opacity-80 mt-2">
          {revenue.dealCount} {t("summary.deals")} · {currencyKeys.length}{" "}
          {t("revenue.currencies")}
        </div>
      </div>

      {currencyKeys.length > 0 && (
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-sky-100 bg-sky-50/50">
            <h3 className="text-sm font-semibold text-cyan-900">
              {t("revenue.byCurrency")}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-sky-50/30 border-b border-sky-100">
              <tr className="text-left rtl:text-right text-xs uppercase text-slate-600">
                <th className="px-4 py-2 font-semibold">
                  {t("revenue.currency")}
                </th>
                <th className="px-4 py-2 font-semibold ltr:text-right rtl:text-left">
                  {t("revenue.deals")}
                </th>
                <th className="px-4 py-2 font-semibold ltr:text-right rtl:text-left">
                  {t("revenue.native")}
                </th>
                <th className="px-4 py-2 font-semibold ltr:text-right rtl:text-left">
                  {t("revenue.converted")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currencyKeys.map((c, i) => {
                const entry = revenue.byCurrency[c];
                const isUnconvertible =
                  revenue.unconvertibleCurrencies.includes(c);
                return (
                  <tr
                    key={i}
                    className="border-b border-sky-50 hover:bg-sky-50/30"
                  >
                    <td className="px-4 py-2 font-mono font-semibold text-cyan-700">
                      {c}
                      {isUnconvertible && (
                        <AlertTriangle
                          className="w-3 h-3 inline ltr:ml-1 rtl:mr-1 text-amber-500"
                          aria-label={t("revenue.unconvertibleFlag")}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 ltr:text-right rtl:text-left">
                      {entry.count}
                    </td>
                    <td className="px-4 py-2 ltr:text-right rtl:text-left text-slate-700">
                      {formatMoneyCurrency(entry.native, c)}
                    </td>
                    <td className="px-4 py-2 ltr:text-right rtl:text-left font-bold text-emerald-700">
                      {formatMoneyCurrency(entry.converted, baseCurrency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {revenue.deals.length > 0 && (
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-sky-100 bg-sky-50/50">
            <h3 className="text-sm font-semibold text-cyan-900">
              {t("revenue.recentDeals")}
            </h3>
          </div>
          <div className="divide-y divide-sky-50 max-h-96 overflow-y-auto">
            {revenue.deals.map((d: any, i: number) => (
              <div
                key={i}
                className="px-5 py-3 hover:bg-sky-50/30 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-cyan-900 truncate">
                    {d.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {d.customer?.fullName} · {d.owner?.fullName || "—"} ·{" "}
                    {d.actualCloseDate
                      ? formatDate(d.actualCloseDate, locale)
                      : "—"}
                  </div>
                </div>
                <div className="text-right rtl:text-left flex-shrink-0">
                  <div className="text-sm font-bold text-cyan-900">
                    {formatMoneyCurrency(d.convertedValue, baseCurrency)}
                  </div>
                  {d.currency !== baseCurrency && (
                    <div className="text-[10px] text-slate-500">
                      {formatMoneyCurrency(d.value, d.currency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Pipeline View
// ============================================================================
function PipelineView({
  pipeline,
  t,
  baseCurrency,
}: {
  pipeline: PipelineReport;
  t: ReturnType<typeof useTranslations>;
  baseCurrency: string;
}) {
  const stages = Object.entries(pipeline.byStage).sort(
    ([, a], [, b]) => b.value - a.value
  );
  const maxValue = Math.max(...stages.map(([, s]) => s.value), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-cyan-500 to-sky-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-80 mb-1">
            {t("pipeline.totalOpen")}
          </div>
          <div className="text-3xl font-bold">
            {formatMoneyCurrency(pipeline.totalOpenValue, baseCurrency)}
          </div>
          <div className="text-xs opacity-80 mt-2">
            {pipeline.dealCount} {t("summary.deals")}
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-80 mb-1">
            {t("pipeline.weighted")}
          </div>
          <div className="text-3xl font-bold">
            {formatMoneyCurrency(pipeline.totalWeightedValue, baseCurrency)}
          </div>
          <div className="text-xs opacity-80 mt-2">
            {pipeline.totalOpenValue > 0
              ? `${(
                  (pipeline.totalWeightedValue / pipeline.totalOpenValue) *
                  100
                ).toFixed(1)}% ${t("pipeline.probability")}`
              : "—"}
          </div>
        </div>
      </div>

      {stages.length > 0 && (
        <div className="bg-white border border-sky-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-cyan-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            {t("pipeline.byStage")}
          </h3>
          <div className="space-y-3">
            {stages.map(([stage, data], i) => {
              const widthPct = (data.value / maxValue) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-cyan-900 capitalize">
                        {stage.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({data.count})
                      </span>
                    </div>
                    <div className="text-sm font-bold text-cyan-900">
                      {formatMoneyCurrency(data.value, baseCurrency)}
                    </div>
                  </div>
                  <div className="bg-sky-50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {t("pipeline.weighted")}:{" "}
                    {formatMoneyCurrency(data.weightedValue, baseCurrency)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Exchange Rates Manager Modal
// ============================================================================
function RatesModal({
  t,
  rates,
  onClose,
  onChanged,
}: {
  t: ReturnType<typeof useTranslations>;
  rates: ExchangeRate[];
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    fromCurrency: "USD",
    toCurrency: "TRY",
    rate: "30",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const add = async () => {
    if (form.fromCurrency === form.toCurrency) {
      setErr(t("rates.errors.sameCurrency"));
      return;
    }
    const n = Number(form.rate);
    if (isNaN(n) || n <= 0) {
      setErr(t("rates.errors.invalidRate"));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await upsertRate(form.fromCurrency, form.toCurrency, n);
      await onChanged();
      setForm({ fromCurrency: "USD", toCurrency: "TRY", rate: "30" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRate(id);
      await onChanged();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-cyan-900">
              {t("rates.title")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("rates.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="bg-sky-50/30 border border-sky-100 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600 mb-2">
              {t("rates.addNew")}
            </div>
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <label className="block text-[10px] text-slate-500 mb-0.5">
                  {t("rates.from")}
                </label>
                <select
                  value={form.fromCurrency}
                  onChange={(e) =>
                    setForm({ ...form, fromCurrency: e.target.value })
                  }
                  className="w-full px-2 py-1.5 text-sm border border-sky-200 rounded bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-[10px] text-slate-500 mb-0.5">
                  {t("rates.to")}
                </label>
                <select
                  value={form.toCurrency}
                  onChange={(e) =>
                    setForm({ ...form, toCurrency: e.target.value })
                  }
                  className="w-full px-2 py-1.5 text-sm border border-sky-200 rounded bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-[10px] text-slate-500 mb-0.5">
                  {t("rates.rate")}
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.000001"
                    value={form.rate}
                    onChange={(e) =>
                      setForm({ ...form, rate: e.target.value })
                    }
                    className="flex-1 px-2 py-1.5 text-sm border border-sky-200 rounded"
                  />
                  <button
                    onClick={add}
                    disabled={saving}
                    className="px-2 py-1.5 bg-cyan-600 text-white rounded disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {err && (
              <div className="text-xs text-red-600 mt-2">{err}</div>
            )}
            <p className="text-[10px] text-slate-500 mt-2">
              {t("rates.hint")}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">
              {t("rates.existing")} ({rates.length})
            </div>
            {rates.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                <Sparkles className="w-6 h-6 mx-auto mb-1 text-sky-300" />
                {t("rates.empty")}
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {rates.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-sky-50/40 border border-sky-100 rounded-lg px-3 py-2"
                  >
                    <span className="font-mono text-sm font-semibold text-cyan-700">
                      1 {r.fromCurrency}
                    </span>
                    <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                    <span className="font-mono text-sm font-bold text-cyan-900">
                      {Number(r.rate).toFixed(4)} {r.toCurrency}
                    </span>
                    <div className="ltr:ml-auto rtl:mr-auto">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-sky-100 flex justify-end bg-sky-50/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg"
          >
            {t("rates.done")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function BigKpi({
  label,
  value,
  currency,
  hint,
  gradient,
}: {
  label: string;
  value: number;
  currency: string;
  hint: string;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-5 text-white shadow-sm`}
    >
      <div className="text-sm opacity-80 mb-1">{label}</div>
      <div className="text-3xl font-bold truncate">
        {formatMoneyCurrency(value, currency)}
      </div>
      <div className="text-xs opacity-80 mt-2 truncate">{hint}</div>
    </div>
  );
}

function formatMoneyCurrency(n: number, currency: string): string {
  if (n >= 1_000_000) return `${currency} ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${currency} ${(n / 1_000).toFixed(1)}K`;
  return `${currency} ${n.toFixed(2)}`;
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
