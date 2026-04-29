"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy } from "lucide-react";

// ────────────────────────────────────────────────────────────────────
// Sprint 14p — Team Leaderboard chart
// Horizontal bar chart with a lime gradient palette. Each bar is a
// rep, sized by their 30-day sales total. Section accent: lime-300.
// ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  sales: number;
}

const MOCK: TeamMember[] = [
  { name: "Ahmed", sales: 42000 },
  { name: "Sarah", sales: 38000 },
  { name: "Mehmet", sales: 35000 },
  { name: "Layla", sales: 28000 },
  { name: "Khalid", sales: 22000 },
];

// Lime gradient — bright at top, deeper toward bottom of leaderboard.
const PALETTE = ["#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#365314"];

interface Props {
  data?: TeamMember[];
  className?: string;
}

export default function TeamLeaderboardChart({ data = MOCK, className }: Props) {
  const total = data.reduce((s, d) => s + d.sales, 0);

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-5 md:p-6 min-h-[320px] flex flex-col ${className ?? ""}`}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="text-lime-300 text-xs font-bold uppercase tracking-widest mb-1">
            TEAM LEADERBOARD
          </p>
          <h3 className="text-foreground text-lg font-bold">
            Top performers (30d)
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lime-500/15 border border-lime-500/30 flex-shrink-0">
          <Trophy className="w-3.5 h-3.5 text-lime-300" />
          <span className="text-lime-300 text-xs font-bold tabular-nums">
            ${(total / 1000).toFixed(0)}k total
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No team sales yet — leaderboard will appear once your reps close their first deals.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
                formatter={((v: number) => `$${v.toLocaleString()}`) as never}
              />
              <Bar
                dataKey="sales"
                radius={[0, 8, 8, 0]}
                animationDuration={800}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PALETTE[i % PALETTE.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
