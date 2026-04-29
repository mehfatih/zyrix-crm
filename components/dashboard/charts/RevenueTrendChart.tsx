"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// ────────────────────────────────────────────────────────────────────
// Sprint 14p — Revenue Trend chart (won vs lost)
// Animated gradient area chart with Won/Lost toggle. Section accent:
// emerald-300. Color values use literal hex so recharts (which doesn't
// understand Tailwind tokens) can render them.
// ────────────────────────────────────────────────────────────────────

export interface RevenueTrendPoint {
  month: string;
  won: number;
  lost: number;
}

const MOCK_DATA: RevenueTrendPoint[] = [
  { month: "Nov", won: 42000, lost: 8000 },
  { month: "Dec", won: 38000, lost: 12000 },
  { month: "Jan", won: 51000, lost: 6000 },
  { month: "Feb", won: 47000, lost: 9000 },
  { month: "Mar", won: 62000, lost: 11000 },
  { month: "Apr", won: 73000, lost: 7000 },
];

const VIEWS = [
  { id: "won", label: "Won", color: "#34d399" }, // emerald-400
  { id: "lost", label: "Lost", color: "#fb7185" }, // rose-400
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

interface Props {
  data?: RevenueTrendPoint[];
}

export default function RevenueTrendChart({ data = MOCK_DATA }: Props) {
  const [activeView, setActiveView] = useState<ViewId>("won");
  const activeColor =
    VIEWS.find((v) => v.id === activeView)?.color ?? "#34d399";
  const totalWon = data.reduce((sum, d) => sum + d.won, 0);
  const totalLost = data.reduce((sum, d) => sum + d.lost, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 min-h-[320px] flex flex-col">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">
            REVENUE TREND
          </p>
          <h3 className="text-foreground text-lg font-bold">
            Won vs lost (last 6 months)
          </h3>
        </div>
        <div className="flex gap-1 bg-background border border-border rounded-lg p-1 flex-shrink-0">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={
                activeView === v.id
                  ? "px-3 py-1 rounded-md text-xs font-medium bg-card text-foreground border border-border"
                  : "px-3 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div>
            <div className="text-foreground font-bold tabular-nums">
              ${(totalWon / 1000).toFixed(1)}k
            </div>
            <div className="text-muted-foreground text-xs">won</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-3.5 h-3.5 text-rose-300" />
          </div>
          <div>
            <div className="text-foreground font-bold tabular-nums">
              ${(totalLost / 1000).toFixed(1)}k
            </div>
            <div className="text-muted-foreground text-xs">lost</div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          >
            <defs>
              <linearGradient
                id={`revenue-gradient-${activeView}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={activeColor}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={activeColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
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
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
              formatter={((v: number) => [
                `$${v.toLocaleString()}`,
                activeView === "won" ? "Won" : "Lost",
              ]) as never}
            />
            <Area
              type="monotone"
              dataKey={activeView}
              stroke={activeColor}
              strokeWidth={2}
              fill={`url(#revenue-gradient-${activeView})`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
