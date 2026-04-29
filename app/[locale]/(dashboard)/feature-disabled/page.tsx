"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { UpgradeCard } from "@/components/upgrade/UpgradeCard";
import { getFeatureDef } from "@/lib/features/feature-catalog";

// ============================================================================
// FEATURE DISABLED PAGE — sprint 14y
// ----------------------------------------------------------------------------
// Reads ?feature= and renders a feature-aware UpgradeCard. Falls back
// to a generic def for unknown / missing feature ids.
// ============================================================================

export default function FeatureDisabledPageWrapper() {
  return (
    <Suspense fallback={null}>
      <FeatureDisabledPage />
    </Suspense>
  );
}

function FeatureDisabledPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const search = useSearchParams();
  const feature = search?.get("feature") ?? "";

  const featureDef = getFeatureDef(feature);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6" dir={isRtl ? "rtl" : "ltr"}>
        <UpgradeCard feature={featureDef} locale={locale} variant="centered" />
      </div>
    </DashboardShell>
  );
}
