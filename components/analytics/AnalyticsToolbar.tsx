"use client";

import { Mail, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AnalyticsTab } from "@/lib/analytics/tab-catalog";
import { TAB_EYEBROW, resolveIcon } from "./colors";
import { AnalyticsExportMenu } from "./AnalyticsExportMenu";

export type TimeRange = "7d" | "30d" | "90d" | "ytd";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
  timeRange: TimeRange;
  onTimeRangeChange: (r: TimeRange) => void;
  onEmailClick: () => void;
  onRefresh?: () => void;
}

const RANGES: TimeRange[] = ["7d", "30d", "90d", "ytd"];

export function AnalyticsToolbar({
  tab,
  locale,
  timeRange,
  onTimeRangeChange,
  onEmailClick,
  onRefresh,
}: Props) {
  const t = useTranslations("Analytics");
  const Icon = resolveIcon(tab.icon);

  return (
    <div className="flex items-start justify-between gap-3 flex-wrap rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted text-foreground flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p
            className={`${TAB_EYEBROW[tab.color]} text-[11px] font-bold uppercase tracking-widest mb-1`}
          >
            {tab.name[locale]}
          </p>
          <p className="text-foreground text-base font-bold">
            {tab.description[locale]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                timeRange === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`toolbar.timeRange.${r}`)}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          aria-label={t("toolbar.refresh")}
          className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <AnalyticsExportMenu tab={tab} locale={locale} />

        <button
          onClick={onEmailClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/15 border border-violet-500/40 text-violet-200 rounded-lg text-xs font-semibold hover:bg-violet-500/25"
        >
          <Mail className="w-3.5 h-3.5" />
          {t("toolbar.emailReport")}
        </button>
      </div>
    </div>
  );
}
