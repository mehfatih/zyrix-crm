import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import DemoView from "@/components/public/DemoView";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Demo" });
  return {
    title: `${t("title")} — Zyrix CRM`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/demo`,
      languages: {
        en: "https://crm.zyrix.co/en/demo",
        ar: "https://crm.zyrix.co/ar/demo",
        tr: "https://crm.zyrix.co/tr/demo",
      },
    },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <DemoView locale={locale} />
    </PublicShell>
  );
}
