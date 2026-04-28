// components/marketing/v3/FeaturesGrid.tsx
// 12-box features grid with title block on the left and grid on the right.
// Dark section with rounded outer container.

import React from "react";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function FeaturesGrid({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative px-5 py-16 md:px-8 md:py-20"
      style={{ background: "#DCE7F2" }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="overflow-hidden rounded-[2rem] p-6 md:p-10 lg:p-14"
          style={{
            background:
              "radial-gradient(circle at 80% 0%, rgba(124,58,237,0.18), transparent 50%), linear-gradient(135deg, #0A1530 0%, #0E1A3A 50%, #08111F 100%)",
          }}
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr]">
            {/* LEFT: title block */}
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="zyrix-chip mb-5">
                <span className="zyrix-pulse" />
                {t.features.tag}
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                {t.features.title}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #67E8F9, #C084FC)",
                  }}
                >
                  {t.features.titleAccent}
                </span>
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/65 md:text-base">
                {t.features.subtitle}
              </p>
              <Link
                href={`/${locale}/features`}
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                {t.features.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={isRtl ? "rotate-180" : ""}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* RIGHT: 12-box grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {t.features.items.map((item, idx) => (
                <FeatureCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  item,
}: {
  item: {
    icon: string;
    color: string;
    name: string;
    desc: string;
    badge: string | null;
  };
}) {
  return (
    <div className="relative rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-all hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.07]">
      {item.badge && (
        <span
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
          style={{
            background: `${item.color}1F`,
            color: item.color,
            border: `1px solid ${item.color}40`,
          }}
        >
          {item.badge}
        </span>
      )}

      <div
        className="mb-3 grid h-9 w-9 place-items-center rounded-lg"
        style={{ background: `${item.color}1A` }}
      >
        <FeatureIcon name={item.icon} color={item.color} />
      </div>
      <div className="text-sm font-bold leading-snug text-white">{item.name}</div>
      <p className="mt-1 text-[11px] leading-5 text-white/55">{item.desc}</p>
    </div>
  );
}

function FeatureIcon({ name, color }: { name: string; color: string }) {
  const map: Record<string, React.JSX.Element> = {
    inbox: <path d="M3 13l2-8h14l2 8M3 13v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 13h5l2 3h4l2-3h5" stroke={color} strokeWidth="1.8" />,
    pipeline: <><rect x="3" y="5" width="5" height="14" rx="1" stroke={color} strokeWidth="1.8" /><rect x="10" y="5" width="5" height="10" rx="1" stroke={color} strokeWidth="1.8" /><rect x="17" y="5" width="4" height="6" rx="1" stroke={color} strokeWidth="1.8" /></>,
    cfo: <><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" /><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></>,
    quote: <><rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="1.8" /><path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
    heart: <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 5.5-7 10-7 10z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />,
    stack: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />,
    tax: <><rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.8" /><path d="M9 9l6 6M9 15l6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
    portal: <><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" /><path d="M4 21v-1a8 8 0 0116 0v1" stroke={color} strokeWidth="1.8" /></>,
    mic: <><rect x="9" y="2" width="6" height="13" rx="3" stroke={color} strokeWidth="1.8" /><path d="M5 11a7 7 0 0014 0M12 18v3" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
    agents: <><circle cx="12" cy="9" r="3" stroke={color} strokeWidth="1.8" /><path d="M5 21a7 7 0 0114 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><circle cx="6" cy="6" r="1.5" fill={color} /><circle cx="18" cy="6" r="1.5" fill={color} /></>,
    plug: <path d="M9 7V3M15 7V3M9 7h6v4a4 4 0 01-4 4h-2a4 4 0 01-4-4V7h4zM12 15v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />,
    store: <path d="M3 8l1-4h16l1 4M3 8h18M3 8v12a1 1 0 001 1h16a1 1 0 001-1V8M9 21v-7h6v7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {map[name] || null}
    </svg>
  );
}
