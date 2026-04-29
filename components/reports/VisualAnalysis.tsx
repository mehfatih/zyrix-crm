"use client";

import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from "@/lib/chart-styles";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Visual Analysis: 4 distinct chart types
// 1. Bar         — Revenue by stage (cyan)
// 2. Radar       — Performance metrics this month vs last (violet/cyan)
// 3. Scatter     — Deal size vs days to close (emerald, sized by aiScore)
// 4. Stacked Area — Monthly trend won/lost (emerald + rose)
// ────────────────────────────────────────────────────────────────────

const STAGE_BAR_DATA = [
  { stage: "Lead", value: 12 },
  { stage: "Qualified", value: 28 },
  { stage: "Proposal", value: 42 },
  { stage: "Negotiation", value: 38 },
  { stage: "Closing", value: 52 },
];

const STAGE_BAR_COLORS = [
  "#94a3b8",
  "#22d3ee",
  "#fbbf24",
  "#a78bfa",
  "#34d399",
];

const RADAR_DATA = [
  { metric: "Revenue", thisMonth: 85, lastMonth: 70 },
  { metric: "Pipeline", thisMonth: 92, lastMonth: 75 },
  { metric: "Win Rate", thisMonth: 78, lastMonth: 68 },
  { metric: "Activity", thisMonth: 88, lastMonth: 80 },
  { metric: "Customers", thisMonth: 82, lastMonth: 72 },
];

const SCATTER_DATA = [
  { size: 5,  days: 8,  score: 84, name: "Acme Corp" },
  { size: 12, days: 14, score: 78, name: "Levant Foods" },
  { size: 18, days: 21, score: 91, name: "Al-Faisal Trading" },
  { size: 25, days: 30, score: 88, name: "Demir Tekstil" },
  { size: 32, days: 18, score: 95, name: "Northwave" },
  { size: 8,  days: 12, score: 72, name: "AlZahra Cosmetics" },
  { size: 45, days: 42, score: 80, name: "Mansour Holdings" },
  { size: 15, days: 24, score: 85, name: "Atlasium" },
  { size: 22, days: 16, score: 90, name: "Veridyn" },
  { size: 6,  days: 9,  score: 76, name: "Ozkan Logistics" },
];

const STACKED_AREA_DATA = [
  { month: "Nov", won: 42, lost: 12 },
  { month: "Dec", won: 38, lost: 18 },
  { month: "Jan", won: 51, lost: 9 },
  { month: "Feb", won: 47, lost: 14 },
  { month: "Mar", won: 62, lost: 11 },
  { month: "Apr", won: 73, lost: 8 },
];

interface PanelProps {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  children: React.ReactNode;
}

function Panel({ eyebrow, eyebrowColor, title, children }: PanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 min-h-[340px] flex flex-col">
      <p
        className={`text-xs font-bold uppercase tracking-widest mb-1 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h3 className="text-foreground text-base font-bold mb-4">{title}</h3>
      <div className="flex-1 min-h-[240px]">{children}</div>
    </div>
  );
}

export function VisualAnalysis() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-1">
          VISUAL ANALYSIS
        </p>
        <h2 className="text-foreground text-xl font-bold">
          Cross-cutting performance views
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Bar — Revenue by stage */}
        <Panel
          eyebrow="BAR"
          eyebrowColor="text-cyan-300"
          title="Revenue by stage"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={STAGE_BAR_DATA}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
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
                tickFormatter={(v) => `${v}k`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number) => [`$${v}k`, "Revenue"]) as never)}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                {STAGE_BAR_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={STAGE_BAR_COLORS[i % STAGE_BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* 2. Radar — Performance metrics */}
        <Panel
          eyebrow="RADAR"
          eyebrowColor="text-violet-300"
          title="This month vs last month"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" opacity={0.5} />
              <PolarAngleAxis
                dataKey="metric"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <PolarRadiusAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={9}
                axisLine={false}
                tickCount={4}
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
              <Radar
                name="This month"
                dataKey="thisMonth"
                stroke="#a78bfa"
                fill="#a78bfa"
                fillOpacity={0.5}
                animationDuration={800}
              />
              <Radar
                name="Last month"
                dataKey="lastMonth"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.3}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>

        {/* 3. Scatter — Deal size vs days to close */}
        <Panel
          eyebrow="SCATTER"
          eyebrowColor="text-emerald-300"
          title="Deal size vs days to close"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="size"
                name="Deal size"
                unit="k"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="days"
                name="Days to close"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis
                dataKey="score"
                range={[40, 240]}
                name="AI score"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={
                  (((v: number, n: string) => {
                    if (n === "Deal size") return [`$${v}k`, n];
                    if (n === "Days to close") return [`${v}d`, n];
                    if (n === "AI score") return [`${v}`, n];
                    return [v, n];
                  }) as never)
                }
              />
              <Scatter
                data={SCATTER_DATA}
                fill="#34d399"
                fillOpacity={0.6}
                stroke="#34d399"
                animationDuration={800}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        {/* 4. Stacked Area — Won vs Lost monthly */}
        <Panel
          eyebrow="STACKED AREA"
          eyebrowColor="text-rose-300"
          title="Won vs lost — monthly trend"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={STACKED_AREA_DATA}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <defs>
                <linearGradient id="va-grad-won" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="va-grad-lost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05} />
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
                tickFormatter={(v) => `${v}k`}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number, n: string) => [`$${v}k`, n]) as never)}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: 11,
                  color: "hsl(var(--muted-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="won"
                stackId="1"
                name="Won"
                stroke="#34d399"
                fill="url(#va-grad-won)"
                animationDuration={800}
              />
              <Area
                type="monotone"
                dataKey="lost"
                stackId="1"
                name="Lost"
                stroke="#fb7185"
                fill="url(#va-grad-lost)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </section>
  );
}
