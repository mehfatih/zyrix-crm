// scripts/merge-sprint13-messages.cjs
const fs = require("fs");
const path = require("path");

const ROOT = "D:\\Zyrix Hub\\zyrix-crm";
const SRC = "D:\\Zyrix Hub\\Sprints\\layers\\sprint13\\sprint13-complete\\messages";
const LOCALES = ["en", "ar", "tr"];

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8");
}

function getKeys(obj, prefix = "") {
  const keys = new Set();
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const full = prefix ? `${prefix}.${k}` : k;
      keys.add(full);
      for (const sub of getKeys(v, full)) keys.add(sub);
    }
  }
  return keys;
}

console.log("=== Sprint 13 — Merging JSON sub-keys ===\n");

const merged = {};
const NEW_SUBKEYS = ["growthLoops", "stickyCta", "footer"];

for (const loc of LOCALES) {
  const targetPath = path.join(ROOT, "messages", `${loc}.json`);
  const sourcePath = path.join(SRC, `Landing.sprint13.${loc}.json`);

  const target = readJSON(targetPath);
  const source = readJSON(sourcePath);

  if (!target.Landing) target.Landing = {};
  if (!source.Landing) {
    console.error(`  ❌ Source ${loc} missing Landing namespace`);
    process.exit(1);
  }

  // Check for conflicts (existing keys with same name)
  const conflicts = [];
  for (const key of NEW_SUBKEYS) {
    if (target.Landing[key] !== undefined) {
      conflicts.push(key);
    }
  }
  if (conflicts.length > 0) {
    console.warn(`  ⚠️  ${loc}: Overwriting existing keys: ${conflicts.join(", ")}`);
  }

  // Merge — ONLY the 3 new sub-keys, preserve everything else
  for (const key of NEW_SUBKEYS) {
    if (source.Landing[key] !== undefined) {
      target.Landing[key] = source.Landing[key];
    }
  }

  writeJSON(targetPath, target);
  merged[loc] = target;

  const subkeyCount = Object.keys(target.Landing).length;
  console.log(`  ✅ ${loc}.json — Landing has ${subkeyCount} sub-keys`);
}

// Parity check across locales for the new sub-keys only
console.log("\n=== Parity check (new sub-keys only) ===");
const en = merged.en.Landing;
const ar = merged.ar.Landing;
const tr = merged.tr.Landing;

for (const key of NEW_SUBKEYS) {
  const enKeys = getKeys(en[key]);
  const arKeys = getKeys(ar[key]);
  const trKeys = getKeys(tr[key]);

  const enArDiff = [...new Set([...enKeys].filter((k) => !arKeys.has(k)))]
    .concat([...new Set([...arKeys].filter((k) => !enKeys.has(k)))]);
  const enTrDiff = [...new Set([...enKeys].filter((k) => !trKeys.has(k)))]
    .concat([...new Set([...trKeys].filter((k) => !enKeys.has(k)))]);

  if (enArDiff.length === 0 && enTrDiff.length === 0) {
    console.log(`  ✅ ${key}: ${enKeys.size} keys × 3 locales — identical`);
  } else {
    console.log(`  ❌ ${key} parity FAIL:`);
    if (enArDiff.length) console.log(`     EN-AR diff:`, enArDiff);
    if (enTrDiff.length) console.log(`     EN-TR diff:`, enTrDiff);
    process.exit(1);
  }
}

console.log("\n✅ All 3 locales merged & parity verified.");
