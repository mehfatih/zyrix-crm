// components/marketing/IntegrationsOrbit.tsx
// Marquee of integration platform pills.
// Loops infinitely, pauses on hover, respects reduced motion.

import React from "react";
import Link from "next/link";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function IntegrationsOrbit({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  // Duplicate logos so the marquee can loop seamlessly
  const logos = [...t.integrations.logos, ...t.integrations.logos];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 py-20 md:px-6 md:py-28"
    >
      <BackgroundFX variant="section" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {t.integrations.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.integrations.subtitle}
          </p>
        </div>

        {/* Marquee */}
        <div className="mt-12 overflow-hidden">
          <div
            className="zyrix-marquee flex gap-3"
            style={{ width: "max-content" }}
          >
            {logos.map((logo, idx) => (
              <span
                key={`${logo}-${idx}`}
                className="zyrix-gradient-border whitespace-nowrap px-6 py-3.5 text-sm font-bold text-white/90"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href={`/${locale}/features#integrations`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            {t.integrations.cta}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={isRtl ? "rotate-180" : ""}
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
