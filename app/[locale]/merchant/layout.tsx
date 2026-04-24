import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import { MerchantShell } from "@/components/merchant/MerchantShell";

export default async function MerchantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return <MerchantShell locale={locale}>{children}</MerchantShell>;
}
