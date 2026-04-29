import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14r — shared status pill for Risk / Stage / Segment / etc.
// 6 tones, all tinted on dark with -200 text and -500/40 borders.
// Helper maps below resolve common label → tone for the dashboard's
// most-used taxonomies.
// ────────────────────────────────────────────────────────────────────

export type StatusTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral"
  | "premium";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  info: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  warning: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  danger: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  neutral: "bg-slate-500/20 text-slate-200 border-slate-500/40",
  premium: "bg-violet-500/20 text-violet-200 border-violet-500/40",
};

interface StatusPillProps {
  tone: StatusTone;
  children: ReactNode;
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}

export function StatusPill({
  tone,
  children,
  size = "md",
  icon,
  className,
}: StatusPillProps) {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap",
        TONE_CLASSES[tone],
        sizeClasses,
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────
// Helper maps for the common taxonomies used across the dashboard.
// Input is the canonical lowercase value; uppercase label variants
// are also honored so callers don't have to normalize.
// ────────────────────────────────────────────────────────────────────

export const RISK_TONE: Record<string, StatusTone> = {
  low: "success",
  Low: "success",
  med: "warning",
  medium: "warning",
  Med: "warning",
  Medium: "warning",
  high: "danger",
  High: "danger",
  critical: "danger",
  Critical: "danger",
};

export const SEGMENT_TONE: Record<string, StatusTone> = {
  champion: "premium",
  Champion: "premium",
  growth: "info",
  Growth: "info",
  "at-risk": "danger",
  AtRisk: "danger",
  "At-Risk": "danger",
  new: "success",
  New: "success",
  dormant: "neutral",
  Dormant: "neutral",
};

export const STAGE_TONE: Record<string, StatusTone> = {
  lead: "neutral",
  Lead: "neutral",
  qualified: "info",
  Qualified: "info",
  discovery: "info",
  Discovery: "info",
  proposal: "warning",
  Proposal: "warning",
  negotiation: "warning",
  Negotiation: "warning",
  closing: "premium",
  Closing: "premium",
  won: "success",
  Won: "success",
  lost: "danger",
  Lost: "danger",
};
