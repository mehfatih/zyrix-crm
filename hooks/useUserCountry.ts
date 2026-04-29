"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { COUNTRIES, type CountryCode } from "@/lib/country";
import { getCountryFromLocale } from "@/lib/locale-tax";

// ────────────────────────────────────────────────────────────────────
// Sprint 14t — useUserCountry
// Returns the user's effective country with a 3-tier resolver:
//   1. localStorage override (set by the user via the Tax preset dropdown)
//   2. (Future) IP geo from Vercel Edge — single point to wire later
//   3. Locale fallback — en→US, ar→SA, tr→TR (see lib/locale-tax.ts)
// ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "zyrix.userCountry";

interface UseUserCountryResult {
  country: CountryCode;
  config: (typeof COUNTRIES)[CountryCode];
  setCountry: (next: CountryCode) => void;
}

export function useUserCountry(): UseUserCountryResult {
  const locale = useLocale();
  const localeDefault = getCountryFromLocale(locale);
  const [country, setCountryState] = useState<CountryCode>(localeDefault);

  // Read localStorage on mount + sync if locale changes (without an
  // explicit override the user keeps the locale-default behaviour).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in COUNTRIES) {
      setCountryState(stored as CountryCode);
    } else {
      setCountryState(localeDefault);
    }
  }, [localeDefault]);

  function setCountry(next: CountryCode) {
    setCountryState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  return {
    country,
    config: COUNTRIES[country],
    setCountry,
  };
}
