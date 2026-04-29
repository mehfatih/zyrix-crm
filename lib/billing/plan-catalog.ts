// ────────────────────────────────────────────────────────────────────
// Sprint 14af — Plan catalog (single source of truth)
// Both /pricing (marketing) and /settings/billing (in-app) read from
// here. Prices live in lib/billing/currency.ts (PLAN_PRICES_USD); this
// file holds everything else: identity, quotas, highlights, CTA copy,
// trilingually. Comparison-table data (PLAN_FEATURES) is also defined
// here for Sprint 14ag's comparison table to consume.
// ────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";
import { Building2, Crown, Sparkles, Zap } from "lucide-react";
import type { PlanId } from "./currency";

type I18n = { en: string; ar: string; tr: string };

export type PlanAccentColor = "sky" | "cyan" | "violet" | "amber";

export interface PlanQuotas {
  users: I18n;
  contacts: I18n;
  storage: I18n;
  whatsapp: I18n;
}

export interface PlanCatalogEntry {
  id: PlanId;
  name: I18n;
  tagline: I18n;
  recommended: boolean;
  badge?: I18n;
  icon: LucideIcon;
  accentColor: PlanAccentColor;
  highlights: I18n[];
  quotas: PlanQuotas;
  cta: { label: I18n };
}

// ────────────────────────────────────────────────────────────────────
// PLAN_CATALOG — 4 plans × full trilingual metadata
// ────────────────────────────────────────────────────────────────────

