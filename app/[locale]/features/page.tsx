import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Brain,
  FileText,
  Heart,
  Percent,
  Calculator,
  UserCircle,
  Target,
  CheckSquare,
  Bell,
  BarChart3,
  Mail,
  Sparkles,
  Globe,
  Coins,
  Zap,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Features" });
  return {
    title: `${t("title")} — Zyrix CRM`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/features`,
      languages: {
        en: "https://crm.zyrix.co/en/features",
        ar: "https://crm.zyrix.co/ar/features",
        tr: "https://crm.zyrix.co/tr/features",
      },
    },
  };
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Features" });
  const isArabic = locale === "ar";

  // Feature categories — each card maps to a real capability in the platform
  const categories = [
    {
      id: "communication",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "primary",
      features: [
        {
          icon: <MessageCircle className="w-5 h-5" />,
          badge: "beta",
          k: "whatsapp",
        },
        { icon: <Mail className="w-5 h-5" />, k: "email" },
        { icon: <Bell className="w-5 h-5" />, k: "followup" },
      ],
    },
    {
      id: "sales",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "sky",
      features: [
        { icon: <Users className="w-5 h-5" />, k: "customers" },
        { icon: <Target className="w-5 h-5" />, k: "pipeline" },
        { icon: <FileText className="w-5 h-5" />, k: "quotes" },
        { icon: <Percent className="w-5 h-5" />, k: "commission" },
      ],
    },
    {
      id: "ai",
      icon: <Brain className="w-6 h-6" />,
      color: "cyan",
      features: [
        { icon: <Brain className="w-5 h-5" />, k: "cfo" },
        { icon: <Sparkles className="w-5 h-5" />, k: "dialects" },
        { icon: <BarChart3 className="w-5 h-5" />, k: "insights" },
      ],
    },
    {
      id: "finance",
      icon: <Calculator className="w-6 h-6" />,
      color: "emerald",
      features: [
        { icon: <Calculator className="w-5 h-5" />, k: "tax" },
        { icon: <Coins className="w-5 h-5" />, k: "cashflow" },
        { icon: <BarChart3 className="w-5 h-5" />, k: "multicurrency" },
      ],
    },
    {
      id: "productivity",
      icon: <CheckSquare className="w-6 h-6" />,
      color: "violet",
      features: [
        { icon: <CheckSquare className="w-5 h-5" />, k: "tasks" },
        { icon: <Heart className="w-5 h-5" />, k: "loyalty" },
        { icon: <UserCircle className="w-5 h-5" />, k: "portal" },
      ],
    },
  ] as const;

  return (
    <PublicShell locale={locale}>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-zyrix section pt-16 md:pt-24 pb-12 text-center relative">
          <span className="badge inline-flex mb-6">
            <span className="badge-dot animate-pulse-soft" />
            {t("eyebrow")}
          </span>
          <h1 className="mb-6 text-balance">
            <span className="text-ink-mid">{t("hero.titlePrefix")}</span>{" "}
            <span className="text-gradient">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-light max-w-3xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Quick nav pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-line px-4 py-2 text-sm font-medium text-ink-mid hover:border-primary-400 hover:text-primary-700 transition-colors shadow-sm"
              >
                {c.icon}
                {t(`categories.${c.id}.title`)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS STRIP */}
      <section className="bg-white border-y border-line-soft">
        <div className="container-zyrix py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ValueProp
              icon={<Globe className="w-5 h-5" />}
              title={t("values.trilingual.title")}
              body={t("values.trilingual.body")}
            />
            <ValueProp
              icon={<Zap className="w-5 h-5" />}
              title={t("values.whatsappNative.title")}
              body={t("values.whatsappNative.body")}
            />
            <ValueProp
              icon={<Coins className="w-5 h-5" />}
              title={t("values.perCompany.title")}
              body={t("values.perCompany.body")}
            />
            <ValueProp
              icon={<Shield className="w-5 h-5" />}
              title={t("values.dataSovereignty.title")}
              body={t("values.dataSovereignty.body")}
            />
          </div>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      {categories.map((cat, idx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={idx % 2 === 0 ? "bg-bg-base" : "bg-white"}
        >
          <div className="container-zyrix section">
            <div className="max-w-2xl mb-10">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 ${
                  cat.color === "primary"
                    ? "bg-primary-50 text-primary-700"
                    : cat.color === "sky"
                      ? "bg-sky-50 text-sky-700"
                      : cat.color === "cyan"
                        ? "bg-cyan-50 text-cyan-700"
                        : cat.color === "emerald"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-violet-50 text-violet-700"
                }`}
              >
                {cat.icon}
                {t(`categories.${cat.id}.title`)}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-3">
                {t(`categories.${cat.id}.heading`)}
              </h2>
              <p className="text-base text-ink-light leading-relaxed">
                {t(`categories.${cat.id}.subtitle`)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.features.map((f) => {
                const k = f.k as string;
                const hasBadge = "badge" in f && f.badge;
                return (
                  <FeatureCard
                    key={k}
                    icon={f.icon}
                    title={t(`items.${k}.title`)}
                    body={t(`items.${k}.body`)}
                    badge={hasBadge ? t(`items.${k}.badge`) : undefined}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* LANGUAGE & AI BAND */}
      <section className="bg-gradient-to-br from-primary-600 to-cyan-600 text-white">
        <div className="container-zyrix section text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("aiBand.title")}
          </h2>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            {t("aiBand.body")}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <LangStat value="العربية" label={t("aiBand.langs.ar")} />
            <LangStat value="English" label={t("aiBand.langs.en")} />
            <LangStat value="Türkçe" label={t("aiBand.langs.tr")} />
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-bg-base">
        <div className="container-zyrix section">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-3">
              {t("comparison.title")}
            </h2>
            <p className="text-base text-ink-light max-w-2xl mx-auto">
              {t("comparison.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-line-soft bg-white shadow-sm">
            <div className="grid grid-cols-3 text-sm">
              <div className="p-4 bg-bg-subtle font-bold text-ink-mid text-xs uppercase tracking-wider">
                {t("comparison.feature")}
              </div>
              <div className="p-4 bg-bg-subtle font-bold text-ink-light text-xs uppercase tracking-wider text-center border-s border-line-soft">
                {t("comparison.generic")}
              </div>
              <div className="p-4 bg-gradient-to-br from-primary-600 to-cyan-600 text-white font-bold text-xs uppercase tracking-wider text-center">
                Zyrix
              </div>

              {[
                "arabic",
                "whatsapp",
                "localPayments",
                "pricing",
                "vat",
                "support",
              ].map((k) => (
                <ComparisonRow
                  key={k}
                  label={t(`comparison.rows.${k}.label`)}
                  generic={t(`comparison.rows.${k}.generic`)}
                  zyrix={t(`comparison.rows.${k}.zyrix`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-gradient-to-br from-primary-50 via-sky-50 to-cyan-100">
        <div className="container-zyrix">
          <div className="card-gradient max-w-4xl mx-auto text-center py-12 md:py-16 shadow-xl">
            <Clock className="w-10 h-10 text-primary-600 mx-auto mb-4" />
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
                href={`/${locale}/pricing`}
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

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  body,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <div className="group rounded-2xl bg-white border border-line-soft p-6 hover:border-primary-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="badge text-[10px] py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-ink-mid mb-2">{title}</h3>
      <p className="text-sm text-ink-light leading-relaxed">{body}</p>
    </div>
  );
}

function ValueProp({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-ink-mid mb-0.5">{title}</h4>
        <p className="text-xs text-ink-light leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function LangStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold mb-1">{value}</div>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}

function ComparisonRow({
  label,
  generic,
  zyrix,
}: {
  label: string;
  generic: string;
  zyrix: string;
}) {
  return (
    <>
      <div className="p-4 border-t border-line-soft text-ink-mid font-medium">
        {label}
      </div>
      <div className="p-4 border-t border-line-soft border-s text-center text-ink-light text-sm">
        {generic}
      </div>
      <div className="p-4 border-t border-line-soft text-center bg-primary-50/30 text-primary-800 font-semibold text-sm">
        {zyrix}
      </div>
    </>
  );
}
