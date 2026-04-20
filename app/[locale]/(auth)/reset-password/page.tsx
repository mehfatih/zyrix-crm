import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordClient } from "@/components/auth/reset-password/ResetPasswordClient";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your Zyrix CRM account.",
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <AuthLayout
      locale={locale}
      title="Set new password"
      subtitle="Your new password must be at least 8 characters."
    >
      <ResetPasswordClient locale={locale} />
    </AuthLayout>
  );
}
