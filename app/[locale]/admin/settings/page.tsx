import AdminShell from "@/components/admin/AdminShell";
import AdminSettingsView from "@/components/admin/AdminSettingsView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminSettingsView locale={locale} />
    </AdminShell>
  );
}
