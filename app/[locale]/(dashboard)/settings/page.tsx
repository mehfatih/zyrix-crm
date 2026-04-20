import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Settings" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Settings" });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-light mt-1">{t("subtitle")}</p>
      </div>
      <SettingsTabs locale={locale} />
    </div>
  );
}
