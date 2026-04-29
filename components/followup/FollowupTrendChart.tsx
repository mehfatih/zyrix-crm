"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import {
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "@/lib/chart-styles";
import type { TrendPoint } from "@/lib/followup/mock-trend";

// ────────────────────────────────────────────────────────────────────
// Sprint 14x — FollowupTrendChart
// Full-width 30-day trend with Bar/Line/Area switcher. Three count
// series on the main axis (totalStale/critical/warning), valueAtRisk
// rendered as an inset violet sparkline so the currency scale doesn't
// distort the integer counts.
// ────────────────────────────────────────────────────────────────────

const CYAN = "#22d3ee";
const ROSE = "#fb7185";
const AMBER = "#fbbf24";
const VIOLET = "#a78bfa";

type ChartType = "line" | "area" | "bar";
const TYPES: ChartType[] = ["line", "area", "bar"];

interface Props {
  data: TrendPoint[];
  formatMoney: (n: number) => string;
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function FollowupTrendChart({ data, formatMoney }: Props) {
  const t = useTranslations("Followup");
  const [chartType, setChartType] = useState<ChartType>("area");

  const chartData = useMemo(
    () =>
      data.map((p) => ({
        ...p,
        label: shortDate(p.date),
      })),
    [data],
  );

  const isEmpty = useMemo(
    () =>
      data.every(
        (p) =>
          p.totalStale === 0 &&
          p.critical === 0 &&
          p.warning === 0 &&
          p.valueAtRisk === 0,
      ),
    [data],
  );

  const seriesNames = {
    totalStale: t("stats.totalStale"),
    critical: t("stats.critical"),
    warning: t("stats.warning"),
  };

  const renderMainChart = () => {
    const axes = (
      <>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="label"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
          itemStyle={CHART_TOOLTIP_ITEM_STYLE}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{
            fontSize: 11,
            color: "hsl(var(--muted-foreground))",
          }}
        />
      </>
    );

    if (chartType === "bar") {
      return (
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
        >
          {axes}
          <Bar dataKey="totalStale" name={seriesNames.totalStale} fill={CYAN} radius={[3, 3, 0, 0]} animationDuration={800} />
          <Bar dataKey="critical" name={seriesNames.critical} fill={ROSE} radius={[3, 3, 0, 0]} animationDuration={800} />
          <Bar dataKey="warning" name={seriesNames.warning} fill={AMBER} radius={[3, 3, 0, 0]} animationDuration={800} />
        </BarChart>
      );
    }
    if (chartType === "line") {
      return (
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
        >
          {axes}
          <Line type="monotone" dataKey="totalStale" name={seriesNames.totalStale} stroke={CYAN} strokeWidth={2} dot={false} animationDuration={800} />
          <Line type="monotone" dataKey="critical" name={seriesNames.critical} stroke={ROSE} strokeWidth={2} dot={false} animationDuration={800} />
          <Line type="monotone" dataKey="warning" name={seriesNames.warning} stroke={AMBER} strokeWidth={2} dot={false} animationDuration={800} />
        </LineChart>
      );
    }
    return (
      <AreaChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
      >
        <defs>
          <linearGradient id="fu-trend-cyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity={0.45} />
            <stop offset="100%" stopColor={CYAN} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fu-trend-rose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ROSE} stopOpacity={0.45} />
            <stop offset="100%" stopColor={ROSE} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fu-trend-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity={0.45} />
            <stop offset="100%" stopColor={AMBER} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        {axes}
        <Area type="monotone" dataKey="totalStale" name={seriesNames.totalStale} stroke={CYAN} fill="url(#fu-trend-cyan)" strokeWidth={2} animationDuration={800} />
        <Area type="monotone" dataKey="critical" name={seriesNames.critical} stroke={ROSE} fill="url(#fu-trend-rose)" strokeWidth={2} animationDuration={800} />
        <Area type="monotone" dataKey="warning" name={seriesNames.warning} stroke={AMBER} fill="url(#fu-trend-amber)" strokeWidth={2} animationDuration={800} />
      </AreaChart>
    );
  };

  const valueAtRiskTotal = useMemo(
    () => data.reduce((sum, p) => sum + p.valueAtRisk, 0),
    [data],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 relative">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="text-foreground text-lg font-bold">
            {t("trend.title")}
          </h3>
          <p className="text-muted-foreground text-sm">{t("trend.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                chartType === type
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-200"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`trend.chartType.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">{t("trend.empty")}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderMainChart()}
          </ResponsiveContainer>
        )}

        {/* Inset: Value at Risk mini-sparkline */}
        {!isEmpty && (
          <div className="absolute top-2 right-2 w-[180px] rounded-lg border border-violet-500/30 bg-card/90 backdrop-blur p-2 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300">
              {t("trend.insetTitle")}
            </p>
            <p className="text-xs font-bold text-violet-200 tabular-nums">
              {formatMoney(valueAtRiskTotal)}
            </p>
            <div className="h-10 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="valueAtRisk"
                    stroke={VIOLET}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
