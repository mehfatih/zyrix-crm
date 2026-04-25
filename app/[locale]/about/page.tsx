import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  Sparkles,
  Compass,
  Heart,
  Users,
  Globe2,
  ArrowRight,
  MapPin,
  Target,
  Zap,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: `${t("title")} — Zyrix CRM`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/about`,
      languages: {
        en: "https://crm.zyrix.co/en/about",
        ar: "https://crm.zyrix.co/ar/about",
        tr: "https://crm.zyrix.co/tr/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const isArabic = locale === "ar";

  return (
    <PublicShell locale={locale}>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-zyrix section pt-16 md:pt-24 pb-10 text-center relative">
          <span className="badge inline-flex mb-6">
            <span className="badge-dot animate-pulse-soft" />
            {t("eyebrow")}
          </span>
          <h1 className="mb-6 text-balance">
            <span className="text-ink-mid">{t("title")}</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-light max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-white">
        <div className="container-zyrix section">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                {t("story.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-4">
                {t("story.heading")}
              </h2>
              <div className="inline-flex items-center gap-2 text-sm text-ink-light">
                <MapPin className="w-4 h-4 text-primary-600" />
                {t("story.location")}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-5 text-ink-light leading-relaxed text-base md:text-lg">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p>{t("story.p3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="bg-bg-base">
        <div className="container-zyrix section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white border border-line-soft p-8 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-mid mb-3">
                {t("mission.title")}
              </h3>
              <p className="text-base text-ink-light leading-relaxed">
                {t("mission.body")}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-sky-50 to-sky-50 border border-primary-100 p-8 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-primary-600 mb-5 shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-mid mb-3">
                {t("vision.title")}
              </h3>
              <p className="text-base text-ink-light leading-relaxed">
                {t("vision.body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white">
        <div className="container-zyrix section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
              {t("values.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-3">
              {t("values.heading")}
            </h2>
            <p className="text-base text-ink-light">{t("values.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            <ValueCard
              icon={<Heart className="w-6 h-6" />}
              title={t("values.items.customerFirst.title")}
              body={t("values.items.customerFirst.body")}
            />
            <ValueCard
              icon={<Globe2 className="w-6 h-6" />}
              title={t("values.items.region.title")}
              body={t("values.items.region.body")}
            />
            <ValueCard
              icon={<Zap className="w-6 h-6" />}
              title={t("values.items.ship.title")}
              body={t("values.items.ship.body")}
            />
            <ValueCard
              icon={<Users className="w-6 h-6" />}
              title={t("values.items.transparent.title")}
              body={t("values.items.transparent.body")}
            />
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bg-bg-base">
        <div className="container-zyrix section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatCard value="3" label={t("stats.languages")} />
            <StatCard value="5+" label={t("stats.countries")} />
            <StatCard value="100%" label={t("stats.arabicSupport")} />
            <StatCard value="GMT+3" label={t("stats.timezone")} />
          </div>
        </div>
      </section>

      {/* TEAM / LEADERSHIP */}
      <section className="bg-white">
        <div className="container-zyrix section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                {t("team.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-3">
                {t("team.heading")}
              </h2>
              <p className="text-base text-ink-light max-w-2xl mx-auto">
                {t("team.subtitle")}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-sky-50 to-sky-50 border border-primary-100 p-8 md:p-10 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-primary-600 mb-5 shadow-md ring-4 ring-white">
                <span className="text-2xl font-bold">MF</span>
              </div>
              <h3 className="text-xl font-bold text-ink-mid mb-1">
                Mehmet Fatih
              </h3>
              <p className="text-sm font-semibold text-primary-600 mb-4">
                {t("team.founderRole")}
              </p>
              <p className="text-base text-ink-light leading-relaxed max-w-xl mx-auto">
                {t("team.founderBio")}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-ink-light">
                <MapPin className="w-3.5 h-3.5 text-primary-600" />
                Istanbul, Türkiye
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-gradient-to-br from-primary-50 via-sky-50 to-sky-100">
        <div className="container-zyrix">
          <div className="card-gradient max-w-4xl mx-auto text-center py-12 md:py-16 shadow-xl">
            <Sparkles className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h2 className="mb-4">{t("cta.title")}</h2>
            <p className="text-lg text-ink-light mb-8 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${locale}/signup`}
                className="btn-cta text-base py-3.5 px-8 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                {t("cta.primary")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-secondary text-base py-3.5 px-8 w-full sm:w-auto"
              >
                {t("cta.secondary")}
                <ArrowRight
                  className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-line-soft p-6 hover:border-primary-200 hover:shadow-md transition-all duration-300">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 mb-4">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-ink-mid mb-2">{title}</h4>
      <p className="text-sm text-ink-light leading-relaxed">{body}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-white border border-line-soft">
      <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
        {value}
      </div>
      <p className="text-sm text-ink-light">{label}</p>
    </div>
  );
}
