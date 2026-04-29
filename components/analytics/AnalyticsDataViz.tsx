"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AreaChart as AreaIcon,
  ArrowLeft,
  BarChart3,
  Filter,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Plus,
  ScatterChart as ScatterIcon,
  TrendingDown,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import {
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "@/lib/chart-styles";
import {
  getVizData,
  type AnalyticsTab,
  type VizChartType,
} from "@/lib/analytics/tab-catalog";
import { HEX, TAB_EYEBROW } from "./colors";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
}

const CHART_TYPES: { id: VizChartType; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "bar", icon: BarChart3 },
  { id: "line", icon: LineIcon },
  { id: "area", icon: AreaIcon },
  { id: "pie", icon: PieIcon },
  { id: "scatter", icon: ScatterIcon },
  { id: "funnel", icon: TrendingDown },
  { id: "radar", icon: Activity },
];

export function AnalyticsDataViz({ tab, locale }: Props) {
  const t = useTranslations("Analytics");
  const [chartType, setChartType] = useState<VizChartType>("bar");
  const [dimension, setDimension] = useState(tab.viz.defaultDimension);
  const [measure, setMeasure] = useState(tab.viz.defaultMeasure);
  const [filters, setFilters] = useState<string[]>([]);
  const [drillStack, setDrillStack] = useState<string[]>([]);

  const data = useMemo(
    () => getVizData(tab.id, dimension, measure, filters),
    [tab.id, dimension, measure, filters],
  );

  // Cycle through the 4 widget colors for chart segments.
  const segmentColors = tab.widgets.map((w) => HEX[w.color]);
  const accent = HEX[tab.color];

  const addFilter = () => {
    const sample = ["Country=SA", "Stage=Won", "Segment=Enterprise"];
    const next = sample.find((s) => !filters.includes(s));
    if (next) setFilters([...filters, next]);
  };

  const removeFilter = (f: string) => setFilters(filters.filter((x) => x !== f));

  const drillInto = (label: string) => {
    if (!drillStack.includes(label)) {
      setDrillStack([...drillStack, label]);
    }
  };
  const drillBack = () => setDrillStack(drillStack.slice(0, -1));

  const renderChart = () => {
    const commonAxes = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="x"
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
      </>
    );

    if (chartType === "bar") {
      return (
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          {commonAxes}
          <Bar
            dataKey="y"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
            onClick={(d) => drillInto(String(d.x))}
          >
            {data.map((d, i) => (
              <Cell key={d.x} fill={segmentColors[i % segmentColors.length]} />
            ))}
          </Bar>
        </BarChart>
      );
    }
    if (chartType === "line") {
      return (
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          {commonAxes}
          <Line
            type="monotone"
            dataKey="y"
            stroke={accent}
            strokeWidth={2}
            dot={{ r: 3, fill: accent }}
            animationDuration={500}
          />
        </LineChart>
      );
    }
    if (chartType === "area") {
      return (
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id={`viz-area-${tab.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
              <stop offset="100%" stopColor={accent} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {commonAxes}
          <Area
            type="monotone"
            dataKey="y"
            stroke={accent}
            fill={`url(#viz-area-${tab.id})`}
            strokeWidth={2}
            animationDuration={500}
          />
        </AreaChart>
      );
    }
    if (chartType === "pie") {
      return (
        <PieChart>
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
          />
          <Pie
            data={data}
            dataKey="y"
            nameKey="x"
            outerRadius="75%"
            animationDuration={500}
          >
            {data.map((d, i) => (
              <Cell key={d.x} fill={segmentColors[i % segmentColors.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }
    if (chartType === "scatter") {
      const scatter = data.map((d, i) => ({ idx: i, y: d.y, name: d.x }));
      return (
        <ScatterChart margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="idx"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis dataKey="y" range={[40, 200]} />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
          />
          <Scatter
            data={scatter}
            fill={accent}
            fillOpacity={0.7}
            animationDuration={500}
          />
        </ScatterChart>
      );
    }
    if (chartType === "funnel") {
      const funnel = [...data]
        .sort((a, b) => b.y - a.y)
        .map((d) => ({ name: d.x, value: d.y }));
      return (
        <FunnelChart>
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
          />
          <Funnel
            dataKey="value"
            data={funnel}
            isAnimationActive
            animationDuration={500}
          >
            <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
            {funnel.map((d, i) => (
              <Cell key={d.name} fill={segmentColors[i % segmentColors.length]} />
            ))}
          </Funnel>
        </FunnelChart>
      );
    }
    // radar
    return (
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" opacity={0.5} />
        <PolarAngleAxis dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={9} axisLine={false} />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
          itemStyle={CHART_TOOLTIP_ITEM_STYLE}
        />
        <Radar
          name={t(`viz.chartType.radar`)}
          dataKey="y"
          stroke={accent}
          fill={accent}
          fillOpacity={0.4}
          animationDuration={500}
        />
      </RadarChart>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className={`${TAB_EYEBROW[tab.color]} text-[11px] font-bold uppercase tracking-widest mb-1`}>
          {t("viz.title")}
        </p>
        <h3 className="text-foreground text-base font-bold">{t("viz.subtitle")}</h3>
      </div>

      {/* Chart-type tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 mb-4 flex-wrap">
        {CHART_TYPES.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setChartType(id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              chartType === id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {t(`viz.chartType.${id}`)}
          </button>
        ))}
      </div>

      {/* Dimension / Measure pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {t("viz.dimension")}
          </label>
          <select
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 px-3 text-sm text-foreground focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          >
            {tab.viz.dimensions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label[locale]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {t("viz.measure")}
          </label>
          <select
            value={measure}
            onChange={(e) => setMeasure(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 px-3 text-sm text-foreground focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          >
            {tab.viz.measures.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1">
          <Filter className="w-3 h-3" />
          {t("viz.filters")}
        </span>
        {filters.map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-200 text-xs font-medium"
          >
            {f}
            <button onClick={() => removeFilter(f)} aria-label="remove filter">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={addFilter}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-dashed border-border text-muted-foreground text-xs font-medium hover:border-violet-500/40 hover:text-foreground"
        >
          <Plus className="w-3 h-3" />
          {t("viz.addFilter")}
        </button>
      </div>

      {/* Chart */}
      <div className="h-[360px] mb-3">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Drill breadcrumb */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border flex-wrap">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-medium">All</span>
          {drillStack.map((s, i) => (
            <span key={`${s}-${i}`} className="inline-flex items-center gap-1">
              <span>›</span>
              <span className="text-foreground font-semibold">{s}</span>
            </span>
          ))}
        </div>
        {drillStack.length > 0 && (
          <button
            onClick={drillBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-3 h-3" />
            {t("viz.drill.back")}
          </button>
        )}
      </div>
    </div>
  );
}
