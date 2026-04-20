"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { XCircle } from "lucide-react";

interface Props {
  locale: string;
}

export default function CheckoutCancelView({ locale }: Props) {
  const t = useTranslations("Checkout");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5 ring-4 ring-amber-50">
          <XCircle size={32} className="text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          {t("cancelTitle")}
        </h1>
        <p className="text-sm text-slate-600 mt-2">{t("cancelDetail")}</p>

        <div className="flex gap-2 mt-6">
          <Link
            href={`/${locale}/pricing`}
            className="flex-1 text-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold"
          >
            {t("backToPricing")}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="flex-1 text-center rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 text-sm font-semibold"
          >
            {t("goToDashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}
