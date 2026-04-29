"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchTicketStats,
  fetchTickets,
  updateTicket,
  closeTicket,
  type SupportTicket,
  type TicketStats,
  type Paginated,
} from "@/lib/api/admin";
import {
  LifeBuoy,
  Loader2,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Archive,
  Filter,
} from "lucide-react";

// ============================================================================
// ADMIN SUPPORT TICKETS VIEW
// ============================================================================

const STATUS_META: Record<string, { bg: string; text: string; ring: string }> =
  {
    open: { bg: "bg-muted", text: "text-cyan-300", ring: "ring-cyan-500/30" },
    in_progress: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      ring: "ring-amber-500/30",
    },
    resolved: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      ring: "ring-emerald-500/30",
    },
    closed: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      ring: "ring-border",
    },
  };

const PRIORITY_META: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-muted", text: "text-muted-foreground" },
  medium: { bg: "bg-muted", text: "text-cyan-300" },
  high: { bg: "bg-amber-500/10", text: "text-amber-300" },
  urgent: { bg: "bg-rose-500/10", text: "text-rose-300" },
};

interface Props {
  locale: string;
}

export default function AdminSupportView({ locale }: Props) {
  const t = useTranslations("Admin.support");

  const [stats, setStats] = useState<TicketStats | null>(null);
  const [data, setData] = useState<Paginated<SupportTicket> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params: {
        limit: number;
        status?: string;
        priority?: string;
      } = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const [s, d] = await Promise.all([
        fetchTicketStats(),
        fetchTickets(params),
      ]);
      setStats(s);
      setData(d);
    } catch (err) {
      console.error(err);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter]);

  async function handleStatusChange(tk: SupportTicket, newStatus: string) {
    try {
      await updateTicket(tk.id, { status: newStatus });
      await load();
    } catch (err) {
      console.error(err);
      alert(t("updateError"));
    }
  }

  async function handleClose(tk: SupportTicket) {
    if (!confirm(t("confirmClose"))) return;
    try {
      await closeTicket(tk.id);
      await load();
    } catch (err) {
      console.error(err);
      alert(t("updateError"));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            icon={AlertOctagon}
            color="red"
            label={t("urgent")}
            value={stats.urgent}
          />
          <StatCard
            icon={LifeBuoy}
            color="sky"
            label={t("statusOpen")}
            value={stats.open}
          />
          <StatCard
            icon={Clock}
            color="amber"
            label={t("statusInProgress")}
            value={stats.inProgress}
          />
          <StatCard
            icon={CheckCircle2}
            color="emerald"
            label={t("statusResolved")}
            value={stats.resolved}
          />
          <StatCard
            icon={Archive}
            color="slate"
            label={t("statusClosed")}
            value={stats.closed}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Filter size={14} />
          {t("filters")}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="open">{t("statusOpen")}</option>
          <option value="in_progress">{t("statusInProgress")}</option>
          <option value="resolved">{t("statusResolved")}</option>
          <option value="closed">{t("statusClosed")}</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">{t("allPriorities")}</option>
          <option value="urgent">{t("priority.urgent")}</option>
          <option value="high">{t("priority.high")}</option>
          <option value="medium">{t("priority.medium")}</option>
          <option value="low">{t("priority.low")}</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-cyan-300" size={28} />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl bg-card border border-border p-10 text-center">
          <LifeBuoy
            size={32}
            className="mx-auto text-sky-300"
            strokeWidth={1.5}
          />
          <p className="mt-3 text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("subject")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("company")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("priorityHeader")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("status")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("createdAt")}
                  </th>
                  <th className="px-4 py-3 text-end font-semibold">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {data.items.map((tk) => {
                  const statusM = STATUS_META[tk.status] ?? STATUS_META.open;
                  const priM = PRIORITY_META[tk.priority] ?? PRIORITY_META.medium;
                  return (
                    <tr key={tk.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-medium text-foreground truncate">
                          {tk.subject}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {tk.createdBy.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {tk.company.name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {tk.company.plan}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priM.bg} ${priM.text} capitalize`}
                        >
                          {t(`priority.${tk.priority}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={tk.status}
                          onChange={(e) =>
                            handleStatusChange(tk, e.target.value)
                          }
                          className={`rounded-md ring-1 px-2 py-1 text-xs font-semibold border-0 ${statusM.bg} ${statusM.text} ${statusM.ring} focus:outline-none cursor-pointer`}
                        >
                          <option value="open">{t("statusOpen")}</option>
                          <option value="in_progress">
                            {t("statusInProgress")}
                          </option>
                          <option value="resolved">
                            {t("statusResolved")}
                          </option>
                          <option value="closed">{t("statusClosed")}</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(tk.createdAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-end">
                        {tk.status !== "closed" && (
                          <button
                            onClick={() => handleClose(tk)}
                            className="text-xs font-semibold text-muted-foreground hover:text-rose-300"
                          >
                            {t("close")}
                          </button>
                        )}
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

// ─────────────────────────────────────────────────────────────────────────
type StatColor = "red" | "sky" | "amber" | "emerald" | "slate";
const STAT_COLOR: Record<StatColor, { bg: string; text: string; ring: string }> =
  {
    red: { bg: "bg-rose-500/10", text: "text-rose-300", ring: "ring-red-100" },
    sky: { bg: "bg-muted", text: "text-cyan-300", ring: "ring-sky-100" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-100" },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      ring: "ring-emerald-100",
    },
    slate: { bg: "bg-muted", text: "text-foreground", ring: "ring-slate-100" },
  };

function StatCard({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof LifeBuoy;
  color: StatColor;
  label: string;
  value: number;
}) {
  const c = STAT_COLOR[color];
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={16} className={c.text} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold text-foreground">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
