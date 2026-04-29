// ────────────────────────────────────────────────────────────────────
// Sprint 14aa — Unified checkout URL builder
// Single source of truth for the checkout destination. Routing is
// encapsulated here so callers don't branch on plan id:
//   free       → /{locale}/signup?plan=free
//   enterprise → /{locale}/contact?plan=enterprise
//   paid       → /{locale}/checkout?plan=...&billing=...[&currency=...]
// ────────────────────────────────────────────────────────────────────

import type { BillingPeriod, DisplayCurrency, PlanId } from "./currency";

export function buildCheckoutUrl(
  locale: string,
  plan: PlanId,
  billing: BillingPeriod = "monthly",
  currency?: DisplayCurrency,
): string {
  if (plan === "free") {
    return `/${locale}/signup?plan=free`;
  }
  if (plan === "enterprise") {
    return `/${locale}/contact?plan=enterprise`;
  }
  const params = new URLSearchParams({ plan, billing });
  if (currency) params.set("currency", currency);
  return `/${locale}/checkout?${params.toString()}`;
}
