/* eslint-disable */
// Sprint 14i — translation merges for the 11 post-deploy fixes.
// - Replaces Landing.pricing 3-plan keys with 4-plan structure (Fix 1)
// - Adds Landing.hero.ctaSignUp (Fix 2)
// - Adds Landing.nav.aiAgents (Fix 3)
// - Adds AIAgents namespace (Fix 3)
// - Replaces Pricing.faq with 10 SEO Q&A (Fix 4)
// - Adds hero.live.metric{1,2,3}{,Label} per Solutions* namespace (Fix 7)
// idempotent — safe to re-run.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = ["en", "ar", "tr"].map((l) => ({
  locale: l,
  path: path.join(ROOT, "messages", `${l}.json`),
}));

// ──────────────────────────────────────────────────────────────────
// Fix 1 — Landing.pricing (4-plan structure)
// ──────────────────────────────────────────────────────────────────
const PRICING = {
  en: {
    eyebrow: "Simple, fair pricing",
    title: "Pricing that",
    titleEmphasis: "grows with your team",
    subtitle:
      "Up to 80% lower than per-seat CRMs. No surprise fees, no per-user lock-in. Cancel anytime.",
    popular: "Most popular",
    freeName: "Free",
    freePrice: "$0",
    freeDescription: "For small teams getting started — no credit card.",
    freeFeature1: "3 users",
    freeFeature2: "100 contacts",
    freeFeature3: "1 GB storage",
    freeFeature4: "100 WhatsApp msgs/mo",
    freeCta: "Get started",
    starterName: "Starter",
    starterPrice: "$19/mo",
    starterDescription: "For growing teams that need more capacity.",
    starterFeature1: "10 users",
    starterFeature2: "1,000 contacts",
    starterFeature3: "10 GB storage",
    starterFeature4: "2,000 WhatsApp msgs/mo",
    starterCta: "Start free trial",
    businessName: "Business",
    businessPrice: "$49/mo",
    businessDescription: "For growing businesses with full needs.",
    businessFeature1: "50 users",
    businessFeature2: "10,000 contacts",
    businessFeature3: "100 GB storage",
    businessFeature4: "20,000 WhatsApp msgs/mo",
    businessCta: "Start free trial",
    enterpriseName: "Enterprise",
    enterprisePrice: "Custom",
    enterpriseDescription:
      "Custom rollouts, dedicated infrastructure, and white-glove onboarding.",
    enterpriseFeature1: "Unlimited users",
    enterpriseFeature2: "Unlimited contacts",
    enterpriseFeature3: "Unlimited storage",
    enterpriseFeature4: "Unlimited messages",
    enterpriseCta: "Contact sales",
    disclaimer:
      "Final pricing depends on team size, integrations, and rollout scope. Contact sales for a tailored quote.",
  },
  ar: {
    eyebrow: "تسعير بسيط وعادل",
    title: "تسعير",
    titleEmphasis: "ينمو مع فريقك",
    subtitle:
      "أقل بنسبة تصل إلى 80% من أنظمة CRM التي تُسعّر لكل مستخدم. بدون رسوم مفاجئة، بدون ربط بكل مستخدم. ألغِ في أي وقت.",
    popular: "الأكثر شيوعاً",
    freeName: "مجاني",
    freePrice: "0$",
    freeDescription: "للفرق الصغيرة التي تبدأ — بدون بطاقة ائتمان.",
    freeFeature1: "3 مستخدمين",
    freeFeature2: "100 جهة اتصال",
    freeFeature3: "1 جيجابايت تخزين",
    freeFeature4: "100 رسالة واتساب/شهر",
    freeCta: "ابدأ الآن",
    starterName: "المبتدئ",
    starterPrice: "19$/شهر",
    starterDescription: "للفرق النامية التي تحتاج إلى سعة أكبر.",
    starterFeature1: "10 مستخدمين",
    starterFeature2: "1,000 جهة اتصال",
    starterFeature3: "10 جيجابايت تخزين",
    starterFeature4: "2,000 رسالة واتساب/شهر",
    starterCta: "ابدأ التجربة المجانية",
    businessName: "الأعمال",
    businessPrice: "49$/شهر",
    businessDescription: "للأعمال النامية ذات الاحتياجات الكاملة.",
    businessFeature1: "50 مستخدماً",
    businessFeature2: "10,000 جهة اتصال",
    businessFeature3: "100 جيجابايت تخزين",
    businessFeature4: "20,000 رسالة واتساب/شهر",
    businessCta: "ابدأ التجربة المجانية",
    enterpriseName: "المؤسسات",
    enterprisePrice: "مخصص",
    enterpriseDescription:
      "تنفيذات مخصصة، بنية تحتية مكرّسة، وإعداد مع دعم كامل.",
    enterpriseFeature1: "مستخدمون غير محدودين",
    enterpriseFeature2: "جهات اتصال غير محدودة",
    enterpriseFeature3: "تخزين غير محدود",
    enterpriseFeature4: "رسائل غير محدودة",
    enterpriseCta: "تواصل مع المبيعات",
    disclaimer:
      "السعر النهائي يعتمد على حجم الفريق والتكاملات ونطاق التنفيذ. تواصل مع المبيعات لعرض سعر مخصص.",
  },
  tr: {
    eyebrow: "Basit, adil fiyatlandırma",
    title: "Ekibinizle",
    titleEmphasis: "büyüyen fiyatlandırma",
    subtitle:
      "Koltuk başına CRM'lerden %80'e varan oranda daha ucuz. Sürpriz ücret yok, kullanıcı başına kilitlenme yok. İstediğiniz zaman iptal edin.",
    popular: "En popüler",
    freeName: "Ücretsiz",
    freePrice: "$0",
    freeDescription: "Başlayan küçük ekipler için — kredi kartı gerekmez.",
    freeFeature1: "3 kullanıcı",
    freeFeature2: "100 kişi",
    freeFeature3: "1 GB depolama",
    freeFeature4: "Aylık 100 WhatsApp mesajı",
    freeCta: "Başla",
    starterName: "Başlangıç",
    starterPrice: "$19/ay",
    starterDescription: "Daha fazla kapasiteye ihtiyaç duyan büyüyen ekipler için.",
    starterFeature1: "10 kullanıcı",
    starterFeature2: "1.000 kişi",
    starterFeature3: "10 GB depolama",
    starterFeature4: "Aylık 2.000 WhatsApp mesajı",
    starterCta: "Ücretsiz dene",
    businessName: "İşletme",
    businessPrice: "$49/ay",
    businessDescription: "Tam ihtiyaçları olan büyüyen işletmeler için.",
    businessFeature1: "50 kullanıcı",
    businessFeature2: "10.000 kişi",
    businessFeature3: "100 GB depolama",
    businessFeature4: "Aylık 20.000 WhatsApp mesajı",
    businessCta: "Ücretsiz dene",
    enterpriseName: "Kurumsal",
    enterprisePrice: "Özel",
    enterpriseDescription:
      "Özel kurulumlar, ayrılmış altyapı ve birebir kurulum desteği.",
    enterpriseFeature1: "Sınırsız kullanıcı",
    enterpriseFeature2: "Sınırsız kişi",
    enterpriseFeature3: "Sınırsız depolama",
    enterpriseFeature4: "Sınırsız mesaj",
    enterpriseCta: "Satışla iletişime geç",
    disclaimer:
      "Nihai fiyat ekip boyutu, entegrasyonlar ve kurulum kapsamına bağlıdır. Özel teklif için satış ekibiyle iletişime geçin.",
  },
};

