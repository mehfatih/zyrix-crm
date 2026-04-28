import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { Code2, Key, Zap, ArrowRight, Lock, Sparkles, BookOpen } from "lucide-react";

// ============================================================================
// API REFERENCE PAGE
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "API Reference — Zyrix CRM",
    ar: "مرجع API — Zyrix CRM",
    tr: "API Referansı — Zyrix CRM",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: "Complete API reference for Zyrix CRM — authenticate, query customers, manage deals, send WhatsApp messages, and more.",
  };
}

const ENDPOINTS: {
  category: { en: string; ar: string; tr: string };
  items: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    desc: { en: string; ar: string; tr: string };
    auth?: boolean;
  }[];
}[] = [
  {
    category: { en: "Authentication", ar: "المصادقة", tr: "Kimlik Doğrulama" },
    items: [
      { method: "POST", path: "/api/auth/signup", desc: { en: "Create a new account and company", ar: "إنشاء حساب وشركة جديدة", tr: "Yeni hesap ve şirket oluşturma" } },
      { method: "POST", path: "/api/auth/login", desc: { en: "Sign in with email and password", ar: "تسجيل الدخول بالبريد وكلمة المرور", tr: "E-posta ve parola ile giriş" } },
      { method: "POST", path: "/api/auth/refresh", desc: { en: "Exchange refresh token for new access token", ar: "تبديل رمز التحديث بوصول جديد", tr: "Yenileme belirtecini yeni erişim belirteci ile değiştir" } },
      { method: "POST", path: "/api/auth/logout", desc: { en: "Invalidate current session", ar: "إبطال الجلسة الحالية", tr: "Mevcut oturumu geçersiz kıl" } },
    ],
  },
  {
    category: { en: "Customers", ar: "العملاء", tr: "Müşteriler" },
    items: [
      { method: "GET", path: "/api/customers", desc: { en: "List customers with pagination and filters", ar: "قائمة العملاء مع الترقيم والفلاتر", tr: "Sayfalama ve filtrelerle müşterileri listele" }, auth: true },
      { method: "POST", path: "/api/customers", desc: { en: "Create a new customer record", ar: "إنشاء سجل عميل جديد", tr: "Yeni müşteri kaydı oluştur" }, auth: true },
      { method: "GET", path: "/api/customers/:id", desc: { en: "Get customer details by ID", ar: "الحصول على تفاصيل العميل بواسطة ID", tr: "Kimliğe göre müşteri detaylarını al" }, auth: true },
      { method: "PUT", path: "/api/customers/:id", desc: { en: "Update customer fields", ar: "تحديث حقول العميل", tr: "Müşteri alanlarını güncelle" }, auth: true },
      { method: "DELETE", path: "/api/customers/:id", desc: { en: "Delete a customer (with cascade)", ar: "حذف عميل (مع cascade)", tr: "Müşteriyi sil (cascade ile)" }, auth: true },
    ],
  },
  {
    category: { en: "Deals & Pipeline", ar: "الصفقات وخط المبيعات", tr: "Anlaşmalar & Huni" },
    items: [
      { method: "GET", path: "/api/deals", desc: { en: "List deals with stage, value, and owner filters", ar: "قائمة الصفقات مع فلاتر المرحلة والقيمة والمالك", tr: "Aşama, değer ve sahip filtreleriyle anlaşmaları listele" }, auth: true },
      { method: "POST", path: "/api/deals", desc: { en: "Create a new deal", ar: "إنشاء صفقة جديدة", tr: "Yeni anlaşma oluştur" }, auth: true },
      { method: "PUT", path: "/api/deals/:id", desc: { en: "Update deal (moving to won triggers commissions)", ar: "تحديث الصفقة (الانتقال إلى won يُشغّل العمولات)", tr: "Anlaşmayı güncelle (won'a taşınması komisyonları tetikler)" }, auth: true },
    ],
  },
  {
    category: { en: "WhatsApp", ar: "واتساب", tr: "WhatsApp" },
    items: [
      { method: "POST", path: "/api/whatsapp/webhook", desc: { en: "Meta Cloud webhook (public, no auth)", ar: "webhook من Meta Cloud (عام بلا مصادقة)", tr: "Meta Cloud webhook (herkese açık, auth yok)" } },
      { method: "GET", path: "/api/whatsapp/inbox", desc: { en: "Grouped conversations with customer lookup", ar: "محادثات مجمعة مع ربط العملاء", tr: "Müşteri aramasıyla gruplanmış konuşmalar" }, auth: true },
      { method: "POST", path: "/api/whatsapp/send", desc: { en: "Send message via Meta Graph API", ar: "إرسال رسالة عبر Meta Graph API", tr: "Meta Graph API ile mesaj gönder" }, auth: true },
    ],
  },
  {
    category: { en: "Reports", ar: "التقارير", tr: "Raporlar" },
    items: [
      { method: "GET", path: "/api/reports/revenue", desc: { en: "Won revenue normalized to target currency", ar: "الإيرادات الرابحة محولة إلى العملة الهدف", tr: "Hedef para birimine normalleştirilmiş kazanılan gelir" }, auth: true },
      { method: "GET", path: "/api/reports/pipeline", desc: { en: "Open pipeline weighted by probability", ar: "خط المبيعات المفتوح مرجح بالاحتمالية", tr: "Olasılıkla ağırlıklandırılmış açık huni" }, auth: true },
      { method: "GET", path: "/api/reports/rates", desc: { en: "List configured exchange rates", ar: "قائمة أسعار الصرف المكوّنة", tr: "Yapılandırılmış döviz kurlarını listele" }, auth: true },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-sky-500/15 text-primary",
  POST: "bg-emerald-500/15 text-emerald-300",
  PUT: "bg-amber-500/15 text-amber-300",
  DELETE: "bg-destructive/15 text-destructive",
};

export default async function ApiReferencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "en" | "ar" | "tr";

  const copy = {
    en: {
      hero: { badge: "API Reference", title: "Build anything on top of Zyrix", subtitle: "RESTful API, JWT authentication, sensible pagination. Fully documented with examples." },
      baseUrl: "Base URL",
      authHeader: "Authentication header",
      authDesc: "All endpoints except public webhooks require a Bearer token in the Authorization header.",
      rateLimit: "Rate limits",
      rateLimitDesc: "Free plan: 60 requests/minute. Paid plans: 600+ requests/minute.",
      comingSoon: "Full OpenAPI spec and interactive playground coming soon.",
    },
    ar: {
      hero: { badge: "مرجع API", title: "ابنِ أي شيء فوق Zyrix", subtitle: "RESTful API، مصادقة JWT، ترقيم صفحات منطقي. موثّق بالكامل مع أمثلة." },
      baseUrl: "الرابط الأساسي",
      authHeader: "ترويسة المصادقة",
      authDesc: "جميع الـ endpoints باستثناء webhooks العامة تتطلب Bearer token في ترويسة Authorization.",
      rateLimit: "حدود المعدّل",
      rateLimitDesc: "الخطة المجانية: 60 طلب/دقيقة. الخطط المدفوعة: 600+ طلب/دقيقة.",
      comingSoon: "مواصفات OpenAPI الكاملة وساحة اختبار تفاعلية قريباً.",
    },
    tr: {
      hero: { badge: "API Referansı", title: "Zyrix üzerine her şeyi inşa edin", subtitle: "RESTful API, JWT kimlik doğrulama, mantıklı sayfalama. Örneklerle tamamen belgelenmiş." },
      baseUrl: "Temel URL",
      authHeader: "Kimlik doğrulama başlığı",
      authDesc: "Herkese açık webhook'lar hariç tüm endpoint'ler Authorization başlığında Bearer token gerektirir.",
      rateLimit: "Hız sınırları",
      rateLimitDesc: "Ücretsiz plan: 60 istek/dakika. Ücretli planlar: 600+ istek/dakika.",
      comingSoon: "Tam OpenAPI spesifikasyonu ve etkileşimli oyun alanı yakında.",
    },
  };
  const t = copy[L];

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded-full mb-4">
            <Code2 className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Quick start callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <CalloutCard
            icon={<Zap className="w-5 h-5" />}
            title={t.baseUrl}
            body={
              <code className="text-xs font-mono text-foreground break-all">
                https://api.crm.zyrix.co
              </code>
            }
            color="cyan"
          />
          <CalloutCard
            icon={<Key className="w-5 h-5" />}
            title={t.authHeader}
            body={
              <code className="text-[11px] font-mono text-foreground">
                Authorization: Bearer &lt;token&gt;
              </code>
            }
            color="emerald"
          />
          <CalloutCard
            icon={<Lock className="w-5 h-5" />}
            title={t.rateLimit}
            body={<span className="text-xs text-muted-foreground">{t.rateLimitDesc}</span>}
            color="amber"
          />
        </div>

        {/* Endpoints by category */}
        <div className="space-y-10">
          {ENDPOINTS.map((cat, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {cat.category[L]}
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {cat.items.map((ep, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 border-b last:border-b-0 border-border hover:bg-muted/50 flex items-center gap-3 flex-wrap"
                  >
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${METHOD_COLORS[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-foreground flex-1 min-w-0">
                      {ep.path}
                    </code>
                    <span className="text-xs text-muted-foreground w-full md:w-auto md:max-w-sm">
                      {ep.desc[L]}
                    </span>
                    {ep.auth && (
                      <span className="text-[10px] text-white/60 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        auth
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-12 text-center bg-muted/50 rounded-2xl p-6 border border-border">
          <Sparkles className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t.comingSoon}</p>
          <Link
            href={`/${locale}/docs`}
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary hover:text-primary/80"
          >
            <BookOpen className="w-4 h-4" />
            Documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

function CalloutCard({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  color: "cyan" | "emerald" | "amber";
}) {
  const c: Record<string, string> = {
    cyan: "bg-sky-500/10 text-primary border-sky-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-2 ${c[color]}`}>
        {icon}
      </div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        {title}
      </div>
      <div>{body}</div>
    </div>
  );
}
