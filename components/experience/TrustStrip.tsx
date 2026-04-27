"use client";

import { useTranslations } from "next-intl";

/**
 * Place at: components/experience/TrustStrip.tsx
 *
 * Logos are placeholder brand names (not real companies).
 * Eyebrow text comes from Landing.trust namespace.
 */

const LOGOS = ["Northwave", "Levantra", "Atlasium", "Veridyn", "Bytecraft", "Solara", "oMarquis"];

export const TrustStrip = () => {
  const t = useTranslations("Landing.trust");

  return (
    <section id="trust" className="relative py-20 overflow-hidden section-blend-top">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%)",
        }}
      />

      <div className="container relative">
        <p className="reveal text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
          {t("eyebrow")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LOGOS.map((logo, i) => (
            <div
              key={logo}
              className="reveal group cursor-pointer"
              data-stagger={String(i * 80)}
            >
              <span
                className="text-xl font-semibold text-muted-foreground/60 grayscale
                  transition-all duration-700 ease-cinematic
                  group-hover:text-foreground group-hover:grayscale-0
                  group-hover:[text-shadow:0_0_20px_hsl(var(--primary)/0.5)]"
              >
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
