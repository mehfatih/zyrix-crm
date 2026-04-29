"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import FlexSearchModule from "flexsearch";
import type { SearchRecord } from "@/lib/docs/buildSearchIndex";
import {
  DOCS_COPY,
  getCategoryLabel,
  type CategoryId,
  type DocLocale,
} from "@/lib/docs/constants";

interface Props {
  locale: DocLocale;
  records: SearchRecord[];
}

export default function SearchResultsClient({ locale, records }: Props) {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const copy = DOCS_COPY[locale];

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const index = useMemo(() => {
    const Document = (FlexSearchModule as unknown as {
      Document: new (opts: unknown) => {
        add: (
          row: { id: string; title: string; body: string; category: string }
        ) => void;
        search: (q: string, opts?: unknown) => unknown;
      };
    }).Document;
    const idx = new Document({
      tokenize: "forward",
      document: {
        id: "id",
        index: ["title", "category", "body"],
      },
    });
    for (const r of records) {
      idx.add({
        id: r.id,
        title: r.title,
        category: r.category,
        body: r.body,
      });
    }
    return idx;
  }, [records]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [] as SearchRecord[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (index as any).search(q, { limit: 40 }) as Array<{
      field: string;
      result: string[];
    }>;
    const ids = new Set<string>();
    for (const f of raw || []) for (const id of f.result || []) ids.add(id);
    return records.filter((r) => ids.has(r.id));
  }, [query, index, records]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">
        {copy.searchTitle}
      </h1>

      <div className="max-w-2xl mb-8">
        <div className="flex items-center gap-2 px-4 py-3 bg-card border-2 border-border rounded-xl">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="flex-1 outline-none bg-transparent"
          />
        </div>
      </div>

      {query.trim() ? (
        results.length === 0 ? (
          <p className="text-muted-foreground">{copy.noResults}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} {copy.searchResults.toLowerCase()}
            </p>
            <ul className="space-y-3">
              {results.map((r) => {
                const href = `/${locale}/docs/${r.path.replace(/^features\//, "")}`;
                return (
                  <li
                    key={r.id}
                    className="bg-card border border-border rounded-xl p-5 hover:border-sky-300 transition-colors"
                  >
                    <Link href={href} className="block">
                      <div className="text-xs uppercase tracking-wider font-semibold text-cyan-300 mb-1">
                        {getCategoryLabel(r.category as CategoryId, locale)}
                      </div>
                      <div className="text-base font-bold text-foreground mb-1">
                        {r.title}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {r.excerpt}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )
      ) : (
        <p className="text-muted-foreground">{copy.searchHint}</p>
      )}
    </div>
  );
}
