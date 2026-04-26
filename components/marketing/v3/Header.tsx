// components/marketing/v3/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const t = getCopy(locale);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { key: "product", label: t.nav.product, hasMenu: true },
    { key: "solutions", label: t.nav.solutions, hasMenu: true },
    { key: "pricing", label: t.nav.pricing, hasMenu: false, href: `/${locale}/pricing` },
    { key: "resources", label: t.nav.resources, hasMenu: true },
    { key: "company", label: t.nav.company, hasMenu: true },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#0A1530]/85 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "border-b border-white/5 bg-[#0A1530]/70"
        } backdrop-blur-xl`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center"
            aria-label="Zyrix CRM home"
          >
            <Image
              src="/zyrix-crm-logo.png"
              alt="Zyrix CRM"
              width={120}
              height={40}
              priority
              className="h-9 w-auto md:h-10"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) =>
              item.hasMenu ? (
                <button
                  key={item.key}
                  type="button"
                  className="flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-cyan-300"
                  onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                >
                  {item.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <Link
                  key={item.key}
                  href={item.href!}
                  className="text-sm font-semibold text-white transition-colors hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 md:gap-3">
            <LangSwitch currentLocale={locale} />

            <Link
              href={`/${locale}/signin`}
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-white transition-colors hover:text-cyan-300 md:inline-block"
            >
              {t.cta.signIn}
            </Link>

            <Link
              href={`/${locale}/register`}
              className="hidden rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_24px_rgba(34,211,238,0.30)] transition-all hover:-translate-y-0.5 md:inline-block"
            >
              {t.cta.startFree}
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 text-white lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-[#0A1530]/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[#0A1530] p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Image
                src="/zyrix-crm-logo.png"
                alt="Zyrix CRM"
                width={120}
                height={40}
                className="h-9 w-auto"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href || `/${locale}`}
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-white/5 hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6">
              <Link
                href={`/${locale}/signin`}
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white"
              >
                {t.cta.signIn}
              </Link>
              <Link
                href={`/${locale}/register`}
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-center text-sm font-bold text-white shadow-[0_8px_24px_rgba(34,211,238,0.30)]"
              >
                {t.cta.startFree}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LangSwitch({ currentLocale }: { currentLocale: Locale }) {
  const locales: Locale[] = ["en", "ar", "tr"];
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-white/10"
      >
        {currentLocale}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[120px] overflow-hidden rounded-xl border border-white/15 bg-[#0A1530]/95 shadow-2xl backdrop-blur-xl">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={`/${loc}`}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                loc === currentLocale
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-white hover:bg-white/5 hover:text-cyan-300"
              }`}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
