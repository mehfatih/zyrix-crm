// ────────────────────────────────────────────────────────────────────
// Sprint 14y — Feature catalog
// Per-feature copy lives here as trilingual TypeScript literals so the
// catalog stays portable. Only static UI chrome ("Upgrade to unlock",
// "Back to dashboard", etc.) lives in messages/{locale}.json under the
// upgrade.* namespace.
// ────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ClipboardList,
  FileText,
  Globe,
  Headphones,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Palette,
  Receipt,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export type AccentColor =
  | "cyan"
  | "violet"
  | "fuchsia"
  | "sky"
  | "rose"
  | "emerald"
  | "indigo"
  | "amber";

export type UpgradeTier = "pro" | "business" | "enterprise";

// Sprint 14z — planId the upgrade flow lands on for this feature.
// Mirrors the canonical PlanId type but kept as a string here to avoid
// a runtime cycle between the feature catalog and the billing module.
export type FeatureTargetPlan = "starter" | "business" | "enterprise";

export interface FeatureDef {
  id: string;
  name: { en: string; ar: string; tr: string };
  shortPitch: { en: string; ar: string; tr: string };
  bullets: { en: string; ar: string; tr: string }[];
  icon: LucideIcon;
  accentColor: AccentColor;
  upgradeTier: UpgradeTier;
  targetPlan: FeatureTargetPlan;
}

