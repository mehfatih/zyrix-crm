"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n";

interface LanguagePillsProps {
  current: string;
  collapsed: boolean;
}

const PILL_LABELS: Record<Locale, string> = {
  en: "En",
  ar: "Ar",
  tr: "Tr",
};

export function LanguagePills({ current, collapsed }: LanguagePillsProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const switchTo = (lang: Locale) => {
    if (lang === current) return;
    // Replace the leading locale segment
    const parts = pathname.split("/");
    if (parts.length >= 2 && (locales as readonly string[]).includes(parts[1])) {
      parts[1] = lang;
    } else {
      parts.splice(1, 0, lang);
    }
    router.push(parts.join("/") || `/${lang}`);
  };

  if (collapsed) {
    // Just show a single pill that cycles to next language
    const idx = (locales as readonly string[]).indexOf(current);
    const next = locales[(idx + 1) % locales.length];
    return (
      <button
        type="button"
        onClick={() => switchTo(next)}
        className="w-10 h-7 mx-auto flex items-center justify-center rounded-md border border-border text-cyan-300 text-[11px] font-bold uppercase hover:bg-muted"
        title={`Switch to ${next}`}
      >
        {PILL_LABELS[current as Locale] || current}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            className={`flex-1 h-7 text-[11px] font-bold uppercase rounded-md border transition-colors ${
              active
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-card text-cyan-300 border-border hover:bg-muted"
            }`}
          >
            {PILL_LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
