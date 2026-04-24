"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Sparkles, X } from "lucide-react";

import { QuickAddTile } from "./QuickAddTile";
import {
  QUICK_ADD_ENTITIES,
  type QuickAddEntity,
} from "./quickAddEntities";
import {
  recordQuickAddUsage,
  sortEntitiesByUsage,
} from "@/lib/stores/quickAddUsageStore";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  isRTL: boolean;
}

const GRID_COLS = 4;

export function QuickAddModal({
  open,
  onClose,
  locale,
  isRTL,
}: QuickAddModalProps) {
  const t = useTranslations("QuickAdd");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  // Sorted list by usage for default order (only when no query).
  const sortedEntities = useMemo(
    () => sortEntitiesByUsage(QUICK_ADD_ENTITIES),
    // Re-evaluate only when modal opens (not on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const labelFor = (entity: QuickAddEntity) => t(`entities.${entity.labelKey}`);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedEntities;
    return sortedEntities.filter((entity) => {
      const label = labelFor(entity).toLowerCase();
      return fuzzyMatch(label, q) || fuzzyMatch(entity.id, q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortedEntities, locale]);

  // Reset state each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    setAnimateIn(false);
    const raf = requestAnimationFrame(() => {
      setAnimateIn(true);
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Clamp active index when filtered changes.
  useEffect(() => {
    if (filtered.length === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((i) => Math.min(i, filtered.length - 1));
  }, [filtered.length]);

  // Keyboard navigation inside the modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (!filtered.length) return;

      const moveBy = (delta: number) => {
        setActiveIndex((i) => {
          const next = (i + delta + filtered.length) % filtered.length;
          return next;
        });
      };

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          moveBy(isRTL ? -1 : 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveBy(isRTL ? 1 : -1);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveBy(GRID_COLS);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveBy(-GRID_COLS);
          break;
        case "Tab":
          e.preventDefault();
          moveBy(e.shiftKey ? -1 : 1);
          break;
        case "Enter": {
          const target = filtered[activeIndex];
          if (target) {
            e.preventDefault();
            activate(target);
          }
          break;
        }
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, activeIndex, isRTL]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Ensure the active tile is visible.
  useEffect(() => {
    const el = tileRefs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const activate = (entity: QuickAddEntity) => {
    recordQuickAddUsage(entity.id);
    onClose();
    router.push(`/${locale}/merchant/create/${entity.id}`);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-start justify-center pt-[14vh] px-4 transition-opacity duration-150 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundColor: "rgba(12, 74, 110, 0.35)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[640px] bg-white rounded-[20px] overflow-hidden flex flex-col transition-all duration-200 ${
          animateIn ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
        }`}
        style={{
          maxHeight: "80vh",
          boxShadow: "0 30px 80px rgba(8,145,178,0.18)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <Sparkles className="w-5 h-5 text-cyan-600" />
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

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-sky-100 bg-[#F0F9FF] focus-within:border-cyan-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent outline-none text-sm text-[#0C4A6E] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Grid */}
        <div
          className="px-6 pb-4 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 200px)" }}
        >
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              {t("noMatches")}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map((entity, idx) => (
                <QuickAddTile
                  key={entity.id}
                  ref={(el) => {
                    tileRefs.current[idx] = el;
                  }}
                  icon={entity.icon}
                  label={labelFor(entity)}
                  shortcut={entity.shortcut}
                  accent={entity.accent}
                  isActive={idx === activeIndex}
                  onClick={() => activate(entity)}
                  onMouseEnter={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sky-100 flex items-center gap-3 bg-white">
          <p className="flex-1 text-[12px] text-slate-500">
            {t("proTip")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-sm font-semibold text-cyan-700 bg-[#F0F9FF] hover:bg-cyan-50 transition-colors"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h.includes(n)) return true;
  let hi = 0;
  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni];
    hi = h.indexOf(ch, hi);
    if (hi === -1) return false;
    hi++;
  }
  return true;
}
