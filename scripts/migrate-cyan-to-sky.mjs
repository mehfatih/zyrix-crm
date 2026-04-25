// One-shot color migration: Cyan → Sky Blue (Apr 2026 standard)
// Scans app/**, components/**, lib/**, app/globals.css and rewrites
// hex values + tailwind class shades. Skips tailwind.config.ts so the
// cyan palette stays available for any remaining legacy references.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = ['app', 'components', 'lib'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel']);
const SKIP_FILES = new Set([
  path.join(ROOT, 'tailwind.config.ts'),
  path.join(ROOT, 'lib', 'theme', 'zyrixTheme.ts'),
  path.join(ROOT, 'scripts', 'migrate-cyan-to-sky.mjs'),
]);

const HEX_MAP = [
  [/#0891B2/gi, '#0EA5E9'],
  [/#0E7490/gi, '#0284C7'],
  [/#67E8F9/gi, '#7DD3FC'],
  [/#06B6D4/gi, '#22D3EE'],
  [/#164E63/gi, '#0C4A6E'],
];

// Order matters: shift specific shades first, then catch-all prefix swap.
const CLASS_MAP = [
  // Shade-shifted mappings (cyan brand scale was offset by one from sky scale)
  [/\bcyan-600\b/g, 'sky-500'],
  [/\bcyan-700\b/g, 'sky-600'],
  [/\bcyan-500\b/g, 'sky-400'],
  [/\bcyan-400\b/g, 'sky-300'],
  // Remaining shades keep their numeric value but switch family
  [/\bcyan-(50|100|200|300|800|900|950)\b/g, 'sky-$1'],
];

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, files);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(full)) continue;
      const ext = path.extname(entry.name);
      if (!EXTS.has(ext)) continue;
      files.push(full);
    }
  }
}

const files = [];
for (const t of TARGETS) {
  const dir = path.join(ROOT, t);
  if (fs.existsSync(dir)) walk(dir, files);
}
// Also include app/globals.css explicitly (already covered above) — no-op.

let totalFiles = 0;
let totalReplacements = 0;
const perFile = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let next = original;
  let count = 0;
  for (const [re, rep] of HEX_MAP) {
    const before = next;
    next = next.replace(re, rep);
    count += (before.match(re) ?? []).length;
  }
  for (const [re, rep] of CLASS_MAP) {
    const before = next;
    next = next.replace(re, rep);
    count += (before.match(re) ?? []).length;
  }
  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    totalFiles++;
    totalReplacements += count;
    perFile.push({ file: path.relative(ROOT, file), count });
  }
}

perFile.sort((a, b) => b.count - a.count);
for (const { file, count } of perFile.slice(0, 30)) {
  console.log(`  ${count.toString().padStart(4)}  ${file}`);
}
if (perFile.length > 30) console.log(`  ...and ${perFile.length - 30} more files`);
console.log(`\nDone. ${totalReplacements} replacements across ${totalFiles} files.`);
