"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Place at: components/experience/FinalCTA.tsx
 */

export const FinalCTA = () => {
  const t = useTranslations("Landing.cta");

  return (
    <section className="relative py-28 md:py-36 overflow-hidden section-blend-top">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(var(--primary) / 0.30), transparent 70%)," +
            "radial-gradient(ellipse 50% 40% at 30% 70%, hsl(var(--accent) / 0.20), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="absolute inset-0 bg-gradient-aurora opacity-30 animate-aurora-breathe pointer-events-none" />

      <div className="container relative max-w-3xl text-center">
        <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
          {t("titleStart")}{" "}
          <span className="text-gradient">{t("titleEmphasis")}</span>
        </h2>
        <p className="reveal text-lg text-muted-foreground mb-9" data-stagger="120">
          {t("subtitle")}
        </p>
        <div className="reveal flex flex-wrap justify-center gap-3" data-stagger="240">
          <Button size="lg" className="btn-glow bg-gradient-cta text-primary-foreground border-0 h-14 px-9 text-base shadow-glow">
            {t("ctaPrimary")}
            <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-7 text-base glass border-border">
            <MessageCircle className="mr-2 w-4 h-4" />
            {t("ctaSecondary")}
          </Button>
        </div>
        <p className="reveal mt-6 text-xs text-muted-foreground" data-stagger="360">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
};
