"use client";

import type { AnalyticsTab } from "@/lib/analytics/tab-catalog";
import { AnalyticsWidgetCard } from "./AnalyticsWidgetCard";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
}

export function AnalyticsWidgetGrid({ tab, locale }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tab.widgets.map((w) => (
        <AnalyticsWidgetCard key={w.id} widget={w} locale={locale} />
      ))}
    </div>
  );
}
