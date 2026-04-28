import { setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

export default async function RealEstatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <SolutionPageTemplate namespace="SolutionsRealEstate" accentColor="amber" locale={locale} />
    </PublicShell>
  );
}
