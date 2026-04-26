// lib/marketing/copy.ts
// Marketing copy strings — EN / AR / TR — v3 (pixel-match).
// All strings here come directly from the reference image.

export type Locale = "en" | "ar" | "tr";

export const MARKETING_COPY = {
  en: {
    nav: {
      product: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      resources: "Resources",
      company: "Company",
    },
    cta: {
      signIn: "Sign in",
      startFree: "Start free",
      startFreeFull: "Start free — No credit card",
      talkToSales: "Talk to sales",
      seeHowItWorks: "See how it works",
      exploreFeatures: "Explore all features",
    },
    hero: {
      badge: "AI-POWERED. WHATSAPP-NATIVE. ARABIC-FIRST.",
      headlineLine1: "The CRM built",
      headlineLine2: "for how business",
      headlineLine3: "actually happens",
      subheadline:
        "Zyrix is the all-in-one CRM for MENA & Türkiye teams.\nWhatsApp at the core. Arabic-first by design.\nEverything else, finally connected.",
      socialProof: "Used by 500+ companies across MENA & Türkiye",
      dashboard: {
        title: "Zyrix CRM",
        revenue: "Revenue this month",
        revenueValue: "SAR 245,000",
        revenueDelta: "+18.6%",
        deals: "Open Deals",
        dealsValue: "128",
        dealsDelta: "+24",
        conversations: "WhatsApp Conversations",
        conversationsValue: "1,240",
        conversationsDelta: "+32%",
        responseTime: "Response Time",
        responseValue: "2m 15s",
        responseDelta: "+28%",
        pipeline: "Pipeline",
        stages: { new: "New", qualified: "Qualified", proposal: "Proposal", won: "Won" },
        stageValues: { new: "320", qualified: "128", proposal: "64", won: "24" },
        chips: {
          delivery: "98% WhatsApp delivery",
          setup: "3x Faster setup",
          insights: "AI Insights — Deal won probability high",
        },
      },
    },
    trust: {
      title: "Trusted by growing teams",
      logos: ["HASEEB", "MADO", "KUMDA", "SABAH", "AL MAYA", "TRUE GAMING", "iStage"],
    },
    numbers: {
      title: "The numbers tell the story",
      subtitle: "Why teams switch from enterprise CRM platforms to Zyrix",
      cards: [
        {
          value: "80%",
          color: "#10B981",
          label: "Lower cost",
          subLabel: "than per-seat pricing",
          icon: "shield",
        },
        {
          value: "48h",
          color: "#A78BFA",
          label: "From signup to",
          subLabel: "production-ready",
          icon: "bolt",
        },
        {
          value: "3",
          color: "#22D3EE",
          label: "Languages",
          subLabel: "Arabic dialects",
          icon: "globe",
        },
        {
          value: "Native",
          color: "#FB923C",
          label: "WhatsApp",
          subLabel: "Not a bolted-on add-on",
          icon: "chat",
        },
      ],
    },
    features: {
      tag: "ALL-IN-ONE",
      title: "Everything you need.",
      titleAccent: "Nothing you don't.",
      subtitle:
        "A complete CRM platform with 16 core features — not 16 separate disconnected apps, and not locked behind expensive enterprise tiers.",
      cta: "Explore all features",
      items: [
        { icon: "inbox", color: "#10B981", name: "WhatsApp-Native Inbox", desc: "Every conversation in one smart inbox.", badge: null },
        { icon: "pipeline", color: "#3B82F6", name: "Sales Pipeline", desc: "Drag-and-drop Kanban that moves deals.", badge: null },
        { icon: "cfo", color: "#A78BFA", name: "AI CFO Dashboard", desc: "Predict cash-flow, spot risks, grow smarter.", badge: "New" },
        { icon: "quote", color: "#EC4899", name: "Quotes & Proposals", desc: "Arabic/Turkish templates, e-signature, in one click.", badge: null },
        { icon: "heart", color: "#EF4444", name: "Customer Loyalty", desc: "Points, tiers, referrals, built for MENA.", badge: null },
        { icon: "stack", color: "#F59E0B", name: "Commission Engine", desc: "Custom rules, auto-calc, transparent.", badge: null },
        { icon: "tax", color: "#22D3EE", name: "Tax Engine", desc: "VAT, KDV, ZATCA ready. Always up to date.", badge: null },
        { icon: "portal", color: "#06B6D4", name: "Customer Portal", desc: "Invoices, tickets, orders — branded your way.", badge: null },
        { icon: "mic", color: "#F87171", name: "Voice-First Arabic", desc: "Speak. We understand. Arabic, Turkish & more.", badge: "Beta" },
        { icon: "agents", color: "#A78BFA", name: "AI Agents", desc: "Automate follow-ups, qualify, and close.", badge: "New" },
        { icon: "plug", color: "#34D399", name: "Integrations", desc: "Connect payments, shipping, and more.", badge: null },
        { icon: "store", color: "#FB923C", name: "Marketplace", desc: "Extend Zyrix with powerful apps.", badge: null },
      ],
    },
    whyBeats: {
      title: "Why Zyrix beats",
      titleAccent: "enterprise CRM platforms",
      cards: [
        {
          icon: "anchor",
          color: "#1A56DB",
          title: "Actually built for here",
          desc: "Designed in MENA & Türkiye for local businesses.",
        },
        {
          icon: "whatsapp",
          color: "#10B981",
          title: "WhatsApp at the core",
          desc: "Native. Not an integration. The whole system is built around it.",
        },
        {
          icon: "shield",
          color: "#22D3EE",
          title: "CRM + Pay + FinSuite in one",
          desc: "One login. One customer database. No integrations required.",
        },
        {
          icon: "tag",
          color: "#A78BFA",
          title: "Per-company pricing",
          desc: "Add your whole team for one flat fee. No 'per seat' penalties.",
        },
      ],
      globe: {
        title: "Built for MENA.",
        titleAccent: "Ready for the world.",
        bullets: [
          "Arabic-first experience",
          "Local compliance & tax rules",
          "Local support that speaks your language",
        ],
        cta: "See how it works",
      },
    },
    finalCta: {
      title: "Ready to see the difference?",
      subtitle: "Start with a free account. Talk to sales when you're ready to scale.",
      primary: "Start free — No credit card",
      secondary: "Talk to sales",
    },
    footer: {
      tagline:
        "The WhatsApp-native CRM built for MENA, Türkiye, and emerging markets. AI-powered. Arabic-first. Trusted by growing businesses.",
      headquarters: "Headquarters",
      headquartersValue: "Istanbul, Türkiye",
      emailLabel: "Email",
      emailValue: "hello@zyrix.co",
      whatsappLabel: "WhatsApp",
      whatsappValue: "+90 545 221 0888",
      copyright: "© 2026 Zyrix CRM. All rights reserved.",
      columns: {
        product: {
          title: "Product",
          links: ["Features", "Pricing", "Integrations", "AI CFO", "WhatsApp CRM"],
        },
        solutions: {
          title: "Solutions",
          links: ["By Industry", "By Role", "Use Cases", "Customer Stories"],
        },
        resources: {
          title: "Resources",
          links: ["Documentation", "API Reference", "Help Center", "Blog", "System Status"],
        },
        company: {
          title: "Company",
          links: ["About Us", "Careers", "Partners", "Contact", "Changelog"],
        },
        legal: {
          title: "Legal",
          links: ["Privacy Policy", "Terms of Service", "Security", "Data Processing Addendum"],
        },
      },
    },
  },
  ar: {
    nav: {
      product: "المنتج",
      solutions: "الحلول",
      pricing: "الأسعار",
      resources: "الموارد",
      company: "الشركة",
    },
    cta: {
      signIn: "تسجيل الدخول",
      startFree: "ابدأ مجاناً",
      startFreeFull: "ابدأ مجاناً — بدون بطاقة ائتمان",
      talkToSales: "تواصل مع المبيعات",
      seeHowItWorks: "شاهد كيف يعمل",
      exploreFeatures: "استكشف كل المزايا",
    },
    hero: {
      badge: "ذكاء اصطناعي. أصلي للواتساب. عربي أولاً.",
      headlineLine1: "الـ CRM المبني",
      headlineLine2: "لطريقة عمل الأعمال",
      headlineLine3: "كما تحدث فعلاً",
      subheadline:
        "زايركس هو الـ CRM الشامل لفرق الشرق الأوسط وتركيا.\nالواتساب في القلب. عربي أولاً بالتصميم.\nكل شيء آخر، متصل أخيراً.",
      socialProof: "تستخدمه أكثر من 500 شركة في الشرق الأوسط وتركيا",
      dashboard: {
        title: "زايركس CRM",
        revenue: "إيرادات هذا الشهر",
        revenueValue: "245,000 ريال",
        revenueDelta: "+18.6%",
        deals: "صفقات مفتوحة",
        dealsValue: "128",
        dealsDelta: "+24",
        conversations: "محادثات الواتساب",
        conversationsValue: "1,240",
        conversationsDelta: "+32%",
        responseTime: "وقت الاستجابة",
        responseValue: "2د 15ث",
        responseDelta: "+28%",
        pipeline: "خط المبيعات",
        stages: { new: "جديد", qualified: "مؤهل", proposal: "عرض", won: "مكسب" },
        stageValues: { new: "320", qualified: "128", proposal: "64", won: "24" },
        chips: {
          delivery: "98% تسليم واتساب",
          setup: "3x إعداد أسرع",
          insights: "رؤى ذكية — احتمال فوز الصفقة عالي",
        },
      },
    },
    trust: {
      title: "موثوق به من فرق نامية",
      logos: ["HASEEB", "MADO", "KUMDA", "SABAH", "AL MAYA", "TRUE GAMING", "iStage"],
    },
    numbers: {
      title: "الأرقام تحكي القصة",
      subtitle: "لماذا تتحول الفرق من منصات CRM المؤسسية إلى زايركس",
      cards: [
        {
          value: "80%",
          color: "#10B981",
          label: "تكلفة أقل",
          subLabel: "من التسعير لكل مقعد",
          icon: "shield",
        },
        {
          value: "48 ساعة",
          color: "#A78BFA",
          label: "من التسجيل إلى",
          subLabel: "الإنتاج الجاهز",
          icon: "bolt",
        },
        {
          value: "3",
          color: "#22D3EE",
          label: "لغات",
          subLabel: "ولهجات عربية",
          icon: "globe",
        },
        {
          value: "أصلي",
          color: "#FB923C",
          label: "واتساب",
          subLabel: "ليس إضافة ملصقة",
          icon: "chat",
        },
      ],
    },
    features: {
      tag: "كل شيء في مكان واحد",
      title: "كل ما تحتاجه.",
      titleAccent: "لا شيء لا تحتاجه.",
      subtitle:
        "منصة CRM كاملة بـ 16 ميزة أساسية — وليس 16 تطبيقاً منفصلاً غير متصل، ولا محبوسة خلف خطط مؤسسية باهظة.",
      cta: "استكشف كل المزايا",
      items: [
        { icon: "inbox", color: "#10B981", name: "صندوق وارد واتساب أصلي", desc: "كل محادثة في صندوق واحد ذكي.", badge: null },
        { icon: "pipeline", color: "#3B82F6", name: "خط المبيعات", desc: "كانبان السحب والإفلات الذي يحرّك الصفقات.", badge: null },
        { icon: "cfo", color: "#A78BFA", name: "لوحة المدير المالي الذكي", desc: "توقّع التدفق النقدي، اكتشف المخاطر، نمُ بذكاء.", badge: "جديد" },
        { icon: "quote", color: "#EC4899", name: "العروض والمقترحات", desc: "قوالب عربية/تركية، توقيع إلكتروني بنقرة واحدة.", badge: null },
        { icon: "heart", color: "#EF4444", name: "ولاء العملاء", desc: "نقاط، مستويات، إحالات — مبني للشرق الأوسط.", badge: null },
        { icon: "stack", color: "#F59E0B", name: "محرك العمولات", desc: "قواعد مخصصة، حساب تلقائي، شفافية.", badge: null },
        { icon: "tax", color: "#22D3EE", name: "محرك الضرائب", desc: "VAT، KDV، ZATCA جاهز. محدّث دائماً.", badge: null },
        { icon: "portal", color: "#06B6D4", name: "بوابة العملاء", desc: "فواتير، تذاكر، طلبات — بهويتك.", badge: null },
        { icon: "mic", color: "#F87171", name: "العربية الصوتية أولاً", desc: "تكلم. نحن نفهم. عربي وتركي وأكثر.", badge: "تجريبي" },
        { icon: "agents", color: "#A78BFA", name: "وكلاء الذكاء الاصطناعي", desc: "أتمتة المتابعات، التأهيل، والإغلاق.", badge: "جديد" },
        { icon: "plug", color: "#34D399", name: "التكاملات", desc: "اربط المدفوعات والشحن والمزيد.", badge: null },
        { icon: "store", color: "#FB923C", name: "المتجر", desc: "وسّع زايركس بتطبيقات قوية.", badge: null },
      ],
    },
    whyBeats: {
      title: "لماذا يتفوّق زايركس على",
      titleAccent: "منصات CRM المؤسسية",
      cards: [
        {
          icon: "anchor",
          color: "#1A56DB",
          title: "مبني فعلاً للمنطقة",
          desc: "صُمّم في الشرق الأوسط وتركيا للأعمال المحلية.",
        },
        {
          icon: "whatsapp",
          color: "#10B981",
          title: "واتساب في القلب",
          desc: "أصلي. ليس تكاملاً. النظام كله مبني حوله.",
        },
        {
          icon: "shield",
          color: "#22D3EE",
          title: "CRM + Pay + FinSuite في واحد",
          desc: "تسجيل دخول واحد. قاعدة عملاء واحدة. بدون تكاملات.",
        },
        {
          icon: "tag",
          color: "#A78BFA",
          title: "تسعير لكل شركة",
          desc: "أضف فريقك بالكامل برسوم ثابتة. لا عقوبات 'لكل مقعد'.",
        },
      ],
      globe: {
        title: "مبني للشرق الأوسط.",
        titleAccent: "جاهز للعالم.",
        bullets: [
          "تجربة عربية أولاً",
          "امتثال محلي وقواعد ضريبية",
          "دعم محلي يتحدث لغتك",
        ],
        cta: "شاهد كيف يعمل",
      },
    },
    finalCta: {
      title: "جاهز لرؤية الفرق؟",
      subtitle: "ابدأ بحساب مجاني. تحدث مع المبيعات عندما تكون جاهزاً للنمو.",
      primary: "ابدأ مجاناً — بدون بطاقة ائتمان",
      secondary: "تواصل مع المبيعات",
    },
    footer: {
      tagline:
        "الـ CRM الأصلي للواتساب، مبني للشرق الأوسط وتركيا والأسواق الناشئة. مدعوم بالذكاء الاصطناعي. عربي أولاً. موثوق به من شركات نامية.",
      headquarters: "المقر الرئيسي",
      headquartersValue: "إسطنبول، تركيا",
      emailLabel: "البريد الإلكتروني",
      emailValue: "hello@zyrix.co",
      whatsappLabel: "واتساب",
      whatsappValue: "+90 545 221 0888",
      copyright: "© 2026 زايركس CRM. جميع الحقوق محفوظة.",
      columns: {
        product: {
          title: "المنتج",
          links: ["المزايا", "الأسعار", "التكاملات", "المدير المالي الذكي", "واتساب CRM"],
        },
        solutions: {
          title: "الحلول",
          links: ["حسب الصناعة", "حسب الدور", "حالات الاستخدام", "قصص العملاء"],
        },
        resources: {
          title: "الموارد",
          links: ["الوثائق", "مرجع API", "مركز المساعدة", "المدونة", "حالة النظام"],
        },
        company: {
          title: "الشركة",
          links: ["عن زايركس", "الوظائف", "الشركاء", "تواصل معنا", "سجل التغييرات"],
        },
        legal: {
          title: "قانوني",
          links: ["سياسة الخصوصية", "شروط الخدمة", "الأمان", "ملحق معالجة البيانات"],
        },
      },
    },
  },
  tr: {
    nav: {
      product: "Ürün",
      solutions: "Çözümler",
      pricing: "Fiyatlandırma",
      resources: "Kaynaklar",
      company: "Şirket",
    },
    cta: {
      signIn: "Giriş yap",
      startFree: "Ücretsiz başla",
      startFreeFull: "Ücretsiz başla — Kredi kartı yok",
      talkToSales: "Satışla konuş",
      seeHowItWorks: "Nasıl çalıştığını gör",
      exploreFeatures: "Tüm özellikleri keşfet",
    },
    hero: {
      badge: "AI DESTEKLİ. WHATSAPP YERLİ. ARAPÇA ÖNCELİKLİ.",
      headlineLine1: "İşin gerçekten",
      headlineLine2: "olduğu yere göre",
      headlineLine3: "tasarlanmış CRM",
      subheadline:
        "Zyrix, MENA ve Türkiye ekipleri için hepsi-bir-arada CRM'dir.\nWhatsApp merkezde. Arapça öncelikli tasarım.\nDiğer her şey, nihayet bağlantılı.",
      socialProof: "MENA ve Türkiye'de 500+ şirket tarafından kullanılıyor",
      dashboard: {
        title: "Zyrix CRM",
        revenue: "Bu ayki gelir",
        revenueValue: "245.000 SAR",
        revenueDelta: "+%18.6",
        deals: "Açık Fırsatlar",
        dealsValue: "128",
        dealsDelta: "+24",
        conversations: "WhatsApp Konuşmaları",
        conversationsValue: "1.240",
        conversationsDelta: "+%32",
        responseTime: "Yanıt Süresi",
        responseValue: "2dk 15sn",
        responseDelta: "+%28",
        pipeline: "Pipeline",
        stages: { new: "Yeni", qualified: "Nitelikli", proposal: "Teklif", won: "Kazanıldı" },
        stageValues: { new: "320", qualified: "128", proposal: "64", won: "24" },
        chips: {
          delivery: "%98 WhatsApp teslimi",
          setup: "3x Daha hızlı kurulum",
          insights: "AI İçgörüler — Fırsat kazanma olasılığı yüksek",
        },
      },
    },
    trust: {
      title: "Büyüyen ekipler tarafından güvenildi",
      logos: ["HASEEB", "MADO", "KUMDA", "SABAH", "AL MAYA", "TRUE GAMING", "iStage"],
    },
    numbers: {
      title: "Sayılar hikayeyi anlatıyor",
      subtitle: "Ekipler kurumsal CRM platformlarından neden Zyrix'e geçiyor",
      cards: [
        {
          value: "%80",
          color: "#10B981",
          label: "Daha düşük maliyet",
          subLabel: "koltuk başına fiyatlandırmadan",
          icon: "shield",
        },
        {
          value: "48s",
          color: "#A78BFA",
          label: "Kayıttan",
          subLabel: "üretime hazır",
          icon: "bolt",
        },
        {
          value: "3",
          color: "#22D3EE",
          label: "Dil",
          subLabel: "Arapça lehçeleri",
          icon: "globe",
        },
        {
          value: "Yerli",
          color: "#FB923C",
          label: "WhatsApp",
          subLabel: "Yapıştırılmış eklenti değil",
          icon: "chat",
        },
      ],
    },
    features: {
      tag: "HEPSİ BİR ARADA",
      title: "İhtiyacın olan her şey.",
      titleAccent: "İhtiyacın olmayan hiçbir şey.",
      subtitle:
        "16 ayrı bağlantısız uygulama değil, pahalı kurumsal seviyelerin arkasında kilitli olmayan 16 temel özellikli komple bir CRM platformu.",
      cta: "Tüm özellikleri keşfet",
      items: [
        { icon: "inbox", color: "#10B981", name: "WhatsApp Yerli Gelen Kutusu", desc: "Her konuşma tek akıllı gelen kutusunda.", badge: null },
        { icon: "pipeline", color: "#3B82F6", name: "Satış Pipeline", desc: "Fırsatları taşıyan sürükle-bırak Kanban.", badge: null },
        { icon: "cfo", color: "#A78BFA", name: "AI CFO Panosu", desc: "Nakit akışını tahmin et, riskleri yakala, akıllı büyü.", badge: "Yeni" },
        { icon: "quote", color: "#EC4899", name: "Teklifler & Önermeler", desc: "Arapça/Türkçe şablonlar, tek tıkla e-imza.", badge: null },
        { icon: "heart", color: "#EF4444", name: "Müşteri Sadakati", desc: "Puanlar, kademeler, referanslar — MENA için yapıldı.", badge: null },
        { icon: "stack", color: "#F59E0B", name: "Komisyon Motoru", desc: "Özel kurallar, otomatik hesap, şeffaf.", badge: null },
        { icon: "tax", color: "#22D3EE", name: "Vergi Motoru", desc: "VAT, KDV, ZATCA hazır. Her zaman güncel.", badge: null },
        { icon: "portal", color: "#06B6D4", name: "Müşteri Portalı", desc: "Faturalar, ticketlar, siparişler — markalı.", badge: null },
        { icon: "mic", color: "#F87171", name: "Sesli Arapça Öncelikli", desc: "Konuş. Anlıyoruz. Arapça, Türkçe ve daha fazlası.", badge: "Beta" },
        { icon: "agents", color: "#A78BFA", name: "AI Ajanları", desc: "Takipleri otomatikleştir, nitelikleştir, kapat.", badge: "Yeni" },
        { icon: "plug", color: "#34D399", name: "Entegrasyonlar", desc: "Ödemeleri, kargoyu ve daha fazlasını bağla.", badge: null },
        { icon: "store", color: "#FB923C", name: "Marketplace", desc: "Güçlü uygulamalarla Zyrix'i genişlet.", badge: null },
      ],
    },
    whyBeats: {
      title: "Zyrix neden",
      titleAccent: "kurumsal CRM platformlarını geçer",
      cards: [
        {
          icon: "anchor",
          color: "#1A56DB",
          title: "Gerçekten buralı için yapıldı",
          desc: "Yerel işletmeler için MENA & Türkiye'de tasarlandı.",
        },
        {
          icon: "whatsapp",
          color: "#10B981",
          title: "WhatsApp merkezde",
          desc: "Yerli. Entegrasyon değil. Sistemin tamamı onun etrafında.",
        },
        {
          icon: "shield",
          color: "#22D3EE",
          title: "CRM + Pay + FinSuite bir arada",
          desc: "Tek giriş. Tek müşteri veritabanı. Entegrasyon gerekmez.",
        },
        {
          icon: "tag",
          color: "#A78BFA",
          title: "Şirket başına fiyat",
          desc: "Tüm ekibini tek sabit ücretle ekle. 'Koltuk başına' cezası yok.",
        },
      ],
      globe: {
        title: "MENA için yapıldı.",
        titleAccent: "Dünyaya hazır.",
        bullets: [
          "Arapça öncelikli deneyim",
          "Yerel uyum & vergi kuralları",
          "Dilini konuşan yerel destek",
        ],
        cta: "Nasıl çalıştığını gör",
      },
    },
    finalCta: {
      title: "Farkı görmeye hazır mısın?",
      subtitle: "Ücretsiz hesapla başla. Ölçeklemeye hazır olduğunda satışla konuş.",
      primary: "Ücretsiz başla — Kredi kartı yok",
      secondary: "Satışla konuş",
    },
    footer: {
      tagline:
        "MENA, Türkiye ve gelişen pazarlar için inşa edilmiş WhatsApp yerli CRM. AI destekli. Arapça öncelikli. Büyüyen işletmeler tarafından güvenildi.",
      headquarters: "Genel Merkez",
      headquartersValue: "İstanbul, Türkiye",
      emailLabel: "E-posta",
      emailValue: "hello@zyrix.co",
      whatsappLabel: "WhatsApp",
      whatsappValue: "+90 545 221 0888",
      copyright: "© 2026 Zyrix CRM. Tüm hakları saklıdır.",
      columns: {
        product: {
          title: "Ürün",
          links: ["Özellikler", "Fiyatlandırma", "Entegrasyonlar", "AI CFO", "WhatsApp CRM"],
        },
        solutions: {
          title: "Çözümler",
          links: ["Sektöre Göre", "Role Göre", "Kullanım Durumları", "Müşteri Hikayeleri"],
        },
        resources: {
          title: "Kaynaklar",
          links: ["Dokümantasyon", "API Referansı", "Yardım Merkezi", "Blog", "Sistem Durumu"],
        },
        company: {
          title: "Şirket",
          links: ["Hakkımızda", "Kariyer", "Ortaklar", "İletişim", "Changelog"],
        },
        legal: {
          title: "Yasal",
          links: ["Gizlilik Politikası", "Hizmet Şartları", "Güvenlik", "Veri İşleme Eki"],
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
