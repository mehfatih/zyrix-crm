// components/marketing/v3/FinalCTAStrip.tsx
// The horizontal gradient strip just above the footer.
import React from "react";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function FinalCTAStrip({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden px-5 py-7 md:px-8"
      style={{
        background:
          "linear-gradient(90deg, #1A56DB 0%, #7C3AED 50%, #C026D3 100%)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-white md:flex-row md:gap-8">
        <div className="text-center md:text-start">
          <div className="text-lg font-bold md:text-xl">{t.finalCta.title}</div>
          <div className="mt-1 text-xs text-white/75 md:text-sm">{t.finalCta.subtitle}</div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Link
            href={`/${locale}/register`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-violet-700 transition-transform hover:-translate-y-0.5"
          >
            {t.finalCta.primary}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            {t.finalCta.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
