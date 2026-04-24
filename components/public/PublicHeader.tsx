"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

// ============================================================================
// PUBLIC HEADER — professional, scroll-aware, with compact language switcher
// Used on: home, features, pricing, about, contact, demo, privacy, terms
// ============================================================================

interface PublicHeaderProps {
  accentColor?:
    | "cyan"
    | "sky"
    | "teal"
    | "indigo"
    | "emerald"
    | "violet"
    | "slate";
}

const NAV_LABELS: Record<string, { features: string; pricing: string; about: string; demo: string; contact: string; signIn: string; signUp: string }> = {
  en: {
    features: "Features",
    pricing: "Pricing",
    about: "About",
    demo: "Demo",
    contact: "Contact",
    signIn: "Sign in",
    signUp: "Start free",
  },
  ar: {
    features: "المميزات",
    pricing: "الأسعار",
    about: "من نحن",
    demo: "تجربة",
    contact: "تواصل معنا",
    signIn: "تسجيل الدخول",
    signUp: "ابدأ مجاناً",
  },
  tr: {
    features: "Özellikler",
    pricing: "Fiyatlandırma",
    about: "Hakkımızda",
    demo: "Demo",
    contact: "İletişim",
    signIn: "Giriş",
    signUp: "Ücretsiz başla",
  },
};

export default function PublicHeader({ accentColor = "cyan" }: PublicHeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "en";
  const labels = NAV_LABELS[locale] || NAV_LABELS.en;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accentClasses: Record<
    string,
    {
      text: string;
      bg: string;
      ring: string;
      headerBg: string;
      headerBgScrolled: string;
      border: string;
      underline: string;
    }
  > = {
    cyan: {
      text: "text-cyan-700",
      bg: "bg-cyan-600 hover:bg-cyan-700",
      ring: "ring-cyan-200",
      headerBg: "bg-cyan-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-cyan-50/95 backdrop-blur-lg shadow-sm",
      border: "border-cyan-200/60",
      underline: "bg-cyan-500",
    },
    sky: {
      text: "text-sky-700",
      bg: "bg-sky-600 hover:bg-sky-700",
      ring: "ring-sky-200",
      headerBg: "bg-sky-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-sky-50/95 backdrop-blur-lg shadow-sm",
      border: "border-sky-200/60",
      underline: "bg-sky-500",
    },
    teal: {
      text: "text-teal-700",
      bg: "bg-teal-600 hover:bg-teal-700",
      ring: "ring-teal-200",
      headerBg: "bg-teal-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-teal-50/95 backdrop-blur-lg shadow-sm",
      border: "border-teal-200/60",
      underline: "bg-teal-500",
    },
    indigo: {
      text: "text-indigo-700",
      bg: "bg-indigo-600 hover:bg-indigo-700",
      ring: "ring-indigo-200",
      headerBg: "bg-indigo-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-indigo-50/95 backdrop-blur-lg shadow-sm",
      border: "border-indigo-200/60",
      underline: "bg-indigo-500",
    },
    emerald: {
      text: "text-emerald-700",
      bg: "bg-emerald-600 hover:bg-emerald-700",
      ring: "ring-emerald-200",
      headerBg: "bg-emerald-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-emerald-50/95 backdrop-blur-lg shadow-sm",
      border: "border-emerald-200/60",
      underline: "bg-emerald-500",
    },
    violet: {
      text: "text-violet-700",
      bg: "bg-violet-600 hover:bg-violet-700",
      ring: "ring-violet-200",
      headerBg: "bg-violet-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-violet-50/95 backdrop-blur-lg shadow-sm",
      border: "border-violet-200/60",
      underline: "bg-violet-500",
    },
    slate: {
      text: "text-slate-700",
      bg: "bg-slate-800 hover:bg-slate-900",
      ring: "ring-slate-200",
      headerBg: "bg-slate-50/60 backdrop-blur-sm",
      headerBgScrolled: "bg-slate-50/95 backdrop-blur-lg shadow-sm",
      border: "border-slate-200/60",
      underline: "bg-slate-500",
    },
  };
  const accent = accentClasses[accentColor];

  const navLinks = [
    { href: `/${locale}/features`, label: labels.features },
    { href: `/${locale}/pricing`, label: labels.pricing },
    { href: `/${locale}/about`, label: labels.about },
    { href: `/${locale}/demo`, label: labels.demo },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? `${accent.headerBgScrolled} ${accent.border}`
          : `${accent.headerBg} border-transparent`
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="Zyrix CRM"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500 to-sky-600 shadow-sm group-hover:shadow-md transition-all duration-300">
            <Image
              src="/logo.png"
              alt="Zyrix"
              fill
              sizes="36px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Zyrix
            </span>
            <span className={`text-[10px] font-semibold tracking-wider ${accent.text} uppercase`}>
              CRM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? `${accent.text} bg-slate-50`
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className={`absolute bottom-0 ltr:left-3 rtl:right-3 ltr:right-3 rtl:left-3 h-0.5 ${accent.underline} rounded-full`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Lang + CTAs */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Circular language switcher — matches mobile app design */}
          <LanguageSwitcher />

          {/* Sign in link (hidden on smallest screens) */}
          <Link
            href={`/${locale}/signin`}
            className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            {labels.signIn}
          </Link>

          {/* CTA */}
          <Link
            href={`/${locale}/signup`}
            className={`hidden sm:inline-flex items-center px-4 py-2 ${accent.bg} text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all`}
          >
            {labels.signUp}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg ${
                    active
                      ? `${accent.text} bg-slate-50`
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-2">
              <Link
                href={`/${locale}/signin`}
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                {labels.signIn}
              </Link>
              <Link
                href={`/${locale}/signup`}
                onClick={() => setMobileOpen(false)}
                className={`flex-1 text-center px-3 py-2 ${accent.bg} text-white text-sm font-semibold rounded-lg`}
              >
                {labels.signUp}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
