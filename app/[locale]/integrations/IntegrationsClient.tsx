"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Globe,
  MapPin,
  CheckCircle2,
  Clock,
  FileText,
  Zap,
  ExternalLink,
  Sparkles,
  Users,
  ShoppingCart,
  ArrowRight,
  Plug,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

// ============================================================================
// PUBLIC INTEGRATIONS PAGE — showcases all 40 supported e-commerce platforms
// ============================================================================

type Region = "mena" | "turkey" | "global";
type RegionFilter = "all" | Region;

interface PublicPlatform {
  id: string;
  name: string;
  region: Region;
  country: string;
  website: string;
  brandColor: string;
  description: { en: string; ar: string; tr: string };
  status: "native" | "api" | "csv_only" | "planned";
  popularity: number;
  supports: {
    customers: boolean;
    orders: boolean;
    products: boolean;
    webhooks: boolean;
  };
}

const COPY: Record<string, any> = {
  en: {
    heroEyebrow: "Integrations",
    heroTitle: "Connect Zyrix to 40+ e-commerce platforms",
    heroSubtitle: "Sync customers and orders instantly from the platforms you already use — across MENA, Turkey, and the world.",
    heroCtaPrimary: "Start free trial",
    heroCtaSecondary: "View pricing",
    statsPlatforms: "Platforms",
    statsRegions: "Regions",
    statsLive: "Live API sync",
    statsNative: "Native SDKs",
    searchPlaceholder: "Search by name or country...",
    regionAll: "All platforms",
    regionMena: "Arab region",
    regionTurkey: "Turkey",
    regionGlobal: "Global",
    noResults: "No platforms match your search",
    tryDifferent: "Try a different search term",
    status: {
      native: "Native",
      api: "API sync",
      csv_only: "CSV import",
      planned: "Coming soon",
    },
    capCustomers: "Customers",
    capOrders: "Orders",
    capProducts: "Products",
    capWebhooks: "Webhooks",
    visitWebsite: "Visit platform",
    ctaTitle: "Ready to connect your store?",
    ctaSubtitle: "Start importing customers and orders in minutes.",
    ctaButton: "Get started for free",
    howItWorks: "How it works",
    step1: "Create your Zyrix account",
    step1Desc: "Free trial with no credit card",
    step2: "Pick your platform",
    step2Desc: "Choose from 40+ integrations",
    step3: "Paste access token",
    step3Desc: "Get from your platform admin",
    step4: "Start syncing",
    step4Desc: "Customers flow in automatically",
  },
  ar: {
    heroEyebrow: "التكاملات",
    heroTitle: "اربط Zyrix بأكثر من 40 منصة تجارة إلكترونية",
    heroSubtitle: "استورد العملاء والطلبات فورًا من المنصات التي تستخدمها — في الشرق الأوسط وTürkiye والعالم.",
    heroCtaPrimary: "ابدأ مجانًا",
    heroCtaSecondary: "عرض الأسعار",
    statsPlatforms: "منصة",
    statsRegions: "مناطق",
    statsLive: "مزامنة API",
    statsNative: "تكامل أصلي",
    searchPlaceholder: "ابحث بالاسم أو البلد...",
    regionAll: "كل المنصات",
    regionMena: "المنطقة العربية",
    regionTurkey: "Türkiye",
    regionGlobal: "عالمي",
    noResults: "لا توجد منصات مطابقة",
    tryDifferent: "جرب كلمات بحث أخرى",
    status: {
      native: "أصلي",
      api: "مزامنة API",
      csv_only: "استيراد CSV",
      planned: "قريبًا",
    },
    capCustomers: "عملاء",
    capOrders: "طلبات",
    capProducts: "منتجات",
    capWebhooks: "Webhooks",
    visitWebsite: "زيارة المنصة",
    ctaTitle: "جاهز لربط متجرك؟",
    ctaSubtitle: "ابدأ في استيراد العملاء والطلبات خلال دقائق.",
    ctaButton: "ابدأ مجانًا",
    howItWorks: "كيف يعمل",
    step1: "أنشئ حساب Zyrix",
    step1Desc: "تجربة مجانية بدون بطاقة",
    step2: "اختر منصتك",
    step2Desc: "من بين 40+ تكامل",
    step3: "الصق رمز الوصول",
    step3Desc: "من لوحة إدارة منصتك",
    step4: "ابدأ المزامنة",
    step4Desc: "العملاء يتدفقون تلقائيًا",
  },
  tr: {
    heroEyebrow: "Entegrasyonlar",
    heroTitle: "Zyrix'i 40+ e-ticaret platformuna bağlayın",
    heroSubtitle: "MENA, Türkiye ve dünya genelinde kullandığınız platformlardan müşteri ve siparişleri anında senkronize edin.",
    heroCtaPrimary: "Ücretsiz başla",
    heroCtaSecondary: "Fiyatları gör",
    statsPlatforms: "Platform",
    statsRegions: "Bölge",
    statsLive: "Canlı API",
    statsNative: "Yerel SDK",
    searchPlaceholder: "Ad veya ülkeye göre ara...",
    regionAll: "Tüm platformlar",
    regionMena: "Arap bölgesi",
    regionTurkey: "Türkiye",
    regionGlobal: "Küresel",
    noResults: "Eşleşen platform bulunamadı",
    tryDifferent: "Farklı bir arama terimi deneyin",
    status: {
      native: "Yerel",
      api: "API senkron",
      csv_only: "CSV içe aktarma",
      planned: "Yakında",
    },
    capCustomers: "Müşteriler",
    capOrders: "Siparişler",
    capProducts: "Ürünler",
    capWebhooks: "Webhook'lar",
    visitWebsite: "Platformu ziyaret et",
    ctaTitle: "Mağazanızı bağlamaya hazır mısınız?",
    ctaSubtitle: "Müşteri ve siparişleri birkaç dakika içinde içe aktarmaya başlayın.",
    ctaButton: "Ücretsiz başla",
    howItWorks: "Nasıl çalışır",
    step1: "Zyrix hesabı oluşturun",
    step1Desc: "Kredi kartı gerektirmez",
    step2: "Platformunuzu seçin",
    step2Desc: "40+ entegrasyondan seçin",
    step3: "Erişim belirtecini yapıştırın",
    step3Desc: "Platform yöneticinizden alın",
    step4: "Senkronizasyonu başlatın",
    step4Desc: "Müşteriler otomatik gelir",
  },
};

