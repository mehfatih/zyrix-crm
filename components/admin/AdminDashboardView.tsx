"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchStats, getAdminUser, type AdminStats } from "@/lib/api/admin";
import {
  Building2,
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  UserPlus,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ============================================================================
// ADMIN DASHBOARD VIEW
// ============================================================================

export default function AdminDashboardView() {
  const t = useTranslations("Admin.dashboard");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const me = getAdminUser();

  useEffect(() => {
    fetchStats()
      .then((s) => setStats(s))
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-cyan-600" size={28} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
        {error ?? "Failed to load."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {t("welcome")}, {me?.fullName ?? me?.email}. {t("subtitle")}
        </p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Building2}
          color="cyan"
          label={t("companies")}
          value={stats.companies.total}
          sublabel={`${stats.companies.active} ${t("active")}`}
        />
        <KpiCard
          icon={Users}
          color="sky"
          label={t("users")}
          value={stats.users.total}
          sublabel={`${stats.users.active} ${t("active")}`}
        />
        <KpiCard
          icon={UserCheck}
          color="teal"
          label={t("customers")}
          value={stats.dataCounts.customers}
          sublabel={`${stats.dataCounts.deals} ${t("deals")}`}
        />
        <KpiCard
          icon={CreditCard}
          color="emerald"
          label={t("subscriptions")}
          value={stats.subscriptions.active}
          sublabel={`${stats.subscriptions.total} ${t("total")}`}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          icon={UserPlus}
          color="indigo"
          label={t("recentSignups")}
          value={stats.companies.recentSignups30d}
          sublabel={t("companies")}
        />
        <KpiCard
          icon={AlertCircle}
          color="amber"
          label={t("suspended")}
          value={stats.companies.suspended}
          sublabel={t("companies")}
        />
        <KpiCard
          icon={TrendingUp}
          color="violet"
          label={t("trial")}
          value={stats.companies.trial}
          sublabel={t("companies")}
        />
      </div>

      {/* Plans distribution */}
      <div className="rounded-xl bg-white border border-cyan-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase size={18} className="text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            {t("plansDistribution")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.plansDistribution.map((p) => (
            <div
              key={p.plan}
              className="rounded-lg bg-sky-50 border border-sky-100 p-3"
            >
              <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                {p.plan}
              </div>
              <div className="text-2xl font-bold text-cyan-700 mt-1">
                {p.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────────────────────────────────
type ColorKey = "cyan" | "sky" | "teal" | "emerald" | "indigo" | "amber" | "violet";

const COLOR_MAP: Record<ColorKey, { bg: string; text: string; ring: string }> = {
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-700",    ring: "ring-cyan-100" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-100" },
  teal:    { bg: "bg-teal-50",    text: "text-teal-700",    ring: "ring-teal-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-700",  ring: "ring-indigo-100" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-100" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-100" },
};

function KpiCard({
  icon: Icon,
  color,
  label,
  value,
  sublabel,
}: {
  icon: typeof Building2;
  color: ColorKey;
  label: string;
  value: number;
  sublabel?: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-xl bg-white border border-cyan-100 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {label}
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {value.toLocaleString()}
          </div>
          {sublabel && (
            <div className="text-xs text-slate-500 mt-1">{sublabel}</div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
    </div>
  );
}
