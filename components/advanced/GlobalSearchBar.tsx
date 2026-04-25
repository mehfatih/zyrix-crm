"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  Loader2,
  Users,
  Briefcase,
  FileText,
  FileSignature,
  CheckSquare,
  X,
  ArrowRight,
} from "lucide-react";
import { globalSearch, type GlobalSearchResult } from "@/lib/api/advanced";
import { useTranslations } from "next-intl";

// ============================================================================
// GLOBAL SEARCH BAR — for header (cmd+K style)
// ============================================================================

export default function GlobalSearchBar() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Search");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const r = await globalSearch(query);
        setResults(r);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const closeAndReset = () => {
    setOpen(false);
    setQuery("");
    setResults(null);
  };

  return (
    <div className="relative flex-1 max-w-xl" ref={containerRef}>
      <div className="relative">
        <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("placeholder")}
          className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-16 rtl:pl-16 py-2 text-sm bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <kbd className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 hidden sm:block">
          ⌘K
        </kbd>
      </div>

      {open && (query.trim().length >= 2 || loading) && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-sky-200 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto z-50">
          {loading && !results ? (
            <div className="p-6 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-sky-500 mx-auto" />
            </div>
          ) : results && results.totalMatches === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              {t("noResults", { q: query })}
            </div>
          ) : results ? (
            <div className="p-2 space-y-3">
              <ResultSection
                title={t("entities.customers")}
                Icon={Users}
                color="cyan"
                items={results.customers.map((c) => ({
                  id: c.id,
                  primary: c.fullName,
                  secondary: c.email || c.phone || c.companyName || "—",
                  meta: c.status,
                  href: `/${locale}/customers/${c.id}`,
                }))}
                onClick={closeAndReset}
              />
              <ResultSection
                title={t("entities.deals")}
                Icon={Briefcase}
                color="emerald"
                items={results.deals.map((d) => ({
                  id: d.id,
                  primary: d.title,
                  secondary: d.customerName,
                  meta: `${d.currency} ${Number(d.value).toFixed(0)} · ${d.stage}`,
                  href: `/${locale}/deals`,
                }))}
                onClick={closeAndReset}
              />
              <ResultSection
                title={t("entities.quotes")}
                Icon={FileText}
                color="indigo"
                items={results.quotes.map((q) => ({
                  id: q.id,
                  primary: `${q.quoteNumber} — ${q.title}`,
                  secondary: q.customerName,
                  meta: `${q.currency} ${Number(q.total).toFixed(0)} · ${q.status}`,
                  href: `/${locale}/quotes`,
                }))}
                onClick={closeAndReset}
              />
              <ResultSection
                title={t("entities.contracts")}
                Icon={FileSignature}
                color="amber"
                items={results.contracts.map((c) => ({
                  id: c.id,
                  primary: `${c.contractNumber} — ${c.title}`,
                  secondary: c.customerName,
                  meta: `${c.currency} ${Number(c.value).toFixed(0)} · ${c.status}`,
                  href: `/${locale}/contracts`,
                }))}
                onClick={closeAndReset}
              />
              <ResultSection
                title={t("entities.tasks")}
                Icon={CheckSquare}
                color="sky"
                items={results.tasks.map((t) => ({
                  id: t.id,
                  primary: t.title,
                  secondary: t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "—",
                  meta: `${t.priority} · ${t.status}`,
                  href: `/${locale}/tasks`,
                }))}
                onClick={closeAndReset}
              />
              <div className="pt-2 border-t border-sky-50 flex items-center justify-between px-2 text-[10px] text-slate-500">
                <span>
                  {results.totalMatches} {t("matches")}
                </span>
                <span>
                  <kbd className="font-mono bg-slate-100 px-1 rounded">↵</kbd> {t("toNavigate")}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  Icon,
  color,
  items,
  onClick,
}: {
  title: string;
  Icon: typeof Users;
  color: "cyan" | "emerald" | "indigo" | "amber" | "sky";
  items: { id: string; primary: string; secondary: string; meta: string; href: string }[];
  onClick: () => void;
}) {
  if (items.length === 0) return null;
  const colors: Record<string, string> = {
    cyan: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <div>
      <div className="px-2 py-1 flex items-center gap-2">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-3 h-3" />
        </div>
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
          {title}
        </span>
        <span className="text-[10px] text-slate-400">({items.length})</span>
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={onClick}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-sky-50 text-sm group"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 truncate">{item.primary}</div>
              <div className="text-xs text-slate-500 truncate">{item.secondary}</div>
            </div>
            <div className="text-[10px] text-slate-400 whitespace-nowrap">
              {item.meta}
            </div>
            <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-sky-500 ltr:translate-x-0 rtl:-scale-x-100 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
