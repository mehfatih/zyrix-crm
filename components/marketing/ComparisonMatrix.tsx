// components/marketing/ComparisonMatrix.tsx
// Legacy CRMs vs Zyrix comparison.
// Renders as a table on lg+, stacked cards on mobile.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function ComparisonMatrix({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden px-5 py-20 text-white md:px-6 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #0A1530 0%, #112044 60%, #08111F 100%)",
      }}
    >
      <BackgroundFX variant="section" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {t.comparison.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Desktop: table */}
        <div className="zyrix-gradient-border mt-14 hidden overflow-hidden lg:block">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5">
            <div className="p-5 text-sm font-bold text-white/60" />
            <div className="border-l border-white/10 p-5 text-center text-base font-bold text-white/80">
              {t.comparison.legacyHeader}
            </div>
            <div className="border-l border-white/10 bg-cyan-400/8 p-5 text-center text-base font-bold text-cyan-200">
              {t.comparison.zyrixHeader}
            </div>
          </div>
          {t.comparison.rows.map((row, idx) => (
            <div
              key={row.dim}
              className={`grid grid-cols-3 ${
                idx < t.comparison.rows.length - 1 ? "border-b border-white/8" : ""
              }`}
            >
              <div className="p-5 text-sm font-bold text-white/85">
                {row.dim}
              </div>
              <div className="border-l border-white/10 p-5 text-sm text-white/60">
                {row.legacy}
              </div>
              <div className="border-l border-white/10 bg-cyan-400/5 p-5 text-sm font-semibold text-cyan-100">
                {row.zyrix}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-12 flex gap-4 overflow-x-auto pb-3 lg:hidden">
          {t.comparison.rows.map((row) => (
            <div
              key={row.dim}
              className="zyrix-gradient-border w-[280px] flex-shrink-0 overflow-hidden p-5"
            >
              <div className="mb-4 text-sm font-black uppercase tracking-wider text-white/70">
                {row.dim}
              </div>
              <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {t.comparison.legacyHeader}
                </div>
                <div className="mt-1.5 text-sm text-white/70">
                  {row.legacy}
                </div>
              </div>
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/8 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {t.comparison.zyrixHeader}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-cyan-50">
                  {row.zyrix}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
