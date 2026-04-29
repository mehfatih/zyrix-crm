"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  TrendingUp,
  CheckSquare,
  Activity as ActivityIcon,
  Award,
  AlertTriangle,
  Loader2,
  Sparkles,
  FileSignature,
  Mail,
  ArrowRight,
  Crown,
  DollarSign,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import ConnectedStoresWidget from "@/components/dashboard/ConnectedStoresWidget";
import { useTranslations } from "next-intl";
import { X, Rocket } from "lucide-react";
import {
  fetchDashboardStats,
  type DashboardStats,
  type TeamLeaderboardEntry,
} from "@/lib/api/dashboard";
import {
  getOnboardingStatus,
  type OnboardingStatus,
} from "@/lib/api/advanced";
import { DashboardGrid } from "@/components/dashboard-widgets/DashboardGrid";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { AIExecutiveSummary } from "@/components/dashboard/AIExecutiveSummary";
import { AIPriorityActions } from "@/components/dashboard/AIPriorityActions";
import { AISmartKPIGrid } from "@/components/dashboard/AISmartKPIGrid";
import { AIRevenueBrainPanel } from "@/components/dashboard/AIRevenueBrainPanel";
import { AgentsWidget } from "@/components/dashboard/AgentsWidget";
import { usePageContextSync } from "@/hooks/usePageContextSync";
import { useAuth } from "@/lib/auth/context";

// ============================================================================
// ROLE-BASED DASHBOARD
// Personal (member) / Team (manager) / Company (admin+)
// ============================================================================

