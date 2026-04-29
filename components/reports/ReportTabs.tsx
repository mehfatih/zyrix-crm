"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Customizable Reports Tabs
// 4 fixed tabs (sales/pipeline/customers/revenue) + a + dropdown of 9
// extra report categories. Selection persists in localStorage. Tabs
// can be removed via the X (last remaining tab is locked).
// ────────────────────────────────────────────────────────────────────

export type ReportTabId =
  | "sales"
  | "pipeline"
  | "customers"
  | "revenue"
  | "deals"
  | "team"
  | "activity"
  | "leakage"
  | "products"
  | "channels"
  | "geography"
  | "cohorts"
  | "tax";

export interface ReportTabDef {
  id: ReportTabId;
  label: string;
  eyebrow: string;
  accent: string; // tailwind text class
}

export const ALL_TABS: ReportTabDef[] = [
  { id: "sales",     label: "Sales",     eyebrow: "REVENUE PERFORMANCE",  accent: "text-emerald-300" },
  { id: "pipeline",  label: "Pipeline",  eyebrow: "DEAL FLOW",            accent: "text-cyan-300" },
  { id: "customers", label: "Customers", eyebrow: "ACCOUNT HEALTH",       accent: "text-violet-300" },
  { id: "revenue",   label: "Revenue",   eyebrow: "FINANCIAL TRENDS",     accent: "text-emerald-300" },
  { id: "deals",     label: "Deals",     eyebrow: "OPPORTUNITY ANALYSIS", accent: "text-sky-300" },
  { id: "team",      label: "Team",      eyebrow: "PERFORMANCE BY USER",  accent: "text-lime-300" },
  { id: "activity",  label: "Activity",  eyebrow: "ENGAGEMENT METRICS",   accent: "text-amber-300" },
  { id: "leakage",   label: "Leakage",   eyebrow: "REVENUE AT RISK",      accent: "text-rose-300" },
  { id: "products",  label: "Products",  eyebrow: "PRODUCT MIX",          accent: "text-pink-300" },
  { id: "channels",  label: "Channels",  eyebrow: "ACQUISITION CHANNELS", accent: "text-indigo-300" },
  { id: "geography", label: "Geography", eyebrow: "REGIONAL BREAKDOWN",   accent: "text-teal-300" },
  { id: "cohorts",   label: "Cohorts",   eyebrow: "COHORT ANALYSIS",      accent: "text-fuchsia-300" },
  { id: "tax",       label: "Tax",       eyebrow: "TAX & COMPLIANCE",     accent: "text-amber-300" },
];

const DEFAULT_TABS: ReportTabId[] = ["sales", "pipeline", "customers", "revenue"];
const STORAGE_KEY = "zyrix.reports.activeTabs";

interface Props {
  active: ReportTabId;
  onSelect: (id: ReportTabId) => void;
}

export function ReportTabs({ active, onSelect }: Props) {
  const [tabs, setTabs] = useState<ReportTabId[]>(DEFAULT_TABS);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((id) => ALL_TABS.some((t) => t.id === id))
      ) {
        setTabs(parsed as ReportTabId[]);
      }
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  // Outside-click closes the + dropdown
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function persist(next: ReportTabId[]) {
    setTabs(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  function addTab(id: ReportTabId) {
    if (tabs.includes(id)) return;
    persist([...tabs, id]);
    setOpen(false);
    onSelect(id);
  }

  function removeTab(id: ReportTabId, e: React.MouseEvent) {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const next = tabs.filter((t) => t !== id);
    persist(next);
    if (active === id) onSelect(next[0]);
  }

  const available = ALL_TABS.filter((t) => !tabs.includes(t.id));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((id) => {
        const def = ALL_TABS.find((t) => t.id === id);
        if (!def) return null;
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors border",
              isActive
                ? "bg-violet-500/15 border-violet-500/40 text-violet-200"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-violet-500/30",
            )}
          >
            {def.label}
            {tabs.length > 1 && (
              <X
                onClick={(e) => removeTab(id, e)}
                className={cn(
                  "w-3.5 h-3.5 transition-opacity hover:text-rose-300",
                  isActive ? "opacity-60" : "opacity-0 group-hover:opacity-100",
                )}
              />
            )}
          </button>
        );
      })}

      {available.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add report
          </button>
          {open && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-xl shadow-xl z-20 min-w-[260px] overflow-hidden max-h-[60vh] overflow-y-auto">
              {available.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addTab(t.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <div>
                    <div
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        t.accent,
                      )}
                    >
                      {t.eyebrow}
                    </div>
                    <div className="text-foreground text-sm font-bold">
                      {t.label}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