export const FEATURE_CATALOG: Record<string, FeatureDef> = {
  ai_workflows: {
    id: "ai_workflows",
    name: { en: "Automations", ar: "الأتمتة", tr: "Otomasyonlar" },
    shortPitch: {
      en: "Build workflows that react to CRM events and run actions automatically. Save hours every week on repetitive tasks.",
      ar: "ابنِ workflows تتفاعل مع أحداث CRM وتنفذ الإجراءات تلقائيًا. وفّر ساعات أسبوعيًا على المهام المتكررة.",
      tr: "CRM olaylarına tepki veren ve otomatik eylem yapan iş akışları oluşturun. Tekrarlayan görevlerde haftada saatler kazanın.",
    },
    bullets: [
      {
        en: "Auto-assign new deals to the right rep",
        ar: "إسناد الصفقات الجديدة تلقائيًا للمندوب الصحيح",
        tr: "Yeni anlaşmaları doğru temsilciye otomatik ata",
      },
      {
        en: "Trigger email sequences on customer events",
        ar: "تشغيل تسلسلات بريد إلكتروني عند أحداث العميل",
        tr: "Müşteri olaylarında e-posta dizilerini tetikle",
      },
      {
        en: "Send Slack alerts when deals reach milestones",
        ar: "إرسال تنبيهات Slack عند بلوغ الصفقات معالم",
        tr: "Anlaşmalar dönüm noktasına ulaştığında Slack uyarısı gönder",
      },
      {
        en: "Schedule follow-up tasks automatically",
        ar: "جدولة مهام المتابعة تلقائيًا",
        tr: "Takip görevlerini otomatik planla",
      },
      {
        en: "Run on-call playbooks 24/7",
        ar: "تشغيل دلائل الإجراءات على مدار الساعة",
        tr: "Otomatik prosedürleri 7/24 çalıştır",
      },
    ],
    icon: Zap,
    accentColor: "cyan",
    upgradeTier: "pro",
    targetPlan: "business",
  },

  ai_agents: {
    id: "ai_agents",
    name: { en: "AI Agents", ar: "وكلاء الذكاء الاصطناعي", tr: "AI Ajanları" },
    shortPitch: {
      en: "Autonomous AI agents that work your pipeline 24/7 — qualifying leads, prepping for meetings, and keeping data clean.",
      ar: "وكلاء ذكاء اصطناعي مستقلون يعملون على مسار مبيعاتك 24/7 — يؤهلون العملاء المحتملين ويحضرون للاجتماعات.",
      tr: "Pipeline'ınızı 7/24 işleyen bağımsız AI ajanları — lead'leri niteler, toplantıları hazırlar, veriyi temiz tutar.",
    },
    bullets: [
      {
        en: "Autonomous outreach to cold and warm leads",
        ar: "تواصل مستقل مع العملاء المحتملين",
        tr: "Soğuk ve sıcak lead'lere otonom erişim",
      },
      {
        en: "Lead qualification with structured scoring",
        ar: "تأهيل العملاء المحتملين بتقييم منظم",
        tr: "Yapılandırılmış puanlama ile lead niteliği",
      },
      {
        en: "Pre-meeting research and briefing notes",
        ar: "بحث ما قبل الاجتماع وملاحظات الإيجاز",
        tr: "Toplantı öncesi araştırma ve brifing notları",
      },
      {
        en: "Pipeline hygiene: stale deals, missing fields",
        ar: "نظافة المسار: صفقات راكدة وحقول ناقصة",
        tr: "Pipeline hijyeni: eski anlaşmalar, eksik alanlar",
      },
      {
        en: "Multi-channel touch — email, WhatsApp, SMS",
        ar: "تواصل متعدد القنوات — بريد، واتساب، SMS",
        tr: "Çok kanallı iletişim — e-posta, WhatsApp, SMS",
      },
    ],
    icon: Bot,
    accentColor: "violet",
    upgradeTier: "business",
    targetPlan: "business",
  },

  ai_cfo: {
    id: "ai_cfo",
    name: { en: "AI CFO", ar: "المدير المالي الذكي", tr: "AI CFO" },
    shortPitch: {
      en: "Your AI-powered fractional CFO. Forecasts cash flow, surfaces risks, and explains your numbers in plain language.",
      ar: "مديرك المالي المعتمد على الذكاء الاصطناعي. يتنبأ بالتدفق النقدي ويكشف المخاطر ويشرح أرقامك ببساطة.",
      tr: "AI destekli kısmi CFO'nuz. Nakit akışını öngörür, riskleri ortaya çıkarır ve sayılarınızı sade dille açıklar.",
    },
    bullets: [
      {
        en: "Cash flow forecasting up to 90 days out",
        ar: "توقع التدفق النقدي حتى 90 يومًا",
        tr: "90 güne kadar nakit akışı tahmini",
      },
      {
        en: "Risk detection across deals, churn, and payments",
        ar: "كشف المخاطر في الصفقات والانسحاب والمدفوعات",
        tr: "Anlaşma, kayıp ve ödemelerde risk tespiti",
      },
      {
        en: "Revenue insights with drill-down to source",
        ar: "رؤى الإيرادات مع التعمق إلى المصدر",
        tr: "Kaynağa kadar inebilen gelir içgörüleri",
      },
      {
        en: "Runway analysis with what-if scenarios",
        ar: "تحليل المدى مع سيناريوهات افتراضية",
        tr: "Senaryo analiziyle dayanıklılık hesabı",
      },
      {
        en: "Weekly digest delivered to your inbox",
        ar: "ملخص أسبوعي يصل إلى بريدك",
        tr: "Gelen kutunuza haftalık özet",
      },
    ],
    icon: Sparkles,
    accentColor: "fuchsia",
    upgradeTier: "business",
    targetPlan: "business",
  },

  team_chat: {
    id: "team_chat",
    name: { en: "Team Chat", ar: "دردشة الفريق", tr: "Ekip Sohbeti" },
    shortPitch: {
      en: "Real-time internal chat with deal-room threads, file sharing, and mobile sync — keep the team aligned without leaving the CRM.",
      ar: "دردشة داخلية فورية مع مواضيع غرف الصفقات ومشاركة الملفات — حافظ على توافق الفريق دون مغادرة CRM.",
      tr: "Anlaşma odası iş parçacıkları, dosya paylaşımı ve mobil senkronizasyon ile gerçek zamanlı dahili sohbet.",
    },
    bullets: [
      {
        en: "Internal channels by department or topic",
        ar: "قنوات داخلية حسب القسم أو الموضوع",
        tr: "Bölüm veya konuya göre dahili kanallar",
      },
      {
        en: "@mentions and threaded replies",
        ar: "إشارات @ وردود متفرعة",
        tr: "@bahsetme ve iş parçacıklı yanıtlar",
      },
      {
        en: "File sharing with full-text search",
        ar: "مشاركة الملفات مع بحث نصي كامل",
        tr: "Tam metin aramayla dosya paylaşımı",
      },
      {
        en: "Deal-room threads attached to records",
        ar: "مواضيع غرف الصفقات مرتبطة بالسجلات",
        tr: "Kayıtlara bağlı anlaşma odası iş parçacıkları",
      },
      {
        en: "Mobile sync with push notifications",
        ar: "مزامنة الجوال مع إشعارات فورية",
        tr: "Anlık bildirimlerle mobil senkronizasyon",
      },
    ],
    icon: MessageCircle,
    accentColor: "sky",
    upgradeTier: "pro",
    targetPlan: "starter",
  },

  email_marketing: {
    id: "email_marketing",
    name: { en: "Email Marketing", ar: "التسويق بالبريد", tr: "E-posta Pazarlaması" },
    shortPitch: {
      en: "Send campaigns, run drips, and A/B test subject lines — all using your CRM segments. Open and click tracking built in.",
      ar: "أرسل الحملات وتسلسلات التنقيط واختبر عناوين البريد بـ A/B — كل ذلك باستخدام شرائح CRM.",
      tr: "Kampanyalar gönderin, damla diziler çalıştırın, konu satırlarını A/B test edin — hepsi CRM segmentleriyle.",
    },
    bullets: [
      {
        en: "Campaigns with rich-text templates",
        ar: "حملات بقوالب نصوص منسقة",
        tr: "Zengin metin şablonlarıyla kampanyalar",
      },
      {
        en: "Segmentation by tags, deals, activity",
        ar: "تقسيم حسب العلامات والصفقات والنشاط",
        tr: "Etiket, anlaşma, etkinliğe göre segmentasyon",
      },
      {
        en: "A/B testing with auto-winner selection",
        ar: "اختبار A/B مع اختيار الفائز تلقائيًا",
        tr: "Otomatik kazanan seçimiyle A/B testi",
      },
      {
        en: "Open and click tracking",
        ar: "تتبع الفتح والنقر",
        tr: "Açma ve tıklama takibi",
      },
      {
        en: "Drip sequences triggered by CRM events",
        ar: "تسلسلات تنقيط محفزة بأحداث CRM",
        tr: "CRM olaylarıyla tetiklenen damla dizileri",
      },
    ],
    icon: Send,
    accentColor: "rose",
    upgradeTier: "pro",
    targetPlan: "starter",
  },

  whatsapp_crm: {
    id: "whatsapp_crm",
    name: { en: "WhatsApp CRM", ar: "واتساب CRM", tr: "WhatsApp CRM" },
    shortPitch: {
      en: "Inbound and outbound WhatsApp inside your CRM. Templates, broadcasts, read receipts — and chats convert to deals in one click.",
      ar: "واتساب وارد وصادر داخل CRM. قوالب وبث وإيصالات قراءة — والمحادثات تتحول إلى صفقات بنقرة واحدة.",
      tr: "CRM içinden gelen-giden WhatsApp. Şablonlar, yayınlar, okundu bilgisi — sohbetler tek tıkla anlaşmaya dönüşür.",
    },
    bullets: [
      {
        en: "Inbound routing to the right team",
        ar: "توجيه الوارد للفريق الصحيح",
        tr: "Gelen mesajları doğru ekibe yönlendir",
      },
      {
        en: "Template management with multi-language",
        ar: "إدارة القوالب بلغات متعددة",
        tr: "Çok dilli şablon yönetimi",
      },
      {
        en: "Chat-to-deal conversion in one click",
        ar: "تحويل المحادثة إلى صفقة بنقرة واحدة",
        tr: "Tek tıkla sohbetten anlaşmaya dönüşüm",
      },
      {
        en: "Broadcast lists with opt-out tracking",
        ar: "قوائم بث مع تتبع إلغاء الاشتراك",
        tr: "Çıkış takipli yayın listeleri",
      },
      {
        en: "Read receipts and delivery analytics",
        ar: "إيصالات القراءة وتحليلات التسليم",
        tr: "Okundu bilgisi ve teslim analizi",
      },
    ],
    icon: MessageCircle,
    accentColor: "emerald",
    upgradeTier: "pro",
    targetPlan: "business",
  },

  customer_portal: {
    id: "customer_portal",
    name: { en: "Customer Portal", ar: "بوابة العملاء", tr: "Müşteri Portalı" },
    shortPitch: {
      en: "Give customers a self-service portal to view invoices, accept quotes, and submit tickets — under your branded subdomain.",
      ar: "امنح العملاء بوابة خدمة ذاتية لعرض الفواتير وقبول العروض وتقديم التذاكر — تحت نطاق فرعي بعلامتك.",
      tr: "Müşterilere fatura görüntüleme, teklif kabul, talep gönderme için self-servis portal — markalı alt alanda.",
    },
    bullets: [
      {
        en: "Self-service login with magic links",
        ar: "تسجيل دخول ذاتي بروابط سحرية",
        tr: "Sihirli linklerle self-servis giriş",
      },
      {
        en: "Invoice download and payment history",
        ar: "تحميل الفواتير وسجل المدفوعات",
        tr: "Fatura indirme ve ödeme geçmişi",
      },
      {
        en: "Quote acceptance with e-signature",
        ar: "قبول العروض بتوقيع إلكتروني",
        tr: "E-imzayla teklif kabulü",
      },
      {
        en: "Ticket submission with status tracking",
        ar: "تقديم التذاكر مع تتبع الحالة",
        tr: "Durum takipli talep gönderimi",
      },
      {
        en: "Branded subdomain with your logo and colors",
        ar: "نطاق فرعي بشعارك وألوانك",
        tr: "Logonuz ve renklerinizle markalı alt alan",
      },
    ],
    icon: Headphones,
    accentColor: "indigo",
    upgradeTier: "business",
    targetPlan: "business",
  },

  tax_engine: {
    id: "tax_engine",
    name: { en: "Tax Engine", ar: "محرك الضرائب", tr: "Vergi Motoru" },
    shortPitch: {
      en: "Automatic jurisdiction detection and multi-rate calculation for VAT/KDV/ZATCA. Audit-trail ready and e-invoicing native.",
      ar: "كشف تلقائي للاختصاص وحساب متعدد المعدلات لـ VAT/KDV/زاتكا. جاهز لمسار التدقيق ومتكامل مع الفوترة الإلكترونية.",
      tr: "VAT/KDV/ZATCA için otomatik yargı yetkisi tespiti ve çok oranlı hesaplama. Denetim izine hazır, e-fatura yerel.",
    },
    bullets: [
      {
        en: "Automatic jurisdiction detection from address",
        ar: "كشف الاختصاص تلقائيًا من العنوان",
        tr: "Adresten otomatik yargı yetkisi tespiti",
      },
      {
        en: "VAT, KDV, ZATCA, FTA, ETA out of the box",
        ar: "VAT و KDV وزاتكا و FTA و ETA جاهزة",
        tr: "VAT, KDV, ZATCA, FTA, ETA hazır",
      },
      {
        en: "Multi-rate calculation per line item",
        ar: "حساب متعدد المعدلات لكل بند",
        tr: "Satır başına çok oranlı hesap",
      },
      {
        en: "Audit trail for every rate change",
        ar: "مسار تدقيق لكل تغيير معدل",
        tr: "Her oran değişikliği için denetim izi",
      },
      {
        en: "E-invoicing with regulator-ready XML",
        ar: "فوترة إلكترونية بـ XML جاهزة للمنظمين",
        tr: "Düzenleyiciye hazır XML ile e-fatura",
      },
    ],
    icon: Receipt,
    accentColor: "amber",
    upgradeTier: "business",
    targetPlan: "business",
  },

  rbac: {
    id: "rbac",
    name: {
      en: "Roles & Permissions",
      ar: "الأدوار والصلاحيات",
      tr: "Roller ve İzinler",
    },
    shortPitch: {
      en: "Define exactly who on your team can see and do what across your Zyrix workspace.",
      ar: "حدد بدقة من في فريقك يمكنه رؤية وفعل ماذا عبر مساحة عمل Zyrix.",
      tr: "Ekibinizdeki kimin Zyrix çalışma alanınızda neyi görebileceğini ve yapabileceğini tam olarak tanımlayın.",
    },
    bullets: [
      {
        en: "Built-in roles: Owner, Admin, Manager, Sales, Read-only",
        ar: "أدوار مدمجة: مالك، مشرف، مدير، مبيعات، قراءة فقط",
        tr: "Hazır roller: Sahip, Yönetici, Müdür, Satış, Salt okunur",
      },
      {
        en: "Custom roles with granular permissions per resource",
        ar: "أدوار مخصصة بصلاحيات دقيقة لكل مورد",
        tr: "Kaynak başına ayrıntılı izinlerle özel roller",
      },
      {
        en: "Per-customer and per-deal access scoping",
        ar: "تحديد نطاق الوصول لكل عميل وكل صفقة",
        tr: "Müşteri ve anlaşma bazında erişim kapsamı",
      },
      {
        en: "Role-based dashboard and report access",
        ar: "وصول للوحات والتقارير حسب الدور",
        tr: "Role dayalı panel ve rapor erişimi",
      },
      {
        en: "Audit trail of permission changes",
        ar: "سجل تتبع لتغييرات الصلاحيات",
        tr: "İzin değişiklikleri için denetim izi",
      },
    ],
    icon: ShieldCheck,
    accentColor: "indigo",
    upgradeTier: "business",
    targetPlan: "business",
  },

  audit_advanced: {
    id: "audit_advanced",
    name: {
      en: "Audit Log",
      ar: "سجل المراجعة",
      tr: "Denetim Günlüğü",
    },
    shortPitch: {
      en: "Full timeline of every security event and change in your account — who did what, when, and from where.",
      ar: "جدول زمني كامل لكل حدث أمني وتغيير في حسابك — من فعل ماذا، ومتى، ومن أين.",
      tr: "Hesabınızdaki her güvenlik olayının ve değişikliğin tam zaman çizelgesi — kim ne yaptı, ne zaman ve nereden.",
    },
    bullets: [
      {
        en: "Login attempts (success, failure, IP, location)",
        ar: "محاولات تسجيل الدخول (نجاح، فشل، IP، الموقع)",
        tr: "Giriş denemeleri (başarı, başarısızlık, IP, konum)",
      },
      {
        en: "Permission and role changes",
        ar: "تغييرات الصلاحيات والأدوار",
        tr: "İzin ve rol değişiklikleri",
      },
      {
        en: "Data exports and bulk operations",
        ar: "تصدير البيانات والعمليات المجمعة",
        tr: "Veri dışa aktarma ve toplu işlemler",
      },
      {
        en: "API key and webhook activity",
        ar: "نشاط مفاتيح API وWebhook",
        tr: "API anahtarı ve webhook etkinliği",
      },
      {
        en: "Export to CSV / JSON for compliance",
        ar: "تصدير إلى CSV / JSON للامتثال",
        tr: "Uyumluluk için CSV / JSON dışa aktarımı",
      },
    ],
    icon: ClipboardList,
    accentColor: "cyan",
    upgradeTier: "business",
    targetPlan: "business",
  },

  custom_branding: {
    id: "custom_branding",
    name: {
      en: "Custom Branding",
      ar: "العلامة التجارية المخصصة",
      tr: "Özel Marka",
    },
    shortPitch: {
      en: "Replace the Zyrix logo and favicon with your own. Make the platform feel like your product.",
      ar: "استبدل شعار Zyrix والأيقونة بشعارك الخاص. اجعل المنصة تبدو كمنتجك.",
      tr: "Zyrix logosunu ve favicon'u kendi logonuzla değiştirin. Platform sizin ürününüz gibi hissetsin.",
    },
    bullets: [
      {
        en: "Upload your own logo (light + dark variants)",
        ar: "ارفع شعارك الخاص (نسختين فاتحة + داكنة)",
        tr: "Kendi logonuzu yükleyin (açık + koyu varyantlar)",
      },
      {
        en: "Custom favicon for browser tabs",
        ar: "أيقونة مخصصة لعلامات تبويب المتصفح",
        tr: "Tarayıcı sekmeleri için özel favicon",
      },
      {
        en: "Branded login screens for your team",
        ar: "شاشات تسجيل دخول بعلامتك التجارية لفريقك",
        tr: "Ekibiniz için markalı giriş ekranları",
      },
      {
        en: "Email templates carry your logo automatically",
        ar: "قوالب البريد الإلكتروني تحمل شعارك تلقائيًا",
        tr: "E-posta şablonları otomatik olarak logonuzu taşır",
      },
      {
        en: "PDF exports (quotes, invoices) use your branding",
        ar: "تصدير PDF (عروض، فواتير) باستخدام علامتك",
        tr: "PDF dışa aktarımları (teklif, fatura) markanızı kullanır",
      },
    ],
    icon: Palette,
    accentColor: "violet",
    upgradeTier: "business",
    targetPlan: "business",
  },

  custom_email_sender: {
    id: "custom_email_sender",
    name: {
      en: "Custom Email Sender",
      ar: "مرسل البريد المخصص",
      tr: "Özel E-posta Gönderici",
    },
    shortPitch: {
      en: "Send emails from your own domain (you@your-company.com) with full SPF + DKIM authentication so messages land in the inbox, not spam.",
      ar: "أرسل البريد من دومينك الخاص (you@your-company.com) مع مصادقة SPF + DKIM كاملة ليصل البريد إلى البريد الوارد لا السبام.",
      tr: "Tam SPF + DKIM doğrulamasıyla kendi alan adınızdan e-posta gönderin (you@your-company.com) — mesajlar gelen kutusuna düşer, spam'e değil.",
    },
    bullets: [
      {
        en: "Send from you@your-company.com instead of @zyrix",
        ar: "أرسل من you@your-company.com بدلًا من @zyrix",
        tr: "@zyrix yerine you@your-company.com'dan gönderin",
      },
      {
        en: "Full SPF + DKIM authentication setup",
        ar: "إعداد مصادقة SPF + DKIM كاملة",
        tr: "Tam SPF + DKIM doğrulama kurulumu",
      },
      {
        en: "Higher deliverability — fewer spam folder hits",
        ar: "قابلية تسليم أعلى — وصول أقل لمجلد السبام",
        tr: "Daha yüksek teslim oranı — daha az spam klasörü",
      },
      {
        en: "Reply-to address points to your inbox",
        ar: "عنوان الرد على البريد يشير إلى صندوق بريدك",
        tr: "Yanıt adresi gelen kutunuza yönlendirir",
      },
      {
        en: "Per-team-member sender configuration",
        ar: "تكوين المرسل لكل عضو في الفريق",
        tr: "Ekip üyesi başına gönderici yapılandırması",
      },
    ],
    icon: Mail,
    accentColor: "rose",
    upgradeTier: "business",
    targetPlan: "business",
  },

  custom_domain: {
    id: "custom_domain",
    name: {
      en: "Custom Domain",
      ar: "الدومين المخصص",
      tr: "Özel Alan Adı",
    },
    shortPitch: {
      en: "Run your Zyrix workspace on your own domain (crm.your-company.com) for a fully white-labeled experience.",
      ar: "شغّل مساحة عمل Zyrix على دومينك الخاص (crm.your-company.com) لتجربة بعلامة بيضاء كاملة.",
      tr: "Zyrix çalışma alanınızı kendi alan adınızda (crm.your-company.com) çalıştırın — tam beyaz etiketli deneyim.",
    },
    bullets: [
      {
        en: "Vanity domain (crm.your-company.com)",
        ar: "دومين مخصص (crm.your-company.com)",
        tr: "Özel alan adı (crm.your-company.com)",
      },
      {
        en: "Auto-managed SSL certificate (Let's Encrypt)",
        ar: "شهادة SSL مُدارة تلقائيًا (Let's Encrypt)",
        tr: "Otomatik yönetilen SSL sertifikası (Let's Encrypt)",
      },
      {
        en: "DNS verification with TXT challenge",
        ar: "تحقق DNS عبر تحدي TXT",
        tr: "TXT sorgusu ile DNS doğrulaması",
      },
      {
        en: "Customer portal on your subdomain",
        ar: "بوابة العملاء على نطاقك الفرعي",
        tr: "Alt alan adınızda müşteri portalı",
      },
      {
        en: "No 'powered by Zyrix' references for end users",
        ar: "لا إشارات 'powered by Zyrix' للمستخدمين النهائيين",
        tr: "Son kullanıcılara 'Zyrix tarafından' atıfları yok",
      },
    ],
    icon: Globe,
    accentColor: "fuchsia",
    upgradeTier: "enterprise",
    targetPlan: "enterprise",
  },
};

