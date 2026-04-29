"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildCheckoutUrl } from "@/lib/billing/checkout-url";
import {
  isContactSalesPlan,
  PLAN_PRICES_USD,
  type BillingPeriod,
  type DisplayCurrency,
} from "@/lib/billing/currency";
import type {
  PlanAccentColor,
  PlanCatalogEntry,
} from "@/lib/billing/plan-catalog";
import { PlanPriceTag } from "@/components/billing/PlanPriceTag";

// ────────────────────────────────────────────────────────────────────
// Sprint 14af — PlanCatalogCard
// Shared plan card consumed by /pricing (marketing) and
// /settings/billing (in-app). Reads from PLAN_CATALOG and
// PLAN_PRICES_USD; both pages get identical structure so visitors
// see the same data wherever they look at plans.
// ────────────────────────────────────────────────────────────────────

interface AccentClasses {
  cardBorder: string;
  cardHover: string;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
  ctaBg: string;
  ctaHover: string;
  ctaText: string;
  ctaBorder: string;
  checkText: string;
  highlightText: string;
}

const ACCENT_CLASSES: Record<PlanAccentColor, AccentClasses> = {
  sky: {
    cardBorder: "border-border",
    cardHover: "hover:border-sky-500/40",
    iconBg: "bg-sky-500/15",
    iconBorder: "border-sky-500/40",
    iconText: "text-sky-300",
    badgeBg: "bg-sky-500",
    badgeText: "text-white",
    ctaBg: "bg-card",
    ctaHover: "hover:bg-muted",
    ctaText: "text-foreground",
    ctaBorder: "border border-border",
    checkText: "text-sky-300",
    highlightText: "text-sky-100",
  },
  cyan: {
    cardBorder: "border-border",
    cardHover: "hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/15",
    iconBorder: "border-cyan-500/40",
    iconText: "text-cyan-300",
    badgeBg: "bg-cyan-500",
    badgeText: "text-white",
    ctaBg: "bg-cyan-500/15",
    ctaHover: "hover:bg-cyan-500/25",
    ctaText: "text-cyan-100",
    ctaBorder: "border border-cyan-500/40",
    checkText: "text-cyan-300",
    highlightText: "text-cyan-100",
  },
  violet: {
    cardBorder: "border-violet-500/40",
    cardHover: "hover:border-violet-500/60",
    iconBg: "bg-violet-500/15",
    iconBorder: "border-violet-500/40",
    iconText: "text-violet-300",
    badgeBg: "bg-violet-500",
    badgeText: "text-white",
    ctaBg: "bg-violet-500",
    ctaHover: "hover:bg-violet-600",
    ctaText: "text-white",
    ctaBorder: "border border-violet-500",
    checkText: "text-violet-300",
    highlightText: "text-violet-100",
  },
  amber: {
    cardBorder: "border-border",
    cardHover: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/15",
    iconBorder: "border-amber-500/40",
    iconText: "text-amber-300",
    badgeBg: "bg-amber-500",
    badgeText: "text-white",
    ctaBg: "bg-amber-500/15",
    ctaHover: "hover:bg-amber-500/25",
    ctaText: "text-amber-100",
    ctaBorder: "border border-amber-500/40",
    checkText: "text-amber-300",
    highlightText: "text-amber-100",
  },
};

interface Props {
  entry: PlanCatalogEntry;
  locale: "en" | "ar" | "tr";
  billing: BillingPeriod;
  currency: DisplayCurrency;
  /**
   * - "marketing" (/pricing): shows "See all features" link, no current-plan logic
   * - "billing" (/settings/billing): hides "See all features", optional current-plan + canManage
   */
  variant: "marketing" | "billing";
  isCurrent?: boolean;
  canManage?: boolean;
}

