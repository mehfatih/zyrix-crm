# Marketing Content Placeholders

This file tracks marketing content on `/pricing` (and adjacent surfaces) that
contains placeholder values. Replace these when real data becomes available.

Sprint 14ah added the trust strip, integration logos, testimonials, and final
CTA sections — the visual layout is locked in and the data swap is a one-line
edit per item.

---

## 1. Trust strip — `messages/{en,ar,tr}.json` under `Pricing.trust.*`

The trust strip below the hero on `/pricing` shows 4 stats. Some values are real,
others are conservative placeholders.

| Key                              | Current value | Real? | Notes                                                                 |
|----------------------------------|---------------|-------|-----------------------------------------------------------------------|
| `Pricing.trust.businesses.value` | `50+`         | ❌ NO | Conservative placeholder — update with real merchant count.           |
| `Pricing.trust.countries.value`  | `7`           | ✅ YES | Matches `COUNTRY_TO_CURRENCY` in `lib/billing/currency.ts` (SA/AE/QA/KW/EG/TR/US). |
| `Pricing.trust.messages.value`   | `100K+`       | ❌ NO | Conservative placeholder — update with real WhatsApp message volume. |
| `Pricing.trust.uptime.value`     | `99.9%`       | ✅ YES | Matches the `audit_advanced` feature SLA claim and Enterprise plan promise. |

**To update:** edit the value strings in all three message files (`en.json`, `ar.json`,
`tr.json`). The labels (e.g. `Pricing.trust.businesses.label`) don't usually need
to change — only the numeric `value` fields.

---

## 2. Testimonials — `lib/marketing/testimonials.ts`

| ID              | Status      | Notes                                                              |
|-----------------|-------------|--------------------------------------------------------------------|
| `founder`       | ✅ REAL      | Mehmet's founder note — keep as-is. Translations are natural, not literal. |
| `placeholder-1` | ❌ PLACEHOLDER | Card invites visitors to be the next testimonial. Replace with first real customer. |
| `placeholder-2` | ❌ PLACEHOLDER | Card invites visitors to be the next testimonial. Replace with second real customer. |

**To update:** open `lib/marketing/testimonials.ts` and edit the two objects with
`id: "placeholder-1"` and `id: "placeholder-2"` in place. Replace `name`, `initials`,
`role` (trilingual), and `quote` (trilingual). Set `isFounder: false`. Layout stays
identical.

**Honesty note:** `Levana Cosmetics` is the founder's own company and **must not** be
used as a customer testimonial.

---

## 3. Integration logos — `lib/marketing/integration-logos.ts`

The strip on `/pricing` uses the framing **"Plays well with the tools you already
use"** — these are real integration partners (Shopify, WooCommerce, WhatsApp,
Stripe, Zapier, Salla, Zid), not customer logos.

This content is **honest and does NOT need replacement**.

If you later want a separate "Trusted by these customers" logo strip with real
customer brands, **add a new section** rather than overwriting the integration
strip. Keep the two semantically distinct.

To upgrade text-only logos to real SVGs:
1. Drop the SVG component into the project (e.g. `components/marketing/logos/ShopifyLogo.tsx`).
2. Edit the matching entry in `INTEGRATION_LOGOS`:
   ```ts
   { name: "Shopify", svg: ShopifyLogo },
   ```
3. The strip renders the SVG when `svg` is set, falling back to text otherwise.

---

## 4. Final CTA strip — `messages/{en,ar,tr}.json` under `Pricing.finalCta.*`

The "30-day money-back guarantee" / "No credit card to start" / "Cancel anytime"
guarantees are **policy claims**. Verify each is actually offered before launch:

| Key                           | Claim                          | Verify? |
|-------------------------------|--------------------------------|---------|
| `Pricing.finalCta.guarantee1` | 30-day money-back guarantee    | ✅ Matches FAQ.q4 |
| `Pricing.finalCta.guarantee2` | No credit card to start        | ✅ Free plan requires no card |
| `Pricing.finalCta.guarantee3` | Cancel anytime                 | ✅ Matches FAQ.q6 |

If any policy changes, update the matching key in all three locales AND the
corresponding FAQ answer.
