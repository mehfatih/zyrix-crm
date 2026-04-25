"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Languages,
  DollarSign,
  ShoppingCart,
  MessageCircle,
  UserPlus,
  PartyPopper,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  SkipForward,
} from "lucide-react";
import {
  getOnboardingStatus,
  completeOnboarding,
  inviteColleague,
  type OnboardingStatus,
} from "@/lib/api/advanced";

// ============================================================================
// 7-STEP ONBOARDING WIZARD
// ----------------------------------------------------------------------------
// Renders outside the dashboard shell (no sidebar) for a focused first-run
// experience. Keeps all step answers in local state and only persists at
// the very end — so a user who abandons halfway leaves no partial data
// behind and can restart cleanly next time.
// ============================================================================

type StepKey =
  | "company"
  | "language"
  | "currency"
  | "ecommerce"
  | "whatsapp"
  | "team"
  | "done";

const STEPS: StepKey[] = [
  "company",
  "language",
  "currency",
  "ecommerce",
  "whatsapp",
  "team",
  "done",
];

// Country options — focused on the MENA + Türkiye markets Zyrix targets,
// with a generic "Other" escape hatch so we don't block non-regional users.
const COUNTRIES: Array<{ code: string; en: string; ar: string; tr: string }> = [
  { code: "SA", en: "Saudi Arabia", ar: "المملكة العربية السعودية", tr: "Suudi Arabistan" },
  { code: "TR", en: "Türkiye", ar: "تركيا", tr: "Türkiye" },
  { code: "AE", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة", tr: "BAE" },
  { code: "EG", en: "Egypt", ar: "مصر", tr: "Mısır" },
  { code: "KW", en: "Kuwait", ar: "الكويت", tr: "Kuveyt" },
  { code: "QA", en: "Qatar", ar: "قطر", tr: "Katar" },
  { code: "BH", en: "Bahrain", ar: "البحرين", tr: "Bahreyn" },
  { code: "OM", en: "Oman", ar: "عمان", tr: "Umman" },
  { code: "JO", en: "Jordan", ar: "الأردن", tr: "Ürdün" },
  { code: "IQ", en: "Iraq", ar: "العراق", tr: "Irak" },
  { code: "MA", en: "Morocco", ar: "المغرب", tr: "Fas" },
  { code: "OTHER", en: "Other", ar: "أخرى", tr: "Diğer" },
];

// Currencies — default suggestion derives from the country picked above,
// but the user can override. TRY/SAR/AED are the anchors for our core
// markets; USD/EUR are the catch-all fallbacks.
const CURRENCIES = ["SAR", "TRY", "AED", "EGP", "KWD", "QAR", "BHD", "OMR", "JOD", "IQD", "MAD", "USD", "EUR"];

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  SA: "SAR",
  TR: "TRY",
  AE: "AED",
  EG: "EGP",
  KW: "KWD",
  QA: "QAR",
  BH: "BHD",
  OM: "OMR",
  JO: "JOD",
  IQ: "IQD",
  MA: "MAD",
};

