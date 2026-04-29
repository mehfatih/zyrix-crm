import { Suspense } from "react";
import AdminResetPasswordForm from "@/components/admin/AdminResetPasswordForm";
import { setRequestLocale } from "next-intl/server";

export default async function AdminResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="min-h-screen bg-muted" />}>
      <AdminResetPasswordForm locale={locale} />
    </Suspense>
  );
}
