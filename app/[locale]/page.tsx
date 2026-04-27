"use client";

import { useEffect } from "react";
import { BackgroundLayers } from "@/components/experience/BackgroundLayers";
import { Nav } from "@/components/experience/Nav";
import { Hero } from "@/components/experience/Hero";
import { TrustStrip } from "@/components/experience/TrustStrip";
import { NumbersSection } from "@/components/experience/NumbersSection";
import { FeaturesGrid } from "@/components/experience/FeaturesGrid";
import { WhyZyrix } from "@/components/experience/WhyZyrix";
import { Objections } from "@/components/experience/Objections";
import { Testimonials } from "@/components/experience/Testimonials";
import { LiveDashboard } from "@/components/experience/LiveDashboard";
import { HowItWorks } from "@/components/experience/HowItWorks";
import { UseCases } from "@/components/experience/UseCases";
import { Integrations } from "@/components/experience/Integrations";
import { Pricing } from "@/components/experience/Pricing";
import { GrowthLoops } from "@/components/experience/GrowthLoops";
import { SiteFooter } from "@/components/experience/SiteFooter";
import { StickyCTA } from "@/components/experience/StickyCTA";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

/**
 * Place at: app/[locale]/page.tsx
 *
 * Main landing page composition.
 * NOTE: All content currently in English. i18n integration in next sprint.
 */

export default function HomePage() {
  useRevealOnScroll();

  return (
    <main className="relative">
      <BackgroundLayers />
      <Nav />
      <Hero />
      <TrustStrip />
      <NumbersSection />
      <FeaturesGrid />
      <WhyZyrix />
      <Objections />
      <Testimonials />
      <LiveDashboard />
      <HowItWorks />
      <UseCases />
      <Integrations />
      <Pricing />
      <GrowthLoops />
      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
