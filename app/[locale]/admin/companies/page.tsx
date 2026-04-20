import AdminShell from "@/components/admin/AdminShell";
import AdminCompaniesView from "@/components/admin/AdminCompaniesView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminCompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminCompaniesView />
    </AdminShell>
  );
}
