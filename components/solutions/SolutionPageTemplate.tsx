"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Phone,
  Users,
  BarChart3,
  Zap,
  ShoppingCart,
  Package,
  RefreshCw,
  CreditCard,
  Truck,
  Home,
  MapPin,
  Calendar,
  FileText,
  Camera,
  MessageSquare,
  Bell,
  Heart,
  Shield,
  Briefcase,
  FileSpreadsheet,
  Workflow,
  Award,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// SolutionPageTemplate
// ----------------------------------------------------------------------------
// Internal industry registry. Pages pass only `namespace`/`accentColor`/
// `locale` strings — no functions cross the server/client boundary.
// ============================================================================

type AccentColor = "primary" | "emerald" | "amber" | "rose" | "violet";
type SolutionNamespace =
  | "SolutionsSales"
  | "SolutionsEcommerce"
  | "SolutionsRealEstate"
  | "SolutionsClinics"
  | "SolutionsAgencies";

interface FeatureConfig {
  Icon: LucideIcon;
  titleKey: string;
  descKey: string;
}
interface StatConfig {
  value: string;
  labelKey: string;
}
interface IndustryConfig {
  features: FeatureConfig[];
  stats: StatConfig[];
  workflowSteps: number;
}

const INDUSTRY: Record<SolutionNamespace, IndustryConfig> = {
  SolutionsSales: {
    features: [
      { Icon: Target, titleKey: "features.pipeline.title", descKey: "features.pipeline.desc" },
      { Icon: Phone, titleKey: "features.calls.title", descKey: "features.calls.desc" },
      { Icon: Users, titleKey: "features.team.title", descKey: "features.team.desc" },
      { Icon: TrendingUp, titleKey: "features.forecast.title", descKey: "features.forecast.desc" },
      { Icon: BarChart3, titleKey: "features.reports.title", descKey: "features.reports.desc" },
      { Icon: Zap, titleKey: "features.automation.title", descKey: "features.automation.desc" },
    ],
    stats: [
      { value: "47%", labelKey: "stats.faster" },
      { value: "3.2x", labelKey: "stats.deals" },
      { value: "85%", labelKey: "stats.followup" },
      { value: "24/7", labelKey: "stats.access" },
    ],
    workflowSteps: 5,
  },
  SolutionsEcommerce: {
    features: [
      { Icon: ShoppingCart, titleKey: "features.shopify.title", descKey: "features.shopify.desc" },
      { Icon: Package, titleKey: "features.inventory.title", descKey: "features.inventory.desc" },
      { Icon: MessageCircle, titleKey: "features.whatsapp.title", descKey: "features.whatsapp.desc" },
      { Icon: RefreshCw, titleKey: "features.abandoned.title", descKey: "features.abandoned.desc" },
      { Icon: CreditCard, titleKey: "features.cod.title", descKey: "features.cod.desc" },
      { Icon: Truck, titleKey: "features.shipping.title", descKey: "features.shipping.desc" },
    ],
    stats: [
      { value: "32%", labelKey: "stats.recovery" },
      { value: "5.4x", labelKey: "stats.aov" },
      { value: "60%", labelKey: "stats.repeat" },
      { value: "12s", labelKey: "stats.response" },
    ],
    workflowSteps: 5,
  },
  SolutionsRealEstate: {
    features: [
      { Icon: Home, titleKey: "features.listings.title", descKey: "features.listings.desc" },
      { Icon: MapPin, titleKey: "features.location.title", descKey: "features.location.desc" },
      { Icon: Camera, titleKey: "features.virtual.title", descKey: "features.virtual.desc" },
      { Icon: Calendar, titleKey: "features.viewings.title", descKey: "features.viewings.desc" },
      { Icon: FileText, titleKey: "features.contracts.title", descKey: "features.contracts.desc" },
      { Icon: Users, titleKey: "features.brokers.title", descKey: "features.brokers.desc" },
    ],
    stats: [
      { value: "73%", labelKey: "stats.leadResponse" },
      { value: "2.5x", labelKey: "stats.conversions" },
      { value: "92%", labelKey: "stats.contractRetention" },
      { value: "15min", labelKey: "stats.firstResponse" },
    ],
    workflowSteps: 5,
  },
  SolutionsClinics: {
    features: [
      { Icon: Calendar, titleKey: "features.appointments.title", descKey: "features.appointments.desc" },
      { Icon: FileText, titleKey: "features.records.title", descKey: "features.records.desc" },
      { Icon: MessageSquare, titleKey: "features.followup.title", descKey: "features.followup.desc" },
      { Icon: Bell, titleKey: "features.reminders.title", descKey: "features.reminders.desc" },
      { Icon: Heart, titleKey: "features.loyalty.title", descKey: "features.loyalty.desc" },
      { Icon: Shield, titleKey: "features.privacy.title", descKey: "features.privacy.desc" },
    ],
    stats: [
      { value: "68%", labelKey: "stats.noShow" },
      { value: "4.2x", labelKey: "stats.retention" },
      { value: "95%", labelKey: "stats.satisfaction" },
      { value: "30%", labelKey: "stats.timesSaved" },
    ],
    workflowSteps: 5,
  },
  SolutionsAgencies: {
    features: [
      { Icon: Briefcase, titleKey: "features.clients.title", descKey: "features.clients.desc" },
      { Icon: BarChart3, titleKey: "features.reports.title", descKey: "features.reports.desc" },
      { Icon: Users, titleKey: "features.team.title", descKey: "features.team.desc" },
      { Icon: FileSpreadsheet, titleKey: "features.proposals.title", descKey: "features.proposals.desc" },
      { Icon: Workflow, titleKey: "features.workflow.title", descKey: "features.workflow.desc" },
      { Icon: Award, titleKey: "features.whitelabel.title", descKey: "features.whitelabel.desc" },
    ],
    stats: [
      { value: "10x", labelKey: "stats.scale" },
      { value: "40%", labelKey: "stats.margin" },
      { value: "85%", labelKey: "stats.retention" },
      { value: "5min", labelKey: "stats.report" },
    ],
    workflowSteps: 5,
  },
};

