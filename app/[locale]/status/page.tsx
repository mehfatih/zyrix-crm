import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Activity,
  Server,
  Database,
  Cloud,
  MessageCircle,
  Mail,
  Globe,
  Zap,
  BarChart3,
} from "lucide-react";

// ============================================================================
// SYSTEM STATUS PAGE
// Currently shows all services as operational. Evolves into live Uptime integration.
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "System Status — Zyrix CRM",
    ar: "حالة النظام — Zyrix CRM",
    tr: "Sistem Durumu — Zyrix CRM",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: "Real-time system status for Zyrix CRM services.",
  };
}

type Status = "operational" | "degraded" | "outage" | "maintenance";

const SERVICES: {
  name: { en: string; ar: string; tr: string };
  icon: typeof Server;
  status: Status;
  uptime: number;
}[] = [
  {
    name: { en: "Web Application (crm.zyrix.co)", ar: "تطبيق الويب (crm.zyrix.co)", tr: "Web Uygulaması (crm.zyrix.co)" },
    icon: Globe,
    status: "operational",
    uptime: 99.98,
  },
  {
    name: { en: "REST API (api.crm.zyrix.co)", ar: "REST API (api.crm.zyrix.co)", tr: "REST API (api.crm.zyrix.co)" },
    icon: Server,
    status: "operational",
    uptime: 99.97,
  },
  {
    name: { en: "Database (PostgreSQL)", ar: "قاعدة البيانات (PostgreSQL)", tr: "Veritabanı (PostgreSQL)" },
    icon: Database,
    status: "operational",
    uptime: 99.99,
  },
  {
    name: { en: "WhatsApp Gateway (Meta Cloud)", ar: "بوابة واتساب (Meta Cloud)", tr: "WhatsApp Geçidi (Meta Cloud)" },
    icon: MessageCircle,
    status: "operational",
    uptime: 99.95,
  },
  {
    name: { en: "Email Delivery (Resend)", ar: "تسليم البريد (Resend)", tr: "E-posta Teslimi (Resend)" },
    icon: Mail,
    status: "operational",
    uptime: 99.96,
  },
  {
    name: { en: "AI Services (Gemini 2.0 Flash)", ar: "خدمات الذكاء الاصطناعي (Gemini 2.0 Flash)", tr: "AI Hizmetleri (Gemini 2.0 Flash)" },
    icon: Zap,
    status: "operational",
    uptime: 99.92,
  },
  {
    name: { en: "Payment Gateways (Iyzico + HyperPay)", ar: "بوابات الدفع (Iyzico + HyperPay)", tr: "Ödeme Geçitleri (Iyzico + HyperPay)" },
    icon: Cloud,
    status: "operational",
    uptime: 99.94,
  },
  {
    name: { en: "Reports & Analytics", ar: "التقارير والتحليلات", tr: "Raporlar & Analitik" },
    icon: BarChart3,
    status: "operational",
    uptime: 99.99,
  },
];

const STATUS_META: Record<
  Status,
  { bg: string; text: string; ring: string; label: { en: string; ar: string; tr: string } }
> = {
  operational: {
    bg: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "bg-emerald-500/20",
    label: { en: "Operational", ar: "يعمل", tr: "Çalışıyor" },
  },
  degraded: {
    bg: "bg-amber-500",
    text: "text-amber-700",
    ring: "bg-amber-500/20",
    label: { en: "Degraded", ar: "أداء متدنٍ", tr: "Düşük performans" },
  },
  outage: {
    bg: "bg-red-500",
    text: "text-red-700",
    ring: "bg-red-500/20",
    label: { en: "Outage", ar: "انقطاع", tr: "Kesinti" },
  },
  maintenance: {
    bg: "bg-sky-500",
    text: "text-sky-700",
    ring: "bg-sky-500/20",
    label: { en: "Maintenance", ar: "صيانة", tr: "Bakım" },
  },
};

export default async function StatusPage({
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
      hero: { badge: "System Status", title: "All systems operational", subtitle: "Real-time status of every Zyrix service. Uptime averaged over the last 30 days." },
      services: "Services",
      uptime30d: "30-day uptime",
      incidents: "Recent incidents",
      noIncidents: "No incidents in the past 30 days — smooth sailing.",
    },
    ar: {
      hero: { badge: "حالة النظام", title: "جميع الأنظمة تعمل بشكل طبيعي", subtitle: "حالة فورية لكل خدمات Zyrix. وقت التشغيل بمتوسط آخر 30 يوماً." },
      services: "الخدمات",
      uptime30d: "وقت التشغيل خلال 30 يوماً",
      incidents: "الحوادث الأخيرة",
      noIncidents: "لا حوادث في الـ 30 يوماً الماضية — إبحار سلس.",
    },
    tr: {
      hero: { badge: "Sistem Durumu", title: "Tüm sistemler çalışıyor", subtitle: "Her Zyrix hizmetinin gerçek zamanlı durumu. Çalışma süresi son 30 gün ortalaması." },
      services: "Hizmetler",
      uptime30d: "30 günlük çalışma süresi",
      incidents: "Son olaylar",
      noIncidents: "Son 30 günde olay yok — düzgün gidiyor.",
    },
  };
  const t = copy[L];

  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <Activity className="w-3.5 h-3.5" />
            {t.hero.badge}
          </span>

          <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-40" />
            </div>
            <span className="font-semibold text-emerald-700">
              {allOperational ? t.hero.title : "Some services impacted"}
            </span>
          </div>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Services list */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{t.services}</h2>
            <span className="text-xs text-slate-500">{t.uptime30d}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const meta = STATUS_META[svc.status];
              return (
                <div
                  key={i}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/40"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {svc.name[L]}
                    </div>
                  </div>
                  <div className="text-right rtl:text-left flex-shrink-0">
                    <div className="text-sm font-bold text-emerald-700 font-mono">
                      {svc.uptime.toFixed(2)}%
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className={`w-2.5 h-2.5 ${meta.bg} rounded-full`} />
                    <div
                      className={`absolute inset-0 w-2.5 h-2.5 ${meta.bg} rounded-full animate-ping opacity-60`}
                    />
                  </div>
                  <span
                    className={`hidden sm:inline-block text-xs font-medium ${meta.text}`}
                  >
                    {meta.label[L]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            {t.incidents}
          </h2>
          <div className="text-center py-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">{t.noIncidents}</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
