"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DollarSign,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  X,
  Save,
  AlertTriangle,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  Settings2,
  BarChart3,
  Award,
  RefreshCw,
  Power,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  fetchRules,
  createRule,
  updateRule,
  deleteRule,
  fetchEntries,
  updateEntryStatus,
  deleteEntry,
  fetchStats,
  recomputeAll,
  type CommissionRule,
  type CommissionEntry,
  type CommissionStats,
  type CommissionType,
  type EntryStatus,
  type AppliesTo,
  type CreateRuleDto,
} from "@/lib/api/commission";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// COMMISSION ENGINE PAGE
// ============================================================================

type Tab = "rules" | "entries" | "stats";

const STATUS_META: Record<
  EntryStatus,
  { bg: string; text: string; ring: string; Icon: typeof Clock }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    Icon: Clock,
  },
  approved: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    Icon: CheckCircle2,
  },
  paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    Icon: DollarSign,
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    Icon: XCircle,
  },
};

const TYPE_LABEL: Record<CommissionType, string> = {
  percent: "%",
  flat: "Flat",
  tiered: "Tiered",
};

export default function CommissionPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Commission");

  const [tab, setTab] = useState<Tab>("rules");
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [entries, setEntries] = useState<CommissionEntry[]>([]);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "">("");
  const [recomputing, setRecomputing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, e, s] = await Promise.all([
        fetchRules(),
        fetchEntries({
          limit: 200,
          status: statusFilter || undefined,
        }),
        fetchStats(),
      ]);
      setRules(r);
      setEntries(e.items);
      setStats(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleRecompute = async () => {
    if (!confirm(t("confirm.recompute"))) return;
    setRecomputing(true);
    try {
      const result = await recomputeAll();
      alert(
        t("alerts.recomputed", {
          deals: String(result.dealsProcessed),
          entries: String(result.entriesCreated),
        })
      );
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setRecomputing(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm(t("confirm.deleteRule"))) return;
    try {
      await deleteRule(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const handleEntryStatus = async (id: string, status: EntryStatus) => {
    try {
      await updateEntryStatus(id, status);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm(t("confirm.deleteEntry"))) return;
    try {
      await deleteEntry(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-cyan-600" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecompute}
              disabled={recomputing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {recomputing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {t("recompute")}
            </button>
            <button
              onClick={() => {
                setEditingRule(null);
                setRuleModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t("newRule")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-sky-100 flex gap-1 overflow-x-auto">
          {(
            [
              { id: "rules", label: t("tabs.rules"), Icon: Settings2 },
              { id: "entries", label: t("tabs.entries"), Icon: DollarSign },
              { id: "stats", label: t("tabs.stats"), Icon: BarChart3 },
            ] as { id: Tab; label: string; Icon: typeof DollarSign }[]
          ).map((tb) => {
            const active = tab === tb.id;
            const Icon = tb.Icon;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? "border-cyan-600 text-cyan-700"
                    : "border-transparent text-slate-600 hover:text-cyan-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tb.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : (
          <>
            {tab === "rules" && (
              <RulesList
                t={t}
                rules={rules}
                onEdit={(r) => {
                  setEditingRule(r);
                  setRuleModalOpen(true);
                }}
                onDelete={handleDeleteRule}
              />
            )}
            {tab === "entries" && (
              <EntriesList
                t={t}
                entries={entries}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onStatus={handleEntryStatus}
                onDelete={handleDeleteEntry}
                locale={locale}
              />
            )}
            {tab === "stats" && stats && <StatsView t={t} stats={stats} />}
          </>
        )}
      </div>

      {ruleModalOpen && (
        <RuleModal
          t={t}
          editing={editingRule}
          onClose={() => {
            setRuleModalOpen(false);
            setEditingRule(null);
          }}
          onSaved={async () => {
            setRuleModalOpen(false);
            setEditingRule(null);
            await load();
          }}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Rules List
// ============================================================================
function RulesList({
  t,
  rules,
  onEdit,
  onDelete,
}: {
  t: ReturnType<typeof useTranslations>;
  rules: CommissionRule[];
  onEdit: (r: CommissionRule) => void;
  onDelete: (id: string) => void;
}) {
  if (rules.length === 0) {
    return (
      <div className="bg-white border border-sky-100 rounded-xl py-16 text-center text-slate-500">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
        <p className="text-sm font-medium">{t("rules.empty")}</p>
        <p className="text-xs mt-1">{t("rules.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-sky-50 border-b border-sky-100">
          <tr className="text-left rtl:text-right text-xs uppercase text-slate-600">
            <th className="px-4 py-3 font-semibold">{t("rules.col.name")}</th>
            <th className="px-4 py-3 font-semibold">{t("rules.col.type")}</th>
            <th className="px-4 py-3 font-semibold">
              {t("rules.col.formula")}
            </th>
            <th className="px-4 py-3 font-semibold">
              {t("rules.col.appliesTo")}
            </th>
            <th className="px-4 py-3 font-semibold">
              {t("rules.col.entries")}
            </th>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r, idx) => (
            <tr
              key={idx}
              className="border-b border-sky-50 hover:bg-sky-50/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {!r.isActive && (
                    <Power className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <div>
                    <div className="font-medium text-cyan-900">{r.name}</div>
                    {r.description && (
                      <div className="text-xs text-slate-500 truncate max-w-sm">
                        {r.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 bg-sky-50 text-sky-700 ring-1 ring-sky-200 rounded text-xs font-medium">
                  {TYPE_LABEL[r.type]}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700 font-mono text-xs">
                {formatFormula(r)}
              </td>
              <td className="px-4 py-3 text-slate-700 text-xs">
                {r.appliesTo === "all" && t("rules.appliesAll")}
                {r.appliesTo === "deal_stage" &&
                  t("rules.appliesStage", {
                    stage: r.appliesToValue ?? "—",
                  })}
                {r.appliesTo === "min_value" &&
                  t("rules.appliesMin", {
                    value: r.appliesToValue ?? "0",
                  })}
              </td>
              <td className="px-4 py-3 text-slate-600 text-sm">
                {r._count?.entries ?? 0}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 ltr:justify-end rtl:justify-start">
                  <button
                    onClick={() => onEdit(r)}
                    className="p-1 text-slate-400 hover:text-cyan-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatFormula(r: CommissionRule): string {
  if (r.type === "percent") return `${r.config?.rate ?? 0}%`;
  if (r.type === "flat") return `${r.config?.amount ?? 0}`;
  if (r.type === "tiered") {
    const tiers = r.config?.tiers ?? [];
    return `${tiers.length} tiers`;
  }
  return "—";
}

// ============================================================================
// Entries List
// ============================================================================
function EntriesList({
  t,
  entries,
  statusFilter,
  setStatusFilter,
  onStatus,
  onDelete,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  entries: CommissionEntry[];
  statusFilter: EntryStatus | "";
  setStatusFilter: (v: EntryStatus | "") => void;
  onStatus: (id: string, status: EntryStatus) => void;
  onDelete: (id: string) => void;
  locale: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-white border border-sky-100 rounded-xl p-3">
        <span className="text-xs text-slate-600">{t("entries.filter")}:</span>
        {(
          [
            { id: "", label: t("entries.all") },
            { id: "pending", label: t("status.pending") },
            { id: "approved", label: t("status.approved") },
            { id: "paid", label: t("status.paid") },
            { id: "cancelled", label: t("status.cancelled") },
          ] as { id: EntryStatus | ""; label: string }[]
        ).map((f, i) => (
          <button
            key={i}
            onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1 rounded text-xs font-medium ${
              statusFilter === f.id
                ? "bg-cyan-600 text-white"
                : "bg-sky-50 text-slate-700 hover:bg-sky-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="bg-white border border-sky-100 rounded-xl py-16 text-center text-slate-500">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
          <p className="text-sm">{t("entries.empty")}</p>
        </div>
      ) : (
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 border-b border-sky-100">
                <tr className="text-left rtl:text-right text-xs uppercase text-slate-600">
                  <th className="px-4 py-3 font-semibold">
                    {t("entries.col.date")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("entries.col.user")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("entries.col.deal")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("entries.col.rule")}
                  </th>
                  <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                    {t("entries.col.amount")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("entries.col.status")}
                  </th>
                  <th className="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, idx) => {
                  const meta = STATUS_META[e.status];
                  const Icon = meta.Icon;
                  return (
                    <tr
                      key={idx}
                      className="border-b border-sky-50 hover:bg-sky-50/40"
                    >
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {formatDate(e.createdAt, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-cyan-900">
                          {e.user.fullName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-sm max-w-xs truncate">
                        {e.deal.title}
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-xs">
                        {e.rule.name}
                      </td>
                      <td className="px-4 py-3 ltr:text-right rtl:text-left font-bold text-cyan-900">
                        {formatMoney(Number(e.amount), e.currency, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                        >
                          <Icon className="w-3 h-3" />
                          {t(`status.${e.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 ltr:justify-end rtl:justify-start">
                          {e.status === "pending" && (
                            <button
                              onClick={() => onStatus(e.id, "approved")}
                              title={t("actions.approve")}
                              className="p-1 text-slate-400 hover:text-sky-600"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {(e.status === "approved" ||
                            e.status === "pending") && (
                            <button
                              onClick={() => onStatus(e.id, "paid")}
                              title={t("actions.markPaid")}
                              className="p-1 text-slate-400 hover:text-emerald-600"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(e.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Stats View
// ============================================================================
function StatsView({
  t,
  stats,
}: {
  t: ReturnType<typeof useTranslations>;
  stats: CommissionStats;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Clock}
          label={t("stats.pending")}
          amount={stats.pendingAmount}
          count={stats.pendingCount}
          color="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label={t("stats.approved")}
          amount={stats.approvedAmount}
          count={stats.approvedCount}
          color="sky"
        />
        <StatCard
          icon={DollarSign}
          label={t("stats.paid")}
          amount={stats.paidAmount}
          count={stats.paidCount}
          color="emerald"
        />
      </div>

      <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-sky-100 bg-sky-50/50 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-cyan-900">
            {t("stats.topUsers")}
          </h3>
        </div>
        {stats.topUsers.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            {t("stats.noUsers")}
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {stats.topUsers.map((u, idx) => (
              <div
                key={idx}
                className="px-5 py-3 flex items-center gap-3 hover:bg-sky-50/30"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-700 font-bold text-sm flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-cyan-900 truncate">
                    {u.user.fullName}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {u.count} {t("stats.entries")}
                  </div>
                </div>
                <div className="font-bold text-emerald-700">
                  {formatMoneyShort(u.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  amount,
  count,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  amount: number;
  count: number;
  color: "amber" | "sky" | "emerald";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
    sky: { iconBg: "bg-sky-50", iconText: "text-sky-600" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  };
  const c = colors[color];
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-2xl font-bold text-cyan-900">
        {formatMoneyShort(amount)}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">
        {count} {count === 1 ? "entry" : "entries"}
      </div>
    </div>
  );
}

// ============================================================================
// Rule Modal
// ============================================================================
function RuleModal({
  t,
  editing,
  onClose,
  onSaved,
}: {
  t: ReturnType<typeof useTranslations>;
  editing: CommissionRule | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    description: editing?.description ?? "",
    type: (editing?.type ?? "percent") as CommissionType,
    rate: String(editing?.config?.rate ?? 10),
    amount: String(editing?.config?.amount ?? 1000),
    tiers: (editing?.config?.tiers ?? [
      { from: 0, to: 10000, rate: 5 },
      { from: 10000, rate: 10 },
    ]) as { from: number; to?: number; rate: number }[],
    appliesTo: (editing?.appliesTo ?? "all") as AppliesTo,
    appliesToValue: editing?.appliesToValue ?? "",
    isActive: editing?.isActive ?? true,
    priority: editing?.priority ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!form.name.trim()) {
      setErr(t("errors.enterName"));
      return;
    }
    const dto: CreateRuleDto = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      config:
        form.type === "percent"
          ? { rate: Number(form.rate) }
          : form.type === "flat"
            ? { amount: Number(form.amount) }
            : { tiers: form.tiers },
      appliesTo: form.appliesTo,
      appliesToValue: form.appliesToValue.trim() || undefined,
      isActive: form.isActive,
      priority: form.priority,
    };
    setSaving(true);
    setErr(null);
    try {
      if (editing) {
        await updateRule(editing.id, dto);
      } else {
        await createRule(dto);
      }
      await onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const updateTier = (
    idx: number,
    patch: Partial<{ from: number; to?: number; rate: number }>
  ) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((tr, i) => (i === idx ? { ...tr, ...patch } : tr)),
    }));
  };

  const addTier = () => {
    setForm((f) => ({
      ...f,
      tiers: [
        ...f.tiers,
        { from: f.tiers[f.tiers.length - 1]?.to ?? 0, rate: 10 },
      ],
    }));
  };

  const removeTier = (idx: number) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cyan-900">
            {editing ? t("modal.editTitle") : t("modal.createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("modal.name")} *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("modal.namePlaceholder")}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("modal.description")}
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              {t("modal.type")} *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["percent", "flat", "tiered"] as CommissionType[]).map((ty) => {
                const active = form.type === ty;
                return (
                  <button
                    key={ty}
                    onClick={() => setForm({ ...form, type: ty })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? "bg-cyan-50 text-cyan-700 border-cyan-300"
                        : "bg-white text-slate-600 border-sky-200 hover:border-sky-400"
                    }`}
                  >
                    {t(`modal.types.${ty}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {form.type === "percent" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("modal.rate")} (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}

          {form.type === "flat" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("modal.amount")}
              </label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}

          {form.type === "tiered" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">
                  {t("modal.tiers")}
                </label>
                <button
                  onClick={addTier}
                  className="text-xs text-cyan-700 hover:text-cyan-800 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {t("modal.addTier")}
                </button>
              </div>
              <div className="space-y-2">
                {form.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="bg-sky-50/30 border border-sky-100 rounded-lg p-2 grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="number"
                      value={tier.from}
                      onChange={(e) =>
                        updateTier(idx, { from: Number(e.target.value) })
                      }
                      placeholder={t("modal.from")}
                      className="col-span-4 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none"
                    />
                    <input
                      type="number"
                      value={tier.to ?? ""}
                      onChange={(e) =>
                        updateTier(idx, {
                          to: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("modal.to")}
                      className="col-span-4 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none"
                    />
                    <div className="col-span-3 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={tier.rate}
                        onChange={(e) =>
                          updateTier(idx, { rate: Number(e.target.value) })
                        }
                        className="flex-1 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                    <button
                      onClick={() => removeTier(idx)}
                      className="col-span-1 flex items-center justify-center text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("modal.appliesTo")}
              </label>
              <select
                value={form.appliesTo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    appliesTo: e.target.value as AppliesTo,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">{t("modal.applies.all")}</option>
                <option value="deal_stage">
                  {t("modal.applies.deal_stage")}
                </option>
                <option value="min_value">
                  {t("modal.applies.min_value")}
                </option>
              </select>
            </div>
            {form.appliesTo !== "all" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {form.appliesTo === "deal_stage"
                    ? t("modal.stageValue")
                    : t("modal.minValue")}
                </label>
                <input
                  type="text"
                  value={form.appliesToValue}
                  onChange={(e) =>
                    setForm({ ...form, appliesToValue: e.target.value })
                  }
                  placeholder={
                    form.appliesTo === "deal_stage" ? "won" : "50000"
                  }
                  className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-sky-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-700">
                {t("modal.isActive")}
              </span>
            </label>
          </div>

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
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editing ? t("actions.save") : t("actions.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function formatMoney(
  amount: number,
  currency: string,
  locale: string
): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatMoneyShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
