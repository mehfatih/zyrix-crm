"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Loader2,
  ThumbsDown,
  ThumbsUp,
  Save,
  CheckCircle2,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";

interface ArticleRow {
  locale: string;
  category: string;
  slug: string;
  title: string;
  status: "published" | "draft";
  plans: string[];
  recentlyUpdated: boolean;
  updatedAt?: string;
  path: string;
}

interface ArticleStats {
  views: number;
  helpful: number;
  unhelpful: number;
}

const ALL_PLANS = ["free", "starter", "business", "enterprise"];

export default function ArticleEditor({
  adminLocale,
  docLocale,
  category,
  slug,
}: {
  adminLocale: string;
  docLocale: string;
  category: string;
  slug: string;
}) {
  const [row, setRow] = useState<ArticleRow | null>(null);
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [plans, setPlans] = useState<string[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [listRes, statsRes] = await Promise.all([
          adminApi.get<{ success: boolean; data: ArticleRow[] }>(
            "/api/admin/docs/articles"
          ),
          adminApi.get<{ success: boolean; data: ArticleStats }>(
            `/api/admin/docs/articles/${docLocale}/${category}/${slug}/stats`
          ),
        ]);
        if (cancelled) return;
        const article = listRes.data.data.find(
          (a) =>
            a.locale === docLocale && a.category === category && a.slug === slug
        );
        if (article) {
          setRow(article);
          setTitle(article.title);
          setStatus(article.status);
          setPlans(article.plans || []);
          setRecentlyUpdated(article.recentlyUpdated);
        }
        if (statsRes.data.success) setStats(statsRes.data.data);
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
  }, [docLocale, category, slug]);

  async function save() {
    if (!row) return;
    setSaving(true);
    try {
      await adminApi.patch(
        `/api/admin/docs/articles/${row.locale}/${row.category}/${row.slug}`,
        {
          title,
          status,
          plans,
          recentlyUpdated,
          internalNotes: notes,
        }
      );
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin me-2" />
        Loading…
      </div>
    );
  }

  if (!row) {
    return (
      <div className="bg-white border border-sky-100 rounded-xl p-8 text-center">
        <p className="text-slate-500 mb-3">Article not found.</p>
        <Link
          href={`/${adminLocale}/admin/docs`}
          className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to docs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href={`/${adminLocale}/admin/docs`}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            All articles
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{row.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {row.locale} · {row.category} · {row.slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${row.locale}/docs/${row.category}/${row.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-sky-200 text-slate-600 hover:border-sky-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View public
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : savedAt ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {savedAt ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Eye} label="Views" value={stats?.views ?? "—"} />
        <StatCard
          icon={ThumbsUp}
          label="Helpful"
          value={stats?.helpful ?? "—"}
          tone="emerald"
        />
        <StatCard
          icon={ThumbsDown}
          label="Not helpful"
          value={stats?.unhelpful ?? "—"}
          tone="rose"
        />
      </div>

      {/* Editor form */}
      <div className="bg-white border border-sky-100 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-sky-100 rounded-lg bg-white focus:outline-none focus:border-sky-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "published" | "draft")
              }
              className="w-full px-3 py-2 border border-sky-100 rounded-lg bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Recently updated badge
            </label>
            <button
              type="button"
              onClick={() => setRecentlyUpdated((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border ${
                recentlyUpdated
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-sky-200 text-slate-600"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {recentlyUpdated ? "Shown" : "Hidden"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Plans
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_PLANS.map((p) => {
              const on = plans.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() =>
                    setPlans((prev) =>
                      on ? prev.filter((x) => x !== p) : [...prev, p]
                    )
                  }
                  className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${
                    on
                      ? "bg-sky-50 border-sky-300 text-sky-600"
                      : "bg-white border-sky-200 text-slate-500"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Internal notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Notes for other editors — not shown publicly."
            className="w-full px-3 py-2 border border-sky-100 rounded-lg bg-white focus:outline-none focus:border-sky-300 text-sm"
          />
        </div>

        <p className="text-xs text-slate-400">
          Markdown body lives in <code className="bg-sky-50 px-1.5 py-0.5 rounded">content/docs/{row.locale}/{row.path}.md</code> and is edited in your repo for now. An in-browser editor is planned for a future sprint.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "cyan",
}: {
  icon: typeof Eye;
  label: string;
  value: number | string;
  tone?: "cyan" | "emerald" | "rose";
}) {
  const toneClasses = {
    cyan: "bg-sky-50 text-sky-600 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  }[tone];
  return (
    <div className={`border rounded-xl p-4 ${toneClasses}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-bold mt-1 tabular-nums">{value}</div>
    </div>
  );
}
