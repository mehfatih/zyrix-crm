"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, Building2, Sparkles, Home } from "lucide-react";

const USE_CASES = [
  { key: "u1", icon: ShoppingBag, glow: "hsl(160 80% 55% / 0.18)", accent: "text-emerald-400 bg-emerald-500/10 ring-emerald-400/20" },
  { key: "u2", icon: Building2, glow: "hsl(195 100% 60% / 0.18)", accent: "text-cyan-400 bg-cyan-500/10 ring-cyan-400/20" },
  { key: "u3", icon: Sparkles, glow: "hsl(265 90% 65% / 0.18)", accent: "text-purple-400 bg-purple-500/10 ring-purple-400/20" },
  { key: "u4", icon: Home, glow: "hsl(38 92% 60% / 0.18)", accent: "text-amber-400 bg-amber-500/10 ring-amber-400/20" },
] as const;

export const UseCases = () => {
  const t = useTranslations("Landing.useCases");

  return (
    <section
      id="use-cases"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.key}
                className="reveal card-interactive group relative rounded-2xl glass p-6 overflow-hidden"
                data-stagger={String(i * 80)}
              >
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${uc.glow}, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${uc.accent} mb-4`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold tracking-tight mb-2 leading-snug">
                    {t(`${uc.key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t(`${uc.key}Description`)}
                  </p>

                  <ul className="space-y-1.5">
                    {[1, 2, 3].map((idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground/90 flex items-start gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{t(`${uc.key}Point${idx}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