// ──────────────────────────────────────────────────────────────────
// Fix 3 — AIAgents namespace
// ──────────────────────────────────────────────────────────────────
const AI_AGENTS = {
  en: {
    eyebrow: "AI AGENTS",
    hero: {
      title: "AI agents that actually close deals",
      subtitle:
        "Six purpose-built AI agents that handle lead qualification, follow-ups, scheduling, translation, and more — all trained on Arabic, Turkish, and English business contexts.",
      ctaPrimary: "Try AI agents free",
      ctaSecondary: "See a demo",
    },
    agents: {
      eyebrow: "MEET THE TEAM",
      title: "Six agents. One mission: convert.",
      subtitle:
        "Each agent is purpose-built for a specific job — and they all work together inside Zyrix.",
      sales: {
        title: "Sales Agent",
        desc: "Qualifies leads, sends quotes, handles objections — in Arabic, Turkish, or English. Hands off to humans when needed.",
      },
      support: {
        title: "Support Agent",
        desc: "Answers FAQs, handles refunds, escalates complaints. Trained on your knowledge base + product docs.",
      },
      qualifier: {
        title: "Lead Qualifier",
        desc: "Asks the right discovery questions. Scores leads. Routes hot leads to your top reps instantly.",
      },
      scheduler: {
        title: "Scheduler Agent",
        desc: "Books meetings, viewings, demos. Syncs with Google Calendar. Sends confirmations and reminders.",
      },
      followup: {
        title: "Follow-up Agent",
        desc: "Re-engages cold leads. Sends personalized check-ins. Recovers abandoned carts. Never lets a deal die.",
      },
      translator: {
        title: "Translation Agent",
        desc: "Real-time AR ↔ TR ↔ EN translation in WhatsApp threads. Your team sells, the agent translates.",
      },
    },
    capabilities: {
      eyebrow: "WHAT THEY DO",
      title: "Capabilities you actually need",
      cap1: "Native Arabic, Turkish, and English understanding — not Google Translate quality",
      cap2: "Trained on your knowledge base, product catalog, and past conversations",
      cap3: "Hand off to humans gracefully when complexity exceeds capability",
      cap4: "Full audit trail — every agent decision logged and reviewable",
      cap5: "Customizable personality and tone per agent and per market",
      cap6: "Privacy-first: your data is never used to train other companies' models",
    },
    cta: {
      title: "Hire your AI team in 60 seconds",
      subtitle:
        "Start with one agent free. Add more as you grow. Cancel anytime.",
      primary: "Start free trial",
    },
  },
  ar: {
    eyebrow: "وكلاء الذكاء الاصطناعي",
    hero: {
      title: "وكلاء ذكاء اصطناعي يغلقون الصفقات فعلاً",
      subtitle:
        "ستة وكلاء ذكاء اصطناعي مصممون خصيصاً لتأهيل العملاء المحتملين والمتابعات والجدولة والترجمة والمزيد — جميعهم مدربون على السياقات التجارية العربية والتركية والإنجليزية.",
      ctaPrimary: "جرّب وكلاء الذكاء الاصطناعي مجاناً",
      ctaSecondary: "شاهد عرضاً توضيحياً",
    },
    agents: {
      eyebrow: "تعرف على الفريق",
      title: "ستة وكلاء. مهمة واحدة: التحويل.",
      subtitle: "كل وكيل مصمم لمهمة محددة — وكلهم يعملون معاً داخل Zyrix.",
      sales: {
        title: "وكيل المبيعات",
        desc: "يؤهل العملاء المحتملين، يرسل عروض الأسعار، يتعامل مع الاعتراضات — بالعربية أو التركية أو الإنجليزية. يحوّل للبشر عند الحاجة.",
      },
      support: {
        title: "وكيل الدعم",
        desc: "يجيب على الأسئلة الشائعة، يتعامل مع الاسترجاع، يصعّد الشكاوى. مدرب على قاعدة معرفتك ووثائق المنتج.",
      },
      qualifier: {
        title: "مؤهل العملاء المحتملين",
        desc: "يطرح أسئلة الاستكشاف الصحيحة. يقيّم العملاء المحتملين. يوجّه العملاء الجاهزين لأفضل مندوبيك فوراً.",
      },
      scheduler: {
        title: "وكيل الجدولة",
        desc: "يحجز الاجتماعات والمعاينات والعروض التوضيحية. يتزامن مع Google Calendar. يرسل التأكيدات والتذكيرات.",
      },
      followup: {
        title: "وكيل المتابعة",
        desc: "يعيد إشراك العملاء المحتملين الباردين. يرسل رسائل متابعة مخصصة. يستعيد العربات المتروكة. لا يدع صفقة تموت أبداً.",
      },
      translator: {
        title: "وكيل الترجمة",
        desc: "ترجمة فورية بين العربية والتركية والإنجليزية في محادثات واتساب. فريقك يبيع، الوكيل يترجم.",
      },
    },
    capabilities: {
      eyebrow: "ماذا يفعلون",
      title: "قدرات تحتاجها فعلاً",
      cap1: "فهم أصلي للعربية والتركية والإنجليزية — وليس جودة Google Translate",
      cap2: "مدربون على قاعدة معرفتك وكتالوج المنتجات والمحادثات السابقة",
      cap3: "يحوّلون للبشر بسلاسة عندما يتجاوز التعقيد القدرة",
      cap4: "سجل تدقيق كامل — كل قرار وكيل مسجل وقابل للمراجعة",
      cap5: "شخصية ولهجة قابلة للتخصيص لكل وكيل ولكل سوق",
      cap6: "الخصوصية أولاً: بياناتك لا تُستخدم أبداً لتدريب نماذج شركات أخرى",
    },
    cta: {
      title: "وظّف فريق الذكاء الاصطناعي في 60 ثانية",
      subtitle:
        "ابدأ بوكيل واحد مجاناً. أضف المزيد مع نموك. ألغِ في أي وقت.",
      primary: "ابدأ التجربة المجانية",
    },
  },
  tr: {
    eyebrow: "YAPAY ZEKA AJANLARI",
    hero: {
      title: "Gerçekten anlaşma kapatan AI ajanları",
      subtitle:
        "Lead nitelendirme, takip, randevu, çeviri ve daha fazlasını ele alan altı amaca yönelik AI ajanı — hepsi Arapça, Türkçe ve İngilizce iş bağlamlarında eğitilmiş.",
      ctaPrimary: "AI ajanlarını ücretsiz deneyin",
      ctaSecondary: "Demo izleyin",
    },
    agents: {
      eyebrow: "EKİPLE TANIŞIN",
      title: "Altı ajan. Tek görev: dönüşüm.",
      subtitle:
        "Her ajan belirli bir iş için özel olarak tasarlandı — ve hepsi Zyrix içinde birlikte çalışır.",
      sales: {
        title: "Satış Ajanı",
        desc: "Lead'leri nitelendirir, teklifler gönderir, itirazları ele alır — Arapça, Türkçe veya İngilizce. Gerektiğinde insana devreder.",
      },
      support: {
        title: "Destek Ajanı",
        desc: "SSS'leri yanıtlar, iadeleri ele alır, şikayetleri yükseltir. Bilgi tabanınız ve ürün dokümanları üzerinde eğitilmiş.",
      },
      qualifier: {
        title: "Lead Nitelendirici",
        desc: "Doğru keşif sorularını sorar. Lead'leri puanlar. Sıcak lead'leri en iyi temsilcilerinize anında yönlendirir.",
      },
      scheduler: {
        title: "Randevu Ajanı",
        desc: "Toplantılar, ziyaretler, demolar rezerve eder. Google Calendar ile senkronize olur. Onaylar ve hatırlatmalar gönderir.",
      },
      followup: {
        title: "Takip Ajanı",
        desc: "Soğuk lead'leri yeniden ısıtır. Kişiselleştirilmiş takipler gönderir. Terk edilmiş sepetleri kurtarır. Hiçbir anlaşmanın ölmesine izin vermez.",
      },
      translator: {
        title: "Çeviri Ajanı",
        desc: "WhatsApp konuşmalarında gerçek zamanlı AR ↔ TR ↔ EN çeviri. Ekibiniz satar, ajan çevirir.",
      },
    },
    capabilities: {
      eyebrow: "NE YAPARLAR",
      title: "Gerçekten ihtiyacınız olan yetenekler",
      cap1: "Yerel Arapça, Türkçe ve İngilizce anlayışı — Google Translate kalitesi değil",
      cap2: "Bilgi tabanınız, ürün kataloğunuz ve geçmiş konuşmalar üzerinde eğitilmiş",
      cap3: "Karmaşıklık yeteneği aştığında zarif bir şekilde insanlara devreder",
      cap4: "Tam denetim izi — her ajan kararı kayıtlı ve incelenebilir",
      cap5: "Her ajan ve pazar için özelleştirilebilir kişilik ve ton",
      cap6: "Önce gizlilik: verileriniz başka şirketlerin modellerini eğitmek için asla kullanılmaz",
    },
    cta: {
      title: "AI ekibinizi 60 saniyede işe alın",
      subtitle:
        "Bir ajanla ücretsiz başlayın. Büyüdükçe daha fazlasını ekleyin. İstediğiniz zaman iptal edin.",
      primary: "Ücretsiz deneme başlat",
    },
  },
};

