import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.signUp" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Auth.signUp" });

  return (
    <AuthLayout
      locale={locale}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <SignupForm locale={locale} />
    </AuthLayout>
  );
}