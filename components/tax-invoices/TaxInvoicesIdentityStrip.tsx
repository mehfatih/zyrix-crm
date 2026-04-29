"use client";

import { Globe2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useUserCountry } from "@/hooks/useUserCountry";
import { COUNTRIES, type CountryCode } from "@/lib/country";

// ────────────────────────────────────────────────────────────────────
// Sprint 14v — TaxInvoicesIdentityStrip
// Single locale-aware identity card on /tax-invoices replacing the old
// multi-country regime filter pills. Shows only the e-invoice system
// for the user's resolved country (locale → localStorage override).
// Native <select> lets the merchant override jurisdiction.
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

export function TaxInvoicesIdentityStrip() {
  const locale = useLocale() as "en" | "ar" | "tr";
  const { country, setCountry, config } = useUserCountry();

  const switchLabel =
    locale === "ar"
      ? "تبديل الاختصاص"
      : locale === "tr"
        ? "Yetki alanını değiştir"
        : "Switch jurisdiction";

  const eyebrow =
    locale === "ar"
      ? "نظام الفواتير الإلكترونية النشط"
      : locale === "tr"
        ? "AKTİF E-FATURA SİSTEMİ"
        : "ACTIVE E-INVOICE SYSTEM";

  const standardLabel =
    locale === "ar"
      ? "القياسي"
      : locale === "tr"
        ? "Standart"
        : "Standard";

  return (
    <div className="rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-500/15 via-teal-500/10 to-cyan-500/10 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-teal-500/40 bg-teal-500/15 text-2xl flex-shrink-0">
            {FLAGS[country]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-300">
              {eyebrow}
            </span>
            <span className="text-lg font-bold text-foreground">
              {config.eInvoiceSystem.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {config.name[locale]} · {standardLabel} {config.taxRate}%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="ti-jurisdiction"
            className="text-xs text-muted-foreground"
          >
            {switchLabel}
          </label>
          <div className="relative">
            <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300 pointer-events-none" />
            <select
              id="ti-jurisdiction"
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryCode)}
              className="appearance-none rounded-lg border border-border bg-card py-2 pl-9 pr-8 text-sm text-foreground focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
            >
              {(Object.entries(COUNTRIES) as [CountryCode, typeof COUNTRIES[CountryCode]][]).map(
                ([code, cfg]) => (
                  <option key={code} value={code}>
                    {FLAGS[code]} {cfg.name[locale]} — {cfg.eInvoiceSystem.shortLabel}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
