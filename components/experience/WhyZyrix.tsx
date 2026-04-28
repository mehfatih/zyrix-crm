"use client";

import { useTranslations } from "next-intl";
import { Check, X, MessageCircle, Globe, Zap, Shield } from "lucide-react";

/**
 * Place at: components/experience/WhyZyrix.tsx
 *
 * Layout:
 * 1. Section hero (title + subtitle)
 * 2. Two-column row:
 *    - Left: 2×2 grid of 4 icon cards
 *    - Right: comparison table with last row inverted (Zyrix avoids the "trap")
 */

const REASONS_CONFIG = [
  { icon: MessageCircle, key: "r1", glow: "hsl(160 80% 55% / 0.18)" },
  { icon: Globe, key: "r2", glow: "hsl(195 100% 60% / 0.18)" },
  { icon: Zap, key: "r3", glow: "hsl(265 90% 65% / 0.18)" },
  { icon: Shield, key: "r4", glow: "hsl(245 80% 65% / 0.18)" },
] as const;

type Cell = "yes" | "no";

const COMPARISON: { key: string; zyrix: Cell; generic: Cell }[] = [
  { key: "row1", zyrix: "yes", generic: "no" },
  { key: "row2", zyrix: "yes", generic: "no" },
  { key: "row3", zyrix: "yes", generic: "no" },
  { key: "row4", zyrix: "yes", generic: "no" },
  { key: "row5", zyrix: "yes", generic: "no" },
  // Inverted: Zyrix avoids the trap, generic CRMs have it
  { key: "row6", zyrix: "no", generic: "yes" },
];

const renderCell = (val: Cell) => {
  if (val === "yes") {
    return <Check className="w-5 h-5 text-primary mx-auto" strokeWidth={2.5} />;
  }
  return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" strokeWidth={2.5} />;
};

export const WhyZyrix = () => {
  const t = useTranslations("Landing.why");

  return (
    <section
      id="why"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
      <div className="container relative">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>{" "}
            {t("titleEnd")}
          </h2>
          <p className="reveal text-lg text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* LEFT — 2×2 icon cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REASONS_CONFIG.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.key}
                  className="reveal card-interactive group relative rounded-2xl glass p-6 overflow-hidden"
                  data-stagger={String(i * 80)}
                >
                  <div
                    aria-hidden
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-cinematic pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top, ${r.glow}, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-4">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-semibold mb-2 tracking-tight">
                      {t(`${r.key}Title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${r.key}Desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — comparison table */}
          <div className="reveal" data-stagger="240">
            <div className="glass rounded-2xl p-6 md:p-7">
              <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-4 pb-4 mb-2 border-b border-border/50">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
                  {t("tableHeader")}
                </span>
                <span className="text-sm font-semibold text-gradient text-center">
                  {t("tableZyrix")}
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium text-center">
                  {t("tableGeneric")}
                </span>
              </div>

              <div className="divide-y divide-border/30">
                {COMPARISON.map((row) => (
                  <div
                    key={row.key}
                    className="grid grid-cols-[1.6fr_1fr_1fr] gap-4 py-3.5 items-center"
                  >
                    <span className="text-sm text-foreground/90">{t(row.key)}</span>
                    <div className="flex justify-center">{renderCell(row.zyrix)}</div>
                    <div className="flex justify-center">{renderCell(row.generic)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
