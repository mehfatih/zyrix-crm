"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Key Insights cards with mini charts
// 3 cards, 3 distinct accents (emerald / amber / violet), each with
// a different mini-chart type: line / bar / area. Demo data is fixed
// per insight so the cards animate on first paint.
// ────────────────────────────────────────────────────────────────────

type Variant = "emerald" | "amber" | "violet";
type ChartType = "line" | "bar" | "area";

const VARIANT_STYLES: Record<
  Variant,
  {
    ring: string;
    bg: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    eyebrow: string;
    stroke: string;
    gradId: string;
  }
> = {
  emerald: {
    ring: "ring-emerald-500/30 hover:ring-emerald-500/50",
    bg: "bg-gradient-to-br from-emerald-500/10 to-card",
    iconBg: "bg-emerald-500/15",
    iconBorder: "border-emerald-500/30",
    iconText: "text-emerald-300",
    eyebrow: "text-emerald-300",
    stroke: "#34d399",
    gradId: "ki-grad-emerald",
  },
  amber: {
    ring: "ring-amber-500/30 hover:ring-amber-500/50",
    bg: "bg-gradient-to-br from-amber-500/10 to-card",
    iconBg: "bg-amber-500/15",
    iconBorder: "border-amber-500/30",
    iconText: "text-amber-300",
    eyebrow: "text-amber-300",
    stroke: "#fbbf24",
    gradId: "ki-grad-amber",
  },
  violet: {
    ring: "ring-violet-500/30 hover:ring-violet-500/50",
    bg: "bg-gradient-to-br from-violet-500/10 to-card",
    iconBg: "bg-violet-500/15",
    iconBorder: "border-violet-500/30",
    iconText: "text-violet-300",
    eyebrow: "text-violet-300",
    stroke: "#a78bfa",
    gradId: "ki-grad-violet",
  },
};

interface InsightProps {
  variant: Variant;
  Icon: LucideIcon;
  eyebrow: string;
  title: string;
  caption: string;
  data: number[];
  chartType: ChartType;
}

function InsightCard({
  variant,
  Icon,
  eyebrow,
  title,
  caption,
  data,
  chartType,
}: InsightProps) {
  const s = VARIANT_STYLES[variant];
  const chartData = data.map((y, x) => ({ x, y }));

  return (
    <article
      className={cn(
        "rounded-2xl ring-1 transition-all p-5 flex flex-col min-h-[200px]",
        s.ring,
        s.bg,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg border flex items-center justify-center",
            s.iconBg,
            s.iconBorder,
          )}
        >
          <Icon className={cn("w-5 h-5", s.iconText)} />
        </div>
      </div>
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-widest mb-1",
          s.eyebrow,
        )}
      >
        {eyebrow}
      </p>
      <h3 className="text-foreground font-bold text-base mb-1.5 leading-tight">
        {title}
      </h3>
      <p className="text-muted-foreground text-xs mb-3 leading-relaxed line-clamp-2">
        {caption}
      </p>
      <div className="h-12 -mx-1 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            >
              <Tooltip
                cursor={false}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number) => [v, ""]) as never)}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke={s.stroke}
                strokeWidth={2}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart
              data={chartData}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            >
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number) => [v, ""]) as never)}
                labelFormatter={() => ""}
              />
              <Bar
                dataKey="y"
                fill={s.stroke}
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            >
              <defs>
                <linearGradient id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={s.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={false}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number) => [v, ""]) as never)}
                labelFormatter={() => ""}
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke={s.stroke}
                strokeWidth={2}
                fill={`url(#${s.gradId})`}
                animationDuration={800}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export function KeyInsights() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard
          variant="emerald"
          Icon={TrendingUp}
          eyebrow="CLOSING RATE"
          title="Closing rate up 18%"
          caption="Negotiation stage now converts at 64% vs 54% baseline."
          data={[54, 56, 58, 60, 62, 64, 64]}
          chartType="line"
        />
        <InsightCard
          variant="amber"
          Icon={AlertTriangle}
          eyebrow="DEALS AT RISK"
          title="3 deals at risk"
          caption="Combined value $86,500 — recommend immediate outreach."
          data={[1, 2, 2, 2, 3, 3, 3]}
          chartType="bar"
        />
        <InsightCard
          variant="violet"
          Icon={MessageCircle}
          eyebrow="CHANNEL EFFICIENCY"
          title="WhatsApp drives 2x replies"
          caption="Switching primary channel to WhatsApp recommended."
          data={[1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.0]}
          chartType="area"
        />
      </div>
    </section>
  );
}