export default function IntegrationsClient({ locale }: { locale: string }) {
  const t = COPY[locale] || COPY.en;

  const [platforms, setPlatforms] = useState<PublicPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Public endpoint - no auth required
        const resp = await apiClient.get("/api/advanced/ecommerce/catalog");
        setPlatforms(resp.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = platforms.filter((p) => {
    if (regionFilter !== "all" && p.region !== regionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: platforms.length,
    mena: platforms.filter((p) => p.region === "mena").length,
    turkey: platforms.filter((p) => p.region === "turkey").length,
    global: platforms.filter((p) => p.region === "global").length,
    live: platforms.filter((p) => p.status === "api" || p.status === "native").length,
    native: platforms.filter((p) => p.status === "native").length,
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-sky-50 via-sky-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 ltr:left-10 rtl:right-10 w-64 h-64 bg-sky-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 ltr:right-10 rtl:left-10 w-80 h-80 bg-sky-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-sky-500/30 text-primary rounded-full text-xs font-semibold mb-4">
              <Plug className="w-3 h-3" />
              {t.heroEyebrow}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <Link
                href={`/${locale}/signup`}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-sky-500/20 transition-colors"
              >
                {t.heroCtaPrimary}
                <ArrowRight className="w-4 h-4 ltr:translate-x-0 rtl:-scale-x-100" />
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-card border border-sky-500/30 hover:bg-sky-500/10 text-foreground rounded-lg text-sm font-medium transition-colors"
              >
                {t.heroCtaSecondary}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            <StatCard value={counts.all} label={t.statsPlatforms} color="cyan" />
            <StatCard value={3} label={t.statsRegions} color="sky" />
            <StatCard value={counts.live} label={t.statsLive} color="emerald" />
            <StatCard value={counts.native} label={t.statsNative} color="indigo" />
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3 justify-between mb-8">
            <div className="relative max-w-md flex-1">
              <Search className="w-4 h-4 text-white/60 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-2.5 text-sm bg-card border border-sky-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-foreground"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <RegionChip label={t.regionAll} active={regionFilter === "all"} count={counts.all} onClick={() => setRegionFilter("all")} icon={Sparkles} />
              <RegionChip label={t.regionMena} active={regionFilter === "mena"} count={counts.mena} onClick={() => setRegionFilter("mena")} icon={Globe} />
              <RegionChip label={t.regionTurkey} active={regionFilter === "turkey"} count={counts.turkey} onClick={() => setRegionFilter("turkey")} icon={Globe} />
              <RegionChip label={t.regionGlobal} active={regionFilter === "global"} count={counts.global} onClick={() => setRegionFilter("global")} icon={Globe} />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-muted-foreground text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-sky-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-foreground mb-1">{t.noResults}</h3>
              <p className="text-sm text-muted-foreground">{t.tryDifferent}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <PlatformCard key={p.id} platform={p} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-sky-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            {t.howItWorks}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard n={1} title={t.step1} desc={t.step1Desc} color="cyan" />
            <StepCard n={2} title={t.step2} desc={t.step2Desc} color="sky" />
            <StepCard n={3} title={t.step3} desc={t.step3Desc} color="emerald" />
            <StepCard n={4} title={t.step4} desc={t.step4Desc} color="indigo" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t.ctaTitle}
          </h2>
          <p className="text-base text-muted-foreground mb-6">{t.ctaSubtitle}</p>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-sky-500/20"
          >
            {t.ctaButton}
            <ArrowRight className="w-4 h-4 ltr:translate-x-0 rtl:-scale-x-100" />
          </Link>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    cyan: "text-cyan-400",
    sky: "text-primary",
    emerald: "text-emerald-400",
    indigo: "text-indigo-400",
  };
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-sky-100 rounded-xl p-4 text-center shadow-sm">
      <div className={`text-3xl md:text-4xl font-extrabold ${colors[color]}`}>{value}+</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function RegionChip({
  label,
  active,
  count,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
  icon: typeof Globe;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        active ? "bg-sky-500 text-white shadow-sm" : "bg-card border border-sky-500/30 text-foreground hover:bg-sky-500/10"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      <span className={`ltr:ml-1 rtl:mr-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${active ? "bg-white/20" : "bg-muted"}`}>
        {count}
      </span>
    </button>
  );
}

function PlatformCard({ platform, locale, t }: { platform: PublicPlatform; locale: string; t: any }) {
  const description = platform.description[locale as "en" | "ar" | "tr"] || platform.description.en;
  const statusColors: Record<string, string> = {
    native: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    api: "bg-sky-500/15 text-primary border-sky-500/30",
    csv_only: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    planned: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/40 transition-all flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl flex-shrink-0 shadow-sm"
          style={{ backgroundColor: platform.brandColor }}
        >
          {platform.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground truncate flex items-center gap-1">
            {platform.name}
            {platform.popularity >= 85 && <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            {platform.country}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{description}</p>

      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {platform.supports.customers && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-primary bg-sky-500/10 px-1.5 py-0.5 rounded">
            <Users className="w-2.5 h-2.5" />
            {t.capCustomers}
          </span>
        )}
        {platform.supports.orders && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <ShoppingCart className="w-2.5 h-2.5" />
            {t.capOrders}
          </span>
        )}
        {platform.supports.webhooks && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">
            <Zap className="w-2.5 h-2.5" />
            {t.capWebhooks}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-sky-50">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded border ${statusColors[platform.status]}`}>
          {platform.status === "native" && <Zap className="w-2.5 h-2.5" />}
          {platform.status === "api" && <CheckCircle2 className="w-2.5 h-2.5" />}
          {platform.status === "csv_only" && <FileText className="w-2.5 h-2.5" />}
          {platform.status === "planned" && <Clock className="w-2.5 h-2.5" />}
          {t.status[platform.status]}
        </span>
        <a
          href={platform.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-primary flex items-center gap-0.5"
          title={t.visitWebsite}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function StepCard({ n, title, desc, color }: { n: number; title: string; desc: string; color: string }) {
  const colors: Record<string, string> = {
    cyan: "bg-sky-500",
    sky: "bg-sky-600",
    emerald: "bg-emerald-600",
    indigo: "bg-indigo-600",
  };
  return (
    <div className="bg-card border border-sky-100 rounded-xl p-5 text-center">
      <div className={`w-10 h-10 rounded-full ${colors[color]} text-white flex items-center justify-center font-bold mx-auto mb-3`}>
        {n}
      </div>
      <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
