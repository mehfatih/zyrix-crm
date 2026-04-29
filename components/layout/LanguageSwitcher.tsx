"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Sidebar");
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
      {/* Sprint 14ad — cyan glass utility trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "group flex items-center justify-between gap-2 w-full px-3 py-2.5 rounded-lg",
          "bg-cyan-500/10 hover:bg-cyan-500/15",
          "border border-cyan-500/25 hover:border-cyan-500/40",
          "transition-colors disabled:opacity-60",
        )}
      >
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-cyan-300 flex-shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {t("language")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase text-cyan-300 tabular-nums">
            {LOCALE_CODES[currentLocale]}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-cyan-300 transition-transform",
              isOpen
                ? "rotate-180"
                : "group-hover:translate-y-0.5",
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors",
                locale === currentLocale
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-foreground hover:bg-muted",
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
