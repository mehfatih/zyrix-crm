// ────────────────────────────────────────────────────────────────────
// Sprint 14w — Analytics color lookup tables
// Static class strings so Tailwind JIT picks them up. Never use
// template-literal Tailwind classes anywhere in /analytics components.
// ────────────────────────────────────────────────────────────────────

import type { AnalyticsColor } from "@/lib/analytics/tab-catalog";

export const TAB_ACTIVE_PILL: Record<AnalyticsColor, string> = {
  emerald: "bg-emerald-500/20 border-emerald-500/50 text-emerald-200",
  cyan: "bg-cyan-500/20 border-cyan-500/50 text-cyan-200",
  violet: "bg-violet-500/20 border-violet-500/50 text-violet-200",
  amber: "bg-amber-500/20 border-amber-500/50 text-amber-200",
  rose: "bg-rose-500/20 border-rose-500/50 text-rose-200",
  lime: "bg-lime-500/20 border-lime-500/50 text-lime-200",
  sky: "bg-sky-500/20 border-sky-500/50 text-sky-200",
  indigo: "bg-indigo-500/20 border-indigo-500/50 text-indigo-200",
  pink: "bg-pink-500/20 border-pink-500/50 text-pink-200",
  yellow: "bg-yellow-500/20 border-yellow-500/50 text-yellow-200",
  teal: "bg-teal-500/20 border-teal-500/50 text-teal-200",
  fuchsia: "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-200",
  orange: "bg-orange-500/20 border-orange-500/50 text-orange-200",
};

export const TAB_DOT: Record<AnalyticsColor, string> = {
  emerald: "bg-emerald-400",
  cyan: "bg-cyan-400",
  violet: "bg-violet-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
  lime: "bg-lime-400",
  sky: "bg-sky-400",
  indigo: "bg-indigo-400",
  pink: "bg-pink-400",
  yellow: "bg-yellow-400",
  teal: "bg-teal-400",
  fuchsia: "bg-fuchsia-400",
  orange: "bg-orange-400",
};

export const TAB_EYEBROW: Record<AnalyticsColor, string> = {
  emerald: "text-emerald-300",
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
  lime: "text-lime-300",
  sky: "text-sky-300",
  indigo: "text-indigo-300",
  pink: "text-pink-300",
  yellow: "text-yellow-300",
  teal: "text-teal-300",
  fuchsia: "text-fuchsia-300",
  orange: "text-orange-300",
};

export interface WidgetTileClasses {
  card: string;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  value: string;
}

export const WIDGET_TILE: Record<AnalyticsColor, WidgetTileClasses> = {
  emerald: {
    card: "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-card border-emerald-500/30",
    iconBg: "bg-emerald-500/15",
    iconBorder: "border-emerald-500/40",
    iconText: "text-emerald-200",
    value: "text-emerald-100",
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-card border-cyan-500/30",
    iconBg: "bg-cyan-500/15",
    iconBorder: "border-cyan-500/40",
    iconText: "text-cyan-200",
    value: "text-cyan-100",
  },
  violet: {
    card: "bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-card border-violet-500/30",
    iconBg: "bg-violet-500/15",
    iconBorder: "border-violet-500/40",
    iconText: "text-violet-200",
    value: "text-violet-100",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card border-amber-500/30",
    iconBg: "bg-amber-500/15",
    iconBorder: "border-amber-500/40",
    iconText: "text-amber-200",
    value: "text-amber-100",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-card border-rose-500/30",
    iconBg: "bg-rose-500/15",
    iconBorder: "border-rose-500/40",
    iconText: "text-rose-200",
    value: "text-rose-100",
  },
  lime: {
    card: "bg-gradient-to-br from-lime-500/10 via-lime-500/5 to-card border-lime-500/30",
    iconBg: "bg-lime-500/15",
    iconBorder: "border-lime-500/40",
    iconText: "text-lime-200",
    value: "text-lime-100",
  },
  sky: {
    card: "bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-card border-sky-500/30",
    iconBg: "bg-sky-500/15",
    iconBorder: "border-sky-500/40",
    iconText: "text-sky-200",
    value: "text-sky-100",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-card border-indigo-500/30",
    iconBg: "bg-indigo-500/15",
    iconBorder: "border-indigo-500/40",
    iconText: "text-indigo-200",
    value: "text-indigo-100",
  },
  pink: {
    card: "bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-card border-pink-500/30",
    iconBg: "bg-pink-500/15",
    iconBorder: "border-pink-500/40",
    iconText: "text-pink-200",
    value: "text-pink-100",
  },
  yellow: {
    card: "bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-card border-yellow-500/30",
    iconBg: "bg-yellow-500/15",
    iconBorder: "border-yellow-500/40",
    iconText: "text-yellow-200",
    value: "text-yellow-100",
  },
  teal: {
    card: "bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-card border-teal-500/30",
    iconBg: "bg-teal-500/15",
    iconBorder: "border-teal-500/40",
    iconText: "text-teal-200",
    value: "text-teal-100",
  },
  fuchsia: {
    card: "bg-gradient-to-br from-fuchsia-500/10 via-fuchsia-500/5 to-card border-fuchsia-500/30",
    iconBg: "bg-fuchsia-500/15",
    iconBorder: "border-fuchsia-500/40",
    iconText: "text-fuchsia-200",
    value: "text-fuchsia-100",
  },
  orange: {
    card: "bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-card border-orange-500/30",
    iconBg: "bg-orange-500/15",
    iconBorder: "border-orange-500/40",
    iconText: "text-orange-200",
    value: "text-orange-100",
  },
};

// Hex codes for Recharts (Recharts strokes/fills must be raw color, not classnames).
export const HEX: Record<AnalyticsColor, string> = {
  emerald: "#34d399",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  amber: "#fbbf24",
  rose: "#fb7185",
  lime: "#a3e635",
  sky: "#38bdf8",
  indigo: "#818cf8",
  pink: "#f472b6",
  yellow: "#facc15",
  teal: "#2dd4bf",
  fuchsia: "#e879f9",
  orange: "#fb923c",
};

// Lookup helper for icon strings → lucide components.
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Banknote,
  Box,
  Briefcase,
  Calendar,
  CheckCheck,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  FileCheck2,
  FileText,
  FileX2,
  Gift,
  Heart,
  Mail,
  Megaphone,
  MousePointerClick,
  Phone,
  Receipt,
  Repeat,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
  UserX,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Banknote,
  Box,
  Briefcase,
  Calendar,
  CheckCheck,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  FileCheck2,
  FileText,
  FileX2,
  Gift,
  Heart,
  Mail,
  Megaphone,
  MousePointerClick,
  Phone,
  Receipt,
  Repeat,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
  UserX,
  XCircle,
};

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Activity;
}
