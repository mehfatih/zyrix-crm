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
    metrics: {
      title: "Numbers that change how you operate",
      subtitle:
        "Not vanity metrics. Operational advantages for teams selling in WhatsApp-first markets.",
      cards: [
        {
          value: "48h",
          label: "Launch Window",
          desc: "Start with customers, pipeline, WhatsApp inbox, and reporting fast.",
        },
        {
          value: "80%",
          label: "Lower Seat Waste",
          desc: "Pay per company, not per every user you invite.",
        },
        {
          value: "3+",
          label: "Languages & Dialects",
          desc: "Arabic, Turkish, English, with regional business tone.",
        },
        {
          value: "WA",
          label: "WhatsApp at the Core",
          desc: "Conversations become customers, deals, tasks, and insights.",
        },
        {
          value: "AI",
          label: "AI CFO Signal",
          desc: "Revenue risk and cash flow warnings before they become surprises.",
        },
      ],
    },
    ecosystem: {
      title: "One operating system. Not nine separate tools.",
      subtitle:
        "Zyrix is built as a unified growth OS. Modules connect through the same customer brain — not glued together with integrations.",
      center: "Zyrix Growth OS",
      modules: [
        {
          name: "WhatsApp CRM",
          desc: "Every message becomes a customer record, deal signal, or follow-up task.",
        },
        {
          name: "Sales Pipeline",
          desc: "See value, stage risk, stale deals, expected close, and next best action.",
        },
        {
          name: "AI CFO",
          desc: "Ask what blocks cash flow and get grounded answers from pipeline and revenue data.",
        },
        {
          name: "Tax Engine",
          desc: "KDV, VAT, ZATCA-ready logic for quotes, invoices, and reports.",
        },
        {
          name: "Integrations",
          desc: "Shopify, WooCommerce, Salla, Zid, Ticimax, Ideasoft and CSV/API paths.",
        },
        {
          name: "Customer Portal",
          desc: "Let customers view quotes, invoices, orders, tickets, and updates.",
        },
        {
          name: "Campaigns",
          desc: "Run segmented outreach from the same CRM brain.",
        },
        {
          name: "Tasks",
          desc: "Convert insights into team action without another to-do app.",
        },
      ],
    },
    ai: {
      title: "AI that knows your customers, your pipeline, and your region",
      subtitle:
        "Zyrix does not bolt AI onto a CRM. The AI reads your business context: deals, WhatsApp conversations, invoices, taxes, tasks, and customer history.",
      tabs: ["AI CFO", "Sales Assistant", "Content Writer", "Meeting Notes"],
      prompts: [
        "Which customers need action today?",
        "What is blocking cash flow this month?",
        "Draft a WhatsApp follow-up in Gulf Arabic.",
        "Summarize this meeting into tasks and decisions.",
        "Which deals are likely to stall?",
      ],
      sampleResponse: {
        title: "AI CFO — November cash flow signal",
        body: "3 customers (47% of receivables) are 14+ days late. Predicted gap: $87,400 by Nov 28. Recommended actions ready in your inbox.",
      },
    },
    regional: {
      title: "Built in Istanbul for MENA realities",
      subtitle:
        "Each market has its own tax logic, language tone, and selling motion. Zyrix is configured for them all.",
      cards: [
        {
          flag: "🇹🇷",
          country: "Turkiye",
          desc: "KDV, e-Arşiv / e-Fatura direction, Turkish UI tone, local selling motion.",
        },
        {
          flag: "🇸🇦",
          country: "Saudi Arabia",
          desc: "ZATCA readiness, Arabic-first business workflows, WhatsApp sales.",
        },
        {
          flag: "🇦🇪",
          country: "UAE / Gulf",
          desc: "VAT, multi-currency, professional bilingual teams.",
        },
        {
          flag: "🇮🇶",
          country: "Iraq / Egypt",
          desc: "WhatsApp-first operations, COD-like sales behavior, relationship-heavy workflows.",
        },
      ],
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
    metrics: {
      title: "أرقام تغيّر طريقة عملك",
      subtitle:
        "ليست أرقاماً للعرض. مزايا تشغيلية للفرق التي تبيع في أسواق الواتساب أولاً.",
      cards: [
        {
          value: "48 ساعة",
          label: "نافذة الإطلاق",
          desc: "ابدأ بالعملاء وخط المبيعات وصندوق الواتساب والتقارير بسرعة.",
        },
        {
          value: "80%",
          label: "تقليل هدر المقاعد",
          desc: "ادفع لكل شركة، لا لكل مستخدم تدعوه.",
        },
        {
          value: "+3",
          label: "لغات ولهجات",
          desc: "العربية والتركية والإنجليزية، بنبرة أعمال إقليمية.",
        },
        {
          value: "WA",
          label: "واتساب في القلب",
          desc: "تصبح المحادثات عملاء وصفقات ومهام ورؤى.",
        },
        {
          value: "AI",
          label: "إشارة المدير المالي الذكي",
          desc: "تحذيرات المخاطر والتدفق النقدي قبل أن تصبح مفاجآت.",
        },
      ],
    },
    ecosystem: {
      title: "نظام تشغيل واحد. ليس تسع أدوات منفصلة.",
      subtitle:
        "زايركس مبني كنظام تشغيل نمو موحد. الوحدات تتصل عبر نفس الدماغ — لا تُلصق بتكاملات.",
      center: "نظام نمو زايركس",
      modules: [
        {
          name: "واتساب CRM",
          desc: "كل رسالة تصبح سجل عميل أو إشارة صفقة أو مهمة متابعة.",
        },
        {
          name: "خط المبيعات",
          desc: "شاهد القيمة ومخاطر المرحلة والصفقات الراكدة وأفضل خطوة تالية.",
        },
        {
          name: "المدير المالي الذكي",
          desc: "اسأل عن ما يعرقل التدفق النقدي واحصل على إجابات من بيانات حقيقية.",
        },
        {
          name: "محرك الضرائب",
          desc: "منطق جاهز لـ KDV و VAT و ZATCA لعروض الأسعار والفواتير والتقارير.",
        },
        {
          name: "التكاملات",
          desc: "Shopify و WooCommerce و Salla و Zid و Ticimax و Ideasoft ومسارات CSV/API.",
        },
        {
          name: "بوابة العملاء",
          desc: "اسمح للعملاء بمشاهدة العروض والفواتير والطلبات والتذاكر والتحديثات.",
        },
        {
          name: "الحملات",
          desc: "شغّل حملات تواصل مقسّمة من نفس دماغ الـ CRM.",
        },
        {
          name: "المهام",
          desc: "حوّل الرؤى إلى إجراءات للفريق بدون تطبيق مهام إضافي.",
        },
      ],
    },
    ai: {
      title: "ذكاء اصطناعي يعرف عملاءك وخط مبيعاتك ومنطقتك",
      subtitle:
        "زايركس لا يضيف الذكاء الاصطناعي على CRM. الذكاء يقرأ سياق أعمالك: الصفقات، محادثات الواتساب، الفواتير، الضرائب، المهام، وتاريخ العملاء.",
      tabs: ["المدير المالي الذكي", "مساعد المبيعات", "كاتب المحتوى", "ملاحظات الاجتماعات"],
      prompts: [
        "أي عملاء يحتاجون إجراءً اليوم؟",
        "ما الذي يعرقل التدفق النقدي هذا الشهر؟",
        "اكتب متابعة واتساب باللهجة الخليجية.",
        "لخّص هذا الاجتماع إلى مهام وقرارات.",
        "أي صفقات من المرجح أن تتعطل؟",
      ],
      sampleResponse: {
        title: "المدير المالي الذكي — إشارة تدفق نقدي لنوفمبر",
        body: "3 عملاء (47% من الذمم) متأخرون أكثر من 14 يوماً. الفجوة المتوقعة: 87,400$ بحلول 28 نوفمبر. الإجراءات الموصى بها جاهزة في صندوق الوارد.",
      },
    },
    regional: {
      title: "مبني في إسطنبول لواقع الشرق الأوسط",
      subtitle:
        "لكل سوق منطقه الضريبي ونبرته اللغوية وطريقة البيع. زايركس معدّ لها كلها.",
      cards: [
        {
          flag: "🇹🇷",
          country: "تركيا",
          desc: "KDV واتجاه e-Arşiv / e-Fatura ونبرة واجهة تركية وحركة بيع محلية.",
        },
        {
          flag: "🇸🇦",
          country: "السعودية",
          desc: "جاهزية ZATCA وسير عمل عربي أولاً ومبيعات واتساب.",
        },
        {
          flag: "🇦🇪",
          country: "الإمارات والخليج",
          desc: "VAT وعملات متعددة وفرق ثنائية اللغة احترافية.",
        },
        {
          flag: "🇮🇶",
          country: "العراق ومصر",
          desc: "تشغيل واتساب أولاً، سلوك بيع شبه COD، علاقات قوية مع العملاء.",
        },
      ],
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
    metrics: {
      title: "Çalışma şeklini değiştiren rakamlar",
      subtitle:
        "Vitrin metriği değil. WhatsApp öncelikli pazarlarda satan ekipler için operasyonel avantaj.",
      cards: [
        {
          value: "48s",
          label: "Lansman Penceresi",
          desc: "Müşteriler, pipeline, WhatsApp gelen kutusu ve raporlamayla hızlıca başla.",
        },
        {
          value: "%80",
          label: "Daha Az Koltuk İsrafı",
          desc: "Davet ettiğin her kullanıcıya değil, şirket başına öde.",
        },
        {
          value: "3+",
          label: "Dil & Lehçe",
          desc: "Arapça, Türkçe, İngilizce — bölgesel iş tonuyla.",
        },
        {
          value: "WA",
          label: "WhatsApp Merkezde",
          desc: "Konuşmalar müşteriye, fırsata, göreve ve içgörüye dönüşür.",
        },
        {
          value: "AI",
          label: "AI CFO Sinyali",
          desc: "Gelir riski ve nakit akışı uyarıları sürpriz olmadan önce.",
        },
      ],
    },
    ecosystem: {
      title: "Tek işletim sistemi. Dokuz ayrı araç değil.",
      subtitle:
        "Zyrix birleşik bir büyüme OS olarak inşa edildi. Modüller aynı müşteri beyninden bağlanır — entegrasyonlarla yapıştırılmaz.",
      center: "Zyrix Growth OS",
      modules: [
        {
          name: "WhatsApp CRM",
          desc: "Her mesaj bir müşteri kaydı, fırsat sinyali veya takip görevi olur.",
        },
        {
          name: "Satış Pipeline",
          desc: "Değer, aşama riski, donmuş fırsatlar, beklenen kapanış, sonraki en iyi aksiyon.",
        },
        {
          name: "AI CFO",
          desc: "Nakit akışını neyin engellediğini sor, pipeline ve gelir verisinden yanıt al.",
        },
        {
          name: "Vergi Motoru",
          desc: "Teklif, fatura ve raporlar için KDV, VAT, ZATCA hazır mantık.",
        },
        {
          name: "Entegrasyonlar",
          desc: "Shopify, WooCommerce, Salla, Zid, Ticimax, Ideasoft ve CSV/API yolları.",
        },
        {
          name: "Müşteri Portalı",
          desc: "Müşterilerin teklif, fatura, sipariş, ticket ve güncellemeleri görmesini sağla.",
        },
        {
          name: "Kampanyalar",
          desc: "Aynı CRM beyninden segmentli yayılım kampanyaları çalıştır.",
        },
        {
          name: "Görevler",
          desc: "İçgörüleri başka bir to-do uygulamasına gerek kalmadan ekip aksiyonuna çevir.",
        },
      ],
    },
    ai: {
      title: "Müşterilerini, pipeline'ını ve bölgeni bilen AI",
      subtitle:
        "Zyrix AI'yı CRM'e tutturmaz. AI iş bağlamını okur: fırsatlar, WhatsApp konuşmaları, faturalar, vergiler, görevler ve müşteri geçmişi.",
      tabs: ["AI CFO", "Satış Asistanı", "İçerik Yazarı", "Toplantı Notları"],
      prompts: [
        "Bugün hangi müşterilerin aksiyona ihtiyacı var?",
        "Bu ay nakit akışını ne engelliyor?",
        "Körfez Arapçasıyla bir WhatsApp takip mesajı yaz.",
        "Bu toplantıyı görevlere ve kararlara özetle.",
        "Hangi fırsatlar muhtemelen takılacak?",
      ],
      sampleResponse: {
        title: "AI CFO — Kasım nakit akışı sinyali",
        body: "3 müşteri (alacakların %47'si) 14+ gün geç kalmış. Tahmini açık: 28 Kasım'a kadar 87.400$. Önerilen aksiyonlar gelen kutunda hazır.",
      },
    },
    regional: {
      title: "MENA gerçeklikleri için İstanbul'da inşa edildi",
      subtitle:
        "Her pazarın kendi vergi mantığı, dil tonu ve satış hareketi var. Zyrix hepsi için yapılandırıldı.",
      cards: [
        {
          flag: "🇹🇷",
          country: "Türkiye",
          desc: "KDV, e-Arşiv / e-Fatura yönü, Türkçe arayüz tonu, yerel satış hareketi.",
        },
        {
          flag: "🇸🇦",
          country: "Suudi Arabistan",
          desc: "ZATCA hazırlığı, Arapça öncelikli iş akışları, WhatsApp satışı.",
        },
        {
          flag: "🇦🇪",
          country: "BAE / Körfez",
          desc: "VAT, çoklu para birimi, profesyonel iki dilli ekipler.",
        },
        {
          flag: "🇮🇶",
          country: "Irak / Mısır",
          desc: "WhatsApp öncelikli operasyon, COD benzeri satış davranışı, ilişki ağırlıklı iş akışları.",
        },
      ],
    },
  },
} as const;

export function getCopy(locale: string) {
  if (locale === "ar") return MARKETING_COPY.ar;
  if (locale === "tr") return MARKETING_COPY.tr;
  return MARKETING_COPY.en;
}
