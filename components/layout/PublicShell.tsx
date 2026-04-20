import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

// ============================================================================
// PUBLIC SHELL — server component
// ============================================================================
// Shared header + footer for all public marketing pages (Features, About,
// Contact, Privacy, Terms, Demo). Keeps the top-nav link set in a single
// place so we never drift between pages.
// ============================================================================

interface PublicShellProps {
  locale: string;
  children: ReactNode;
  /** If true, the page renders a non-sticky header (default is sticky). */
  flatHeader?: boolean;
}

export async function PublicShell({ locale, children }: PublicShellProps) {
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const isArabic = locale === "ar";

  return (
    <main className="min-h-screen bg-bg-base flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass border-b border-line-soft">
        <nav className="container-zyrix py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group"
            aria-label="Zyrix CRM"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-line-soft group-hover:shadow-md transition-shadow duration-300">
              <Image
                src="/logo.png"
                alt="Zyrix"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-lg font-bold text-ink-mid tracking-tight">
              <span className="text-primary-600">CRM</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}/features`}
              className="text-sm font-medium text-ink-light hover:text-primary-600 transition-colors"
            >
              {tNav("features")}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="text-sm font-medium text-ink-light hover:text-primary-600 transition-colors"
            >
              {tNav("pricing")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium text-ink-light hover:text-primary-600 transition-colors"
            >
              {tNav("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-sm font-medium text-ink-light hover:text-primary-600 transition-colors"
            >
              {tNav("contact")}
            </Link>
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/signin`}
              className="hidden sm:inline-flex text-sm font-semibold text-ink-mid hover:text-primary-700 transition-colors px-4 py-2"
            >
              {tNav("signIn")}
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="btn-cta text-sm py-2.5 px-5"
            >
              {tNav("signUp")}
            </Link>
          </div>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex-1">{children}</div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-line-soft mt-auto">
        <div className="container-zyrix py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white border border-line-soft">
                  <Image
                    src="/logo.png"
                    alt="Zyrix"
                    fill
                    sizes="36px"
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-sm font-bold text-ink-mid">
                  Zyrix <span className="text-primary-600">CRM</span>
                </span>
              </div>
              <p className="text-xs text-ink-light leading-relaxed max-w-xs">
                {isArabic
                  ? "نظام CRM مدمج مع واتساب، مصمم للسوق العربي والتركي."
                  : "WhatsApp-native CRM, built for the Arab world and Türkiye."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
                {isArabic ? "المنتج" : "Product"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href={`/${locale}/features`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {tNav("features")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/pricing`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {tNav("pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/demo`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {isArabic ? "طلب عرض توضيحي" : "Request a demo"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
                {isArabic ? "الشركة" : "Company"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {tNav("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {tNav("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
                {isArabic ? "قانوني" : "Legal"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {isArabic ? "الخصوصية" : "Privacy"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/terms`}
                    className="text-ink-light hover:text-primary-600 transition-colors"
                  >
                    {isArabic ? "الشروط" : "Terms"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-line-soft pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ink-light">
              © 2026 Zyrix. {isArabic ? "صُنع في إسطنبول 🇹🇷" : "Made in Istanbul 🇹🇷"}.
            </p>
            <p className="text-xs text-ink-light">
              {isArabic
                ? "العربية · English · Türkçe"
                : "العربية · English · Türkçe"}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
