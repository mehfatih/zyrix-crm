"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Award,
  Loader2,
  Users,
  TrendingUp,
  Gift,
  Settings2,
  Plus,
  Trash2,
  Trophy,
  Sparkles,
  Star,
  X,
  AlertTriangle,
  Save,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import {
  fetchLoyaltyProgram,
  upsertLoyaltyProgram,
  fetchLoyaltyStats,
  fetchLoyaltyTransactions,
  fetchTopMembers,
  createLoyaltyTransaction,
  deleteLoyaltyTransaction,
  type LoyaltyProgram,
  type LoyaltyStats,
  type LoyaltyTransaction,
  type LoyaltyTxnType,
  type TopMember,
  type LoyaltyTier,
  type CreateTxnDto,
} from "@/lib/api/loyalty";
import { listCustomers, type Customer } from "@/lib/api/customers";
import { extractErrorMessage } from "@/lib/errors";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  TopFiveHero,
  type TopFiveItem,
} from "@/components/shared/TopFiveHero";

// ============================================================================
// LOYALTY PAGE
// ============================================================================

type Tab = "overview" | "members" | "transactions" | "program";

const TXN_META: Record<
  LoyaltyTxnType,
  { bg: string; text: string; ring: string; Icon: typeof Award }
> = {
  earn: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    ring: "ring-emerald-500/30",
    Icon: PlusCircle,
  },
  redeem: {
    bg: "bg-muted",
    text: "text-cyan-300",
    ring: "ring-cyan-500/30",
    Icon: Gift,
  },
  adjust: {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    ring: "ring-amber-500/30",
    Icon: RefreshCw,
  },
  expire: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    ring: "ring-border",
    Icon: Calendar,
  },
};

