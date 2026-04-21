"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Store,
  ArrowUp,
  ArrowDown,
  Minus,
  Loader2,
  Crown,
  RefreshCw,
  AlertTriangle,
  FileDown,
  FileText,
} from "lucide-react";
import {
  getEcommerceAnalytics,
  exportEcommerceAnalytics,
  type EcommerceAnalytics,
} from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// E-COMMERCE ANALYTICS — /reports/ecommerce
//
// Per-platform rollups for merchants running multiple stores. Everything
// is driven by a single /api/reports/ecommerce call. Charts are inline
// SVG (no deps) to match the rest of the app and keep bundle size down.
// ============================================================================

const PLATFORM_COLORS: Record<string, string> = {
  shopify: "#96BF48",
  salla: "#D4AF37",
  zid: "#1E40AF",
  woocommerce: "#96588A",
  youcan: "#0EA5E9",
  easyorders: "#F59E0B",
  expandcart: "#10B981",
  ticimax: "#DC2626",
  ideasoft: "#7C3AED",
  tsoft: "#EA580C",
  ikas: "#18181B",
  turhost: "#0891B2",
  other: "#64748B",
};

const WINDOW_PRESETS = [
  { days: 7, label: { en: "7 days", ar: "7 أيام", tr: "7 gün" } },
  { days: 30, label: { en: "30 days", ar: "30 يوم", tr: "30 gün" } },
  { days: 90, label: { en: "90 days", ar: "90 يوم", tr: "90 gün" } },
];

