"use client";

import { useEffect } from "react";
import { BackgroundLayers } from "@/components/experience/BackgroundLayers";
import { Nav } from "@/components/experience/Nav";
import { Hero } from "@/components/experience/Hero";
import { TrustStrip } from "@/components/experience/TrustStrip";
import { NumbersSection } from "@/components/experience/NumbersSection";
import { FeaturesGrid } from "@/components/experience/FeaturesGrid";
import { WhyZyrix } from "@/components/experience/WhyZyrix";
import { FinalCTA } from "@/components/experience/FinalCTA";
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
      <FinalCTA />
    </main>
  );
}
