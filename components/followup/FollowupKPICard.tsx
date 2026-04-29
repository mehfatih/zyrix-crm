"use client";

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

// ────────────────────────────────────────────────────────────────────
// Sprint 14x — FollowupKPICard
// Single colored KPI card (cyan/rose/amber/violet variant). Static
// class lookup tables keep Tailwind JIT happy.
// ────────────────────────────────────────────────────────────────────

export type KpiColor = "cyan" | "rose" | "amber" | "violet";

interface KpiClasses {
  card: string;
  iconBg: string;
  iconText: string;
  valueText: string;
}

const KPI_COLOR_CLASSES: Record<KpiColor, KpiClasses> = {
  cyan: {
    card: "border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-card",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconText: "text-cyan-300",
    valueText: "text-cyan-200",
  },
  rose: {
    card: "border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-card",
    iconBg: "bg-rose-500/15 border-rose-500/30",
    iconText: "text-rose-300",
    valueText: "text-rose-200",
  },
  amber: {
    card: "border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconText: "text-amber-300",
    valueText: "text-amber-200",
  },
  violet: {
    card: "border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-card",
    iconBg: "bg-violet-500/15 border-violet-500/30",
    iconText: "text-violet-300",
    valueText: "text-violet-200",
  },
};

interface Trend {
  delta: number;
  period: string;
  goodWhen: "up" | "down";
}

interface Props {
  color: KpiColor;
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: Trend;
}

export function FollowupKPICard({ color, icon: Icon, label, value, trend }: Props) {
  const c = KPI_COLOR_CLASSES[color];

  let trendNode: React.ReactNode = null;
  if (trend) {
    const isUp = trend.delta > 0;
    const isFlat = trend.delta === 0;
    const isGood = isFlat
      ? false
      : (trend.goodWhen === "up" && isUp) || (trend.goodWhen === "down" && !isUp);
    const trendColor = isFlat
      ? "text-muted-foreground"
      : isGood
        ? "text-emerald-300"
        : "text-rose-300";
    const TrendIcon = isFlat ? null : isUp ? TrendingUp : TrendingDown;
    trendNode = (
      <p className={`text-xs mt-3 inline-flex items-center gap-1 ${trendColor}`}>
        {TrendIcon && <TrendIcon className="w-3 h-3" />}
        {Math.abs(trend.delta).toLocaleString()} {trend.period}
      </p>
    );
  }

  return (
    <div className={`rounded-xl border ${c.card} p-5 min-h-[120px] flex flex-col`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg border ${c.iconBg} ${c.iconText} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      <p className={`text-3xl font-bold ${c.valueText} tabular-nums`}>{value}</p>
      {trendNode}
    </div>
  );
}
