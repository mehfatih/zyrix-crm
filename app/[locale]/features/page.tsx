import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
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
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 pt-16 md:pt-24 pb-12 text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("eyebrow")}
          </span>
          <h1 className="mb-6 text-balance">
            <span className="text-foreground">{t("hero.titlePrefix")}</span>{" "}
            <span className="text-gradient">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Quick nav pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
              >
                {c.icon}
                {t(`categories.${c.id}.title`)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS STRIP */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl py-8">
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
          className={idx % 2 === 0 ? "bg-background" : "bg-card"}
        >
          <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
            <div className="max-w-2xl mb-10">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 ${
                  cat.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : cat.color === "sky"
                      ? "bg-cyan-500/10 text-cyan-300"
                      : cat.color === "cyan"
                        ? "bg-cyan-500/10 text-cyan-300"
                        : cat.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-violet-500/10 text-violet-300"
                }`}
              >
                {cat.icon}
                {t(`categories.${cat.id}.title`)}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t(`categories.${cat.id}.heading`)}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
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
      <section className="bg-gradient-to-br from-primary to-cyan-500 text-white">
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24 text-center">
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
      <section className="bg-background">
        <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("comparison.title")}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t("comparison.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-3 text-sm">
              <div className="p-4 bg-muted font-bold text-foreground text-xs uppercase tracking-wider">
                {t("comparison.feature")}
              </div>
              <div className="p-4 bg-muted font-bold text-muted-foreground text-xs uppercase tracking-wider text-center border-s border-border">
                {t("comparison.generic")}
              </div>
              <div className="p-4 bg-gradient-to-br from-primary to-cyan-500 text-white font-bold text-xs uppercase tracking-wider text-center">
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-card border border-border rounded-xl max-w-4xl mx-auto text-center py-12 md:py-16 shadow-xl px-6">
            <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">{t("cta.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="text-base py-3.5 px-8 w-full sm:w-auto">
                <Link href={`/${locale}/signup`}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("cta.primary")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base py-3.5 px-8 w-full sm:w-auto">
                <Link href={`/${locale}/pricing`}>
                  {t("cta.secondary")}
                  <ArrowRight
                    className={`w-4 h-4 ml-2 ${isArabic ? "rotate-180" : ""}`}
                  />
                </Link>
              </Button>
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
    <div className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
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
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
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
      <div className="p-4 border-t border-border text-foreground font-medium">
        {label}
      </div>
      <div className="p-4 border-t border-border border-s text-center text-muted-foreground text-sm">
        {generic}
      </div>
      <div className="p-4 border-t border-border text-center bg-primary/15 text-primary font-semibold text-sm">
        {zyrix}
      </div>
    </>
  );
}
