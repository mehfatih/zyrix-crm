// components/marketing/AICommandCenter.tsx
// Full-width AI section with prompt chips and a sample response card.

"use client";

import React, { useState } from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function AICommandCenter({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden px-5 py-20 text-white md:px-6 md:py-28"
      style={{
        background:
          "radial-gradient(circle at 80% 0%, rgba(124,58,237,0.25), transparent 40%), radial-gradient(circle at 10% 100%, rgba(34,211,238,0.18), transparent 45%), linear-gradient(180deg, #0A1530 0%, #112044 60%, #08111F 100%)",
      }}
    >
      <BackgroundFX variant="subtle" />

      {/* Decorative neural lines */}
      <svg
        aria-hidden
        viewBox="0 0 1440 800"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neuralLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 C400,150 600,400 900,300 S1300,250 1440,400"
          fill="none"
          stroke="url(#neuralLine)"
          strokeWidth="1"
        />
        <path
          d="M100,500 C400,600 700,300 1100,500 S1400,600 1440,550"
          fill="none"
          stroke="url(#neuralLine)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT: narrative */}
        <div>
          <div className="zyrix-chip mb-5">
            <span className="zyrix-pulse" />
            AI Native
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {t.ai.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-white/72 md:text-lg">
            {t.ai.subtitle}
          </p>

          {/* Prompt chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {t.ai.prompts.map((prompt) => (
              <span
                key={prompt}
                className="rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white/80 backdrop-blur"
              >
                {prompt}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: console mock */}
        <div className="zyrix-gradient-border overflow-hidden p-3 md:p-4">
          <div className="rounded-[1.25rem] bg-[#050B1A]/95 p-5 md:p-6">
            {/* Tabs */}
            <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1">
              {t.ai.tabs.map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-all md:text-sm ${
                    activeTab === idx
                      ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-[0_4px_16px_rgba(34,211,238,0.30)]"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sample response */}
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-black">
                  AI
                </span>
                <span className="text-sm font-bold text-violet-200">
                  {t.ai.sampleResponse.title}
                </span>
              </div>
              <p className="text-sm leading-6 text-white/80">
                {t.ai.sampleResponse.body}
              </p>
            </div>

            {/* Waveform decoration */}
            <div className="mt-5 flex h-8 items-end gap-1">
              {[8, 14, 22, 16, 28, 12, 20, 26, 18, 10, 24, 14, 8, 18, 22].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-cyan-400/60 to-violet-400/60"
                    style={{ height: `${h}px` }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
