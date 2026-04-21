"use client";

// ============================================================================
// SVG CHART PRIMITIVES
// ----------------------------------------------------------------------------
// Lightweight inline SVG charts. No external dependency — the project's
// package.json doesn't include recharts/chart.js, so everything is
// hand-drawn with straight SVG.
//
// All three (Bar, Line, Pie) take the same { rows, xKey, yKey } shape
// for consistency. Values below zero are clamped to zero on bars/lines.
// Currency/percent formatting happens at the caller's level — these
// primitives just render numbers.
// ============================================================================

import { useMemo } from "react";

const CHART_HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 32, left: 48 };

interface Props {
  rows: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  formatX?: (v: any) => string;
  formatY?: (v: any) => string;
  color?: string;
}

function useChartMetrics(
  rows: Array<Record<string, any>>,
  xKey: string,
  yKey: string
) {
  return useMemo(() => {
    const values = rows.map((r) => Number(r[yKey] ?? 0));
    const max = values.length > 0 ? Math.max(...values, 0) : 0;
    const min = values.length > 0 ? Math.min(...values, 0) : 0;
    return {
      values,
      max: max === 0 ? 1 : max, // avoid divide-by-zero
      min,
      labels: rows.map((r) => String(r[xKey] ?? "")),
    };
  }, [rows, xKey, yKey]);
}

// ──────────────────────────────────────────────────────────────────────
// BAR CHART
// ──────────────────────────────────────────────────────────────────────

export function BarChart({
  rows,
  xKey,
  yKey,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  color = "#0891B2",
}: Props) {
  const { values, max, labels } = useChartMetrics(rows, xKey, yKey);
  if (rows.length === 0) return <EmptyState />;

  const width = 700;
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barWidth = (innerW / rows.length) * 0.7;
  const barGap = (innerW / rows.length) * 0.3;

  return (
    <svg
      viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
      className="w-full h-auto"
      role="img"
    >
      {/* Y-axis gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = PADDING.top + innerH * (1 - frac);
        return (
          <g key={frac}>
            <line
              x1={PADDING.left}
              x2={PADDING.left + innerW}
              y1={y}
              y2={y}
              stroke="#e0f2fe"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {formatY(max * frac)}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {rows.map((r, i) => {
        const v = values[i];
        const h = Math.max((v / max) * innerH, 0);
        const x = PADDING.left + i * (barWidth + barGap) + barGap / 2;
        const y = PADDING.top + innerH - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={3}
              fill={color}
              opacity={0.9}
            >
              <title>
                {labels[i]}: {formatY(v)}
              </title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={CHART_HEIGHT - PADDING.bottom + 16}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {formatX(labels[i])}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────
// LINE CHART
// ──────────────────────────────────────────────────────────────────────

export function LineChart({
  rows,
  xKey,
  yKey,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  color = "#0891B2",
}: Props) {
  const { values, max, labels } = useChartMetrics(rows, xKey, yKey);
  if (rows.length === 0) return <EmptyState />;

  const width = 700;
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const points = rows.map((_, i) => {
    const v = values[i];
    const x =
      rows.length > 1
        ? PADDING.left + (i / (rows.length - 1)) * innerW
        : PADDING.left + innerW / 2;
    const y = PADDING.top + innerH * (1 - Math.max(v, 0) / max);
    return { x, y, v };
  });

  const path = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const area = `${path} L ${points[points.length - 1].x} ${PADDING.top + innerH} L ${points[0].x} ${PADDING.top + innerH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
      className="w-full h-auto"
      role="img"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = PADDING.top + innerH * (1 - frac);
        return (
          <g key={frac}>
            <line
              x1={PADDING.left}
              x2={PADDING.left + innerW}
              y1={y}
              y2={y}
              stroke="#e0f2fe"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {formatY(max * frac)}
            </text>
          </g>
        );
      })}
      <path d={area} fill={color} opacity={0.15} />
      <path d={path} stroke={color} strokeWidth={2} fill="none" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill={color}>
            <title>
              {labels[i]}: {formatY(p.v)}
            </title>
          </circle>
          {i % Math.max(1, Math.floor(rows.length / 8)) === 0 && (
            <text
              x={p.x}
              y={CHART_HEIGHT - PADDING.bottom + 16}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {formatX(labels[i])}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────
// PIE CHART
// ──────────────────────────────────────────────────────────────────────

const PIE_PALETTE = [
  "#0891B2", "#38BDF8", "#6366F1", "#8B5CF6", "#EC4899",
  "#F59E0B", "#10B981", "#EF4444", "#64748B", "#14B8A6",
];

export function PieChart({ rows, xKey, yKey, formatY = (v) => String(v) }: Props) {
  const total = useMemo(
    () => rows.reduce((acc, r) => acc + Number(r[yKey] ?? 0), 0),
    [rows, yKey]
  );
  if (rows.length === 0 || total === 0) return <EmptyState />;

  const cx = 140;
  const cy = 140;
  const radius = 110;
  let cumulativeAngle = -Math.PI / 2; // start at 12 o'clock

  const slices = rows.map((r, i) => {
    const v = Number(r[yKey] ?? 0);
    const angle = (v / total) * Math.PI * 2;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    return {
      label: String(r[xKey] ?? ""),
      value: v,
      color: PIE_PALETTE[i % PIE_PALETTE.length],
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 280 280" className="w-52 h-52 flex-shrink-0" role="img">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity={0.9}>
            <title>
              {s.label}: {formatY(s.value)}
            </title>
          </path>
        ))}
      </svg>
      <div className="flex-1 min-w-40 space-y-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-slate-700 truncate">{s.label}</span>
            <span className="font-mono text-slate-900 tabular-nums">
              {formatY(s.value)}
            </span>
            <span className="text-slate-400 tabular-nums w-10 text-right">
              {((s.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-64 text-xs text-slate-400">
      No data
    </div>
  );
}
