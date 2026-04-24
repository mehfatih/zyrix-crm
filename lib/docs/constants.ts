// ============================================================================
// DOCS — shared constants used by content/pages/search/admin
// ============================================================================

export type DocLocale = "en" | "ar" | "tr";

export type CategoryId =
  | "overview"
  | "sales"
  | "growth"
  | "ai"
  | "operations"
  | "security"
  | "tax"
  | "integrations"
  | "platform"
  | "advanced"
  | "experience";

export type AccentName =
  | "mint"
  | "coral"
  | "lavender"
  | "sky"
  | "teal"
  | "peach"
  | "sunshine"
  | "rose"
  | "cyan";

interface CategoryDef {
  id: CategoryId;
  accent: AccentName;
  icon: string;
  count: number;
  label: Record<DocLocale, string>;
  desc: Record<DocLocale, string>;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "sales",
    accent: "mint",
    icon: "TrendingUp",
    count: 7,
    label: { en: "Sales", ar: "المبيعات", tr: "Satış" },
    desc: {
      en: "Quotes, contracts, commissions, forecasting and more.",
      ar: "العروض والعقود والعمولات والتنبؤ وغيرها.",
      tr: "Teklifler, sözleşmeler, komisyonlar, tahminleme ve daha fazlası.",
    },
  },
  {
    id: "growth",
    accent: "coral",
    icon: "Sparkles",
    count: 2,
    label: { en: "Growth", ar: "النمو", tr: "Büyüme" },
    desc: {
      en: "Loyalty and marketing automation that actually ships.",
      ar: "برامج الولاء والأتمتة التسويقية الجاهزة للانطلاق.",
      tr: "Gerçekten ürüne dönüşmüş sadakat ve pazarlama otomasyonu.",
    },
  },
  {
    id: "ai",
    accent: "lavender",
    icon: "Cpu",
    count: 7,
    label: { en: "AI", ar: "الذكاء الاصطناعي", tr: "Yapay Zeka" },
    desc: {
      en: "CFO, workflows, architect, lead scoring and more.",
      ar: "المدير المالي، سير العمل، المعماري، تقييم الفرص وغيرها.",
      tr: "CFO, iş akışları, mimar, olasılık skoru ve dahası.",
    },
  },
  {
    id: "operations",
    accent: "sky",
    icon: "Workflow",
    count: 3,
    label: { en: "Operations", ar: "العمليات", tr: "Operasyonlar" },
    desc: {
      en: "Customer portal, payments, and team collaboration.",
      ar: "بوابة العملاء، المدفوعات، والتعاون الجماعي.",
      tr: "Müşteri portalı, ödemeler ve ekip işbirliği.",
    },
  },
  {
    id: "security",
    accent: "teal",
    icon: "ShieldCheck",
    count: 6,
    label: { en: "Security", ar: "الأمان", tr: "Güvenlik" },
    desc: {
      en: "RBAC, IP allowlist, SCIM, audit log and compliance.",
      ar: "الصلاحيات وIP Allowlist وSCIM وسجل التدقيق والامتثال.",
      tr: "RBAC, IP izin listesi, SCIM, denetim günlüğü ve uyumluluk.",
    },
  },
  {
    id: "tax",
    accent: "peach",
    icon: "Receipt",
    count: 1,
    label: { en: "Tax", ar: "الضرائب", tr: "Vergi" },
    desc: {
      en: "Native tax invoices — ZATCA + e-Fatura.",
      ar: "فواتير ضريبية أصلية — ZATCA و e-Fatura.",
      tr: "Yerel vergi faturaları — ZATCA ve e-Fatura.",
    },
  },
  {
    id: "integrations",
    accent: "sunshine",
    icon: "Plug",
    count: 2,
    label: { en: "Integrations", ar: "التكاملات", tr: "Entegrasyonlar" },
    desc: {
      en: "Slack, Teams, Google Docs and more.",
      ar: "Slack، Teams، Google Docs والمزيد.",
      tr: "Slack, Teams, Google Docs ve dahası.",
    },
  },
  {
    id: "platform",
    accent: "sky",
    icon: "Globe",
    count: 1,
    label: { en: "Platform", ar: "المنصة", tr: "Platform" },
    desc: {
      en: "Network-level controls and platform security.",
      ar: "ضوابط الشبكة وأمان المنصة.",
      tr: "Ağ düzeyinde kontroller ve platform güvenliği.",
    },
  },
  {
    id: "advanced",
    accent: "rose",
    icon: "Star",
    count: 2,
    label: { en: "Advanced", ar: "متقدّم", tr: "Gelişmiş" },
    desc: {
      en: "Multi-brand management and advanced analytics.",
      ar: "إدارة متعدّدة العلامات والتحليلات المتقدمة.",
      tr: "Çoklu marka yönetimi ve gelişmiş analitik.",
    },
  },
  {
    id: "experience",
    accent: "mint",
    icon: "Wand2",
    count: 2,
    label: { en: "Experience", ar: "التجربة", tr: "Deneyim" },
    desc: {
      en: "Onboarding wizard and mobile-responsive web.",
      ar: "معالج التهيئة والويب المتجاوب مع الجوال.",
      tr: "Kurulum sihirbazı ve mobil uyumlu web.",
    },
  },
];

