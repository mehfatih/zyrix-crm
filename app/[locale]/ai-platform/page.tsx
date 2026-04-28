import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  MessageSquare,
  Brain,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENTS: { id: string; icon: LucideIcon }[] = [
  { id: "sales", icon: Target },
  { id: "support", icon: MessageSquare },
  { id: "qualifier", icon: Brain },
  { id: "scheduler", icon: Zap },
  { id: "followup", icon: TrendingUp },
  { id: "translator", icon: Sparkles },
];

const CAPABILITIES = ["cap1", "cap2", "cap3", "cap4", "cap5", "cap6"];

export default async function AIAgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AIAgents");

  return (
    <PublicShell locale={locale}>
      <div>
        {/* Hero */}
        <section className="relative border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 max-w-5xl py-20 md:py-28 relative">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30 mb-6">
                <Bot className="w-3.5 h-3.5" />
                {t("eyebrow")}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href={`/${locale}/signup`}>
                    {t("hero.ctaPrimary")}
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/${locale}/contact`}>
                    {t("hero.ctaSecondary")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the agents */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-3">
                {t("agents.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("agents.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("agents.subtitle")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="rounded-2xl bg-card border border-border p-6 hover:border-violet-500/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`agents.${agent.id}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`agents.${agent.id}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-3">
                {t("capabilities.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("capabilities.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap}
                  className="flex items-start gap-3 rounded-xl bg-card border border-border p-5"
                >
                  <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-violet-300 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`capabilities.${cap}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Bot className="w-10 h-10 text-violet-300 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Button asChild size="lg">
              <Link href={`/${locale}/signup`}>
                {t("cta.primary")}
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
