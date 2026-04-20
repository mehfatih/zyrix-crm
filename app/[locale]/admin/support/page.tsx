import AdminShell from "@/components/admin/AdminShell";
import AdminSupportView from "@/components/admin/AdminSupportView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminSupportView locale={locale} />
    </AdminShell>
  );
}
