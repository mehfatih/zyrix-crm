import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import { ComingSoonPage } from "@/components/merchant/ComingSoonPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  return <ComingSoonPage locale={locale} titleKey="segments" />;
}
