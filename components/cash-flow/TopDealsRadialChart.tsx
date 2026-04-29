"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Top 10 Deals by Weighted Value
// RadialBarChart — each deal is a curved bar around the chart's center,
// visually distinct from the funnel + bar chart elsewhere on the page.
// ────────────────────────────────────────────────────────────────────

export interface TopDealRadial {
  id: string;
  name: string;
  weightedValue: number;
}

const PALETTE = [
  "#fbbf24", // amber-400
  "#22d3ee", // cyan-400
  "#34d399", // emerald-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#fb7185", // rose-400
  "#84cc16", // lime-400
  "#06b6d4", // cyan-500 deeper
  "#a855f7", // violet-500 deeper
  "#ec4899", // pink-500 deeper
];

interface Props {
  deals: TopDealRadial[];
  formatValue: (v: number) => string;
}

export function TopDealsRadialChart({ deals, formatValue }: Props) {
  const top10 = [...deals]
    .sort((a, b) => b.weightedValue - a.weightedValue)
    .slice(0, 10);

  const data = top10.map((d, i) => ({
    name: d.name.length > 20 ? d.name.slice(0, 20) + "…" : d.name,
    fullName: d.name,
    value: d.weightedValue,
    fill: PALETTE[i % PALETTE.length],
  }));

  const empty = data.length === 0;

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-card p-5 min-h-[340px] flex flex-col">
      <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-1">
        RADIAL
      </p>
      <h3 className="text-foreground font-bold mb-4">
        Top {Math.min(top10.length, 10)} Deals by Weighted Value
      </h3>
      <div className="flex-1 min-h-[240px]">
        {empty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No deals yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="20%"
              outerRadius="100%"
              data={data}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                dataKey="value"
                background={{ fill: "hsl(var(--muted))" }}
                animationDuration={900}
                cornerRadius={4}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={
                  (((v: number, _n: string, p: { payload: { fullName: string } }) => [
                    formatValue(v),
                    p.payload.fullName,
                  ]) as never)
                }
                labelFormatter={() => ""}
              />
              <Legend
                iconType="circle"
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  fontSize: 10,
                  color: "hsl(var(--muted-foreground))",
                  paddingLeft: 8,
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
