// app/[locale]/page.tsx
// Zyrix CRM — Public marketing homepage v3 (pixel-match).

import React from "react";
import type { Metadata } from "next";

import { Header } from "@/components/marketing/v3/Header";
import { Hero } from "@/components/marketing/v3/Hero";
import { TrustStrip } from "@/components/marketing/v3/TrustStrip";
import { NumbersSection } from "@/components/marketing/v3/NumbersSection";
import { FeaturesGrid } from "@/components/marketing/v3/FeaturesGrid";
import { WhyZyrixBeats } from "@/components/marketing/v3/WhyZyrixBeats";
import { FinalCTAStrip } from "@/components/marketing/v3/FinalCTAStrip";
import { Footer } from "@/components/marketing/v3/Footer";

type Locale = "en" | "ar" | "tr";

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Zyrix CRM — The CRM built for how business actually happens",
    description:
      "All-in-one CRM for MENA & Türkiye teams. WhatsApp at the core. Arabic-first by design. AI-powered, per-company pricing.",
  },
  ar: {
    title: "زايركس CRM — الـ CRM المبني لطريقة عمل الأعمال كما تحدث فعلاً",
    description:
      "CRM شامل لفرق الشرق الأوسط وتركيا. الواتساب في القلب. عربي أولاً بالتصميم. مدعوم بالذكاء الاصطناعي، تسعير لكل شركة.",
  },
  tr: {
    title: "Zyrix CRM — İşin gerçekten olduğu yere göre tasarlanmış CRM",
    description:
      "MENA ve Türkiye ekipleri için hepsi-bir-arada CRM. WhatsApp merkezde. Arapça öncelikli tasarım. AI destekli, şirket başına fiyatlandırma.",
  },
};

function normalizeLocale(input: string): Locale {
  if (input === "ar") return "ar";
  if (input === "tr") return "tr";
  return "en";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = normalizeLocale(locale);
  const meta = META[loc];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: loc === "ar" ? "ar_SA" : loc === "tr" ? "tr_TR" : "en_US",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const loc = normalizeLocale(locale);

  return (
    <>
      <Header locale={loc} />
      <main>
        <Hero locale={loc} />
        <TrustStrip locale={loc} />
        <NumbersSection locale={loc} />
        <FeaturesGrid locale={loc} />
        <WhyZyrixBeats locale={loc} />
        <FinalCTAStrip locale={loc} />
      </main>
      <Footer locale={loc} />
    </>
  );
}