// ──────────────────────────────────────────────────────────────────
// Fix 4 — Pricing.faq (10 SEO Q&A, nested q{n}.q / q{n}.a)
// ──────────────────────────────────────────────────────────────────
const FAQ = {
  en: {
    title: "Frequently asked questions",
    q1: {
      q: "What's the best CRM for WhatsApp Business in 2026?",
      a: "Zyrix is purpose-built for WhatsApp-first commerce. Unlike traditional CRMs that bolt on WhatsApp as an afterthought, every Zyrix feature — pipelines, automation, AI agents, reporting — is designed around WhatsApp Business API. We integrate directly with Meta Cloud API, support template messages, broadcast lists, and 24-hour conversation windows.",
    },
    q2: {
      q: "Does Zyrix support Arabic and Turkish languages natively?",
      a: "Yes. Zyrix is fully translated and adapted for Arabic (with proper RTL support) and Turkish. Our AI agents understand and respond in native Arabic and Turkish — not machine-translated quality. Customer support, documentation, and onboarding are all available in EN/AR/TR.",
    },
    q3: {
      q: "Can I integrate Zyrix with my Shopify or WooCommerce store?",
      a: "Yes. Zyrix offers two-way sync with Shopify, WooCommerce, BigCommerce, and 40+ e-commerce platforms. Customer data, orders, inventory, and abandoned carts sync automatically. Setup takes 2 minutes — connect your store, authenticate, and you're live.",
    },
    q4: {
      q: "Is Zyrix suitable for MENA businesses with Cash on Delivery?",
      a: "Absolutely. Zyrix has native COD lifecycle tracking — confirmation, courier pickup, delivery, cash collection, and bank reconciliation. We integrate with regional couriers including SMSA, Aramex, Naqel (KSA), MNG Kargo, Yurtiçi Kargo, J&T (Türkiye), and 25+ more.",
    },
    q5: {
      q: "How does Zyrix pricing compare to HubSpot or Salesforce?",
      a: "Zyrix is up to 80% cheaper than per-seat CRMs like HubSpot or Salesforce. Our flat plan structure means no per-user fees — add unlimited team members on Business and Enterprise plans. Plus, we don't charge extra for features that should be standard (WhatsApp, AI agents, reporting).",
    },
    q6: {
      q: "Is there a free trial for Zyrix CRM?",
      a: "Yes. Every paid plan starts with a 14-day free trial — no credit card required. Our Free plan is permanently free for solo founders and small teams (up to 3 users, 100 contacts). You can upgrade or cancel anytime.",
    },
    q7: {
      q: "What industries does Zyrix support?",
      a: "Zyrix is used by sales teams, e-commerce stores, real estate brokers, medical clinics, marketing agencies, and SaaS companies across the MENA region and Türkiye. We have dedicated solution pages and pre-built workflows for each industry.",
    },
    q8: {
      q: "Does Zyrix comply with Saudi PDPL, Turkish KVKK, and GDPR?",
      a: "Yes. Zyrix is compliant with Saudi PDPL (Personal Data Protection Law), Turkish KVKK (Kişisel Verileri Koruma Kanunu), and EU GDPR. We offer data residency options in your region, full audit logs, encryption at rest and in transit, and signed Data Processing Agreements.",
    },
    q9: {
      q: "Can I migrate my data from another CRM to Zyrix?",
      a: "Yes. Zyrix supports CSV import, API migration, and custom data transfer from HubSpot, Salesforce, Pipedrive, Zoho, monday.com, and most major CRMs. Our team offers free migration assistance for Business and Enterprise plans.",
    },
    q10: {
      q: "What happens to my data if I cancel?",
      a: "Your data belongs to you. On cancellation, you can export everything as CSV or JSON within 90 days. After that, we permanently delete your data per our retention policy. We never sell your data, never use it to train AI models for other companies, and you can request deletion at any time.",
    },
  },
  ar: {
    title: "الأسئلة الشائعة",
    q1: {
      q: "ما أفضل CRM لواتساب أعمال في 2026؟",
      a: "Zyrix مصمم خصيصاً للتجارة عبر واتساب. على عكس أنظمة CRM التقليدية التي تضيف واتساب كميزة لاحقة، كل ميزة في Zyrix — قنوات المبيعات، الأتمتة، وكلاء الذكاء الاصطناعي، التقارير — مصممة حول WhatsApp Business API. نتكامل مباشرة مع Meta Cloud API وندعم رسائل القوالب وقوائم البث ونوافذ المحادثة لـ24 ساعة.",
    },
    q2: {
      q: "هل يدعم Zyrix العربية والتركية بشكل أصلي؟",
      a: "نعم. Zyrix مترجم ومُكيَّف بالكامل للعربية (مع دعم كامل للاتجاه من اليمين لليسار) والتركية. وكلاء الذكاء الاصطناعي لدينا يفهمون ويردون بالعربية والتركية الأصلية — وليس بجودة الترجمة الآلية. دعم العملاء والوثائق والإعداد متوفرة جميعها بالإنجليزية/العربية/التركية.",
    },
    q3: {
      q: "هل يمكنني ربط Zyrix بمتجر Shopify أو WooCommerce؟",
      a: "نعم. يوفر Zyrix مزامنة ثنائية الاتجاه مع Shopify وWooCommerce وBigCommerce وأكثر من 40 منصة تجارة إلكترونية. تتم مزامنة بيانات العملاء والطلبات والمخزون والعربات المتروكة تلقائياً. الإعداد يستغرق دقيقتين — اربط متجرك، صادق، وأنت جاهز للعمل.",
    },
    q4: {
      q: "هل Zyrix مناسب لشركات الشرق الأوسط التي تستخدم الدفع عند الاستلام؟",
      a: "بالتأكيد. يحتوي Zyrix على تتبع أصلي لدورة حياة الدفع عند الاستلام — التأكيد، استلام شركة الشحن، التسليم، تحصيل النقد، والتسوية البنكية. نتكامل مع شركات الشحن الإقليمية بما في ذلك SMSA وAramex وNaqel (السعودية) وMNG Kargo وYurtiçi Kargo وJ&T (تركيا) و25+ شركة أخرى.",
    },
    q5: {
      q: "كيف يقارن سعر Zyrix بـHubSpot أو Salesforce؟",
      a: "Zyrix أرخص بنسبة تصل إلى 80% من أنظمة CRM التي تُسعّر لكل مستخدم مثل HubSpot أو Salesforce. هيكل خطتنا الثابتة يعني عدم وجود رسوم لكل مستخدم — أضف أعضاء فريق غير محدودين على خطط الأعمال والمؤسسات. بالإضافة إلى ذلك، لا نفرض رسوماً إضافية على الميزات التي يجب أن تكون قياسية (واتساب، وكلاء الذكاء الاصطناعي، التقارير).",
    },
    q6: {
      q: "هل هناك تجربة مجانية لـZyrix CRM؟",
      a: "نعم. تبدأ كل خطة مدفوعة بتجربة مجانية لمدة 14 يوماً — بدون بطاقة ائتمان. خطة Free لدينا مجانية دائماً للمؤسسين المنفردين والفرق الصغيرة (حتى 3 مستخدمين، 100 جهة اتصال). يمكنك الترقية أو الإلغاء في أي وقت.",
    },
    q7: {
      q: "ما الصناعات التي يدعمها Zyrix؟",
      a: "يستخدم Zyrix فرق المبيعات ومتاجر التجارة الإلكترونية ووسطاء العقارات والعيادات الطبية ووكالات التسويق وشركات SaaS في منطقة الشرق الأوسط وتركيا. لدينا صفحات حلول مخصصة وسير عمل جاهز لكل صناعة.",
    },
    q8: {
      q: "هل يمتثل Zyrix لـPDPL السعودي وKVKK التركي وGDPR؟",
      a: "نعم. Zyrix متوافق مع PDPL السعودي (نظام حماية البيانات الشخصية)، وKVKK التركي (Kişisel Verileri Koruma Kanunu)، وGDPR الأوروبي. نوفر خيارات إقامة البيانات في منطقتك، وسجلات تدقيق كاملة، وتشفير أثناء التخزين والنقل، واتفاقيات معالجة البيانات الموقّعة.",
    },
    q9: {
      q: "هل يمكنني نقل بياناتي من نظام CRM آخر إلى Zyrix؟",
      a: "نعم. يدعم Zyrix استيراد CSV، ونقل API، ونقل البيانات المخصص من HubSpot وSalesforce وPipedrive وZoho وmonday.com ومعظم أنظمة CRM الرئيسية. يقدم فريقنا مساعدة مجانية في النقل لخطط الأعمال والمؤسسات.",
    },
    q10: {
      q: "ماذا يحدث لبياناتي إذا ألغيت الاشتراك؟",
      a: "بياناتك ملك لك. عند الإلغاء، يمكنك تصدير كل شيء بصيغة CSV أو JSON خلال 90 يوماً. بعد ذلك، نحذف بياناتك بشكل دائم وفقاً لسياسة الاحتفاظ لدينا. نحن لا نبيع بياناتك أبداً، ولا نستخدمها أبداً لتدريب نماذج الذكاء الاصطناعي لشركات أخرى، ويمكنك طلب الحذف في أي وقت.",
    },
  },
  tr: {
    title: "Sıkça sorulan sorular",
    q1: {
      q: "2026'da WhatsApp Business için en iyi CRM hangisi?",
      a: "Zyrix, WhatsApp öncelikli ticaret için özel olarak tasarlanmıştır. WhatsApp'ı sonradan eklenen bir özellik gibi gören geleneksel CRM'lerin aksine, Zyrix'teki her özellik — satış hattı, otomasyon, AI ajanları, raporlama — WhatsApp Business API etrafında tasarlanmıştır. Meta Cloud API ile doğrudan entegre oluyoruz, şablon mesajlarını, yayın listelerini ve 24 saatlik konuşma pencerelerini destekliyoruz.",
    },
    q2: {
      q: "Zyrix Arapça ve Türkçe'yi yerel olarak destekliyor mu?",
      a: "Evet. Zyrix Arapça (RTL desteğiyle) ve Türkçe için tamamen çevrilmiş ve uyarlanmıştır. AI ajanlarımız yerel Arapça ve Türkçe'yi anlar ve yanıtlar — makine çevirisi kalitesinde değil. Müşteri desteği, dokümantasyon ve kurulum EN/AR/TR'de mevcuttur.",
    },
    q3: {
      q: "Zyrix'i Shopify veya WooCommerce mağazama entegre edebilir miyim?",
      a: "Evet. Zyrix, Shopify, WooCommerce, BigCommerce ve 40+ e-ticaret platformuyla iki yönlü senkronizasyon sunar. Müşteri verileri, siparişler, envanter ve terk edilmiş sepetler otomatik olarak senkronize olur. Kurulum 2 dakika sürer — mağazanızı bağlayın, kimlik doğrulayın ve yayında olun.",
    },
    q4: {
      q: "Zyrix Kapıda Ödeme kullanan MENA işletmeleri için uygun mu?",
      a: "Kesinlikle. Zyrix, KKÖ yaşam döngüsü takibine sahiptir — onay, kurye teslim alma, teslimat, nakit tahsilat ve banka mutabakatı. SMSA, Aramex, Naqel (KSA), MNG Kargo, Yurtiçi Kargo, J&T (Türkiye) dahil bölgesel kuryeler ve 25+ daha fazlasıyla entegre oluyoruz.",
    },
    q5: {
      q: "Zyrix fiyatlandırması HubSpot veya Salesforce ile nasıl karşılaştırılır?",
      a: "Zyrix, HubSpot veya Salesforce gibi koltuk başına CRM'lerden %80'e varan oranda daha ucuzdur. Düz plan yapımız kullanıcı başına ücret olmadığı anlamına gelir — İşletme ve Kurumsal planlarda sınırsız ekip üyesi ekleyin. Ayrıca, standart olması gereken özellikler (WhatsApp, AI ajanları, raporlama) için ekstra ücret almayız.",
    },
    q6: {
      q: "Zyrix CRM için ücretsiz deneme var mı?",
      a: "Evet. Her ücretli plan 14 günlük ücretsiz deneme ile başlar — kredi kartı gerekmez. Ücretsiz planımız, tek kişilik kurucular ve küçük ekipler (3 kullanıcıya, 100 kişiye kadar) için kalıcı olarak ücretsizdir. İstediğiniz zaman yükseltebilir veya iptal edebilirsiniz.",
    },
    q7: {
      q: "Zyrix hangi sektörleri destekliyor?",
      a: "Zyrix, MENA bölgesinde ve Türkiye'de satış ekipleri, e-ticaret mağazaları, emlak komisyoncuları, tıbbi klinikler, pazarlama ajansları ve SaaS şirketleri tarafından kullanılıyor. Her sektör için özel çözüm sayfalarımız ve hazır iş akışlarımız var.",
    },
    q8: {
      q: "Zyrix Suudi PDPL, Türk KVKK ve GDPR'a uyumlu mu?",
      a: "Evet. Zyrix, Suudi PDPL (Kişisel Veri Koruma Kanunu), Türk KVKK (Kişisel Verileri Koruma Kanunu) ve AB GDPR ile uyumludur. Bölgenizde veri ikamet seçenekleri, tam denetim günlükleri, dururken ve aktarım sırasında şifreleme ve imzalı Veri İşleme Anlaşmaları sunuyoruz.",
    },
    q9: {
      q: "Verilerimi başka bir CRM'den Zyrix'e taşıyabilir miyim?",
      a: "Evet. Zyrix CSV içe aktarımı, API geçişi ve HubSpot, Salesforce, Pipedrive, Zoho, monday.com ve çoğu büyük CRM'den özel veri aktarımını destekler. Ekibimiz İşletme ve Kurumsal planlar için ücretsiz geçiş desteği sunuyor.",
    },
    q10: {
      q: "Aboneliği iptal edersem verilerime ne olur?",
      a: "Verileriniz size aittir. İptal sonrasında her şeyi 90 gün içinde CSV veya JSON olarak dışa aktarabilirsiniz. Bundan sonra, saklama politikamıza göre verilerinizi kalıcı olarak siliyoruz. Verilerinizi asla satmıyoruz, başka şirketlerin AI modellerini eğitmek için asla kullanmıyoruz ve istediğiniz zaman silme talep edebilirsiniz.",
    },
  },
};

