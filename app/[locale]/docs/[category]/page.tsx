import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { isValidLocale } from "@/i18n";
import DocsShell from "@/components/docs/DocsShell";
import { getAllDocs, getDocsByCategory } from "@/lib/docs/getAllDocs";
import { buildSearchIndex } from "@/lib/docs/buildSearchIndex";
import {
  ACCENT_CLASSES,
  CATEGORIES,
  DOCS_COPY,
  getCategoryLabel,
  type CategoryId,
  type DocLocale,
} from "@/lib/docs/constants";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const out: Array<{ locale: string; category: string }> = [];
  for (const locale of ["en", "ar", "tr"]) {
    for (const cat of [...CATEGORIES.map((c) => c.id), "overview"]) {
      out.push({ locale, category: cat });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const copy = DOCS_COPY[(locale as DocLocale) || "en"] || DOCS_COPY.en;
  const label = getCategoryLabel(category as CategoryId, locale as DocLocale);
  return {
    title: `${label} — ${copy.title}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as DocLocale;

  const articles = getDocsByCategory(L, category);
  if (!articles.length) notFound();

  const all = getAllDocs(L);
  const records = buildSearchIndex(L);
  const copy = DOCS_COPY[L];
  const catDef = CATEGORIES.find((c) => c.id === category);
  const accent = catDef ? ACCENT_CLASSES[catDef.accent] : ACCENT_CLASSES.cyan;
  const Icon =
    catDef &&
    ((Icons as unknown as Record<string, typeof Icons.BookOpen>)[catDef.icon] ||
      Icons.BookOpen);

  const sidebarArticles = all.map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    category: d.category,
    order: d.frontmatter.order,
    path: d.path,
  }));

  return (
    <DocsShell locale={L} articles={sidebarArticles} searchRecords={records}>
      <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1 flex-wrap">
        <Link href={`/${L}/docs`} className="hover:text-cyan-700">
          {copy.title}
        </Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">
          {getCategoryLabel(category as CategoryId, L)}
        </span>
      </nav>

      <div className="flex items-start gap-4 mb-8">
        {Icon && (
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${accent.chipBg} ${accent.text} flex-shrink-0`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {getCategoryLabel(category as CategoryId, L)}
          </h1>
          {catDef && (
            <p className="text-slate-600">{catDef.desc[L]}</p>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/${L}/docs/${d.category}/${d.slug}`}
              className={`block bg-white border ${accent.border} rounded-xl p-5 hover:shadow-md ${accent.hoverBorder} transition-all`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-slate-900">
                  {d.frontmatter.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {d.frontmatter.readTime}
                </span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">
                {firstParagraph(d.body)}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-700">
                {locale === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : null}
                {copy.next}
                {locale !== "ar" ? <ArrowRight className="w-3.5 h-3.5" /> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </DocsShell>
  );
}

function firstParagraph(md: string): string {
  const lines = md.split("\n");
  for (const l of lines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith(">")) continue;
    if (trimmed.startsWith("-") || /^\d+\./.test(trimmed)) continue;
    return trimmed.replace(/\*\*/g, "").slice(0, 180);
  }
  return "";
}
