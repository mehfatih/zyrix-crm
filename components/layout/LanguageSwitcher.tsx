"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

// Short codes for display
const LOCALE_CODES: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  tr: "TR",
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Save locale in cookie (middleware will pick it up on next navigation)
    document.cookie = `zyrix_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    // Replace current locale in pathname
    const segments = pathname?.split("/") || [];
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg",
          "bg-white border border-line hover:bg-bg-subtle",
          "text-sm font-semibold text-ink transition-colors disabled:opacity-60 w-full"
        )}
      >
        <span>{LOCALE_CODES[currentLocale]}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-ink-light transition-transform ms-auto",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-28 bg-white border border-line rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors",
                locale === currentLocale
                  ? "bg-primary-50 text-primary-700"
                  : "text-ink hover:bg-bg-subtle"
              )}
            >
              <span>{LOCALE_CODES[locale]}</span>
              {locale === currentLocale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
