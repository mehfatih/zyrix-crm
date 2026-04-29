// ────────────────────────────────────────────────────────────────────
// Sprint 14t — Locale ↔ country/currency glue.
// Thin wrapper on top of lib/country.ts. Adds:
//   - getCountryFromLocale: maps next-intl locale → CountryCode default
//   - formatMoney: prefix/suffix-aware currency formatting
//
// The single source of truth for country / currency / tax data remains
// lib/country.ts (COUNTRIES). This module is pure helpers and does NOT
// duplicate that registry.
// ────────────────────────────────────────────────────────────────────

import { COUNTRIES, type CountryCode } from "@/lib/country";

// Locales whose currency symbol comes AFTER the number ("100 ₺" not "₺100").
// All MENA Arabic-script currencies and the Turkish lira follow this convention.
const SUFFIX_CURRENCIES = new Set([
  "TRY",
  "SAR",
  "AED",
  "EGP",
  "IQD",
  "KWD",
  "QAR",
  "BHD",
  "OMR",
  "JOD",
  "LBP",
]);

// Map next-intl locale → CountryCode default. Used when the user has no
// localStorage override and no IP geo result yet. Per Sprint 14t spec:
//   en → US (Anglo default)
//   ar → SA (largest Arabic-speaking market)
//   tr → TR (Türkiye)
const LOCALE_TO_COUNTRY: Record<string, CountryCode> = {
  en: "US",
  ar: "SA",
  tr: "TR",
};

export function getCountryFromLocale(locale: string): CountryCode {
  return LOCALE_TO_COUNTRY[locale] ?? "SA";
}

/**
 * Format a money value using the country's currency symbol and standard
 * positioning (prefix for $/€/£, suffix for ₺/﷼/د.إ etc.).
 *
 * Uses Intl.NumberFormat for the number itself so 1234.5 → "1,234.5"
 * regardless of UI locale. The symbol is appended/prepended manually
 * (Intl currency formatting picks symbol position based on the number-
 * format locale, not the currency, which we don't want here).
 */
export function formatMoney(value: number, country: CountryCode): string {
  const c = COUNTRIES[country];
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  const isSuffix = SUFFIX_CURRENCIES.has(c.currency);
  return isSuffix
    ? `${formatted} ${c.currencySymbol}`
    : `${c.currencySymbol}${formatted}`;
}

export { COUNTRIES, type CountryCode };
