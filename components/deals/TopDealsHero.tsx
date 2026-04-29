"use client";

import { useMemo } from "react";
import { Crown, Trophy, Award, Star, Sparkles, type LucideIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14r — Top 5 Deals hero strip
// 5 distinct rank cards (gold/cyan/emerald/violet/pink) sorted by deal
// value, plus a bar chart with matching per-deal colors below.
// ────────────────────────────────────────────────────────────────────

export interface TopDealRow {
  id: string;
  name: string;
  customer: string;
  value: number;
  stage: string;
}

interface RankPalette {
  bgFrom: string;
  bgTo: string;
  border: string;
  text: string;
  sub: string;
  barColor: string;
  Icon: LucideIcon;
}

const RANK_PALETTE: RankPalette[] = [
  {
    bgFrom: "from-amber-500/20",
    bgTo: "to-amber-500/5",
    border: "border-amber-500/40",
    text: "text-amber-100",
    sub: "text-amber-200",
    barColor: "#fbbf24",
    Icon: Crown,
  },
  {
    bgFrom: "from-cyan-500/20",
    bgTo: "to-cyan-500/5",
    border: "border-cyan-500/40",
    text: "text-cyan-100",
    sub: "text-cyan-200",
    barColor: "#22d3ee",
    Icon: Trophy,
  },
  {
    bgFrom: "from-emerald-500/20",
    bgTo: "to-emerald-500/5",
    border: "border-emerald-500/40",
    text: "text-emerald-100",
    sub: "text-emerald-200",
    barColor: "#34d399",
    Icon: Award,
  },
  {
    bgFrom: "from-violet-500/20",
    bgTo: "to-violet-500/5",
    border: "border-violet-500/40",
    text: "text-violet-100",
    sub: "text-violet-200",
    barColor: "#a78bfa",
    Icon: Star,
  },
  {
    bgFrom: "from-pink-500/20",
    bgTo: "to-pink-500/5",
    border: "border-pink-500/40",
    text: "text-pink-100",
    sub: "text-pink-200",
    barColor: "#f472b6",
    Icon: Sparkles,
  },
];

export function TopDealsHero({ deals }: { deals: TopDealRow[] }) {
  const top5 = useMemo(
    () => [...deals].sort((a, b) => b.value - a.value).slice(0, 5),
    [deals],
  );

  if (top5.length === 0) return null;

  const chartData = top5.map((d, i) => ({
    name: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
    fullName: d.name,
    customer: d.customer,
    value: d.value,
    color: RANK_PALETTE[i].barColor,
  }));

  const totalValue = top5.reduce((s, d) => s + d.value, 0);

  return (
    <section className="space-y-4 mb-2">
      <div>
        <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">
          TOP 5 DEALS
        </p>
        <h2 className="text-foreground text-xl font-bold">
          Highest-value opportunities
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {top5.map((d, i) => {
          const p = RANK_PALETTE[i];
          return (
            <article
              key={d.id}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                p.border,
                p.bgFrom,
                p.bgTo,
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg border bg-card/40 flex items-center justify-center",
                    p.border,
                  )}
                >
                  <p.Icon className={cn("w-4 h-4", p.sub)} />
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold border bg-card/40 tabular-nums",
                    p.border,
                    p.sub,
                  )}
                >
                  #{i + 1}
                </span>
              </div>
              <p className={cn("font-bold text-sm leading-tight mb-0.5", p.text)}>
                {d.name}
              </p>
              <p className={cn("text-xs mb-2 line-clamp-1", p.sub)}>
                {d.customer}
              </p>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-2xl font-bold tabular-nums", p.text)}>
                  ${(d.value / 1000).toFixed(0)}k
                </span>
                <span className={cn("text-xs capitalize", p.sub)}>
                  {d.stage}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-0.5">
              VALUE BY DEAL
            </p>
            <h3 className="text-foreground text-base font-bold">
              Top 5 pipeline value
            </h3>
          </div>
          <span className="text-muted-foreground text-xs">
            Total:{" "}
            <span className="text-foreground font-bold tabular-nums">
              ${(totalValue / 1000).toFixed(0)}k
            </span>
          </span>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
            >
              <XAxis
                dataKey="name"
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
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                formatter={
                  (((v: number, _n: string, p: { payload: { fullName: string } }) => [
                    `$${(v / 1000).toFixed(1)}k`,
                    p.payload.fullName,
                  ]) as never)
                }
                labelFormatter={() => ""}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                animationDuration={700}
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
