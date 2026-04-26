// lib/marketing/copy.ts
// Marketing copy strings — EN / AR / TR.
// Imported by HeroV2, sections, and footer in later sprints.
// IMPORTANT: keep keys identical across all three locales.

export type Locale = "en" | "ar" | "tr";

export const MARKETING_COPY = {
  en: {
    nav: {
      product: "Product",
      ai: "AI",
      whatsapp: "WhatsApp",
      integrations: "Integrations",
      pricing: "Pricing",
      about: "About",
    },
    cta: {
      signIn: "Sign in",
      startFree: "Start free",
      talkToSales: "Talk to sales",
      watchTour: "Watch product tour",
      exploreIntegrations: "Explore integrations",
    },
    hero: {
      badge: "New category for MENA growth",
      headlineLead: "The business growth OS built around",
      headlineHighlight: "WhatsApp, AI, and cash flow.",
      subheadline:
        "Zyrix brings CRM, WhatsApp conversations, sales pipelines, AI CFO insights, regional tax logic, and team execution into one system built for Turkiye and MENA.",
      trustLine:
        "Built in Istanbul. Ready for Arabic, Turkish, English, KDV, VAT, ZATCA, and WhatsApp-first teams.",
      chips: {
        whatsapp: "98% WhatsApp delivery",
        cfo: "AI CFO risk detected",
        launch: "15 min go-live",
        tax: "KDV / VAT ready",
      },
      console: {
        title: "Zyrix Command Center",
        live: "Live",
        cards: {
          whatsapp: "WhatsApp 98%",
          pipeline: "Pipeline $1.2M",
          cfo: "AI CFO 84%",
          cash: "Cash risk $87k",
        },
      },
    },
  },
  ar: {
    nav: {
      product: "المنتج",
      ai: "الذكاء الاصطناعي",
      whatsapp: "واتساب",
      integrations: "التكاملات",
      pricing: "الأسعار",
      about: "عن زايركس",
    },
    cta: {
      signIn: "تسجيل الدخول",
      startFree: "ابدأ مجاناً",
      talkToSales: "تواصل مع المبيعات",
      watchTour: "شاهد جولة المنتج",
      exploreIntegrations: "استكشف التكاملات",
    },
    hero: {
      badge: "فئة جديدة لنمو أعمال الشرق الأوسط",
      headlineLead: "نظام تشغيل النمو المبني حول",
      headlineHighlight: "واتساب والذكاء الاصطناعي والتدفق النقدي.",
      subheadline:
        "زايركس يجمع إدارة العملاء، محادثات واتساب، خطوط المبيعات، رؤى المدير المالي الذكي، منطق الضرائب الإقليمي، وتنفيذ الفريق في نظام واحد مبني لتركيا والشرق الأوسط.",
      trustLine:
        "مبني في إسطنبول. جاهز للعربية والتركية والإنجليزية و KDV و VAT و ZATCA وفرق واتساب أولاً.",
      chips: {
        whatsapp: "98% تسليم واتساب",
        cfo: "تنبيه مالي ذكي",
        launch: "تشغيل في 15 دقيقة",
        tax: "جاهز لـ KDV / VAT",
      },
      console: {
        title: "مركز قيادة زايركس",
        live: "مباشر",
        cards: {
          whatsapp: "واتساب 98%",
          pipeline: "خط المبيعات 1.2M$",
          cfo: "المدير المالي الذكي 84%",
          cash: "مخاطرة نقدية 87k$",
        },
      },
    },
  },
  tr: {
    nav: {
      product: "Ürün",
      ai: "AI",
      whatsapp: "WhatsApp",
      integrations: "Entegrasyonlar",
      pricing: "Fiyatlandırma",
      about: "Hakkımızda",
    },
    cta: {
      signIn: "Giriş yap",
      startFree: "Ücretsiz başla",
      talkToSales: "Satışla konuş",
      watchTour: "Ürün turunu izle",
      exploreIntegrations: "Entegrasyonları keşfet",
    },
    hero: {
      badge: "MENA büyümesi için yeni kategori",
      headlineLead: "İş büyüme OS, şu eksen üzerine kurulu:",
      headlineHighlight: "WhatsApp, AI ve nakit akışı.",
      subheadline:
        "Zyrix; CRM, WhatsApp konuşmaları, satış pipeline'ları, AI CFO içgörüleri, bölgesel vergi mantığı ve ekip yürütmesini Türkiye ve MENA için tek bir sistemde birleştirir.",
      trustLine:
        "İstanbul'da geliştirildi. Arapça, Türkçe, İngilizce, KDV, VAT, ZATCA ve WhatsApp öncelikli ekipler için hazır.",
      chips: {
        whatsapp: "%98 WhatsApp teslim",
        cfo: "AI CFO risk uyarısı",
        launch: "15 dakikada canlı",
        tax: "KDV / VAT hazır",
      },
      console: {
        title: "Zyrix Komuta Merkezi",
        live: "Canlı",
        cards: {
          whatsapp: "WhatsApp %98",
          pipeline: "Pipeline $1.2M",
          cfo: "AI CFO %84",
          cash: "Nakit riski $87k",
        },
      },
    },
  },
} as const;

export function getCopy(locale: string) {
  if (locale === "ar") return MARKETING_COPY.ar;
  if (locale === "tr") return MARKETING_COPY.tr;
  return MARKETING_COPY.en;
}
