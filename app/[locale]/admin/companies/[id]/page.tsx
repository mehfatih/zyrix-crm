import AdminShell from "@/components/admin/AdminShell";
import AdminCompanyDetailsView from "@/components/admin/AdminCompanyDetailsView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminCompanyDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminCompanyDetailsView companyId={id} locale={locale} />
    </AdminShell>
  );
}
