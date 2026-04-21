"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldOff, ArrowLeft, Mail } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// FEATURE DISABLED PAGE
// ----------------------------------------------------------------------------
// Landing when the axios interceptor catches a 403 FEATURE_DISABLED from
// the backend. Friendly copy explains the situation + gives the merchant
// a way forward (contact support) without blaming them or showing a
// stack trace.
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
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const search = useSearchParams();
  const feature = search?.get("feature") ?? "";

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-xl mx-auto"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 text-white flex items-center justify-center mx-auto mb-4 shadow">
            <ShieldOff className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-cyan-900 mb-2">
            {tr(
              "Feature not available",
              "الميزة غير متاحة",
              "Özellik kullanılamıyor"
            )}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {tr(
              "This feature isn't enabled for your account yet. If you'd like access, reach out to Zyrix support and we'll turn it on for you.",
              "هذه الميزة غير مفعَّلة لحسابك حاليًا. إن كنت ترغب في الحصول عليها، تواصل مع دعم Zyrix وسنقوم بتفعيلها لك.",
              "Bu özellik hesabınız için henüz etkin değil. Erişim talep etmek için Zyrix destek ekibine ulaşın, sizin için açalım."
            )}
          </p>
          {feature && (
            <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 mb-6 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
                {tr("Feature", "الميزة", "Özellik")}
              </div>
              <code
                className="text-sm font-mono text-cyan-900 font-semibold"
                dir="ltr"
              >
                {feature}
              </code>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-semibold"
            >
              <ArrowLeft
                className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
              {tr("Back to dashboard", "العودة للوحة", "Panele dön")}
            </Link>
            <a
              href="mailto:support@zyrix.co"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold"
            >
              <Mail className="w-4 h-4" />
              {tr("Contact support", "تواصل مع الدعم", "Destek ile iletişim")}
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
