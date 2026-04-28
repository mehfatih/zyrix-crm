"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ZyrixLogo } from "./ZyrixLogo";
import { LanguageSwitcherPill } from "./LanguageSwitcherPill";

/**
 * Place at: components/experience/Nav.tsx
 *
 * Sticky pill nav. Glass-morphs on scroll.
 */

export const Nav = () => {
  const t = useTranslations("Landing.nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { label: t("features"), href: "/features" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ease-cinematic ${
            scrolled ? "glass-strong shadow-card" : "bg-transparent"
          }`}
        >
          <ZyrixLogo variant="white" size={40} />

          <nav className="hidden md:flex items-center gap-7">
            {items.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-sm text-white/95 hover:text-white transition-colors duration-300 story-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcherPill />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={`/${locale}/signin`}>{t("signIn")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="btn-glow bg-gradient-cta text-primary-foreground border-0"
            >
              <Link href={`/${locale}/signup`}>{t("signUp")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
