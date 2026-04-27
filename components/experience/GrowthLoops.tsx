"use client";

import { useTranslations } from "next-intl";
import { Repeat, Megaphone, Gift, Star } from "lucide-react";

const loops = [
  {
    key: "reEngagement",
    Icon: Repeat,
    accent: "indigo",
    classes: {
      iconBg: "bg-indigo-500/10",
      iconBorder: "border-indigo-400/30",
      iconColor: "text-indigo-300",
      glow: "from-indigo-500/0 via-indigo-500/10 to-indigo-500/0",
      hoverBorder: "hover:border-indigo-400/40",
    },
  },
  {
    key: "broadcast",
    Icon: Megaphone,
    accent: "sky",
    classes: {
      iconBg: "bg-sky-500/10",
      iconBorder: "border-sky-400/30",
      iconColor: "text-sky-300",
      glow: "from-sky-500/0 via-sky-500/10 to-sky-500/0",
      hoverBorder: "hover:border-sky-400/40",
    },
  },
  {
    key: "referral",
    Icon: Gift,
    accent: "fuchsia",
    classes: {
      iconBg: "bg-fuchsia-500/10",
      iconBorder: "border-fuchsia-400/30",
      iconColor: "text-fuchsia-300",
      glow: "from-fuchsia-500/0 via-fuchsia-500/10 to-fuchsia-500/0",
      hoverBorder: "hover:border-fuchsia-400/40",
    },
  },
  {
    key: "reviews",
    Icon: Star,
    accent: "amber",
    classes: {
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-400/30",
      iconColor: "text-amber-300",
      glow: "from-amber-500/0 via-amber-500/10 to-amber-500/0",
      hoverBorder: "hover:border-amber-400/40",
    },
  },
] as const;

export const GrowthLoops = () => {
  const t = useTranslations("Landing.growthLoops");

  return (
    <section
      id="growth-loops"
      className="relative py-24 md:py-32 border-t border-white/5"
    >
      {/* Decorative ambient orb */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent blur-3xl pointer-events-none"
      />

      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="reveal max-w-2xl">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-indigo-300/80 px-3 py-1 rounded-full border border-indigo-400/20 bg-indigo-500/5">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
            {t("title")}{" "}
            <span className="text-gradient bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 reveal"
          data-stagger="80"
        >
          {loops.map(({ key, Icon, classes }) => (
            <div
              key={key}
              className={`group relative glass rounded-2xl p-7 flex items-start gap-5 transition-all duration-300 ${classes.hoverBorder} hover:-translate-y-0.5`}
            >
              {/* Soft glow on hover */}
              <div
                aria-hidden
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${classes.glow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              {/* Icon */}
              <div
                className={`relative h-12 w-12 shrink-0 rounded-xl border ${classes.iconBg} ${classes.iconBorder} inline-flex items-center justify-center`}
              >
                <Icon className={`h-5 w-5 ${classes.iconColor}`} strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-semibold text-foreground">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-sm text-muted-foreground/80 max-w-xl reveal">
          {t("note")}
        </p>
      </div>
    </section>
  );
};

export default GrowthLoops;
