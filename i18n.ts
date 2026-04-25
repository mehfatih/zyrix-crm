import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// ============================================================================
// ZYRIX CRM — i18n Configuration
// ============================================================================
// Supported locales: English (default), Arabic (RTL), Turkish
// All user-facing text MUST be available in all 3 languages.
// ============================================================================

export const locales = ["en", "ar", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Locales that use RTL direction
export const rtlLocales: Locale[] = ["ar"];

// Locale display names (for language switcher UI)
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

// Native flags/emoji per locale
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
};

// Locale → full ISO tag (for HTML lang attribute & OG locale)
export const localeToISO: Record<Locale, string> = {
  en: "en-US",
  ar: "ar-SA",
  tr: "tr-TR",
};

// Helper: check if a locale string is valid
export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Helper: get text direction for a given locale
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

// ============================================================================
// REQUEST CONFIG — Called per request to load correct messages
// ============================================================================
export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` typically comes from URL segment [locale]
  let locale = await requestLocale;

  // Validate + fallback
  if (!locale || !isValidLocale(locale)) {
    locale = defaultLocale;
  }

  // Load messages dynamically
  let messages;
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale "${locale}":`, error);
    notFound();
  }

  return {
    locale,
    messages,
    timeZone: "Europe/Istanbul",
    now: new Date(),
    // Default formatting options
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
        medium: {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
        long: {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        },
      },
      number: {
        currency: {
          style: "currency",
          currency: "USD",
        },
        percent: {
          style: "percent",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      },
    },
  };
});