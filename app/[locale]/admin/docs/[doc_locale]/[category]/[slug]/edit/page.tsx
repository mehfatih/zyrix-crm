import AdminShell from "@/components/admin/AdminShell";
import ArticleEditor from "@/components/admin/docs/ArticleEditor";
import { setRequestLocale } from "next-intl/server";

export default async function AdminDocsEditPage({
  params,
}: {
  params: Promise<{
    locale: string;
    doc_locale: string;
    category: string;
    slug: string;
  }>;
}) {
  const { locale, doc_locale, category, slug } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <ArticleEditor
        adminLocale={locale}
        docLocale={doc_locale}
        category={category}
        slug={slug}
      />
    </AdminShell>
  );
}
