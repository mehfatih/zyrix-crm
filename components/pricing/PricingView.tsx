"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Mail, Minus } from "lucide-react";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import { CurrencySwitcher } from "@/components/billing/CurrencySwitcher";
import { PlanCatalogCard } from "@/components/billing/PlanCatalogCard";
import {
  PLAN_CATALOG,
  PLAN_CATALOG_LIST,
  getFeaturesByCategory,
  type PlanFeature,
  type PlanFeatureCategory,
} from "@/lib/billing/plan-catalog";
import { cn } from "@/lib/utils";

// ============================================================================
// PUBLIC PRICING VIEW — sprint 14ag
// ----------------------------------------------------------------------------
// Plan content reads from PLAN_CATALOG (lib/billing/plan-catalog.ts) — single
// source of truth (Sprint 14af). This sprint adds the comparison table and
// polishes the FAQ section.
// ============================================================================

type Billing = "monthly" | "yearly";
type Locale = "en" | "ar" | "tr";

const PLAN_ORDER: Array<keyof typeof PLAN_CATALOG> = [
  "free",
  "starter",
  "business",
  "enterprise",
];

const CATEGORY_ORDER: PlanFeatureCategory[] = [
  "core",
  "sales",
  "comms",
  "ai",
  "admin",
  "enterprise",
];

export default function PricingView({ locale }: { locale: string }) {
  const t = useTranslations("Pricing");
  const tFaq = useTranslations("Pricing.faq");

  const [billing, setBilling] = useState<Billing>("monthly");
  const { currency } = useDisplayCurrency();

  const userLocale: Locale =
    locale === "ar" || locale === "tr" ? locale : "en";

  const heroSection = (
    <section className="pt-12 pb-6 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {t("subtitle")}
      </p>
    </section>
  );

  const controlsSection = (
    <section className="px-4 pb-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <CurrencySwitcher />
        <div className="inline-flex rounded-full bg-card border border-sky-500/30 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-sky-500 text-white"
                : "text-foreground hover:bg-sky-500/10"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              billing === "yearly"
                ? "bg-sky-500 text-white"
                : "text-foreground hover:bg-sky-500/10"
            }`}
          >
            {t("yearly")}
            <span className="ltr:ml-1.5 rtl:mr-1.5 inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 text-[10px] font-semibold">
              {t("yearlySave")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );

  const plansSection = (
    <section className="px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLAN_CATALOG_LIST.map((entry) => (
            <PlanCatalogCard
              key={entry.id}
              entry={entry}
              locale={userLocale}
              billing={billing}
              currency={currency}
              variant="marketing"
            />
          ))}
        </div>
      </div>
    </section>
  );

  // ──────────────────────────────────────────────────────────────────
  // Comparison table — sprint 14ag
  // ──────────────────────────────────────────────────────────────────
  const comparisonSection = (
    <section
      id="comparison"
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 py-16"
    >
      <div className="text-center mb-10">
        <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
          {t("comparison.eyebrow")}
        </p>
        <h2 className="text-foreground text-3xl md:text-4xl font-bold">
          {t("comparison.title")}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          {t("comparison.subtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/95 backdrop-blur z-10">
              <tr className="border-b border-border">
                <th className="text-start text-xs font-bold uppercase text-muted-foreground tracking-wider px-6 py-4 w-1/3 min-w-[240px]">
                  {t("comparison.featureColumn")}
                </th>
                {PLAN_ORDER.map((planId) => {
                  const plan = PLAN_CATALOG[planId];
                  const isRecommended = plan.recommended;
                  return (
                    <th
                      key={planId}
                      className={cn(
                        "text-center px-4 py-4 min-w-[140px]",
                        isRecommended && "bg-violet-500/8",
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            isRecommended
                              ? "text-violet-200"
                              : "text-foreground",
                          )}
                        >
                          {plan.name[userLocale]}
                        </span>
                        {isRecommended && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-violet-300">
                            {t("mostPopular")}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {CATEGORY_ORDER.map((category) => {
                const featuresInCategory = getFeaturesByCategory(category);
                if (featuresInCategory.length === 0) return null;

                return (
                  <Fragment key={category}>
                    <tr className="bg-card/60 border-y border-border">
                      <td colSpan={5} className="px-6 py-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                          {t(`comparison.categories.${category}`)}
                        </span>
                      </td>
                    </tr>
                    {featuresInCategory.map((feature) => (
                      <tr
                        key={feature.id}
                        className="border-b border-border/40 hover:bg-card/30 transition-colors"
                      >
                        <td className="text-start text-sm text-foreground/90 px-6 py-3">
                          {feature.label[userLocale]}
                        </td>
                        {PLAN_ORDER.map((planId) => {
                          const value = feature.availability[planId];
                          const plan = PLAN_CATALOG[planId];
                          const isRecommended = plan.recommended;
                          return (
                            <td
                              key={planId}
                              className={cn(
                                "text-center px-4 py-3",
                                isRecommended && "bg-violet-500/4",
                              )}
                            >
                              <ComparisonCell
                                value={value}
                                locale={userLocale}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className="text-center mt-10">
        <p className="text-muted-foreground text-sm mb-4">
          {t("comparison.bottomCtaText")}
        </p>
        <div className="inline-flex items-center gap-3 flex-wrap justify-center">
          <a
            href="#faq"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-semibold"
          >
            {t("comparison.viewFaq")}
          </a>
          <a
            href={`/${locale}/contact?plan=enterprise`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-semibold"
          >
            {t("comparison.contactSales")}
          </a>
        </div>
      </div>
    </section>
  );

  // ──────────────────────────────────────────────────────────────────
  // FAQ — sprint 14ag (redesigned)
  // ──────────────────────────────────────────────────────────────────
  const faqSection = (
    <section
      id="faq"
      className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-16"
    >
      <div className="text-center mb-10">
        <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
          {t("faq.eyebrow")}
        </p>
        <h2 className="text-foreground text-3xl md:text-4xl font-bold">
          {tFaq("title")}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <details
            key={n}
            className="group rounded-xl border border-border bg-card hover:border-border/70 transition-colors overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
              <span className="text-foreground font-semibold text-base">
                {tFaq(`q${n}.q`)}
              </span>
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/40 pt-4">
              {tFaq(`q${n}.a`)}
            </div>
          </details>
        ))}
      </div>

      {/* Still have questions? Bottom contact strip */}
      <div className="mt-12 rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-fuchsia-500/8 p-8 text-center">
        <h3 className="text-foreground text-xl font-bold mb-2">
          {t("faq.stillQuestionsTitle")}
        </h3>
        <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
          {t("faq.stillQuestionsSubtitle")}
        </p>
        <a
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-semibold text-sm"
        >
          <Mail className="w-4 h-4" />
          {t("faq.contactSalesButton")}
        </a>
      </div>
    </section>
  );

  return (
    <div>
      {heroSection}
      {controlsSection}
      {plansSection}
      {comparisonSection}
      {faqSection}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// ComparisonCell — three visual states
// ──────────────────────────────────────────────────────────────────
function ComparisonCell({
  value,
  locale,
}: {
  value: PlanFeature["availability"][keyof PlanFeature["availability"]];
  locale: Locale;
}) {
  if (value === null || value === false) {
    return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  }
  if (value === true) {
    return <Check className="w-5 h-5 text-emerald-400 mx-auto" />;
  }
  return (
    <span className="text-sm font-medium text-foreground tabular-nums">
      {value[locale]}
    </span>
  );
}

