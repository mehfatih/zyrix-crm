"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchPlansAdmin,
  updatePlan,
  type AdminPlan,
} from "@/lib/api/admin";
import {
  getFeatureCatalog,
  type FeatureCatalogEntry,
  type FeaturePlanSlug,
} from "@/lib/api/advanced";
import {
  Package,
  Loader2,
  Star,
  Check,
  X,
  Pencil,
  Save,
} from "lucide-react";

const PLAN_ORDER: FeaturePlanSlug[] = [
  "free",
  "starter",
  "business",
  "enterprise",
];

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
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [featureCatalog, setFeatureCatalog] = useState<FeatureCatalogEntry[]>([]);

  const loadPlans = () => {
    setLoading(true);
    fetchPlansAdmin()
      .then((res) => setPlans(res))
      .catch(() => setError("Failed to load plans."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
    // Non-fatal: if the catalog fetch fails, the "Included features"
    // section just renders empty while the rest of the page works.
    getFeatureCatalog()
      .then(setFeatureCatalog)
      .catch(() => setFeatureCatalog([]));
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updatePlan(editing.id, {
        priceMonthlyUsd: editing.priceMonthlyUsd,
        priceYearlyUsd: editing.priceYearlyUsd,
        priceMonthlyTry: editing.priceMonthlyTry,
        priceYearlyTry: editing.priceYearlyTry,
        priceMonthlySar: editing.priceMonthlySar,
        priceYearlySar: editing.priceYearlySar,
        maxUsers: editing.maxUsers,
        maxCustomers: editing.maxCustomers,
        maxDeals: editing.maxDeals,
        maxStorageGb: editing.maxStorageGb,
        maxWhatsappMsg: editing.maxWhatsappMsg,
        maxAiTokens: editing.maxAiTokens,
        features: editing.features,
        isActive: editing.isActive,
        isFeatured: editing.isFeatured,
      });
      setEditing(null);
      loadPlans();
    } catch {
      setSaveError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (slug: string) => {
    if (!editing) return;
    const next = editing.features.includes(slug)
      ? editing.features.filter((f) => f !== slug)
      : [...editing.features, slug];
    setEditing({ ...editing, features: next });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-sky-500" size={24} />
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
                ? "border-sky-300 ring-2 ring-sky-100"
                : "border-sky-100"
            }`}
          >
            {p.isFeatured && (
              <div className="absolute -top-3 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-sky-500 text-white px-2.5 py-0.5 text-xs font-semibold">
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
              <h3 className="text-base font-bold text-slate-900 flex-1">
                {localizedName(p)}
              </h3>
              <button
                onClick={() => setEditing({ ...p })}
                className="p-1.5 rounded hover:bg-sky-50 text-sky-500"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
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
              <span className="font-semibold text-sky-600">
                {p.features.length}
              </span>
              <span className="text-slate-600"> / {ALL_FEATURE_SLUGS.length} features</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feature matrix */}
      <div className="rounded-xl bg-white border border-sky-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100">
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

      {/* Feature-catalog defaults per plan (mirrors backend catalog) */}
      {featureCatalog.length > 0 && (
        <div className="rounded-xl bg-white border border-sky-200 shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {locale === "ar"
                ? "الميزات المُضمّنة حسب الخطة"
                : locale === "tr"
                  ? "Plana göre dahil edilen özellikler"
                  : "Included features by plan"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {locale === "ar"
                ? "الإعدادات الافتراضية للميزات المميزة. يمكن تجاوزها لكل شركة في تفاصيل الشركة → وصول الميزات."
                : locale === "tr"
                  ? "Premium özelliklerin varsayılanları. Şirket ayrıntıları → Özellik erişimi üzerinden şirket başına geçersiz kılınabilir."
                  : "Premium defaults. Override per company on the company-details page → Feature access."}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {locale === "ar"
                      ? "الميزة"
                      : locale === "tr"
                        ? "Özellik"
                        : "Feature"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {locale === "ar"
                      ? "الفئة"
                      : locale === "tr"
                        ? "Kategori"
                        : "Category"}
                  </th>
                  {PLAN_ORDER.map((p) => (
                    <th
                      key={p}
                      className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featureCatalog.map((f) => (
                  <tr key={f.key} className="hover:bg-sky-50/50">
                    <td className="px-4 py-2 text-sm">
                      <div className="font-medium text-slate-900">
                        {f.label[locale as "en" | "ar" | "tr"] ?? f.label.en}
                      </div>
                      <code
                        className="text-[10px] font-mono text-slate-400"
                        dir="ltr"
                      >
                        {f.key}
                      </code>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600 capitalize">
                      {f.category}
                    </td>
                    {PLAN_ORDER.map((p) => (
                      <td key={p} className="px-4 py-2 text-center">
                        {f.defaultByPlan?.[p] ? (
                          <Check
                            size={16}
                            className="inline-block text-emerald-600"
                          />
                        ) : (
                          <X
                            size={14}
                            className="inline-block text-slate-300"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${editing.color}20` }}
                >
                  <Package size={16} style={{ color: editing.color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit {localizedName(editing)}
                </h3>
              </div>
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              {/* Prices */}
              <div>
                <h4 className="text-sm font-semibold text-sky-900 mb-2">
                  Prices
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <PriceField
                    label="USD / month"
                    value={editing.priceMonthlyUsd}
                    onChange={(v) =>
                      setEditing({ ...editing, priceMonthlyUsd: v })
                    }
                  />
                  <PriceField
                    label="USD / year"
                    value={editing.priceYearlyUsd}
                    onChange={(v) =>
                      setEditing({ ...editing, priceYearlyUsd: v })
                    }
                  />
                  <div />
                  <PriceField
                    label="TRY / month"
                    value={editing.priceMonthlyTry}
                    onChange={(v) =>
                      setEditing({ ...editing, priceMonthlyTry: v })
                    }
                  />
                  <PriceField
                    label="TRY / year"
                    value={editing.priceYearlyTry}
                    onChange={(v) =>
                      setEditing({ ...editing, priceYearlyTry: v })
                    }
                  />
                  <div />
                  <PriceField
                    label="SAR / month"
                    value={editing.priceMonthlySar}
                    onChange={(v) =>
                      setEditing({ ...editing, priceMonthlySar: v })
                    }
                  />
                  <PriceField
                    label="SAR / year"
                    value={editing.priceYearlySar}
                    onChange={(v) =>
                      setEditing({ ...editing, priceYearlySar: v })
                    }
                  />
                </div>
              </div>

              {/* Limits */}
              <div>
                <h4 className="text-sm font-semibold text-sky-900 mb-2">
                  Limits
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumField
                    label="Max users"
                    value={editing.maxUsers}
                    onChange={(v) => setEditing({ ...editing, maxUsers: v })}
                  />
                  <NumField
                    label="Max customers"
                    value={editing.maxCustomers}
                    onChange={(v) =>
                      setEditing({ ...editing, maxCustomers: v })
                    }
                  />
                  <NumField
                    label="Max deals"
                    value={editing.maxDeals}
                    onChange={(v) => setEditing({ ...editing, maxDeals: v })}
                  />
                  <NumField
                    label="Storage (GB)"
                    value={editing.maxStorageGb}
                    onChange={(v) =>
                      setEditing({ ...editing, maxStorageGb: v })
                    }
                  />
                  <NumField
                    label="WhatsApp msgs"
                    value={editing.maxWhatsappMsg}
                    onChange={(v) =>
                      setEditing({ ...editing, maxWhatsappMsg: v })
                    }
                  />
                  <NumField
                    label="AI tokens"
                    value={editing.maxAiTokens}
                    onChange={(v) =>
                      setEditing({ ...editing, maxAiTokens: v })
                    }
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={(e) =>
                      setEditing({ ...editing, isActive: e.target.checked })
                    }
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.isFeatured}
                    onChange={(e) =>
                      setEditing({ ...editing, isFeatured: e.target.checked })
                    }
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  Featured
                </label>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-sky-900 mb-2">
                  Features ({editing.features.length} / {ALL_FEATURE_SLUGS.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                  {ALL_FEATURE_SLUGS.map((slug) => (
                    <label
                      key={slug}
                      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-sky-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editing.features.includes(slug)}
                        onChange={() => toggleFeature(slug)}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                      />
                      <span className="text-slate-700">{slug}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type="number"
        step="0.01"
        value={typeof value === "string" ? value : value.toString()}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      />
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      />
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
