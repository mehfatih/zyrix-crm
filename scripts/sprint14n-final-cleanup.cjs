/* eslint-disable */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const SCOPE_ROOTS = ["components", "app/[locale]"];
const EXCLUSIONS = [
  "components/experience/", "components/marketing/", "components/public/",
  "components/solutions/", "components/pricing/",
  "app/[locale]/about/", "app/[locale]/contact/", "app/[locale]/features/",
  "app/[locale]/integrations/", "app/[locale]/blog/", "app/[locale]/careers/",
  "app/[locale]/case-studies/", "app/[locale]/press/", "app/[locale]/playbook/",
  "app/[locale]/api-reference/", "app/[locale]/changelog/", "app/[locale]/sitemap/",
  "app/[locale]/security/", "app/[locale]/terms/", "app/[locale]/privacy/",
  "app/[locale]/status/", "app/[locale]/ai-platform/", "app/[locale]/solutions/",
  "app/[locale]/pricing/", "app/[locale]/branding/", "app/[locale]/brands/",
  "app/[locale]/(auth)/", "components/auth/AuthLayout.tsx",
];

function inScope(rel) {
  const norm = rel.replace(/\\/g, "/");
  return !EXCLUSIONS.some((ex) => norm.includes(ex));
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(fp, files);
    } else if (e.isFile() && fp.endsWith(".tsx")) files.push(fp);
  }
  return files;
}

const allFiles = SCOPE_ROOTS.flatMap((r) => {
  const abs = path.join(ROOT, r);
  return fs.existsSync(abs) ? walk(abs) : [];
});
const files = allFiles.map((fp) => path.relative(ROOT, fp)).filter(inScope);

const REPS = [
  // Remaining zyrix-primary references → primary
  ["text-zyrix-primary", "text-primary"],
  ["bg-zyrix-primary", "bg-primary"],
  ["border-zyrix-primary", "border-primary"],
  ["focus:ring-zyrix-primary", "focus:ring-primary"],
  ["border-t-zyrix-primary", "border-t-primary"],
  ["text-zyrix-secondary", "text-violet-300"],
  ["bg-zyrix-secondary", "bg-violet-500"],

  // Other zyrix tokens
  ["bg-zyrix-ai-gradient", "bg-gradient-to-r from-primary to-violet-500"],
  ["border-zyrix-aiBorder", "border-violet-500/30"],
  ["bg-zyrix-aiSurface", "bg-violet-500/10"],

  // Custom alt tokens
  ["bg-cardBgAlt", "bg-muted"],
  ["text-foregroundBody", "text-muted-foreground"],
  ["text-foregroundHeading", "text-foreground"],

  // Light bg with /50 etc (caught by previous /-form rules but missed amber-50/50 etc)
  ["bg-amber-50/50", "bg-amber-500/10"],
  ["bg-amber-50/30", "bg-amber-500/10"],
  ["bg-emerald-50/50", "bg-emerald-500/10"],
  ["bg-emerald-50/40", "bg-emerald-500/10"],
  ["bg-emerald-50/30", "bg-emerald-500/10"],
  ["bg-rose-50/50", "bg-rose-500/10"],
  ["bg-rose-50/40", "bg-rose-500/10"],
  ["bg-red-50/50", "bg-rose-500/10"],
  ["bg-red-50/40", "bg-rose-500/10"],
  ["bg-violet-50/50", "bg-violet-500/10"],
  ["bg-cyan-50/50", "bg-cyan-500/10"],
  ["bg-sky-50/50", "bg-muted/50"],
  ["bg-sky-50/40", "bg-muted/40"],
  ["bg-sky-50/30", "bg-muted/40"],
  ["bg-slate-50/50", "bg-muted/50"],
  ["bg-slate-50/40", "bg-muted/40"],
  ["bg-slate-50/30", "bg-muted/40"],

  // Remove duplicate border classes that resulted from earlier replacements
  ["border border-emerald-500/30 border-emerald-500/30", "border border-emerald-500/30"],
  ["border border-amber-500/30 border-amber-500/30", "border border-amber-500/30"],
  ["border border-rose-500/30 border-rose-500/30", "border border-rose-500/30"],
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

console.log("=== Sprint 14n FINAL cleanup ===");
console.log(`Files scoped: ${files.length} | modified: ${out.length} | total: ${total}`);
if (out.length) {
  console.table(out.sort((a, b) => b.changes - a.changes).slice(0, 15));
}
