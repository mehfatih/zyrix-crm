// ────────────────────────────────────────────────────────────────────
// Sprint 14x — Followup mock 30-day trend
// Deterministic seeded PRNG (mulberry32) so reloads are stable.
// Backend wiring is a future sprint — this file is the only data
// source for the FollowupTrendChart in this sprint.
// ────────────────────────────────────────────────────────────────────

export interface TrendPoint {
  date: string;
  totalStale: number;
  critical: number;
  warning: number;
  valueAtRisk: number;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function generate30DayTrend(seed: number = 1): TrendPoint[] {
  const rng = mulberry32(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const points: TrendPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const totalStale = Math.floor(rng() * 9); // 0–8
    const critical = Math.min(totalStale, Math.floor(rng() * 4)); // 0–3
    const warning = Math.min(
      Math.max(totalStale - critical, 0),
      Math.floor(rng() * 7),
    );
    const valueAtRisk = Math.floor(rng() * 25_001); // 0–25,000
    points.push({
      date: toIsoDate(d),
      totalStale,
      critical,
      warning,
      valueAtRisk,
    });
  }
  return points;
}
