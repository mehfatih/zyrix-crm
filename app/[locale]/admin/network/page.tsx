import AdminShell from "@/components/admin/AdminShell";
import AdminNetworkView from "@/components/admin/AdminNetworkView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminNetworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminNetworkView locale={locale} />
    </AdminShell>
  );
}
