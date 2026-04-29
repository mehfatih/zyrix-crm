"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Sparkles, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserCountry } from "@/hooks/useUserCountry";
import { COUNTRIES, type CountryCode } from "@/lib/country";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────
// Sprint 14t — TaxPresetStrip
// Replaces the bright sky-50 "Quick Seed Preset Rates" strip that
// showed all 6 countries simultaneously. New design: single active
// country card (auto-detected from locale, overridable via localStorage)
// + dropdown to switch. Subtle amber gradient instead of light bg.
// ────────────────────────────────────────────────────────────────────

interface PresetMeta {
  countryCode: string;
  rateCount: number;
}

interface Props {
  /** Backend-supplied list of preset countries with rate counts. */
  presets: PresetMeta[];
  /** Country codes that already have at least one rate seeded. */
  seededCountries: Set<string>;
  /** Currently seeding country code, or null when idle. */
  seedingCountry: string | null;
  /** Called when the user clicks "Seed rates". */
  onSeed: (countryCode: string) => void;
}

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

export function TaxPresetStrip({
  presets,
  seededCountries,
  seedingCountry,
  onSeed,
}: Props) {
  const t = useTranslations("Tax");
  const { country, setCountry, config } = useUserCountry();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
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

  // Restrict the dropdown to countries we have preset data for.
  const presetCodes = new Set(presets.map((p) => p.countryCode));
  const dropdownCountries = (Object.values(COUNTRIES) as Array<
    (typeof COUNTRIES)[CountryCode]
  >).filter((c) => presetCodes.has(c.code));

  const activePreset = presets.find((p) => p.countryCode === country);
  const alreadySeeded = seededCountries.has(country);
  const isSeeding = seedingCountry === country;

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card p-5">
      <div className="flex items-start gap-4 mb-4 flex-wrap">
        <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
            {t("presets.title") ?? "QUICK SEED PRESET"}
          </p>
          <h3 className="text-foreground text-base font-bold flex items-center gap-2 flex-wrap">
            <span className="text-lg">{FLAGS[country]}</span>
            <span>{config.name.en}</span>
            <span className="text-muted-foreground text-sm font-normal">·</span>
            <span className="text-amber-200 text-sm font-bold">
              {config.taxName.en} {config.taxRate > 0 ? `${config.taxRate}%` : ""}
            </span>
          </h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            {activePreset
              ? `${activePreset.rateCount} preset rate${
                  activePreset.rateCount === 1 ? "" : "s"
                } available — click to seed.`
              : "No preset for this country yet — pick another from the dropdown."}
          </p>
        </div>

        <button
          onClick={() => onSeed(country)}
          disabled={isSeeding || alreadySeeded || !activePreset}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 flex-shrink-0",
            alreadySeeded
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 cursor-not-allowed"
              : isSeeding
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30 cursor-wait"
                : !activePreset
                  ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                  : "bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30",
          )}
        >
          {isSeeding && <Loader2 className="w-4 h-4 animate-spin" />}
          {alreadySeeded
            ? `✓ ${country} seeded`
            : isSeeding
              ? `Seeding ${country}…`
              : `Seed ${country} rates`}
        </button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-card/60 border border-border hover:border-amber-500/40 transition-colors"
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
            {dropdownCountries.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No preset data available
              </div>
            ) : (
              dropdownCountries.map((c) => {
                const preset = presets.find((p) => p.countryCode === c.code);
                const seeded = seededCountries.has(c.code);
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0",
                      c.code === country
                        ? "bg-amber-500/10 text-amber-200"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <span className="text-lg flex-shrink-0">
                      {FLAGS[c.code]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{c.name.en}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.taxName.en}
                        {c.taxRate > 0 ? ` ${c.taxRate}%` : ""}
                        {preset
                          ? ` · ${preset.rateCount} preset${
                              preset.rateCount === 1 ? "" : "s"
                            }`
                          : ""}
                        {" · "}
                        {c.currency}
                      </div>
                    </div>
                    {seeded && (
                      <span className="text-xs font-bold text-emerald-300 flex-shrink-0">
                        ✓ seeded
                      </span>
                    )}
                    {c.code === country && (
                      <Check className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
