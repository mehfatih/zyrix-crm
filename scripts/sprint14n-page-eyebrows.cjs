/* eslint-disable */
// Sprint 14n — inject per-page accent eyebrows above h1 in each
// dashboard route. Maps file path → route slug → accent color.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Static lookup matching components/layout/page-accents.ts
const PAGE_ACCENTS = {
  dashboard: { color: "cyan", eyebrow: "EXECUTIVE SUMMARY" },
  customers: { color: "violet", eyebrow: "CUSTOMERS" },
  deals: { color: "emerald", eyebrow: "DEALS" },
  pipeline: { color: "cyan", eyebrow: "PIPELINE" },
  quotes: { color: "sky", eyebrow: "PROPOSALS" },
  contracts: { color: "indigo", eyebrow: "AGREEMENTS" },
  loyalty: { color: "rose", eyebrow: "LOYALTY PROGRAM" },
  tax: { color: "amber", eyebrow: "TAX ENGINE" },
  "tax-invoices": { color: "teal", eyebrow: "COMPLIANCE" },
  commission: { color: "lime", eyebrow: "COMMISSIONS" },
  cashflow: { color: "emerald", eyebrow: "CASH FLOW" },
  reports: { color: "sky", eyebrow: "REPORTS" },
  "session-kpis": { color: "sky", eyebrow: "SESSION KPIS" },
  analytics: { color: "violet", eyebrow: "ANALYTICS" },
  followup: { color: "amber", eyebrow: "FOLLOW-UPS" },
  campaigns: { color: "pink", eyebrow: "MARKETING" },
  "ai-cfo": { color: "violet", eyebrow: "AI CFO" },
  tasks: { color: "cyan", eyebrow: "TASKS" },
  templates: { color: "indigo", eyebrow: "TEMPLATES" },
  workflows: { color: "violet", eyebrow: "AUTOMATIONS" },
  ai: { color: "violet", eyebrow: "AI AGENTS" },
  "ai-agents": { color: "violet", eyebrow: "AI AGENTS" },
  chat: { color: "sky", eyebrow: "TEAM CHAT" },
  whatsapp: { color: "emerald", eyebrow: "WHATSAPP CRM" },
  notifications: { color: "cyan", eyebrow: "NOTIFICATIONS" },
  messaging: { color: "sky", eyebrow: "MESSAGES" },
  "feature-disabled": { color: "slate", eyebrow: "ACCESS" },
  settings: { color: "slate", eyebrow: "SETTINGS" },
};

// Map an absolute or relative file path under app/[locale]/(dashboard)/
// to its accent slug. The first segment after "(dashboard)" identifies
// the route family.
function pathToSlug(rel) {
  // Normalize separators
  const norm = rel.replace(/\\/g, "/");
  const m = norm.match(/app\/\[locale\]\/\(dashboard\)\/([^/]+)/);
  if (!m) return null;
  return m[1];
}

// Walk the dashboard route group
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, files);
    else if (entry.isFile() && entry.name === "page.tsx") files.push(fp);
  }
  return files;
}

const dashboardRoot = path.join(ROOT, "app", "[locale]", "(dashboard)");
const files = walk(dashboardRoot).map((fp) => path.relative(ROOT, fp));

const out = [];
for (const rel of files) {
  const fp = path.join(ROOT, rel);
  const slug = pathToSlug(rel);
  if (!slug || !(slug in PAGE_ACCENTS)) {
    out.push({ file: rel, slug, status: "skipped (no accent for slug)" });
    continue;
  }
  const { color, eyebrow } = PAGE_ACCENTS[slug];
  let src = fs.readFileSync(fp, "utf8");

  // 1) Fix any residual undefined heading tokens on the SAME page.
  src = src.split("text-zyrix-textHeading").join("text-foreground");
  src = src.split("text-zyrix-textMuted").join("text-muted-foreground");
  // Replace text-ink (undefined token) but only when followed by class
  // boundary characters — must not eat compound names like text-ink-light
  src = src.replace(/text-ink(?=["\s])/g, "text-foreground");

  // 2) Inject the eyebrow above the FIRST <h1 occurrence — only if no
  // eyebrow already exists right before it. Detect existing eyebrow by
  // looking for `text-{color}-300 text-xs font-bold uppercase tracking`
  // in the 3 lines before the h1.
  const lines = src.split("\n");
  const h1Index = lines.findIndex((line) => /<h1[\s>]/.test(line));
  if (h1Index < 0) {
    out.push({ file: rel, slug, status: "no h1 found" });
    fs.writeFileSync(fp, src, "utf8");
    continue;
  }

  // Look back up to 3 lines for an existing eyebrow
  const lookback = lines.slice(Math.max(0, h1Index - 3), h1Index).join("\n");
  if (
    /uppercase\s+tracking-widest/.test(lookback) ||
    /uppercase\s+tracking-wider/.test(lookback)
  ) {
    out.push({ file: rel, slug, status: "already has eyebrow" });
    fs.writeFileSync(fp, src, "utf8");
    continue;
  }

  // Determine indentation from the h1 line
  const h1Line = lines[h1Index];
  const indent = h1Line.match(/^\s*/)?.[0] ?? "            ";
  const eyebrowLine = `${indent}<p className="text-${color}-300 text-xs font-bold uppercase tracking-widest mb-2">${eyebrow}</p>`;

  lines.splice(h1Index, 0, eyebrowLine);
  src = lines.join("\n");
  fs.writeFileSync(fp, src, "utf8");
  out.push({ file: rel, slug, status: "eyebrow injected", color });
}

const injected = out.filter((r) => r.status === "eyebrow injected");
const already = out.filter((r) => r.status === "already has eyebrow");
const noh1 = out.filter((r) => r.status === "no h1 found");
const skipped = out.filter((r) => r.status?.startsWith("skipped"));

console.log("=== Sprint 14n — eyebrow injection pass ===");
console.log(`Total page.tsx files scanned: ${files.length}`);
console.log(`Eyebrows injected:            ${injected.length}`);
console.log(`Already had eyebrow:          ${already.length}`);
console.log(`No <h1> found (skipped):      ${noh1.length}`);
console.log(`No accent mapping (skipped):  ${skipped.length}`);

if (injected.length) {
  console.log("\nInjected:");
  console.table(injected.map((r) => ({ file: r.file, slug: r.slug, color: r.color })));
}
if (skipped.length) {
  console.log("\nSkipped (no accent in PAGE_ACCENTS):");
  for (const r of skipped) console.log(`  ${r.file}  (slug: ${r.slug})`);
}
if (noh1.length) {
  console.log("\nNo h1 found:");
  for (const r of noh1) console.log(`  ${r.file}`);
}
