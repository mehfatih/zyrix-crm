"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ZyrixLogo } from "./ZyrixLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/i18n";

/**
 * Place at: components/experience/Nav.tsx
 *
 * Sticky pill nav. Glass-morphs on scroll.
 */

export const Nav = () => {
  const t = useTranslations("Landing.nav");
  const locale = useLocale() as Locale;
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
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 story-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/signin">{t("signIn")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="btn-glow bg-gradient-cta text-primary-foreground border-0"
            >
              <Link href="/signup">{t("signUp")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
