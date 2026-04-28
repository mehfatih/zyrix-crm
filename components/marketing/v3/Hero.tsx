// components/marketing/v3/Hero.tsx
import React from "react";
import Link from "next/link";
import { BackgroundFX } from "../BackgroundFX";
import { HeroDashboard } from "./HeroDashboard";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function Hero({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  const headlineSize = isRtl
    ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="zyrix-dark-canvas relative isolate overflow-hidden px-5 pt-16 pb-20 md:px-8 md:pt-20 md:pb-32"
    >
      <BackgroundFX variant="hero" />

      {/* Curved bottom edge effect */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(248,250,252,0.04))",
          clipPath: "ellipse(120% 100% at 50% 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        {/* LEFT */}
        <div className={isRtl ? "text-right" : "text-left"}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-200 backdrop-blur">
            {t.hero.badge}
          </div>

          <h1 className={`font-black leading-[1.05] tracking-tight text-white ${headlineSize}`}>
            <span className="block">{t.hero.headlineLine1}</span>
            <span className="block">{t.hero.headlineLine2}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #67E8F9 0%, #C084FC 100%)",
              }}
            >
              {t.hero.headlineLine3}
            </span>
          </h1>

          <p className={`mt-6 max-w-xl whitespace-pre-line leading-7 text-white/72 ${isRtl ? "text-sm" : "text-base"}`}>
            {t.hero.subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={`/${locale}/register`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 px-6 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(34,211,238,0.30)] transition-all hover:-translate-y-0.5"
            >
              <SparkleIcon />
              {t.cta.startFreeFull}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              {t.cta.talkToSales}
            </Link>
          </div>

          {/* Social proof row */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://i.pravatar.cc/40?u=zyrix1",
                "https://i.pravatar.cc/40?u=zyrix2",
                "https://i.pravatar.cc/40?u=zyrix3",
              ].map((src, i) => (
                <span
                  key={i}
                  className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-[#0A1530]"
                  style={{
                    background: ["#22D3EE", "#A78BFA", "#34D399"][i],
                  }}
                >
                  <span className="text-[10px] font-black text-[#0A1530]">
                    {["A", "M", "S"][i]}
                  </span>
                </span>
              ))}
            </div>
            <span className="text-xs text-white/55">{t.hero.socialProof}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <HeroDashboard locale={locale} />
        </div>
      </div>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" />
    </svg>
  );
}
