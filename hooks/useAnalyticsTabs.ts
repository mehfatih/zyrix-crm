"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ANALYTICS_TAB_CATALOG,
  DEFAULT_TAB_IDS,
  isAnalyticsTabId,
  type AnalyticsTabId,
} from "@/lib/analytics/tab-catalog";

// ────────────────────────────────────────────────────────────────────
// Sprint 14w — useAnalyticsTabs
// Persists the user's tab list and active tab in localStorage so the
// /analytics page survives reloads. Falls back to DEFAULT_TAB_IDS.
// ────────────────────────────────────────────────────────────────────

const TABS_KEY = "zyrix.analytics.tabs.v1";
const ACTIVE_KEY = "zyrix.analytics.activeTab.v1";

function loadTabs(): AnalyticsTabId[] {
  if (typeof window === "undefined") return DEFAULT_TAB_IDS;
  try {
    const raw = window.localStorage.getItem(TABS_KEY);
    if (!raw) return DEFAULT_TAB_IDS;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_TAB_IDS;
    const valid = parsed.filter(
      (id): id is AnalyticsTabId =>
        typeof id === "string" && isAnalyticsTabId(id),
    );
    if (valid.length === 0) return DEFAULT_TAB_IDS;
    // Always keep defaults at the front so the user can't drop them by
    // hand-editing localStorage.
    const merged = [
      ...DEFAULT_TAB_IDS,
      ...valid.filter((id) => !DEFAULT_TAB_IDS.includes(id)),
    ];
    return Array.from(new Set(merged));
  } catch {
    return DEFAULT_TAB_IDS;
  }
}

function loadActive(tabs: AnalyticsTabId[]): AnalyticsTabId {
  if (typeof window === "undefined") return tabs[0];
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY);
    if (raw && isAnalyticsTabId(raw) && tabs.includes(raw as AnalyticsTabId)) {
      return raw as AnalyticsTabId;
    }
  } catch {
    /* ignore */
  }
  return tabs[0];
}

export interface UseAnalyticsTabsResult {
  tabs: AnalyticsTabId[];
  activeTab: AnalyticsTabId;
  setActiveTab: (id: AnalyticsTabId) => void;
  addTab: (id: AnalyticsTabId) => void;
  removeTab: (id: AnalyticsTabId) => void;
  availableToAdd: AnalyticsTabId[];
}

export function useAnalyticsTabs(): UseAnalyticsTabsResult {
  const [tabs, setTabs] = useState<AnalyticsTabId[]>(DEFAULT_TAB_IDS);
  const [activeTab, setActiveTabState] = useState<AnalyticsTabId>(
    DEFAULT_TAB_IDS[0],
  );

  // Hydrate from localStorage after mount so SSR + client agree.
  useEffect(() => {
    const t = loadTabs();
    setTabs(t);
    setActiveTabState(loadActive(t));
  }, []);

  const persistTabs = useCallback((next: AnalyticsTabId[]) => {
    setTabs(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TABS_KEY, JSON.stringify(next));
    }
  }, []);

  const setActiveTab = useCallback((id: AnalyticsTabId) => {
    setActiveTabState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_KEY, id);
    }
  }, []);

  const addTab = useCallback(
    (id: AnalyticsTabId) => {
      if (tabs.includes(id)) {
        setActiveTab(id);
        return;
      }
      const next = [...tabs, id];
      persistTabs(next);
      setActiveTab(id);
    },
    [tabs, persistTabs, setActiveTab],
  );

  const removeTab = useCallback(
    (id: AnalyticsTabId) => {
      // Defaults can't be removed.
      if (DEFAULT_TAB_IDS.includes(id)) return;
      const next = tabs.filter((t) => t !== id);
      persistTabs(next);
      if (activeTab === id) {
        setActiveTab(next[0] ?? DEFAULT_TAB_IDS[0]);
      }
    },
    [tabs, activeTab, persistTabs, setActiveTab],
  );

  const allIds = Object.keys(ANALYTICS_TAB_CATALOG) as AnalyticsTabId[];
  const availableToAdd = allIds.filter((id) => !tabs.includes(id));

  return { tabs, activeTab, setActiveTab, addTab, removeTab, availableToAdd };
}
