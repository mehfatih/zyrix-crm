import PricingView from "@/components/pricing/PricingView";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    en: "Pricing — Zyrix CRM | WhatsApp-Native CRM for MENA & Turkey",
    ar: "الأسعار — Zyrix CRM | أول CRM بالعربية مع واتساب مدمج",
    tr: "Fiyatlandırma — Zyrix CRM | MENA ve Türkiye için CRM",
  };
  const descriptions = {
    en: "Simple per-company pricing from $0 to $49/mo. No per-seat fees. WhatsApp Business API, AI CFO, and Arabic dialect AI included.",
    ar: "أسعار بسيطة لكل شركة من 0$ إلى 49$ شهرياً. بدون رسوم لكل مستخدم. واتساب للأعمال والذكاء الاصطناعي مدمج.",
    tr: "Şirket başına basit fiyatlandırma $0'dan $49/ay'a. Koltuk başı ücret yok. WhatsApp Business API ve AI dahil.",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: descriptions[locale as keyof typeof descriptions] ?? descriptions.en,
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/pricing`,
      languages: {
        en: "https://crm.zyrix.co/en/pricing",
        ar: "https://crm.zyrix.co/ar/pricing",
        tr: "https://crm.zyrix.co/tr/pricing",
      },
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingView locale={locale} />;
}
