import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { Sparkles, Zap, Plus, Wrench, Shield } from "lucide-react";

// ============================================================================
// CHANGELOG PAGE — release notes grouped by date
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "Changelog — Zyrix CRM",
    ar: "آخر التحديثات — Zyrix CRM",
    tr: "Güncellemeler — Zyrix CRM",
  };
  const descriptions = {
    en: "Every release, every improvement, every bug fix. Public changelog for Zyrix CRM.",
    ar: "كل إصدار، كل تحسين، كل إصلاح. سجل التحديثات العلني لـ Zyrix CRM.",
    tr: "Her sürüm, her iyileştirme, her hata düzeltmesi. Zyrix CRM için halka açık değişiklik günlüğü.",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] ?? descriptions.en,
  };
}

type EntryKind = "feature" | "improvement" | "fix" | "security";

const ENTRIES: {
  version: string;
  date: string;
  highlight?: boolean;
  items: {
    kind: EntryKind;
    title: { en: string; ar: string; tr: string };
  }[];
}[] = [
  {
    version: "1.0.0",
    date: "2026-04-21",
    highlight: true,
    items: [
      { kind: "feature", title: { en: "Role-based Dashboard with personal, team, and company scopes", ar: "لوحة تحكم حسب الدور بنطاقات شخصية وفريق وشركة", tr: "Kişisel, ekip ve şirket kapsamlı rol bazlı panel" } },
      { kind: "feature", title: { en: "Multi-Currency Reports with automatic conversion and custom exchange rates", ar: "تقارير متعددة العملات مع تحويل تلقائي وأسعار صرف مخصصة", tr: "Otomatik dönüşüm ve özel döviz kurlarıyla çok para birimli raporlar" } },
      { kind: "feature", title: { en: "Customer Portal with magic-link authentication", ar: "بوابة العملاء مع مصادقة الروابط السحرية", tr: "Sihirli bağlantı kimlik doğrulamalı Müşteri Portalı" } },
      { kind: "feature", title: { en: "Internal Team Chat with unread badges", ar: "دردشة داخلية للفريق مع شارات الرسائل غير المقروءة", tr: "Okunmamış rozetleri olan dahili Ekip Sohbeti" } },
      { kind: "feature", title: { en: "WhatsApp CRM with Meta Cloud API integration", ar: "واتساب CRM مع تكامل Meta Cloud API", tr: "Meta Cloud API entegrasyonlu WhatsApp CRM" } },
      { kind: "improvement", title: { en: "Redesigned public header and footer with brand-colored social icons", ar: "إعادة تصميم الهيدر والفوتر مع أيقونات تواصل اجتماعي بألوان العلامات", tr: "Marka renkli sosyal ikonlarla yeniden tasarlanmış üst bilgi ve alt bilgi" } },
      { kind: "improvement", title: { en: "Per-route accent colors — each marketing page feels distinct", ar: "ألوان مميزة لكل صفحة — كل صفحة تسويقية تبدو مميزة", tr: "Her rotaya özel vurgu renkleri — her pazarlama sayfası farklı hissettirir" } },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-04-14",
    items: [
      { kind: "feature", title: { en: "Contract Management with auto-generated numbering and renewal reminders", ar: "إدارة العقود مع ترقيم تلقائي وتذكيرات التجديد", tr: "Otomatik numaralandırma ve yenileme hatırlatmalarıyla Sözleşme Yönetimi" } },
      { kind: "feature", title: { en: "Marketing Automation + Email Marketing campaigns via Resend API", ar: "أتمتة تسويقية + حملات بريدية عبر Resend API", tr: "Resend API aracılığıyla Pazarlama Otomasyonu + E-posta Pazarlama kampanyaları" } },
      { kind: "feature", title: { en: "Commission Engine with per-deal rule application and auto-entries on won deals", ar: "محرك العمولات مع تطبيق القواعد لكل صفقة وإدخالات تلقائية عند الفوز", tr: "Anlaşma başına kural uygulaması ve kazanılan anlaşmalarda otomatik kayıtlı Komisyon Motoru" } },
      { kind: "improvement", title: { en: "Dashboard loads 3x faster thanks to parallel Prisma aggregations", ar: "لوحة التحكم أسرع 3 أضعاف بفضل تجميعات Prisma المتوازية", tr: "Paralel Prisma toplulaştırmaları sayesinde panel 3 kat daha hızlı yüklenir" } },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-04-08",
    items: [
      { kind: "feature", title: { en: "AI CFO Dashboard powered by Gemini 2.0 Flash", ar: "لوحة المدير المالي الذكية مدعومة بـ Gemini 2.0 Flash", tr: "Gemini 2.0 Flash ile güçlendirilmiş AI CFO Paneli" } },
      { kind: "feature", title: { en: "Smart Follow-up with AI-suggested reply templates in Arabic dialects", ar: "المتابعة الذكية مع قوالب ردود مقترحة بالذكاء الاصطناعي باللهجات العربية", tr: "Arapça lehçelerinde AI önerili yanıt şablonlarıyla Akıllı Takip" } },
      { kind: "feature", title: { en: "Cash Flow Forecast with predictive 90-day projections", ar: "توقعات التدفق النقدي مع إسقاطات تنبؤية لـ 90 يوماً", tr: "90 günlük tahmin projeksiyonlarıyla Nakit Akışı Tahmini" } },
      { kind: "fix", title: { en: "Fixed Arabic RTL layout bugs in quote PDF export", ar: "إصلاح أخطاء تخطيط العربية RTL في تصدير PDF للعروض", tr: "Teklif PDF dışa aktarımında Arapça RTL düzen hataları düzeltildi" } },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-03-30",
    items: [
      { kind: "feature", title: { en: "Tax Engine for KDV and VAT with configurable rates per company", ar: "محرك ضرائب KDV و VAT مع أسعار قابلة للتكوين لكل شركة", tr: "Şirket başına yapılandırılabilir oranlarla KDV ve VAT için Vergi Motoru" } },
      { kind: "feature", title: { en: "Customer Loyalty program with points and tier management", ar: "برنامج ولاء العملاء مع إدارة النقاط والمستويات", tr: "Puan ve seviye yönetimiyle Müşteri Sadakat programı" } },
      { kind: "feature", title: { en: "Quotes and Proposals with public shareable links", ar: "عروض الأسعار والمقترحات مع روابط قابلة للمشاركة العامة", tr: "Herkese açık paylaşılabilir bağlantılarla Teklifler ve Öneriler" } },
      { kind: "security", title: { en: "Upgraded JWT rotation to 15min access + 7d refresh tokens", ar: "ترقية دوران JWT إلى 15 دقيقة وصول + 7 أيام تجديد", tr: "JWT rotasyonu 15 dk erişim + 7 gün yenileme belirteçlerine yükseltildi" } },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-03-20",
    items: [
      { kind: "feature", title: { en: "Task Management with priorities, due dates, and customer linking", ar: "إدارة المهام مع الأولويات وتواريخ الاستحقاق وربط العملاء", tr: "Öncelikler, bitiş tarihleri ve müşteri bağlantısıyla Görev Yönetimi" } },
      { kind: "feature", title: { en: "Sales Pipeline board with drag-and-drop stage transitions", ar: "لوحة خط المبيعات مع انتقالات المراحل بالسحب والإفلات", tr: "Sürükle-bırak aşama geçişleriyle Satış Hunisi panosu" } },
      { kind: "improvement", title: { en: "Switched from Anthropic SDK to Google Gemini for faster AI responses", ar: "التحول من Anthropic SDK إلى Google Gemini لاستجابات AI أسرع", tr: "Daha hızlı AI yanıtları için Anthropic SDK'dan Google Gemini'ye geçildi" } },
    ],
  },
];

const KIND_META: Record<EntryKind, { bg: string; text: string; Icon: typeof Sparkles; label: { en: string; ar: string; tr: string } }> = {
  feature: {
    bg: "bg-sky-500/15",
    text: "text-primary",
    Icon: Plus,
    label: { en: "New", ar: "جديد", tr: "Yeni" },
  },
  improvement: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    Icon: Zap,
    label: { en: "Improved", ar: "تحسين", tr: "İyileştirme" },
  },
  fix: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    Icon: Wrench,
    label: { en: "Fixed", ar: "إصلاح", tr: "Düzeltildi" },
  },
  security: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    Icon: Shield,
    label: { en: "Security", ar: "أمان", tr: "Güvenlik" },
  },
};

export default async function ChangelogPage({
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
      hero: { badge: "Changelog", title: "Release notes", subtitle: "Every change we ship — new features, improvements, fixes, and security updates." },
      latestBadge: "Latest",
    },
    ar: {
      hero: { badge: "سجل التغييرات", title: "ملاحظات الإصدارات", subtitle: "كل تغيير نُطلقه — ميزات جديدة وتحسينات وإصلاحات وتحديثات أمان." },
      latestBadge: "الأحدث",
    },
    tr: {
      hero: { badge: "Değişiklik günlüğü", title: "Sürüm notları", subtitle: "Yayınladığımız her değişiklik — yeni özellikler, iyileştirmeler, düzeltmeler ve güvenlik güncellemeleri." },
      latestBadge: "En son",
    },
  };
  const t = copy[L];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="space-y-10">
          {ENTRIES.map((entry, idx) => (
            <div key={idx} className="relative">
              {/* Vertical timeline line */}
              {idx < ENTRIES.length - 1 && (
                <div className="absolute ltr:left-4 rtl:right-4 top-14 bottom-0 w-px bg-slate-200" />
              )}

              {/* Version header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-400/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-bold text-foreground font-mono">
                    v{entry.version}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.date, L)}
                  </span>
                  {entry.highlight && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 rounded">
                      {t.latestBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Entry card */}
              <div className="ltr:ml-11 rtl:mr-11 bg-card border border-border rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  {entry.items.map((item, i) => {
                    const meta = KIND_META[item.kind];
                    const Icon = meta.Icon;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 mt-0.5 ${meta.bg} ${meta.text}`}
                        >
                          <Icon className="w-2.5 h-2.5" />
                          {meta.label[L]}
                        </span>
                        <span className="text-sm text-foreground">
                          {item.title[L]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

function formatDate(iso: string, locale: "en" | "ar" | "tr"): string {
  const loc = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
