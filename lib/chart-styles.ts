// ────────────────────────────────────────────────────────────────────
// Sprint 14r — Shared Recharts tooltip styling.
// Use these three constants on every <Tooltip> in the app:
//   contentStyle = CHART_TOOLTIP_STYLE       (the popup container)
//   labelStyle   = CHART_TOOLTIP_LABEL_STYLE (the title row, e.g. day/month)
//   itemStyle    = CHART_TOOLTIP_ITEM_STYLE  (each data row's text — CRITICAL)
//
// Without `itemStyle`, Recharts paints value text using each series'
// stroke/fill color. Those colors are tuned for the chart canvas, not
// for tooltip text on a dark card background, hence the dark-on-dark
// "unreadable" tooltip the user reported.
// ────────────────────────────────────────────────────────────────────

import type { CSSProperties } from "react";

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.4)",
};

export const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "hsl(var(--muted-foreground))",
  fontSize: "11px",
  marginBottom: "2px",
  fontWeight: 500,
};

export const CHART_TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "hsl(var(--foreground))",
  fontSize: "12px",
  fontWeight: 600,
};
