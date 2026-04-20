import CheckoutSuccessView from "@/components/checkout/CheckoutSuccessView";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment successful — Zyrix CRM",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CheckoutSuccessView locale={locale} />;
}
