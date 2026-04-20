import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { setRequestLocale } from "next-intl/server";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminLoginForm locale={locale} />;
}