export const PLAN_CATALOG: Record<PlanId, PlanCatalogEntry> = {
  free: {
    id: "free",
    name: { en: "Free", ar: "مجاني", tr: "Ücretsiz" },
    tagline: {
      en: "Solo founders just getting started",
      ar: "لرواد الأعمال الأفراد في بداية الطريق",
      tr: "Yeni başlayan bireysel girişimciler için",
    },
    recommended: false,
    icon: Sparkles,
    accentColor: "sky",
    highlights: [
      {
        en: "Visual sales pipeline with drag & drop",
        ar: "خط مبيعات بصري بالسحب والإفلات",
        tr: "Sürükle-bırak görsel satış pipeline'ı",
      },
      {
        en: "Customer database with custom fields",
        ar: "قاعدة بيانات عملاء مع حقول مخصصة",
        tr: "Özel alanlarla müşteri veritabanı",
      },
      {
        en: "Task & deal tracking",
        ar: "تتبع المهام والصفقات",
        tr: "Görev ve fırsat takibi",
      },
      {
        en: "WhatsApp Business inbox (100 msgs/month)",
        ar: "صندوق WhatsApp Business (100 رسالة/شهر)",
        tr: "WhatsApp Business gelen kutusu (aylık 100 mesaj)",
      },
      {
        en: "Mobile app for iOS and Android",
        ar: "تطبيق جوال iOS و Android",
        tr: "iOS ve Android için mobil uygulama",
      },
      {
        en: "Email support",
        ar: "دعم بالبريد الإلكتروني",
        tr: "E-posta desteği",
      },
    ],
    quotas: {
      users: { en: "3 users", ar: "3 مستخدمين", tr: "3 kullanıcı" },
      contacts: {
        en: "100 contacts",
        ar: "100 جهة اتصال",
        tr: "100 kişi",
      },
      storage: {
        en: "1 GB storage",
        ar: "1 جيجابايت تخزين",
        tr: "1 GB depolama",
      },
      whatsapp: {
        en: "100 WhatsApp msgs/mo",
        ar: "100 رسالة واتساب/شهر",
        tr: "Aylık 100 WhatsApp mesajı",
      },
    },
    cta: {
      label: {
        en: "Get started free",
        ar: "ابدأ مجاناً",
        tr: "Ücretsiz başla",
      },
    },
  },

  starter: {
    id: "starter",
    name: { en: "Starter", ar: "المبتدئ", tr: "Başlangıç" },
    tagline: {
      en: "Small teams ready to grow",
      ar: "فرق صغيرة جاهزة للنمو",
      tr: "Büyümeye hazır küçük ekipler",
    },
    recommended: false,
    icon: Zap,
    accentColor: "cyan",
    highlights: [
      {
        en: "Everything in Free, plus:",
        ar: "كل ما في المجاني، بالإضافة إلى:",
        tr: "Ücretsiz'deki her şey, artı:",
      },
      {
        en: "WhatsApp Business API (2,000 msgs/month)",
        ar: "WhatsApp Business API (2,000 رسالة/شهر)",
        tr: "WhatsApp Business API (aylık 2,000 mesaj)",
      },
      {
        en: "Email integration & templates",
        ar: "تكامل البريد الإلكتروني والقوالب",
        tr: "E-posta entegrasyonu ve şablonları",
      },
      {
        en: "Custom dashboards & reports",
        ar: "لوحات تحكم وتقارير مخصصة",
        tr: "Özel kontrol panelleri ve raporlar",
      },
      {
        en: "Quotes, invoices & contracts",
        ar: "عروض الأسعار والفواتير والعقود",
        tr: "Teklifler, faturalar ve sözleşmeler",
      },
      {
        en: "Basic automations (5 active)",
        ar: "أتمتة أساسية (5 نشطة)",
        tr: "Temel otomasyonlar (5 aktif)",
      },
      {
        en: "Priority email support",
        ar: "دعم بريد إلكتروني ذو أولوية",
        tr: "Öncelikli e-posta desteği",
      },
    ],
    quotas: {
      users: { en: "10 users", ar: "10 مستخدمين", tr: "10 kullanıcı" },
      contacts: {
        en: "1,000 contacts",
        ar: "1,000 جهة اتصال",
        tr: "1,000 kişi",
      },
      storage: {
        en: "10 GB storage",
        ar: "10 جيجابايت تخزين",
        tr: "10 GB depolama",
      },
      whatsapp: {
        en: "2,000 WhatsApp msgs/mo",
        ar: "2,000 رسالة واتساب/شهر",
        tr: "Aylık 2,000 WhatsApp mesajı",
      },
    },
    cta: {
      label: {
        en: "Choose Starter",
        ar: "اختر المبتدئ",
        tr: "Başlangıç'ı seç",
      },
    },
  },

  business: {
    id: "business",
    name: { en: "Business", ar: "الأعمال", tr: "İşletme" },
    tagline: {
      en: "Everything teams need to scale",
      ar: "كل ما تحتاجه الفرق للنمو والتوسع",
      tr: "Ekiplerin ölçeklenmek için ihtiyaç duyduğu her şey",
    },
    recommended: true,
    badge: {
      en: "Most popular",
      ar: "الأكثر شعبية",
      tr: "En popüler",
    },
    icon: Building2,
    accentColor: "violet",
    highlights: [
      {
        en: "Everything in Starter, plus:",
        ar: "كل ما في المبتدئ، بالإضافة إلى:",
        tr: "Başlangıç'taki her şey, artı:",
      },
      {
        en: "WhatsApp Business API (20,000 msgs/month)",
        ar: "WhatsApp Business API (20,000 رسالة/شهر)",
        tr: "WhatsApp Business API (aylık 20,000 mesaj)",
      },
      {
        en: "AI CFO — financial insights & forecasting",
        ar: "AI CFO — رؤى وتوقعات مالية",
        tr: "AI CFO — finansal içgörü ve tahminleme",
      },
      {
        en: "AI Agents — auto-qualify leads 24/7",
        ar: "AI Agents — تأهيل تلقائي للعملاء على مدار الساعة",
        tr: "AI Agents — 7/24 otomatik müşteri kalifikasyonu",
      },
      {
        en: "Advanced automations & workflows",
        ar: "أتمتة وسير عمل متقدم",
        tr: "Gelişmiş otomasyonlar ve iş akışları",
      },
      {
        en: "Roles, permissions & audit log",
        ar: "الأدوار والصلاحيات وسجل المراجعة",
        tr: "Roller, izinler ve denetim günlüğü",
      },
      {
        en: "Custom branding (logo, colors)",
        ar: "هوية مخصصة (شعار، ألوان)",
        tr: "Özel marka (logo, renkler)",
      },
      {
        en: "Dedicated account manager",
        ar: "مدير حساب مخصص",
        tr: "Özel hesap yöneticisi",
      },
    ],
    quotas: {
      users: { en: "50 users", ar: "50 مستخدماً", tr: "50 kullanıcı" },
      contacts: {
        en: "10,000 contacts",
        ar: "10,000 جهة اتصال",
        tr: "10,000 kişi",
      },
      storage: {
        en: "100 GB storage",
        ar: "100 جيجابايت تخزين",
        tr: "100 GB depolama",
      },
      whatsapp: {
        en: "20,000 WhatsApp msgs/mo",
        ar: "20,000 رسالة واتساب/شهر",
        tr: "Aylık 20,000 WhatsApp mesajı",
      },
    },
    cta: {
      label: {
        en: "Choose Business",
        ar: "اختر الأعمال",
        tr: "İşletme'yi seç",
      },
    },
  },

  enterprise: {
    id: "enterprise",
    name: {
      en: "Enterprise",
      ar: "المؤسسات",
      tr: "Kurumsal",
    },
    tagline: {
      en: "Custom solutions for large organizations",
      ar: "حلول مخصصة للمؤسسات الكبيرة",
      tr: "Büyük kuruluşlar için özel çözümler",
    },
    recommended: false,
    icon: Crown,
    accentColor: "amber",
    highlights: [
      {
        en: "Everything in Business, plus:",
        ar: "كل ما في الأعمال، بالإضافة إلى:",
        tr: "İşletme'deki her şey, artı:",
      },
      {
        en: "Unlimited users, contacts & storage",
        ar: "مستخدمون وعملاء وتخزين بلا حدود",
        tr: "Sınırsız kullanıcı, kişi ve depolama",
      },
      {
        en: "Custom domain (yourcrm.com)",
        ar: "نطاق مخصص (yourcrm.com)",
        tr: "Özel alan adı (yourcrm.com)",
      },
      {
        en: "SSO (SAML, Okta, Azure AD)",
        ar: "دخول موحد (SAML, Okta, Azure AD)",
        tr: "SSO (SAML, Okta, Azure AD)",
      },
      {
        en: "99.9% uptime SLA guarantee",
        ar: "ضمان SLA بنسبة 99.9% للجاهزية",
        tr: "%99.9 çalışma süresi SLA garantisi",
      },
      {
        en: "Custom data residency (KSA, UAE, EU)",
        ar: "موقع بيانات مخصص (السعودية، الإمارات، الاتحاد الأوروبي)",
        tr: "Özel veri lokasyonu (S.Arabistan, BAE, AB)",
      },
      {
        en: "White-label for resellers",
        ar: "علامة بيضاء للموزعين",
        tr: "Bayi için beyaz etiket",
      },
      {
        en: "24/7 phone & dedicated Slack support",
        ar: "دعم هاتفي وSlack مخصص على مدار الساعة",
        tr: "7/24 telefon ve özel Slack desteği",
      },
    ],
    quotas: {
      users: {
        en: "Unlimited users",
        ar: "مستخدمون بلا حدود",
        tr: "Sınırsız kullanıcı",
      },
      contacts: {
        en: "Unlimited contacts",
        ar: "عملاء بلا حدود",
        tr: "Sınırsız kişi",
      },
      storage: {
        en: "Unlimited storage",
        ar: "تخزين بلا حدود",
        tr: "Sınırsız depolama",
      },
      whatsapp: {
        en: "Unlimited WhatsApp",
        ar: "واتساب بلا حدود",
        tr: "Sınırsız WhatsApp",
      },
    },
    cta: {
      label: {
        en: "Contact sales",
        ar: "تواصل مع المبيعات",
        tr: "Satışla iletişime geç",
      },
    },
  },
};

