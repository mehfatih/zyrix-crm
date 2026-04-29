"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BarChart3, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAnalyticsTabs } from "@/hooks/useAnalyticsTabs";
import { ANALYTICS_TAB_CATALOG } from "@/lib/analytics/tab-catalog";
import { AnalyticsTabBar } from "@/components/analytics/AnalyticsTabBar";
import { AnalyticsToolbar, type TimeRange } from "@/components/analytics/AnalyticsToolbar";
import { AnalyticsWidgetGrid } from "@/components/analytics/AnalyticsWidgetGrid";
import { AnalyticsPivotChart } from "@/components/analytics/AnalyticsPivotChart";
import { AnalyticsDataViz } from "@/components/analytics/AnalyticsDataViz";
import { AnalyticsEmailModal } from "@/components/analytics/AnalyticsEmailModal";

// ============================================================================
// Sprint 14w — Analytics page rebuild
// 13-tab Power BI-style dashboard. 4 default tabs + 9 addable.
// Each tab: 4 colored widgets, pivot chart, data viz workspace,
// toolbar with time-range, export, and email-report.
// ============================================================================

export default function AnalyticsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale ?? "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const t = useTranslations("Analytics");

  const { tabs, activeTab, setActiveTab, addTab, removeTab, availableToAdd } =
    useAnalyticsTabs();

  const [emailOpen, setEmailOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const tab = ANALYTICS_TAB_CATALOG[activeTab];

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-7xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
                {t("eyebrow")}
              </p>
              <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p>
            </div>
          </div>
          <Link
            href={`/${locale}/analytics/scheduled`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
          >
            <Mail className="w-3.5 h-3.5" />
            {t("scheduledReports")}
          </Link>
        </div>

        {/* Tab bar */}
        <AnalyticsTabBar
          tabs={tabs}
          activeTab={activeTab}
          availableToAdd={availableToAdd}
          onSelect={setActiveTab}
          onAdd={addTab}
          onRemove={removeTab}
          locale={locale}
        />

        {/* Toolbar */}
        <AnalyticsToolbar
          tab={tab}
          locale={locale}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onEmailClick={() => setEmailOpen(true)}
        />

        {/* Widgets */}
        <AnalyticsWidgetGrid tab={tab} locale={locale} />

        {/* Pivot */}
        <AnalyticsPivotChart tab={tab} locale={locale} />

        {/* Data Viz workspace */}
        <AnalyticsDataViz tab={tab} locale={locale} />

        {/* Email modal */}
        {emailOpen && (
          <AnalyticsEmailModal
            tab={tab}
            locale={locale}
            onClose={() => setEmailOpen(false)}
          />
        )}
      </div>
    </DashboardShell>
  );
}
