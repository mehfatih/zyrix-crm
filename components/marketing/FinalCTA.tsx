// components/marketing/FinalCTA.tsx
// Cinematic conversion block.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function FinalCTA({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden px-5 py-24 text-white md:px-6 md:py-32"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(circle at 80% 100%, rgba(124,58,237,0.20), transparent 50%), linear-gradient(180deg, #08111F 0%, #0A1530 100%)",
      }}
    >
      <BackgroundFX variant="hero" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="zyrix-chip mb-6 inline-flex">
          <span className="zyrix-pulse" />
          Day One Ready
        </div>
        <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
          {t.finalCta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg md:leading-8">
          {t.finalCta.subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={`/${locale}/register`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_24px_70px_rgba(34,211,238,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(34,211,238,0.50)]"
          >
            {locale === "ar" ? "ابدأ مجاناً" : locale === "tr" ? "Ücretsiz başla" : "Start free"}
          </a>
          <a
            href={`/${locale}/contact`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-8 py-4 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            {locale === "ar" ? "تواصل مع المبيعات" : locale === "tr" ? "Satışla konuş" : "Talk to sales"}
          </a>
        </div>

        <p className="mt-8 text-sm text-white/55">{t.finalCta.microCopy}</p>
      </div>
    </section>
  );
}
