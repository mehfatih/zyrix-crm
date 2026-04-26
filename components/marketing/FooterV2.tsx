// components/marketing/FooterV2.tsx
// Premium dark footer: 4 link columns, contact strip, mini-CTA.

import React from "react";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = {
  locale: Locale;
};

export function FooterV2({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";
  const cols = t.footer.columns;

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden border-t border-white/8 px-5 pt-20 text-white md:px-6"
      style={{
        background:
          "radial-gradient(circle at 80% 0%, rgba(34,211,238,0.10), transparent 45%), linear-gradient(180deg, #0A1530 0%, #050B1A 100%)",
      }}
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Mini CTA strip */}
        <div className="zyrix-gradient-border mb-16 flex flex-col items-center justify-between gap-5 overflow-hidden p-7 text-center md:flex-row md:p-9 md:text-start">
          <div>
            <h3 className="text-xl font-bold text-white md:text-2xl">
              {t.footer.miniCta.title}
            </h3>
            <p className="mt-2 text-sm text-white/65">{t.footer.tagline}</p>
          </div>
          <Link
            href={`/${locale}/register`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(34,211,238,0.30)] transition-all hover:-translate-y-0.5"
          >
            {t.footer.miniCta.button}
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-white"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black">
                Z
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Zyrix <span className="text-cyan-300">CRM</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/55">
              {t.footer.tagline}
            </p>
          </div>

          {/* 4 link columns */}
          {[cols.product, cols.company, cols.resources, cols.legal].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-white/70 transition-colors hover:text-cyan-300 cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/8 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              {t.footer.contact.city}
            </span>
            <a
              href={`mailto:${t.footer.contact.email}`}
              className="flex items-center gap-2 transition-colors hover:text-cyan-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M3 7l9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              {t.footer.contact.email}
            </a>
            <a
              href={`https://wa.me/${t.footer.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-emerald-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 4.5C15.5 3 13.5 2 12 2 7 2 3 6 3 11c0 1.5.5 3 1 4l-1 4 4-1c1 .5 2.5 1 4 1 5 0 9-4 9-9 0-1.5-1-3.5-3-5.5zm-5 15c-1 0-2.5-.5-3.5-1l-2.5.5.5-2.5c-.5-1-1-2.5-1-3.5 0-4 3-7 7-7 1.5 0 3 1 4 2 1 1 2 2.5 2 4 0 4-3 7-6.5 7.5z" />
              </svg>
              {t.footer.contact.whatsapp}
            </a>
          </div>
          <div>{t.footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