export default function EcommerceReportsPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [data, setData] = useState<EcommerceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowDays, setWindowDays] = useState(30);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(format);
    try {
      await exportEcommerceAnalytics({ format, windowDays });
    } catch (e: any) {
      alert(
        e?.response?.data?.error?.message ||
          e?.message ||
          "Export failed"
      );
    } finally {
      setExporting(null);
    }
  };

  const load = async (days: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEcommerceAnalytics({ windowDays: days });
      setData(result);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message ||
          e?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(windowDays);
  }, [windowDays]);

  const fmtMoney = (n: number) => {
    const currency = data?.baseCurrency || "USD";
    return new Intl.NumberFormat(
      locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
      { style: "currency", currency, maximumFractionDigits: 0 }
    ).format(n);
  };

  const fmtNum = (n: number) =>
    new Intl.NumberFormat(
      locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US"
    ).format(n);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {tr("E-commerce analytics", "تحليلات التجارة الإلكترونية", "E-ticaret analitiği")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Performance across all your connected stores",
                  "الأداء عبر جميع متاجرك المتصلة",
                  "Tüm bağlı mağazalarınızdaki performans"
                )}
              </p>
            </div>
          </div>

          {/* Right-side controls: export + window toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleExport("csv")}
              disabled={!data || exporting !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === "csv" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              {tr("CSV", "CSV", "CSV")}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={!data || exporting !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === "pdf" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              {tr("PDF", "PDF", "PDF")}
            </button>

            {/* Window toggle */}
            <div className="inline-flex items-center bg-white border border-sky-200 rounded-lg p-0.5">
              {WINDOW_PRESETS.map((p) => (
                <button
                  key={p.days}
                  onClick={() => setWindowDays(p.days)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    windowDays === p.days
                      ? "bg-cyan-600 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  {p.label[locale as "en" | "ar" | "tr"] || p.label.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={() => load(windowDays)} tr={tr} />
        ) : data ? (
          <>
            {/* Empty state — no stores connected */}
            {data.totals.storesConnected === 0 ? (
              <EmptyState locale={locale} tr={tr} />
            ) : (
              <>
                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Kpi
                    icon={DollarSign}
                    label={tr("Revenue", "الإيرادات", "Gelir")}
                    value={fmtMoney(data.totals.totalWonRevenue)}
                    hint={`${fmtNum(data.totals.totalOrders)} ${tr("orders", "طلب", "sipariş")}`}
                    color="emerald"
                  />
                  <Kpi
                    icon={Users}
                    label={tr("Customers", "العملاء", "Müşteriler")}
                    value={fmtNum(data.totals.totalCustomers)}
                    growth={data.totals.customerGrowthPct}
                    color="sky"
                  />
                  <Kpi
                    icon={ShoppingCart}
                    label={tr("Orders synced", "الطلبات المزامنة", "Senkronize siparişler")}
                    value={fmtNum(data.totals.totalOrders)}
                    hint={tr(
                      `${data.totals.totalCustomersInWindow} new in window`,
                      `${data.totals.totalCustomersInWindow} جديد خلال الفترة`,
                      `Dönemde ${data.totals.totalCustomersInWindow} yeni`
                    )}
                    color="cyan"
                  />
                  <Kpi
                    icon={Store}
                    label={tr("Stores", "المتاجر", "Mağazalar")}
                    value={fmtNum(data.totals.storesConnected)}
                    hint={tr(
                      `${data.platforms.length} platforms`,
                      `${data.platforms.length} منصة`,
                      `${data.platforms.length} platform`
                    )}
                    color="teal"
                  />
                </div>

                {/* Revenue trend chart */}
                <RevenueTrend
                  series={data.dailyRevenue}
                  currency={data.baseCurrency}
                  locale={locale}
                  tr={tr}
                  isRtl={isRtl}
                />

                {/* Per-platform table */}
                <PlatformBreakdown
                  rows={data.platforms}
                  fmtMoney={fmtMoney}
                  fmtNum={fmtNum}
                  maxRevenue={Math.max(
                    1,
                    ...data.platforms.map((p) => p.wonRevenue)
                  )}
                  tr={tr}
                  locale={locale}
                />

                {/* Two-column bottom: top customers + stores list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TopCustomers
                    rows={data.topCustomers}
                    fmtMoney={fmtMoney}
                    locale={locale}
                    tr={tr}
                  />
                  <StoresStatus
                    rows={data.stores}
                    fmtNum={fmtNum}
                    locale={locale}
                    tr={tr}
                    isRtl={isRtl}
                  />
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}

// ─── KPI ───────────────────────────────────────────────────────────────

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  growth,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
  growth?: number;
  color: "emerald" | "sky" | "cyan" | "teal";
}) {
  const bgs: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    cyan: "bg-cyan-50 text-cyan-600",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgs[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-cyan-900 tabular-nums" dir="ltr" style={{ unicodeBidi: "embed" }}>
        {value}
      </div>
      {typeof growth === "number" && (
        <div className="mt-1 flex items-center gap-1 text-[11px]">
          {growth > 0 ? (
            <>
              <ArrowUp className="w-3 h-3 text-emerald-600" />
              <span className="font-semibold text-emerald-700">+{growth.toFixed(1)}%</span>
            </>
          ) : growth < 0 ? (
            <>
              <ArrowDown className="w-3 h-3 text-rose-600" />
              <span className="font-semibold text-rose-700">{growth.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500">0%</span>
            </>
          )}
        </div>
      )}
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Revenue chart (inline SVG) ────────────────────────────────────────

function RevenueTrend({
  series,
  currency,
  locale,
  tr,
  isRtl,
}: {
  series: { date: string; revenue: number }[];
  currency: string;
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
  isRtl: boolean;
}) {
  if (series.length === 0) return null;
  const max = Math.max(1, ...series.map((s) => s.revenue));
  const width = 720;
  const height = 160;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 24;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const step = series.length > 1 ? plotW / (series.length - 1) : plotW;

  // Render x-axis direction: keep ascending (date -> horizontal) regardless of
  // page RTL; numbers and dates remain LTR inside the SVG viewport.
  const points = series.map((s, i) => {
    const x = padL + i * step;
    const y = padT + (1 - s.revenue / max) * plotH;
    return { x, y, ...s };
  });
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaD =
    pathD +
    ` L${points[points.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${padL.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

  const fmt = (n: number) =>
    new Intl.NumberFormat(
      locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
      { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }
    ).format(n);

  const first = series[0].date;
  const last = series[series.length - 1].date;

  const localeShort = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(
        locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
        { month: "short", day: "numeric" }
      );
    } catch {
      return d;
    }
  };

  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-cyan-900">
          {tr("Revenue trend", "اتجاه الإيرادات", "Gelir trendi")}
        </h3>
        <span className="text-[11px] text-slate-500">
          {tr("daily, won deals only", "يومياً، الصفقات المكتملة فقط", "günlük, yalnızca kazanılan")}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        style={isRtl ? { transform: "scaleX(-1)" } : undefined}
      >
        {/* grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={width - padR}
            y1={padT + plotH * f}
            y2={padT + plotH * f}
            stroke="#E0F2FE"
            strokeDasharray="3,3"
          />
        ))}
        {/* area + line */}
        <path d={areaD} fill="url(#revenueGradient)" />
        <path
          d={pathD}
          fill="none"
          stroke="#0891B2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* points on hover hint — render every 4th for clutter control */}
        {points.map((p, i) =>
          i % Math.ceil(points.length / 10) === 0 || i === points.length - 1 ? (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#0891B2" />
          ) : null
        )}
        {/* y-axis labels */}
        <text x={padL - 6} y={padT + 4} textAnchor="end" fontSize="10" fill="#64748B">
          {fmt(max)}
        </text>
        <text
          x={padL - 6}
          y={padT + plotH + 4}
          textAnchor="end"
          fontSize="10"
          fill="#64748B"
        >
          0
        </text>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 px-1">
        <span dir="ltr" style={{ unicodeBidi: "embed" }}>{localeShort(first)}</span>
        <span dir="ltr" style={{ unicodeBidi: "embed" }}>{localeShort(last)}</span>
      </div>
    </div>
  );
}

// ─── Per-platform breakdown ────────────────────────────────────────────

function PlatformBreakdown({
  rows,
  fmtMoney,
  fmtNum,
  maxRevenue,
  tr,
  locale,
}: {
  rows: EcommerceAnalytics["platforms"];
  fmtMoney: (n: number) => string;
  fmtNum: (n: number) => string;
  maxRevenue: number;
  tr: (en: string, ar: string, trk: string) => string;
  locale: string;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <header className="px-4 py-2.5 border-b border-sky-50 bg-sky-50/40">
        <h3 className="text-sm font-semibold text-cyan-900">
          {tr("Platform breakdown", "تفصيل حسب المنصة", "Platform dağılımı")}
        </h3>
      </header>
      <div className="divide-y divide-sky-50">
        {rows.map((p) => {
          const color = PLATFORM_COLORS[p.platform] || PLATFORM_COLORS.other;
          const barPct = (p.wonRevenue / maxRevenue) * 100;
          return (
            <div key={p.platform} className="px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-white text-[9px] font-bold capitalize flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {p.platform.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-cyan-900 capitalize">
                      {p.platform}
                    </span>
                    {p.storesConnected > 0 && (
                      <span className="text-[10px] text-slate-500">
                        · {p.storesConnected} {tr("stores", "متجر", "mağaza")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-0.5">
                    <span>
                      <Users className="w-2.5 h-2.5 inline mr-0.5" />
                      {fmtNum(p.customers)}
                    </span>
                    <span>
                      <ShoppingCart className="w-2.5 h-2.5 inline mr-0.5" />
                      {fmtNum(p.orders)}
                    </span>
                    {p.avgOrderValue > 0 && (
                      <span className="text-slate-500">
                        {tr("AOV", "متوسط", "Ort.")}: {fmtMoney(p.avgOrderValue)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right min-w-[90px]">
                  <div
                    className="text-sm font-bold text-cyan-900 tabular-nums"
                    dir="ltr"
                    style={{ unicodeBidi: "embed" }}
                  >
                    {fmtMoney(p.wonRevenue)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {fmtNum(p.wonOrders)} {tr("won", "مكتمل", "kazanılan")}
                  </div>
                </div>
              </div>
              {/* progress bar */}
              <div className="mt-2 h-1.5 bg-sky-50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Top customers ─────────────────────────────────────────────────────

function TopCustomers({
  rows,
  fmtMoney,
  locale,
  tr,
}: {
  rows: EcommerceAnalytics["topCustomers"];
  fmtMoney: (n: number) => string;
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-sky-100 rounded-xl p-6 text-center">
        <Crown className="w-8 h-8 text-sky-200 mx-auto mb-2" />
        <p className="text-sm text-slate-500">
          {tr("No customer data yet", "لا توجد بيانات عملاء بعد", "Henüz müşteri verisi yok")}
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <header className="px-4 py-2.5 border-b border-sky-50 bg-sky-50/40">
        <h3 className="text-sm font-semibold text-cyan-900 flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" />
          {tr("Top customers by lifetime value", "أعلى العملاء بالقيمة الإجمالية", "Yaşam boyu değere göre en iyi müşteriler")}
        </h3>
      </header>
      <div className="divide-y divide-sky-50">
        {rows.map((c, i) => {
          const color = PLATFORM_COLORS[c.source || "other"] || PLATFORM_COLORS.other;
          return (
            <Link
              key={c.id}
              href={`/${locale}/customers/${c.id}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50/40 transition-colors"
            >
              <span className="text-xs font-bold text-slate-400 w-5 text-center">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {c.fullName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {c.source && (
                    <span
                      className="text-[9px] px-1 py-0.5 rounded text-white font-semibold capitalize"
                      style={{ backgroundColor: color }}
                    >
                      {c.source}
                    </span>
                  )}
                  {c.email && (
                    <span className="text-[10px] text-slate-500 truncate" dir="ltr">
                      {c.email}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="text-sm font-bold text-emerald-700 tabular-nums"
                dir="ltr"
                style={{ unicodeBidi: "embed" }}
              >
                {fmtMoney(c.lifetimeValue)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Store-level status list ───────────────────────────────────────────

function StoresStatus({
  rows,
  fmtNum,
  locale,
  tr,
  isRtl,
}: {
  rows: EcommerceAnalytics["stores"];
  fmtNum: (n: number) => string;
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
  isRtl: boolean;
}) {
  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <header className="px-4 py-2.5 border-b border-sky-50 bg-sky-50/40 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyan-900 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-cyan-600" />
          {tr("Store health", "حالة المتاجر", "Mağaza durumu")}
        </h3>
        <Link
          href={`/${locale}/settings/integrations`}
          className="text-[11px] text-cyan-700 hover:text-cyan-900 font-medium inline-flex items-center gap-0.5"
        >
          {tr("Manage", "إدارة", "Yönet")}
          <RefreshCw className="w-2.5 h-2.5" />
        </Link>
      </header>
      <div className="divide-y divide-sky-50">
        {rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            {tr("No stores connected", "لا توجد متاجر متصلة", "Bağlı mağaza yok")}
          </div>
        ) : (
          rows.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
              <div
                className="w-7 h-7 rounded flex items-center justify-center text-white text-[9px] font-bold capitalize flex-shrink-0"
                style={{
                  backgroundColor:
                    PLATFORM_COLORS[s.platform] || PLATFORM_COLORS.other,
                }}
              >
                {s.platform.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold text-cyan-900 truncate"
                  dir="ltr"
                  style={{ unicodeBidi: "embed" }}
                >
                  {s.shopDomain}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span>
                    {fmtNum(s.totalCustomersImported)} {tr("cust.", "عميل", "müş.")}
                  </span>
                  <span>
                    {fmtNum(s.totalOrdersImported)} {tr("orders", "طلب", "sipariş")}
                  </span>
                </div>
              </div>
              <StatusDot status={s.syncStatus} tr={tr} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusDot({
  status,
  tr,
}: {
  status: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const map: Record<string, { bg: string; label: string }> = {
    success: { bg: "bg-emerald-500", label: tr("ok", "جاهز", "tamam") },
    syncing: { bg: "bg-sky-500 animate-pulse", label: tr("syncing", "جارٍ", "senkron") },
    error: { bg: "bg-rose-500", label: tr("error", "خطأ", "hata") },
    idle: { bg: "bg-slate-300", label: tr("idle", "خامل", "bekleme") },
  };
  const cfg = map[status] || map.idle;
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
      <span className="text-[10px] text-slate-600">{cfg.label}</span>
    </div>
  );
}

// ─── Empty / error states ──────────────────────────────────────────────

function EmptyState({
  locale,
  tr,
}: {
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-sky-100 border-dashed rounded-xl p-12 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl bg-white border border-sky-200 flex items-center justify-center mb-4">
        <Store className="w-6 h-6 text-cyan-600" />
      </div>
      <h2 className="text-lg font-bold text-cyan-900 mb-1">
        {tr(
          "Connect a store to see analytics",
          "اربط متجراً لعرض التحليلات",
          "Analitiği görmek için bir mağaza bağlayın"
        )}
      </h2>
      <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
        {tr(
          "Import customers and orders from Shopify, Salla, WooCommerce, and 37+ more platforms.",
          "استورد العملاء والطلبات من Shopify و Salla و WooCommerce وأكثر من 37 منصة أخرى.",
          "Shopify, Salla, WooCommerce ve 37'den fazla platformdan müşteri ve siparişleri içe aktarın."
        )}
      </p>
      <Link
        href={`/${locale}/settings/integrations`}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
      >
        {tr("Connect a store", "ربط متجر", "Mağaza bağla")}
      </Link>
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
  tr,
}: {
  message: string;
  onRetry: () => void;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-rose-900">
          {tr("Could not load analytics", "تعذر تحميل التحليلات", "Analitik yüklenemedi")}
        </p>
        <p className="text-xs text-rose-700 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 bg-white text-xs font-semibold text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100"
      >
        {tr("Retry", "إعادة المحاولة", "Tekrar dene")}
      </button>
    </div>
  );
}
