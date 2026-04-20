"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchPlansAdmin, type AdminPlan } from "@/lib/api/admin";
import { Package, Loader2, Star, Check, X } from "lucide-react";

// ============================================================================
// ADMIN PLANS VIEW
// ============================================================================

const ALL_FEATURE_SLUGS = [
  "contacts", "deals", "pipeline", "tasks", "notes",
  "whatsapp_basic", "whatsapp_api", "email_sync", "live_chat",
  "ai_extract", "ai_cfo", "ai_insights", "ai_dialects", "ai_voice",
  "quotes", "invoices", "commission", "loyalty",
  "dashboards", "forecasts", "reports_advanced",
  "workflows_basic", "workflows_advanced",
  "customer_portal", "tickets",
  "sso", "audit_log", "white_label", "dedicated_support",
  "custom_domain", "api_access",
];

export default function AdminPlansView({ locale }: { locale: string }) {
  const t = useTranslations("Admin.plans");
  const tFeat = useTranslations("Pricing.features");
  const tLimits = useTranslations("Pricing.limits");

  const [plans, setPlans] = useState<AdminPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlansAdmin()
      .then((res) => setPlans(res))
      .catch(() => setError("Failed to load plans."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-cyan-600" size={24} />
      </div>
    );
  }

  if (error || !plans) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
        {error ?? "Failed to load."}
      </div>
    );
  }

  function localizedName(p: AdminPlan) {
    if (locale === "ar") return p.nameAr || p.name;
    if (locale === "tr") return p.nameTr || p.name;
    return p.name;
  }

  function fmt(n: number | string) {
    const num = typeof n === "string" ? parseFloat(n) : n;
    return num === 0 ? "—" : num.toLocaleString();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-xl bg-white border p-5 ${
              p.isFeatured
                ? "border-cyan-400 ring-2 ring-cyan-100"
                : "border-cyan-100"
            }`}
          >
            {p.isFeatured && (
              <div className="absolute -top-3 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-cyan-600 text-white px-2.5 py-0.5 text-xs font-semibold">
                <Star size={10} />
                {t("featured")}
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${p.color}20` }}
              >
                <Package size={16} style={{ color: p.color }} />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {localizedName(p)}
              </h3>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-slate-900">
                ${fmt(p.priceMonthlyUsd)}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                ${fmt(p.priceYearlyUsd)}/yr
              </div>
            </div>

            {/* Limits */}
            <div className="space-y-1.5 text-xs mb-4">
              <LimitRow label={tLimits("users")} value={p.maxUsers} />
              <LimitRow label={tLimits("customers")} value={p.maxCustomers} />
              <LimitRow label={tLimits("storage")} value={p.maxStorageGb} />
              <LimitRow label={tLimits("whatsapp")} value={p.maxWhatsappMsg} />
            </div>

            {/* Feature count */}
            <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs">
              <span className="font-semibold text-cyan-700">
                {p.features.length}
              </span>
              <span className="text-slate-600"> / {ALL_FEATURE_SLUGS.length} features</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feature matrix */}
      <div className="rounded-xl bg-white border border-cyan-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-cyan-100">
          <h2 className="text-base font-bold text-slate-900">
            {t("features")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide"
                  >
                    {localizedName(p)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_FEATURE_SLUGS.map((slug) => (
                <tr key={slug} className="hover:bg-sky-50/50">
                  <td className="px-4 py-2 text-sm text-slate-700">
                    {safeTrans(tFeat, slug)}
                  </td>
                  {plans.map((p) => {
                    const has = p.features.includes(slug);
                    return (
                      <td key={p.id} className="px-4 py-2 text-center">
                        {has ? (
                          <Check
                            size={16}
                            className="inline-block text-emerald-600"
                          />
                        ) : (
                          <X size={14} className="inline-block text-slate-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: number }) {
  const isUnlimited = value >= 999999;
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">
        {isUnlimited ? "∞" : value.toLocaleString()}
      </span>
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
