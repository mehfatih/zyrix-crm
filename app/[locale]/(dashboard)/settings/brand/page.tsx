"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Palette,
  Image as ImageIcon,
  Mail,
  Globe,
  Save,
  Loader2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  Lock,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  getBrandSettings,
  updateBrandSettings,
  resetBrandSettings,
  setCustomDomain,
  verifyCustomDomain,
  removeCustomDomain,
  type BrandSettings,
  type CustomDomainSetupResult,
} from "@/lib/api/advanced";

// ============================================================================
// WHITE-LABEL BRAND SETTINGS PAGE
// ----------------------------------------------------------------------------
// Four sections, each tier-gated in the UI AND on the backend:
//   1. Display name + colors         — all tiers
//   2. Logo + favicon (URL paste)    — Pro+
//   3. Custom email sender           — Pro+
//   4. Custom domain (CNAME + TXT)   — Enterprise only
// ============================================================================

const TIER_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 2,
  enterprise: 3,
};

function canLogo(plan: string | null | undefined) {
  return (TIER_RANK[String(plan ?? "free").toLowerCase()] ?? 0) >= 2;
}
function canCustomEmail(plan: string | null | undefined) {
  return (TIER_RANK[String(plan ?? "free").toLowerCase()] ?? 0) >= 2;
}
function canCustomDomain(plan: string | null | undefined) {
  return (TIER_RANK[String(plan ?? "free").toLowerCase()] ?? 0) >= 3;
}

