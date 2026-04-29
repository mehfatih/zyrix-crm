"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Receipt } from "lucide-react";
import { useUserCountry } from "@/hooks/useUserCountry";
import { COUNTRIES, type CountryCode } from "@/lib/country";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14v — TaxInvoicesPresetStrip
// Locale-aware teal gradient card on /tax-invoices showing the active
// country's tax system (label + standard rate + currency) with a
// dropdown to switch country. Shares the resolver
// (locale → localStorage override) used by /tax via useUserCountry.
// ────────────────────────────────────────────────────────────────────

const FLAGS: Record<CountryCode, string> = {
  TR: "🇹🇷",
  SA: "🇸🇦",
  AE: "🇦🇪",
  EG: "🇪🇬",
  IQ: "🇮🇶",
  KW: "🇰🇼",
  QA: "🇶🇦",
  BH: "🇧🇭",
  OM: "🇴🇲",
  JO: "🇯🇴",
  LB: "🇱🇧",
  US: "🇺🇸",
};

export function TaxInvoicesPresetStrip() {
  const { country, setCountry, config } = useUserCountry();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const allCountries = Object.values(COUNTRIES) as Array<
    (typeof COUNTRIES)[CountryCode]
  >;

  return (
    <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/15 via-teal-500/10 to-cyan-500/10 p-5">
      <div className="flex items-start gap-4 mb-4 flex-wrap">
        <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
          <Receipt className="w-5 h-5 text-teal-200" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-1">
            ACTIVE TAX SYSTEM
          </p>
          <h3 className="text-foreground text-base font-bold flex items-center gap-2 flex-wrap">
            <span className="text-lg">{FLAGS[country]}</span>
            <span>{config.name.en}</span>
            <span className="text-muted-foreground text-sm font-normal">·</span>
            <span className="text-teal-100 text-sm font-bold">
              {config.taxName.en}
              {config.taxRate > 0 ? ` ${config.taxRate}%` : ""}
            </span>
          </h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Invoices default to {config.currency} and the local regulator regime.
          </p>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-card/60 border border-border hover:border-teal-500/40 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-left flex-wrap">
            <span className="text-muted-foreground">
              Operating in a different country?
            </span>
            <span className="text-foreground font-bold">
              {FLAGS[country]} {config.name.en}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden max-h-[60vh] overflow-y-auto">
            {allCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountry(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0",
                  c.code === country
                    ? "bg-teal-500/10 text-teal-100"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <span className="text-lg flex-shrink-0">{FLAGS[c.code]}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{c.name.en}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.taxName.en}
                    {c.taxRate > 0 ? ` ${c.taxRate}%` : ""}
                    {" · "}
                    {c.currency}
                  </div>
                </div>
                {c.code === country && (
                  <Check className="w-4 h-4 text-teal-300 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
