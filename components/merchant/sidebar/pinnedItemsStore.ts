"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "zyrix_merchant_pinned_items";
const DEFAULT_PINS = ["home", "tasks", "deals"];

function readStorage(): string[] {
  if (typeof window === "undefined") return DEFAULT_PINS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed;
    }
    return DEFAULT_PINS;
  } catch {
    return DEFAULT_PINS;
  }
}

function writeStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* quota exceeded or unavailable — ignore */
  }
}

export function usePinnedItems() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_PINS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPinnedIds(readStorage());
    setHydrated(true);
  }, []);

  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeStorage(next);
      return next;
    });
  }, []);

  const isPinned = useCallback(
    (id: string) => pinnedIds.includes(id),
    [pinnedIds]
  );

  return { pinnedIds, togglePin, isPinned, hydrated };
}
