"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchCompanies,
  fetchPlansAdmin,
  type AdminCompanyListItem,
  type AdminPlan,
  type Paginated,
} from "@/lib/api/admin";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Loader2,
  Building2,
} from "lucide-react";

// ============================================================================
// ADMIN BILLING VIEW
// ============================================================================
// MVP: computed view from plans × active companies. No live subscription rows
// yet — populated once P3 payment webhooks are wired.
// ============================================================================

type Currency = "USD" | "TRY" | "SAR";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  TRY: "₺",
  SAR: "﷼",
};

interface Props {
  locale: string;
}

export default function AdminBillingView({ locale }: Props) {
  const t = useTranslations("Admin.billing");

  const [plans, setPlans] = useState<AdminPlan[] | null>(null);
  const [companies, setCompanies] =
    useState<Paginated<AdminCompanyListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (locale === "ar") return "SAR";
    if (locale === "tr") return "TRY";
    return "USD";
  });

  useEffect(() => {
    Promise.all([
      fetchPlansAdmin(),
      fetchCompanies({ page: 1, limit: 500 }),
    ])
      .then(([plansRes, companiesRes]) => {
        setPlans(plansRes);
        setCompanies(companiesRes);
      })
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ──────────────────────────────────────────────────────────────────────
  // Derived metrics
  // ──────────────────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    if (!plans || !companies)
      return { mrr: 0, arr: 0, payingCount: 0, byPlan: [], trialCount: 0 };

    const planMap = new Map<string, AdminPlan>();
    plans.forEach((p) => planMap.set(p.slug, p));

    const priceKey = (
      currency === "USD"
        ? "priceMonthlyUsd"
        : currency === "TRY"
          ? "priceMonthlyTry"
          : "priceMonthlySar"
    ) as keyof AdminPlan;

    let mrr = 0;
    let payingCount = 0;
    let trialCount = 0;
    const byPlanMap = new Map<
      string,
      { slug: string; name: string; count: number; mrr: number; color: string }
    >();

    companies.items.forEach((co) => {
      const plan = planMap.get(co.plan);
      if (!plan) return;
      const v = plan[priceKey];
      const price = typeof v === "string" ? parseFloat(v) : (v as number);

      const isPayingStatus =
        co.status === "active" && plan.slug !== "free";
      const isTrialStatus = co.status === "trial";

      if (isPayingStatus) {
        mrr += price || 0;
        payingCount += 1;
      }
      if (isTrialStatus) {
        trialCount += 1;
      }

      const entry = byPlanMap.get(plan.slug) ?? {
        slug: plan.slug,
        name: plan.name,
        count: 0,
        mrr: 0,
        color: plan.color || "#0EA5E9",
      };
      entry.count += 1;
      if (isPayingStatus) entry.mrr += price || 0;
      byPlanMap.set(plan.slug, entry);
    });

    const byPlan = Array.from(byPlanMap.values()).sort(
      (a, b) => b.mrr - a.mrr
    );

    return {
      mrr,
      arr: mrr * 12,
      payingCount,
      byPlan,
      trialCount,
    };
  }, [plans, companies, currency]);

  const planMap = useMemo(() => {
    const m = new Map<string, AdminPlan>();
    (plans ?? []).forEach((p) => m.set(p.slug, p));
    return m;
  }, [plans]);

  // ──────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-cyan-300" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-red-800">
        {error}
      </div>
    );
  }

  const sym = CURRENCY_SYMBOL[currency];
  const activeSubs = companies
    ? companies.items.filter(
        (c) => c.status === "active" && c.plan !== "free"
      )
    : [];
  const maxMrr = Math.max(1, ...metrics.byPlan.map((p) => p.mrr));

  return (
    <div className="space-y-6">
      {/* Header + currency toggle */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
          {(["USD", "TRY", "SAR"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                currency === c
                  ? "bg-sky-500 text-white"
                  : "text-muted-foreground hover:text-cyan-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MoneyCard
          icon={DollarSign}
          color="emerald"
          label={t("mrr")}
          value={metrics.mrr}
          currency={sym}
          sublabel={t("recurringMonthly")}
        />
        <MoneyCard
          icon={TrendingUp}
          color="cyan"
          label={t("arr")}
          value={metrics.arr}
          currency={sym}
          sublabel={t("projectedAnnual")}
        />
        <CountCard
          icon={CreditCard}
          color="sky"
          label={t("payingCustomers")}
          value={metrics.payingCount}
          sublabel={t("activeSubscriptions")}
        />
        <CountCard
          icon={Building2}
          color="amber"
          label={t("trialAccounts")}
          value={metrics.trialCount}
          sublabel={t("trialSubtitle")}
        />
      </div>

      {/* Revenue by plan */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("revenueByPlan")}
          </h2>
          <span className="text-xs text-muted-foreground">{t("monthlyEstimate")}</span>
        </div>

        {metrics.byPlan.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            {t("noData")}
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.byPlan.map((p) => {
              const pct = (p.mrr / maxMrr) * 100;
              const planObj = planMap.get(p.slug);
              const displayName =
                locale === "ar" && planObj?.nameAr
                  ? planObj.nameAr
                  : locale === "tr" && planObj?.nameTr
                    ? planObj.nameTr
                    : p.name;
              return (
                <div key={p.slug}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({p.count} {t("companies")})
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {sym}
                      {formatMoney(p.mrr)}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active subscriptions table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("activeSubscriptionsTitle")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {activeSubs.length} {t("companies")}
          </span>
        </div>

        {activeSubs.length === 0 ? (
          <div className="text-sm text-muted-foreground py-10 text-center">
            {t("noActiveSubs")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("company")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("plan")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("country")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("price")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("billingEmail")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {activeSubs.map((c) => {
                  const plan = planMap.get(c.plan);
                  const priceKey = (
                    currency === "USD"
                      ? "priceMonthlyUsd"
                      : currency === "TRY"
                        ? "priceMonthlyTry"
                        : "priceMonthlySar"
                  ) as keyof AdminPlan;
                  const v = plan?.[priceKey];
                  const price =
                    typeof v === "string" ? parseFloat(v) : ((v as number) ?? 0);
                  return (
                    <tr key={c.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {c.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{c.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/30 capitalize">
                          {c.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {c.country || "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {sym}
                        {formatMoney(price)}
                        <span className="text-xs text-muted-foreground font-normal">
                          {" "}
                          /mo
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {c.billingEmail || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Failed payments placeholder */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-foreground">
            {t("failedPayments")}
          </h2>
        </div>
        <div className="rounded-lg bg-muted border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("paymentsComingSoon")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("paymentsComingSoonDetail")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────
function formatMoney(v: number): string {
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

type ColorKey = "emerald" | "cyan" | "sky" | "amber";
const COLOR_MAP: Record<ColorKey, { bg: string; text: string; ring: string }> =
  {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      ring: "ring-emerald-100",
    },
    cyan: { bg: "bg-muted", text: "text-cyan-300", ring: "ring-sky-100" },
    sky: { bg: "bg-muted", text: "text-cyan-300", ring: "ring-sky-100" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-100" },
  };

function MoneyCard({
  icon: Icon,
  color,
  label,
  value,
  currency,
  sublabel,
}: {
  icon: typeof DollarSign;
  color: ColorKey;
  label: string;
  value: number;
  currency: string;
  sublabel?: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">
            <span className="text-lg text-muted-foreground me-0.5">{currency}</span>
            {formatMoney(value)}
          </div>
          {sublabel && (
            <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
    </div>
  );
}

function CountCard({
  icon: Icon,
  color,
  label,
  value,
  sublabel,
}: {
  icon: typeof DollarSign;
  color: ColorKey;
  label: string;
  value: number;
  sublabel?: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">
            {value.toLocaleString()}
          </div>
          {sublabel && (
            <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
    </div>
  );
}
