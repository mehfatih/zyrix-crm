import { setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <SolutionPageTemplate namespace="SolutionsSales" accentColor="primary" locale={locale} />
    </PublicShell>
  );
}
