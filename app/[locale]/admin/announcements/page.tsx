import AdminShell from "@/components/admin/AdminShell";
import AdminAnnouncementsView from "@/components/admin/AdminAnnouncementsView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminAnnouncementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminAnnouncementsView locale={locale} />
    </AdminShell>
  );
}
