// components/marketing/CommandConsoleMock.tsx
// The floating dashboard mock used in the hero.
// Pure presentational — no data fetching.

import React from "react";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function CommandConsoleMock({ locale }: Props) {
  const t = getCopy(locale);
  const c = t.hero.console;

  const cards = [
    { label: c.cards.whatsapp, hint: "delivery", accent: "from-emerald-400/30 to-emerald-500/0", dot: "#34D399" },
    { label: c.cards.pipeline, hint: "open value", accent: "from-cyan-400/30 to-cyan-500/0", dot: "#22D3EE" },
    { label: c.cards.cfo, hint: "confidence", accent: "from-violet-400/30 to-violet-500/0", dot: "#A78BFA" },
    { label: c.cards.cash, hint: "30d horizon", accent: "from-amber-400/30 to-amber-500/0", dot: "#FBBF24" },
  ];

  return (
    <div className="relative">
      {/* Outer glass shell */}
      <div className="zyrix-float rounded-[2rem] border border-white/14 bg-white/[0.07] p-3 shadow-[0_30px_120px_rgba(34,211,238,0.18)] backdrop-blur-2xl md:p-4">
        {/* Inner panel */}
        <div className="rounded-[1.5rem] bg-[#071226]/90 p-5 md:p-6">
          {/* Title row */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-[11px] font-black text-white">
                Z
              </span>
              <span className="text-sm font-bold text-white/90">{c.title}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <span className="zyrix-pulse" />
              {c.live}
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent} blur-xl`}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: card.dot }}
                  />
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    {card.hint}
                  </span>
                </div>
                <div className="mt-3 text-base font-bold text-white">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Chart placeholder line */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">
                30d revenue
              </span>
              <span className="text-xs font-bold text-emerald-300">+12.4%</span>
            </div>
            <svg viewBox="0 0 240 60" className="h-12 w-full">
              <defs>
                <linearGradient id="zxSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 C30,38 50,28 80,30 C110,32 130,18 160,20 C190,22 210,12 240,8 L240,60 L0,60 Z"
                fill="url(#zxSpark)"
              />
              <path
                d="M0,40 C30,38 50,28 80,30 C110,32 130,18 160,20 C190,22 210,12 240,8"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating chip — top right */}
      <div className="zyrix-float-delayed absolute -right-3 -top-4 hidden md:block">
        <div className="zyrix-chip">
          <span className="zyrix-pulse" />
          {t.hero.chips.whatsapp}
        </div>
      </div>

      {/* Floating chip — bottom left */}
      <div className="zyrix-float absolute -bottom-4 -left-3 hidden md:block">
        <div className="zyrix-chip" style={{ borderColor: "rgba(167,139,250,0.35)", color: "#E9D5FF" }}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "#A78BFA" }}
          />
          {t.hero.chips.cfo}
        </div>
      </div>
    </div>
  );
}
