import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";

// ============================================================================
// BLOG PAGE — currently curated editorial, evolves into CMS later
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "Blog — Zyrix CRM",
    ar: "المدوّنة — Zyrix CRM",
    tr: "Blog — Zyrix CRM",
  };
  const descriptions = {
    en: "Guides, insights, and product updates on CRM, WhatsApp sales, AI-driven finance, and growing businesses in MENA and Türkiye.",
    ar: "أدلّة ورؤى وتحديثات منتجات حول CRM ومبيعات واتساب والتمويل بالذكاء الاصطناعي وتنمية الأعمال في منطقة الشرق الأوسط وTürkiye.",
    tr: "CRM, WhatsApp satış, AI destekli finans ve MENA ile Türkiye'de işletme büyütme üzerine rehberler, içgörüler ve ürün güncellemeleri.",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] ?? descriptions.en,
  };
}

const POSTS: {
  slug: string;
  category: { en: string; ar: string; tr: string };
  title: { en: string; ar: string; tr: string };
  excerpt: { en: string; ar: string; tr: string };
  date: string;
  readTime: number;
  color: string;
}[] = [
  {
    slug: "launching-zyrix-crm",
    category: { en: "Announcement", ar: "إعلان", tr: "Duyuru" },
    title: {
      en: "Launching Zyrix CRM — a fresh take on customer relationships for MENA and Türkiye",
      ar: "إطلاق Zyrix CRM — نهج جديد لإدارة علاقات العملاء في الشرق الأوسط وTürkiye",
      tr: "Zyrix CRM lansmanı — MENA ve Türkiye için müşteri ilişkilerine yeni bir bakış",
    },
    excerpt: {
      en: "We spent two years studying why teams in Istanbul, Riyadh, and Cairo abandoned their CRMs. Here is what we built differently.",
      ar: "أمضينا عامَين ندرس لماذا تخلّت فرق إسطنبول والرياض والقاهرة عن أنظمتها السابقة. هذا ما بنيناه بشكل مختلف.",
      tr: "İstanbul, Riyad ve Kahire'deki ekiplerin CRM'lerini neden bıraktığını iki yıl inceledik. Farklı olarak ne inşa ettik işte burada.",
    },
    date: "2026-04-18",
    readTime: 8,
    color: "from-sky-400 to-sky-600",
  },
  {
    slug: "whatsapp-sales-playbook",
    category: { en: "Sales", ar: "مبيعات", tr: "Satış" },
    title: {
      en: "The WhatsApp sales playbook: closing deals in 3 messages or less",
      ar: "دليل مبيعات واتساب: إغلاق الصفقات في 3 رسائل أو أقل",
      tr: "WhatsApp satış el kitabı: 3 mesaj veya daha azda anlaşma kapatma",
    },
    excerpt: {
      en: "Our data from 500+ merchants shows a consistent pattern — teams that respond within 5 minutes close 4x more. Here is the exact framework.",
      ar: "تُظهر بياناتنا من أكثر من 500 تاجر نمطاً ثابتاً — الفرق التي تستجيب خلال 5 دقائق تُغلق 4 أضعاف الصفقات. إليك الإطار الدقيق.",
      tr: "500'den fazla satıcıdan verilerimiz tutarlı bir örüntü gösteriyor — 5 dakika içinde yanıt veren ekipler 4 kat daha fazla anlaşma kapatıyor. İşte tam çerçeve.",
    },
    date: "2026-04-10",
    readTime: 12,
    color: "from-emerald-500 to-teal-600",
  },
  {
    slug: "ai-cfo-explained",
    category: { en: "AI", ar: "ذكاء اصطناعي", tr: "AI" },
    title: {
      en: "What does an AI CFO actually do for your SaaS?",
      ar: "ماذا يفعل المدير المالي الذكي فعلياً لمشروعك؟",
      tr: "AI CFO işletmeniz için gerçekten ne yapar?",
    },
    excerpt: {
      en: "Not fancy dashboards. Real financial decisions — cash flow alerts, overdue collection priorities, pricing suggestions based on your actual deal history.",
      ar: "ليست لوحات متحركة. قرارات مالية حقيقية — تنبيهات التدفق النقدي، أولويات التحصيل، اقتراحات التسعير المبنية على تاريخ صفقاتك الفعلي.",
      tr: "Gösterişli panolar değil. Gerçek finansal kararlar — nakit akışı uyarıları, gecikmiş tahsilat öncelikleri, gerçek anlaşma geçmişinize dayalı fiyatlandırma önerileri.",
    },
    date: "2026-04-02",
    readTime: 6,
    color: "from-violet-500 to-purple-600",
  },
  {
    slug: "arabic-crm-localization",
    category: { en: "Localization", ar: "توطين", tr: "Yerelleştirme" },
    title: {
      en: "Why 'Arabic support' isn't enough — the dialect problem every CRM ignores",
      ar: "لماذا 'دعم العربية' ليس كافياً — مشكلة اللهجات التي تتجاهلها كل أنظمة CRM",
      tr: "Neden 'Arapça desteği' yeterli değil — her CRM'nin görmezden geldiği lehçe sorunu",
    },
    excerpt: {
      en: "A customer in Dubai writing 'شوي' means 'a bit'. In Cairo it means something else entirely. Most AI models miss this. We did not.",
      ar: "عميل في دبي يكتب 'شوي' يعني 'قليلاً'. في القاهرة تعني شيئاً آخر تماماً. معظم نماذج الذكاء الاصطناعي تُفوّت هذا. نحن لم نفعل.",
      tr: "Dubai'deki bir müşteri 'شوي' yazdığında 'biraz' anlamına gelir. Kahire'de tamamen başka bir şey demektir. Çoğu AI modeli bunu kaçırır. Biz kaçırmadık.",
    },
    date: "2026-03-25",
    readTime: 9,
    color: "from-amber-500 to-orange-600",
  },
  {
    slug: "per-company-pricing",
    category: { en: "Business", ar: "أعمال", tr: "İş" },
    title: {
      en: "Why we chose per-company pricing (and why per-seat is broken for SMEs)",
      ar: "لماذا اخترنا التسعير لكل شركة (ولماذا التسعير لكل مستخدم محطم للشركات المتوسطة)",
      tr: "Neden şirket başına fiyatlandırmayı seçtik (ve koltuk başına KOBİ'ler için neden bozuk)",
    },
    excerpt: {
      en: "A 20-person team shouldn't pay 20x. Software costs don't scale linearly with users — our pricing reflects that reality.",
      ar: "فريق من 20 شخصاً لا يجب أن يدفع 20 ضعف التكلفة. تكاليف البرامج لا تُقاس خطياً مع المستخدمين — أسعارنا تعكس هذا الواقع.",
      tr: "20 kişilik bir ekip 20 kat ödememeli. Yazılım maliyetleri kullanıcılarla doğrusal ölçeklenmez — fiyatlandırmamız bu gerçekliği yansıtır.",
    },
    date: "2026-03-15",
    readTime: 7,
    color: "from-indigo-500 to-blue-600",
  },
  {
    slug: "customer-loyalty-mena",
    category: { en: "Growth", ar: "نمو", tr: "Büyüme" },
    title: {
      en: "Building customer loyalty that actually works in MENA retail",
      ar: "بناء ولاء العملاء الذي يعمل فعلاً في تجارة التجزئة بمنطقة MENA",
      tr: "MENA perakendesinde gerçekten işe yarayan müşteri sadakati oluşturma",
    },
    excerpt: {
      en: "Points systems don't work when customers don't remember their passwords. We designed a loyalty layer built for phone-first shoppers.",
      ar: "أنظمة النقاط لا تعمل عندما لا يتذكر العملاء كلمات مرورهم. صمّمنا طبقة ولاء مبنية للمتسوقين من الهواتف أولاً.",
      tr: "Puan sistemleri müşteriler şifrelerini hatırlamadığında işe yaramaz. Telefon öncelikli alışverişçiler için bir sadakat katmanı tasarladık.",
    },
    date: "2026-03-05",
    readTime: 10,
    color: "from-pink-500 to-rose-600",
  },
];

