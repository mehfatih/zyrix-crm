// components/marketing/FeatureEcosystem.tsx
// Ecosystem map: center hub with orbiting modules.
// On mobile, gracefully degrades to a stacked grid.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function FeatureEcosystem({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 py-20 md:px-6 md:py-28"
      style={{ background: "linear-gradient(180deg, #08111F 0%, #0A1530 100%)" }}
    >
      <BackgroundFX variant="section" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {t.ecosystem.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.ecosystem.subtitle}
          </p>
        </div>

        {/* Ecosystem grid (with center hub on lg+) */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Center hub — full width on lg, becomes a card on smaller */}
          <div className="zyrix-gradient-border relative overflow-hidden p-7 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.18), transparent 70%)",
              }}
            />
            <div className="relative flex h-full flex-col justify-center">
              <div className="zyrix-chip mb-5 self-start">
                <span className="zyrix-pulse" />
                Core
              </div>
              <h3 className="text-3xl font-black text-white md:text-4xl lg:text-5xl">
                {t.ecosystem.center}
              </h3>
              <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
                {t.ecosystem.subtitle}
              </p>

              {/* Decorative orbit lines */}
              <div className="pointer-events-none absolute -bottom-20 -right-20 hidden lg:block">
                <div className="h-64 w-64 rounded-full border border-cyan-300/15" />
                <div className="absolute inset-6 rounded-full border border-violet-300/10" />
              </div>
            </div>
          </div>

          {/* Module cards */}
          {t.ecosystem.modules.map((mod) => (
            <div
              key={mod.name}
              className="zyrix-gradient-border group relative overflow-hidden p-6 transition-transform hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-400/15 blur-xl transition-opacity group-hover:bg-cyan-400/30" />
              <div className="relative">
                <h4 className="text-base font-bold text-white">{mod.name}</h4>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {mod.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
