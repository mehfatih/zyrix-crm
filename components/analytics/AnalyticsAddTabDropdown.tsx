"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ANALYTICS_TAB_CATALOG,
  type AnalyticsTabId,
} from "@/lib/analytics/tab-catalog";
import { TAB_DOT } from "./colors";

interface Props {
  availableToAdd: AnalyticsTabId[];
  onAdd: (id: AnalyticsTabId) => void;
  locale: "en" | "ar" | "tr";
}

export function AnalyticsAddTabDropdown({ availableToAdd, onAdd, locale }: Props) {
  const t = useTranslations("Analytics");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-violet-500/40 hover:text-foreground text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        {t("addTab.label")}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-72 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden max-h-[60vh] overflow-y-auto">
          {availableToAdd.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              {t("addTab.empty")}
            </div>
          ) : (
            availableToAdd.map((id) => {
              const tab = ANALYTICS_TAB_CATALOG[id];
              return (
                <button
                  key={id}
                  onClick={() => {
                    onAdd(id);
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 hover:bg-muted"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${TAB_DOT[tab.color]} mt-1.5 flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground">
                      {tab.name[locale]}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {tab.description[locale]}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
