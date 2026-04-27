"use client";

import { useTranslations } from "next-intl";
import { Plug, Upload, Rocket } from "lucide-react";

const STEPS = [
  { key: "s1", icon: Plug, glow: "hsl(160 80% 55% / 0.18)", accent: "text-emerald-400 bg-emerald-500/10 ring-emerald-400/20" },
  { key: "s2", icon: Upload, glow: "hsl(38 92% 60% / 0.18)", accent: "text-amber-400 bg-amber-500/10 ring-amber-400/20" },
  { key: "s3", icon: Rocket, glow: "hsl(330 90% 65% / 0.18)", accent: "text-pink-400 bg-pink-500/10 ring-pink-400/20" },
] as const;

export const HowItWorks = () => {
  const t = useTranslations("Landing.howItWorks");

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto relative">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-400/30 via-amber-400/30 to-pink-400/30 pointer-events-none"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className="reveal card-interactive group relative rounded-2xl glass p-7 overflow-hidden"
                data-stagger={String(i * 100)}
              >
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${step.glow}, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  {/* Step number + icon row */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ring-1 ${step.accent} relative z-10`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-5xl font-bold text-foreground/5 leading-none tabular-nums">
                      0{i + 1}
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {t(`${step.key}Tag`)}
                  </p>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight mb-3 leading-snug">
                    {t(`${step.key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${step.key}Description`)}
                  </p>

                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {t(`${step.key}Time`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
