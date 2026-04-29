"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

// ────────────────────────────────────────────────────────────────────
// Sprint 14p — Top Customers donut
// Pie chart with a pink gradient palette, ranking customers by 30-day
// revenue. Section accent: pink-300.
// ────────────────────────────────────────────────────────────────────

export interface CustomerRevenue {
  name: string;
  revenue: number;
}

const MOCK: CustomerRevenue[] = [
  { name: "Levana Cosmetics", revenue: 42000 },
  { name: "Al-Faisal Trading", revenue: 38000 },
  { name: "Northwave",        revenue: 28000 },
  { name: "Atlasium",         revenue: 22000 },
  { name: "Veridyn",          revenue: 18000 },
  { name: "Others",           revenue: 12000 },
];

// Pink gradient — light at top, deeper for tail entries.
const PALETTE = [
  "#f9a8d4", // pink-300
  "#f472b6", // pink-400
  "#ec4899", // pink-500
  "#db2777", // pink-600
  "#be185d", // pink-700
  "#831843", // pink-900
];

interface Props {
  data?: CustomerRevenue[];
  className?: string;
}

export default function TopCustomersChart({ data = MOCK, className }: Props) {
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-5 md:p-6 min-h-[320px] flex flex-col ${className ?? ""}`}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-1">
            TOP CUSTOMERS
          </p>
          <h3 className="text-foreground text-lg font-bold">
            By revenue (30d)
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 flex-shrink-0">
          <Users className="w-3.5 h-3.5 text-pink-300" />
          <span className="text-pink-300 text-xs font-bold tabular-nums">
            ${(total / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center px-4">
            No customers yet — your top accounts will rank here as deals close.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="name"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                animationDuration={800}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
                formatter={((v: number) => `$${v.toLocaleString()}`) as never}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: 11,
                  color: "hsl(var(--muted-foreground))",
                  paddingTop: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
