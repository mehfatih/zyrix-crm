import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import DocsShell from "@/components/docs/DocsShell";
import {
  renderMarkdown,
  extractHeadings,
  addHeadingIds,
} from "@/lib/docs/parseMarkdown";
import DocsArticleNav from "@/components/docs/DocsArticleNav";
import { getAllDocs, getDocByPath } from "@/lib/docs/getAllDocs";
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
  return { title: `${copy.faq} — ${copy.title}` };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as DocLocale;
  const copy = DOCS_COPY[L];
  const doc = getDocByPath(L, "faq");
  if (!doc) notFound();
  const headings = extractHeadings(doc.body);
  let html = await renderMarkdown(doc.body);
  html = addHeadingIds(html, headings);

  const all = getAllDocs(L);
  const sidebar = all.map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    category: d.category,
    order: d.frontmatter.order,
    path: d.path,
  }));
  const records = buildSearchIndex(L);

  return (
    <DocsShell
      locale={L}
      articles={sidebar}
      searchRecords={records}
      rightRail={<DocsArticleNav headings={headings} locale={L} />}
    >
      <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1 flex-wrap">
        <Link href={`/${L}/docs`} className="hover:text-sky-600">
          {copy.title}
        </Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{copy.faq}</span>
      </nav>
      <article>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          {doc.frontmatter.title}
        </h1>
        <div
          className="prose prose-slate max-w-none prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </DocsShell>
  );
}
