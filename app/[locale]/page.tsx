import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/public/PublicLayout";
import {
  MessageCircle,
  TrendingUp,
  Brain,
  FileText,
  Heart,
  Percent,
  Calculator,
  UserCircle,
  Mic,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Zap,
  Shield,
  Coins,
} from "lucide-react";
import { type Locale, isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.hero" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");

  const isArabic = locale === "ar";

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-lg opacity-40 pointer-events-none" />

        <div className="container-zyrix relative section pt-20 md:pt-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <span className="badge">
                <span className="badge-dot animate-pulse-soft" />
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="mb-6 animate-slide-up text-balance">
              <span className="text-ink-mid">
                {t("hero.title").split(t("hero.titleHighlight"))[0]}
              </span>
              <span className="text-gradient">
                {t("hero.titleHighlight")}
              </span>
              <span className="text-ink-mid">
                {t("hero.title").split(t("hero.titleHighlight"))[1]}
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-ink-light max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up text-pretty"
              style={{ animationDelay: "0.1s" }}
            >
              {t("hero.subtitle")}
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href={`/${locale}/signup`}
                className="btn-cta text-base py-4 px-8 w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                {t("hero.ctaPrimary")}
                <ArrowRight
                  className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`}
                />
              </Link>

              <Link
                href={`/${locale}/demo`}
                className="btn-secondary text-base py-4 px-8 w-full sm:w-auto"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            <div
              className="flex items-center justify-center gap-2 text-sm text-ink-light animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <span>{t("hero.trustIndicator")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section bg-white border-y border-line-soft">
        <div className="container-zyrix">
          <div className="text-center mb-16">
            <h2 className="mb-4">{t("stats.title")}</h2>
            <p className="text-lg text-ink-light max-w-2xl mx-auto">
              {t("stats.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StatCard
              value={t("stats.items.savings.value")}
              label={t("stats.items.savings.label")}
              icon={<Coins className="w-6 h-6" />}
            />
            <StatCard
              value={t("stats.items.setup.value")}
              label={t("stats.items.setup.label")}
              icon={<Zap className="w-6 h-6" />}
            />
            <StatCard
              value={t("stats.items.languages.value")}
              label={t("stats.items.languages.label")}
              icon={<Globe className="w-6 h-6" />}
            />
            <StatCard
              value={t("stats.items.whatsapp.value")}
              label={t("stats.items.whatsapp.label")}
              icon={<MessageCircle className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section bg-gradient-to-b from-bg-base to-bg-card">
        <div className="container-zyrix">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="badge mb-4">
              <Sparkles className="w-3 h-3" />
              {tCommon("new")}
            </span>
            <h2 className="mb-4">{t("features.title")}</h2>
            <p className="text-lg text-ink-light">{t("features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title={t("features.items.whatsapp.title")}
              description={t("features.items.whatsapp.description")}
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title={t("features.items.pipeline.title")}
              description={t("features.items.pipeline.description")}
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title={t("features.items.aiCfo.title")}
              description={t("features.items.aiCfo.description")}
              badge={tCommon("new")}
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title={t("features.items.quotes.title")}
              description={t("features.items.quotes.description")}
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title={t("features.items.loyalty.title")}
              description={t("features.items.loyalty.description")}
            />
            <FeatureCard
              icon={<Percent className="w-6 h-6" />}
              title={t("features.items.commission.title")}
              description={t("features.items.commission.description")}
            />
            <FeatureCard
              icon={<Calculator className="w-6 h-6" />}
              title={t("features.items.taxEngine.title")}
              description={t("features.items.taxEngine.description")}
            />
            <FeatureCard
              icon={<UserCircle className="w-6 h-6" />}
              title={t("features.items.portal.title")}
              description={t("features.items.portal.description")}
            />
            <FeatureCard
              icon={<Mic className="w-6 h-6" />}
              title={t("features.items.voice.title")}
              description={t("features.items.voice.description")}
              badge={tCommon("beta")}
            />
          </div>
        </div>
      </section>

      {/* WHY ZYRIX */}
      <section className="section bg-white">
        <div className="container-zyrix">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="mb-4">{t("whyZyrix.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <WhyCard
              icon={<Globe className="w-7 h-7" />}
              title={t("whyZyrix.items.native.title")}
              description={t("whyZyrix.items.native.description")}
            />
            <WhyCard
              icon={<MessageCircle className="w-7 h-7" />}
              title={t("whyZyrix.items.whatsapp.title")}
              description={t("whyZyrix.items.whatsapp.description")}
            />
            <WhyCard
              icon={<Shield className="w-7 h-7" />}
              title={t("whyZyrix.items.integrated.title")}
              description={t("whyZyrix.items.integrated.description")}
            />
            <WhyCard
              icon={<Coins className="w-7 h-7" />}
              title={t("whyZyrix.items.fairPricing.title")}
              description={t("whyZyrix.items.fairPricing.description")}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-gradient-to-br from-primary-50 via-sky-50 to-cyan-100">
        <div className="container-zyrix">
          <div className="card-gradient max-w-4xl mx-auto text-center py-12 md:py-20 shadow-xl">
            <h2 className="mb-4">{t("cta.title")}</h2>
            <p className="text-lg text-ink-light mb-10 max-w-2xl mx-auto">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/signup`}
                className="btn-cta text-base py-4 px-8 w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5" />
                {t("cta.ctaPrimary")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-secondary text-base py-4 px-8 w-full sm:w-auto"
              >
                {t("cta.ctaSecondary")}
                <ArrowRight
                  className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER is rendered by PublicLayout */}
    </PublicLayout>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center p-6 rounded-2xl bg-bg-card border border-line-soft hover:border-primary-300 hover:shadow-md transition-all duration-300">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-4">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
        {value}
      </div>
      <p className="text-sm text-ink-light leading-relaxed">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="badge text-[10px] py-0.5">{badge}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-ink-mid mb-2">{title}</h3>
      <p className="text-sm text-ink-light leading-relaxed">{description}</p>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-6 rounded-2xl bg-bg-card border border-line-soft hover:border-primary-200 hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-zyrix-accent text-white flex items-center justify-center shadow-md">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-ink-mid mb-2">{title}</h3>
        <p className="text-ink-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
}