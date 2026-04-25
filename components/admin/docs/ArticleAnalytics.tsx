"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Search,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";

// ============================================================================
// Admin → Docs → Overview analytics panel (Task 8)
// ============================================================================

interface OverviewData {
  days: number;
  topArticles: Array<{
    locale: string;
    category: string;
    slug: string;
    views: number;
  }>;
  topSearches: Array<{ locale: string; query: string; count: number }>;
  unhelpful: Array<{
    locale: string;
    category: string;
    slug: string;
    count: number;
  }>;
}

export default function ArticleAnalytics() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await adminApi.get<{
          success: boolean;
          data: OverviewData;
        }>(`/api/admin/docs/overview?days=${days}`);
        if (!cancelled && r.data?.success) setData(r.data.data);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-500" />
          Docs analytics
        </h2>
        <div className="flex gap-2 text-xs">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-2.5 py-1 rounded-md border ${
                days === d
                  ? "bg-sky-50 border-sky-300 text-sky-600 font-semibold"
                  : "bg-white border-sky-100 text-slate-500"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="lg:col-span-3 flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin me-2" />
          Loading…
        </div>
      ) : (
        <>
          <Panel
            title="Top articles"
            icon={TrendingUp}
            empty="No views recorded yet"
            rows={data.topArticles.map((a) => ({
              primary: `${a.category} / ${a.slug}`,
              secondary: a.locale.toUpperCase(),
              value: `${a.views}`,
            }))}
          />
          <Panel
            title="Top searches"
            icon={Search}
            empty="No searches recorded yet"
            rows={data.topSearches.map((s) => ({
              primary: s.query || "(empty)",
              secondary: s.locale.toUpperCase(),
              value: `${s.count}`,
            }))}
          />
          <Panel
            title="Flagged unhelpful"
            icon={AlertTriangle}
            empty="Nothing flagged — nice"
            rows={data.unhelpful.map((u) => ({
              primary: `${u.category} / ${u.slug}`,
              secondary: u.locale.toUpperCase(),
              value: `${u.count}`,
            }))}
          />
        </>
      )}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  rows,
  empty,
}: {
  title: string;
  icon: typeof TrendingUp;
  rows: { primary: string; secondary: string; value: string }[];
  empty: string;
}) {
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-sky-500" />
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-400 py-4">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li
              key={`${i}-${r.primary}`}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {r.primary}
                </div>
                <div className="text-[11px] text-slate-400">{r.secondary}</div>
              </div>
              <span className="text-sm font-bold text-sky-600 tabular-nums">
                {r.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
