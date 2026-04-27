"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ZyrixLogo } from "./ZyrixLogo";

/**
 * Place at: components/experience/Nav.tsx
 *
 * Sticky pill nav. Glass-morphs on scroll.
 */

export const Nav = () => {
  const t = useTranslations("Landing.nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { label: t("product"), href: "#features" },
    { label: t("whyZyrix"), href: "#why" },
    { label: t("customers"), href: "#trust" },
    { label: t("pricing"), href: "#pricing" },
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
          <ZyrixLogo variant="white" size={32} />

          <nav className="hidden md:flex items-center gap-7">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 story-link"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              {t("signIn")}
            </Button>
            <Button
              size="sm"
              className="btn-glow bg-gradient-cta text-primary-foreground border-0"
            >
              {t("bookDemo")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
