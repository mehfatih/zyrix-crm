"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import {
  CURRENCY_CONFIG,
  SUPPORTED_CURRENCIES,
  type DisplayCurrency,
} from "@/lib/billing/currency";

// ────────────────────────────────────────────────────────────────────
// Sprint 14z — CurrencySwitcher
// Pill dropdown with the active currency + an "(auto)" indicator when
// not overridden. Selecting the auto-detected currency clears the
// localStorage override.
// ────────────────────────────────────────────────────────────────────

export function CurrencySwitcher() {
  const t = useTranslations("billing");
  const { currency, setCurrency, clearOverride, autoDetected, isOverridden } =
    useDisplayCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const handlePick = (next: DisplayCurrency) => {
    if (next === autoDetected) {
      clearOverride();
    } else {
      setCurrency(next);
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap" ref={ref}>
      <span className="text-xs text-muted-foreground">
        {t("currencySwitcher.title")}
      </span>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold"
        >
          <Globe2 className="w-3.5 h-3.5 text-cyan-300" />
          <span dir="ltr">{currency}</span>
          {!isOverridden && (
            <span className="text-muted-foreground font-normal">
              {t("currencySwitcher.auto")}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden max-h-[60vh] overflow-y-auto">
            {SUPPORTED_CURRENCIES.map((code) => {
              const isActive = code === currency;
              const isAuto = code === autoDetected;
              return (
                <button
                  key={code}
                  onClick={() => handlePick(code)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors border-b border-border last:border-b-0 ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-200"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold tabular-nums" dir="ltr">
                      {code}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {CURRENCY_CONFIG[code].symbol}
                    </span>
                    {isAuto && (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {t("currencySwitcher.auto")}
                      </span>
                    )}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-cyan-300" />}
                </button>
              );
            })}
            {isOverridden && (
              <button
                onClick={() => {
                  clearOverride();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground border-t border-border"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t("currencySwitcher.useAutoDetected")}
                <span className="ml-auto" dir="ltr">
                  {autoDetected}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
