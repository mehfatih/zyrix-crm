/* eslint-disable */
// Sprint 14m — bulk light-theme→dark-theme className migration.
// Conservative: only replaces tokens that have an unambiguous dark mapping.
// Run on a list of explicit files (not whole-tree) to keep blast radius bounded.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Files to migrate this run (Sprint 14m Option 1 scope)
const TARGETS = [
  "app/[locale]/(dashboard)/loyalty/page.tsx",
  "app/[locale]/(dashboard)/tax-invoices/page.tsx",
  "components/pipeline/AIPipelineBoard.tsx",
];

// Order matters — longer/more-specific patterns first so they win.
// The replacements are exact substring swaps — no regex anchors needed
// since these tokens always appear inside className strings.
const REPS = [
  // Card backgrounds
  ["bg-gradient-to-br from-white to-sky-50/30", "bg-card"],
  ["bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500", "bg-gradient-to-r from-primary via-violet-500 to-cyan-500"],
  ["bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500", "bg-gradient-to-r from-primary via-violet-500 to-primary"],

  // Hover states
  ["hover:bg-sky-50/30", "hover:bg-muted"],
  ["hover:bg-sky-50", "hover:bg-muted"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["hover:bg-slate-100", "hover:bg-muted"],
  ["hover:border-sky-300", "hover:border-cyan-500/40"],
  ["hover:border-sky-200", "hover:border-cyan-500/40"],
  ["hover:bg-red-50", "hover:bg-rose-500/10"],
  ["hover:text-red-700", "hover:text-rose-300"],
  ["hover:text-red-600", "hover:text-rose-300"],
  ["hover:text-sky-700", "hover:text-cyan-300"],
  ["hover:text-sky-600", "hover:text-cyan-300"],
  ["hover:bg-sky-100", "hover:bg-cyan-500/25"],

  // Status pill bg+text pairs
  ["bg-emerald-100 text-emerald-700", "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"],
  ["bg-emerald-50 text-emerald-700", "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"],
  ["bg-emerald-50 text-emerald-600", "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"],
  ["bg-amber-100 text-amber-700", "bg-amber-500/15 text-amber-300 border border-amber-500/30"],
  ["bg-amber-50 text-amber-700", "bg-amber-500/10 text-amber-300 border border-amber-500/30"],
  ["bg-amber-50 text-amber-600", "bg-amber-500/10 text-amber-300 border border-amber-500/30"],
  ["bg-rose-50 text-rose-700", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],
  ["bg-red-50 text-red-700", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],
  ["bg-red-50 text-red-600", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],

  // Backgrounds (single tokens)
  ["bg-white ", "bg-card "],
  ['bg-white"', 'bg-card"'],
  ['bg-white\n', 'bg-card\n'],
  ["bg-slate-50 ", "bg-muted "],
  ['bg-slate-50"', 'bg-muted"'],
  ["bg-slate-100 ", "bg-muted "],
  ['bg-slate-100"', 'bg-muted"'],
  ["bg-sky-50 ", "bg-muted "],
  ['bg-sky-50"', 'bg-muted"'],
  ["bg-red-50 ", "bg-rose-500/10 "],
  ['bg-red-50"', 'bg-rose-500/10"'],
  ["bg-emerald-50 ", "bg-emerald-500/10 "],
  ['bg-emerald-50"', 'bg-emerald-500/10"'],
  ["bg-amber-50 ", "bg-amber-500/10 "],
  ['bg-amber-50"', 'bg-amber-500/10"'],
  ["bg-rose-50 ", "bg-rose-500/10 "],
  ['bg-rose-50"', 'bg-rose-500/10"'],

  // Text colors
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-300", "text-muted-foreground"],
  ["text-sky-900", "text-foreground"],
  ["text-sky-700", "text-cyan-300"],
  ["text-sky-600", "text-cyan-300"],
  ["text-sky-500", "text-cyan-300"],
  ["text-sky-400", "text-cyan-300"],
  ["text-emerald-700", "text-emerald-300"],
  ["text-emerald-600", "text-emerald-300"],
  ["text-amber-700", "text-amber-300"],
  ["text-amber-600", "text-amber-300"],
  ["text-red-700", "text-rose-300"],
  ["text-red-600", "text-rose-300"],
  ["text-red-500", "text-rose-400"],
  ["text-rose-700", "text-rose-300"],
  ["text-rose-600", "text-rose-300"],

  // Borders
  ["border-slate-200", "border-border"],
  ["border-slate-100", "border-border"],
  ["border-sky-100", "border-border"],
  ["border-sky-200", "border-border"],
  ["border-emerald-200", "border-emerald-500/30"],
  ["border-emerald-100", "border-emerald-500/30"],
  ["border-amber-200", "border-amber-500/30"],
  ["border-amber-100", "border-amber-500/30"],
  ["border-red-200", "border-rose-500/30"],
  ["border-rose-200", "border-rose-500/30"],

  // Dividers
  ["divide-sky-50", "divide-border"],
  ["divide-slate-100", "divide-border"],
  ["divide-slate-200", "divide-border"],
];

let totalChanges = 0;
const out = [];
for (const rel of TARGETS) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.warn("Skipping (not found):", rel);
    continue;
  }
  const before = fs.readFileSync(fp, "utf8");
  let after = before;
  let perFile = 0;
  for (const [from, to] of REPS) {
    if (after.includes(from)) {
      const count = after.split(from).length - 1;
      perFile += count;
      after = after.split(from).join(to);
    }
  }
  if (after !== before) {
    fs.writeFileSync(fp, after, "utf8");
    out.push({ file: rel, changes: perFile });
    totalChanges += perFile;
  }
}

console.log("=== Sprint 14m token migration ===");
console.table(out);
console.log("Total replacements:", totalChanges);
