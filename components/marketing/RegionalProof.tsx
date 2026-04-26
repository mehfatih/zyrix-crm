// components/marketing/RegionalProof.tsx
// Four regional cards: Turkiye, Saudi Arabia, UAE/Gulf, Iraq/Egypt.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function RegionalProof({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 py-20 md:px-6 md:py-28"
    >
      <BackgroundFX variant="section" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="zyrix-chip mb-5">
            <span className="zyrix-pulse" />
            MENA + Türkiye
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {t.regional.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.regional.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {t.regional.cards.map((card) => (
            <div
              key={card.country}
              className="zyrix-gradient-border group relative overflow-hidden p-6 transition-transform hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/15 blur-2xl transition-opacity group-hover:bg-cyan-400/30" />
              <div className="relative">
                <div className="mb-4 text-4xl">{card.flag}</div>
                <h3 className="text-lg font-bold text-white">{card.country}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
