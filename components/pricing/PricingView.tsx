"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import { CurrencySwitcher } from "@/components/billing/CurrencySwitcher";
import { PlanCatalogCard } from "@/components/billing/PlanCatalogCard";
import { PLAN_CATALOG_LIST } from "@/lib/billing/plan-catalog";

// ============================================================================
// PUBLIC PRICING VIEW — sprint 14af
// ----------------------------------------------------------------------------
// Plan content reads from PLAN_CATALOG (lib/billing/plan-catalog.ts) — single
// source of truth. Both this view and /settings/billing render from the same
// catalog so they never drift.
// ============================================================================

type Billing = "monthly" | "yearly";

export default function PricingView({ locale }: { locale: string }) {
  const t = useTranslations("Pricing");
  const tFaq = useTranslations("Pricing.faq");

  const [billing, setBilling] = useState<Billing>("monthly");
  const { currency } = useDisplayCurrency();

  const userLocale = (
    locale === "ar" || locale === "tr" ? locale : "en"
  ) as "en" | "ar" | "tr";

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
        {/* Currency switcher */}
        <CurrencySwitcher />

        {/* Billing toggle */}
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

  const faqSection = (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          {tFaq("title")}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <details
              key={n}
              className="group rounded-xl bg-card border border-border overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-semibold text-foreground hover:bg-sky-500/10 transition-colors">
                <span>{tFaq(`q${n}.q`)}</span>
                <span className="ltr:ml-3 rtl:mr-3 text-primary group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                {tFaq(`q${n}.a`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div>
      {heroSection}
      {controlsSection}
      {plansSection}
      {faqSection}
    </div>
  );
}
