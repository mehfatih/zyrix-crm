// ────────────────────────────────────────────────────────────────────
// Sprint 14z — Unified checkout URL builder
// Single source of truth for the checkout destination. Every Upgrade
// button across the app must use this helper — no hardcoded URLs.
// ────────────────────────────────────────────────────────────────────

import type { BillingPeriod, DisplayCurrency, PlanId } from "./currency";

export function buildCheckoutUrl(
  locale: string,
  plan: PlanId,
  billing: BillingPeriod = "monthly",
  currency?: DisplayCurrency,
): string {
  const params = new URLSearchParams({ plan, billing });
  if (currency) params.set("currency", currency);
  return `/${locale}/checkout?${params.toString()}`;
}
