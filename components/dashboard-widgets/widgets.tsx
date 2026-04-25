"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  TrendingUp,
  CheckSquare,
  Award,
  Crown,
  MessageCircle,
  Calendar,
  GitBranch,
  Layout as LayoutIcon,
  Target,
  Store,
  Loader2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "@/lib/api/dashboard";
import {
  getCustomerStats,
  type CustomerStats,
} from "@/lib/api/customers";
import {
  getCohortReport,
  getFunnelReport,
  type CohortReport,
  type FunnelReport,
} from "@/lib/api/advanced";
import { fetchUnreadCount } from "@/lib/api/chat";

// ============================================================================
// WIDGET COMPONENTS
// ----------------------------------------------------------------------------
// All lightweight — each pulls from an existing API endpoint, shows its own
// loading/error state, and renders into its parent's allocated grid cell.
// No heavy charting libs; tiny CSS-drawn visualizations where useful.
// ============================================================================

// Shared shell — provides consistent card chrome + loading + header so each
// widget body stays focused on its specific visualization.
function WidgetShell({
  locale,
  title,
  icon,
  accent,
  link,
  linkLabel,
  loading,
  error,
  children,
}: {
  locale: "en" | "ar" | "tr";
  title: string;
  icon: React.ReactNode;
  accent: string;
  link?: string;
  linkLabel?: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  const isRtl = locale === "ar";
  const accentBg: Record<string, string> = {
    cyan: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <div className="h-full rounded-xl border border-sky-100 bg-white p-4 flex flex-col min-h-[120px]">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${accentBg[accent] || accentBg.cyan}`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-sky-900 flex-1 truncate">
          {title}
        </h3>
        {link && (
          <Link
            href={link}
            className="text-xs text-sky-500 hover:text-sky-800 inline-flex items-center gap-0.5"
          >
            {linkLabel}
            <ArrowRight
              className={`w-3 h-3 ${isRtl ? "-scale-x-100" : ""}`}
            />
          </Link>
        )}
      </div>
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="text-xs text-rose-700">{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function fmtMoney(n: number, currency = "USD", locale = "en"): string {
  try {
    return new Intl.NumberFormat(
      locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
      { style: "currency", currency, maximumFractionDigits: 0 }
    ).format(n);
  } catch {
    return `${Math.round(n)} ${currency}`;
  }
}

const t = (
  locale: "en" | "ar" | "tr",
  en: string,
  ar: string,
  trk: string
) => (locale === "ar" ? ar : locale === "tr" ? trk : en);

// Lightweight hook — loads dashboard stats once per widget mount.
// Each widget calls it independently, React batches the calls, and axios
// dedupes nothing — but the stats endpoint is cheap (~50ms) and widgets
// of the same type won't typically appear twice on one dashboard. Accept
// the N×API pattern for simplicity; a context-level cache is premature.
function useDashStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchDashboardStats()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setErr(e?.message || "Failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, loading, err };
}

// ──────────────────────────────────────────────────────────────────────
// 1. KPI Row — four big tiles
// ──────────────────────────────────────────────────────────────────────
export function KpiRowWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "KPI summary", "ملخص المؤشرات", "KPI özeti")}
      icon={<LayoutIcon className="w-3.5 h-3.5" />}
      accent="cyan"
      loading={loading}
      error={err}
    >
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiTile
            label={t(locale, "Customers", "العملاء", "Müşteriler")}
            value={data.customers.total.toString()}
            hint={`+${data.customers.new30d} ${t(locale, "new / 30d", "جديد / 30ي", "yeni / 30g")}`}
            accent="cyan"
          />
          <KpiTile
            label={t(locale, "Open deals", "صفقات مفتوحة", "Açık anlaşmalar")}
            value={data.deals.open.toString()}
            hint={fmtMoney(data.deals.pipelineValue, "USD", locale)}
            accent="indigo"
          />
          <KpiTile
            label={t(locale, "Won / 30d", "فوز / 30ي", "Kazanılan / 30g")}
            value={data.deals.wonLast30d.toString()}
            hint={fmtMoney(data.deals.wonValueLast30d, "USD", locale)}
            accent="emerald"
          />
          <KpiTile
            label={t(locale, "Open tasks", "مهام مفتوحة", "Açık görevler")}
            value={data.tasks.open.toString()}
            hint={
              data.tasks.overdue > 0
                ? `${data.tasks.overdue} ${t(locale, "overdue", "متأخر", "gecikmiş")}`
                : t(locale, "on track", "على المسار", "yolunda")
            }
            accent={data.tasks.overdue > 0 ? "rose" : "sky"}
          />
        </div>
      )}
    </WidgetShell>
  );
}

function KpiTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: string;
}) {
  const ring: Record<string, string> = {
    cyan: "bg-sky-50",
    indigo: "bg-indigo-50",
    emerald: "bg-emerald-50",
    sky: "bg-sky-50",
    rose: "bg-rose-50",
  };
  return (
    <div className={`rounded-lg p-3 ${ring[accent] || ring.cyan}`}>
      <div className="text-[11px] font-medium text-slate-600 truncate">
        {label}
      </div>
      <div className="text-xl font-bold text-sky-900 tabular-nums mt-1">
        {value}
      </div>
      {hint && (
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          {hint}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 2. Revenue Trend — single line showing last-90 vs prior-90 direction
// ──────────────────────────────────────────────────────────────────────
export function RevenueTrendWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const won = data?.deals.wonValueLast30d ?? 0;
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Revenue trend", "اتجاه الإيرادات", "Gelir trendi")}
      icon={<TrendingUp className="w-3.5 h-3.5" />}
      accent="emerald"
      link={`/${locale === "ar" ? "ar" : locale === "tr" ? "tr" : "en"}/reports`}
      linkLabel={t(locale, "Details", "التفاصيل", "Detaylar")}
      loading={loading}
      error={err}
    >
      {data && (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-600">
              {t(locale, "Won (last 30 days)", "المكسوب (آخر 30 يوم)", "Kazanılan (son 30 gün)")}
            </div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
              {fmtMoney(won, "USD", locale)}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-emerald-700">
              <ArrowUp className="w-3 h-3" />
              {data.deals.wonLast30d} {t(locale, "won", "فوز", "kazanılan")}
            </div>
            <div className="flex items-center gap-1 text-rose-700">
              <ArrowDown className="w-3 h-3" />
              {data.deals.lostLast30d} {t(locale, "lost", "فقد", "kaybedilen")}
            </div>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 3. Pipeline Snapshot — bar list by stage
// ──────────────────────────────────────────────────────────────────────
export function PipelineSnapshotWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const stages = data ? Object.entries(data.deals.byStage) : [];
  const max = stages.reduce((m, [, s]) => Math.max(m, s.count), 1);
  const stageLabel: Record<string, { en: string; ar: string; tr: string }> = {
    lead: { en: "Lead", ar: "عميل محتمل", tr: "Aday" },
    qualified: { en: "Qualified", ar: "مؤهل", tr: "Nitelikli" },
    proposal: { en: "Proposal", ar: "عرض", tr: "Teklif" },
    negotiation: { en: "Negotiation", ar: "تفاوض", tr: "Müzakere" },
    won: { en: "Won", ar: "مكسوب", tr: "Kazanılan" },
    lost: { en: "Lost", ar: "مفقود", tr: "Kaybedilen" },
  };
  return (
    <WidgetShell
      locale={locale}
      title={t(
        locale,
        "Pipeline snapshot",
        "لمحة خط الأنابيب",
        "Pipeline özeti"
      )}
      icon={<GitBranch className="w-3.5 h-3.5" />}
      accent="sky"
      loading={loading}
      error={err}
    >
      {data && stages.length > 0 && (
        <div className="space-y-1.5">
          {stages
            .filter(([stage]) => stage !== "won" && stage !== "lost")
            .sort((a, b) => b[1].count - a[1].count)
            .map(([stage, s]) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="w-20 text-xs text-slate-700 truncate">
                  {stageLabel[stage]?.[locale] ?? stage}
                </div>
                <div className="flex-1 h-4 bg-slate-50 rounded">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded"
                    style={{ width: `${(s.count / max) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right text-xs tabular-nums text-sky-900 font-semibold">
                  {s.count}
                </div>
              </div>
            ))}
        </div>
      )}
      {data && stages.length === 0 && (
        <p className="text-xs text-slate-500 py-4 text-center">
          {t(locale, "No deals yet", "لا صفقات بعد", "Henüz anlaşma yok")}
        </p>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 4. Recent Deals — list of 5 (via dashboard stats myOpenDeals)
// ──────────────────────────────────────────────────────────────────────
export function RecentDealsWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const deals =
    data && "myOpenDeals" in data ? data.myOpenDeals.slice(0, 5) : [];
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Recent deals", "صفقات حديثة", "Son anlaşmalar")}
      icon={<Briefcase className="w-3.5 h-3.5" />}
      accent="indigo"
      link={`/${locale}/deals`}
      linkLabel={t(locale, "All", "الكل", "Tümü")}
      loading={loading}
      error={err}
    >
      {deals.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">
          {t(locale, "No open deals", "لا صفقات مفتوحة", "Açık anlaşma yok")}
        </p>
      ) : (
        <ul className="space-y-2">
          {deals.map((d) => (
            <li key={d.id} className="flex items-center gap-2 min-w-0">
              <Link
                href={`/${locale}/deals/${d.id}`}
                className="flex-1 min-w-0 text-xs hover:text-sky-600"
              >
                <div className="font-medium text-sky-900 truncate">
                  {d.title}
                </div>
                <div className="text-slate-500 truncate">
                  {d.customer.fullName}
                </div>
              </Link>
              <div
                className="text-xs font-mono tabular-nums text-slate-700"
                dir="ltr"
              >
                {fmtMoney(Number(d.value), d.currency, locale)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 5. Upcoming Tasks — from dashboard stats
// ──────────────────────────────────────────────────────────────────────
export function UpcomingTasksWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const tasks =
    data && "upcomingTasks" in data ? data.upcomingTasks.slice(0, 5) : [];
  return (
    <WidgetShell
      locale={locale}
      title={t(
        locale,
        "Upcoming tasks",
        "المهام القادمة",
        "Yaklaşan görevler"
      )}
      icon={<CheckSquare className="w-3.5 h-3.5" />}
      accent="amber"
      link={`/${locale}/tasks`}
      linkLabel={t(locale, "All", "الكل", "Tümü")}
      loading={loading}
      error={err}
    >
      {tasks.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">
          {t(
            locale,
            "Nothing coming up",
            "لا مهام قادمة",
            "Yaklaşan görev yok"
          )}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {tasks.map((task) => {
            const prColor =
              task.priority === "high"
                ? "bg-rose-400"
                : task.priority === "medium"
                  ? "bg-amber-400"
                  : "bg-slate-300";
            return (
              <li key={task.id} className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${prColor} flex-shrink-0`} />
                <span className="flex-1 truncate text-slate-700">
                  {task.title}
                </span>
                {task.dueDate && (
                  <time className="text-[10px] text-slate-500 tabular-nums" dir="ltr">
                    {new Date(task.dueDate).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </time>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 6. Connected Stores — wraps existing widget
// ──────────────────────────────────────────────────────────────────────
import ExistingStoresWidget from "@/components/dashboard/ConnectedStoresWidget";
export function ConnectedStoresWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  // Existing widget handles its own chrome — wrap minimally.
  return <ExistingStoresWidget locale={locale} />;
}

// ──────────────────────────────────────────────────────────────────────
// 7. Cohort Snapshot — latest 3 cohorts, M0 / M1 retention
// ──────────────────────────────────────────────────────────────────────
export function CohortSnapshotWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const [data, setData] = useState<CohortReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    getCohortReport({ monthsBack: 3 })
      .then((d) => !c && setData(d))
      .catch((e) => !c && setErr(e?.message || "Failed"))
      .finally(() => !c && setLoading(false));
    return () => {
      c = true;
    };
  }, []);

  const latest = data?.cohorts[data.cohorts.length - 1];
  const m1 = latest?.retention.find((r) => r.monthOffset === 1);

  return (
    <WidgetShell
      locale={locale}
      title={t(
        locale,
        "Cohort retention",
        "الاحتفاظ بالعملاء",
        "Müşteri tutma"
      )}
      icon={<Users className="w-3.5 h-3.5" />}
      accent="cyan"
      link={`/${locale}/reports/cohort`}
      linkLabel={t(locale, "Details", "التفاصيل", "Detaylar")}
      loading={loading}
      error={err}
    >
      {data && latest && (
        <div className="space-y-2">
          <div>
            <div className="text-xs text-slate-600">
              {t(locale, "Latest cohort size", "حجم أحدث مجموعة", "En son kohort boyutu")}
            </div>
            <div className="text-2xl font-bold text-sky-900 tabular-nums">
              {latest.cohortSize}
            </div>
          </div>
          {m1 && (
            <div>
              <div className="text-xs text-slate-600">
                {t(
                  locale,
                  "1-month retention",
                  "احتفاظ شهر",
                  "1 ay tutma"
                )}
              </div>
              <div className="text-lg font-semibold text-emerald-700 tabular-nums">
                {m1.retentionPct}%
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 8. Funnel Snapshot — win rate + biggest drop
// ──────────────────────────────────────────────────────────────────────
export function FunnelSnapshotWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const [data, setData] = useState<FunnelReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    getFunnelReport({ windowDays: 90 })
      .then((d) => !c && setData(d))
      .catch((e) => !c && setErr(e?.message || "Failed"))
      .finally(() => !c && setLoading(false));
    return () => {
      c = true;
    };
  }, []);

  const biggestDrop =
    data?.stages
      .filter((s) => s.conversionToNext !== null)
      .sort(
        (a, b) => (a.conversionToNext ?? 0) - (b.conversionToNext ?? 0)
      )[0] ?? null;

  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Funnel", "المسار", "Huni")}
      icon={<Target className="w-3.5 h-3.5" />}
      accent="sky"
      link={`/${locale}/reports/funnel`}
      linkLabel={t(locale, "Details", "التفاصيل", "Detaylar")}
      loading={loading}
      error={err}
    >
      {data && (
        <div className="space-y-2">
          <div>
            <div className="text-xs text-slate-600">
              {t(locale, "Win rate (90d)", "معدل الفوز (90ي)", "Kazanma oranı (90g)")}
            </div>
            <div className="text-2xl font-bold text-sky-900 tabular-nums">
              {data.overallConversionRate}%
            </div>
          </div>
          {biggestDrop && (
            <div>
              <div className="text-xs text-slate-600">
                {t(locale, "Biggest drop-off", "أكبر تسرب", "En büyük düşüş")}
              </div>
              <div className="text-xs font-semibold text-rose-700 capitalize">
                {biggestDrop.stage} → {biggestDrop.conversionToNext}%
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 9. Customer Count — single big number
// ──────────────────────────────────────────────────────────────────────
export function CustomerCountWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    getCustomerStats()
      .then((d) => !c && setStats(d))
      .catch((e) => !c && setErr(e?.message || "Failed"))
      .finally(() => !c && setLoading(false));
    return () => {
      c = true;
    };
  }, []);
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Customers", "العملاء", "Müşteriler")}
      icon={<Users className="w-3.5 h-3.5" />}
      accent="cyan"
      loading={loading}
      error={err}
    >
      {stats && (
        <div>
          <div className="text-3xl font-bold text-sky-900 tabular-nums">
            {stats.total}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            +{stats.recent30Days} {t(locale, "new / 30d", "جديد / 30ي", "yeni / 30g")}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 10. Deal Count — open deals
// ──────────────────────────────────────────────────────────────────────
export function DealCountWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Open deals", "صفقات مفتوحة", "Açık anlaşmalar")}
      icon={<Briefcase className="w-3.5 h-3.5" />}
      accent="indigo"
      loading={loading}
      error={err}
    >
      {data && (
        <div>
          <div className="text-3xl font-bold text-sky-900 tabular-nums">
            {data.deals.open}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            {fmtMoney(data.deals.pipelineValue, "USD", locale)}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 11. Won This Month — single big number
// ──────────────────────────────────────────────────────────────────────
export function WonThisMonthWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Won (30d)", "فوز (30ي)", "Kazanılan (30g)")}
      icon={<Award className="w-3.5 h-3.5" />}
      accent="emerald"
      loading={loading}
      error={err}
    >
      {data && (
        <div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">
            {fmtMoney(data.deals.wonValueLast30d, "USD", locale)}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            {data.deals.wonLast30d}{" "}
            {t(locale, "deals", "صفقة", "anlaşma")}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 12. Top Customers — from company dashboard stats
// ──────────────────────────────────────────────────────────────────────
export function TopCustomersWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const list =
    data && "topCustomers" in data ? data.topCustomers.slice(0, 5) : [];
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Top customers", "أفضل العملاء", "En iyi müşteriler")}
      icon={<Crown className="w-3.5 h-3.5" />}
      accent="amber"
      link={`/${locale}/customers`}
      linkLabel={t(locale, "All", "الكل", "Tümü")}
      loading={loading}
      error={err}
    >
      {list.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">
          {t(locale, "No data yet", "لا بيانات بعد", "Veri yok")}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {list.map((c, i) => (
            <li key={c.id} className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <Link
                href={`/${locale}/customers/${c.id}`}
                className="flex-1 min-w-0 text-xs hover:text-sky-600"
              >
                <div className="font-medium text-sky-900 truncate">
                  {c.fullName}
                </div>
                {c.companyName && (
                  <div className="text-slate-500 truncate text-[10px]">
                    {c.companyName}
                  </div>
                )}
              </Link>
              <div className="text-xs font-mono tabular-nums text-emerald-700" dir="ltr">
                {fmtMoney(c.lifetimeValue, "USD", locale)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 13. Tasks Due Today
// ──────────────────────────────────────────────────────────────────────
export function TasksDueTodayWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const { data, loading, err } = useDashStats();
  const dueToday =
    data && "upcomingTasks" in data
      ? data.upcomingTasks.filter((task) => {
          if (!task.dueDate) return false;
          const due = new Date(task.dueDate);
          const now = new Date();
          return (
            due.getUTCFullYear() === now.getUTCFullYear() &&
            due.getUTCMonth() === now.getUTCMonth() &&
            due.getUTCDate() === now.getUTCDate()
          );
        }).length
      : 0;
  const overdue = data?.tasks.overdue ?? 0;
  return (
    <WidgetShell
      locale={locale}
      title={t(locale, "Due today", "تسليم اليوم", "Bugün teslim")}
      icon={<Calendar className="w-3.5 h-3.5" />}
      accent="rose"
      link={`/${locale}/tasks`}
      linkLabel={t(locale, "All", "الكل", "Tümü")}
      loading={loading}
      error={err}
    >
      {data && (
        <div>
          <div className="text-3xl font-bold text-sky-900 tabular-nums">
            {dueToday}
          </div>
          {overdue > 0 && (
            <div className="text-xs text-rose-700 mt-1">
              {overdue} {t(locale, "overdue", "متأخر", "gecikmiş")}
            </div>
          )}
          {overdue === 0 && dueToday === 0 && (
            <div className="text-xs text-slate-500 mt-1">
              {t(locale, "All clear", "كل شيء تمام", "Her şey temiz")}
            </div>
          )}
        </div>
      )}
    </WidgetShell>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 14. Unread Messages
// ──────────────────────────────────────────────────────────────────────
export function UnreadMessagesWidget({
  locale,
}: {
  locale: "en" | "ar" | "tr";
}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    fetchUnreadCount()
      .then((n) => !c && setCount(typeof n === "number" ? n : 0))
      .catch((e) => !c && setErr(e?.message || "Failed"))
      .finally(() => !c && setLoading(false));
    return () => {
      c = true;
    };
  }, []);
  return (
    <WidgetShell
      locale={locale}
      title={t(
        locale,
        "Unread messages",
        "الرسائل غير المقروءة",
        "Okunmamış mesajlar"
      )}
      icon={<MessageCircle className="w-3.5 h-3.5" />}
      accent="violet"
      link={`/${locale}/chat`}
      linkLabel={t(locale, "Open", "افتح", "Aç")}
      loading={loading}
      error={err}
    >
      <div>
        <div className="text-3xl font-bold text-sky-900 tabular-nums">
          {count ?? 0}
        </div>
        <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
          {count === 0 ? (
            <>
              <Minus className="w-3 h-3" />{" "}
              {t(locale, "all caught up", "كلها مقروءة", "hepsi okundu")}
            </>
          ) : (
            t(locale, "across all chats", "عبر كل المحادثات", "tüm sohbetlerde")
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
