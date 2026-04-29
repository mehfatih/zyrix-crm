"use client";

import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { FollowupKPICard } from "./FollowupKPICard";

// ────────────────────────────────────────────────────────────────────
// Sprint 14x — FollowupKPIRow
// 4-up grid wrapper for the colored KPI cards.
// ────────────────────────────────────────────────────────────────────

interface Props {
  totalStale: number;
  critical: number;
  warning: number;
  valueAtRisk: number;
  formatMoney: (n: number) => string;
}

export function FollowupKPIRow({
  totalStale,
  critical,
  warning,
  valueAtRisk,
  formatMoney,
}: Props) {
  const t = useTranslations("Followup");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <FollowupKPICard
        color="cyan"
        icon={Users}
        label={t("stats.totalStale")}
        value={totalStale.toLocaleString()}
      />
      <FollowupKPICard
        color="rose"
        icon={AlertTriangle}
        label={t("stats.critical")}
        value={critical.toLocaleString()}
      />
      <FollowupKPICard
        color="amber"
        icon={Clock}
        label={t("stats.warning")}
        value={warning.toLocaleString()}
      />
      <FollowupKPICard
        color="violet"
        icon={DollarSign}
        label={t("stats.valueAtRisk")}
        value={formatMoney(valueAtRisk)}
      />
    </div>
  );
}