export const GENERIC_FEATURE: FeatureDef = {
  id: "generic",
  name: { en: "this feature", ar: "هذه الميزة", tr: "bu özellik" },
  shortPitch: {
    en: "This feature is part of a higher Zyrix plan. Upgrade to unlock the full toolkit and get more out of your CRM.",
    ar: "هذه الميزة جزء من خطة Zyrix أعلى. قم بالترقية لفتح مجموعة الأدوات الكاملة والاستفادة من CRM.",
    tr: "Bu özellik daha üst bir Zyrix planının parçasıdır. Tam araç setini açmak için yükseltin.",
  },
  bullets: [
    {
      en: "Access advanced workflows and automations",
      ar: "وصول إلى workflows والأتمتة المتقدمة",
      tr: "Gelişmiş iş akışları ve otomasyonlara erişim",
    },
    {
      en: "Unlock AI-powered insights and forecasts",
      ar: "افتح الرؤى والتوقعات المدعومة بالذكاء الاصطناعي",
      tr: "AI destekli içgörüler ve tahminleri açın",
    },
    {
      en: "Multi-channel customer engagement",
      ar: "تفاعل متعدد القنوات مع العملاء",
      tr: "Çok kanallı müşteri etkileşimi",
    },
    {
      en: "Priority support and onboarding",
      ar: "دعم وتأهيل ذو أولوية",
      tr: "Öncelikli destek ve başlangıç",
    },
    {
      en: "Higher API and storage limits",
      ar: "حدود API وتخزين أعلى",
      tr: "Daha yüksek API ve depolama sınırları",
    },
  ],
  icon: FileText,
  accentColor: "cyan",
  upgradeTier: "pro",
  targetPlan: "starter",
};

export function getFeatureDef(id: string | null | undefined): FeatureDef {
  if (!id) return GENERIC_FEATURE;
  return FEATURE_CATALOG[id] ?? GENERIC_FEATURE;
}
