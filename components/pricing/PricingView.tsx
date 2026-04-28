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

// Static fallback used when the public plans API is unreachable
// (e.g., on Vercel preview before backend is deployed). Shape matches AdminPlan.
const STATIC_PLANS: AdminPlan[] = [
  {
    id: "static-free",
    slug: "free",
    name: "Free",
    nameAr: "مجاني",
    nameTr: "Ücretsiz",
    description: "For small teams getting started",
    descriptionAr: "للفرق الصغيرة التي تبدأ",
    descriptionTr: "Yeni başlayan küçük ekipler için",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    priceMonthlyTry: 0,
    priceYearlyTry: 0,
    priceMonthlySar: 0,
    priceYearlySar: 0,
    maxUsers: 3,
    maxCustomers: 100,
    maxDeals: 50,
    maxStorageGb: 1,
    maxWhatsappMsg: 100,
    maxAiTokens: 10000,
    features: ["3 users", "100 contacts", "1 GB storage", "100 WhatsApp msgs/mo"],
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    color: "#22d3ee",
  },
  {
    id: "static-starter",
    slug: "starter",
    name: "Starter",
    nameAr: "المبتدئ",
    nameTr: "Başlangıç",
    description: "For growing teams that need more",
    descriptionAr: "للفرق النامية التي تحتاج إلى المزيد",
    descriptionTr: "Daha fazlasına ihtiyaç duyan büyüyen ekipler için",
    priceMonthlyUsd: 19,
    priceYearlyUsd: 190,
    priceMonthlyTry: 760,
    priceYearlyTry: 7600,
    priceMonthlySar: 71,
    priceYearlySar: 710,
    maxUsers: 10,
    maxCustomers: 1000,
    maxDeals: 500,
    maxStorageGb: 10,
    maxWhatsappMsg: 2000,
    maxAiTokens: 100000,
    features: ["10 users", "1,000 contacts", "10 GB storage", "2,000 WhatsApp msgs/mo"],
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
    color: "#10b981",
  },
  {
    id: "static-business",
    slug: "business",
    name: "Business",
    nameAr: "الأعمال",
    nameTr: "İşletme",
    description: "For growing businesses with full needs",
    descriptionAr: "للأعمال النامية ذات الاحتياجات الكاملة",
    descriptionTr: "Tam ihtiyaçları olan büyüyen işletmeler için",
    priceMonthlyUsd: 49,
    priceYearlyUsd: 490,
    priceMonthlyTry: 1960,
    priceYearlyTry: 19600,
    priceMonthlySar: 184,
    priceYearlySar: 1840,
    maxUsers: 50,
    maxCustomers: 10000,
    maxDeals: 5000,
    maxStorageGb: 100,
    maxWhatsappMsg: 20000,
    maxAiTokens: 1000000,
    features: ["50 users", "10,000 contacts", "100 GB storage", "20,000 WhatsApp msgs/mo"],
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    color: "#8b5cf6",
  },
  {
    id: "static-enterprise",
    slug: "enterprise",
    name: "Enterprise",
    nameAr: "المؤسسات",
    nameTr: "Kurumsal",
    description: "Custom plan for large organizations",
    descriptionAr: "خطة مخصصة للمؤسسات الكبيرة",
    descriptionTr: "Büyük kuruluşlar için özel plan",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    priceMonthlyTry: 0,
    priceYearlyTry: 0,
    priceMonthlySar: 0,
    priceYearlySar: 0,
    maxUsers: 999999,
    maxCustomers: 999999,
    maxDeals: 999999,
    maxStorageGb: 9999,
    maxWhatsappMsg: 999999,
    maxAiTokens: 999999999,
    features: ["Unlimited users", "Unlimited contacts", "Unlimited storage", "Unlimited messages"],
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    color: "#f59e0b",
  },
];

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
      .catch((err) => {
        // Backend unavailable (e.g. Vercel preview before backend deploy):
        // fall back to static plans so the page still renders something useful.
        console.warn("Pricing API unavailable, using static fallback:", err);
        setPlans(STATIC_PLANS);
      })
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
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
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

        {/* Currency — independent of header language switcher */}
        <div
          className="inline-flex rounded-full bg-card border border-sky-500/30 p-1"
          aria-label="Billing currency"
        >
          {(["USD", "TRY", "SAR"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currency === c
                  ? "bg-sky-500 text-white"
                  : "text-foreground hover:bg-sky-500/10"
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
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}
        {error && !loading && (
          <div className="max-w-md mx-auto rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive text-center">
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
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          {tFaq("title")}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <details
              key={n}
              className="group rounded-xl bg-card border border-border overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-semibold text-foreground hover:bg-sky-500/10 transition-colors">
                <span>{tFaq(`q${n}`)}</span>
                <span className="ltr:ml-3 rtl:mr-3 text-primary group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                {tFaq(`a${n}`)}
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
      className={`relative rounded-2xl bg-card p-6 flex flex-col ${
        featured
          ? "border-2 border-sky-400 shadow-xl shadow-sky-900/10"
          : "border border-border"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-sky-500 text-white px-3 py-1 text-xs font-semibold">
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
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground min-h-[2.5rem]">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-5">
        {isEnterprise ? (
          <div>
            <div className="text-3xl font-bold text-foreground">
              {t("customPrice")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("contactSales")}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {CURRENCY_SYMBOL[currency]}
                {price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                /{billing === "monthly" ? t("month") : t("year")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
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
            ? "bg-sky-500 hover:bg-sky-600 text-white"
            : isFree
            ? "bg-foreground hover:bg-foreground/90 text-background"
            : "bg-sky-500/10 hover:bg-sky-500/20 text-primary border border-sky-500/30"
        }`}
      >
        {isEnterprise ? t("contactSales") : t("getStarted")}
      </Link>

      {/* Limits summary */}
      <div className="space-y-2 text-sm mb-5 pb-5 border-b border-border">
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
        <div className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
          {t("includes")}
        </div>
        <ul className="space-y-2">
          {visibleFeatures.map((slug) => (
            <li key={slug} className="flex items-start gap-2 text-sm">
              <Check
                size={14}
                className="text-primary mt-0.5 flex-shrink-0"
              />
              <span className="text-foreground">{safeTrans(tFeat, slug)}</span>
            </li>
          ))}
          {plan.features.length > visibleFeatures.length && (
            <li className="text-xs text-muted-foreground italic ltr:pl-6 rtl:pr-6">
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
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
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
