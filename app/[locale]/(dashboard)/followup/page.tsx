"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Bell,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Settings2,
  Phone,
  Mail,
  Building2,
  X,
  Save,
  Zap,
  DollarSign,
  UserCheck,
  Calendar,
  Users,
} from "lucide-react";
import {
  fetchFollowupSettings,
  upsertFollowupSettings,
  fetchStaleCustomers,
  createFollowupTask,
  bulkCreateFollowupTasks,
  type FollowupSettings,
  type StaleCustomer,
  type StaleResponse,
} from "@/lib/api/followup";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// SMART FOLLOW-UP PAGE
// ============================================================================

export default function FollowupPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Followup");

  const [stale, setStale] = useState<StaleResponse | null>(null);
  const [settings, setSettings] = useState<FollowupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [taskLoadingId, setTaskLoadingId] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, st] = await Promise.all([
        fetchFollowupSettings(),
        fetchStaleCustomers(),
      ]);
      setSettings(s);
      setStale(st);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateTask = async (customerId: string) => {
    setTaskLoadingId(customerId);
    try {
      await createFollowupTask(customerId);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setTaskLoadingId(null);
    }
  };

  const handleBulkCreate = async (group: "critical" | "warning") => {
    if (!stale) return;
    const customers = group === "critical" ? stale.critical : stale.warning;
    if (customers.length === 0) return;
    if (!confirm(t("confirm.bulk", { count: String(customers.length) })))
      return;

    setBulkLoading(true);
    try {
      const result = await bulkCreateFollowupTasks(
        customers.map((c) => c.id)
      );
      alert(
        t("alerts.bulkCreated", {
          created: String(result.created),
          skipped: String(result.skipped),
        })
      );
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-sky-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-sky-500" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-medium"
          >
            <Settings2 className="w-4 h-4" />
            {t("settings")}
          </button>
        </div>

        {/* Thresholds info */}
        {settings && (
          <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-3 flex items-center gap-3 text-sm flex-wrap">
            <span className="text-slate-600">{t("thresholds.label")}:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 ring-1 ring-amber-200 rounded text-xs font-medium">
              <Clock className="w-3 h-3" />
              {t("thresholds.warning", { days: String(settings.warningDays) })}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 ring-1 ring-red-200 rounded text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              {t("thresholds.critical", {
                days: String(settings.criticalDays),
              })}
            </span>
            {!settings.isEnabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                {t("thresholds.disabled")}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : !stale ? null : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label={t("stats.totalStale")}
                value={stale.stats.totalStale}
                color="cyan"
              />
              <StatCard
                icon={AlertTriangle}
                label={t("stats.critical")}
                value={stale.stats.criticalCount}
                color="red"
              />
              <StatCard
                icon={Clock}
                label={t("stats.warning")}
                value={stale.stats.warningCount}
                color="amber"
              />
              <StatCard
                icon={DollarSign}
                label={t("stats.valueAtRisk")}
                value={formatMoneyShort(stale.stats.openDealValue)}
                color="emerald"
              />
            </div>

            {/* Empty state */}
            {stale.stats.totalStale === 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 rounded-xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">
                  {t("empty.title")}
                </h3>
                <p className="text-sm text-emerald-700 mt-1">
                  {t("empty.subtitle")}
                </p>
              </div>
            )}

            {/* Critical */}
            {stale.critical.length > 0 && (
              <StaleGroup
                t={t}
                title={t("groups.critical")}
                subtitle={t("groups.criticalSubtitle", {
                  days: String(settings?.criticalDays ?? 10),
                })}
                customers={stale.critical}
                severity="critical"
                onCreateTask={handleCreateTask}
                onBulk={() => handleBulkCreate("critical")}
                taskLoadingId={taskLoadingId}
                bulkLoading={bulkLoading}
                locale={locale}
              />
            )}

            {/* Warning */}
            {stale.warning.length > 0 && (
              <StaleGroup
                t={t}
                title={t("groups.warning")}
                subtitle={t("groups.warningSubtitle", {
                  days: String(settings?.warningDays ?? 5),
                })}
                customers={stale.warning}
                severity="warning"
                onCreateTask={handleCreateTask}
                onBulk={() => handleBulkCreate("warning")}
                taskLoadingId={taskLoadingId}
                bulkLoading={bulkLoading}
                locale={locale}
              />
            )}
          </>
        )}
      </div>

      {settingsOpen && settings && (
        <SettingsModal
          t={t}
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onSaved={async () => {
            setSettingsOpen(false);
            await load();
          }}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Stale group (critical or warning section)
// ============================================================================
function StaleGroup({
  t,
  title,
  subtitle,
  customers,
  severity,
  onCreateTask,
  onBulk,
  taskLoadingId,
  bulkLoading,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  title: string;
  subtitle: string;
  customers: StaleCustomer[];
  severity: "critical" | "warning";
  onCreateTask: (id: string) => void;
  onBulk: () => void;
  taskLoadingId: string | null;
  bulkLoading: boolean;
  locale: string;
}) {
  const isCrit = severity === "critical";
  const HeaderIcon = isCrit ? AlertTriangle : Clock;
  const headerColor = isCrit
    ? "bg-red-50 border-red-200 text-red-700"
    : "bg-amber-50 border-amber-200 text-amber-700";

  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <div
        className={`px-5 py-3 border-b ${headerColor} flex items-center justify-between gap-3 flex-wrap`}
      >
        <div className="flex items-center gap-2">
          <HeaderIcon className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-bold">
              {title}{" "}
              <span className="text-xs font-normal opacity-70">
                ({customers.length})
              </span>
            </h3>
            <p className="text-xs opacity-80">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onBulk}
          disabled={bulkLoading}
          className="px-3 py-1.5 bg-white hover:bg-sky-50 border border-current rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-60"
        >
          {bulkLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          {t("actions.createAll")}
        </button>
      </div>
      <div className="divide-y divide-sky-50">
        {customers.map((c, idx) => (
          <div
            key={idx}
            className="px-5 py-3 hover:bg-sky-50/30 flex items-start gap-3 flex-wrap"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sky-900">{c.fullName}</span>
                {c.companyName && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {c.companyName}
                  </span>
                )}
                {c.hasOpenDeal && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 rounded text-[10px] font-medium">
                    <DollarSign className="w-2.5 h-2.5" />
                    {formatMoneyShort(c.openDealValue)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {t("daysSinceContact", {
                    days: String(c.daysSinceContact),
                  })}
                </span>
                {c.ownerName && (
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    {c.ownerName}
                  </span>
                )}
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-1 hover:text-sky-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="w-3 h-3" />
                    {c.email}
                  </a>
                )}
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1 hover:text-sky-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-3 h-3" />
                    {c.phone}
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => onCreateTask(c.id)}
              disabled={taskLoadingId === c.id}
              className="flex-shrink-0 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-60"
            >
              {taskLoadingId === c.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Bell className="w-3.5 h-3.5" />
              )}
              {t("actions.createTask")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Settings Modal
// ============================================================================
function SettingsModal({
  t,
  settings,
  onClose,
  onSaved,
}: {
  t: ReturnType<typeof useTranslations>;
  settings: FollowupSettings;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    isEnabled: settings.isEnabled,
    warningDays: settings.warningDays,
    criticalDays: settings.criticalDays,
    excludeInactive: settings.excludeInactive,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (form.criticalDays < form.warningDays) {
      setErr(t("settingsModal.errors.thresholds"));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await upsertFollowupSettings(form);
      await onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-sky-900">
            {t("settingsModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(e) =>
                setForm({ ...form, isEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded border-sky-300 text-sky-500 focus:ring-sky-400"
            />
            <span className="text-sm text-slate-700">
              {t("settingsModal.isEnabled")}
            </span>
          </label>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("settingsModal.warningDays")}
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.warningDays}
              onChange={(e) =>
                setForm({ ...form, warningDays: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <p className="text-xs text-slate-500 mt-1">
              {t("settingsModal.warningHint")}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("settingsModal.criticalDays")}
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.criticalDays}
              onChange={(e) =>
                setForm({ ...form, criticalDays: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <p className="text-xs text-slate-500 mt-1">
              {t("settingsModal.criticalHint")}
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.excludeInactive}
              onChange={(e) =>
                setForm({ ...form, excludeInactive: e.target.checked })
              }
              className="w-4 h-4 rounded border-sky-300 text-sky-500 focus:ring-sky-400"
            />
            <span className="text-sm text-slate-700">
              {t("settingsModal.excludeInactive")}
            </span>
          </label>

          {err && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg border border-red-100">
              {err}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 flex justify-end gap-2 bg-sky-50/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Bell;
  label: string;
  value: string | number;
  color: "cyan" | "red" | "amber" | "emerald";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-sky-50", iconText: "text-sky-500" },
    red: { iconBg: "bg-red-50", iconText: "text-red-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  };
  const c = colors[color];
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4 flex items-center gap-3">
      <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 truncate">{label}</div>
        <div className="text-lg font-bold text-sky-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function formatMoneyShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
