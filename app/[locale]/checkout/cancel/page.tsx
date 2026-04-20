import CheckoutCancelView from "@/components/checkout/CheckoutCancelView";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment cancelled — Zyrix CRM",
  robots: { index: false, follow: false },
};

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CheckoutCancelView locale={locale} />;
}
