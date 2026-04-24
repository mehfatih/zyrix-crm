"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { getDirection, type Locale } from "@/i18n";

export default function NotificationsAllView({ locale }: { locale: string }) {
  const t = useTranslations("MerchantNotifications");
  const placeholderT = useTranslations("MerchantPlaceholder");
  const isRTL = getDirection(locale as Locale) === "rtl";
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const ArrowAfter = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
        <Link
          href={`/${locale}/merchant`}
          className="hover:text-cyan-700 transition-colors"
        >
          {placeholderT("breadcrumbHome")}
        </Link>
        <ArrowAfter className="w-3 h-3 text-slate-300" />
        <span className="text-slate-700 font-medium">{t("title")}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] tracking-tight mb-8">
        {t("title")}
      </h1>

      <div className="relative bg-white rounded-2xl border border-sky-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-white to-sky-50/40 pointer-events-none" />
        <div className="relative p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-5">
            <Bell className="w-7 h-7" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0C4A6E] mb-2">
            {placeholderT("comingSoon")}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            {placeholderT("comingSoonBody")}
          </p>
          <Link
            href={`/${locale}/merchant`}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            {placeholderT("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
