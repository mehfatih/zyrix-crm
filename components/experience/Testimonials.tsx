"use client";

import { useTranslations } from "next-intl";
import { Quote, TrendingUp, Zap, Layers } from "lucide-react";

/**
 * Place at: components/experience/Testimonials.tsx
 *
 * 3 generic testimonial cards (no specific company names — role + region only).
 * Plus 3 stat cards showing aggregate impact.
 * Matches Sprint 8+9 dark cinematic theme.
 */

const TESTIMONIALS = [
  { key: "t1", glow: "hsl(265 90% 65% / 0.18)" },
  { key: "t2", glow: "hsl(195 100% 60% / 0.18)" },
  { key: "t3", glow: "hsl(160 80% 55% / 0.18)" },
] as const;

const STATS = [
  { icon: Zap, key: "s1", glow: "hsl(265 90% 65% / 0.18)" },
  { icon: TrendingUp, key: "s2", glow: "hsl(195 100% 60% / 0.18)" },
  { icon: Layers, key: "s3", glow: "hsl(160 80% 55% / 0.18)" },
] as const;

export const Testimonials = () => {
  const t = useTranslations("Landing.testimonials");

  return (
    <section
      id="proof"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            <span className="text-gradient">{t("titleEmphasis")}</span>{" "}
            {t("title")}
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="reveal group relative rounded-2xl glass p-5 overflow-hidden text-center"
                data-stagger={String(i * 80)}
              >
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${s.glow}, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-3">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {t(`${s.key}Value`)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(`${s.key}Label`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((tm, i) => (
            <figure
              key={tm.key}
              className="reveal card-interactive group relative rounded-2xl glass p-6 overflow-hidden flex flex-col"
              data-stagger={String((i + 3) * 80)}
            >
              <div
                aria-hidden
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top, ${tm.glow}, transparent 70%)`,
                }}
              />
              <div className="relative flex flex-col h-full">
                <Quote className="w-5 h-5 text-primary/60 mb-3" strokeWidth={2} />
                <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1 italic">
                  {t(`${tm.key}Quote`)}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border/40">
                  <div className="text-sm font-medium text-foreground">
                    {t(`${tm.key}Role`)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t(`${tm.key}Region`)}
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <p className="reveal text-center text-xs text-muted-foreground mt-8" data-stagger="600">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
};
