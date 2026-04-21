import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Rocket,
  Users,
  MessageCircle,
  FileText,
  DollarSign,
  Award,
  BarChart3,
  Settings2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ============================================================================
// DOCUMENTATION PAGE — getting-started hub with feature deep-dives
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "Documentation — Zyrix CRM",
    ar: "الوثائق — Zyrix CRM",
    tr: "Dokümantasyon — Zyrix CRM",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: "Guides, tutorials, and reference documentation for Zyrix CRM.",
  };
}

const SECTIONS: {
  id: string;
  Icon: typeof BookOpen;
  color: string;
  title: { en: string; ar: string; tr: string };
  desc: { en: string; ar: string; tr: string };
  articles: { en: string; ar: string; tr: string }[];
}[] = [
  {
    id: "getting-started",
    Icon: Rocket,
    color: "from-cyan-500 to-sky-600",
    title: { en: "Getting Started", ar: "البدء", tr: "Başlarken" },
    desc: {
      en: "Create your account, invite your team, and import customers in under 10 minutes.",
      ar: "أنشئ حسابك، ادعُ فريقك، واستورد العملاء في أقل من 10 دقائق.",
      tr: "Hesabınızı oluşturun, ekibinizi davet edin ve 10 dakikadan kısa sürede müşterileri içe aktarın.",
    },
    articles: [
      { en: "Quick setup guide", ar: "دليل الإعداد السريع", tr: "Hızlı kurulum kılavuzu" },
      { en: "Inviting team members and setting roles", ar: "دعوة أعضاء الفريق وتحديد الأدوار", tr: "Ekip üyelerini davet etme ve rol belirleme" },
      { en: "Importing customers from CSV or Excel", ar: "استيراد العملاء من CSV أو Excel", tr: "CSV veya Excel'den müşteri içe aktarma" },
      { en: "Connecting WhatsApp Business", ar: "ربط واتساب للأعمال", tr: "WhatsApp Business bağlama" },
    ],
  },
  {
    id: "customers-deals",
    Icon: Users,
    color: "from-emerald-500 to-teal-600",
    title: { en: "Customers & Deals", ar: "العملاء والصفقات", tr: "Müşteriler & Anlaşmalar" },
    desc: {
      en: "Manage your customer database, run sales pipelines, and track every interaction.",
      ar: "إدارة قاعدة بيانات العملاء، وتشغيل خطوط المبيعات، وتتبع كل تفاعل.",
      tr: "Müşteri veritabanınızı yönetin, satış hunilerini çalıştırın ve her etkileşimi takip edin.",
    },
    articles: [
      { en: "Customer profile fields and tags", ar: "حقول ملف العميل والوسوم", tr: "Müşteri profil alanları ve etiketler" },
      { en: "Pipeline stages and probability", ar: "مراحل خط المبيعات والاحتمالية", tr: "Huni aşamaları ve olasılık" },
      { en: "Tracking activities and notes", ar: "تتبع الأنشطة والملاحظات", tr: "Etkinlikleri ve notları izleme" },
      { en: "Ownership and team collaboration", ar: "الملكية والتعاون ضمن الفريق", tr: "Sahiplik ve ekip işbirliği" },
    ],
  },
  {
    id: "whatsapp",
    Icon: MessageCircle,
    color: "from-green-500 to-emerald-600",
    title: { en: "WhatsApp CRM", ar: "واتساب CRM", tr: "WhatsApp CRM" },
    desc: {
      en: "Connect your WhatsApp Business account and let AI auto-extract customer data from messages.",
      ar: "اربط حساب واتساب للأعمال ودع الذكاء الاصطناعي يستخرج بيانات العملاء تلقائياً.",
      tr: "WhatsApp Business hesabınızı bağlayın ve AI'ın mesajlardan müşteri verilerini otomatik çıkarmasına izin verin.",
    },
    articles: [
      { en: "Setting up Meta Cloud API webhook", ar: "إعداد webhook لـ Meta Cloud API", tr: "Meta Cloud API webhook kurulumu" },
      { en: "AI customer data extraction", ar: "استخراج بيانات العملاء بالذكاء الاصطناعي", tr: "AI ile müşteri verisi çıkarma" },
      { en: "Suggested replies in Arabic dialects", ar: "الردود المقترحة باللهجات العربية", tr: "Arapça lehçelerinde önerilen yanıtlar" },
      { en: "Conversation history and thread view", ar: "سجل المحادثات وعرض المسار", tr: "Konuşma geçmişi ve iş parçacığı görünümü" },
    ],
  },
  {
    id: "quotes-contracts",
    Icon: FileText,
    color: "from-indigo-500 to-blue-600",
    title: { en: "Quotes & Contracts", ar: "العروض والعقود", tr: "Teklifler & Sözleşmeler" },
    desc: {
      en: "Generate professional quotes, track acceptance, and manage contract renewals.",
      ar: "إنشاء عروض أسعار احترافية، وتتبع القبول، وإدارة تجديدات العقود.",
      tr: "Profesyonel teklifler oluşturun, kabulü takip edin ve sözleşme yenilemelerini yönetin.",
    },
    articles: [
      { en: "Creating and sending quotes", ar: "إنشاء وإرسال العروض", tr: "Teklif oluşturma ve gönderme" },
      { en: "Public shareable quote links", ar: "روابط عروض قابلة للمشاركة", tr: "Herkese açık paylaşılabilir teklif bağlantıları" },
      { en: "Contract management and e-signing", ar: "إدارة العقود والتوقيع الإلكتروني", tr: "Sözleşme yönetimi ve e-imza" },
      { en: "Auto renewal reminders", ar: "تذكيرات التجديد التلقائية", tr: "Otomatik yenileme hatırlatmaları" },
    ],
  },
  {
    id: "finance",
    Icon: DollarSign,
    color: "from-amber-500 to-orange-600",
    title: { en: "Finance & AI CFO", ar: "التمويل والمدير المالي الذكي", tr: "Finans & AI CFO" },
    desc: {
      en: "Cash flow forecasts, tax calculations, commissions, and AI-driven financial insights.",
      ar: "توقعات التدفق النقدي وحسابات الضرائب والعمولات والرؤى المالية المدعومة بالذكاء الاصطناعي.",
      tr: "Nakit akışı tahminleri, vergi hesaplamaları, komisyonlar ve AI destekli finansal içgörüler.",
    },
    articles: [
      { en: "Setting up tax rates (KDV, VAT)", ar: "إعداد أسعار الضرائب (KDV, VAT)", tr: "Vergi oranlarını ayarlama (KDV, VAT)" },
      { en: "Commission rules and auto-calculation", ar: "قواعد العمولات والحساب التلقائي", tr: "Komisyon kuralları ve otomatik hesaplama" },
      { en: "Cash flow forecast methodology", ar: "منهجية توقعات التدفق النقدي", tr: "Nakit akışı tahmin metodolojisi" },
      { en: "Asking the AI CFO financial questions", ar: "طرح أسئلة مالية على المدير المالي الذكي", tr: "AI CFO'ya finansal sorular sorma" },
    ],
  },
  {
    id: "loyalty-campaigns",
    Icon: Award,
    color: "from-pink-500 to-rose-600",
    title: { en: "Loyalty & Campaigns", ar: "الولاء والحملات", tr: "Sadakat & Kampanyalar" },
    desc: {
      en: "Reward returning customers and run targeted email/SMS campaigns.",
      ar: "مكافأة العملاء العائدين وتشغيل حملات بريدية/SMS مستهدفة.",
      tr: "Dönen müşterileri ödüllendirin ve hedefli e-posta/SMS kampanyaları çalıştırın.",
    },
    articles: [
      { en: "Configuring loyalty points and tiers", ar: "تكوين نقاط الولاء والمستويات", tr: "Sadakat puanlarını ve seviyelerini yapılandırma" },
      { en: "Building a campaign audience", ar: "بناء جمهور الحملة", tr: "Kampanya kitlesi oluşturma" },
      { en: "Email templates and personalization", ar: "قوالب البريد والتخصيص", tr: "E-posta şablonları ve kişiselleştirme" },
      { en: "Tracking opens, clicks, and conversions", ar: "تتبع الفتحات والنقرات والتحويلات", tr: "Açılma, tıklama ve dönüşümleri izleme" },
    ],
  },
  {
    id: "reports",
    Icon: BarChart3,
    color: "from-violet-500 to-purple-600",
    title: { en: "Reports & Analytics", ar: "التقارير والتحليلات", tr: "Raporlar & Analitik" },
    desc: {
      en: "Dashboards adapted to your role, multi-currency reporting, and custom exports.",
      ar: "لوحات تحكم تتكيّف مع دورك، وتقارير متعددة العملات، وتصديرات مخصصة.",
      tr: "Rolünüze uyarlanmış panolar, çok para birimli raporlama ve özel dışa aktarımlar.",
    },
    articles: [
      { en: "Role-based dashboard explained", ar: "شرح لوحة التحكم حسب الدور", tr: "Rol bazlı panel açıklaması" },
      { en: "Setting custom exchange rates", ar: "إعداد أسعار صرف مخصصة", tr: "Özel döviz kurları ayarlama" },
      { en: "Pipeline and revenue reports", ar: "تقارير خط المبيعات والإيرادات", tr: "Huni ve gelir raporları" },
      { en: "Exporting to Excel and PDF", ar: "التصدير إلى Excel و PDF", tr: "Excel ve PDF'e aktarma" },
    ],
  },
  {
    id: "admin-security",
    Icon: ShieldCheck,
    color: "from-slate-600 to-slate-800",
    title: { en: "Admin & Security", ar: "الإدارة والأمان", tr: "Yönetim & Güvenlik" },
    desc: {
      en: "User roles, permissions, audit logs, and data security practices.",
      ar: "أدوار المستخدمين والصلاحيات وسجلات التدقيق وممارسات أمان البيانات.",
      tr: "Kullanıcı rolleri, izinler, denetim günlükleri ve veri güvenliği uygulamaları.",
    },
    articles: [
      { en: "User roles and permissions matrix", ar: "مصفوفة أدوار المستخدمين والصلاحيات", tr: "Kullanıcı rolleri ve izin matrisi" },
      { en: "Password and two-factor authentication", ar: "كلمة المرور والمصادقة الثنائية", tr: "Parola ve iki faktörlü kimlik doğrulama" },
      { en: "Data backup and export", ar: "نسخ البيانات احتياطياً والتصدير", tr: "Veri yedekleme ve dışa aktarma" },
      { en: "GDPR and privacy compliance", ar: "الامتثال لـ GDPR والخصوصية", tr: "GDPR ve gizlilik uyumluluğu" },
    ],
  },
];

