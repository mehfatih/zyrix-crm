"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Sessions Trend chart (top 5 employees)
// Multi-line chart, one colored line per top-5 user. The session-events
// API returns per-user aggregates over the date range, not a daily
// breakdown — so we synthesize a 7-day curve from each user's totals
// (same total, smoothed bell distribution) so the chart renders
// without backend changes. Values are illustrative; replace with real
// daily series once the API exposes one.
// ────────────────────────────────────────────────────────────────────

const LINE_COLORS = [
  "#fbbf24", // amber-400
  "#22d3ee", // cyan-400
  "#34d399", // emerald-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
];

export interface SessionUser {
  id: string;
  name: string;
  total: number;
}

interface Props {
  users: SessionUser[];
  /** Number of days to spread the totals across. Default 7. */
  days?: number;
}

// Bell-curve weights summing to 1 (rough Gaussian over 7 days).
const BELL_7 = [0.05, 0.1, 0.18, 0.22, 0.2, 0.15, 0.1];

function distribute(total: number, days: number): number[] {
  if (days <= 1) return [total];
  // Use the precomputed bell when days=7, otherwise even spread.
  const weights =
    days === 7
      ? BELL_7
      : Array.from({ length: days }, () => 1 / days);
  // Floor each daily value, then redistribute the remainder to keep the
  // sum exactly equal to the total.
  const raw = weights.map((w) => total * w);
  const floored = raw.map((v) => Math.floor(v));
  let remainder = total - floored.reduce((s, v) => s + v, 0);
  // Hand the leftover units to the days with the largest fractional
  // parts so the daily shape stays smooth.
  const indices = raw
    .map((v, i) => ({ frac: v - Math.floor(v), i }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < indices.length && remainder > 0; k++) {
    floored[indices[k].i] += 1;
    remainder -= 1;
  }
  return floored;
}

export function SessionsTrendChart({ users, days = 7 }: Props) {
  const top5 = [...users].sort((a, b) => b.total - a.total).slice(0, 5);

  // Build chart data: one row per day, columns are user IDs.
  const chartData = Array.from({ length: days }, (_, dayIdx) => {
    const row: Record<string, string | number> = {
      day: `D-${days - dayIdx}`,
    };
    top5.forEach((u) => {
      const series = distribute(u.total, days);
      row[u.id] = series[dayIdx] ?? 0;
    });
    return row;
  });

  const empty = top5.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1">
          SESSIONS TREND
        </p>
        <h3 className="text-foreground text-base font-bold">
          Daily activity for top 5 employees
        </h3>
        <p className="text-muted-foreground text-xs mt-0.5">
          Synthesized {days}-day distribution of total sessions per user.
        </p>
      </div>
      <div className="h-72">
        {empty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No employee activity yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="day"
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
              {top5.map((u, i) => (
                <Line
                  key={u.id}
                  type="monotone"
                  dataKey={u.id}
                  name={u.name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={700 + i * 100}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
