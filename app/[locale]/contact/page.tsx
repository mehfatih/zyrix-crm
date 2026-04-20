import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import ContactView from "@/components/public/ContactView";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: `${t("title")} — Zyrix CRM`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/contact`,
      languages: {
        en: "https://crm.zyrix.co/en/contact",
        ar: "https://crm.zyrix.co/ar/contact",
        tr: "https://crm.zyrix.co/tr/contact",
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <ContactView locale={locale} />
    </PublicShell>
  );
}
