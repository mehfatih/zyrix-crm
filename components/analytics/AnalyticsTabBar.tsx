"use client";

import { X } from "lucide-react";
import {
  ANALYTICS_TAB_CATALOG,
  DEFAULT_TAB_IDS,
  type AnalyticsTabId,
} from "@/lib/analytics/tab-catalog";
import { TAB_ACTIVE_PILL, resolveIcon } from "./colors";
import { AnalyticsAddTabDropdown } from "./AnalyticsAddTabDropdown";

interface Props {
  tabs: AnalyticsTabId[];
  activeTab: AnalyticsTabId;
  availableToAdd: AnalyticsTabId[];
  onSelect: (id: AnalyticsTabId) => void;
  onAdd: (id: AnalyticsTabId) => void;
  onRemove: (id: AnalyticsTabId) => void;
  locale: "en" | "ar" | "tr";
}

export function AnalyticsTabBar({
  tabs,
  activeTab,
  availableToAdd,
  onSelect,
  onAdd,
  onRemove,
  locale,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap">
        {tabs.map((id) => {
          const tab = ANALYTICS_TAB_CATALOG[id];
          const Icon = resolveIcon(tab.icon);
          const isActive = id === activeTab;
          const removable = !DEFAULT_TAB_IDS.includes(id);
          return (
            <div key={id} className="group relative">
              <button
                onClick={() => onSelect(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  isActive
                    ? TAB_ACTIVE_PILL[tab.color]
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                } ${removable ? "pe-7" : ""}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name[locale]}
              </button>
              {removable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                  }}
                  aria-label="remove tab"
                  className="absolute top-1/2 -translate-y-1/2 right-1 w-5 h-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-rose-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="ms-auto">
        <AnalyticsAddTabDropdown
          availableToAdd={availableToAdd}
          onAdd={onAdd}
          locale={locale}
        />
      </div>
    </div>
  );
}
