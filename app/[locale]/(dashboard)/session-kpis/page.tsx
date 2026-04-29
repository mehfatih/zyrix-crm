"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  Activity,
  LogOut,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  getSessionKpis,
  type SessionKpiSummary,
} from "@/lib/api/session-events";
import {
  TopFiveHero,
  type TopFiveItem,
} from "@/components/shared/TopFiveHero";
import { SessionsTrendChart } from "@/components/session/SessionsTrendChart";

// ============================================================================
// SESSION KPIs — per-employee close counts + auto vs manual breakdown
// ----------------------------------------------------------------------------
// The audience is the MERCHANT'S management team (owner / admin / manager
// roles), not Zyrix platform staff. They use it to see:
//   • Which employees close Zyrix a lot (engaged? frustrated? both?)
//   • What fraction of closes were auto-timeouts (a signal of
//     employees leaving Zyrix in a background tab — possibly they're
//     not using it as intended)
//   • Total system usage as a health metric
//
// Regular members also have access but see only their own row —
// enforced server-side in the controller's role-scope filter.
// ============================================================================

type RangePreset = "today" | "yesterday" | "last7" | "last30";

const PRESETS: Record<RangePreset, { en: string; ar: string; tr: string }> = {
  today: { en: "Today", ar: "اليوم", tr: "Bugün" },
  yesterday: { en: "Yesterday", ar: "أمس", tr: "Dün" },
  last7: { en: "Last 7 days", ar: "آخر 7 أيام", tr: "Son 7 gün" },
  last30: { en: "Last 30 days", ar: "آخر 30 يوم", tr: "Son 30 gün" },
};

function computeRange(preset: RangePreset): { from: Date; to: Date } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case "today":
      return { from: startOfDay, to: now };
    case "yesterday": {
      const yesterdayStart = new Date(
        startOfDay.getTime() - 24 * 60 * 60 * 1000
      );
      return { from: yesterdayStart, to: startOfDay };
    }
    case "last7":
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      };
    case "last30":
      return {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      };
  }
}

