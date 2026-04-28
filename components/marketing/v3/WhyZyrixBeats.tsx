// components/marketing/v3/WhyZyrixBeats.tsx
import React from "react";
import Link from "next/link";
import { InteractiveGlobe } from "./InteractiveGlobe";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function WhyZyrixBeats({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative px-5 py-20 md:px-8 md:py-28"
      style={{ background: "#DCE7F2" }}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className={`mb-12 text-3xl font-black tracking-tight md:text-4xl ${isRtl ? "text-right" : "text-left"}`} style={{ color: "#0A1530" }}>
          {t.whyBeats.title}
          <br />
          {t.whyBeats.titleAccent}
        </h2>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          {/* LEFT: 4 reason cards in 2x2 grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {t.whyBeats.cards.map((card) => (
              <BeatsCard key={card.title} card={card} />
            ))}
          </div>

          {/* RIGHT: globe + glass overlay panel */}
          <div
            className="relative overflow-hidden rounded-[2rem] p-6 md:p-10"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(124,58,237,0.22), transparent 50%), linear-gradient(135deg, #0A1530 0%, #0E1A3A 60%, #08111F 100%)",
            }}
          >
            {/* Globe */}
            <div className="absolute inset-0 grid place-items-center">
              <InteractiveGlobe />
            </div>

            {/* Glass panel overlay */}
            <div className={`relative ${isRtl ? "ml-auto" : "mr-auto"} max-w-sm rounded-2xl border border-white/15 bg-[#0A1530]/75 p-6 backdrop-blur-xl md:p-7`}>
              <h3 className="text-xl font-black text-white md:text-2xl">
                {t.whyBeats.globe.title}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #67E8F9, #C084FC)",
                  }}
                >
                  {t.whyBeats.globe.titleAccent}
                </span>
              </h3>

              <ul className="mt-5 space-y-3">
                {t.whyBeats.globe.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-emerald-400/20">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm leading-6 text-white/85">{b}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/features`}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                {t.whyBeats.globe.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeatsCard({
  card,
}: {
  card: { icon: string; color: string; title: string; desc: string };
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(15,76,117,0.06)]">
      <div
        className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl"
        style={{ background: `${card.color}1A` }}
      >
        <BeatsIcon name={card.icon} color={card.color} />
      </div>
      <div>
        <h4 className="text-sm font-bold" style={{ color: "#0A1530" }}>
          {card.title}
        </h4>
        <p className="mt-1.5 text-xs leading-5 text-slate-600">{card.desc}</p>
      </div>
    </div>
  );
}

function BeatsIcon({ name, color }: { name: string; color: string }) {
  const map: Record<string, React.JSX.Element> = {
    anchor: <path d="M12 2v6M12 8a3 3 0 100 6 3 3 0 000-6zM12 14v8M5 17a8 8 0 0014 0M5 17H2M19 17h3" stroke={color} strokeWidth="2" strokeLinecap="round" />,
    whatsapp: <path d="M17 4.5C15.5 3 13.5 2 12 2 7 2 3 6 3 11c0 1.5.5 3 1 4l-1 4 4-1c1 .5 2.5 1 4 1 5 0 9-4 9-9 0-1.5-1-3.5-3-5.5z" fill={color} />,
    shield: <path d="M12 2L3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z" stroke={color} strokeWidth="2" />,
    tag: <><path d="M20 12L12 4H4v8l8 8 8-8z" stroke={color} strokeWidth="2" strokeLinejoin="round" /><circle cx="8" cy="8" r="1.5" fill={color} /></>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {map[name] || null}
    </svg>
  );
}
