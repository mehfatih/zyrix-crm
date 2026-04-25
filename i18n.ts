import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "ar", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
};

export const localeToISO: Record<Locale, string> = {
  en: "en-US",
  ar: "ar-SA",
  tr: "tr-TR",
};

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  const locale: Locale =
    resolvedLocale && isValidLocale(resolvedLocale)
      ? resolvedLocale
      : defaultLocale;

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