// ──────────────────────────────────────────────────────────────────
// Fix 7 — hero.live.metric{1,2,3}{,Label} per Solutions* namespace
// ──────────────────────────────────────────────────────────────────
const SOLUTION_LIVE = {
  en: {
    SolutionsSales: {
      metric1: "1,247 deals",
      metric1Label: "Closed this week",
      metric2: "500+ teams",
      metric2Label: "Across MENA & Türkiye",
      metric3: "2.4M messages",
      metric3Label: "Sent via Zyrix",
    },
    SolutionsEcommerce: {
      metric1: "8,340 orders",
      metric1Label: "Processed today",
      metric2: "320+ stores",
      metric2Label: "Live on Zyrix",
      metric3: "32% recovery",
      metric3Label: "Average cart recovery",
    },
    SolutionsRealEstate: {
      metric1: "412 viewings",
      metric1Label: "Booked this week",
      metric2: "180+ brokerages",
      metric2Label: "Across the region",
      metric3: "15min response",
      metric3Label: "Average reply time",
    },
    SolutionsClinics: {
      metric1: "2,850 appointments",
      metric1Label: "Booked today",
      metric2: "240+ clinics",
      metric2Label: "Trust Zyrix",
      metric3: "68% no-show drop",
      metric3Label: "After enabling reminders",
    },
    SolutionsAgencies: {
      metric1: "5,200 reports",
      metric1Label: "Generated this month",
      metric2: "150+ agencies",
      metric2Label: "Scaled with Zyrix",
      metric3: "10x client capacity",
      metric3Label: "Same team, more clients",
    },
  },
  ar: {
    SolutionsSales: {
      metric1: "1,247 صفقة",
      metric1Label: "أُغلقت هذا الأسبوع",
      metric2: "أكثر من 500 فريق",
      metric2Label: "في الشرق الأوسط وتركيا",
      metric3: "2.4 مليون رسالة",
      metric3Label: "أُرسلت عبر Zyrix",
    },
    SolutionsEcommerce: {
      metric1: "8,340 طلباً",
      metric1Label: "تم تجهيزها اليوم",
      metric2: "أكثر من 320 متجراً",
      metric2Label: "نشطة على Zyrix",
      metric3: "32% استرداد",
      metric3Label: "متوسط استرداد العربات",
    },
    SolutionsRealEstate: {
      metric1: "412 معاينة",
      metric1Label: "تم حجزها هذا الأسبوع",
      metric2: "أكثر من 180 مكتباً",
      metric2Label: "في المنطقة",
      metric3: "استجابة في 15 دقيقة",
      metric3Label: "متوسط وقت الرد",
    },
    SolutionsClinics: {
      metric1: "2,850 موعداً",
      metric1Label: "تم حجزها اليوم",
      metric2: "أكثر من 240 عيادة",
      metric2Label: "تثق بـZyrix",
      metric3: "68% انخفاض في عدم الحضور",
      metric3Label: "بعد تفعيل التذكيرات",
    },
    SolutionsAgencies: {
      metric1: "5,200 تقرير",
      metric1Label: "تم إنشاؤها هذا الشهر",
      metric2: "أكثر من 150 وكالة",
      metric2Label: "توسعت مع Zyrix",
      metric3: "10 أضعاف سعة العملاء",
      metric3Label: "نفس الفريق، عملاء أكثر",
    },
  },
  tr: {
    SolutionsSales: {
      metric1: "1.247 anlaşma",
      metric1Label: "Bu hafta kapatıldı",
      metric2: "500+ ekip",
      metric2Label: "MENA ve Türkiye genelinde",
      metric3: "2,4M mesaj",
      metric3Label: "Zyrix üzerinden gönderildi",
    },
    SolutionsEcommerce: {
      metric1: "8.340 sipariş",
      metric1Label: "Bugün işlendi",
      metric2: "320+ mağaza",
      metric2Label: "Zyrix'te yayında",
      metric3: "%32 geri kazanım",
      metric3Label: "Ortalama sepet kurtarma",
    },
    SolutionsRealEstate: {
      metric1: "412 ziyaret",
      metric1Label: "Bu hafta planlandı",
      metric2: "180+ ofis",
      metric2Label: "Bölge genelinde",
      metric3: "15 dk yanıt",
      metric3Label: "Ortalama yanıt süresi",
    },
    SolutionsClinics: {
      metric1: "2.850 randevu",
      metric1Label: "Bugün rezerve edildi",
      metric2: "240+ klinik",
      metric2Label: "Zyrix'e güveniyor",
      metric3: "%68 gelmeme düşüşü",
      metric3Label: "Hatırlatmalar etkinleştirildikten sonra",
    },
    SolutionsAgencies: {
      metric1: "5.200 rapor",
      metric1Label: "Bu ay üretildi",
      metric2: "150+ ajans",
      metric2Label: "Zyrix ile büyüdü",
      metric3: "10x müşteri kapasitesi",
      metric3Label: "Aynı ekip, daha fazla müşteri",
    },
  },
};

