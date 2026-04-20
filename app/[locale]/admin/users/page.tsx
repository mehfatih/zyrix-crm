import AdminShell from "@/components/admin/AdminShell";
import AdminUsersView from "@/components/admin/AdminUsersView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminUsersView />
    </AdminShell>
  );
}
