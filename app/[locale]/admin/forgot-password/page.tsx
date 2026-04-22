import AdminForgotPasswordForm from "@/components/admin/AdminForgotPasswordForm";
import { setRequestLocale } from "next-intl/server";

export default async function AdminForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminForgotPasswordForm locale={locale} />;
}
