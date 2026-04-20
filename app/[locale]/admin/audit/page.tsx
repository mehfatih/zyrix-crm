import AdminShell from "@/components/admin/AdminShell";
import AdminAuditView from "@/components/admin/AdminAuditView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminAuditView locale={locale} />
    </AdminShell>
  );
}