// ──────────────────────────────────────────────────────────────────
// Apply
// ──────────────────────────────────────────────────────────────────
const out = [];
for (const { locale, path: filePath } of FILES) {
  const before = fs.statSync(filePath).size;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Fix 1 — replace Landing.pricing entirely
  data.Landing ||= {};
  data.Landing.pricing = PRICING[locale];

  // Fix 2 — add Landing.hero.ctaSignUp (keep existing keys)
  data.Landing.hero ||= {};
  if (locale === "en") data.Landing.hero.ctaSignUp = "Sign up";
  if (locale === "ar") data.Landing.hero.ctaSignUp = "إنشاء حساب";
  if (locale === "tr") data.Landing.hero.ctaSignUp = "Kayıt ol";

  // Fix 3 — Landing.nav.aiAgents
  data.Landing.nav ||= {};
  if (locale === "en") data.Landing.nav.aiAgents = "AI Agents";
  if (locale === "ar") data.Landing.nav.aiAgents = "وكلاء الذكاء";
  if (locale === "tr") data.Landing.nav.aiAgents = "AI Ajanları";

  // Fix 3 — AIAgents namespace
  data.AIAgents = AI_AGENTS[locale];

  // Fix 4 — Pricing.faq replaced with 10 nested Q&A
  data.Pricing ||= {};
  data.Pricing.faq = FAQ[locale];

  // Fix 7 — solution hero.live.* keys
  for (const ns of Object.keys(SOLUTION_LIVE[locale])) {
    data[ns] ||= {};
    data[ns].hero ||= {};
    data[ns].hero.live = SOLUTION_LIVE[locale][ns];
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  const after = fs.statSync(filePath).size;
  out.push({
    locale,
    before,
    after,
    delta: `+${after - before}`,
  });
}

console.log("=== Sprint 14i — translations merged ===");
console.table(out);

// Parity check on the changed namespaces
function flat(obj, prefix = "") {
  if (!obj || typeof obj !== "object") return [prefix.replace(/\.$/, "")];
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flat(v, prefix + k + ".") : [prefix + k]
  );
}

