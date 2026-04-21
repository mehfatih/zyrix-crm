"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Users,
  Check,
  Loader2,
  X,
  History,
  ArrowRight,
  Star,
  AlertTriangle,
  Package,
  Mail,
  GitBranch,
  Tag as TagIcon,
  Settings,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  listMarketplaceTemplates,
  getMarketplaceTemplate,
  applyMarketplaceTemplate,
  type TemplateCard,
  type TemplateDetail,
} from "@/lib/api/advanced";

// ============================================================================
// TEMPLATES MARKETPLACE — browse page
// ----------------------------------------------------------------------------
// Curated industry setups. Clicking a card opens a detail modal showing
// exactly what will be planted, with an Apply button that runs the
// server-side transaction. Only owners/admins can apply.
// ============================================================================

const INDUSTRY_FILTERS: Array<{
  key: string;
  label: { en: string; ar: string; tr: string };
}> = [
  { key: "", label: { en: "All", ar: "الكل", tr: "Tümü" } },
  { key: "retail", label: { en: "Retail", ar: "التجزئة", tr: "Perakende" } },
  {
    key: "restaurants",
    label: { en: "Restaurants", ar: "المطاعم", tr: "Restoranlar" },
  },
  { key: "saas", label: { en: "SaaS", ar: "SaaS", tr: "SaaS" } },
  {
    key: "services",
    label: { en: "Services", ar: "الخدمات", tr: "Hizmetler" },
  },
];

const REGION_FILTERS: Array<{
  key: string;
  label: { en: string; ar: string; tr: string };
  flag: string;
}> = [
  { key: "", label: { en: "Global", ar: "عالمي", tr: "Küresel" }, flag: "🌍" },
  { key: "KSA", label: { en: "Saudi Arabia", ar: "السعودية", tr: "Suudi Arabistan" }, flag: "🇸🇦" },
  { key: "TR", label: { en: "Türkiye", ar: "تركيا", tr: "Türkiye" }, flag: "🇹🇷" },
  { key: "UAE", label: { en: "UAE", ar: "الإمارات", tr: "BAE" }, flag: "🇦🇪" },
];