export default function DashboardPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const t = useTranslations("Dashboard");

  // Sync the AI side-panel context to the dashboard, so any "Ask AI" call
  // from this page knows which surface the user is currently looking at.
  usePageContextSync("dashboard");
  const { user, company } = useAuth();
  const workspaceId = company?.id ?? "current";
  const userName = user?.fullName;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Parallel fetch — onboarding status shouldn't delay the dashboard
        // render, and the dashboard shouldn't delay the onboarding check.
        const [d, ob] = await Promise.all([
          fetchDashboardStats(),
          getOnboardingStatus().catch(() => null), // non-fatal
        ]);
        setStats(d);
        setOnboarding(ob);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
    // Check sessionStorage for a per-tab dismissal flag
    if (typeof window !== "undefined") {
      setBannerDismissed(
        sessionStorage.getItem("zyrix_onboarding_banner_dismissed") === "1"
      );
    }
  }, []);

  const dismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("zyrix_onboarding_banner_dismissed", "1");
    }
  };

  if (loading) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-6 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !stats) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-6">
          <div className="p-6 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-xl text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            {error || "Failed to load dashboard"}
          </div>
        </div>
      </DashboardShell>
    );
  }

  const scope = stats.scope;

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* AI Executive Summary — hero card with greeting + narrative */}
        <AIExecutiveSummary workspaceId={workspaceId} userName={userName} />

        {/* AI Smart KPI Grid — KPIs always carry context, never raw numbers */}
        <AISmartKPIGrid />

        {/* AI Priority Actions + Revenue Brain — two-column on lg */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIPriorityActions workspaceId={workspaceId} />
          </div>
          <div>
            <AIRevenueBrainPanel workspaceId={workspaceId} />
          </div>
        </div>

        {/* AI Agents — top 3 pending outputs */}
        <AgentsWidget />

        {/* Header with scope badge */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <div className="flex items-center gap-2 mt-1">
              <ScopeBadge scope={scope} t={t} />
              <span className="text-sm text-muted-foreground">
                {t(`scopeHint.${scope}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Onboarding banner — shows until wizard is completed */}
        {onboarding && !onboarding.completed && !bannerDismissed && (
          <div className="relative rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-cyan-500/20 border border-primary/30 text-foreground p-5 shadow-md overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 backdrop-blur flex items-center justify-center flex-shrink-0 text-primary">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold">
                  {locale === "ar"
                    ? "أكمل إعداد حسابك"
                    : locale === "tr"
                      ? "Hesap kurulumunuzu tamamlayın"
                      : "Finish setting up your account"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {locale === "ar"
                    ? "يستغرق الأمر دقيقتين فقط — قم بإعداد عملتك الأساسية، اربط متجرك، وادعُ فريقك."
                    : locale === "tr"
                      ? "Sadece 2 dakika sürer — ana para biriminizi ayarlayın, mağazanızı bağlayın ve ekibinizi davet edin."
                      : "It takes just 2 minutes — set your base currency, connect your store, and invite your team."}
                </p>
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/${locale}/onboarding`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    {locale === "ar"
                      ? "ابدأ الإعداد"
                      : locale === "tr"
                        ? "Kuruluma başla"
                        : "Start setup"}
                    <ArrowRight
                      className={`w-4 h-4 ${locale === "ar" ? "-scale-x-100" : ""}`}
                    />
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {onboarding.signals.storesConnected > 0
                        ? locale === "ar"
                          ? `✓ ${onboarding.signals.storesConnected} متجر متصل`
                          : locale === "tr"
                            ? `✓ ${onboarding.signals.storesConnected} mağaza bağlı`
                            : `✓ ${onboarding.signals.storesConnected} store connected`
                        : locale === "ar"
                          ? "○ لا توجد متاجر بعد"
                          : locale === "tr"
                            ? "○ Henüz mağaza yok"
                            : "○ No stores yet"}
                    </span>
                    <span>
                      {onboarding.signals.teamMembers > 1
                        ? locale === "ar"
                          ? `✓ ${onboarding.signals.teamMembers} أعضاء`
                          : locale === "tr"
                            ? `✓ ${onboarding.signals.teamMembers} üye`
                            : `✓ ${onboarding.signals.teamMembers} members`
                        : locale === "ar"
                          ? "○ أنت وحدك"
                          : locale === "tr"
                            ? "○ Sadece siz"
                            : "○ Just you"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={dismissBanner}
                aria-label={
                  locale === "ar" ? "إغلاق" : locale === "tr" ? "kapat" : "dismiss"
                }
                className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Post-onboarding banner — shows remaining 5-step checklist until
            every step is marked complete (P3). */}
        <OnboardingBanner locale={locale} />

        {/* Customizable widget grid — per-user layout saved in DashboardLayout */}
        <DashboardGrid locale={(["en", "ar", "tr"].includes(locale) ? locale : "en") as "en" | "ar" | "tr"} />

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            icon={DollarSign}
            label={
              scope === "personal"
                ? t("kpis.myRevenue")
                : t("kpis.revenue")
            }
            value={formatMoney(stats.deals.wonValueLast30d)}
            hint={`${stats.deals.wonLast30d} ${t("kpis.wonDeals")}`}
            color="emerald"
          />
          <KpiCard
            icon={TrendingUp}
            label={t("kpis.weightedPipeline")}
            value={formatMoney(stats.deals.weightedPipelineValue)}
            hint={`${stats.deals.open} ${t("kpis.openDeals")}`}
            color="cyan"
          />
          <KpiCard
            icon={Users}
            label={
              scope === "personal" ? t("kpis.myCustomers") : t("kpis.customers")
            }
            value={String(stats.customers.total)}
            hint={`+${stats.customers.new30d} ${t("kpis.last30d")}`}
            color="sky"
          />
          <KpiCard
            icon={CheckSquare}
            label={scope === "personal" ? t("kpis.myTasks") : t("kpis.tasks")}
            value={String(stats.tasks.open)}
            hint={
              stats.tasks.overdue > 0
                ? `${stats.tasks.overdue} ${t("kpis.overdue")}`
                : t("kpis.onTrack")
            }
            color={stats.tasks.overdue > 0 ? "amber" : "cyan"}
          />
        </div>

        {/* Connected e-commerce stores — shortcut cards with sync status */}
        <ConnectedStoresWidget locale={locale} />

        {/* Role-specific content */}
        {scope === "personal" && <MemberView stats={stats as any} locale={locale} t={t} />}
        {scope === "team" && <ManagerView stats={stats as any} t={t} />}
        {scope === "company" && <CompanyView stats={stats as any} locale={locale} t={t} />}

        {/* Quick links */}
        <QuickLinks locale={locale} t={t} />
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Member (personal) view
// ============================================================================
function MemberView({
  stats,
  locale,
  t,
}: {
  stats: any;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel title={t("panels.upcomingTasks")} icon={CheckSquare}>
        {stats.upcomingTasks.length === 0 ? (
          <EmptyPanel label={t("empty.noTasks")} />
        ) : (
          <div className="divide-y divide-border">
            {stats.upcomingTasks.map((ta: any, i: number) => (
              <Link
                key={i}
                href={`/${locale}/tasks`}
                className="flex items-center gap-3 p-3 hover:bg-muted"
              >
                <PriorityDot priority={ta.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {ta.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {ta.customer?.fullName || "—"}
                    {ta.dueDate && (
                      <>
                        {" · "}
                        {formatDate(ta.dueDate, locale)}
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </Panel>

      <Panel title={t("panels.myDeals")} icon={Briefcase}>
        {stats.myOpenDeals.length === 0 ? (
          <EmptyPanel label={t("empty.noDeals")} />
        ) : (
          <div className="divide-y divide-border">
            {stats.myOpenDeals.map((d: any, i: number) => (
              <Link
                key={i}
                href={`/${locale}/pipeline`}
                className="flex items-center gap-3 p-3 hover:bg-muted"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {d.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {d.customer.fullName} · {d.stage}
                  </div>
                </div>
                <div className="text-sm font-bold text-foreground">
                  {formatMoneyCurrency(Number(d.value), d.currency)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

// ============================================================================
// Manager view (team leaderboard)
// ============================================================================
function ManagerView({
  stats,
  t,
}: {
  stats: { teamLeaderboard: TeamLeaderboardEntry[] };
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Panel title={t("panels.teamLeaderboard")} icon={Crown}>
      {stats.teamLeaderboard.length === 0 ? (
        <EmptyPanel label={t("empty.noTeamSales")} />
      ) : (
        <div className="divide-y divide-border">
          {stats.teamLeaderboard.map((entry, i) => (
            <LeaderboardRow key={i} rank={i + 1} entry={entry} />
          ))}
        </div>
      )}
    </Panel>
  );
}

// ============================================================================
// Admin/Owner/Super view
// ============================================================================
function CompanyView({
  stats,
  locale,
  t,
}: {
  stats: any;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-4">
      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MiniKpi
          label={t("kpis.totalUsers")}
          value={String(stats.company.totalUsers)}
          icon={Users}
        />
        <MiniKpi
          label={t("kpis.quotesAccepted30d")}
          value={formatMoney(stats.company.acceptedQuotesValue30d)}
          icon={Mail}
        />
        <MiniKpi
          label={t("kpis.activeContracts")}
          value={String(stats.company.activeContracts)}
          icon={FileSignature}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title={t("panels.teamLeaderboard")} icon={Crown}>
          {stats.teamLeaderboard.length === 0 ? (
            <EmptyPanel label={t("empty.noTeamSales")} />
          ) : (
            <div className="divide-y divide-border">
              {stats.teamLeaderboard
                .slice(0, 10)
                .map((e: TeamLeaderboardEntry, i: number) => (
                  <LeaderboardRow key={i} rank={i + 1} entry={e} />
                ))}
            </div>
          )}
        </Panel>

        <Panel title={t("panels.topCustomers")} icon={Award}>
          {stats.topCustomers.length === 0 ? (
            <EmptyPanel label={t("empty.noCustomers")} />
          ) : (
            <div className="divide-y divide-border">
              {stats.topCustomers.map((c: any, i: number) => (
                <Link
                  key={i}
                  href={`/${locale}/customers/${c.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {c.fullName}
                    </div>
                    {c.companyName && (
                      <div className="text-xs text-muted-foreground truncate">
                        {c.companyName}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-emerald-300">
                    {formatMoney(c.lifetimeValue)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

// ============================================================================
// Quick links (role-independent)
// ============================================================================
function QuickLinks({
  locale,
  t,
}: {
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const links = [
    {
      href: `/${locale}/pipeline`,
      icon: Briefcase,
      label: t("quickLinks.pipeline"),
    },
    {
      href: `/${locale}/quotes`,
      icon: Mail,
      label: t("quickLinks.quotes"),
    },
    {
      href: `/${locale}/ai-cfo`,
      icon: Sparkles,
      label: t("quickLinks.aiCfo"),
    },
    {
      href: `/${locale}/tasks`,
      icon: CheckSquare,
      label: t("quickLinks.tasks"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {links.map((l, i) => {
        const Icon = l.icon;
        return (
          <Link
            key={i}
            href={l.href}
            className="bg-card border border-border hover:border-cyan-500/40 rounded-xl p-4 flex items-center gap-3 group transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm font-medium text-foreground">
              {l.label}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-300" />
          </Link>
        );
      })}
    </div>
  );
}

// ============================================================================
// Reusable UI bits
// ============================================================================
function ScopeBadge({
  scope,
  t,
}: {
  scope: "personal" | "team" | "company";
  t: ReturnType<typeof useTranslations>;
}) {
  const meta: Record<
    string,
    { bg: string; text: string; border: string; label: string; Icon: typeof Users }
  > = {
    personal: {
      bg: "bg-cyan-500/15",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
      label: t("scope.personal"),
      Icon: Users,
    },
    team: {
      bg: "bg-violet-500/15",
      text: "text-violet-300",
      border: "border-violet-500/30",
      label: t("scope.team"),
      Icon: Crown,
    },
    company: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      label: t("scope.company"),
      Icon: Award,
    },
  };
  const m = meta[scope];
  const Icon = m.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${m.bg} ${m.text} ${m.border}`}
    >
      <Icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint: string;
  color: "cyan" | "sky" | "emerald" | "amber";
}) {
  const colors: Record<string, { iconBg: string; iconText: string; eyebrow: string }> = {
    cyan: { iconBg: "bg-cyan-500/15 border border-cyan-500/30", iconText: "text-cyan-300", eyebrow: "text-cyan-300" },
    sky: { iconBg: "bg-cyan-500/15 border border-cyan-500/30", iconText: "text-cyan-300", eyebrow: "text-cyan-300" },
    emerald: { iconBg: "bg-emerald-500/15 border border-emerald-500/30", iconText: "text-emerald-300", eyebrow: "text-emerald-300" },
    amber: { iconBg: "bg-amber-500/15 border border-amber-500/30", iconText: "text-amber-300", eyebrow: "text-amber-300" },
  };
  const c = colors[color];
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`text-xs font-bold uppercase tracking-wider truncate ${c.eyebrow}`}>{label}</div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 truncate">{hint}</div>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <Icon className="w-6 h-6 text-cyan-300" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Users;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted flex items-center gap-2">
        <Icon className="w-4 h-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-300/60" />
      {label}
    </div>
  );
}

function LeaderboardRow({
  rank,
  entry,
}: {
  rank: number;
  entry: TeamLeaderboardEntry;
}) {
  const rankColor =
    rank === 1
      ? "from-amber-400 to-orange-500"
      : rank === 2
        ? "from-slate-300 to-slate-400"
        : rank === 3
          ? "from-amber-600 to-amber-700"
          : "from-sky-300 to-sky-400";
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted">
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {entry.user.fullName}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.dealsWon} deals · {entry.user.role}
        </div>
      </div>
      <div className="text-sm font-bold text-emerald-300">
        {formatMoney(entry.revenue)}
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const color =
    priority === "urgent" || priority === "high"
      ? "bg-rose-400"
      : priority === "medium"
        ? "bg-amber-400"
        : "bg-muted-foreground";
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}

// Helpers
function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function formatMoneyCurrency(n: number, currency: string): string {
  if (n >= 1_000_000)
    return `${currency} ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${currency} ${(n / 1_000).toFixed(1)}K`;
  return `${currency} ${n.toFixed(0)}`;
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
