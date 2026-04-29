/* eslint-disable */
// Sprint 14n — kill all white card backgrounds in dashboard/admin scope.
// Marketing surfaces (experience/, marketing/, public/, solutions/, pricing/
// + marketing-only app/[locale] directories) explicitly excluded.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Directories to walk — anything inside is in scope.
const SCOPE_ROOTS = [
  "components",
  "app/[locale]",
];

// Path-fragment exclusions — if any file path contains one of these
// (case-sensitive substring), it's marketing/public and skipped.
const EXCLUSIONS = [
  // Marketing component dirs
  "components/experience/",
  "components/marketing/",
  "components/public/",
  "components/solutions/",
  "components/pricing/",
  // Marketing app routes (these are public-facing)
  "app/[locale]/about/",
  "app/[locale]/contact/",
  "app/[locale]/features/",
  "app/[locale]/integrations/",
  "app/[locale]/blog/",
  "app/[locale]/careers/",
  "app/[locale]/case-studies/",
  "app/[locale]/press/",
  "app/[locale]/playbook/",
  "app/[locale]/api-reference/",
  "app/[locale]/changelog/",
  "app/[locale]/sitemap/",
  "app/[locale]/security/",
  "app/[locale]/terms/",
  "app/[locale]/privacy/",
  "app/[locale]/status/",
  "app/[locale]/ai-platform/",
  "app/[locale]/solutions/",
  "app/[locale]/pricing/",
  "app/[locale]/branding/",
  "app/[locale]/brands/",
  // Auth pages migrated separately in 14i
  "app/[locale]/(auth)/",
  "components/auth/AuthLayout.tsx",
];

function inScope(rel) {
  // normalize Windows separators
  const norm = rel.replace(/\\/g, "/");
  return !EXCLUSIONS.some((ex) => norm.includes(ex));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(fp, files);
    } else if (entry.isFile() && fp.endsWith(".tsx")) {
      files.push(fp);
    }
  }
  return files;
}

const allFiles = SCOPE_ROOTS.flatMap((r) => {
  const abs = path.join(ROOT, r);
  return fs.existsSync(abs) ? walk(abs) : [];
});

const files = allFiles
  .map((fp) => path.relative(ROOT, fp))
  .filter(inScope);

