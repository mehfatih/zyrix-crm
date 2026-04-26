// components/marketing/WhatsAppCore.tsx
// WhatsApp-native storytelling block: linear flow + bullet list.

import React from "react";
import { BackgroundFX } from "./BackgroundFX";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function WhatsAppCore({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden px-5 py-20 text-white md:px-6 md:py-28"
      style={{
        background:
          "radial-gradient(circle at 20% 50%, rgba(45,212,191,0.18), transparent 45%), linear-gradient(180deg, #08111F 0%, #0A1530 100%)",
      }}
    >
      <BackgroundFX variant="subtle" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="zyrix-chip mb-5" style={{ borderColor: "rgba(45,212,191,0.35)", color: "#A7F3D0" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#2DD4BF" }} />
            WhatsApp Native
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {t.whatsapp.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
            {t.whatsapp.subtitle}
          </p>
        </div>

        {/* Flow visualization */}
        <div className="mt-14">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {t.whatsapp.flow.map((step, idx) => (
              <div
                key={step}
                className="zyrix-gradient-border relative overflow-hidden p-5"
              >
                <div className="absolute right-3 top-3 text-xs font-black text-cyan-300/70">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="text-sm font-bold leading-6 text-white">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bullets */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.whatsapp.bullets.map((bullet) => (
            <div
              key={bullet}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-400/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="#34D399"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium leading-6 text-white/85">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
