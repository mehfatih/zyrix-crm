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
import {
  fetchDashboardStats,
  type DashboardStats,
  type TeamLeaderboardEntry,
} from "@/lib/api/dashboard";

// ============================================================================
// ROLE-BASED DASHBOARD
// Personal (member) / Team (manager) / Company (admin+)
// ============================================================================

export default function DashboardPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const t = useTranslations("Dashboard");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchDashboardStats();
        setStats(d);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-6 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !stats) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-6">
          <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center">
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
        {/* Header with scope badge */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">{t("title")}</h1>
            <div className="flex items-center gap-2 mt-1">
              <ScopeBadge scope={scope} t={t} />
              <span className="text-sm text-slate-500">
                {t(`scopeHint.${scope}`)}
              </span>
            </div>
          </div>
        </div>

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
          <div className="divide-y divide-sky-50">
            {stats.upcomingTasks.map((ta: any, i: number) => (
              <Link
                key={i}
                href={`/${locale}/tasks`}
                className="flex items-center gap-3 p-3 hover:bg-sky-50/30"
              >
                <PriorityDot priority={ta.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-cyan-900 truncate">
                    {ta.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {ta.customer?.fullName || "—"}
                    {ta.dueDate && (
                      <>
                        {" · "}
                        {formatDate(ta.dueDate, locale)}
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        )}
      </Panel>

      <Panel title={t("panels.myDeals")} icon={Briefcase}>
        {stats.myOpenDeals.length === 0 ? (
          <EmptyPanel label={t("empty.noDeals")} />
        ) : (
          <div className="divide-y divide-sky-50">
            {stats.myOpenDeals.map((d: any, i: number) => (
              <Link
                key={i}
                href={`/${locale}/pipeline`}
                className="flex items-center gap-3 p-3 hover:bg-sky-50/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-cyan-900 truncate">
                    {d.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {d.customer.fullName} · {d.stage}
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-900">
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
        <div className="divide-y divide-sky-50">
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
            <div className="divide-y divide-sky-50">
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
            <div className="divide-y divide-sky-50">
              {stats.topCustomers.map((c: any, i: number) => (
                <Link
                  key={i}
                  href={`/${locale}/customers/${c.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-sky-50/30"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-cyan-900 truncate">
                      {c.fullName}
                    </div>
                    {c.companyName && (
                      <div className="text-xs text-slate-500 truncate">
                        {c.companyName}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-emerald-700">
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
            className="bg-white border border-sky-100 hover:border-cyan-300 rounded-xl p-4 flex items-center gap-3 group transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm font-medium text-slate-700 group-hover:text-cyan-900">
              {l.label}
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
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
    { bg: string; text: string; label: string; Icon: typeof Users }
  > = {
    personal: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      label: t("scope.personal"),
      Icon: Users,
    },
    team: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      label: t("scope.team"),
      Icon: Crown,
    },
    company: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      label: t("scope.company"),
      Icon: Award,
    },
  };
  const m = meta[scope];
  const Icon = m.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${m.bg} ${m.text}`}
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
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-cyan-50", iconText: "text-cyan-600" },
    sky: { iconBg: "bg-sky-50", iconText: "text-sky-600" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
  };
  const c = colors[color];
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-500 truncate">{label}</div>
      </div>
      <div className="text-2xl font-bold text-cyan-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5 truncate">{hint}</div>
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
    <div className="bg-gradient-to-br from-white to-sky-50/30 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
      <Icon className="w-6 h-6 text-cyan-500" />
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-bold text-cyan-900">{value}</div>
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
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-sky-100 bg-sky-50/50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-cyan-600" />
        <h3 className="text-sm font-semibold text-cyan-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-sm text-slate-500">
      <Sparkles className="w-8 h-8 mx-auto mb-2 text-sky-300" />
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
    <div className="flex items-center gap-3 p-3 hover:bg-sky-50/30">
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-cyan-900 truncate">
          {entry.user.fullName}
        </div>
        <div className="text-xs text-slate-500">
          {entry.dealsWon} deals · {entry.user.role}
        </div>
      </div>
      <div className="text-sm font-bold text-emerald-700">
        {formatMoney(entry.revenue)}
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const color =
    priority === "urgent" || priority === "high"
      ? "bg-red-500"
      : priority === "medium"
        ? "bg-amber-500"
        : "bg-slate-300";
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