export default async function DocsPage({
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
      hero: { badge: "Documentation", title: "Everything you need to master Zyrix", subtitle: "From first signup to advanced workflows. Organized by topic, written for the real world." },
      articleCount: "articles",
      contactHint: "Can't find what you're looking for? Contact support anytime.",
      contactCta: "Contact support",
    },
    ar: {
      hero: { badge: "الوثائق", title: "كل ما تحتاجه لإتقان Zyrix", subtitle: "من التسجيل الأول إلى سير العمل المتقدم. منظمة حسب الموضوع، مكتوبة للعالم الحقيقي." },
      articleCount: "مقالات",
      contactHint: "لم تجد ما تبحث عنه؟ تواصل مع الدعم في أي وقت.",
      contactCta: "تواصل مع الدعم",
    },
    tr: {
      hero: { badge: "Dokümantasyon", title: "Zyrix'te ustalaşmak için ihtiyacınız olan her şey", subtitle: "İlk kayıttan gelişmiş iş akışlarına kadar. Konuya göre düzenlenmiş, gerçek dünya için yazılmış." },
      articleCount: "makale",
      contactHint: "Aradığınızı bulamıyor musunuz? Her zaman destek ile iletişime geçin.",
      contactCta: "Destek ile iletişime geç",
    },
  };
  const t = copy[L];

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((sec) => {
            const Icon = sec.Icon;
            return (
              <div
                key={sec.id}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${sec.color} text-white mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {sec.title[L]}
                </h2>
                <p className="text-sm text-slate-600 mb-4">{sec.desc[L]}</p>
                <ul className="space-y-2 mb-4">
                  {sec.articles.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      {a[L]}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {sec.articles.length} {t.articleCount}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100 text-center">
          <Sparkles className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t.contactHint}
          </h3>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {t.contactCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