export function PlanCatalogCard({
  entry,
  locale,
  billing,
  currency,
  variant,
  isCurrent = false,
  canManage = true,
}: Props) {
  const t = useTranslations("Pricing");
  const tBilling = useTranslations("billing");
  const Icon = entry.icon;
  const a = ACCENT_CLASSES[entry.accentColor];
  const isContactSales = isContactSalesPlan(entry.id);
  const isFree = entry.id === "free";

  const usdAmount = isContactSales
    ? null
    : PLAN_PRICES_USD[entry.id][billing];

  const ctaHref = buildCheckoutUrl(locale, entry.id, billing, currency);

  // Decide which CTA to render.
  const showCurrentPlan = variant === "billing" && isCurrent;
  const showCtaDisabled =
    variant === "billing" && !canManage && !isCurrent;

  return (
    <div
      className={`relative rounded-2xl border ${a.cardBorder} ${a.cardHover} bg-card p-6 flex flex-col transition-colors ${
        entry.recommended ? "shadow-xl shadow-violet-900/10" : ""
      }`}
    >
      {/* Recommended badge */}
      {entry.recommended && entry.badge && (
        <div
          className={`absolute -top-3 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full ${a.badgeBg} ${a.badgeText} px-3 py-1 text-xs font-semibold whitespace-nowrap`}
        >
          <Star size={12} />
          {entry.badge[locale]}
        </div>
      )}

      {/* Icon tile */}
      <div
        className={`w-11 h-11 rounded-xl border ${a.iconBg} ${a.iconBorder} ${a.iconText} flex items-center justify-center mb-4`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Name + tagline */}
      <h3 className="text-2xl font-bold text-foreground">
        {entry.name[locale]}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground min-h-[2.5rem]">
        {entry.tagline[locale]}
      </p>

      {/* Price */}
      <div className="mt-5">
        {isContactSales ? (
          <div>
            <div className="text-3xl font-bold text-foreground">
              {t("customPrice")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("contactForQuote")}
            </div>
          </div>
        ) : (
          <div>
            <PlanPriceTag
              usdAmount={usdAmount ?? 0}
              currency={currency}
              period={billing}
              size="lg"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {t("perCompany")}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-5">
        {showCurrentPlan ? (
          <button
            disabled
            className="w-full text-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-muted text-muted-foreground cursor-not-allowed"
          >
            {tBilling("currentPlan")}
          </button>
        ) : showCtaDisabled ? (
          <button
            disabled
            className="w-full text-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          >
            {entry.cta.label[locale]}
          </button>
        ) : (
          <Link
            href={ctaHref}
            className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${a.ctaBg} ${a.ctaHover} ${a.ctaText} ${a.ctaBorder}`}
          >
            {entry.cta.label[locale]}
          </Link>
        )}
      </div>

      {/* Quota strip */}
      <div className="mt-6 pt-5 border-t border-border space-y-2.5">
        <QuotaRow
          label={t("quotas.users")}
          value={entry.quotas.users[locale]}
        />
        <QuotaRow
          label={t("quotas.contacts")}
          value={entry.quotas.contacts[locale]}
        />
        <QuotaRow
          label={t("quotas.storage")}
          value={entry.quotas.storage[locale]}
        />
        <QuotaRow
          label={t("quotas.whatsapp")}
          value={entry.quotas.whatsapp[locale]}
        />
      </div>

      {/* What's included */}
      <div className="mt-6 pt-5 border-t border-border flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          {t("whatsIncluded")}
        </p>
        <ul className="space-y-2.5">
          {entry.highlights.map((h, idx) => {
            const isUpgradeAnchor =
              !isFree &&
              idx === 0 &&
              h.en.toLowerCase().startsWith("everything in");
            return (
              <li
                key={idx}
                className={`flex items-start gap-2.5 text-sm ${
                  isUpgradeAnchor
                    ? `font-semibold ${a.highlightText}`
                    : "text-foreground/90"
                }`}
              >
                <Check
                  className={`w-4 h-4 ${a.checkText} flex-shrink-0 mt-0.5`}
                />
                <span>{h[locale]}</span>
              </li>
            );
          })}
        </ul>

        {/* See all features (marketing only) */}
        {variant === "marketing" && (
          <a
            // TODO sprint 14ag — wire to comparison table anchor
            href="#feature-comparison"
            className={`inline-flex items-center gap-1 text-xs font-semibold mt-4 ${a.checkText} hover:underline`}
          >
            {t("seeAllFeatures")} →
          </a>
        )}
      </div>
    </div>
  );
}

function QuotaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}
