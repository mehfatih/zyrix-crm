// components/marketing/HeroV2.tsx
// Dark cinematic hero with dashboard mock and floating chips.
// Arabic uses a calibrated smaller scale to avoid overflow.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { CommandConsoleMock } from "./CommandConsoleMock";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function HeroV2({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  // Calibrated headline classes: AR is denser per glyph, so size down.
  const headlineCls = isRtl
    ? "text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
    : "text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl";

  const subheadlineCls = isRtl
    ? "mt-6 max-w-2xl text-sm leading-7 text-white/72 md:text-base md:leading-8"
    : "mt-7 max-w-2xl text-base leading-7 text-white/72 md:text-lg md:leading-8";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 py-20 md:px-6 md:py-32"
    >
      <BackgroundFX variant="hero" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT: copy column */}
        <div className={isRtl ? "text-right" : "text-left"}>
          {/* Badge */}
          <div className="zyrix-chip mb-6">
            <span className="zyrix-pulse" />
            {t.hero.badge}
          </div>

          {/* Headline */}
          <h1 className={headlineCls}>
            {t.hero.headlineLead}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #67E8F9 0%, #60A5FA 50%, #A78BFA 100%)",
              }}
            >
              {t.hero.headlineHighlight}
            </span>
          </h1>

          {/* Subheadline */}
          <p className={subheadlineCls}>{t.hero.subheadline}</p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={`/${locale}/register`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-7 py-4 text-base font-bold text-white shadow-[0_20px_60px_rgba(34,211,238,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(34,211,238,0.42)]"
            >
              {t.cta.startFree}
              <Arrow rtl={isRtl} />
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/8 px-7 py-4 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/12"
            >
              <PlayIcon />
              {t.cta.watchTour}
            </a>
          </div>

          {/* Trust line */}
          <p className={isRtl ? "mt-6 max-w-xl text-xs leading-6 text-white/55" : "mt-7 max-w-xl text-sm leading-6 text-white/55"}>
            {t.hero.trustLine}
          </p>

          {/* Mobile chips strip */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:hidden">
            {[
              t.hero.chips.whatsapp,
              t.hero.chips.cfo,
              t.hero.chips.launch,
              t.hero.chips.tax,
            ].map((chip) => (
              <span key={chip} className="zyrix-chip whitespace-nowrap">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: dashboard mock */}
        <div className="relative">
          <CommandConsoleMock locale={locale} />
        </div>
      </div>
    </section>
  );
}

/* --- icons --- */

function Arrow({ rtl }: { rtl: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={rtl ? "mr-2 rotate-180" : "ml-2"}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
