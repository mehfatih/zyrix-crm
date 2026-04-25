"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import {
  CATEGORIES,
  DOCS_COPY,
  getCategoryLabel,
  type DocLocale,
} from "@/lib/docs/constants";

interface SidebarArticle {
  slug: string;
  title: string;
  category: string;
  order: number;
  path: string;
}

interface DocsSidebarProps {
  locale: DocLocale;
  articles: SidebarArticle[];
  onSearchClick?: () => void;
}

export default function DocsSidebar({
  locale,
  articles,
  onSearchClick,
}: DocsSidebarProps) {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const copy = DOCS_COPY[locale];

  const grouped = useMemo(() => {
    const g: Record<string, SidebarArticle[]> = {};
    for (const a of articles) {
      if (!g[a.category]) g[a.category] = [];
      g[a.category].push(a);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => a.order - b.order);
    }
    return g;
  }, [articles]);

  const filtered = useMemo(() => {
    if (!query.trim()) return grouped;
    const q = query.toLowerCase();
    const out: Record<string, SidebarArticle[]> = {};
    for (const [cat, list] of Object.entries(grouped)) {
      const match = list.filter((a) => a.title.toLowerCase().includes(q));
      if (match.length) out[cat] = match;
    }
    return out;
  }, [grouped, query]);

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto pe-2">
      <div className="mb-4">
        <button
          type="button"
          onClick={onSearchClick}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-white border border-sky-100 rounded-lg hover:border-sky-300 transition-colors text-slate-500"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-start truncate">
            {copy.searchPlaceholder}
          </span>
          <kbd className="text-[10px] font-semibold text-slate-500 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={copy.searchPlaceholder}
        className="w-full px-3 py-1.5 text-sm bg-white border border-sky-100 rounded-lg focus:outline-none focus:border-sky-300 mb-3"
      />

      <nav className="space-y-1 text-sm">
        {(["overview", ...CATEGORIES.map((c) => c.id)] as string[]).map((catId) => {
          const list = filtered[catId];
          if (!list || list.length === 0) return null;
          const open = !collapsed[catId];
          return (
            <div key={catId}>
              <button
                type="button"
                onClick={() =>
                  setCollapsed((p) => ({ ...p, [catId]: !p[catId] }))
                }
                className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700"
              >
                <span>
                  {getCategoryLabel(catId as never, locale)} ({list.length})
                </span>
                {open ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
              {open && (
                <ul className="mb-2 space-y-0.5 border-s border-sky-100 ms-2 ps-2">
                  {list.map((a) => {
                    const href = `/${locale}/docs/${a.category}/${a.slug}`;
                    return (
                      <li key={`${a.category}-${a.slug}`}>
                        <Link
                          href={href}
                          className={`block px-2 py-1.5 rounded-md transition-colors ${
                            isActive(href)
                              ? "bg-sky-50 text-sky-600 font-semibold"
                              : "text-slate-600 hover:bg-sky-50 hover:text-slate-900"
                          }`}
                        >
                          {a.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
