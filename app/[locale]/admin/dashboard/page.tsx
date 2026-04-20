import AdminShell from "@/components/admin/AdminShell";
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminDashboardView />
    </AdminShell>
  );
}
