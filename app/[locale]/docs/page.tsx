import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  PlayCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { isValidLocale } from "@/i18n";
import CategoryCard from "@/components/docs/CategoryCard";
import DocsShell from "@/components/docs/DocsShell";
import { getAllDocs } from "@/lib/docs/getAllDocs";
import { buildSearchIndex } from "@/lib/docs/buildSearchIndex";
import { CATEGORIES, DOCS_COPY, type DocLocale } from "@/lib/docs/constants";

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
    title: copy.title,
    description: copy.heroSubtitle,
  };
}

export default async function DocsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as DocLocale;
  const copy = DOCS_COPY[L];
  const all = getAllDocs(L);
  const records = buildSearchIndex(L);

  const popular = all
    .filter((d) =>
      ["quotes-proposals", "ai-cfo", "whatsapp", "commission-engine", "tax-invoices", "loyalty-program"].includes(
        d.slug
      )
    )
    .slice(0, 6);
  const gettingStarted = all
    .filter((d) =>
      ["getting-started", "the-zyrix-difference", "onboarding-wizard", "introduction"].includes(
        d.slug
      )
    )
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);

  const sidebarArticles = all.map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    category: d.category,
    order: d.frontmatter.order,
    path: d.path,
  }));

  return (
    <DocsShell locale={L} articles={sidebarArticles} searchRecords={records}>
      {/* Hero */}
      <section className="text-center mb-12 lg:mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-200 rounded-full mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          {copy.title}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          {copy.heroTitle}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
          {copy.heroSubtitle}
        </p>
        <div className="max-w-xl mx-auto">
          <HeroSearchCue locale={L} />
        </div>
      </section>

      {/* Category grid */}
      <section className="mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              locale={L}
              category={cat}
              articleCountLabel={copy.articlesLabel}
            />
          ))}
        </div>
      </section>

      {/* Popular + Getting Started rows */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
        <div className="bg-white border border-sky-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            {copy.popular}
          </h2>
          <ul className="space-y-2">
            {popular.map((d) => (
              <li key={`${d.category}/${d.slug}`}>
                <Link
                  href={`/${L}/docs/${d.category}/${d.slug}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-sky-50 text-sm text-slate-700 hover:text-sky-600"
                >
                  <span className="truncate">{d.frontmatter.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 rtl:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-sky-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-emerald-500" />
            {copy.gettingStarted}
          </h2>
          <ul className="space-y-2">
            {gettingStarted.map((d) => (
              <li key={`${d.category}/${d.slug}`}>
                <Link
                  href={`/${L}/docs/${d.category}/${d.slug}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-sm text-slate-700 hover:text-emerald-700"
                >
                  <span className="truncate">{d.frontmatter.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 rtl:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Video placeholder */}
      <section className="mb-14">
        <div className="bg-gradient-to-br from-sky-50 via-sky-50 to-white border border-sky-100 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <PlayCircle className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {copy.videoTutorials}
            </h3>
            <p className="text-sm text-slate-600">
              {copy.videoSoon}.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-sky-50 via-sky-50 to-indigo-50 rounded-2xl p-8 border border-sky-100 text-center">
          <MessageCircle className="w-8 h-8 text-sky-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {copy.questions}
          </h3>
          <Link
            href={`/${L}/contact`}
            className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {copy.contactSupport}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </DocsShell>
  );
}

function HeroSearchCue({ locale }: { locale: DocLocale }) {
  const copy = DOCS_COPY[locale];
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-sky-200 rounded-xl shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="flex-1 text-sm text-slate-500">
        {copy.searchPlaceholder}
      </span>
      <kbd className="text-[11px] font-semibold text-slate-500 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5">
        ⌘K
      </kbd>
    </div>
  );
}
