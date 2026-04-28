"use client";

import { Nav } from "@/components/experience/Nav";
import { SiteFooter } from "@/components/experience/SiteFooter";
import { StickyCTA } from "@/components/experience/StickyCTA";

// ============================================================================
// PUBLIC LAYOUT WRAPPER (Sprint 14 unification)
// ----------------------------------------------------------------------------
// Renders the dark-cinematic experience system (Nav + SiteFooter + StickyCTA)
// for all marketing pages: /features, /pricing, /about, /contact, etc.
// Replaces the prior light-theme gradient overrides which caused white-on-
// white text invisibility.
// ============================================================================

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <SiteFooter />
      <StickyCTA />
    </div>
  );
}