export default function TemplatesPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const canApply = user?.role === "owner" || user?.role === "admin";

  const [templates, setTemplates] = useState<TemplateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMarketplaceTemplates({
        industry: industry || undefined,
        region: region || undefined,
      });
      setTemplates(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message || e?.message || "Failed to load"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry, region]);

  const nameFor = (t: TemplateCard): string =>
    locale === "ar" ? t.nameAr || t.name : locale === "tr" ? t.nameTr || t.name : t.name;
  const taglineFor = (t: TemplateCard): string =>
    (locale === "ar" ? t.taglineAr : locale === "tr" ? t.taglineTr : t.tagline) ||
    "";

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-6xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {tr(
                  "Templates marketplace",
                  "متجر القوالب",
                  "Şablon pazarı"
                )}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "One-click industry setups — pipelines, tags, emails, demo data.",
                  "إعدادات جاهزة حسب الصناعة بنقرة واحدة — مسارات، وسوم، رسائل، بيانات تجريبية.",
                  "Tek tıkla endüstri kurulumları — boru hatları, etiketler, e-postalar, demo verileri."
                )}
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/templates/applied`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg text-xs font-semibold text-slate-700"
          >
            <History className="w-3.5 h-3.5" />
            {tr("Applied history", "سجل التطبيق", "Uygulama geçmişi")}
          </Link>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {tr("Industry", "الصناعة", "Endüstri")}
            </span>
            {INDUSTRY_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setIndustry(f.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  industry === f.key
                    ? "bg-cyan-600 text-white"
                    : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
                }`}
              >
                {f.label[locale]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {tr("Region", "المنطقة", "Bölge")}
            </span>
            {REGION_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setRegion(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  region === f.key
                    ? "bg-cyan-600 text-white"
                    : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
                }`}
              >
                <span>{f.flag}</span>
                {f.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Not admin/owner notice */}
        {!canApply && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              {tr(
                "You can browse templates, but only owners and admins can apply them.",
                "يمكنك تصفح القوالب، لكن التطبيق متاح فقط للمالكين والمسؤولين.",
                "Şablonlara göz atabilirsiniz ancak yalnızca sahipler ve yöneticiler uygulayabilir."
              )}
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-cyan-900">
              {tr("No templates match", "لا توجد قوالب مطابقة", "Eşleşen şablon yok")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                "Try clearing the filters.",
                "جرّب إزالة المرشحات.",
                "Filtreleri temizlemeyi deneyin."
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedSlug(tmpl.slug)}
                className="text-left rtl:text-right group relative rounded-2xl border border-sky-100 bg-white hover:border-cyan-400 hover:shadow-md transition-all overflow-hidden"
              >
                {tmpl.isFeatured && (
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase shadow">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {tr("Featured", "مميز", "Öne çıkan")}
                    </span>
                  </div>
                )}
                {/* Banner */}
                <div
                  className="h-20 flex items-center justify-center text-4xl"
                  style={{
                    background: `linear-gradient(135deg, ${tmpl.color}15, ${tmpl.color}35)`,
                  }}
                >
                  <span>{tmpl.icon}</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase">
                    <span>{tmpl.industry}</span>
                    <span className="text-slate-300">·</span>
                    <span>{tmpl.region}</span>
                  </div>
                  <h3 className="text-base font-bold text-cyan-900">
                    {nameFor(tmpl)}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 min-h-[2rem]">
                    {taglineFor(tmpl) || " "}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-sky-50">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tmpl.setupMinutes}{" "}
                        {tr("min", "د", "dk")}
                      </span>
                      {tmpl.hasSeedData && (
                        <span className="inline-flex items-center gap-1 text-cyan-700">
                          <Users className="w-3 h-3" />
                          {tr("demo data", "بيانات تجريبية", "demo verisi")}
                        </span>
                      )}
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isRtl ? "-scale-x-100" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail + Apply modal */}
      {selectedSlug && (
        <TemplateDetailModal
          slug={selectedSlug}
          locale={locale}
          canApply={canApply}
          onClose={() => setSelectedSlug(null)}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// DETAIL MODAL
// ============================================================================

function TemplateDetailModal({
  slug,
  locale,
  canApply,
  onClose,
}: {
  slug: string;
  locale: "en" | "ar" | "tr";
  canApply: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const [detail, setDetail] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] =
    useState<{ summary: Record<string, number> } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMarketplaceTemplate(slug)
      .then((d) => !cancelled && setDetail(d))
      .catch(
        (e) => !cancelled && setErr(e?.message || "Failed to load")
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const nameFor = (d: TemplateDetail): string =>
    locale === "ar" ? d.nameAr || d.name : locale === "tr" ? d.nameTr || d.name : d.name;
  const descFor = (d: TemplateDetail): string =>
    (locale === "ar" ? d.descriptionAr : locale === "tr" ? d.descriptionTr : d.description) || "";

  const handleApply = async () => {
    if (!detail) return;
    if (
      !confirm(
        tr(
          `Apply "${nameFor(detail)}" to your workspace? This will add pipeline stages, tags, demo data, and custom fields.`,
          `تطبيق "${nameFor(detail)}" على مساحة العمل؟ سيضيف مراحل المسار، الوسوم، بيانات تجريبية وحقول مخصصة.`,
          `"${nameFor(detail)}" çalışma alanınıza uygulansın mı? Pipeline aşamaları, etiketler, demo veriler ve özel alanlar ekleyecektir.`
        )
      )
    )
      return;
    setApplying(true);
    setErr(null);
    try {
      const res = await applyMarketplaceTemplate(slug);
      setSuccess({ summary: res.summary });
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message || "Apply failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : err ? (
          <div className="p-6 text-sm text-rose-700">{err}</div>
        ) : detail ? (
          <>
            {/* Banner */}
            <div
              className="relative h-32 flex items-center justify-center text-6xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${detail.color}20, ${detail.color}50)`,
              }}
            >
              <span>{detail.icon}</span>
              <button
                onClick={onClose}
                className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-lg bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white flex items-center justify-center shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              {/* Success view */}
              {success ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                    <Check className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-cyan-900">
                    {tr(
                      "Template applied!",
                      "تم تطبيق القالب!",
                      "Şablon uygulandı!"
                    )}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {tr(
                      "Here's what got added to your workspace:",
                      "هذا ما تم إضافته لمساحة العمل:",
                      "Çalışma alanınıza eklenenler:"
                    )}
                  </p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {Object.entries(success.summary)
                      .filter(([, count]) => count > 0)
                      .map(([key, count]) => (
                        <div
                          key={key}
                          className="rounded-lg bg-cyan-50 border border-cyan-100 p-2 text-center"
                        >
                          <div className="text-xl font-bold text-cyan-900 tabular-nums">
                            {count}
                          </div>
                          <div className="text-[10px] text-slate-600 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.refresh();
                    }}
                    className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold"
                  >
                    {tr("Done", "تم", "Tamam")}
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-semibold">
                      <span>{detail.industry}</span>
                      <span className="text-slate-300">·</span>
                      <span>{detail.region}</span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {detail.setupMinutes} {tr("min setup", "د إعداد", "dk kurulum")}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-cyan-900 mt-2">
                      {nameFor(detail)}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {descFor(detail)}
                    </p>
                  </div>

                  {/* What's included */}
                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">
                      {tr(
                        "What will be added",
                        "ما الذي سيُضاف",
                        "Neler eklenecek"
                      )}
                    </h3>
                    <div className="space-y-2">
                      {detail.bundle.pipelineStages &&
                        detail.bundle.pipelineStages.length > 0 && (
                          <BundleItem
                            icon={<GitBranch className="w-3.5 h-3.5" />}
                            accent="indigo"
                            label={tr(
                              `${detail.bundle.pipelineStages.length} pipeline stages`,
                              `${detail.bundle.pipelineStages.length} مراحل مسار`,
                              `${detail.bundle.pipelineStages.length} pipeline aşaması`
                            )}
                            preview={detail.bundle.pipelineStages.join(" → ")}
                          />
                        )}
                      {detail.bundle.tags &&
                        detail.bundle.tags.length > 0 && (
                          <BundleItem
                            icon={<TagIcon className="w-3.5 h-3.5" />}
                            accent="cyan"
                            label={tr(
                              `${detail.bundle.tags.length} tags`,
                              `${detail.bundle.tags.length} وسوم`,
                              `${detail.bundle.tags.length} etiket`
                            )}
                            preview={detail.bundle.tags.slice(0, 6).join(", ")}
                          />
                        )}
                      {detail.bundle.customFields &&
                        detail.bundle.customFields.length > 0 && (
                          <BundleItem
                            icon={<Settings className="w-3.5 h-3.5" />}
                            accent="sky"
                            label={tr(
                              `${detail.bundle.customFields.length} custom fields`,
                              `${detail.bundle.customFields.length} حقول مخصصة`,
                              `${detail.bundle.customFields.length} özel alan`
                            )}
                            preview={detail.bundle.customFields
                              .map((c) => c.name)
                              .join(", ")}
                          />
                        )}
                      {detail.bundle.emailTemplates &&
                        detail.bundle.emailTemplates.length > 0 && (
                          <BundleItem
                            icon={<Mail className="w-3.5 h-3.5" />}
                            accent="violet"
                            label={tr(
                              `${detail.bundle.emailTemplates.length} email templates`,
                              `${detail.bundle.emailTemplates.length} قوالب بريد`,
                              `${detail.bundle.emailTemplates.length} e-posta şablonu`
                            )}
                          />
                        )}
                      {detail.bundle.seedCustomers &&
                        detail.bundle.seedCustomers.length > 0 && (
                          <BundleItem
                            icon={<Users className="w-3.5 h-3.5" />}
                            accent="emerald"
                            label={tr(
                              `${detail.bundle.seedCustomers.length} demo customers`,
                              `${detail.bundle.seedCustomers.length} عملاء تجريبيين`,
                              `${detail.bundle.seedCustomers.length} demo müşteri`
                            )}
                          />
                        )}
                      {detail.bundle.seedDeals &&
                        detail.bundle.seedDeals.length > 0 && (
                          <BundleItem
                            icon={<Package className="w-3.5 h-3.5" />}
                            accent="amber"
                            label={tr(
                              `${detail.bundle.seedDeals.length} demo deals`,
                              `${detail.bundle.seedDeals.length} صفقات تجريبية`,
                              `${detail.bundle.seedDeals.length} demo anlaşma`
                            )}
                          />
                        )}
                    </div>
                  </div>

                  {err && (
                    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                      {err}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-sky-100">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                      {tr("Cancel", "إلغاء", "İptal")}
                    </button>
                    {canApply && (
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {applying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {tr("Apply template", "تطبيق القالب", "Şablonu uygula")}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function BundleItem({
  icon,
  accent,
  label,
  preview,
}: {
  icon: React.ReactNode;
  accent: string;
  label: string;
  preview?: string;
}) {
  const bg: Record<string, string> = {
    cyan: "bg-cyan-50 text-cyan-700",
    indigo: "bg-indigo-50 text-indigo-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="flex items-start gap-2">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg[accent] || bg.cyan}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-cyan-900">{label}</div>
        {preview && (
          <div className="text-xs text-slate-500 truncate">{preview}</div>
        )}
      </div>
    </div>
  );
}
