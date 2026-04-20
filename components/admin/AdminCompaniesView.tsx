"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  fetchCompanies,
  suspendCompany,
  resumeCompany,
  deleteCompany,
  type AdminCompanyListItem,
  type Paginated,
} from "@/lib/api/admin";
import {
  Search,
  Building2,
  Loader2,
  Play,
  Pause,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

// ============================================================================
// ADMIN COMPANIES VIEW
// ============================================================================

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  suspended: "bg-amber-50 text-amber-700 ring-amber-200",
  trial: "bg-sky-50 text-sky-700 ring-sky-200",
  deleted: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function AdminCompaniesView() {
  const t = useTranslations("Admin.companies");
  const tStatus = useTranslations("Admin.status");
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  const [data, setData] = useState<Paginated<AdminCompanyListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const [action, setAction] = useState<{
    type: "suspend" | "delete";
    company: AdminCompanyListItem;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [banner, setBanner] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const queryKey = useMemo(
    () => `${search}|${statusFilter}|${planFilter}|${page}`,
    [search, statusFilter, planFilter, page]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCompanies({
      search: search || undefined,
      status: statusFilter || undefined,
      plan: planFilter || undefined,
      page,
      limit: 20,
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

  async function handleConfirmAction() {
    if (!action) return;
    setActionBusy(true);
    try {
      if (action.type === "suspend") {
        if (action.company.status === "suspended") {
          await resumeCompany(action.company.id);
          setBanner({ tone: "success", text: t("resumed") });
        } else {
          await suspendCompany(action.company.id, actionReason || undefined);
          setBanner({ tone: "success", text: t("suspended") });
        }
      } else if (action.type === "delete") {
        await deleteCompany(action.company.id);
        setBanner({ tone: "success", text: t("deleted") });
      }
      setAction(null);
      setActionReason("");
      // Refresh
      const res = await fetchCompanies({
        search: search || undefined,
        status: statusFilter || undefined,
        plan: planFilter || undefined,
        page,
        limit: 20,
      });
      setData(res);
    } catch {
      setBanner({ tone: "error", text: "Action failed." });
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
        </div>
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`rounded-lg p-3 text-sm ${
            banner.tone === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
          onAnimationEnd={() => setBanner(null)}
        >
          {banner.text}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl bg-white border border-cyan-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("search")}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-2 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white text-slate-900 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="active">{tStatus("active")}</option>
            <option value="suspended">{tStatus("suspended")}</option>
            <option value="trial">{tStatus("trial")}</option>
            <option value="deleted">{tStatus("deleted")}</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white text-slate-900 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">{t("allPlans")}</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="business">Business</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-cyan-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-cyan-600" size={24} />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-700">{error}</div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Building2 size={36} className="mb-2 text-slate-300" />
            <p className="text-sm">{t("noResults")}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <Th>{t("name")}</Th>
                    <Th>{t("plan")}</Th>
                    <Th>{t("status")}</Th>
                    <Th>{t("users")}</Th>
                    <Th>{t("customers")}</Th>
                    <Th>{t("createdAt")}</Th>
                    <Th className="text-right">{t("actions")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((c) => (
                    <tr key={c.id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/${locale}/admin/companies/${c.id}`}
                          className="block"
                        >
                          <div className="font-medium text-slate-900 hover:text-cyan-700">
                            {c.name}
                          </div>
                          <div className="text-xs text-slate-500">{c.slug}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200 px-2 py-0.5 text-xs font-medium capitalize">
                          {c.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[c.status] ??
                            "bg-slate-100 text-slate-700 ring-slate-200"
                          }`}
                        >
                          {tStatus(c.status as "active")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {c._count.users}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {c._count.customers}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/${locale}/admin/companies/${c.id}`}
                            className="p-1.5 rounded hover:bg-cyan-50 text-cyan-600"
                            title={t("view")}
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              setAction({ type: "suspend", company: c })
                            }
                            className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                            title={
                              c.status === "suspended"
                                ? t("resume")
                                : t("suspend")
                            }
                          >
                            {c.status === "suspended" ? (
                              <Play size={16} />
                            ) : (
                              <Pause size={16} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              setAction({ type: "delete", company: c })
                            }
                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                            title={t("delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                  className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm modal */}
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              {action.type === "delete"
                ? t("confirmDelete")
                : action.company.status === "suspended"
                ? t("resume")
                : t("confirmSuspend")}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {action.type === "delete"
                ? t("confirmDeleteMessage")
                : action.company.status === "suspended"
                ? ""
                : t("confirmSuspendMessage")}
            </p>
            <div className="mt-3 rounded-lg bg-sky-50 p-3 text-sm">
              <div className="font-medium text-slate-900">
                {action.company.name}
              </div>
              <div className="text-xs text-slate-500">
                {action.company.slug}
              </div>
            </div>

            {action.type === "suspend" &&
              action.company.status !== "suspended" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("suspendReason")}
                  </label>
                  <input
                    type="text"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setAction(null);
                  setActionReason("");
                }}
                disabled={actionBusy}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionBusy}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  action.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                } disabled:opacity-50`}
              >
                {actionBusy ? "..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-start text-xs font-semibold text-slate-600 uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}
