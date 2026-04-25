"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Keyboard, Search, X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  isRTL: boolean;
}

interface ShortcutRow {
  keys: string[];
  labelKey: string;
  group: "navigation" | "create" | "general";
}

const SHORTCUTS: ShortcutRow[] = [
  { keys: ["⌘", "K"], labelKey: "globalSearch", group: "general" },
  { keys: ["C"], labelKey: "quickAdd", group: "create" },
  { keys: ["?"], labelKey: "openCheatSheet", group: "general" },
  { keys: ["Esc"], labelKey: "close", group: "general" },
  { keys: ["G", "H"], labelKey: "goHome", group: "navigation" },
  { keys: ["G", "D"], labelKey: "goDeals", group: "navigation" },
  { keys: ["G", "C"], labelKey: "goContacts", group: "navigation" },
  { keys: ["G", "T"], labelKey: "goTasks", group: "navigation" },
  { keys: ["G", "M"], labelKey: "goConversations", group: "navigation" },
  { keys: ["G", "S"], labelKey: "goSettings", group: "navigation" },
];

const GROUPS: Array<ShortcutRow["group"]> = [
  "general",
  "create",
  "navigation",
];

export function KeyboardShortcutsModal({
  open,
  onClose,
  isRTL,
}: KeyboardShortcutsModalProps) {
  const t = useTranslations("Shortcuts");
  const [query, setQuery] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setAnimateIn(false);
    const raf = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SHORTCUTS;
    return SHORTCUTS.filter((row) => {
      const label = t(`rows.${row.labelKey}`).toLowerCase();
      return (
        label.includes(q) ||
        row.keys.join(" ").toLowerCase().includes(q) ||
        row.group.includes(q)
      );
    });
  }, [query, t]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4 transition-opacity duration-150 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundColor: "rgba(12, 74, 110, 0.4)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[560px] bg-white rounded-[20px] overflow-hidden flex flex-col transition-all duration-200 ${
          animateIn ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
        }`}
        style={{
          maxHeight: "80vh",
          boxShadow: "0 30px 80px rgba(8,145,178,0.18)",
        }}
      >
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <Keyboard className="w-5 h-5 text-sky-500" />
          <h2 className="text-[20px] font-bold text-[#0C4A6E] flex-1">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition-colors"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-sky-100 bg-[#F0F9FF] focus-within:border-sky-300 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent outline-none text-sm text-[#0C4A6E] placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>

        <div
          className="px-6 pb-5 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 180px)" }}
        >
          {GROUPS.map((g) => {
            const rows = filtered.filter((r) => r.group === g);
            if (rows.length === 0) return null;
            return (
              <div key={g} className="mt-4 first:mt-2">
                <div className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase mb-2">
                  {t(`groups.${g}`)}
                </div>
                <ul className="space-y-1">
                  {rows.map((row) => (
                    <li
                      key={row.labelKey}
                      className="flex items-center justify-between h-10 px-3 rounded-lg hover:bg-sky-50"
                    >
                      <span className="text-sm text-[#0C4A6E]">
                        {t(`rows.${row.labelKey}`)}
                      </span>
                      <span className="flex items-center gap-1">
                        {row.keys.map((k, i) => (
                          <kbd
                            key={`${row.labelKey}-${i}`}
                            className="min-w-[26px] h-6 px-1.5 inline-flex items-center justify-center text-[11px] font-semibold text-slate-600 bg-white border border-sky-100 rounded shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              {t("noMatches")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
