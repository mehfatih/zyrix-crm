import { setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <SolutionPageTemplate namespace="SolutionsAgencies" accentColor="violet" locale={locale} />
    </PublicShell>
  );
}
