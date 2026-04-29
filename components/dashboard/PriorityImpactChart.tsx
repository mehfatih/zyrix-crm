"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";

// ────────────────────────────────────────────────────────────────────
// Sprint 14q — small inline bar chart that sits beside the
// "Priority Actions" section header. Each bar's color matches the
// kind of its action card (rose / amber / emerald / cyan / violet).
// Hovering a bar shows the action title.
// ────────────────────────────────────────────────────────────────────

export type PriorityKind =
  | "critical"
  | "action"
  | "opportunity"
  | "progress"
  | "renewal";

export interface PriorityChartItem {
  rank: number;
  kind: PriorityKind;
  impactPercent: number;
  title: string;
}

const KIND_COLOR: Record<PriorityKind, string> = {
  critical: "#fb7185",   // rose-400
  action: "#fbbf24",     // amber-400
  opportunity: "#34d399",// emerald-400
  progress: "#22d3ee",   // cyan-400
  renewal: "#a78bfa",    // violet-400
};

interface Props {
  actions: PriorityChartItem[];
  className?: string;
}

export function PriorityImpactChart({ actions, className }: Props) {
  if (!actions || actions.length === 0) return null;
  const data = actions.map((a) => ({
    name: `#${a.rank}`,
    impact: a.impactPercent,
    color: KIND_COLOR[a.kind],
    title: a.title,
  }));

  return (
    <div className={`hidden md:block w-44 h-20 ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "6px 10px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(((v: number, _n: string, p: { payload: { title: string } }) => [
              `${v}% impact`,
              p.payload.title,
            ]) as never)}
            labelFormatter={() => ""}
          />
          <Bar dataKey="impact" radius={[4, 4, 0, 0]} animationDuration={600}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