export default function OnboardingPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const router = useRouter();
  const t = (en: string, ar: string, tr: string) =>
    locale === "ar" ? ar : locale === "tr" ? tr : en;

  // ─── Bootstrap — fetch status, redirect if already done ──────────────
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getOnboardingStatus();
        if (s.completed) {
          router.replace(`/${locale}/dashboard`);
          return;
        }
        setStatus(s);
        // Pre-fill answers from whatever the user already has
        setCompanyName(s.company.name || "");
        setCountry(s.company.country || "");
        setBaseCurrency(s.company.baseCurrency || "");
        setPreferredLocale(
          (s.user.preferredLocale as "en" | "ar" | "tr" | null) || locale
        );
      } catch (e: any) {
        setError(e?.response?.data?.error?.message || e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Wizard state ────────────────────────────────────────────────────
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const [saving, setSaving] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");

  // Step 2
  const [preferredLocale, setPreferredLocale] = useState<"en" | "ar" | "tr">(
    locale
  );

  // Step 3
  const [baseCurrency, setBaseCurrency] = useState("");

  // Step 6 — invite colleague
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"manager" | "member">("member");
  const [inviteSent, setInviteSent] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Auto-suggest currency from country if user hasn't chosen yet
  useEffect(() => {
    if (country && !baseCurrency) {
      const suggested = COUNTRY_TO_CURRENCY[country];
      if (suggested) setBaseCurrency(suggested);
    }
  }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const goPrev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const handleSendInvite = async () => {
    setInviteError(null);
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await inviteColleague({
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteSent(true);
    } catch (e: any) {
      setInviteError(
        e?.response?.data?.error?.message || e?.message || "Invite failed"
      );
    } finally {
      setInviting(false);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await completeOnboarding({
        companyName: companyName || undefined,
        country: country || undefined,
        baseCurrency: baseCurrency || undefined,
        preferredLocale,
      });
      // Drop user on /customers with the create modal open — the "let's
      // add your first customer together" moment.
      router.push(`/${preferredLocale}/customers?welcome=1`);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message ||
          e?.message ||
          "Failed to complete setup"
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-50">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }
  if (error && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-50 p-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-rose-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold"
          >
            {t("Try again", "حاول مرة أخرى", "Tekrar dene")}
          </button>
        </div>
      </div>
    );
  }

  // Derived — which steps allow Skip vs require a value
  const canSkip = step === "ecommerce" || step === "whatsapp" || step === "team";
  const canGoNext =
    step === "company"
      ? companyName.trim().length > 0 && country !== ""
      : step === "language"
        ? !!preferredLocale
        : step === "currency"
          ? !!baseCurrency
          : true; // skippable steps always allow forward

  const progress = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex flex-col"
    >
      {/* Top bar with brand + progress */}
      <header className="w-full border-b border-sky-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-sky-400 to-sky-600 text-white text-xs font-bold flex items-center justify-center">
              Z
            </div>
            <span className="text-sm font-semibold text-sky-900">
              Zyrix CRM
            </span>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            {t(`Step ${stepIdx + 1} of ${STEPS.length}`, `الخطوة ${stepIdx + 1} من ${STEPS.length}`, `Adım ${stepIdx + 1} / ${STEPS.length}`)}
          </span>
        </div>
        <div className="h-1 bg-sky-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Step body */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          {/* ─── Step 1: Company ──────────────────────────────── */}
          {step === "company" && (
            <StepFrame
              icon={<Building2 className="w-6 h-6 text-sky-500" />}
              title={t(
                "Tell us about your company",
                "أخبرنا عن شركتك",
                "Şirketiniz hakkında bilgi verin"
              )}
              subtitle={t(
                "This will appear on invoices, emails, and shared docs.",
                "سيظهر هذا في الفواتير والرسائل والمستندات المشتركة.",
                "Bu bilgi faturalarda, e-postalarda ve paylaşılan belgelerde görünür."
              )}
            >
              <label className="block">
                <span className="text-xs font-medium text-slate-700">
                  {t("Company name", "اسم الشركة", "Şirket adı")}
                </span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t("Acme Inc.", "شركة النموذج", "Acme Ltd.")}
                  className="mt-1 w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">
                  {t("Country", "البلد", "Ülke")}
                </span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
                >
                  <option value="">{t("Select country…", "اختر البلد…", "Ülke seçin…")}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c[locale]}
                    </option>
                  ))}
                </select>
              </label>
            </StepFrame>
          )}

          {/* ─── Step 2: Language ─────────────────────────────── */}
          {step === "language" && (
            <StepFrame
              icon={<Languages className="w-6 h-6 text-sky-500" />}
              title={t(
                "Choose your language",
                "اختر لغتك",
                "Dilinizi seçin"
              )}
              subtitle={t(
                "This will be your default throughout Zyrix.",
                "ستكون هذه لغتك الافتراضية في جميع أنحاء Zyrix.",
                "Bu, Zyrix genelinde varsayılan diliniz olacak."
              )}
            >
              <div className="grid grid-cols-1 gap-2">
                {(
                  [
                    { code: "en", label: "English", sub: "Default for most users" },
                    { code: "ar", label: "العربية", sub: "الخط الأساسي للشركات العربية" },
                    { code: "tr", label: "Türkçe", sub: "Türk iş kullanıcıları için" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setPreferredLocale(opt.code)}
                    className={`text-left px-4 py-3 border rounded-lg transition-all ${
                      preferredLocale === opt.code
                        ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                        : "border-sky-200 bg-white hover:border-sky-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-sky-900">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {opt.sub}
                        </div>
                      </div>
                      {preferredLocale === opt.code && (
                        <Check className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </StepFrame>
          )}

          {/* ─── Step 3: Currency ─────────────────────────────── */}
          {step === "currency" && (
            <StepFrame
              icon={<DollarSign className="w-6 h-6 text-sky-500" />}
              title={t(
                "Pick your base currency",
                "اختر عملتك الأساسية",
                "Ana para biriminizi seçin"
              )}
              subtitle={t(
                "We'll use this for reports, quotes, and totals. Other currencies are supported — this is just the default.",
                "سنستخدم هذه للتقارير والعروض والإجماليات. العملات الأخرى مدعومة — هذا الافتراضي فقط.",
                "Raporlar, teklifler ve toplamlar için bunu kullanacağız. Diğer para birimleri desteklenir — bu sadece varsayılan."
              )}
            >
              <div className="grid grid-cols-3 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBaseCurrency(c)}
                    className={`px-3 py-3 border rounded-lg text-sm font-semibold transition-all ${
                      baseCurrency === c
                        ? "border-sky-400 bg-sky-50 text-sky-900 ring-2 ring-sky-100"
                        : "border-sky-200 bg-white text-slate-700 hover:border-sky-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </StepFrame>
          )}

          {/* ─── Step 4: Connect e-commerce platform ──────────── */}
          {step === "ecommerce" && (
            <StepFrame
              icon={<ShoppingCart className="w-6 h-6 text-sky-500" />}
              title={t(
                "Connect your online store",
                "اربط متجرك الإلكتروني",
                "Mağazanızı bağlayın"
              )}
              subtitle={t(
                "Sync customers and orders automatically from Shopify, Salla, WooCommerce, and 9 more. You can also set this up later.",
                "قم بمزامنة العملاء والطلبات تلقائيًا من Shopify وسلة وWooCommerce و9 منصات أخرى. يمكنك إعداد هذا لاحقًا.",
                "Shopify, Salla, WooCommerce ve 9 diğer platformdan müşterileri ve siparişleri otomatik eşitleyin. Bunu daha sonra da ayarlayabilirsiniz."
              )}
            >
              <div className="rounded-lg border border-sky-200 bg-white p-4">
                <p className="text-sm text-slate-700 mb-3">
                  {t(
                    "We'll take you to the integrations page where you can connect your platform.",
                    "سنأخذك إلى صفحة التكاملات حيث يمكنك ربط منصتك.",
                    "Sizi platformunuzu bağlayabileceğiniz entegrasyonlar sayfasına götüreceğiz."
                  )}
                </p>
                <a
                  href={`/${locale}/settings/integrations`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600"
                >
                  {t("Open integrations", "افتح التكاملات", "Entegrasyonları aç")}
                  <ArrowRight
                    className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                  />
                </a>
              </div>
            </StepFrame>
          )}

          {/* ─── Step 5: WhatsApp ─────────────────────────────── */}
          {step === "whatsapp" && (
            <StepFrame
              icon={<MessageCircle className="w-6 h-6 text-sky-500" />}
              title={t(
                "Connect WhatsApp",
                "اربط واتساب",
                "WhatsApp'ı bağlayın"
              )}
              subtitle={t(
                "Route WhatsApp messages straight into your CRM and reply from the Inbox. Requires a Meta Cloud API token — you can add this later from Settings.",
                "وجّه رسائل واتساب مباشرة إلى CRM وردّ من صندوق الوارد. يتطلب رمز Meta Cloud API — يمكنك إضافته لاحقًا من الإعدادات.",
                "WhatsApp mesajlarını doğrudan CRM'e yönlendirin ve Gelen Kutusu'ndan yanıtlayın. Meta Cloud API tokenı gerekir — daha sonra Ayarlardan ekleyebilirsiniz."
              )}
            >
              <div className="rounded-lg border border-sky-200 bg-white p-4">
                <a
                  href={`/${locale}/settings/integrations#whatsapp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600"
                >
                  {t("Set up WhatsApp", "إعداد واتساب", "WhatsApp'ı kur")}
                  <ArrowRight
                    className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                  />
                </a>
              </div>
            </StepFrame>
          )}

          {/* ─── Step 6: Invite colleague ─────────────────────── */}
          {step === "team" && (
            <StepFrame
              icon={<UserPlus className="w-6 h-6 text-sky-500" />}
              title={t(
                "Invite your first teammate",
                "ادعُ أول زميل",
                "İlk takım arkadaşınızı davet edin"
              )}
              subtitle={t(
                "Share the workspace with a colleague. They'll get an email to set their password and join.",
                "شارك مساحة العمل مع زميل. سيستلم رسالة لتعيين كلمة المرور والانضمام.",
                "Çalışma alanını bir meslektaşınızla paylaşın. Parolalarını belirlemek ve katılmak için bir e-posta alacaklar."
              )}
            >
              {inviteSent ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      {t(
                        "Invitation sent!",
                        "تم إرسال الدعوة!",
                        "Davet gönderildi!"
                      )}
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {inviteEmail} {t("will get an email shortly.", "سيتلقى رسالة قريبًا.", "kısa süre içinde bir e-posta alacak.")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">
                      {t("Email address", "البريد الإلكتروني", "E-posta adresi")}
                    </span>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="mt-1 w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">
                      {t("Role", "الدور", "Rol")}
                    </span>
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as "manager" | "member")
                      }
                      className="mt-1 w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
                    >
                      <option value="member">
                        {t("Member — regular access", "عضو — وصول عادي", "Üye — normal erişim")}
                      </option>
                      <option value="manager">
                        {t("Manager — can manage team", "مدير — يمكنه إدارة الفريق", "Yönetici — ekibi yönetebilir")}
                      </option>
                    </select>
                  </label>
                  {inviteError && (
                    <p className="text-xs text-rose-700">{inviteError}</p>
                  )}
                  <button
                    onClick={handleSendInvite}
                    disabled={!inviteEmail.trim() || inviting}
                    className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {inviting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    {t("Send invitation", "إرسال الدعوة", "Davet gönder")}
                  </button>
                </>
              )}
            </StepFrame>
          )}

          {/* ─── Step 7: Done ─────────────────────────────────── */}
          {step === "done" && (
            <StepFrame
              icon={<PartyPopper className="w-6 h-6 text-sky-500" />}
              title={t("You're all set!", "أنت جاهز!", "Hazırsınız!")}
              subtitle={t(
                "Let's create your first customer to see how it all works.",
                "دعنا ننشئ أول عميل لك لنرى كيف يعمل كل شيء.",
                "Her şeyin nasıl çalıştığını görmek için ilk müşterinizi oluşturalım."
              )}
            >
              <div className="rounded-lg border border-sky-200 bg-gradient-to-br from-sky-50 to-sky-50 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-sky-900">
                    <div className="font-semibold">
                      {companyName || status?.company.name}
                    </div>
                    <div className="text-xs text-sky-600 mt-0.5">
                      {COUNTRIES.find((c) => c.code === country)?.[locale] || country} ·{" "}
                      {baseCurrency} ·{" "}
                      {preferredLocale === "ar"
                        ? "العربية"
                        : preferredLocale === "tr"
                          ? "Türkçe"
                          : "English"}
                    </div>
                  </div>
                </div>
                {inviteSent && (
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-sky-900">
                      {t(
                        `Invitation sent to ${inviteEmail}`,
                        `تم إرسال دعوة إلى ${inviteEmail}`,
                        `${inviteEmail} adresine davet gönderildi`
                      )}
                    </div>
                  </div>
                )}
              </div>
              {error && (
                <p className="text-sm text-rose-700 mt-3">{error}</p>
              )}
            </StepFrame>
          )}
        </div>
      </main>

      {/* Footer nav */}
      <footer className="border-t border-sky-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={stepIdx === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
            {t("Back", "السابق", "Geri")}
          </button>

          <div className="flex items-center gap-2">
            {canSkip && (
              <button
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-sky-600"
              >
                <SkipForward className="w-4 h-4" />
                {t("Skip for now", "تخطَّ الآن", "Şimdilik atla")}
              </button>
            )}

            {step === "done" ? (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PartyPopper className="w-4 h-4" />
                )}
                {t(
                  "Create my first customer",
                  "أنشئ أول عميل لي",
                  "İlk müşterimi oluştur"
                )}
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("Next", "التالي", "İleri")}
                <ArrowRight
                  className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// StepFrame — consistent card around each step's body content
// ──────────────────────────────────────────────────────────────────────

function StepFrame({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-sky-900">{title}</h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
