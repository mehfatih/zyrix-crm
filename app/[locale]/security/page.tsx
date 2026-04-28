import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  Shield,
  Lock,
  Key,
  Server,
  Database,
  FileCheck,
  UserCheck,
  Eye,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

// ============================================================================
// SECURITY PAGE — data protection, infra, compliance
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "Security — Zyrix CRM",
    ar: "الأمان — Zyrix CRM",
    tr: "Güvenlik — Zyrix CRM",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: "Data protection, infrastructure, and compliance practices at Zyrix.",
  };
}

const PILLARS: {
  Icon: typeof Shield;
  color: string;
  title: { en: string; ar: string; tr: string };
  body: { en: string; ar: string; tr: string };
  items: { en: string; ar: string; tr: string }[];
}[] = [
  {
    Icon: Lock,
    color: "from-emerald-500 to-teal-600",
    title: {
      en: "Encryption everywhere",
      ar: "تشفير في كل مكان",
      tr: "Her yerde şifreleme",
    },
    body: {
      en: "All data in transit is protected by TLS 1.3. All data at rest is encrypted with AES-256 including database backups.",
      ar: "جميع البيانات أثناء النقل محمية بـ TLS 1.3. جميع البيانات المحفوظة مشفرة بـ AES-256 بما في ذلك نسخ قاعدة البيانات الاحتياطية.",
      tr: "Aktarımdaki tüm veriler TLS 1.3 ile korunur. Durağan tüm veriler, veritabanı yedekleri dahil AES-256 ile şifrelenir.",
    },
    items: [
      { en: "TLS 1.3 on all endpoints", ar: "TLS 1.3 على جميع الـ endpoints", tr: "Tüm endpoint'lerde TLS 1.3" },
      { en: "AES-256 at rest", ar: "AES-256 للبيانات المحفوظة", tr: "Durağan için AES-256" },
      { en: "Encrypted automated backups", ar: "نسخ احتياطية آلية مشفرة", tr: "Şifreli otomatik yedeklemeler" },
    ],
  },
  {
    Icon: Key,
    color: "from-sky-400 to-sky-600",
    title: {
      en: "Strong authentication",
      ar: "مصادقة قوية",
      tr: "Güçlü kimlik doğrulama",
    },
    body: {
      en: "JWT tokens with short-lived access (15 min) and rotating refresh tokens (7 days). Password hashing uses bcrypt with modern cost factors.",
      ar: "رموز JWT بوصول قصير الأمد (15 دقيقة) ورموز تجديد دوّارة (7 أيام). تجزئة كلمات المرور تستخدم bcrypt مع عوامل تكلفة حديثة.",
      tr: "Kısa ömürlü erişim (15 dk) ve dönüşümlü yenileme (7 gün) JWT belirteçleri. Parola hashing modern maliyet faktörlü bcrypt kullanır.",
    },
    items: [
      { en: "Short-lived access tokens", ar: "رموز وصول قصيرة الأمد", tr: "Kısa ömürlü erişim belirteçleri" },
      { en: "Rotating refresh tokens", ar: "رموز تجديد دوّارة", tr: "Dönüşümlü yenileme belirteçleri" },
      { en: "bcrypt password hashing", ar: "تجزئة كلمات المرور بـ bcrypt", tr: "bcrypt parola hashing" },
      { en: "Google OAuth 2.0 support", ar: "دعم Google OAuth 2.0", tr: "Google OAuth 2.0 desteği" },
    ],
  },
  {
    Icon: UserCheck,
    color: "from-indigo-500 to-blue-600",
    title: {
      en: "Role-based access control",
      ar: "التحكم بالوصول حسب الدور",
      tr: "Rol bazlı erişim kontrolü",
    },
    body: {
      en: "5 distinct roles (super_admin, owner, admin, manager, member) with granular permissions on every endpoint. Impersonation tracked with audit logs.",
      ar: "5 أدوار مميزة (super_admin, owner, admin, manager, member) مع صلاحيات دقيقة على كل endpoint. انتحال الشخصية مُتتبع بسجلات تدقيق.",
      tr: "Her endpoint'te ayrıntılı izinlere sahip 5 farklı rol (super_admin, owner, admin, manager, member). Kimliğe bürünme denetim kayıtlarıyla izlenir.",
    },
    items: [
      { en: "Multi-tier role hierarchy", ar: "هرمية أدوار متعددة المستويات", tr: "Çok katmanlı rol hiyerarşisi" },
      { en: "Per-endpoint permission checks", ar: "فحوصات صلاحيات لكل endpoint", tr: "Endpoint başına izin kontrolleri" },
      { en: "Auditable admin impersonation", ar: "انتحال شخصية المسؤول قابل للتدقيق", tr: "Denetlenebilir yönetici kimliğe bürünme" },
    ],
  },
  {
    Icon: Server,
    color: "from-violet-500 to-purple-600",
    title: {
      en: "Enterprise infrastructure",
      ar: "بنية تحتية للمؤسسات",
      tr: "Kurumsal altyapı",
    },
    body: {
      en: "Hosted on Railway and Vercel with global CDN, automatic DDoS protection, and 99.9% SLA target. Database backed up every 24 hours with point-in-time recovery.",
      ar: "مستضاف على Railway و Vercel مع CDN عالمي وحماية DDoS تلقائية وهدف SLA بنسبة 99.9%. قاعدة البيانات مُدعّمة كل 24 ساعة مع استعادة في نقطة زمنية.",
      tr: "Küresel CDN, otomatik DDoS koruması ve %99.9 SLA hedefiyle Railway ve Vercel'de barındırılır. Veritabanı her 24 saatte bir point-in-time recovery ile yedeklenir.",
    },
    items: [
      { en: "Global edge CDN", ar: "CDN حافة عالمي", tr: "Küresel edge CDN" },
      { en: "Automatic DDoS mitigation", ar: "تخفيف DDoS تلقائي", tr: "Otomatik DDoS hafifletme" },
      { en: "Daily database backups", ar: "نسخ احتياطية يومية لقاعدة البيانات", tr: "Günlük veritabanı yedeklemeleri" },
      { en: "Point-in-time recovery", ar: "استعادة في نقطة زمنية", tr: "Point-in-time recovery" },
    ],
  },
  {
    Icon: Database,
    color: "from-amber-500 to-orange-600",
    title: {
      en: "Data isolation",
      ar: "عزل البيانات",
      tr: "Veri izolasyonu",
    },
    body: {
      en: "Every query filters by companyId at the application layer. No cross-tenant data leakage is possible by design.",
      ar: "كل استعلام يُصفّى حسب companyId في طبقة التطبيق. لا تسرب للبيانات بين المستأجرين بحكم التصميم.",
      tr: "Her sorgu uygulama katmanında companyId ile filtrelenir. Tasarım gereği kiracılar arası veri sızıntısı imkansız.",
    },
    items: [
      { en: "Per-company row-level filtering", ar: "تصفية على مستوى الصف لكل شركة", tr: "Şirket başına satır seviyesi filtreleme" },
      { en: "No shared caches between tenants", ar: "لا توجد ذاكرات مؤقتة مشتركة", tr: "Kiracılar arası paylaşılan önbellek yok" },
      { en: "Full data export on request", ar: "تصدير كامل للبيانات عند الطلب", tr: "İstek üzerine tam veri dışa aktarımı" },
    ],
  },
  {
    Icon: FileCheck,
    color: "from-rose-500 to-pink-600",
    title: {
      en: "Compliance & privacy",
      ar: "الامتثال والخصوصية",
      tr: "Uyumluluk & gizlilik",
    },
    body: {
      en: "Aligned with GDPR, KVKK (Turkey), and Saudi PDPL. Right to export, right to delete, and full transparency on subprocessors.",
      ar: "متوافق مع GDPR و KVKK (Türkiye) و PDPL السعودي. الحق في التصدير، الحق في الحذف، وشفافية كاملة في المعالجين الفرعيين.",
      tr: "GDPR, KVKK (Türkiye) ve Suudi PDPL ile uyumlu. Dışa aktarma hakkı, silme hakkı ve alt işleyicilerde tam şeffaflık.",
    },
    items: [
      { en: "GDPR aligned", ar: "متوافق مع GDPR", tr: "GDPR uyumlu" },
      { en: "KVKK compliant", ar: "متوافق مع KVKK", tr: "KVKK uyumlu" },
      { en: "Saudi PDPL aligned", ar: "متوافق مع PDPL السعودي", tr: "Suudi PDPL uyumlu" },
      { en: "Data Subject Rights API", ar: "API لحقوق أصحاب البيانات", tr: "Veri Sahibi Hakları API'si" },
    ],
  },
];

