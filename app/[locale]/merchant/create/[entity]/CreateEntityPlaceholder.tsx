"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { getDirection, type Locale } from "@/i18n";
import { QUICK_ADD_ENTITIES } from "@/components/merchant/quickAddEntities";

interface CreateEntityPlaceholderProps {
  locale: string;
  entityId: string;
  labelKey: string;
  target: string;
  accent: string;
}

export function CreateEntityPlaceholder({
  locale,
  entityId,
  labelKey,
  target,
  accent,
}: CreateEntityPlaceholderProps) {
  const t = useTranslations("QuickAdd");
  const isRTL = getDirection(locale as Locale) === "rtl";
  const entity = QUICK_ADD_ENTITIES.find((e) => e.id === entityId);

  const entityLabel = t(`entities.${labelKey}`);
  const Icon = entity?.icon ?? Sparkles;

  return (
    <div
      className="p-6 md:p-10 max-w-3xl mx-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${accent}, #22D3EE)` }}
        />
        <div className="p-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: hexToRgba(accent, 0.18) }}
          >
            <Icon className="w-7 h-7" style={{ color: accent }} />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0C4A6E] mb-2">
            {t("createTitle", { entity: entityLabel })}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-lg">
            {t("createSubtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/merchant/${target}`}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-sm transition-colors"
            >
              {t("gotoSection", { entity: entityLabel })}
              <ArrowRight
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
              />
            </Link>
            <Link
              href={`/${locale}/merchant`}
              className="inline-flex items-center h-10 px-4 rounded-xl text-cyan-300 text-sm font-semibold hover:bg-muted transition-colors"
            >
              {t("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
