"use client";

import { useCallback, useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShoppingBag,
  Sparkles,
  Briefcase,
  Receipt,
  Star,
  Shield,
  Plug,
  Server,
  Paintbrush,
} from "lucide-react";
import {
  getFeatureCatalog,
  getCompanyFeatureFlags,
  setCompanyFeatureFlags,
  type FeatureCatalogEntry,
} from "@/lib/api/advanced";

// ============================================================================
// ADMIN FEATURE TOGGLES
// ----------------------------------------------------------------------------
// Embedded on the admin company-detail page. Renders a toggle per feature
// from the catalog, grouped by category, with a single Save button at the
// bottom for batch updates.
// ============================================================================

const CATEGORY_META: Record<
  FeatureCatalogEntry["category"],
  { label: { en: string; ar: string; tr: string }; icon: any; tone: string }
> = {
  sales: {
    label: { en: "Sales", ar: "المبيعات", tr: "Satış" },
    icon: Briefcase,
    tone: "from-sky-400 to-sky-600",
  },
  growth: {
    label: { en: "Growth", ar: "النمو", tr: "Büyüme" },
    icon: Sparkles,
    tone: "from-indigo-500 to-purple-600",
  },
  ai: {
    label: { en: "AI", ar: "الذكاء الاصطناعي", tr: "Yapay zeka" },
    icon: Zap,
    tone: "from-amber-500 to-orange-600",
  },
  ops: {
    label: { en: "Operations", ar: "العمليات", tr: "Operasyonlar" },
    icon: ShoppingBag,
    tone: "from-emerald-500 to-teal-600",
  },
  compliance: {
    label: { en: "Compliance", ar: "الامتثال", tr: "Uyumluluk" },
    icon: Receipt,
    tone: "from-rose-500 to-pink-600",
  },
  advanced: {
    label: { en: "Advanced", ar: "متقدم", tr: "Gelişmiş" },
    icon: Star,
    tone: "from-fuchsia-500 to-violet-600",
  },
  security: {
    label: { en: "Security & Compliance", ar: "الأمان والامتثال", tr: "Güvenlik ve Uyumluluk" },
    icon: Shield,
    tone: "from-red-500 to-rose-600",
  },
  integrations: {
    label: { en: "Integrations", ar: "التكاملات", tr: "Entegrasyonlar" },
    icon: Plug,
    tone: "from-teal-500 to-sky-500",
  },
  platform: {
    label: { en: "Platform", ar: "المنصة", tr: "Platform" },
    icon: Server,
    tone: "from-slate-500 to-slate-700",
  },
  ux: {
    label: { en: "Experience", ar: "التجربة", tr: "Deneyim" },
    icon: Paintbrush,
    tone: "from-sky-500 to-blue-600",
  },
};

// Declared category order so related categories group together in the UI.
const CATEGORY_ORDER: FeatureCatalogEntry["category"][] = [
  "sales",
  "growth",
  "ai",
  "ops",
  "security",
  "compliance",
  "integrations",
  "platform",
  "advanced",
  "ux",
];

// Resolve a lucide-react icon by string name at render time. Falls back to
// the category icon when the catalog entry references an unknown name.
function resolveLucideIcon(
  name: string | undefined,
  fallback: any
): any {
  if (!name) return fallback;
  const reg = LucideIcons as unknown as Record<string, any>;
  const hit = reg[name];
  return typeof hit === "function" || typeof hit === "object" ? hit : fallback;
}

const PLAN_LABELS: Record<
  "free" | "starter" | "business" | "enterprise",
  { en: string; ar: string; tr: string }
> = {
  free: { en: "Free", ar: "مجاني", tr: "Ücretsiz" },
  starter: { en: "Starter", ar: "المبتدئ", tr: "Başlangıç" },
  business: { en: "Business", ar: "الأعمال", tr: "İş" },
  enterprise: { en: "Enterprise", ar: "المؤسسات", tr: "Kurumsal" },
};