export const ACCENT_CLASSES: Record<
  AccentName,
  {
    text: string;
    bg: string;
    border: string;
    ring: string;
    chipBg: string;
    chipText: string;
    hoverBorder: string;
  }
> = {
  mint: {
    text: "text-emerald-700",
    bg: "bg-emerald-500",
    border: "border-emerald-200",
    ring: "ring-emerald-200",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    hoverBorder: "hover:border-emerald-400",
  },
  coral: {
    text: "text-rose-700",
    bg: "bg-rose-500",
    border: "border-rose-200",
    ring: "ring-rose-200",
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    hoverBorder: "hover:border-rose-400",
  },
  lavender: {
    text: "text-violet-700",
    bg: "bg-violet-500",
    border: "border-violet-200",
    ring: "ring-violet-200",
    chipBg: "bg-violet-50",
    chipText: "text-violet-700",
    hoverBorder: "hover:border-violet-400",
  },
  sky: {
    text: "text-sky-700",
    bg: "bg-sky-500",
    border: "border-sky-200",
    ring: "ring-sky-200",
    chipBg: "bg-sky-50",
    chipText: "text-sky-700",
    hoverBorder: "hover:border-sky-400",
  },
  teal: {
    text: "text-teal-700",
    bg: "bg-teal-500",
    border: "border-teal-200",
    ring: "ring-teal-200",
    chipBg: "bg-teal-50",
    chipText: "text-teal-700",
    hoverBorder: "hover:border-teal-400",
  },
  peach: {
    text: "text-amber-700",
    bg: "bg-amber-500",
    border: "border-amber-200",
    ring: "ring-amber-200",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    hoverBorder: "hover:border-amber-400",
  },
  sunshine: {
    text: "text-yellow-700",
    bg: "bg-yellow-500",
    border: "border-yellow-200",
    ring: "ring-yellow-200",
    chipBg: "bg-yellow-50",
    chipText: "text-yellow-700",
    hoverBorder: "hover:border-yellow-400",
  },
  rose: {
    text: "text-pink-700",
    bg: "bg-pink-500",
    border: "border-pink-200",
    ring: "ring-pink-200",
    chipBg: "bg-pink-50",
    chipText: "text-pink-700",
    hoverBorder: "hover:border-pink-400",
  },
  cyan: {
    text: "text-cyan-700",
    bg: "bg-cyan-500",
    border: "border-cyan-200",
    ring: "ring-cyan-200",
    chipBg: "bg-cyan-50",
    chipText: "text-cyan-700",
    hoverBorder: "hover:border-cyan-400",
  },
};

export const DOCS_COPY: Record<
  DocLocale,
  {
    title: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    popular: string;
    gettingStarted: string;
    videoTutorials: string;
    videoSoon: string;
    questions: string;
    contactSupport: string;
    categoryLabel: string;
    articlesLabel: string;
    readingTime: string;
    updated: string;
    plans: string;
    onThisPage: string;
    prev: string;
    next: string;
    wasHelpful: string;
    yes: string;
    no: string;
    thanks: string;
    editOnGithub: string;
    backToDocs: string;
    searchTitle: string;
    searchHint: string;
    searchResults: string;
    noResults: string;
    searchOpen: string;
    faq: string;
    guides: string;
    tutorials: string;
    recentlyUpdated: string;
  }
