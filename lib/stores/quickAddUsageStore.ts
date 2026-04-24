"use client";

const STORAGE_KEY = "zyrix_merchant_quick_add_usage_v1";
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export interface QuickAddUsageEntry {
  total: number;
  lastWeekTimestamps: number[];
  lastUsedAt: number;
}

export type QuickAddUsageMap = Record<string, QuickAddUsageEntry>;

function safeParse(raw: string | null): QuickAddUsageMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as QuickAddUsageMap;
  } catch {
    return {};
  }
}

function readStore(): QuickAddUsageMap {
  if (typeof window === "undefined") return {};
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return {};
  }
}

function writeStore(map: QuickAddUsageMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function recordQuickAddUsage(entityId: string) {
  const now = Date.now();
  const map = readStore();
  const current = map[entityId] ?? {
    total: 0,
    lastWeekTimestamps: [],
    lastUsedAt: 0,
  };
  const recent = current.lastWeekTimestamps.filter(
    (t) => now - t < RECENT_WINDOW_MS,
  );
  recent.push(now);
  map[entityId] = {
    total: current.total + 1,
    lastWeekTimestamps: recent.slice(-20),
    lastUsedAt: now,
  };
  writeStore(map);
}

export function getQuickAddScores(): Record<string, number> {
  const now = Date.now();
  const map = readStore();
  const scores: Record<string, number> = {};
  for (const [id, entry] of Object.entries(map)) {
    const recent = entry.lastWeekTimestamps.filter(
      (t) => now - t < RECENT_WINDOW_MS,
    ).length;
    scores[id] = entry.total + recent * 3;
  }
  return scores;
}

export function sortEntitiesByUsage<T extends { id: string }>(items: T[]): T[] {
  const scores = getQuickAddScores();
  const hasAny = Object.keys(scores).length > 0;
  if (!hasAny) return items;
  return [...items].sort((a, b) => {
    const sa = scores[a.id] ?? 0;
    const sb = scores[b.id] ?? 0;
    return sb - sa;
  });
}