export default function BrandingSettingsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const plan = (user as any)?.company?.plan as string | undefined;

  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0EA5E9");
  const [accentColor, setAccentColor] = useState("#38BDF8");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [emailFromName, setEmailFromName] = useState("");
  const [emailFromAddress, setEmailFromAddress] = useState("");

  // Custom domain state
  const [domainInput, setDomainInput] = useState("");
  const [domainSetup, setDomainSetup] = useState<CustomDomainSetupResult | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    verified: boolean;
    reason?: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBrandSettings();
      setSettings(data);
      if (data) {
        setDisplayName(data.displayName ?? "");
        setPrimaryColor(data.primaryColor ?? "#0EA5E9");
        setAccentColor(data.accentColor ?? "#38BDF8");
        setLogoUrl(data.logoUrl ?? "");
        setFaviconUrl(data.faviconUrl ?? "");
        setEmailFromName(data.emailFromName ?? "");
        setEmailFromAddress(data.emailFromAddress ?? "");
        setDomainInput(data.customDomain ?? "");
        if (data.customDomain && data.customDomainVerificationToken) {
          setDomainSetup({
            customDomain: data.customDomain,
            verificationToken: data.customDomainVerificationToken,
            txtRecord: {
              name: `_zyrix-challenge.${data.customDomain}`,
              value: data.customDomainVerificationToken,
            },
            cnameTarget: "proxy.zyrix.co",
          });
        }
      }
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateBrandSettings({
        displayName: displayName.trim() || null,
        primaryColor: primaryColor || null,
        accentColor: accentColor || null,
        logoUrl: logoUrl.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
        emailFromName: emailFromName.trim() || null,
        emailFromAddress: emailFromAddress.trim() || null,
      });
      setSettings(updated);
      setSuccess(
        tr("Branding saved!", "تم حفظ التخصيص!", "Marka kaydedildi!")
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        tr(
          "Reset all branding? Your dashboard will go back to the default Zyrix look.",
          "إعادة تعيين التخصيص؟ ستعود اللوحة لمظهر Zyrix الافتراضي.",
          "Tüm marka sıfırlansın mı? Panoınuz varsayılan Zyrix görünümüne dönecek."
        )
      )
    )
      return;
    try {
      await resetBrandSettings();
      setSettings(null);
      setDisplayName("");
      setPrimaryColor("#0EA5E9");
      setAccentColor("#38BDF8");
      setLogoUrl("");
      setFaviconUrl("");
      setEmailFromName("");
      setEmailFromAddress("");
      setDomainInput("");
      setDomainSetup(null);
      setSuccess(tr("Branding reset.", "تمت إعادة التعيين.", "Sıfırlandı."));
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleSetupDomain = async () => {
    if (!domainInput.trim()) return;
    try {
      const result = await setCustomDomain(domainInput.trim());
      setDomainSetup(result);
      setVerifyResult(null);
      setSuccess(
        tr(
          "Domain setup started. Add the DNS records below and click Verify.",
          "بدأ إعداد الدومين. أضف سجلات DNS أدناه واضغط تحقق.",
          "Alan adı kurulumu başladı. Aşağıdaki DNS kayıtlarını ekleyin ve Doğrula'ya tıklayın."
        )
      );
      setTimeout(() => setSuccess(null), 5000);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleVerifyDomain = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyCustomDomain();
      setVerifyResult(result);
      if (result.verified) {
        setSuccess(
          tr(
            "Domain verified! Your custom domain is live.",
            "تم التحقق من الدومين! دومينك مُفعّل.",
            "Alan adı doğrulandı! Özel alan adınız yayında."
          )
        );
        await load();
      }
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm(tr("Remove custom domain?", "إزالة الدومين؟", "Kaldır?"))) return;
    try {
      await removeCustomDomain();
      setDomainSetup(null);
      setDomainInput("");
      setVerifyResult(null);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    }
  };

  if (loading) {
    return (
      <DashboardShell locale={locale}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-3xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/settings`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center shadow">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-sky-900">
              {tr("Branding", "التخصيص", "Marka")}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "Make Zyrix look like your own product.",
                "اجعل Zyrix يبدو كمنتجك الخاص.",
                "Zyrix'i kendi ürününüz gibi gösterin."
              )}
            </p>
          </div>
        </div>

        {/* Notifications */}
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

        {/* Section 1 — Display name + colors (all tiers) */}
        <SectionCard
          icon={<Sparkles className="w-4 h-4" />}
          title={tr("Name & colors", "الاسم والألوان", "Ad ve renkler")}
          subtitle={tr(
            "These apply to all plans.",
            "هذه تنطبق على كل الباقات.",
            "Tüm planlar için geçerlidir."
          )}
        >
          <FormField
            label={tr("Display name", "الاسم المعروض", "Görünen ad")}
            hint={tr(
              "Replaces 'Zyrix' in the sidebar + browser tab.",
              "يستبدل 'Zyrix' في الشريط الجانبي + علامة المتصفح.",
              "Kenar çubuğunda ve tarayıcı sekmesinde 'Zyrix' yerine geçer."
            )}
          >
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Acme CRM"
              maxLength={100}
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={tr("Primary color", "اللون الأساسي", "Ana renk")}>
              <ColorInput value={primaryColor} onChange={setPrimaryColor} />
            </FormField>
            <FormField label={tr("Accent color", "اللون الثانوي", "Vurgu rengi")}>
              <ColorInput value={accentColor} onChange={setAccentColor} />
            </FormField>
          </div>

          {/* Live preview */}
          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              {tr("Preview", "معاينة", "Önizleme")}
            </div>
            <div
              className="rounded-xl border border-sky-100 p-4 flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}10)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-bold"
                  style={{ color: primaryColor }}
                >
                  {displayName || "Your brand"}
                </div>
                <div className="text-xs text-slate-500">
                  {tr(
                    "Example dashboard title",
                    "عنوان اللوحة كمثال",
                    "Örnek panel başlığı"
                  )}
                </div>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 text-white text-xs font-semibold rounded shadow-sm"
                style={{ background: primaryColor }}
              >
                {tr("Button", "زر", "Düğme")}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Section 2 — Logo + favicon (Pro+) */}
        <SectionCard
          icon={<ImageIcon className="w-4 h-4" />}
          title={tr("Logo & favicon", "الشعار والأيقونة", "Logo ve favicon")}
          subtitle={tr("Available on Pro plans and higher.", "متوفر في باقات Pro وما فوق.", "Pro ve üzeri planlarda mevcuttur.")}
          locked={!canLogo(plan)}
          tr={tr}
        >
          <FormField
            label={tr("Logo URL", "رابط الشعار", "Logo URL'si")}
            hint={tr(
              "HTTPS URL of your logo image (recommended 240×60).",
              "رابط HTTPS لصورة الشعار (موصى به 240×60).",
              "Logonuzun HTTPS URL'si (önerilen 240×60)."
            )}
          >
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              disabled={!canLogo(plan)}
              placeholder="https://cdn.yourcompany.com/logo.png"
              dir="ltr"
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </FormField>
          {logoUrl && canLogo(plan) && (
            <div className="mt-2 flex items-center gap-2 p-2 rounded border border-sky-100 bg-sky-50/30">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                {tr("Preview", "معاينة", "Önizleme")}:
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-8 max-w-40 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <FormField
            label={tr("Favicon URL", "رابط الأيقونة", "Favicon URL'si")}
            hint={tr(
              "Small icon shown in browser tabs (32×32 or 64×64 PNG).",
              "أيقونة صغيرة تظهر في علامات المتصفح (32×32 أو 64×64 PNG).",
              "Tarayıcı sekmelerinde gösterilen küçük simge (32×32 veya 64×64 PNG)."
            )}
          >
            <input
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              disabled={!canLogo(plan)}
              placeholder="https://cdn.yourcompany.com/favicon.png"
              dir="ltr"
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </FormField>
        </SectionCard>

        {/* Section 3 — Custom email sender (Pro+) */}
        <SectionCard
          icon={<Mail className="w-4 h-4" />}
          title={tr(
            "Custom email sender",
            "مرسل البريد المخصص",
            "Özel e-posta gönderici"
          )}
          subtitle={tr(
            "Transactional emails go from your address, not Zyrix's.",
            "الإيميلات الخارجة تُرسل من عنوانك، ليس من Zyrix.",
            "İşlemsel e-postalar Zyrix'ten değil, sizin adresinizden gider."
          )}
          locked={!canCustomEmail(plan)}
          tr={tr}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={tr("From name", "اسم المرسل", "Gönderen adı")}>
              <input
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                disabled={!canCustomEmail(plan)}
                placeholder="Acme Support"
                maxLength={100}
                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-50"
              />
            </FormField>
            <FormField label={tr("From email", "بريد المرسل", "Gönderen e-posta")}>
              <input
                value={emailFromAddress}
                onChange={(e) => setEmailFromAddress(e.target.value)}
                disabled={!canCustomEmail(plan)}
                placeholder="support@acme.com"
                type="email"
                dir="ltr"
                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-50"
              />
            </FormField>
          </div>
          {canCustomEmail(plan) && (
            <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800">
              {tr(
                "Add SPF + DKIM records on your domain so emails don't get flagged as spam. We'll provide the exact DNS records when you save.",
                "أضف سجلات SPF + DKIM على دومينك حتى لا تُصنّف الرسائل كسبام. سنعطيك السجلات المطلوبة عند الحفظ.",
                "E-postaların spam olarak işaretlenmemesi için alan adınıza SPF + DKIM kayıtları ekleyin. Kaydettiğinizde tam DNS kayıtlarını sağlayacağız."
              )}
            </div>
          )}
        </SectionCard>

        {/* Save + reset */}
        <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2 z-10">
          <button
            onClick={handleReset}
            disabled={!settings}
            className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {tr("Reset to default", "إعادة التعيين", "Varsayılana sıfırla")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 shadow"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {tr("Save branding", "حفظ التخصيص", "Markayı kaydet")}
          </button>
        </div>

        {/* Section 4 — Custom domain (Enterprise) */}
        <SectionCard
          icon={<Globe className="w-4 h-4" />}
          title={tr("Custom domain", "الدومين المخصص", "Özel alan adı")}
          subtitle={tr(
            "Available on Enterprise plans.",
            "متوفر في باقة Enterprise.",
            "Enterprise planlarında mevcuttur."
          )}
          locked={!canCustomDomain(plan)}
          tr={tr}
        >
          {canCustomDomain(plan) ? (
            <div className="space-y-3">
              {!domainSetup ? (
                <>
                  <FormField
                    label={tr(
                      "Your domain",
                      "دومينك",
                      "Alan adınız"
                    )}
                    hint={tr(
                      "A subdomain you own like crm.yourcompany.com",
                      "نطاق فرعي تملكه مثل crm.yourcompany.com",
                      "Sahip olduğunuz crm.sirketiniz.com gibi bir alt alan"
                    )}
                  >
                    <input
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="crm.yourcompany.com"
                      dir="ltr"
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </FormField>
                  <button
                    onClick={handleSetupDomain}
                    disabled={!domainInput.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
                  >
                    <Globe className="w-4 h-4" />
                    {tr("Set up domain", "إعداد الدومين", "Alan adını kur")}
                  </button>
                </>
              ) : (
                <DomainVerifyPanel
                  setup={domainSetup}
                  verifyResult={verifyResult}
                  verifying={verifying}
                  verified={!!settings?.customDomainVerifiedAt}
                  onVerify={handleVerifyDomain}
                  onRemove={handleRemoveDomain}
                  locale={locale}
                  tr={tr}
                />
              )}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SectionCard({
  icon,
  title,
  subtitle,
  children,
  locked,
  tr,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  locked?: boolean;
  tr?: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden relative ${
        locked ? "border-slate-200" : "border-sky-100"
      }`}
    >
      <div className="p-4 border-b border-sky-50">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <h2 className="text-base font-bold text-sky-900 flex items-center gap-2">
              {icon}
              {title}
              {locked && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  <Lock className="w-2.5 h-2.5" />
                  {tr ? tr("Upgrade", "ترقية", "Yükselt") : "Upgrade"}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className={`p-4 space-y-3 ${locked ? "opacity-60" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-sky-200 focus-within:ring-2 focus-within:ring-sky-400 overflow-hidden">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-9 border-0 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#0EA5E9"
        pattern="^#[0-9a-fA-F]{6}$"
        dir="ltr"
        className="flex-1 px-2 py-2 text-sm font-mono focus:outline-none bg-transparent"
      />
    </div>
  );
}

function DomainVerifyPanel({
  setup,
  verifyResult,
  verifying,
  verified,
  onVerify,
  onRemove,
  locale,
  tr,
}: {
  setup: CustomDomainSetupResult;
  verifyResult: { verified: boolean; reason?: string } | null;
  verifying: boolean;
  verified: boolean;
  onVerify: () => void;
  onRemove: () => void;
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-sky-50 border border-sky-100">
        <Globe className="w-4 h-4 text-sky-600" />
        <code className="text-sm font-mono text-sky-900 flex-1" dir="ltr">
          {setup.customDomain}
        </code>
        {verified ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            {tr("Live", "مُفعّل", "Yayında")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
            {tr("Pending", "معلق", "Beklemede")}
          </span>
        )}
      </div>

      <div className="text-xs text-slate-600">
        {tr(
          "Add these two DNS records on your domain, then click Verify.",
          "أضف هذين السجلين على دومينك، ثم اضغط تحقق.",
          "Bu iki DNS kaydını alan adınıza ekleyin, sonra Doğrula'ya tıklayın."
        )}
      </div>

      <DnsRecordRow
        type="CNAME"
        name={setup.customDomain}
        value={setup.cnameTarget}
        copyKey="cname"
        copiedKey={copiedKey}
        onCopy={copy}
      />
      <DnsRecordRow
        type="TXT"
        name={setup.txtRecord.name}
        value={setup.txtRecord.value}
        copyKey="txt"
        copiedKey={copiedKey}
        onCopy={copy}
      />

      {verifyResult && !verifyResult.verified && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{verifyResult.reason ?? tr("Verification failed", "فشل التحقق", "Doğrulama başarısız")}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {!verified && (
          <button
            onClick={onVerify}
            disabled={verifying}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
          >
            {verifying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {tr("Verify DNS", "تحقق DNS", "DNS'i doğrula")}
          </button>
        )}
        <button
          onClick={onRemove}
          className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {tr("Remove", "إزالة", "Kaldır")}
        </button>
      </div>
    </div>
  );
}

function DnsRecordRow({
  type,
  name,
  value,
  copyKey,
  copiedKey,
  onCopy,
}: {
  type: string;
  name: string;
  value: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-sky-100 p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
          {type}
        </span>
        <code className="text-xs font-mono text-slate-700 truncate flex-1" dir="ltr">
          {name}
        </code>
        <button
          onClick={() => onCopy(`${copyKey}-name`, name)}
          className="w-6 h-6 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
        >
          {copiedKey === `${copyKey}-name` ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-slate-500 w-12 flex-shrink-0">
          Value
        </span>
        <code className="text-xs font-mono text-slate-700 truncate flex-1" dir="ltr">
          {value}
        </code>
        <button
          onClick={() => onCopy(`${copyKey}-value`, value)}
          className="w-6 h-6 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
        >
          {copiedKey === `${copyKey}-value` ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}
