"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { fetchPublicPlans, type AdminPlan } from "@/lib/api/admin";
import { Check, Loader2, Star } from "lucide-react";

// ============================================================================
// PUBLIC PRICING VIEW
// ----------------------------------------------------------------------------
// Currency is derived from the visitor's *country* (IP-detected for logged-out
// users), NOT the URL language. So an Arabic speaker in Türkiye visiting /ar
// still sees TRY. Users can override with the currency dropdown, which is
// completely separate from the header language switcher.
// ============================================================================

type Currency = "USD" | "TRY" | "SAR";
type Billing = "monthly" | "yearly";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  TRY: "₺",
  SAR: "﷼",
};

// Available plan prices only exist in USD/TRY/SAR — map the 11 supported
// countries onto the closest available billing currency.
const COUNTRY_TO_PLAN_CURRENCY: Record<string, Currency> = {
  TR: "TRY",
  SA: "SAR",
  AE: "SAR",
  EG: "SAR",
  IQ: "SAR",
  KW: "SAR",
  QA: "SAR",
  BH: "SAR",
  OM: "SAR",
  JO: "SAR",
  LB: "SAR",
};

export default function PricingView({ locale }: { locale: string }) {
  const t = useTranslations("Pricing");
  const tFeat = useTranslations("Pricing.features");
  const tLimits = useTranslations("Pricing.limits");
  const tFaq = useTranslations("Pricing.faq");

  const [plans, setPlans] = useState<AdminPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to USD until geo resolves — never derive from `locale`.
  const [currency, setCurrency] = useState<Currency>("USD");
  const [currencyTouched, setCurrencyTouched] = useState(false);
  const [billing, setBilling] = useState<Billing>("monthly");

  useEffect(() => {
    fetchPublicPlans()
      .then((res) => setPlans(res))
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IP-based country detection -> currency default.
  // Respects user override: if they touch the currency dropdown, we stop
  // overwriting it on re-detection.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo", { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { country?: string } | null) => {
        if (cancelled || !data?.country) return;
        const mapped = COUNTRY_TO_PLAN_CURRENCY[data.country.toUpperCase()];
        if (mapped && !currencyTouched) setCurrency(mapped);
      })
      .catch(() => {
        /* stay on USD */
      });
    return () => {
      cancelled = true;
    };
  }, [currencyTouched]);

  const handleCurrencyChange = (c: Currency) => {
    setCurrencyTouched(true);
    setCurrency(c);
  };

  function priceFor(p: AdminPlan): number {
    const key = (
      billing === "monthly"
        ? `priceMonthly${currency[0] + currency.slice(1).toLowerCase()}`
        : `priceYearly${currency[0] + currency.slice(1).toLowerCase()}`
    ) as keyof AdminPlan;
    const v = p[key];
    return typeof v === "string" ? parseFloat(v) : (v as number);
  }

  function localizedName(p: AdminPlan) {
    if (locale === "ar") return p.nameAr || p.name;
    if (locale === "tr") return p.nameTr || p.name;
    return p.name;
  }

  function localizedDesc(p: AdminPlan) {
    if (locale === "ar") return p.descriptionAr || p.description || "";
    if (locale === "tr") return p.descriptionTr || p.description || "";
    return p.description || "";
  }

  const heroSection = (
    <section className="pt-12 pb-6 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
        {t("subtitle")}
      </p>
    </section>
  );

  const controlsSection = (
    <section className="px-4 pb-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Billing toggle */}
        <div className="inline-flex rounded-full bg-white border border-cyan-200 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-cyan-600 text-white"
                : "text-slate-700 hover:bg-sky-50"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              billing === "yearly"
                ? "bg-cyan-600 text-white"
                : "text-slate-700 hover:bg-sky-50"
            }`}
          >
            {t("yearly")}
            <span className="ltr:ml-1.5 rtl:mr-1.5 inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold">
              {t("yearlySave")}
            </span>
          </button>
        </div>

        {/* Currency — independent of header language switcher */}
        <div
          className="inline-flex rounded-full bg-white border border-cyan-200 p-1"
          aria-label="Billing currency"
        >
          {(["USD", "TRY", "SAR"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currency === c
                  ? "bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-sky-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const plansSection = (
    <section className="px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-cyan-600" size={28} />
          </div>
        )}
        {error && !loading && (
          <div className="max-w-md mx-auto rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 text-center">
            {error}
          </div>
        )}
        {plans && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                price={priceFor(p)}
                currency={currency}
                billing={billing}
                name={localizedName(p)}
                description={localizedDesc(p)}
                locale={locale}
                tFeat={tFeat}
                tLimits={tLimits}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const faqSection = (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          {tFaq("title")}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <details
              key={n}
              className="group rounded-xl bg-white border border-cyan-100 overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-semibold text-slate-900 hover:bg-sky-50 transition-colors">
                <span>{tFaq(`q${n}`)}</span>
                <span className="ltr:ml-3 rtl:mr-3 text-cyan-600 group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                {tFaq(`a${n}`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      {heroSection}
      {controlsSection}
      {plansSection}
      {faqSection}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Plan Card
// ─────────────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  price,
  currency,
  billing,
  name,
  description,
  locale,
  tFeat,
  tLimits,
  t,
}: {
  plan: AdminPlan;
  price: number;
  currency: Currency;
  billing: Billing;
  name: string;
  description: string;
  locale: string;
  tFeat: ReturnType<typeof useTranslations>;
  tLimits: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}) {
  const isEnterprise = plan.slug === "enterprise";
  const isFree = plan.slug === "free";
  const featured = plan.isFeatured;

  const signupHref = `/${locale}/signup?plan=${plan.slug}`;
  const contactHref = `/${locale}/contact?plan=enterprise`;
  const checkoutHref = `/${locale}/checkout?plan=${plan.slug}&billing=${billing}&currency=${currency}`;

  // Which URL does the CTA point to?
  const ctaHref = isEnterprise
    ? contactHref
    : isFree
      ? signupHref
      : checkoutHref;

  // Top features to display prominently (from full list)
  const visibleFeatures = useMemo(() => {
    return plan.features.slice(0, 8);
  }, [plan.features]);

  return (
    <div
      className={`relative rounded-2xl bg-white p-6 flex flex-col ${
        featured
          ? "border-2 border-cyan-500 shadow-xl shadow-cyan-900/10"
          : "border border-cyan-100"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-cyan-600 text-white px-3 py-1 text-xs font-semibold">
          <Star size={12} />
          {t("mostPopular")}
        </div>
      )}

      {/* Name + desc */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: plan.color }}
          />
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600 min-h-[2.5rem]">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-5">
        {isEnterprise ? (
          <div>
            <div className="text-3xl font-bold text-slate-900">
              {t("customPrice")}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t("contactSales")}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">
                {CURRENCY_SYMBOL[currency]}
                {price.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">
                /{billing === "monthly" ? t("month") : t("year")}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t("perCompany")}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors mb-6 ${
          featured
            ? "bg-cyan-600 hover:bg-cyan-700 text-white"
            : isFree
            ? "bg-slate-900 hover:bg-slate-800 text-white"
            : "bg-sky-50 hover:bg-sky-100 text-cyan-700 border border-cyan-200"
        }`}
      >
        {isEnterprise ? t("contactSales") : t("getStarted")}
      </Link>

      {/* Limits summary */}
      <div className="space-y-2 text-sm mb-5 pb-5 border-b border-slate-100">
        <LimitRow
          label={tLimits("users")}
          value={plan.maxUsers >= 999999 ? tLimits("unlimited") : plan.maxUsers.toLocaleString()}
        />
        <LimitRow
          label={tLimits("customers")}
          value={
            plan.maxCustomers >= 999999
              ? tLimits("unlimited")
              : plan.maxCustomers.toLocaleString()
          }
        />
        <LimitRow
          label={tLimits("storage")}
          value={
            plan.maxStorageGb >= 9999
              ? tLimits("unlimited")
              : plan.maxStorageGb.toLocaleString()
          }
        />
        {plan.maxWhatsappMsg > 0 && (
          <LimitRow
            label={tLimits("whatsapp")}
            value={
              plan.maxWhatsappMsg >= 999999
                ? tLimits("unlimited")
                : plan.maxWhatsappMsg.toLocaleString()
            }
          />
        )}
      </div>

      {/* Features list */}
      <div className="flex-1">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
          {t("includes")}
        </div>
        <ul className="space-y-2">
          {visibleFeatures.map((slug) => (
            <li key={slug} className="flex items-start gap-2 text-sm">
              <Check
                size={14}
                className="text-cyan-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-slate-700">{safeTrans(tFeat, slug)}</span>
            </li>
          ))}
          {plan.features.length > visibleFeatures.length && (
            <li className="text-xs text-slate-500 italic ltr:pl-6 rtl:pr-6">
              + {plan.features.length - visibleFeatures.length} more
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function safeTrans(
  t: ReturnType<typeof useTranslations>,
  key: string
): string {
  try {
    return t(key);
  } catch {
    return key;
  }
}