const ACCENT_CLASSES: Record<AccentColor, { bg: string; text: string; border: string; gradient: string }> = {
  primary: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", gradient: "from-primary/30 to-primary/5" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30", gradient: "from-emerald-500/30 to-emerald-500/5" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30", gradient: "from-amber-500/30 to-amber-500/5" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30", gradient: "from-rose-500/30 to-rose-500/5" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30", gradient: "from-violet-500/30 to-violet-500/5" },
};

interface Props {
  namespace: SolutionNamespace;
  accentColor?: AccentColor;
  locale: string;
}

export default function SolutionPageTemplate({ namespace, accentColor = "primary", locale }: Props) {
  const t = useTranslations(namespace);
  const accent = ACCENT_CLASSES[accentColor];
  const config = INDUSTRY[namespace];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${accent.gradient} opacity-30 pointer-events-none`}
        />
        <div className="container mx-auto px-4 max-w-6xl py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${accent.bg} ${accent.text} border ${accent.border} mb-6`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            {/* Live activity strip — replaces the 2-button hero CTA pair */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mb-8">
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="font-bold text-foreground truncate">{t("hero.live.metric1")}</div>
                  <div className="text-xs text-muted-foreground truncate">{t("hero.live.metric1Label")}</div>
                </div>
              </div>
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="font-bold text-foreground truncate">{t("hero.live.metric2")}</div>
                  <div className="text-xs text-muted-foreground truncate">{t("hero.live.metric2Label")}</div>
                </div>
              </div>
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="font-bold text-foreground truncate">{t("hero.live.metric3")}</div>
                  <div className="text-xs text-muted-foreground truncate">{t("hero.live.metric3Label")}</div>
                </div>
              </div>
            </div>

            <div>
              <Button asChild size="lg">
                <Link href={`/${locale}/signup`}>
                  <Sparkles className="w-4 h-4 me-2" />
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className={`text-xs font-bold uppercase tracking-widest ${accent.text} mb-3`}>
              {t("pain.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("pain.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pain.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`pain.point${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className={`text-xs font-bold uppercase tracking-widest ${accent.text} mb-3`}>
              {t("features.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("features.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.features.map((feature, i) => {
              const Icon = feature.Icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12 mx-auto text-center">
            <p className={`text-xs font-bold uppercase tracking-widest ${accent.text} mb-3`}>
              {t("workflow.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("workflow.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("workflow.subtitle")}</p>
          </div>
          <div className="space-y-4">
            {Array.from({ length: config.workflowSteps }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl bg-card border border-border p-6"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${accent.bg} ${accent.text} font-bold flex items-center justify-center text-lg`}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {t(`workflow.step${i + 1}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`workflow.step${i + 1}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {config.stats.map((stat, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border p-6 text-center">
                <div className={`text-4xl md:text-5xl font-bold ${accent.text} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Sparkles className={`w-10 h-10 ${accent.text} mx-auto mb-6`} />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("cta.subtitle")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={`/${locale}/signup`}>
                <Sparkles className="w-4 h-4 me-2" />
                {t("cta.primary")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/contact`}>
                <MessageCircle className="w-4 h-4 me-2" />
                {t("cta.secondary")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
