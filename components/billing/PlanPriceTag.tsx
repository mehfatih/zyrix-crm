"use client";

import { useTranslations } from "next-intl";
import {
  formatPlanPrice,
  type BillingPeriod,
  type DisplayCurrency,
} from "@/lib/billing/currency";

// ────────────────────────────────────────────────────────────────────
// Sprint 14z — PlanPriceTag
// Reusable price label. Prints the converted price + "/ month"|"/ year"
// suffix in the active locale.
// ────────────────────────────────────────────────────────────────────

interface Props {
  usdAmount: number;
  currency: DisplayCurrency;
  period: BillingPeriod;
  size?: "sm" | "md" | "lg";
  hidePeriodWhenFree?: boolean;
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
}: Props) {
  const t = useTranslations("billing");
  const sz = SIZE_CLASSES[size];
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
