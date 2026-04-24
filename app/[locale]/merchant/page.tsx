import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import MerchantHome from "./MerchantHome";

export default async function MerchantHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return <MerchantHome locale={locale} />;
}
