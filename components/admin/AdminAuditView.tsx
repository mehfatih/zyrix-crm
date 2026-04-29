"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  fetchAuditLogs,
  type AuditLog,
  type Paginated,
} from "@/lib/api/admin";
import {
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ============================================================================
// ADMIN AUDIT LOG VIEW
// ============================================================================

const ACTION_OPTIONS = [
  "admin.company.update",
  "admin.company.suspend",
  "admin.company.resume",
  "admin.company.delete",
  "admin.company.impersonate",
  "admin.user.update",
  "admin.user.disable",
  "admin.user.enable",
  "admin.user.force_reset_password",
  "admin.plan.update",
  "admin.plan_override.create",
  "admin.plan_override.delete",
  "admin.bootstrap",
  "admin.login",
];

interface Props {
  locale: string;
}

export default function AdminAuditView({ locale }: Props) {
  const t = useTranslations("Admin.audit");

  const [data, setData] = useState<Paginated<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [companyIdFilter, setCompanyIdFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queryKey = useMemo(
    () => `${page}|${actionFilter}|${companyIdFilter}`,
    [page, actionFilter, companyIdFilter]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAuditLogs({
      page,
      limit: 50,
      action: actionFilter || undefined,
      companyId: companyIdFilter || undefined,
    })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError(t("loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-cyan-300">
          <FileText className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Filter className="size-3" />
              {t("filterAction")}
            </label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{t("allActions")}</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {t("filterCompany")}
            </label>
            <input
              type="text"
              value={companyIdFilter}
              onChange={(e) => {
                setCompanyIdFilter(e.target.value);
                setPage(1);
              }}
              placeholder="company-uuid"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-cyan-300" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          {t("noLogs")}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr className="text-left text-xs font-medium uppercase text-muted-foreground">
                  <th className="px-4 py-2.5">{t("action")}</th>
                  <th className="px-4 py-2.5">{t("user")}</th>
                  <th className="px-4 py-2.5">{t("company")}</th>
                  <th className="px-4 py-2.5">{t("entity")}</th>
                  <th className="px-4 py-2.5">{t("timestamp")}</th>
                  <th className="px-4 py-2.5 text-right">{t("changes")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasChanges =
                    log.changes && Object.keys(log.changes).length > 0;
                  return (
                    <>
                      <tr
                        key={log.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                            {log.action}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {log.user ? (
                            <div>
                              <div className="font-medium">
                                {log.user.fullName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {log.user.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground">
                              {t("system")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {log.company?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {log.entityType && (
                            <div>
                              <div>{log.entityType}</div>
                              {log.entityId && (
                                <div className="font-mono text-[10px]">
                                  {log.entityId.slice(0, 8)}…
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString(locale)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {hasChanges ? (
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : log.id)
                              }
                              className="inline-flex items-center gap-1 rounded text-xs font-medium text-cyan-300 hover:text-foreground"
                            >
                              {isExpanded ? (
                                <>
                                  {t("hideChanges")}
                                  <ChevronUp className="size-3" />
                                </>
                              ) : (
                                <>
                                  {t("viewChanges")}
                                  <ChevronDown className="size-3" />
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && hasChanges && (
                        <tr key={`${log.id}-details`} className="bg-muted">
                          <td colSpan={6} className="px-4 py-3">
                            <pre className="overflow-x-auto rounded-lg bg-card p-3 text-xs text-foreground ring-1 ring-border">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
            <div className="text-muted-foreground">
              {data.pagination.total.toLocaleString()} total
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={data.pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-border p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} className="rtl:rotate-180" />
              </button>
              <span className="text-muted-foreground">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() =>
                  setPage((p) =>
                    Math.min(data.pagination.totalPages, p + 1)
                  )
                }
                className="rounded border border-border p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} className="rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
