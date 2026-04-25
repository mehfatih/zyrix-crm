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
        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <FileText className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-sky-900">{t("title")}</h1>
          <p className="text-sm text-slate-500">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-sky-100 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
              <Filter className="size-3" />
              {t("filterAction")}
            </label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
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
            <label className="mb-1 block text-xs font-medium text-slate-600">
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-sky-500" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          {t("noLogs")}
        </div>
      ) : (
        <div className="rounded-xl border border-sky-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sky-50">
                <tr className="text-left text-xs font-medium uppercase text-slate-600">
                  <th className="px-4 py-2.5">{t("action")}</th>
                  <th className="px-4 py-2.5">{t("user")}</th>
                  <th className="px-4 py-2.5">{t("company")}</th>
                  <th className="px-4 py-2.5">{t("entity")}</th>
                  <th className="px-4 py-2.5">{t("timestamp")}</th>
                  <th className="px-4 py-2.5 text-right">{t("changes")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasChanges =
                    log.changes && Object.keys(log.changes).length > 0;
                  return (
                    <>
                      <tr
                        key={log.id}
                        className="hover:bg-sky-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                            {log.action}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {log.user ? (
                            <div>
                              <div className="font-medium">
                                {log.user.fullName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {log.user.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              {t("system")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {log.company?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
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
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(log.createdAt).toLocaleString(locale)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {hasChanges ? (
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : log.id)
                              }
                              className="inline-flex items-center gap-1 rounded text-xs font-medium text-sky-600 hover:text-sky-900"
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
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && hasChanges && (
                        <tr key={`${log.id}-details`} className="bg-slate-50">
                          <td colSpan={6} className="px-4 py-3">
                            <pre className="overflow-x-auto rounded-lg bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200">
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
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
            <div className="text-slate-600">
              {data.pagination.total.toLocaleString()} total
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={data.pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-slate-200 p-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} className="rtl:rotate-180" />
              </button>
              <span className="text-slate-600">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() =>
                  setPage((p) =>
                    Math.min(data.pagination.totalPages, p + 1)
                  )
                }
                className="rounded border border-slate-200 p-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
