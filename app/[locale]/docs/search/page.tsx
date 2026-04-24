import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import DocsShell from "@/components/docs/DocsShell";
import SearchResultsClient from "./SearchResultsClient";
import { getAllDocs } from "@/lib/docs/getAllDocs";
import { buildSearchIndex } from "@/lib/docs/buildSearchIndex";
import { DOCS_COPY, type DocLocale } from "@/lib/docs/constants";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return ["en", "ar", "tr"].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = DOCS_COPY[(locale as DocLocale) || "en"] || DOCS_COPY.en;
  return {
    title: `${copy.searchTitle} — ${copy.title}`,
  };
}

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as DocLocale;
  const records = buildSearchIndex(L);
  const all = getAllDocs(L);
  const sidebarArticles = all.map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    category: d.category,
    order: d.frontmatter.order,
    path: d.path,
  }));

  return (
    <DocsShell locale={L} articles={sidebarArticles} searchRecords={records}>
      <SearchResultsClient locale={L} records={records} />
    </DocsShell>
  );
}
