import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordClient } from "@/components/auth/reset-password/ResetPasswordClient";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.resetPassword" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Auth.resetPassword" });

  return (
    <AuthLayout
      locale={locale}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ResetPasswordClient locale={locale} />
    </AuthLayout>
  );
}