// Order matters: match longer/more-specific patterns first.
// Each rep targets a className substring (always inside a quoted className).
const REPS = [
  // ── Two-word patterns that should stay together ──
  // (none right now — handled per-token below)

  // ── Core white-kill substitutions (with whitespace anchors so we don't
  // ──  catch e.g. "bg-white-text" if it ever existed)
  // Surface backgrounds → bg-card
  ["bg-white ", "bg-card "],
  ['bg-white"', 'bg-card"'],
  ['bg-white\n', 'bg-card\n'],
  ["bg-white/", "bg-card/"],
  ["bg-white)", "bg-card)"],
  ["bg-white\t", "bg-card\t"],

  // Slate/gray near-whites → bg-muted
  ["bg-slate-50 ", "bg-muted "],
  ['bg-slate-50"', 'bg-muted"'],
  ["bg-slate-50/", "bg-muted/"],
  ["bg-slate-100 ", "bg-muted "],
  ['bg-slate-100"', 'bg-muted"'],
  ["bg-slate-100/", "bg-muted/"],
  ["bg-gray-50 ", "bg-muted "],
  ['bg-gray-50"', 'bg-muted"'],
  ["bg-gray-100 ", "bg-muted "],
  ['bg-gray-100"', 'bg-muted"'],
  ["bg-zinc-50 ", "bg-muted "],
  ['bg-zinc-50"', 'bg-muted"'],
  ["bg-zinc-100 ", "bg-muted "],
  ['bg-zinc-100"', 'bg-muted"'],
  ["bg-neutral-50 ", "bg-muted "],
  ['bg-neutral-50"', 'bg-muted"'],
  ["bg-neutral-100 ", "bg-muted "],
  ['bg-neutral-100"', 'bg-muted"'],

  // Hover states
  ["hover:bg-white", "hover:bg-card"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["hover:bg-slate-100", "hover:bg-muted"],
  ["hover:bg-gray-50", "hover:bg-muted"],
  ["hover:bg-gray-100", "hover:bg-muted"],

  // Focus states
  ["focus:bg-white", "focus:bg-card"],
  ["focus:bg-slate-50", "focus:bg-muted"],

  // Text colors (also applied widely on dashboard)
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-gray-900", "text-foreground"],
  ["text-gray-800", "text-foreground"],
  ["text-gray-700", "text-foreground"],
  ["text-gray-600", "text-muted-foreground"],
  ["text-gray-500", "text-muted-foreground"],
  ["text-gray-400", "text-muted-foreground"],

  // Borders
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border"],
  ["border-slate-100", "border-border"],
  ["border-gray-200", "border-border"],
  ["border-gray-300", "border-border"],
  ["border-gray-100", "border-border"],

  // Dividers
  ["divide-slate-100", "divide-border"],
  ["divide-slate-200", "divide-border"],
  ["divide-gray-100", "divide-border"],
  ["divide-gray-200", "divide-border"],

  // Status pill light variants → tinted (universal status semantics)
  ["bg-emerald-50 text-emerald-700", "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"],
  ["bg-emerald-50 text-emerald-600", "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"],
  ["bg-emerald-100 text-emerald-700", "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"],
  ["bg-amber-50 text-amber-700", "bg-amber-500/10 text-amber-300 border border-amber-500/30"],
  ["bg-amber-50 text-amber-600", "bg-amber-500/10 text-amber-300 border border-amber-500/30"],
  ["bg-amber-100 text-amber-700", "bg-amber-500/15 text-amber-300 border border-amber-500/30"],
  ["bg-rose-50 text-rose-700", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],
  ["bg-red-50 text-red-700", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],
  ["bg-red-50 text-red-600", "bg-rose-500/10 text-rose-300 border border-rose-500/30"],
  ["bg-red-100 text-red-700", "bg-rose-500/15 text-rose-300 border border-rose-500/30"],

  // Single-token light status colors (after pair patterns above)
  ["text-emerald-700", "text-emerald-300"],
  ["text-emerald-600", "text-emerald-300"],
  ["text-amber-700", "text-amber-300"],
  ["text-amber-600", "text-amber-300"],
  ["text-red-700", "text-rose-300"],
  ["text-red-600", "text-rose-300"],
  ["text-red-500", "text-rose-400"],
  ["text-rose-700", "text-rose-300"],
  ["text-rose-600", "text-rose-300"],
  ["text-sky-900", "text-foreground"],
  ["text-sky-800", "text-foreground"],
  ["text-sky-700", "text-cyan-300"],
  ["text-sky-600", "text-cyan-300"],
  ["text-sky-500", "text-cyan-300"],
  ["text-sky-400", "text-cyan-300/60"],

  // Bulk light bg-{color}-50 → tinted icon tile (when standalone, not paired)
  ["bg-emerald-50 ", "bg-emerald-500/10 "],
  ['bg-emerald-50"', 'bg-emerald-500/10"'],
  ["bg-amber-50 ", "bg-amber-500/10 "],
  ['bg-amber-50"', 'bg-amber-500/10"'],
  ["bg-rose-50 ", "bg-rose-500/10 "],
  ['bg-rose-50"', 'bg-rose-500/10"'],
  ["bg-red-50 ", "bg-rose-500/10 "],
  ['bg-red-50"', 'bg-rose-500/10"'],
  ["bg-sky-50 ", "bg-muted "],
  ['bg-sky-50"', 'bg-muted"'],
  ["bg-sky-50/", "bg-muted/"],
  ["bg-cyan-50 ", "bg-cyan-500/10 "],
  ['bg-cyan-50"', 'bg-cyan-500/10"'],
  ["bg-violet-50 ", "bg-violet-500/10 "],
  ['bg-violet-50"', 'bg-violet-500/10"'],
  ["bg-indigo-50 ", "bg-indigo-500/10 "],
  ['bg-indigo-50"', 'bg-indigo-500/10"'],
  ["bg-pink-50 ", "bg-pink-500/10 "],
  ['bg-pink-50"', 'bg-pink-500/10"'],
  ["bg-teal-50 ", "bg-teal-500/10 "],
  ['bg-teal-50"', 'bg-teal-500/10"'],
  ["bg-lime-50 ", "bg-lime-500/10 "],
  ['bg-lime-50"', 'bg-lime-500/10"'],

  // Borders for tinted accents
  ["border-emerald-200", "border-emerald-500/30"],
  ["border-emerald-100", "border-emerald-500/30"],
  ["border-amber-200", "border-amber-500/30"],
  ["border-amber-100", "border-amber-500/30"],
  ["border-rose-200", "border-rose-500/30"],
  ["border-red-200", "border-rose-500/30"],
  ["border-sky-100", "border-border"],
  ["border-sky-200", "border-border"],

  // Saturated bright primary buttons → bg-primary
  ["bg-sky-500 hover:bg-sky-600 text-white", "bg-primary hover:bg-primary/90 text-primary-foreground"],
  ["bg-sky-600 hover:bg-sky-700 text-white", "bg-primary hover:bg-primary/90 text-primary-foreground"],
  ["bg-blue-500 hover:bg-blue-600 text-white", "bg-primary hover:bg-primary/90 text-primary-foreground"],

  // Focus rings
  ["focus:ring-sky-400", "focus:ring-primary"],
  ["focus:ring-sky-500", "focus:ring-primary"],
  ["focus:border-sky-400", "focus:border-primary"],
  ["focus:border-sky-500", "focus:border-primary"],
];

let totalChanges = 0;
const out = [];
for (const rel of files) {
  const fp = path.join(ROOT, rel);
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

console.log("=== Sprint 14n — kill white pass ===");
console.log(`Files in scope: ${files.length}`);
console.log(`Files modified: ${out.length}`);
console.log(`Total replacements: ${totalChanges}`);
console.log("\nTop 30 by changes:");
console.table(
  out
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 30)
);