export default async function BlogPage({
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
      hero: { badge: "Blog", title: "Stories, guides, and research", subtitle: "Deep-dive writing on CRM, WhatsApp sales, AI finance, and building SaaS for MENA and Türkiye." },
      readMore: "Read more",
      minRead: "min read",
      comingSoon: "More posts coming soon",
      comingSoonDesc: "We publish one long-form article every two weeks. Subscribe via the contact page to get them first.",
    },
    ar: {
      hero: { badge: "المدوّنة", title: "قصص وأدلّة وأبحاث", subtitle: "مقالات مُعمَّقة حول CRM ومبيعات واتساب والتمويل الذكي وبناء SaaS للشرق الأوسط وTürkiye." },
      readMore: "اقرأ المزيد",
      minRead: "دقيقة قراءة",
      comingSoon: "المزيد من المقالات قريباً",
      comingSoonDesc: "ننشر مقالاً مُعمَّقاً واحداً كل أسبوعين. اشترك عبر صفحة التواصل لتحصل عليها أولاً.",
    },
    tr: {
      hero: { badge: "Blog", title: "Hikayeler, rehberler ve araştırmalar", subtitle: "CRM, WhatsApp satış, AI finansı ve MENA ile Türkiye için SaaS oluşturma üzerine derinlemesine yazılar." },
      readMore: "Daha fazla oku",
      minRead: "dk okuma",
      comingSoon: "Yakında daha fazla yazı",
      comingSoonDesc: "İki haftada bir uzun içerikli bir makale yayınlıyoruz. İlk alanlar olmak için iletişim sayfasından abone olun.",
    },
  };
  const t = copy[L];

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Featured */}
        <div className="mb-12">
          <Link
            href={`/${locale}/blog/${POSTS[0].slug}`}
            className="block group"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <div
                className={`md:col-span-2 relative h-64 md:h-full bg-gradient-to-br ${POSTS[0].color} flex items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <Sparkles className="w-16 h-16 text-white/90 relative" />
              </div>
              <div className="md:col-span-3 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded">
                    {POSTS[0].category[L]}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(POSTS[0].date, L)}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {POSTS[0].title[L]}
                </h2>
                <p className="text-muted-foreground mb-4">{POSTS[0].excerpt[L]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {POSTS[0].readTime} {t.minRead}
                  </span>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.readMore}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Other posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className={`h-32 bg-gradient-to-br ${post.color} relative flex items-center justify-center`}
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <Sparkles className="w-10 h-10 text-white/90 relative" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-foreground bg-muted rounded">
                    {post.category[L]}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title[L]}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {post.excerpt[L]}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.date, L)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} {t.minRead}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-16 text-center bg-gradient-to-br from-sky-50 to-sky-50 rounded-2xl p-8 border border-sky-100">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t.comingSoon}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t.comingSoonDesc}
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

function formatDate(iso: string, locale: "en" | "ar" | "tr"): string {
  const loc = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
