import PricingView from "@/components/pricing/PricingView";
import PublicLayout from "@/components/public/PublicLayout";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PLAN_PRICES_USD } from "@/lib/billing/currency";

// Sprint 14aa — compute the SEO price-range label from the canonical
// plan catalog so /pricing metadata stays in sync with PLAN_PRICES_USD.
// Excludes contact-sales tiers (null prices) so we only advertise the
// self-serve range.
const SELF_SERVE_MONTHLY = Object.values(PLAN_PRICES_USD)
  .map((p) => p.monthly)
  .filter((v): v is number => v !== null);
const MIN_PRICE = Math.min(...SELF_SERVE_MONTHLY);
const MAX_PRICE = Math.max(...SELF_SERVE_MONTHLY);
const PRICE_RANGE_LABEL = `$${MIN_PRICE} to $${MAX_PRICE}/mo`;

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
    en: `Simple per-company pricing from ${PRICE_RANGE_LABEL}. No per-seat fees. WhatsApp Business API, AI CFO, and Arabic dialect AI included.`,
    ar: `أسعار بسيطة لكل شركة من ${PRICE_RANGE_LABEL}. بدون رسوم لكل مستخدم. واتساب للأعمال والذكاء الاصطناعي مدمج.`,
    tr: `Şirket başına basit fiyatlandırma ${PRICE_RANGE_LABEL}. Koltuk başı ücret yok. WhatsApp Business API ve AI dahil.`,
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

  return (
    <PublicLayout>
      <PricingView locale={locale} />
    </PublicLayout>
  );
}
