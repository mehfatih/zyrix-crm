"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface GlobalSearchProps {
  collapsed: boolean;
  placeholder: string;
  shortcutHint: string;
}

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

export function GlobalSearch({
  collapsed,
  placeholder,
  shortcutHint,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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
      // Small delay lets overlay render before focusing
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const shortcutLabel = mac ? "⌘K" : shortcutHint;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={placeholder}
        className="w-10 h-9 mx-auto flex items-center justify-center rounded-[10px] border border-sky-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-9 flex items-center gap-2 px-3 rounded-[10px] border border-sky-100 bg-white hover:border-cyan-200 transition-colors text-left"
      >
        <Search className="w-4 h-4 text-slate-400" />
        <span className="flex-1 text-sm text-slate-400 truncate">
          {placeholder}
        </span>
        <kbd className="text-[10px] font-semibold text-slate-500 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5">
          {shortcutLabel}
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
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
                placeholder={placeholder}
                className="flex-1 text-base outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 py-6 text-sm text-slate-500">
              {query ? (
                <p>
                  Searching for <span className="font-semibold text-slate-700">&quot;{query}&quot;</span>… results will
                  appear here once the search index is wired up.
                </p>
              ) : (
                <p className="text-slate-400">
                  Type to search contacts, deals, tasks, companies and help
                  docs.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
