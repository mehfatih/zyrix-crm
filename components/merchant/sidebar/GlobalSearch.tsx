"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, X, BookOpen, FileText } from "lucide-react";

// ============================================================================
// GlobalSearch — top-left sidebar search button + Cmd+K overlay.
// Integrates docs results in a dedicated "Documentation" section.
// CRM-side results (contacts, deals, tasks) are still a placeholder until
// the backend search index lands — docs results are wired up today.
// ============================================================================

interface GlobalSearchProps {
  collapsed: boolean;
  placeholder: string;
  shortcutHint: string;
}

interface DocHit {
  category: string;
  slug: string;
  title: string;
  path: string;
  snippet: string;
}

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

const API_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || ""
    : "";

export function GlobalSearch({
  collapsed,
  placeholder,
  shortcutHint,
}: GlobalSearchProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<DocHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(isMac());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const modifier = mac ? e.metaKey : e.ctrlKey;
      if (modifier && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mac]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setDocs([]);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!q || !open) {
      setDocs([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (!API_URL) {
          setDocs([]);
          return;
        }
        const r = await fetch(
          `${API_URL}/api/docs/${locale}/search?q=${encodeURIComponent(q)}&limit=8`,
          { signal: ctrl.signal }
        );
        const j = await r.json().catch(() => ({}));
        setDocs(j?.data?.results || []);
      } catch {
        if (!ctrl.signal.aborted) setDocs([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [query, locale, open]);

  const shortcutLabel = mac ? "⌘K" : shortcutHint;

  const docsSectionLabel = useMemo(() => {
    return locale === "ar"
      ? "الوثائق"
      : locale === "tr"
        ? "Dokümantasyon"
        : "Documentation";
  }, [locale]);

  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={placeholder}
          className="w-10 h-9 mx-auto flex items-center justify-center rounded-[10px] border border-border text-muted-foreground hover:bg-muted hover:text-cyan-300 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
        {open && (
          <Overlay
            onClose={() => setOpen(false)}
            query={query}
            setQuery={setQuery}
            inputRef={inputRef}
            placeholder={placeholder}
            docs={docs}
            loading={loading}
            locale={locale}
            docsSectionLabel={docsSectionLabel}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-9 flex items-center gap-2 px-3 rounded-[10px] border border-border bg-card hover:border-border transition-colors text-left"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1 text-sm text-muted-foreground truncate">
          {placeholder}
        </span>
        <kbd className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">
          {shortcutLabel}
        </kbd>
      </button>

      {open && (
        <Overlay
          onClose={() => setOpen(false)}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          placeholder={placeholder}
          docs={docs}
          loading={loading}
          locale={locale}
          docsSectionLabel={docsSectionLabel}
        />
      )}
    </>
  );
}

function Overlay({
  onClose,
  query,
  setQuery,
  inputRef,
  placeholder,
  docs,
  loading,
  locale,
  docsSectionLabel,
}: {
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  docs: DocHit[];
  loading: boolean;
  locale: string;
  docsSectionLabel: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-base outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <p className="px-4 py-8 text-sm text-muted-foreground text-center">
              Type to search contacts, deals, tasks and documentation.
            </p>
          ) : (
            <div>
              {/* Documentation section — now wired */}
              <SectionHeader icon={BookOpen} label={docsSectionLabel} />
              {loading ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">…</p>
              ) : docs.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">No matches</p>
              ) : (
                <ul>
                  {docs.map((d) => {
                    const href = `/${locale}/docs/${d.category}/${d.slug}`;
                    return (
                      <li key={`${d.category}-${d.slug}`}>
                        <Link
                          href={href}
                          onClick={onClose}
                          className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted"
                        >
                          <FileText className="w-4 h-4 text-cyan-300 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {d.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {d.snippet}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Everything-else placeholder — wired up when CRM search index lands */}
              <SectionHeader icon={Search} label="CRM records" />
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Contacts, deals and tasks will appear here once the search
                index is wired up.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: typeof Search;
  label: string;
}) {
  return (
    <div className="px-4 py-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/70 border-b border-border">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}
