"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
// Sprint 14p — Pipeline Snapshot chart
// Bar chart per pipeline stage with Count / Value toggle and hover-to-
// isolate. Section accent: cyan-300. Each stage carries its own color
// so the chart visually maps to standard pipeline stages.
// ────────────────────────────────────────────────────────────────────

export interface PipelineStage {
  stage: string;
  count: number;
  value: number;
  color: string;
}

const MOCK_STAGES: PipelineStage[] = [
  { stage: "Discovery",   count: 12, value: 48000,  color: "#22d3ee" }, // cyan-400
  { stage: "Qualified",   count: 8,  value: 65000,  color: "#a78bfa" }, // violet-400
  { stage: "Proposal",    count: 5,  value: 92000,  color: "#fb923c" }, // orange-400
  { stage: "Negotiation", count: 3,  value: 87000,  color: "#fbbf24" }, // amber-400
  { stage: "Won",         count: 7,  value: 156000, color: "#34d399" }, // emerald-400
];

interface Props {
  data?: PipelineStage[];
}

export default function PipelineSnapshotChart({ data = MOCK_STAGES }: Props) {
  const [metric, setMetric] = useState<"count" | "value">("count");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const totalCount = data.reduce((s, d) => s + d.count, 0);
  const totalValue = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 min-h-[320px] flex flex-col">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1">
            PIPELINE SNAPSHOT
          </p>
          <h3 className="text-foreground text-lg font-bold">
            By stage —{" "}
            <span className="tabular-nums text-cyan-300">
              {metric === "count"
                ? `${totalCount} deals`
                : `$${(totalValue / 1000).toFixed(0)}k`}
            </span>
          </h3>
        </div>
        <div className="flex gap-1 bg-background border border-border rounded-lg p-1 flex-shrink-0">
          <button
            onClick={() => setMetric("count")}
            className={
              metric === "count"
                ? "px-3 py-1 rounded-md text-xs font-medium bg-card text-foreground border border-border"
                : "px-3 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
            }
          >
            Count
          </button>
          <button
            onClick={() => setMetric("value")}
            className={
              metric === "value"
                ? "px-3 py-1 rounded-md text-xs font-medium bg-card text-foreground border border-border"
                : "px-3 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
            }
          >
            Value
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          >
            <XAxis
              dataKey="stage"
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
              tickFormatter={(v) =>
                metric === "value" ? `$${v / 1000}k` : String(v)
              }
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={CHART_TOOLTIP_LABEL_STYLE}
              itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              formatter={((v: number) =>
                metric === "value" ? `$${v.toLocaleString()}` : String(v)) as never}
            />
            <Bar
              dataKey={metric}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {data.map((d) => (
                <Cell
                  key={d.stage}
                  fill={d.color}
                  fillOpacity={
                    activeStage && activeStage !== d.stage ? 0.3 : 1
                  }
                  onMouseEnter={() => setActiveStage(d.stage)}
                  onMouseLeave={() => setActiveStage(null)}
                  style={{ cursor: "pointer", transition: "fill-opacity 0.2s" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-2.5 flex-wrap">
        {data.map((d) => (
          <div
            key={d.stage}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
            onMouseEnter={() => setActiveStage(d.stage)}
            onMouseLeave={() => setActiveStage(null)}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span>{d.stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
