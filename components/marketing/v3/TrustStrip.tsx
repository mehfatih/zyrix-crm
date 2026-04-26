// components/marketing/v3/TrustStrip.tsx
// Light strip below hero with company logos as typography.
import React from "react";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function TrustStrip({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative px-5 py-12 md:px-8 md:py-16"
      style={{ background: "linear-gradient(180deg, #F1F5FB 0%, #E8EFF7 100%)" }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <div className="mb-6 text-xs font-semibold tracking-wider text-slate-500">
          {t.trust.title}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
          {t.trust.logos.map((name, idx) => (
            <LogoTypo key={name} name={name} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoTypo({ name, idx }: { name: string; idx: number }) {
  // Different typographic style per logo for visual variety
  const styles = [
    { className: "font-serif italic font-bold text-slate-700", letterSpacing: "0.01em" },
    { className: "font-black uppercase text-slate-700", letterSpacing: "0.05em" },
    { className: "font-bold uppercase text-slate-700", letterSpacing: "0.08em" },
    { className: "font-semibold uppercase tracking-[0.3em] text-slate-700", letterSpacing: "0.3em" },
    { className: "font-bold uppercase italic text-slate-700", letterSpacing: "0.05em" },
    { className: "font-black uppercase text-slate-700", letterSpacing: "0.02em" },
    { className: "font-semibold text-slate-700", letterSpacing: "-0.02em" },
  ];
  const s = styles[idx % styles.length];

  return (
    <span
      className={`text-base md:text-lg ${s.className} opacity-70 transition-opacity hover:opacity-100`}
      style={{ letterSpacing: s.letterSpacing }}
    >
      {name === "iStage" ? (
        <>
          <span className="text-cyan-600">i</span>Stage
        </>
      ) : name === "HASEEB" ? (
        <span className="font-serif italic">Haseeb</span>
      ) : (
        name
      )}
    </span>
  );
}
