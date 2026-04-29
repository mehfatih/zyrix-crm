// ────────────────────────────────────────────────────────────────────
// Sprint 14ah — Integration logos
// Renders under the "Plays well with the tools you already use" strip
// on /pricing. These are REAL integration partners — NOT customer
// logos. Honest framing: we integrate with these, we don't claim
// they're our customers.
//
// Adding a real SVG later is a 1-line edit: pass `svg: SomeIcon` and
// the strip will render the SVG instead of the text fallback.
// ────────────────────────────────────────────────────────────────────

import type { ComponentType } from "react";

export interface IntegrationLogo {
  name: string;
  /**
   * Optional SVG component. When not provided, the strip renders the
   * `name` as text in a uniform muted treatment so the layout is locked
   * in even before real brand SVGs are added.
   */
  svg?: ComponentType<{ className?: string }>;
}

export const INTEGRATION_LOGOS: ReadonlyArray<IntegrationLogo> = [
  { name: "Shopify" },
  { name: "WooCommerce" },
  { name: "WhatsApp" },
  { name: "Stripe" },
  { name: "Zapier" },
  { name: "Salla" },
  { name: "Zid" },
];
