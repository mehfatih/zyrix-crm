"use client";

import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Weighted Value by Stage
// FunnelChart visualises the pipeline as a funnel — stages narrow as
// deals progress. Different chart type from the time-bucket bar chart
// elsewhere on the cashflow page.
// ────────────────────────────────────────────────────────────────────

export interface StagePoint {
  stage: string;
  weightedValue: number;
  count: number;
}

interface Props {
  data: StagePoint[];
  formatValue: (v: number) => string;
}

// Stage palette: cool → warm → green to read as flow toward Won
const STAGE_PALETTE = [
  "#94a3b8", // slate-400 (lead)
  "#22d3ee", // cyan-400 (qualified)
  "#fbbf24", // amber-400 (proposal)
  "#a78bfa", // violet-400 (negotiation)
  "#34d399", // emerald-400 (won/closing)
  "#f472b6", // pink-400 (extras)
];

export function WeightedByStageChart({ data, formatValue }: Props) {
  const sorted = [...data].sort((a, b) => b.weightedValue - a.weightedValue);

  const chartData = sorted.map((d, i) => ({
    name: d.stage.replace(/_/g, " "),
    value: d.weightedValue,
    count: d.count,
    fill: STAGE_PALETTE[i % STAGE_PALETTE.length],
  }));

  const empty = chartData.length === 0;

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-card p-5 min-h-[340px] flex flex-col">
      <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1">
        FUNNEL
      </p>
      <h3 className="text-foreground font-bold mb-4">Weighted Value by Stage</h3>
      <div className="flex-1 min-h-[240px]">
        {empty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No stage data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={
                  (((v: number, _n: string, p: { payload: { name: string; count: number } }) => [
                    `${formatValue(v)} · ${p.payload.count} deal${p.payload.count === 1 ? "" : "s"}`,
                    p.payload.name,
                  ]) as never)
                }
                labelFormatter={() => ""}
              />
              <Funnel
                dataKey="value"
                data={chartData}
                isAnimationActive
                animationDuration={800}
              >
                <LabelList
                  position="right"
                  fill="hsl(var(--foreground))"
                  stroke="none"
                  dataKey="name"
                  fontSize={11}
                  className="capitalize"
                />
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
