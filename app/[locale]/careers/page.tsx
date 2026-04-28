import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import {
  ArrowRight,
  MapPin,
  Heart,
  Users,
  Globe,
  Zap,
  Coffee,
  Brain,
  Sparkles,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const VALUES = [
  { icon: Heart, key: "values.customer" },
  { icon: Users, key: "values.team" },
  { icon: Globe, key: "values.regional" },
  { icon: Zap, key: "values.ship" },
  { icon: Brain, key: "values.learn" },
  { icon: Coffee, key: "values.balance" },
];

const PERKS = [
  { key: "perks.equity" },
  { key: "perks.remote" },
  { key: "perks.health" },
  { key: "perks.learning" },
  { key: "perks.equipment" },
  { key: "perks.timeoff" },
];

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  return (
    <PublicShell locale={locale}>
      <div>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl py-20 md:py-28 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {t("location")}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {t("mission.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("mission.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("mission.body")}</p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("values.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("values.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-card border border-border p-6 hover:border-primary/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`${v.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${v.key}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("perks.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("perks.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {PERKS.map((p, i) => (
                <div key={i} className="rounded-xl bg-card border border-border p-5">
                  <h3 className="font-bold text-foreground mb-2">{t(`${p.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${p.key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open positions */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("positions.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("positions.title")}
              </h2>
              <p className="text-base text-muted-foreground">{t("positions.subtitle")}</p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-10 text-center">
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">
                {t("positions.openTitle")}
              </h3>
              <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
                {t("positions.openBody")}
              </p>
              <Button asChild>
                <a href="mailto:careers@zyrix.co">careers@zyrix.co</a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Button asChild size="lg">
              <a href="mailto:careers@zyrix.co">
                {t("cta.primary")}
                <ArrowRight className="w-4 h-4 ms-2" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