export function AdminFeatureToggles({
  companyId,
  locale,
}: {
  companyId: string;
  locale: "en" | "ar" | "tr";
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [catalog, setCatalog] = useState<FeatureCatalogEntry[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [originalFlags, setOriginalFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, f] = await Promise.all([
        getFeatureCatalog(),
        getCompanyFeatureFlags(companyId),
      ]);
      setCatalog(c);
      setFlags(f);
      setOriginalFlags(f);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess(null);
  };

  const hasChanges = Object.keys(flags).some(
    (k) => flags[k] !== originalFlags[k]
  );

  const handleSave = async () => {
    // Only send the keys that changed
    const changes: Record<string, boolean> = {};
    for (const k of Object.keys(flags)) {
      if (flags[k] !== originalFlags[k]) changes[k] = flags[k];
    }
    if (Object.keys(changes).length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await setCompanyFeatureFlags(companyId, changes);
      setFlags(updated);
      setOriginalFlags(updated);
      setSuccess(
        tr(
          "Feature access updated.",
          "تم تحديث صلاحيات الميزات.",
          "Özellik erişimi güncellendi."
        )
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  // Group catalog by category and order categories explicitly so related
  // groups sit together in the UI regardless of catalog insertion order.
  const byCategory: Record<string, FeatureCatalogEntry[]> = {};
  for (const f of catalog) {
    if (!byCategory[f.category]) byCategory[f.category] = [];
    byCategory[f.category].push(f);
  }
  const orderedCategories = CATEGORY_ORDER.filter(
    (c) => (byCategory[c]?.length ?? 0) > 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 rounded-xl border border-sky-100 bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2 text-sm text-emerald-900">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex items-start gap-2 text-sm text-rose-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {orderedCategories.map((cat) => {
          const items = byCategory[cat] ?? [];
          const meta = CATEGORY_META[cat];
          const Icon = meta?.icon ?? Zap;
          return (
            <div key={cat} className="rounded-xl border border-sky-100 bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-50/50 border-b border-sky-100">
                <div
                  className={`w-6 h-6 rounded-md bg-gradient-to-br ${meta?.tone} text-white flex items-center justify-center`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <h3 className="text-sm font-bold text-sky-900">
                  {meta?.label[locale] ?? cat}
                </h3>
              </div>
              <div className="divide-y divide-sky-50">
                {items.map((f) => {
                  const enabled = flags[f.key] ?? true;
                  const FeatureIcon = resolveLucideIcon(f.icon, meta?.icon ?? Zap);
                  const includedPlans = (
                    ["free", "starter", "business", "enterprise"] as const
                  ).filter((p) => f.defaultByPlan?.[p]);
                  return (
                    <div
                      key={f.key}
                      className="px-4 py-3 flex items-center gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta?.tone} text-white flex items-center justify-center flex-shrink-0`}
                      >
                        <FeatureIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900">
                          {f.label[locale]}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {f.description[locale]}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <code
                            className="text-[10px] text-slate-400 font-mono"
                            dir="ltr"
                          >
                            {f.key}
                          </code>
                          {includedPlans.length > 0 && includedPlans.length < 4 && (
                            <div className="flex flex-wrap items-center gap-1">
                              {includedPlans.map((p) => (
                                <span
                                  key={p}
                                  className="inline-flex items-center rounded-full bg-sky-50 text-sky-600 border border-sky-200 px-2 py-0.5 text-[10px] font-medium"
                                >
                                  {PLAN_LABELS[p][locale]}
                                </span>
                              ))}
                            </div>
                          )}
                          {includedPlans.length === 4 && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium">
                              {tr("All plans", "كل الخطط", "Tüm planlar")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggle(f.key)}
                        role="switch"
                        aria-checked={enabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                          enabled ? "bg-sky-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                            enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating save bar — appears only when there are unsaved changes */}
      {hasChanges && (
        <div className="sticky bottom-4 rounded-xl border border-sky-300 bg-sky-50 p-3 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-semibold text-sky-900">
              {tr(
                "Unsaved feature changes",
                "تغييرات غير محفوظة",
                "Kaydedilmemiş değişiklikler"
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFlags(originalFlags);
                setSuccess(null);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded"
            >
              {tr("Discard", "تجاهل", "Vazgeç")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {tr("Save changes", "حفظ التغييرات", "Değişiklikleri kaydet")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
