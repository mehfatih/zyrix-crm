/* eslint-disable */
// Sprint 14n cleanup pass — kill the remaining undefined tokens that
// the kill-white pass didn't catch (legacy custom tokens like text-ink-*,
// bg-primary-{600,700,800}, ring-*-200).
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const SCOPE_ROOTS = ["components", "app/[locale]"];
const EXCLUSIONS = [
  "components/experience/",
  "components/marketing/",
  "components/public/",
  "components/solutions/",
  "components/pricing/",
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
  "app/[locale]/(auth)/",
  "components/auth/AuthLayout.tsx",
];

function inScope(rel) {
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
const files = allFiles.map((fp) => path.relative(ROOT, fp)).filter(inScope);

const REPS = [
  // Undefined custom text tokens
  ["text-ink-light", "text-muted-foreground"],
  ["text-ink-muted", "text-muted-foreground"],
  ["text-ink", "text-foreground"],
  ["text-zyrix-textHeading", "text-foreground"],
  ["text-zyrix-textMuted", "text-muted-foreground"],
  ["text-zyrix-text", "text-foreground"],

  // Undefined custom bg tokens
  ["bg-zyrix-aiSurface/50", "bg-violet-500/5"],
  ["bg-zyrix-aiSurface", "bg-violet-500/10"],
  ["bg-zyrix-bgSubtle", "bg-muted"],
  ["bg-zyrix-bg", "bg-background"],
  ["bg-zyrix-card", "bg-card"],
  ["bg-bg-base", "bg-background"],
  ["bg-bg-subtle", "bg-muted"],

  // Undefined border tokens
  ["border-zyrix-border", "border-border"],
  ["border-zyrix-aiBorder", "border-violet-500/30"],
  ["border-line", "border-border"],

  // Tinted ring colors (legacy light theme)
  ["ring-red-200", "ring-rose-500/30"],
  ["ring-amber-200", "ring-amber-500/30"],
  ["ring-sky-200", "ring-cyan-500/30"],
  ["ring-slate-200", "ring-border"],
  ["ring-emerald-200", "ring-emerald-500/30"],
  ["ring-rose-200", "ring-rose-500/30"],
  ["ring-violet-200", "ring-violet-500/30"],

  // Undefined primary-{number} → primary
  ["bg-primary-50", "bg-primary/15"],
  ["text-primary-600", "text-primary"],
  ["text-primary-700", "text-primary"],
  ["text-primary-800", "text-primary"],
  ["bg-primary-600 hover:bg-primary-700", "bg-primary hover:bg-primary/90"],
  ["bg-primary-600", "bg-primary"],
  ["bg-primary-700", "bg-primary"],
  ["bg-primary-800", "bg-primary"],
  ["hover:bg-primary-700", "hover:bg-primary/90"],
  ["hover:bg-primary-800", "hover:bg-primary/80"],
  ["active:bg-primary-700", "active:bg-primary/90"],
  ["active:bg-primary-800", "active:bg-primary/80"],

  // Undefined danger tokens
  ["text-danger-dark", "text-rose-300"],
  ["bg-danger-light", "bg-rose-500/10"],
  ["text-danger", "text-rose-300"],
  ["bg-danger", "bg-rose-500"],
  ["border-danger", "border-rose-500/30"],

  // Undefined navy tokens (DashboardShell legacy — already migrated, but just in case)
  ["bg-navy-700", "bg-muted"],
  ["bg-navy-800", "bg-card"],
  ["text-navy-ink", "text-foreground"],
  ["text-navy-muted", "text-muted-foreground"],
  ["text-neon-300", "text-cyan-300"],
  ["bg-neon-500/15", "bg-cyan-500/15"],
  ["bg-gradient-ai-primary", "bg-gradient-to-br from-primary to-violet-500"],
  ["shadow-zyrix-card", "shadow-md"],
  ["shadow-zyrix-ai-glow-dark", "shadow-lg"],
];

let total = 0;
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
    total += perFile;
  }
}

console.log("=== Sprint 14n cleanup pass ===");
console.log(`Files in scope: ${files.length}`);
console.log(`Files modified: ${out.length}`);
console.log(`Total replacements: ${total}`);
if (out.length) {
  console.log("\nTop 20 by changes:");
  console.table(out.sort((a, b) => b.changes - a.changes).slice(0, 20));
}
