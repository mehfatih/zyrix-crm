// components/marketing/v3/NumbersSection.tsx
// Light section with 4 colored stat cards.
import React from "react";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function NumbersSection({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative px-5 py-20 md:px-8 md:py-24"
      style={{
        background:
          "linear-gradient(180deg, #E8EFF7 0%, #DCE7F2 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight md:text-4xl" style={{ color: "#0F4C75" }}>
            {t.numbers.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">{t.numbers.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.numbers.cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white p-7 text-center shadow-[0_8px_24px_rgba(15,76,117,0.08)] transition-transform hover:-translate-y-1"
            >
              <div
                className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl"
                style={{ background: `${card.color}1A` }}
              >
                <NumberIcon name={card.icon} color={card.color} />
              </div>
              <div className="text-4xl font-black md:text-5xl" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-700">{card.label}</div>
              <div className="mt-1 text-xs text-slate-500">{card.subLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NumberIcon({ name, color }: { name: string; color: string }) {
  const map: Record<string, React.JSX.Element> = {
    shield: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 2L3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z" />
      </svg>
    ),
    bolt: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
    globe: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
    chat: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
        <path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1.6 3.6A8 8 0 0121 12z" />
      </svg>
    ),
  };
  return map[name] || null;
}
