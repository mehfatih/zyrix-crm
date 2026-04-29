"use client";

import { useCallback, useEffect, useState } from "react";
import { useUserCountry } from "@/hooks/useUserCountry";
import {
  COUNTRY_TO_CURRENCY,
  isDisplayCurrency,
  type DisplayCurrency,
} from "@/lib/billing/currency";

// ────────────────────────────────────────────────────────────────────
// Sprint 14z — useDisplayCurrency
// Resolver order:
//   1. localStorage override (key: zyrix.billing.currency.v1)
//   2. useUserCountry() country → COUNTRY_TO_CURRENCY mapping
//   3. USD fallback
// ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "zyrix.billing.currency.v1";

export interface UseDisplayCurrencyResult {
  currency: DisplayCurrency;
  setCurrency: (next: DisplayCurrency) => void;
  clearOverride: () => void;
  autoDetected: DisplayCurrency;
  isOverridden: boolean;
}

export function useDisplayCurrency(): UseDisplayCurrencyResult {
  const { country } = useUserCountry();
  const autoDetected = COUNTRY_TO_CURRENCY[country] ?? "USD";

  const [override, setOverride] = useState<DisplayCurrency | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isDisplayCurrency(stored)) {
      setOverride(stored);
    }
  }, []);

  const setCurrency = useCallback((next: DisplayCurrency) => {
    setOverride(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const clearOverride = useCallback(() => {
    setOverride(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const currency: DisplayCurrency = override ?? autoDetected;

  return {
    currency,
    setCurrency,
    clearOverride,
    autoDetected,
    isOverridden: override !== null,
  };
}
