// components/marketing/MetricStrip.tsx
// Five operational metric cards. Glass cards with subtle glow per card.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function MetricStrip({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  const accents = [
    "from-cyan-400/30 to-cyan-500/0",
    "from-emerald-400/30 to-emerald-500/0",
    "from-blue-400/30 to-blue-500/0",
    "from-violet-400/30 to-violet-500/0",
    "from-amber-400/30 to-amber-500/0",
  ];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 py-20 md:px-6 md:py-28"
    >
      <BackgroundFX variant="section" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {t.metrics.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.metrics.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {t.metrics.cards.map((card, idx) => (
            <div
              key={card.label}
              className="zyrix-gradient-border relative overflow-hidden p-6"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${accents[idx]} blur-2xl`}
              />
              <div className="relative">
                <div className="text-3xl font-black text-white md:text-4xl">
                  {card.value}
                </div>
                <div className="mt-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
                  {card.label}
                </div>
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
