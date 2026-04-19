import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SigninForm } from "@/components/auth/SigninForm";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.signIn" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SigninPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Auth.signIn" });

  return (
    <AuthLayout
      locale={locale}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <SigninForm locale={locale} />
    </AuthLayout>
  );
}