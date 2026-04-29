"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Loader2,
  DollarSign,
  Target,
  BarChart3,
  AlertTriangle,
  Calendar,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  fetchForecast,
  fetchHistorical,
  type ForecastSummary,
  type HistoricalContext,
  type Horizon,
} from "@/lib/api/cashflow";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// CASH FLOW FORECAST PAGE
// ============================================================================

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-slate-400",
  qualified: "bg-sky-400",
  proposal: "bg-indigo-400",
  negotiation: "bg-amber-400",
  proposal_accepted: "bg-emerald-400",
  won: "bg-emerald-600",
  lost: "bg-red-400",
};

export default function CashflowPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Cashflow");

  const [horizon, setHorizon] = useState<Horizon>(30);
  const [forecast, setForecast] = useState<ForecastSummary | null>(null);
  const [historical, setHistorical] = useState<HistoricalContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [f, h] = await Promise.all([
        fetchForecast(horizon, "TRY"),
        fetchHistorical(),
      ]);
      setForecast(f);
      setHistorical(h);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horizon]);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">CASH FLOW</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-300" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          {/* Horizon selector */}
          <div className="bg-card border border-border rounded-lg p-1 flex gap-1">
            {([30, 60, 90] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  horizon === h
                    ? "bg-sky-500 text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {h}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-300 bg-rose-500/10 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : !forecast ? (
          <div>—</div>
        ) : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard
                icon={DollarSign}
                label={t("kpi.weighted")}
                value={formatMoney(
                  forecast.totalWeightedValue,
                  forecast.currency,
                  locale
                )}
                hint={t("kpi.weightedHint")}
                color="emerald"
              />
              <KpiCard
                icon={Target}
                label={t("kpi.potential")}
                value={formatMoney(
                  forecast.totalPotentialValue,
                  forecast.currency,
                  locale
                )}
                hint={t("kpi.potentialHint")}
                color="cyan"
              />
              <KpiCard
                icon={BarChart3}
                label={t("kpi.deals")}
                value={String(forecast.dealCount)}
                hint={t("kpi.dealsHint", { horizon: String(horizon) })}
                color="sky"
              />
              <KpiCard
                icon={TrendingUp}
                label={t("kpi.avgProbability")}
                value={`${forecast.avgProbability.toFixed(1)}%`}
                hint={t("kpi.avgProbabilityHint")}
                color="amber"
              />
            </div>

            {/* Historical context banner */}
            {historical && (
              <div className="bg-gradient-to-r from-sky-50 to-sky-50 border border-border rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-card rounded-lg p-2 shadow-sm">
                    <Award className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {t("historical.title")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("historical.subtitle")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <HistBox
                    label={t("historical.wonCount")}
                    value={String(historical.wonLast30dCount)}
                    positive
                  />
                  <HistBox
                    label={t("historical.wonValue")}
                    value={formatMoney(
                      historical.wonLast30dValue,
                      forecast.currency,
                      locale
                    )}
                    positive
                  />
                  <HistBox
                    label={t("historical.winRate")}
                    value={`${historical.winRatePercent.toFixed(1)}%`}
                  />
                  <HistBox
                    label={t("historical.avgDealSize")}
                    value={formatMoney(
                      historical.historicalAvgDealSize,
                      forecast.currency,
                      locale
                    )}
                  />
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {t("chart.title", { horizon: String(horizon) })}
              </h3>
              {forecast.buckets.length === 0 ||
              forecast.buckets.every((b) => b.weightedValue === 0) ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 text-sky-300" />
                  <p className="text-sm">{t("chart.empty")}</p>
                  <p className="text-xs mt-1">{t("chart.emptyHint")}</p>
                </div>
              ) : (
                <ForecastBarChart
                  buckets={forecast.buckets}
                  currency={forecast.currency}
                  locale={locale}
                />
              )}
            </div>

            {/* Two-column: by stage + top deals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* By stage */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/50">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t("byStage.title")}
                  </h3>
                </div>
                {forecast.byStage.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    {t("byStage.empty")}
                  </div>
                ) : (
                  <div className="divide-y divide-sky-50">
                    {forecast.byStage.map((s, idx) => {
                      const pct =
                        forecast.totalWeightedValue > 0
                          ? (s.weightedValue / forecast.totalWeightedValue) * 100
                          : 0;
                      const color = STAGE_COLORS[s.stage] || "bg-slate-400";
                      return (
                        <div key={idx} className="px-5 py-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${color}`}
                              />
                              <span className="text-sm font-medium text-foreground capitalize">
                                {s.stage.replace(/_/g, " ")}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({s.count})
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {formatMoney(
                                s.weightedValue,
                                forecast.currency,
                                locale
                              )}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${color} transition-all`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top deals */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {t("topDeals.title")}
                  </h3>
                </div>
                {forecast.topDeals.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    {t("topDeals.empty")}
                  </div>
                ) : (
                  <div className="divide-y divide-sky-50">
                    {forecast.topDeals.map((d, idx) => (
                      <div
                        key={idx}
                        className="px-5 py-3 flex items-start gap-3 hover:bg-muted/30"
                      >
                        <div className="w-7 h-7 rounded-full bg-muted text-cyan-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            {d.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {d.customer.fullName}
                            {d.customer.companyName
                              ? ` — ${d.customer.companyName}`
                              : ""}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="text-muted-foreground capitalize">
                              {d.stage.replace(/_/g, " ")}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                              {d.probability}%
                            </span>
                            {d.expectedCloseDate && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground flex items-center gap-0.5">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(d.expectedCloseDate, locale)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-emerald-300 text-sm">
                            {formatMoney(d.weightedValue, d.currency, locale)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("topDeals.of")}{" "}
                            {formatMoney(d.value, d.currency, locale)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Hand-built SVG Bar Chart
// ============================================================================
function ForecastBarChart({
  buckets,
  currency,
  locale,
}: {
  buckets: import("@/lib/api/cashflow").ForecastBucket[];
  currency: string;
  locale: string;
}) {
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 60, left: 70 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...buckets.map((b) => b.weightedValue), 1);
  const barWidth = innerW / buckets.length - 8;

  // Build Y-axis ticks (5 ticks)
  const tickCount = 5;
  const ticks: number[] = [];
  for (let i = 0; i <= tickCount; i++) {
    ticks.push((max / tickCount) * i);
  }

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full"
      >
        {/* Gridlines + Y-axis labels */}
        {ticks.map((t, i) => {
          const y = padding.top + innerH - (t / max) * innerH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#E0F2FE"
                strokeDasharray={i === 0 ? "" : "2,3"}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#64748B"
              >
                {formatMoneyShort(t)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {buckets.map((b, i) => {
          const x = padding.left + i * (innerW / buckets.length) + 4;
          const h = (b.weightedValue / max) * innerH;
          const y = padding.top + innerH - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={4}
                fill="url(#barGradient)"
              />
              {/* Label on top */}
              {b.weightedValue > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill="#0284C7"
                >
                  {formatMoneyShort(b.weightedValue)}
                </text>
              )}
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + innerH + 16}
                textAnchor="middle"
                fontSize={10}
                fill="#64748B"
              >
                {b.label}
              </text>
              {/* Count below */}
              <text
                x={x + barWidth / 2}
                y={padding.top + innerH + 32}
                textAnchor="middle"
                fontSize={9}
                fill="#94A3B8"
              >
                {b.dealCount} deals
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ============================================================================
// UI Helpers
// ============================================================================
function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  hint: string;
  color: "cyan" | "sky" | "emerald" | "amber";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-muted", iconText: "text-cyan-300" },
    sky: { iconBg: "bg-muted", iconText: "text-cyan-300" },
    emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-300" },
    amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-300" },
  };
  const c = colors[color];
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="text-xl font-bold text-foreground truncate">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

function HistBox({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-card rounded-lg border border-border px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`text-sm font-bold mt-0.5 ${
          positive ? "text-emerald-300" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function formatMoney(amount: number, currency: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toFixed(0)} ${currency}`;
  }
}

function formatMoneyShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
