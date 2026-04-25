"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Briefcase,
  CheckSquare,
  MessageCircle,
  Users,
} from "lucide-react";
import { getDirection, type Locale } from "@/i18n";
import { AIRecommendationsStrip } from "@/components/merchant/AIRecommendationsStrip";

export default function MerchantHome({ locale }: { locale: string }) {
  const t = useTranslations("MerchantSidebar");
  const isRTL = getDirection(locale as Locale) === "rtl";

  const cards = [
    {
      href: `/${locale}/merchant/contacts`,
      icon: Users,
      label: t("items.contacts"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      href: `/${locale}/merchant/deals`,
      icon: Briefcase,
      label: t("items.deals"),
      color: "from-sky-400 to-sky-600",
    },
    {
      href: `/${locale}/merchant/tasks`,
      icon: CheckSquare,
      label: t("items.tasks"),
      color: "from-orange-500 to-amber-600",
    },
    {
      href: `/${locale}/merchant/conversations`,
      icon: MessageCircle,
      label: t("items.conversations"),
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div
      className="p-6 md:p-10 max-w-6xl mx-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] tracking-tight mb-2">
        {t("items.home")}
      </h1>
      <p className="text-slate-500 text-sm md:text-base mb-8 max-w-2xl">
        {t("searchPlaceholder")}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative bg-white border border-sky-100 rounded-2xl p-5 hover:border-sky-200 hover:shadow-md transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-3 shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-[#0C4A6E] flex items-center gap-1.5">
                {c.label}
                <ArrowRight
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors ${
                    isRTL ? "rotate-180" : ""
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <AIRecommendationsStrip locale={locale} isRTL={isRTL} />
    </div>
  );
}
