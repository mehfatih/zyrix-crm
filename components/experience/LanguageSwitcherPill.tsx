"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe, ChevronDown } from "lucide-react";

// ============================================================================
// LANGUAGE SWITCHER PILL (Sprint 14b)
// ----------------------------------------------------------------------------
// Compact dark code-only pill (EN / AR / TR) with globe icon + chevron.
// Used by components/experience/Nav.tsx ONLY. Self-contained — uses
// useLocale() internally, no prop required.
//
// The legacy components/layout/LanguageSwitcher.tsx remains untouched
// for DashboardShell + AuthLayout consumers.
// ============================================================================

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "tr", label: "TR" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export function LanguageSwitcherPill() {
  const locale = useLocale() as LocaleCode;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const switchTo = (newLocale: LocaleCode) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }
    // Persist preference for direct links
    document.cookie = `zyrix_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    const segments = (pathname || `/${locale}`).split("/");
    if (segments[1] && LOCALES.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;

    setIsOpen(false);
    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        aria-label="Change language"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-60"
      >
        <Globe className="h-3.5 w-3.5 opacity-80" strokeWidth={2} />
        <span>{current.label}</span>
        <ChevronDown
          className={`h-3 w-3 opacity-70 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2.5}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-11 min-w-[70px] rounded-lg bg-[#0f1d3d] border border-white/10 p-1 shadow-xl z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => switchTo(l.code)}
              className={`w-full text-center px-3 py-1.5 text-sm rounded-md transition ${
                l.code === locale
                  ? "bg-primary/20 text-white font-medium"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcherPill;
