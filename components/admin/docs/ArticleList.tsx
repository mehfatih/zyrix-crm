"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  CheckCircle2,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";

// ============================================================================
// Admin → Docs → Articles list
// ============================================================================

type DocStatus = "published" | "draft";

interface ArticleRow {
  locale: string;
  category: string;
  slug: string;
  title: string;
  status: DocStatus;
  plans: string[];
  recentlyUpdated: boolean;
  updatedAt?: string;
  readTime?: string;
  path: string;
}

interface ArticleStats {
  views: number;
  helpful: number;
  unhelpful: number;
}

const LOCALES = ["en", "ar", "tr"] as const;

export default function ArticleList({ locale: _locale }: { locale: string }) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [query, setQuery] = useState("");
  const [filterLocale, setFilterLocale] = useState<string>("en");
  const [filterStatus, setFilterStatus] = useState<"all" | DocStatus>("all");
  const [statsCache, setStatsCache] = useState<Record<string, ArticleStats>>(
    {}
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await adminApi.get<{ success: boolean; data: ArticleRow[] }>(
          "/api/admin/docs/articles"
        );
        if (!cancelled && r.data?.success) setArticles(r.data.data);
      } catch {
        /* shell already handles auth redirects */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .filter((a) => a.locale === filterLocale)
      .filter((a) => filterStatus === "all" || a.status === filterStatus)
      .filter(
        (a) =>
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
      .sort(
        (a, b) =>
          a.category.localeCompare(b.category) ||
          a.slug.localeCompare(b.slug)
      );
  }, [articles, query, filterLocale, filterStatus]);

  async function loadStats(row: ArticleRow) {
    const key = `${row.locale}:${row.category}:${row.slug}`;
    if (statsCache[key]) return;
    try {
      const r = await adminApi.get<{ success: boolean; data: ArticleStats }>(
        `/api/admin/docs/articles/${row.locale}/${row.category}/${row.slug}/stats`
      );
      if (r.data?.success) {
        setStatsCache((prev) => ({ ...prev, [key]: r.data.data }));
      }
    } catch {
      /* ignore */
    }
  }

  async function togglePatch(
    row: ArticleRow,
    patch: Partial<
      Pick<ArticleRow, "status" | "recentlyUpdated" | "plans" | "title">
    >
  ) {
    const key = `${row.locale}:${row.category}:${row.slug}`;
    setSavingKey(key);
    try {
      await adminApi.patch(
        `/api/admin/docs/articles/${row.locale}/${row.category}/${row.slug}`,
        patch
      );
      setArticles((prev) =>
        prev.map((a) => {
          if (
            a.locale === row.locale &&
            a.category === row.category &&
            a.slug === row.slug
          ) {
            return { ...a, ...patch };
          }
          return a;
        })
      );
    } catch {
      /* no-op */
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin me-2" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, slug, category…"
            className="w-full ps-9 pe-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:border-sky-300"
          />
        </div>
        <select
          value={filterLocale}
          onChange={(e) => setFilterLocale(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card"
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | DocStatus)
          }
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <Th>Article</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>Plans</Th>
              <Th>Updated</Th>
              <Th>Stats</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {filtered.map((row) => {
              const key = `${row.locale}:${row.category}:${row.slug}`;
              const stats = statsCache[key];
              const href = `/en/docs/${row.category}/${row.slug}`.replace(
                "/en/",
                `/${row.locale}/`
              );
              return (
                <tr
                  key={key}
                  className="hover:bg-muted/50 align-top"
                  onMouseEnter={() => loadStats(row)}
                >
                  <Td>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                      {row.title}
                      {row.recentlyUpdated && (
                        <span className="ms-1 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 border border-emerald-500/30">
                          <Sparkles className="w-2.5 h-2.5" />
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {row.locale} · {row.slug}
                    </div>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-sky-100 text-cyan-300">
                      {row.category}
                    </span>
                  </Td>
                  <Td>
                    <StatusToggle
                      status={row.status}
                      saving={savingKey === key}
                      onChange={(s) => togglePatch(row, { status: s })}
                    />
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(row.plans || []).map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-muted text-cyan-300 border border-border capitalize"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <div className="text-xs text-muted-foreground">
                      {row.updatedAt || "—"}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        togglePatch(row, { recentlyUpdated: !row.recentlyUpdated })
                      }
                      className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors ${
                        row.recentlyUpdated
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-card border-border text-muted-foreground hover:border-sky-300"
                      }`}
                    >
                      {row.recentlyUpdated ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      Mark updated
                    </button>
                  </Td>
                  <Td>
                    {stats ? (
                      <div className="text-xs space-y-0.5 text-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          {stats.views}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="inline-flex items-center gap-0.5 text-emerald-300">
                            <ThumbsUp className="w-3 h-3" />
                            {stats.helpful}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-rose-300">
                            <ThumbsDown className="w-3 h-3" />
                            {stats.unhelpful}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">hover to load</div>
                    )}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={href}
                        target="_blank"
                        className="text-xs text-cyan-300 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/en/admin/docs/${row.locale}/${row.category}/${row.slug}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-300"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Link>
                    </div>
                  </Td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                  No articles match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusToggle({
  status,
  saving,
  onChange,
}: {
  status: DocStatus;
  saving: boolean;
  onChange: (s: DocStatus) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(status === "published" ? "draft" : "published")}
      disabled={saving}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
        status === "published"
          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 border border-emerald-500/30"
          : "bg-amber-500/10 text-amber-300 border border-amber-500/30 border border-amber-500/30"
      }`}
    >
      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
      {status === "published" ? "Published" : "Draft"}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-start text-[11px] font-bold uppercase tracking-wider px-4 py-2.5">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}
