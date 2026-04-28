"use client";

import { TrendingUp, Clock, MessageCircle, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * Place at: components/experience/NumbersSection.tsx
 *
 * 4 stat cards with count-up animation. Labels from Landing.numbers.
 */

const STATS_CONFIG = [
  { icon: MessageCircle, value: 80, suffix: "%", labelKey: "stat1Label" },
  { icon: Clock, value: 48, suffix: "h", labelKey: "stat2Label" },
  { icon: TrendingUp, value: 3, suffix: "x", labelKey: "stat3Label" },
  { icon: Users, value: 1200, suffix: "+", labelKey: "stat4Label" },
] as const;

const StatCard = ({
  icon: Icon, value, suffix, label, delay,
}: { icon: typeof TrendingUp; value: number; suffix: string; label: string; delay: number }) => {
  const { ref, value: counted } = useCountUp(value);

  return (
    <div
      className="reveal card-interactive relative group rounded-2xl glass p-7 float-slow"
      data-stagger={String(delay)}
    >
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.2), transparent 70%)" }}
      />
      <div className="relative">
        <Icon className="w-7 h-7 text-primary mb-4 icon-glow" />
        <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          <span ref={ref}>{counted}</span>
          <span className="text-gradient">{suffix}</span>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export const NumbersSection = () => {
  const t = useTranslations("Landing.numbers");

  return (
    <section className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom">
      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS_CONFIG.map((s, i) => (
            <StatCard
              key={s.labelKey}
              icon={s.icon}
              value={s.value}
              suffix={s.suffix}
              label={t(s.labelKey)}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