> = {
  en: {
    title: "Documentation",
    heroTitle: "Zyrix Documentation",
    heroSubtitle: "Everything you need to master Zyrix CRM.",
    searchPlaceholder: "Search documentation…",
    popular: "Popular articles",
    gettingStarted: "Getting started",
    videoTutorials: "Video tutorials",
    videoSoon: "Coming soon",
    questions: "Have questions?",
    contactSupport: "Contact support",
    categoryLabel: "Category",
    articlesLabel: "articles",
    readingTime: "min read",
    updated: "Updated",
    plans: "Plans",
    onThisPage: "On this page",
    prev: "Previous",
    next: "Next",
    wasHelpful: "Was this helpful?",
    yes: "Yes",
    no: "No",
    thanks: "Thanks for your feedback.",
    editOnGithub: "Edit on GitHub",
    backToDocs: "Back to Docs",
    searchTitle: "Search documentation",
    searchHint: "Type to search titles, headings and content.",
    searchResults: "Results",
    noResults: "No results found.",
    searchOpen: "Open search",
    faq: "FAQ",
    guides: "Guides",
    tutorials: "Tutorials",
    recentlyUpdated: "Recently updated",
  },
  ar: {
    title: "الوثائق",
    heroTitle: "وثائق Zyrix",
    heroSubtitle: "كل ما تحتاجه لإتقان Zyrix CRM.",
    searchPlaceholder: "ابحث في الوثائق…",
    popular: "المقالات الشائعة",
    gettingStarted: "البدء السريع",
    videoTutorials: "دروس الفيديو",
    videoSoon: "قريباً",
    questions: "لديك أسئلة؟",
    contactSupport: "تواصل مع الدعم",
    categoryLabel: "الفئة",
    articlesLabel: "مقالة",
    readingTime: "دقيقة قراءة",
    updated: "آخر تحديث",
    plans: "الخطط",
    onThisPage: "على هذه الصفحة",
    prev: "السابق",
    next: "التالي",
    wasHelpful: "هل كانت هذه المقالة مفيدة؟",
    yes: "نعم",
    no: "لا",
    thanks: "شكراً لملاحظاتك.",
    editOnGithub: "تعديل على GitHub",
    backToDocs: "العودة إلى الوثائق",
    searchTitle: "ابحث في الوثائق",
    searchHint: "اكتب للبحث في العناوين والمحتوى.",
    searchResults: "النتائج",
    noResults: "لا توجد نتائج.",
    searchOpen: "فتح البحث",
    faq: "الأسئلة الشائعة",
    guides: "الأدلة",
    tutorials: "الدروس",
    recentlyUpdated: "حُدّث مؤخراً",
  },
  tr: {
    title: "Dokümantasyon",
    heroTitle: "Zyrix Dokümantasyonu",
    heroSubtitle: "Zyrix CRM'de ustalaşmak için ihtiyacınız olan her şey.",
    searchPlaceholder: "Dokümantasyonda ara…",
    popular: "Popüler makaleler",
    gettingStarted: "Başlangıç",
    videoTutorials: "Video eğitimler",
    videoSoon: "Yakında",
    questions: "Soru mu var?",
    contactSupport: "Destek ile iletişime geç",
    categoryLabel: "Kategori",
    articlesLabel: "makale",
    readingTime: "dk okuma",
    updated: "Güncellendi",
    plans: "Planlar",
    onThisPage: "Bu sayfada",
    prev: "Önceki",
    next: "Sonraki",
    wasHelpful: "Bu makale yardımcı oldu mu?",
    yes: "Evet",
    no: "Hayır",
    thanks: "Geri bildiriminiz için teşekkürler.",
    editOnGithub: "GitHub'da düzenle",
    backToDocs: "Dokümana dön",
    searchTitle: "Dokümantasyonda ara",
    searchHint: "Başlık ve içeriklerde aramak için yazın.",
    searchResults: "Sonuçlar",
    noResults: "Sonuç bulunamadı.",
    searchOpen: "Aramayı aç",
    faq: "SSS",
    guides: "Rehberler",
    tutorials: "Eğitimler",
    recentlyUpdated: "Son güncellenenler",
  },
};

export function getCopy(locale: string) {
  return DOCS_COPY[(locale as DocLocale) in DOCS_COPY ? (locale as DocLocale) : "en"];
}

export function getCategoryLabel(id: CategoryId, locale: DocLocale) {
  if (id === "overview") {
    return locale === "ar" ? "نظرة عامة" : locale === "tr" ? "Genel Bakış" : "Overview";
  }
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label[locale] : id;
}
