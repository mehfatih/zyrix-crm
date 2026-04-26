// app/[locale]/page.tsx
// Zyrix CRM — Public marketing homepage (v2 dark identity).
// Composed of 9 sections from header to footer.

import React from "react";
import type { Metadata } from "next";

import { HeroV2 } from "@/components/marketing/HeroV2";
import { MetricStrip } from "@/components/marketing/MetricStrip";
import { FeatureEcosystem } from "@/components/marketing/FeatureEcosystem";
import { AICommandCenter } from "@/components/marketing/AICommandCenter";
import { RegionalProof } from "@/components/marketing/RegionalProof";
import { WhatsAppCore } from "@/components/marketing/WhatsAppCore";
import { IntegrationsOrbit } from "@/components/marketing/IntegrationsOrbit";
import { ComparisonMatrix } from "@/components/marketing/ComparisonMatrix";
import { FinalCTA } from "@/components/marketing/FinalCTA";

// If your layout already renders <HeaderV2 /> and <FooterV2 />, REMOVE these
// two imports + the JSX usages at the bottom. They're included here so the
// page works whether or not the layout wires the chrome.
import { HeaderV2 } from "@/components/marketing/HeaderV2";
import { FooterV2 } from "@/components/marketing/FooterV2";

type Locale = "en" | "ar" | "tr";

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Zyrix CRM — Growth OS for WhatsApp-first teams in MENA & Türkiye",
    description:
      "CRM, WhatsApp conversations, sales pipelines, AI CFO insights, and regional tax logic in one system built for Türkiye and MENA.",
  },
  ar: {
    title: "زايركس CRM — نظام تشغيل النمو لفرق الواتساب أولاً في الشرق الأوسط وتركيا",
    description:
      "إدارة العملاء ومحادثات الواتساب وخطوط المبيعات ورؤى المدير المالي الذكي ومنطق الضرائب الإقليمي في نظام واحد لتركيا والشرق الأوسط.",
  },
  tr: {
    title: "Zyrix CRM — MENA ve Türkiye'deki WhatsApp öncelikli ekipler için büyüme OS",
    description:
      "CRM, WhatsApp konuşmaları, satış pipeline'ları, AI CFO içgörüleri ve bölgesel vergi mantığı tek bir sistemde — Türkiye ve MENA için.",
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
      {/*
        REMOVE the next line if app/[locale]/layout.tsx already renders <HeaderV2 />.
        Keep it if the layout has no shared header.
      */}
      <HeaderV2 locale={loc} />

      <main>
        <HeroV2 locale={loc} />
        <MetricStrip locale={loc} />
        <FeatureEcosystem locale={loc} />
        <AICommandCenter locale={loc} />
        <RegionalProof locale={loc} />
        <WhatsAppCore locale={loc} />
        <IntegrationsOrbit locale={loc} />
        <ComparisonMatrix locale={loc} />
        <FinalCTA locale={loc} />
      </main>

      {/*
        REMOVE the next line if app/[locale]/layout.tsx already renders <FooterV2 />.
      */}
      <FooterV2 locale={loc} />
    </>
  );
}
