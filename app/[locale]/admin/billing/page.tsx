import AdminShell from "@/components/admin/AdminShell";
import AdminBillingView from "@/components/admin/AdminBillingView";
import { setRequestLocale } from "next-intl/server";

export default async function AdminBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <AdminBillingView locale={locale} />
    </AdminShell>
  );
}