export default function LoyaltyPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Loyalty");

  const [tab, setTab] = useState<Tab>("overview");
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [txns, setTxns] = useState<LoyaltyTransaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [txnModalOpen, setTxnModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, s, m, tx, c] = await Promise.all([
        fetchLoyaltyProgram(),
        fetchLoyaltyStats(),
        fetchTopMembers(10),
        fetchLoyaltyTransactions({ limit: 100 }),
        listCustomers({ limit: 100 }),
      ]);
      setProgram(p);
      setStats(s);
      setTopMembers(m);
      setTxns(tx.items);
      setCustomers(c.customers);
    } catch (e) {
      setError(extractErrorMessage(e) || "Failed to load loyalty data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTxnCreated = async () => {
    setTxnModalOpen(false);
    await load();
  };

  const handleDeleteTxn = async (id: string) => {
    if (!confirm(t("confirm.deleteTxn"))) return;
    try {
      await deleteLoyaltyTransaction(id);
      await load();
    } catch (e) {
      alert(extractErrorMessage(e) || "Failed");
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-rose-300 text-xs font-bold uppercase tracking-widest mb-2">LOYALTY PROGRAM</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-300" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => setTxnModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("newTransaction")}
          </button>
        </div>

        {/* Program inactive banner */}
        {program && !program.isActive && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900">
                {t("banner.inactiveTitle")}
              </div>
              <div className="text-xs text-amber-300">
                {t("banner.inactiveSubtitle")}
              </div>
            </div>
            <button
              onClick={() => setTab("program")}
              className="text-sm text-amber-300 hover:text-amber-800 font-medium whitespace-nowrap"
            >
              {t("banner.configure")} →
            </button>
          </div>
        )}

        {/* Top 5 hero */}
        <TopFiveHero
          eyebrow="TOP 5 LOYAL CUSTOMERS"
          title="Highest balance members"
          accentText="text-rose-300"
          items={topMembers.map<TopFiveItem>((m) => ({
            id: m.customer.id,
            primary: m.customer.fullName,
            secondary: m.customer.companyName ?? undefined,
            metric: m.balance,
            metricLabel: "pts",
          }))}
          chartTitle="POINTS BALANCE"
          chartSubtitle="Top 5 member balances"
          formatMetric={(v) => v.toLocaleString()}
        />

        {/* Tabs */}
        <div className="border-b border-border flex gap-1 overflow-x-auto">
          {(
            [
              { id: "overview", label: t("tabs.overview"), Icon: TrendingUp },
              { id: "members", label: t("tabs.members"), Icon: Users },
              {
                id: "transactions",
                label: t("tabs.transactions"),
                Icon: Gift,
              },
              { id: "program", label: t("tabs.program"), Icon: Settings2 },
            ] as { id: Tab; label: string; Icon: typeof Award }[]
          ).map((tb) => {
            const active = tab === tb.id;
            const Icon = tb.Icon;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? "border-cyan-500 text-cyan-300"
                    : "border-transparent text-muted-foreground hover:text-cyan-300"
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
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-300 bg-rose-500/10 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <OverviewTab
                t={t}
                stats={stats}
                program={program}
                topMembers={topMembers}
                locale={locale}
              />
            )}
            {tab === "members" && (
              <MembersTab t={t} topMembers={topMembers} program={program} />
            )}
            {tab === "transactions" && (
              <TransactionsTab
                t={t}
                txns={txns}
                onDelete={handleDeleteTxn}
                locale={locale}
              />
            )}
            {tab === "program" && (
              <ProgramTab
                t={t}
                program={program}
                onSaved={async () => {
                  await load();
                }}
              />
            )}
          </>
        )}
      </div>

      {txnModalOpen && (
        <TransactionModal
          t={t}
          customers={customers}
          onClose={() => setTxnModalOpen(false)}
          onCreated={handleTxnCreated}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Overview tab
// ============================================================================
function OverviewTab({
  t,
  stats,
  program,
  topMembers,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  stats: LoyaltyStats | null;
  program: LoyaltyProgram | null;
  topMembers: TopMember[];
  locale: string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={t("stats.activeMembers")}
          value={stats?.activeMembers ?? 0}
          color="cyan"
        />
        <StatCard
          icon={PlusCircle}
          label={t("stats.totalEarned")}
          value={formatNumber(stats?.totalEarned ?? 0)}
          color="emerald"
        />
        <StatCard
          icon={Gift}
          label={t("stats.totalRedeemed")}
          value={formatNumber(stats?.totalRedeemed ?? 0)}
          color="sky"
        />
        <StatCard
          icon={TrendingUp}
          label={t("stats.txnsLast30d")}
          value={stats?.txnsLast30d ?? 0}
          color="amber"
        />
      </div>

      {program && program.id && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            {t("overview.programConfig")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <ConfigBox
              label={t("program.pointsPerUnit")}
              value={`${program.pointsPerUnit} ${t("overview.ptsPer")} ${program.currency}`}
            />
            <ConfigBox
              label={t("program.redeemValue")}
              value={`${program.redeemValue} ${program.currency}`}
            />
            <ConfigBox
              label={t("program.minRedeem")}
              value={`${program.minRedeem} ${t("overview.pts")}`}
            />
            <ConfigBox
              label={t("overview.status")}
              value={
                program.isActive
                  ? t("overview.active")
                  : t("overview.inactive")
              }
            />
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-300" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("overview.topMembers")}
          </h3>
        </div>
        {topMembers.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-300/60" />
            {t("overview.noMembers")}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {topMembers.slice(0, 10).map((m, idx) => (
              <div
                key={idx}
                className="px-5 py-3 flex items-center gap-3 hover:bg-muted"
              >
                <div className="w-8 h-8 rounded-full bg-muted text-cyan-300 font-bold text-sm flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {m.customer.fullName}
                  </div>
                  {m.customer.companyName && (
                    <div className="text-xs text-muted-foreground truncate">
                      {m.customer.companyName}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {formatNumber(m.balance)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("pts")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Members tab
// ============================================================================
function MembersTab({
  t,
  topMembers,
  program,
}: {
  t: ReturnType<typeof useTranslations>;
  topMembers: TopMember[];
  program: LoyaltyProgram | null;
}) {
  const tiers = program?.tiers ?? [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {topMembers.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 text-cyan-300/60" />
          <p className="text-sm">{t("overview.noMembers")}</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr className="text-left rtl:text-right text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">{t("table.member")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.tier")}</th>
              <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                {t("table.balance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {topMembers.map((m, idx) => {
              const tier = computeTier(m.balance, tiers);
              return (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {m.customer.fullName}
                    </div>
                    {m.customer.companyName && (
                      <div className="text-xs text-muted-foreground">
                        {m.customer.companyName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {tier ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 ring-1 ring-amber-500/30 rounded text-xs font-medium">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {tier.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 ltr:text-right rtl:text-left font-bold text-foreground">
                    {formatNumber(m.balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================================================
// Transactions tab
// ============================================================================
function TransactionsTab({
  t,
  txns,
  onDelete,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  txns: LoyaltyTransaction[];
  onDelete: (id: string) => void;
  locale: string;
}) {
  if (txns.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground">
        <Gift className="w-10 h-10 mx-auto mb-3 text-cyan-300/60" />
        <p className="text-sm">{t("transactions.empty")}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr className="text-left rtl:text-right text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-semibold">{t("table.date")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.member")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.type")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.reason")}</th>
              <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                {t("table.points")}
              </th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {txns.map((tx, idx) => {
              const meta = TXN_META[tx.type];
              const Icon = meta.Icon;
              const positive = tx.points >= 0;
              return (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDateTime(tx.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {tx.customer.fullName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                    >
                      <Icon className="w-3 h-3" />
                      {t(`txnType.${tx.type}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm max-w-xs truncate">
                    {tx.reason || "—"}
                  </td>
                  <td className="px-4 py-3 ltr:text-right rtl:text-left">
                    <span
                      className={`font-bold ${
                        positive ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {formatNumber(tx.points)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-muted-foreground hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Program tab
// ============================================================================
function ProgramTab({
  t,
  program,
  onSaved,
}: {
  t: ReturnType<typeof useTranslations>;
  program: LoyaltyProgram | null;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: program?.name ?? "Loyalty Program",
    isActive: program?.isActive ?? true,
    pointsPerUnit: program?.pointsPerUnit ?? "1",
    currency: program?.currency ?? "TRY",
    minRedeem: program?.minRedeem ?? 0,
    redeemValue: program?.redeemValue ?? "0.01",
    tiers: (program?.tiers ?? []) as LoyaltyTier[],
  });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const addTier = () => {
    setForm((f) => ({
      ...f,
      tiers: [
        ...f.tiers,
        { name: `Tier ${f.tiers.length + 1}`, threshold: 1000, multiplier: 1 },
      ],
    }));
  };

  const removeTier = (idx: number) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.filter((_, i) => i !== idx),
    }));
  };

  const updateTier = (idx: number, patch: Partial<LoyaltyTier>) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((tr, i) => (i === idx ? { ...tr, ...patch } : tr)),
    }));
  };

  const save = async () => {
    setSaving(true);
    setErr(null);
    setSavedMessage(null);
    try {
      await upsertLoyaltyProgram({
        name: form.name,
        isActive: form.isActive,
        pointsPerUnit: Number(form.pointsPerUnit),
        currency: form.currency,
        minRedeem: Number(form.minRedeem),
        redeemValue: Number(form.redeemValue),
        tiers: form.tiers,
      });
      setSavedMessage(t("program.saved"));
      await onSaved();
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (e) {
      setErr(extractErrorMessage(e) || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {t("program.basics")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("program.name")}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("program.currency")}
            </label>
            <select
              value={form.currency}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SAR">SAR</option>
              <option value="AED">AED</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
            className="w-4 h-4 rounded border-border text-cyan-300 focus:ring-primary"
          />
          <span className="text-sm text-foreground">
            {t("program.isActive")}
          </span>
        </label>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {t("program.earnRedeem")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("program.pointsPerUnit")}
            </label>
            <input
              type="number"
              step="0.01"
              value={form.pointsPerUnit}
              onChange={(e) =>
                setForm({ ...form, pointsPerUnit: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("program.pointsPerUnitHint")}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("program.redeemValue")}
            </label>
            <input
              type="number"
              step="0.0001"
              value={form.redeemValue}
              onChange={(e) =>
                setForm({ ...form, redeemValue: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("program.redeemValueHint")}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("program.minRedeem")}
            </label>
            <input
              type="number"
              value={form.minRedeem}
              onChange={(e) =>
                setForm({ ...form, minRedeem: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">
            {t("program.tiers")}
          </h3>
          <button
            onClick={addTier}
            className="text-xs text-cyan-300 hover:text-foreground font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            {t("program.addTier")}
          </button>
        </div>
        {form.tiers.length === 0 ? (
          <div className="text-xs text-muted-foreground bg-muted/40 border border-border rounded-lg p-4 text-center">
            {t("program.noTiers")}
          </div>
        ) : (
          <div className="space-y-2">
            {form.tiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-muted/40 border border-border rounded-lg p-3 grid grid-cols-12 gap-2 items-center"
              >
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) =>
                    updateTier(idx, { name: e.target.value })
                  }
                  placeholder={t("program.tierName")}
                  className="col-span-4 px-2 py-1.5 text-sm border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="col-span-3 flex items-center gap-1">
                  <input
                    type="number"
                    value={tier.threshold}
                    onChange={(e) =>
                      updateTier(idx, {
                        threshold: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-2 py-1.5 text-sm border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {t("pts")}
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={tier.multiplier}
                    onChange={(e) =>
                      updateTier(idx, {
                        multiplier: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-2 py-1.5 text-sm border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    × {t("program.multiplier")}
                  </span>
                </div>
                <button
                  onClick={() => removeTier(idx)}
                  className="col-span-1 flex items-center justify-center text-muted-foreground hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {err && (
        <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm p-3 rounded-lg border border-red-100 whitespace-pre-line">
          {err}
        </div>
      )}
      {savedMessage && (
        <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-sm p-3 rounded-lg border border-emerald-500/30">
          ✓ {savedMessage}
        </div>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {t("program.save")}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Transaction modal
// ============================================================================
function TransactionModal({
  t,
  customers,
  onClose,
  onCreated,
}: {
  t: ReturnType<typeof useTranslations>;
  customers: Customer[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [form, setForm] = useState<{
    customerId: string;
    type: LoyaltyTxnType;
    points: string;
    reason: string;
  }>({
    customerId: "",
    type: "earn",
    points: "100",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!form.customerId) {
      setErr(t("errors.selectCustomer"));
      return;
    }
    const pts = Number(form.points);
    if (!pts || pts === 0) {
      setErr(t("errors.enterPoints"));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const dto: CreateTxnDto = {
        customerId: form.customerId,
        type: form.type,
        points: Math.abs(pts),
        reason: form.reason.trim() || undefined,
      };
      await createLoyaltyTransaction(dto);
      await onCreated();
    } catch (e) {
      setErr(extractErrorMessage(e) || "Failed");
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
        className="bg-card rounded-xl shadow-xl max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {t("transactions.newTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.customer")} *
            </label>
            <select
              value={form.customerId}
              onChange={(e) =>
                setForm({ ...form, customerId: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("form.selectCustomer")}</option>
              {customers.map((c, idx) => (
                <option key={idx} value={c.id}>
                  {c.fullName}
                  {c.companyName ? ` — ${c.companyName}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.type")} *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["earn", "redeem", "adjust", "expire"] as LoyaltyTxnType[]).map(
                (ty) => {
                  const active = form.type === ty;
                  const meta = TXN_META[ty];
                  const Icon = meta.Icon;
                  return (
                    <button
                      key={ty}
                      onClick={() => setForm({ ...form, type: ty })}
                      className={`px-2 py-2 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                        active
                          ? `${meta.bg} ${meta.text} border-current`
                          : "bg-card text-muted-foreground border-border hover:border-cyan-500/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t(`txnType.${ty}`)}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.points")} *
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("form.pointsHint")}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.reason")}
            </label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder={t("form.reasonPlaceholder")}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {err && (
            <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm p-2 rounded-lg border border-red-100 whitespace-pre-line">
              {err}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("actions.create")}
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
  icon: typeof Award;
  label: string;
  value: string | number;
  color: "cyan" | "sky" | "emerald" | "amber";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-muted", iconText: "text-cyan-300" },
    sky: { iconBg: "bg-muted", iconText: "text-cyan-300" },
    emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-300" },
    amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-300" },
  };
  const c = colors[color];
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-lg font-bold text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}

function ConfigBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 border border-border rounded-lg px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function computeTier(
  balance: number,
  tiers: LoyaltyTier[]
): LoyaltyTier | null {
  if (!tiers || tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => b.threshold - a.threshold);
  return sorted.find((t) => balance >= t.threshold) ?? null;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function formatDateTime(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleString(loc, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
