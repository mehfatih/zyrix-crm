import AdminShell from "@/components/admin/AdminShell";
import AdminPlansView from "@/components/admin/AdminPlansView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminPlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminPlansView locale={locale} />
    </AdminShell>
  );
}