const en = JSON.parse(fs.readFileSync(FILES[0].path, "utf8"));
const ar = JSON.parse(fs.readFileSync(FILES[1].path, "utf8"));
const tr = JSON.parse(fs.readFileSync(FILES[2].path, "utf8"));

const namespacesToCheck = [
  "Landing.pricing",
  "Landing.hero",
  "Landing.nav",
  "AIAgents",
  "Pricing.faq",
  "SolutionsSales.hero.live",
  "SolutionsEcommerce.hero.live",
  "SolutionsRealEstate.hero.live",
  "SolutionsClinics.hero.live",
  "SolutionsAgencies.hero.live",
];

console.log("\n=== Parity check ===");
function get(o, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), o);
}
let allOk = true;
for (const ns of namespacesToCheck) {
  const ek = flat(get(en, ns)).sort();
  const ak = flat(get(ar, ns)).sort();
  const tk = flat(get(tr, ns)).sort();
  const ok =
    JSON.stringify(ek) === JSON.stringify(ak) &&
    JSON.stringify(ek) === JSON.stringify(tk);
  if (!ok) {
    allOk = false;
    console.log(`  ❌ ${ns}: en=${ek.length} ar=${ak.length} tr=${tk.length}`);
  } else {
    console.log(`  ✅ ${ns}: ${ek.length} keys × 3 locales`);
  }
}
console.log(
  allOk ? "\n✅ All namespaces parity-clean." : "\n❌ Parity drift detected."
);
