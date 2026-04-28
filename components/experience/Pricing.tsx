"use client";

import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";

const PLANS = [
  {
    key: "starter",
    glow: "hsl(195 100% 60% / 0.18)",
    accent: "text-cyan-400",
    badge: false,
  },
  {
    key: "pro",
    glow: "hsl(265 90% 65% / 0.25)",
    accent: "text-purple-400",
    badge: true,
  },
  {
    key: "enterprise",
    glow: "hsl(38 92% 60% / 0.18)",
    accent: "text-amber-400",
    badge: false,
  },
] as const;

export const Pricing = () => {
  const t = useTranslations("Landing.pricing");

  return (
    <section
      id="pricing"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <div
              key={plan.key}
              className={`reveal card-interactive group relative rounded-2xl glass p-7 overflow-hidden ${
                plan.badge
                  ? "ring-1 ring-purple-400/30 md:scale-[1.02]"
                  : ""
              }`}
              data-stagger={String(i * 100)}
            >
              <div
                aria-hidden
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top, ${plan.glow}, transparent 70%)`,
                }}
              />

              {plan.badge && (
                <div className="absolute top-4 end-4">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-purple-500/15 text-purple-400 ring-1 ring-purple-400/30">
                    {t("popular")}
                  </span>
                </div>
              )}

              <div className="relative">
                <p className={`text-sm font-medium mb-1 ${plan.accent}`}>
                  {t(`${plan.key}Name`)}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  {t(`${plan.key}Price`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {t(`${plan.key}Description`)}
                </p>

                <ul className="space-y-2.5 mb-7">
                  {[1, 2, 3, 4].map((idx) => (
                    <li
                      key={idx}
                      className="text-sm text-foreground/85 flex items-start gap-2.5"
                    >
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.accent}`} strokeWidth={2.5} />
                      <span>{t(`${plan.key}Feature${idx}`)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    plan.badge
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/25"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10 ring-1 ring-border/60"
                  }`}
                >
                  {t(`${plan.key}Cta`)}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p
          className="reveal text-center text-xs text-muted-foreground mt-8"
          data-stagger="500"
        >
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
};
