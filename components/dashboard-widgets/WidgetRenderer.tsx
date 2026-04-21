"use client";

import type { DashboardWidget } from "@/lib/api/advanced";
import {
  KpiRowWidget,
  RevenueTrendWidget,
  PipelineSnapshotWidget,
  RecentDealsWidget,
  UpcomingTasksWidget,
  ConnectedStoresWidget,
  CohortSnapshotWidget,
  FunnelSnapshotWidget,
  CustomerCountWidget,
  DealCountWidget,
  WonThisMonthWidget,
  TopCustomersWidget,
  TasksDueTodayWidget,
  UnreadMessagesWidget,
} from "./widgets";

// Single switch from widget.type → component. Unknown types render a
// muted placeholder so an old client that saved a widget type the server
// rejected later doesn't crash the dashboard.
export function WidgetRenderer({
  widget,
  locale,
}: {
  widget: DashboardWidget;
  locale: "en" | "ar" | "tr";
}) {
  switch (widget.type) {
    case "kpi_row":
      return <KpiRowWidget locale={locale} />;
    case "revenue_trend":
      return <RevenueTrendWidget locale={locale} />;
    case "pipeline_snapshot":
      return <PipelineSnapshotWidget locale={locale} />;
    case "recent_deals":
      return <RecentDealsWidget locale={locale} />;
    case "upcoming_tasks":
      return <UpcomingTasksWidget locale={locale} />;
    case "connected_stores":
      return <ConnectedStoresWidget locale={locale} />;
    case "cohort_snapshot":
      return <CohortSnapshotWidget locale={locale} />;
    case "funnel_snapshot":
      return <FunnelSnapshotWidget locale={locale} />;
    case "customer_count":
      return <CustomerCountWidget locale={locale} />;
    case "deal_count":
      return <DealCountWidget locale={locale} />;
    case "won_this_month":
      return <WonThisMonthWidget locale={locale} />;
    case "top_customers":
      return <TopCustomersWidget locale={locale} />;
    case "tasks_due_today":
      return <TasksDueTodayWidget locale={locale} />;
    case "unread_messages":
      return <UnreadMessagesWidget locale={locale} />;
    default:
      return (
        <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center text-xs text-slate-500">
          Unknown widget: {widget.type}
        </div>
      );
  }
}