export const PLAN_CATALOG_LIST: PlanCatalogEntry[] =
  Object.values(PLAN_CATALOG);

// ────────────────────────────────────────────────────────────────────
// PLAN_FEATURES — comparison table data (Sprint 14ag will render this)
// ────────────────────────────────────────────────────────────────────

export type PlanFeatureCategory =
  | "core"
  | "sales"
  | "comms"
  | "ai"
  | "admin"
  | "enterprise";

export interface PlanFeature {
  id: string;
  label: I18n;
  category: PlanFeatureCategory;
  // boolean = included (true) / not in this plan (false)
  // I18n = included with a note (e.g. limit string)
  // null = not applicable for this plan
  availability: Record<PlanId, boolean | I18n | null>;
}

export const PLAN_FEATURES: PlanFeature[] = [
  // ─── CORE ───────────────────────────────────────────────────────
  {
    id: "users",
    label: {
      en: "Team members",
      ar: "أعضاء الفريق",
      tr: "Ekip üyeleri",
    },
    category: "core",
    availability: {
      free: { en: "3", ar: "3", tr: "3" },
      starter: { en: "10", ar: "10", tr: "10" },
      business: { en: "50", ar: "50", tr: "50" },
      enterprise: {
        en: "Unlimited",
        ar: "بلا حدود",
        tr: "Sınırsız",
      },
    },
  },
  {
    id: "contacts",
    label: {
      en: "Contacts",
      ar: "جهات الاتصال",
      tr: "Kişiler",
    },
    category: "core",
    availability: {
      free: { en: "100", ar: "100", tr: "100" },
      starter: { en: "1,000", ar: "1,000", tr: "1,000" },
      business: { en: "10,000", ar: "10,000", tr: "10,000" },
      enterprise: {
        en: "Unlimited",
        ar: "بلا حدود",
        tr: "Sınırsız",
      },
    },
  },
  {
    id: "storage",
    label: {
      en: "File storage",
      ar: "تخزين الملفات",
      tr: "Dosya depolama",
    },
    category: "core",
    availability: {
      free: { en: "1 GB", ar: "1 جيجابايت", tr: "1 GB" },
      starter: { en: "10 GB", ar: "10 جيجابايت", tr: "10 GB" },
      business: { en: "100 GB", ar: "100 جيجابايت", tr: "100 GB" },
      enterprise: {
        en: "Unlimited",
        ar: "بلا حدود",
        tr: "Sınırsız",
      },
    },
  },
  {
    id: "sales_pipeline",
    label: {
      en: "Visual sales pipeline",
      ar: "خط مبيعات بصري",
      tr: "Görsel satış pipeline'ı",
    },
    category: "sales",
    availability: { free: true, starter: true, business: true, enterprise: true },
  },
  {
    id: "custom_fields",
    label: {
      en: "Custom fields",
      ar: "حقول مخصصة",
      tr: "Özel alanlar",
    },
    category: "sales",
    availability: { free: true, starter: true, business: true, enterprise: true },
  },
  {
    id: "tasks_deals",
    label: {
      en: "Tasks & deal tracking",
      ar: "تتبع المهام والصفقات",
      tr: "Görev ve fırsat takibi",
    },
    category: "sales",
    availability: { free: true, starter: true, business: true, enterprise: true },
  },
  {
    id: "quotes_invoices",
    label: {
      en: "Quotes & invoices",
      ar: "عروض الأسعار والفواتير",
      tr: "Teklifler ve faturalar",
    },
    category: "sales",
    availability: { free: false, starter: true, business: true, enterprise: true },
  },
  {
    id: "contracts",
    label: {
      en: "Contracts management",
      ar: "إدارة العقود",
      tr: "Sözleşme yönetimi",
    },
    category: "sales",
    availability: { free: false, starter: true, business: true, enterprise: true },
  },

  // ─── COMMS ──────────────────────────────────────────────────────
  {
    id: "whatsapp_inbox",
    label: {
      en: "WhatsApp inbox",
      ar: "صندوق واتساب",
      tr: "WhatsApp gelen kutusu",
    },
    category: "comms",
    availability: {
      free: { en: "100/mo", ar: "100/شهر", tr: "aylık 100" },
      starter: { en: "2,000/mo", ar: "2,000/شهر", tr: "aylık 2,000" },
      business: {
        en: "20,000/mo",
        ar: "20,000/شهر",
        tr: "aylık 20,000",
      },
      enterprise: {
        en: "Unlimited",
        ar: "بلا حدود",
        tr: "Sınırsız",
      },
    },
  },
  {
    id: "whatsapp_api",
    label: {
      en: "WhatsApp Business API",
      ar: "WhatsApp Business API",
      tr: "WhatsApp Business API",
    },
    category: "comms",
    availability: { free: false, starter: true, business: true, enterprise: true },
  },
  {
    id: "email_integration",
    label: {
      en: "Email integration & templates",
      ar: "تكامل البريد والقوالب",
      tr: "E-posta entegrasyonu ve şablonları",
    },
    category: "comms",
    availability: { free: false, starter: true, business: true, enterprise: true },
  },
  {
    id: "team_chat",
    label: {
      en: "Team chat (internal)",
      ar: "دردشة الفريق الداخلية",
      tr: "Ekip içi sohbet",
    },
    category: "comms",
    availability: { free: false, starter: true, business: true, enterprise: true },
  },

  // ─── AI ─────────────────────────────────────────────────────────
  {
    id: "ai_cfo",
    label: {
      en: "AI CFO — financial insights",
      ar: "AI CFO — رؤى مالية",
      tr: "AI CFO — finansal içgörü",
    },
    category: "ai",
    availability: { free: false, starter: false, business: true, enterprise: true },
  },
  {
    id: "ai_agents",
    label: {
      en: "AI Agents — auto-qualify leads",
      ar: "AI Agents — تأهيل تلقائي",
      tr: "AI Agents — otomatik kalifikasyon",
    },
    category: "ai",
    availability: { free: false, starter: false, business: true, enterprise: true },
  },
  {
    id: "automations",
    label: {
      en: "Automations & workflows",
      ar: "الأتمتة وسير العمل",
      tr: "Otomasyonlar ve iş akışları",
    },
    category: "ai",
    availability: {
      free: false,
      starter: { en: "5 active", ar: "5 نشطة", tr: "5 aktif" },
      business: { en: "Unlimited", ar: "بلا حدود", tr: "Sınırsız" },
      enterprise: {
        en: "Unlimited",
        ar: "بلا حدود",
        tr: "Sınırsız",
      },
    },
  },

  // ─── ADMIN ──────────────────────────────────────────────────────
  {
    id: "roles_permissions",
    label: {
      en: "Roles & permissions",
      ar: "الأدوار والصلاحيات",
      tr: "Roller ve izinler",
    },
    category: "admin",
    availability: { free: false, starter: false, business: true, enterprise: true },
  },
  {
    id: "audit_log",
    label: {
      en: "Audit log",
      ar: "سجل المراجعة",
      tr: "Denetim günlüğü",
    },
    category: "admin",
    availability: { free: false, starter: false, business: true, enterprise: true },
  },
  {
    id: "custom_branding",
    label: {
      en: "Custom branding",
      ar: "هوية مخصصة",
      tr: "Özel marka",
    },
    category: "admin",
    availability: { free: false, starter: false, business: true, enterprise: true },
  },
  {
    id: "priority_support",
    label: {
      en: "Priority support",
      ar: "دعم ذو أولوية",
      tr: "Öncelikli destek",
    },
    category: "admin",
    availability: {
      free: { en: "Email only", ar: "بريد فقط", tr: "Yalnızca e-posta" },
      starter: {
        en: "Email priority",
        ar: "بريد ذو أولوية",
        tr: "Öncelikli e-posta",
      },
      business: {
        en: "Dedicated manager",
        ar: "مدير مخصص",
        tr: "Özel yönetici",
      },
      enterprise: {
        en: "24/7 phone + Slack",
        ar: "هاتف وSlack 24/7",
        tr: "7/24 telefon + Slack",
      },
    },
  },

  // ─── ENTERPRISE ─────────────────────────────────────────────────
  {
    id: "custom_domain",
    label: {
      en: "Custom domain",
      ar: "نطاق مخصص",
      tr: "Özel alan adı",
    },
    category: "enterprise",
    availability: { free: false, starter: false, business: false, enterprise: true },
  },
  {
    id: "sso",
    label: {
      en: "SSO (SAML, Okta, Azure AD)",
      ar: "دخول موحد",
      tr: "SSO",
    },
    category: "enterprise",
    availability: { free: false, starter: false, business: false, enterprise: true },
  },
  {
    id: "sla",
    label: {
      en: "99.9% uptime SLA",
      ar: "ضمان جاهزية 99.9%",
      tr: "%99.9 SLA",
    },
    category: "enterprise",
    availability: { free: false, starter: false, business: false, enterprise: true },
  },
  {
    id: "data_residency",
    label: {
      en: "Custom data residency",
      ar: "موقع بيانات مخصص",
      tr: "Özel veri lokasyonu",
    },
    category: "enterprise",
    availability: { free: false, starter: false, business: false, enterprise: true },
  },
  {
    id: "white_label",
    label: {
      en: "White-label for resellers",
      ar: "علامة بيضاء للموزعين",
      tr: "Bayi için beyaz etiket",
    },
    category: "enterprise",
    availability: { free: false, starter: false, business: false, enterprise: true },
  },
];

export function getPlanCatalog(plan: PlanId): PlanCatalogEntry {
  return PLAN_CATALOG[plan];
}

export function getFeaturesByCategory(
  category: PlanFeatureCategory,
): PlanFeature[] {
  return PLAN_FEATURES.filter((f) => f.category === category);
}
