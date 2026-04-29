"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { AnalyticsWidget } from "@/lib/analytics/tab-catalog";
import { HEX, WIDGET_TILE, resolveIcon } from "./colors";

interface Props {
  widget: AnalyticsWidget;
  locale: "en" | "ar" | "tr";
}

export function AnalyticsWidgetCard({ widget, locale }: Props) {
  const tile = WIDGET_TILE[widget.color];
  const Icon = resolveIcon(widget.icon);
  const isPositive = widget.trend > 0;
  const isFlat = widget.trend === 0;
  const trendColor = isFlat
    ? "text-muted-foreground"
    : isPositive
      ? "text-emerald-300"
      : "text-rose-300";
  const TrendIcon = isFlat ? null : isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`rounded-xl border ${tile.card} p-4 flex flex-col`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-lg border ${tile.iconBg} ${tile.iconBorder} ${tile.iconText} flex-shrink-0`}
        >
          <Icon className="w-4 h-4" />
        </div>
        {!isFlat && TrendIcon && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(widget.trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {widget.label[locale]}
      </p>
      <p className={`text-2xl font-bold ${tile.value} mb-2`}>{widget.value}</p>
      <div className="h-10 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={widget.sparklineData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={HEX[widget.color]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
