import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordClient } from "@/components/auth/forgot-password/ForgotPasswordClient";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your Zyrix CRM account.",
};

export default async function ForgotPasswordPage({
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
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a reset link."
    >
      <ForgotPasswordClient locale={locale} />
    </AuthLayout>
  );
}
