import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyEmailClient } from "@/components/auth/verify-email/VerifyEmailClient";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Confirm your email address to activate your Zyrix CRM account.",
};

export default async function VerifyEmailPage({
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
      title="Verify your email"
      subtitle="We are confirming your email address..."
    >
      <VerifyEmailClient locale={locale} />
    </AuthLayout>
  );
}
