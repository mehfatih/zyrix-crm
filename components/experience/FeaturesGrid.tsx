"use client";

import { useTranslations } from "next-intl";
import {
  MessageCircle,
  Inbox,
  GitBranch,
  Sparkles,
  Users,
  Receipt,
  Wallet,
  BarChart3,
} from "lucide-react";

/**
 * Place at: components/experience/FeaturesGrid.tsx
 *
 * 8 product feature cards. 4×2 grid on desktop, 2×4 on tablet, 1×8 on mobile.
 */

const FEATURES_CONFIG = [
  {
    icon: MessageCircle, key: "f1",
    iconBg: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    glow: "hsl(160 80% 55% / 0.18)",
  },
  {
    icon: Inbox, key: "f2",
    iconBg: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    glow: "hsl(265 90% 65% / 0.18)",
  },
  {
    icon: GitBranch, key: "f3",
    iconBg: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
    glow: "hsl(195 100% 60% / 0.18)",
  },
  {
    icon: Sparkles, key: "f4",
    iconBg: "from-fuchsia-500/20 to-fuchsia-500/5",
    iconColor: "text-fuchsia-400",
    glow: "hsl(290 90% 65% / 0.18)",
  },
  {
    icon: Users, key: "f5",
    iconBg: "from-slate-400/20 to-slate-400/5",
    iconColor: "text-slate-300",
    glow: "hsl(220 20% 65% / 0.15)",
  },
  {
    icon: Receipt, key: "f6",
    iconBg: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    glow: "hsl(40 90% 60% / 0.18)",
  },
  {
    icon: Wallet, key: "f7",
    iconBg: "from-indigo-500/20 to-indigo-500/5",
    iconColor: "text-indigo-400",
    glow: "hsl(245 80% 65% / 0.18)",
  },
  {
    icon: BarChart3, key: "f8",
    iconBg: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
    glow: "hsl(275 85% 65% / 0.18)",
  },
] as const;

export const FeaturesGrid = () => {
  const t = useTranslations("Landing.featuresSection");

  return (
    <section
      id="features"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES_CONFIG.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="reveal card-interactive group relative rounded-2xl glass p-6 overflow-hidden"
                data-stagger={String(i * 80)}
              >
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${feature.glow}, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${feature.iconBg} mb-5 ring-1 ring-border/50`}
                  >
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={1.75} />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 tracking-tight">
                    {t(`${feature.key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${feature.key}Desc`)}
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