export default function SessionKpisPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const { user } = useAuth();
  const canSeeAll =
    user?.role === "owner" || user?.role === "admin" || user?.role === "manager";

  const [preset, setPreset] = useState<RangePreset>("today");
  const [data, setData] = useState<SessionKpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = computeRange(preset);
      const summary = await getSessionKpis({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      });
      setData(summary);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, [preset]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-5xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sky-300 text-xs font-bold uppercase tracking-widest mb-2">SESSION KPIS</p>
              <h1 className="text-2xl font-bold text-foreground">
                {tr("Session activity", "نشاط الجلسات", "Oturum etkinliği")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {canSeeAll
                  ? tr(
                      "Per-employee logout breakdown for your team.",
                      "تفصيل عمليات الخروج لكل موظف في فريقك.",
                      "Ekip üyelerinizin oturum kapatma dağılımı."
                    )
                  : tr(
                      "Your session activity summary.",
                      "ملخص نشاط جلستك.",
                      "Oturum etkinliğinizin özeti."
                    )}
              </p>
            </div>
          </div>

          {/* Range preset pills */}
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {(Object.keys(PRESETS) as RangePreset[]).map((k) => (
              <button
                key={k}
                onClick={() => setPreset(k)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  preset === k
                    ? "bg-sky-500 text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {PRESETS[k][locale]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2 text-sm text-rose-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : !data ? null : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                icon={TrendingUp}
                tone="from-sky-400 to-sky-600"
                label={tr("Total closes", "إجمالي عمليات الإغلاق", "Toplam kapanma")}
                value={data.totals.totalCloses}
                hint={tr(
                  "All logouts combined",
                  "جميع عمليات الخروج مجتمعة",
                  "Tüm çıkışlar birleşik"
                )}
              />
              <StatCard
                icon={LogOut}
                tone="from-emerald-500 to-teal-600"
                label={tr("Manual logouts", "خروج يدوي", "Manuel çıkış")}
                value={data.totals.manualLogouts}
                hint={tr(
                  "Employee clicked logout",
                  "الموظف ضغط على تسجيل الخروج",
                  "Çalışan çıkışa bastı"
                )}
              />
              <StatCard
                icon={Clock}
                tone="from-amber-500 to-orange-600"
                label={tr(
                  "Auto-logouts (idle)",
                  "خروج تلقائي (خمول)",
                  "Otomatik çıkış (boşta)"
                )}
                value={data.totals.autoLogouts}
                hint={tr(
                  "10-min timeout fired",
                  "مرت 10 دقائق بدون نشاط",
                  "10dk boşta kaldı"
                )}
              />
              <StatCard
                icon={ShieldCheck}
                tone={
                  data.totals.autoLogoutRatio > 0.4
                    ? "from-rose-500 to-pink-600"
                    : data.totals.autoLogoutRatio > 0.2
                      ? "from-violet-500 to-fuchsia-600"
                      : "from-sky-400 to-teal-600"
                }
                label={tr(
                  "Auto ratio",
                  "نسبة الخروج التلقائي",
                  "Otomatik oran"
                )}
                value={`${Math.round(data.totals.autoLogoutRatio * 100)}%`}
                hint={
                  data.totals.autoLogoutRatio > 0.4
                    ? tr(
                        "High — review engagement",
                        "مرتفع — راجع الالتزام",
                        "Yüksek — bağlılığı gözden geçirin"
                      )
                    : data.totals.autoLogoutRatio > 0.2
                      ? tr(
                          "Moderate",
                          "متوسط",
                          "Orta"
                        )
                      : tr("Healthy", "صحي", "Sağlıklı")
                }
              />
            </div>

            {/* Sprint 14u — Top 5 employees hero */}
            <TopFiveHero
              eyebrow="TOP 5 ACTIVE EMPLOYEES"
              title={tr(
                "Most engaged users this period",
                "أكثر المستخدمين نشاطاً هذه الفترة",
                "Bu dönemin en aktif kullanıcıları",
              )}
              accentText="text-cyan-300"
              items={data.perUser.map<TopFiveItem>((row) => ({
                id: row.userId,
                primary:
                  row.userName ??
                  tr("Unnamed user", "مستخدم بلا اسم", "İsimsiz kullanıcı"),
                secondary: row.userEmail ?? undefined,
                metric: row.totalCloses,
                metricLabel: tr("sessions", "جلسات", "oturum"),
                badge:
                  row.totalCloses > 0
                    ? `${Math.round((row.autoLogouts / row.totalCloses) * 100)}% auto`
                    : undefined,
              }))}
              formatMetric={(v) => v.toLocaleString()}
              chartTitle="SESSIONS BY EMPLOYEE"
              chartSubtitle={tr(
                "Top 5 activity",
                "أكثر 5 نشاطاً",
                "En aktif 5",
              )}
            />

            {/* Sprint 14u — Daily sessions trend per top-5 employee */}
            <SessionsTrendChart
              users={data.perUser.map((row) => ({
                id: row.userId,
                name:
                  row.userName ??
                  tr("Unnamed user", "مستخدم بلا اسم", "İsimsiz kullanıcı"),
                total: row.totalCloses,
              }))}
            />

            {/* Per-user table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-300" />
                <h2 className="text-sm font-bold text-foreground">
                  {tr(
                    `Per ${canSeeAll ? "employee" : "person"}`,
                    canSeeAll ? "لكل موظف" : "لكل شخص",
                    canSeeAll ? "Çalışan başına" : "Kişi başına"
                  )}
                </h2>
              </div>
              {data.perUser.length === 0 ? (
                <div className="p-10 text-center">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {tr(
                      "No activity in this range yet.",
                      "لا نشاط في هذه الفترة بعد.",
                      "Bu aralıkta henüz etkinlik yok."
                    )}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {data.perUser.map((row) => {
                    const autoRatio =
                      row.totalCloses > 0
                        ? row.autoLogouts / row.totalCloses
                        : 0;
                    return (
                      <div
                        key={row.userId}
                        className="px-4 py-3 flex items-center gap-3 flex-wrap"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {row.userName
                            ? row.userName
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s.charAt(0).toUpperCase())
                                .join("")
                            : "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">
                            {row.userName ??
                              tr("Unnamed user", "مستخدم بلا اسم", "İsimsiz kullanıcı")}
                          </div>
                          <div
                            className="text-[11px] text-muted-foreground truncate font-mono"
                            dir="ltr"
                          >
                            {row.userEmail ?? "—"}
                          </div>
                        </div>

                        {/* Split breakdown: manual | auto visual bar */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="font-mono tabular-nums text-foreground">
                              {row.manualLogouts}
                            </span>
                            <span className="text-muted-foreground">
                              {tr("manual", "يدوي", "manuel")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="font-mono tabular-nums text-foreground">
                              {row.autoLogouts}
                            </span>
                            <span className="text-muted-foreground">
                              {tr("auto", "تلقائي", "otomatik")}
                            </span>
                          </div>
                          {row.sessionExpired > 0 && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span className="font-mono tabular-nums text-muted-foreground">
                                {row.sessionExpired}
                              </span>
                              <span className="text-muted-foreground">
                                {tr("expired", "انتهت", "süresi doldu")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Total + ratio pill */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-base font-bold text-foreground font-mono tabular-nums">
                              {row.totalCloses}
                            </div>
                            <div className="text-[9px] font-semibold uppercase text-muted-foreground tracking-wide">
                              {tr("total", "الإجمالي", "toplam")}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              autoRatio > 0.4
                                ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                                : autoRatio > 0.2
                                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {Math.round(autoRatio * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Logins card */}
            <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 rotate-180" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  {tr("Logins", "تسجيلات الدخول", "Giriş yapmalar")}
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tabular-nums">
                  {data.totals.logins}
                </div>
              </div>
              <div className="text-xs text-muted-foreground max-w-xs text-end">
                {tr(
                  "Total sign-ins in the selected range — includes password + 2FA + Google auth methods.",
                  "إجمالي تسجيلات الدخول في الفترة المحددة — تشمل كلمة المرور والـ 2FA وGoogle.",
                  "Seçili aralıktaki toplam girişler — şifre + 2FA + Google dahil."
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Stat card
// ============================================================================

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: any;
  tone: string;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-2">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tone} text-white flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
            {label}
          </div>
          <div className="text-2xl font-bold text-foreground font-mono tabular-nums leading-tight">
            {value}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
        </div>
      </div>
    </div>
  );
}