export default async function SecurityPage({
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
      hero: { badge: "Security", title: "Your data is safe with us", subtitle: "We take the security of our customers' data seriously. Here is exactly how we protect it." },
      contact: "Report a vulnerability",
      contactDesc: "If you've discovered a security issue, please email us at",
    },
    ar: {
      hero: { badge: "الأمان", title: "بياناتك آمنة معنا", subtitle: "نأخذ أمان بيانات عملائنا على محمل الجد. إليك بالضبط كيف نحميها." },
      contact: "الإبلاغ عن ثغرة",
      contactDesc: "إذا اكتشفت مشكلة أمنية، أرسل لنا بريداً إلى",
    },
    tr: {
      hero: { badge: "Güvenlik", title: "Verileriniz bizde güvende", subtitle: "Müşterilerimizin verilerinin güvenliğini ciddiye alıyoruz. İşte tam olarak nasıl koruduğumuz." },
      contact: "Güvenlik açığı bildir",
      contactDesc: "Bir güvenlik sorunu keşfettiyseniz, lütfen şu adrese e-posta gönderin",
    },
  };
  const t = copy[L];

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded-full mb-4">
            <Shield className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {PILLARS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} text-white mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  {p.title[L]}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {p.body[L]}
                </p>
                <ul className="space-y-1.5">
                  {p.items.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {it[L]}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-sky-300" />
          <h2 className="text-xl font-bold mb-2">{t.contact}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t.contactDesc}{" "}
            <a
              href="mailto:security@zyrix.co"
              className="text-sky-300 hover:text-sky-300 font-mono"
            >
              security@zyrix.co
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
