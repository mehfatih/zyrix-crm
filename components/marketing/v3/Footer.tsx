// components/marketing/v3/Footer.tsx
// Premium dark footer: 5 link columns + brand block + contact strip + social.
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

const GOLD = "#D4AF37";
const PURE_BLUE = "#1A56DB";

export function Footer({ locale }: Props) {
  const t = getCopy(locale);
  const isRtl = locale === "ar";
  const cols = t.footer.columns;

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden border-t border-white/8 px-5 pt-16 text-white md:px-8"
      style={{
        background:
          "radial-gradient(circle at 80% 0%, rgba(34,211,238,0.10), transparent 45%), linear-gradient(180deg, #0A1530 0%, #050B1A 100%)",
      }}
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Top: brand + 5 columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center"
              aria-label="Zyrix CRM home"
            >
              <Image
                src="/zyrix-crm-logo.png"
                alt="Zyrix CRM"
                width={140}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-6 text-white/55">
              {t.footer.tagline}
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { name: "linkedin", url: "https://linkedin.com" },
                { name: "x", url: "https://x.com" },
                { name: "facebook", url: "https://facebook.com" },
                { name: "instagram", url: "https://instagram.com" },
                { name: "youtube", url: "https://youtube.com" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-cyan-300/40 hover:text-cyan-300"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* 5 link columns */}
          {[cols.product, cols.solutions, cols.resources, cols.company, cols.legal].map((col) => (
            <div key={col.title}>
              <h4
                className="mb-4 text-sm font-extrabold uppercase tracking-wider"
                style={{ color: GOLD }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <span
                      className="text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
                      style={{ color: PURE_BLUE }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            <ContactItem
              icon="map"
              label={t.footer.headquarters}
              value={t.footer.headquartersValue}
            />
            <ContactItem
              icon="mail"
              label={t.footer.emailLabel}
              value={t.footer.emailValue}
              href={`mailto:${t.footer.emailValue}`}
            />
            <ContactItem
              icon="whatsapp"
              label={t.footer.whatsappLabel}
              value={t.footer.whatsappValue}
              href={`https://wa.me/${t.footer.whatsappValue.replace(/\D/g, "")}`}
            />
          </div>
          <div className="text-xs text-white/55">{t.footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-white/5">
        <ContactIcon name={icon} />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-colors hover:text-cyan-300">
        {Inner}
      </a>
    );
  }
  return Inner;
}

function ContactIcon({ name }: { name: string }) {
  if (name === "map")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8">
        <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#34D399">
      <path d="M17 4.5C15.5 3 13.5 2 12 2 7 2 3 6 3 11c0 1.5.5 3 1 4l-1 4 4-1c1 .5 2.5 1 4 1 5 0 9-4 9-9 0-1.5-1-3.5-3-5.5z" />
    </svg>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.JSX.Element> = {
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8 18H5V9h3v9zM6.5 7.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM18 18h-3v-4.5c0-1-.5-2-1.75-2-1.25 0-1.75 1-1.75 2V18h-3V9h3v1.5c.5-.75 1.5-1.5 3-1.5 2.25 0 3.5 1.5 3.5 4V18z" />
      </svg>
    ),
    x: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h3l-7.5 8.5L22 22h-6l-5-6.5L5 22H2l8-9L2 2h6l4.5 6 5.5-6z" />
      </svg>
    ),
    facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 10-11.5 9.9V15h-2.5v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 3h-2.3v6.9A10 10 0 0022 12z" />
      </svg>
    ),
    instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
    youtube: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12s0-3-.4-4.5c-.2-.8-.9-1.5-1.7-1.7C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12 2 12s0 3 .4 4.5c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.5.4-4.5.4-4.5zM10 15V9l5.2 3-5.2 3z" />
      </svg>
    ),
  };
  return icons[name] || null;
}
