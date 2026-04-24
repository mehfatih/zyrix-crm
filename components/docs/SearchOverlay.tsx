"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, FileText } from "lucide-react";
import FlexSearchModule from "flexsearch";
import type { SearchRecord } from "@/lib/docs/buildSearchIndex";
import {
  DOCS_COPY,
  getCategoryLabel,
  type CategoryId,
  type DocLocale,
} from "@/lib/docs/constants";

type AnyIndex = {
  add: (id: string, doc: { title: string; body: string; category: string }) => void;
  search: (query: string, limit?: number) => unknown[];
};

interface SearchOverlayProps {
  locale: DocLocale;
  records: SearchRecord[];
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({
  locale,
  records,
  open,
  onClose,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const copy = DOCS_COPY[locale];

  const index = useMemo(() => {
    const Document = (FlexSearchModule as unknown as { Document: new (opts: unknown) => AnyIndex }).Document;
    const idx = new Document({
      tokenize: "forward",
      document: {
        id: "id",
        index: ["title", "category", "body"],
        store: ["title", "category", "path", "excerpt"],
      },
    });
    for (const r of records) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (idx as any).add({
        id: r.id,
        title: r.title,
        category: r.category,
        body: r.body,
        path: r.path,
        excerpt: r.excerpt,
      });
    }
    return idx;
  }, [records]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [] as SearchRecord[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (index as any).search(q, { limit: 12, enrich: true }) as Array<{
      result: Array<{ id: string; doc?: { title: string; category: string; path: string; excerpt: string } }>;
    }>;
    const seen = new Set<string>();
    const out: SearchRecord[] = [];
    for (const field of raw || []) {
      for (const hit of field.result || []) {
        if (seen.has(hit.id)) continue;
        seen.add(hit.id);
        const rec = records.find((r) => r.id === hit.id);
        if (rec) out.push(rec);
        if (out.length >= 12) break;
      }
      if (out.length >= 12) break;
    }
    return out;
  }, [query, index, records]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      setActiveIndex(0);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown" && results.length) {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp" && results.length) {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results.length) {
        const target = results[activeIndex];
        if (target) {
          window.location.href = `/${locale}/docs/${target.path.replace(/^features\//, "")}`;
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIndex, locale, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-sky-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="flex-1 text-base outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">
              {copy.searchHint}
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">
              {copy.noResults}
            </p>
          ) : (
            <ul>
              {results.map((r, i) => {
                const href = `/${locale}/docs/${r.path.replace(/^features\//, "")}`;
                return (
                  <li key={r.id}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-sky-50 ${
                        i === activeIndex
                          ? "bg-cyan-50"
                          : "hover:bg-sky-50"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {highlight(r.title, query)}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {getCategoryLabel(r.category as CategoryId, locale)} · {r.path}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {highlight(r.excerpt, query)}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="px-4 py-2 border-t border-sky-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <kbd className="px-1 py-0.5 bg-sky-50 border border-sky-100 rounded">↑↓</kbd> navigate ·{" "}
            <kbd className="px-1 py-0.5 bg-sky-50 border border-sky-100 rounded">↵</kbd> open ·{" "}
            <kbd className="px-1 py-0.5 bg-sky-50 border border-sky-100 rounded">esc</kbd> close
          </span>
          <span>{results.length} {copy.searchResults}</span>
        </div>
      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeReg(q)})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-slate-900 rounded px-0.5">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
