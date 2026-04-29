// ──────────────────────────────────────────────────────────────────
// Per-page accent identity — Sprint 14n
// Static lookup tables. Tailwind JIT requires literal class strings;
// no dynamic `bg-${color}-500/10` constructions allowed downstream.
// ──────────────────────────────────────────────────────────────────

export type AccentKey =
  | "cyan"
  | "violet"
  | "emerald"
  | "sky"
  | "indigo"
  | "rose"
  | "amber"
  | "teal"
  | "lime"
  | "pink"
  | "slate";

export const ACCENT_CLASSES: Record<
  AccentKey,
  { bg: string; text: string; border: string; icon: string }
> = {
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-300",    border: "border-cyan-500",    icon: "text-cyan-300" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-300",  border: "border-violet-500",  icon: "text-violet-300" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500", icon: "text-emerald-300" },
  sky:     { bg: "bg-sky-500/10",     text: "text-sky-300",     border: "border-sky-500",     icon: "text-sky-300" },
  indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-300",  border: "border-indigo-500",  icon: "text-indigo-300" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-300",    border: "border-rose-500",    icon: "text-rose-300" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-300",   border: "border-amber-500",   icon: "text-amber-300" },
  teal:    { bg: "bg-teal-500/10",    text: "text-teal-300",    border: "border-teal-500",    icon: "text-teal-300" },
  lime:    { bg: "bg-lime-500/10",    text: "text-lime-300",    border: "border-lime-500",    icon: "text-lime-300" },
  pink:    { bg: "bg-pink-500/10",    text: "text-pink-300",    border: "border-pink-500",    icon: "text-pink-300" },
  slate:   { bg: "bg-slate-500/10",   text: "text-slate-300",   border: "border-slate-500",   icon: "text-slate-300" },
};

export const PAGE_ACCENTS: Record<string, AccentKey> = {
  dashboard: "cyan",
  customers: "violet",
  deals: "emerald",
  pipeline: "cyan",
  quotes: "sky",
  contracts: "indigo",
  loyalty: "rose",
  tax: "amber",
  "tax-invoices": "teal",
  commission: "lime",
  cashflow: "emerald",
  reports: "sky",
  "session-kpis": "sky",
  analytics: "violet",
  followup: "amber",
  campaigns: "pink",
  "ai-cfo": "violet",
  tasks: "cyan",
  templates: "indigo",
  workflows: "violet",
  ai: "violet",
  "ai-agents": "violet",
  chat: "sky",
  whatsapp: "emerald",
  settings: "slate",
};

export function getPageAccent(slug: string): AccentKey {
  return PAGE_ACCENTS[slug] ?? "slate";
}

export function getAccentClasses(slug: string) {
  return ACCENT_CLASSES[getPageAccent(slug)];
}
