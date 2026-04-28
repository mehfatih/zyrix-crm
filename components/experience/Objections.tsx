"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";

/**
 * Place at: components/experience/Objections.tsx
 *
 * 4 objection-handling cards (FAQ-style) — addresses common
 * concerns before prospects ask. Matches Sprint 8+9 dark theme.
 */

const OBJECTIONS = [
  { key: "o1", glow: "hsl(265 90% 65% / 0.18)" },
  { key: "o2", glow: "hsl(195 100% 60% / 0.18)" },
  { key: "o3", glow: "hsl(160 80% 55% / 0.18)" },
  { key: "o4", glow: "hsl(290 90% 65% / 0.18)" },
] as const;

export const Objections = () => {
  const t = useTranslations("Landing.objections");

  return (
    <section
      id="faq"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {OBJECTIONS.map((o, i) => (
            <div
              key={o.key}
              className="reveal card-interactive group relative rounded-2xl glass p-7 overflow-hidden"
              data-stagger={String(i * 80)}
            >
              <div
                aria-hidden
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${o.glow}, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 ring-1 ring-primary/20 mt-0.5">
                    <HelpCircle className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold tracking-tight leading-snug">
                    {t(`${o.key}Question`)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                  {t(`${o.key}Answer`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
