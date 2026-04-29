// ────────────────────────────────────────────────────────────────────
// Sprint 14z — Global currency engine
// USD as canonical price source. Manual FX rates updated periodically
// by ops (NOT live FX). Display currency resolved per user via
// COUNTRY_TO_CURRENCY ← useUserCountry (Sprint 14t).
// Last FX review: 2026-04-29.
// ────────────────────────────────────────────────────────────────────

import type { CountryCode } from "@/lib/country";

export type PlanId = "free" | "starter" | "business" | "enterprise";

export type DisplayCurrency =
  | "USD"
  | "SAR"
  | "AED"
  | "QAR"
  | "KWD"
  | "EGP"
  | "TRY";

export type BillingPeriod = "monthly" | "yearly";

// Sprint 14aa — null prices indicate a contact-sales tier (no fixed price).
export const PLAN_PRICES_USD: Record<
  PlanId,
  { monthly: number | null; yearly: number | null }
> = {
  free: { monthly: 0, yearly: 0 },
  starter: { monthly: 19, yearly: 182 },
  business: { monthly: 49, yearly: 470 },
  enterprise: { monthly: null, yearly: null },
};

export function isContactSalesPlan(plan: PlanId): boolean {
  const p = PLAN_PRICES_USD[plan];
  return p.monthly === null && p.yearly === null;
}

export const FX_RATES: Record<DisplayCurrency, number> = {
  USD: 1,
  SAR: 3.75,
  AED: 3.67,
  QAR: 3.64,
  KWD: 0.31,
  EGP: 49.5,
  TRY: 38.5,
};

export const COUNTRY_TO_CURRENCY: Partial<Record<CountryCode, DisplayCurrency>> = {
  SA: "SAR",
  AE: "AED",
  QA: "QAR",
  KW: "KWD",
  EG: "EGP",
  TR: "TRY",
  US: "USD",
  // Unmapped MENA countries fall back to USD via the resolver.
};

export interface CurrencyDisplayConfig {
  symbol: string;
  intlLocale: string;
  rounding: "integer" | "cents" | "nearest5";
  // Position relative to the number for display: prefix ($100) vs suffix (100 ₺).
  position: "prefix" | "suffix";
}

export const CURRENCY_CONFIG: Record<DisplayCurrency, CurrencyDisplayConfig> = {
  USD: { symbol: "$", intlLocale: "en-US", rounding: "cents", position: "prefix" },
  SAR: { symbol: "SAR", intlLocale: "en-US", rounding: "integer", position: "suffix" },
  AED: { symbol: "AED", intlLocale: "en-US", rounding: "integer", position: "suffix" },
  QAR: { symbol: "QAR", intlLocale: "en-US", rounding: "integer", position: "suffix" },
  KWD: { symbol: "KWD", intlLocale: "en-US", rounding: "cents", position: "suffix" },
  EGP: { symbol: "EGP", intlLocale: "en-US", rounding: "integer", position: "suffix" },
  TRY: { symbol: "₺", intlLocale: "en-US", rounding: "integer", position: "suffix" },
};

export const SUPPORTED_CURRENCIES: DisplayCurrency[] = [
  "USD",
  "SAR",
  "AED",
  "QAR",
  "KWD",
  "EGP",
  "TRY",
];

export function isDisplayCurrency(value: string): value is DisplayCurrency {
  return value in CURRENCY_CONFIG;
}

export function isPlanId(value: string): value is PlanId {
  return value in PLAN_PRICES_USD;
}

export function convertPrice(usdAmount: number, currency: DisplayCurrency): number {
  const raw = usdAmount * FX_RATES[currency];
  const cfg = CURRENCY_CONFIG[currency];
  switch (cfg.rounding) {
    case "integer":
      return Math.round(raw);
    case "cents":
      return Math.round(raw * 100) / 100;
    case "nearest5":
      return Math.round(raw / 5) * 5;
  }
}

/**
 * Format a USD price into the visitor's display currency.
 * Sprint 14aa — accepts null (contact-sales tier). When null, returns
 * "—"; the caller is responsible for rendering the localized "Custom"
 * label or a custom block.
 */
export function formatPlanPrice(
  usdAmount: number | null,
  currency: DisplayCurrency,
): string {
  if (usdAmount === null) return "—";
  const converted = convertPrice(usdAmount, currency);
  const cfg = CURRENCY_CONFIG[currency];
  const intl = new Intl.NumberFormat(cfg.intlLocale, {
    minimumFractionDigits: cfg.rounding === "integer" ? 0 : 2,
    maximumFractionDigits: cfg.rounding === "integer" ? 0 : 2,
  });
  const formatted = intl.format(converted);
  return cfg.position === "prefix"
    ? `${cfg.symbol}${formatted}`
    : `${formatted} ${cfg.symbol}`;
}

// Resolve the auto-detected currency for a country; USD when unmapped.
export function currencyForCountry(country: CountryCode): DisplayCurrency {
  return COUNTRY_TO_CURRENCY[country] ?? "USD";
}
