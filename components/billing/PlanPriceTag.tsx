"use client";

import { useTranslations } from "next-intl";
import {
  formatPlanPrice,
  type BillingPeriod,
  type DisplayCurrency,
} from "@/lib/billing/currency";

// ────────────────────────────────────────────────────────────────────
// Sprint 14z / 14aa — PlanPriceTag
// Reusable price label. Prints the converted price + "/ month"|"/ year"
// suffix in the active locale. Sprint 14aa added null-price support
// (contact-sales tiers) — falls back to customLabel or "—".
// ────────────────────────────────────────────────────────────────────

interface Props {
  usdAmount: number | null;
  currency: DisplayCurrency;
  period: BillingPeriod;
  size?: "sm" | "md" | "lg";
  hidePeriodWhenFree?: boolean;
  /** Label to render when usdAmount is null (e.g. "Custom"). Default: "—". */
  customLabel?: string;
}

const SIZE_CLASSES: Record<NonNullable<Props["size"]>, { value: string; period: string }> = {
  sm: { value: "text-base font-bold", period: "text-xs" },
  md: { value: "text-xl font-bold", period: "text-xs" },
  lg: { value: "text-3xl font-bold", period: "text-sm" },
};

export function PlanPriceTag({
  usdAmount,
  currency,
  period,
  size = "md",
  hidePeriodWhenFree = true,
  customLabel,
}: Props) {
  const t = useTranslations("billing");
  const sz = SIZE_CLASSES[size];

  if (usdAmount === null) {
    return (
      <span className={`${sz.value} text-foreground`}>
        {customLabel ?? "—"}
      </span>
    );
  }

  const isFree = usdAmount === 0;

  if (isFree) {
    return (
      <span className={`${sz.value} text-foreground tabular-nums`} dir="ltr">
        {t("free")}
      </span>
    );
  }

  const priceText = formatPlanPrice(usdAmount, currency);
  const periodSuffix =
    period === "yearly" ? t("perYear") : t("perMonth");

  return (
    <span className="inline-flex items-baseline gap-1">
      <span className={`${sz.value} text-foreground tabular-nums`} dir="ltr">
        {priceText}
      </span>
      {!(hidePeriodWhenFree && isFree) && (
        <span className={`${sz.period} text-muted-foreground`}>
          {periodSuffix}
        </span>
      )}
    </span>
  );
}
