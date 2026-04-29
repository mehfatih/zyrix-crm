"use client";

import { useState } from "react";
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
import type {
  AnalyticsTab,
  ChartType,
} from "@/lib/analytics/tab-catalog";
import { HEX, TAB_EYEBROW } from "./colors";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
}

const TYPES: ChartType[] = ["bar", "line", "area"];

export function AnalyticsPivotChart({ tab, locale }: Props) {
  const t = useTranslations("Analytics");
  const [chartType, setChartType] = useState<ChartType>(
    tab.pivot.defaultChartType,
  );

  const renderChart = () => {
    const common = (
      <>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="month"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
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
          data={tab.pivot.data}
          margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
        >
          {common}
          {tab.pivot.series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.label[locale]}
              fill={HEX[s.color]}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          ))}
        </BarChart>
      );
    }
    if (chartType === "line") {
      return (
        <LineChart
          data={tab.pivot.data}
          margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
        >
          {common}
          {tab.pivot.series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label[locale]}
              stroke={HEX[s.color]}
              strokeWidth={2}
              dot={false}
              animationDuration={600}
            />
          ))}
        </LineChart>
      );
    }
    return (
      <AreaChart
        data={tab.pivot.data}
        margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
      >
        <defs>
          {tab.pivot.series.map((s) => (
            <linearGradient
              key={s.dataKey}
              id={`piv-${tab.id}-${s.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={HEX[s.color]} stopOpacity={0.5} />
              <stop offset="100%" stopColor={HEX[s.color]} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        {common}
        {tab.pivot.series.map((s) => (
          <Area
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.label[locale]}
            stroke={HEX[s.color]}
            fill={`url(#piv-${tab.id}-${s.dataKey})`}
            strokeWidth={2}
            animationDuration={600}
          />
        ))}
      </AreaChart>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <p
            className={`${TAB_EYEBROW[tab.color]} text-[11px] font-bold uppercase tracking-widest mb-1`}
          >
            {t("pivot.title")}
          </p>
          <h3 className="text-foreground text-base font-bold">
            {tab.name[locale]}
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                chartType === type
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`pivot.chartType.${type}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
