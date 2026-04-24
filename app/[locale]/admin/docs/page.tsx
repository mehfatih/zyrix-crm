import AdminShell from "@/components/admin/AdminShell";
import ArticleList from "@/components/admin/docs/ArticleList";
import ArticleAnalytics from "@/components/admin/docs/ArticleAnalytics";
import { setRequestLocale } from "next-intl/server";

export default async function AdminDocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Documentation</h1>
          <p className="text-sm text-slate-500">
            Manage knowledge-hub articles, track views and ratings, and mark
            content as recently updated.
          </p>
        </header>

        <ArticleAnalytics />
        <ArticleList locale={locale} />
      </div>
    </AdminShell>
  );
}
