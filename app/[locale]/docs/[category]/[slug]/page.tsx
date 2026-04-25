import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  Pencil,
} from "lucide-react";
import { isValidLocale } from "@/i18n";
import DocsShell from "@/components/docs/DocsShell";
import DocsArticleNav from "@/components/docs/DocsArticleNav";
import WasThisHelpful from "@/components/docs/WasThisHelpful";
import ArticleViewTracker from "@/components/docs/ArticleViewTracker";
import { getAllDocs, getDoc, getDocsByCategory } from "@/lib/docs/getAllDocs";
import { buildSearchIndex } from "@/lib/docs/buildSearchIndex";
import {
  renderMarkdown,
  extractHeadings,
  addHeadingIds,
} from "@/lib/docs/parseMarkdown";
import {
  CATEGORIES,
  DOCS_COPY,
  getCategoryLabel,
  type CategoryId,
  type DocLocale,
} from "@/lib/docs/constants";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const out: Array<{ locale: string; category: string; slug: string }> = [];
  for (const locale of ["en", "ar", "tr"] as const) {
    const docs = getAllDocs(locale);
    for (const d of docs) {
      out.push({ locale, category: d.category, slug: d.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const doc = getDoc(locale as DocLocale, category, slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.frontmatter.title,
    description: doc.plain.slice(0, 160),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as DocLocale;

  const doc = getDoc(L, category, slug);
  if (!doc) notFound();

  const headings = extractHeadings(doc.body);
  let html = await renderMarkdown(doc.body);
  html = addHeadingIds(html, headings);

  const records = buildSearchIndex(L);
  const all = getAllDocs(L);
  const sidebarArticles = all.map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    category: d.category,
    order: d.frontmatter.order,
    path: d.path,
  }));

  const siblings = getDocsByCategory(L, category);
  const idx = siblings.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const copy = DOCS_COPY[L];

  return (
    <DocsShell
      locale={L}
      articles={sidebarArticles}
      searchRecords={records}
      rightRail={<DocsArticleNav headings={headings} locale={L} />}
    >
      <ArticleViewTracker locale={L} category={category} slug={slug} />

      <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1 flex-wrap">
        <Link href={`/${L}/docs`} className="hover:text-sky-600">
          {copy.title}
        </Link>
        <span>›</span>
        <Link
          href={`/${L}/docs/${category}`}
          className="hover:text-sky-600"
        >
          {getCategoryLabel(category as CategoryId, L)}
        </Link>
        <span>›</span>
        <span className="text-slate-700 font-medium truncate">
          {doc.frontmatter.title}
        </span>
      </nav>

      <article className="docs-article">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            {doc.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
            {doc.frontmatter.readTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {doc.frontmatter.readTime}
              </span>
            )}
            {doc.frontmatter.updatedAt && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {copy.updated}: {doc.frontmatter.updatedAt}
              </span>
            )}
            {doc.frontmatter.plans && doc.frontmatter.plans.length > 0 && (
              <span className="inline-flex items-center gap-1 flex-wrap">
                {doc.frontmatter.plans.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200 rounded-full capitalize"
                  >
                    {p}
                  </span>
                ))}
              </span>
            )}
          </div>
        </header>

        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-sky-50 prose-code:text-sky-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-sky-50 prose-pre:border prose-pre:border-sky-100 prose-pre:text-slate-800 prose-blockquote:border-l-violet-400 prose-blockquote:bg-violet-50 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <WasThisHelpful locale={L} articleSlug={slug} category={category} />

        {/* Edit on GitHub */}
        <div className="mt-2 text-xs text-slate-500">
          <a
            className="inline-flex items-center gap-1 hover:text-sky-600"
            href={`https://github.com/mehfatih/zyrix-crm/edit/main/content/docs/${L}/${doc.path}.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Pencil className="w-3 h-3" />
            {copy.editOnGithub}
          </a>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-10 pt-6 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/${L}/docs/${prev.category}/${prev.slug}`}
                className="group flex items-start gap-3 p-4 rounded-xl border border-sky-100 hover:border-sky-300 bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mt-0.5 text-slate-400 group-hover:text-sky-500 rtl:rotate-180" />
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    {copy.prev}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {prev.frontmatter.title}
                  </div>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${L}/docs/${next.category}/${next.slug}`}
                className="group flex items-start justify-end gap-3 p-4 rounded-xl border border-sky-100 hover:border-sky-300 bg-white transition-colors text-end"
              >
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    {copy.next}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {next.frontmatter.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 mt-0.5 text-slate-400 group-hover:text-sky-500 rtl:rotate-180" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </DocsShell>
  );
}
