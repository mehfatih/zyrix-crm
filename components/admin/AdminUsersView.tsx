"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchUsers,
  disableUser,
  enableUser,
  forceResetPassword,
  type AdminUserListItem,
  type Paginated,
} from "@/lib/api/admin";
import {
  Search,
  Users as UsersIcon,
  Loader2,
  UserX,
  UserCheck,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Info,
} from "lucide-react";

// ============================================================================
// ADMIN USERS VIEW
// ============================================================================

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 ring-emerald-500/30",
  disabled: "bg-muted text-muted-foreground ring-border",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-rose-500/10 text-rose-300 border border-rose-500/30 ring-rose-500/30",
  owner: "bg-muted text-cyan-300 ring-cyan-500/30",
  admin: "bg-muted text-cyan-300 ring-cyan-500/30",
  manager: "bg-indigo-500/10 text-indigo-700 ring-indigo-200",
  member: "bg-muted text-foreground ring-border",
};

export default function AdminUsersView() {
  const t = useTranslations("Admin.users");
  const tStatus = useTranslations("Admin.status");
  const tRole = useTranslations("Admin.role");

  const [data, setData] = useState<Paginated<AdminUserListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [confirm, setConfirm] = useState<{
    type: "disable" | "enable" | "reset";
    user: AdminUserListItem;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [banner, setBanner] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const queryKey = useMemo(
    () => `${search}|${roleFilter}|${statusFilter}|${page}`,
    [search, roleFilter, statusFilter, page]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchUsers({
      search: search || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      page,
      limit: 20,
    })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load users.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  async function refresh() {
    const res = await fetchUsers({
      search: search || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      page,
      limit: 20,
    });
    setData(res);
  }

  async function handleConfirm() {
    if (!confirm) return;
    setActionBusy(true);
    try {
      if (confirm.type === "disable") {
        await disableUser(confirm.user.id, actionReason || undefined);
        setBanner({ tone: "success", text: t("disabled") });
        setConfirm(null);
        setActionReason("");
        await refresh();
      } else if (confirm.type === "enable") {
        await enableUser(confirm.user.id);
        setBanner({ tone: "success", text: t("enabled") });
        setConfirm(null);
        await refresh();
      } else if (confirm.type === "reset") {
        const res = await forceResetPassword(confirm.user.id);
        setTempPassword(res.tempPassword);
        setConfirm(null);
        await refresh();
      }
    } catch {
      setBanner({ tone: "error", text: "Action failed." });
    } finally {
      setActionBusy(false);
    }
  }

  async function copyPassword() {
    if (!tempPassword) return;
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`rounded-lg p-3 text-sm ${
            banner.tone === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-800"
              : "bg-rose-500/10 border border-rose-500/30 text-red-800"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl bg-card border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("search")}
              className="w-full rounded-lg border border-border bg-card text-foreground py-2 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card text-foreground py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allRoles")}</option>
            <option value="super_admin">{tRole("super_admin")}</option>
            <option value="owner">{tRole("owner")}</option>
            <option value="admin">{tRole("admin")}</option>
            <option value="manager">{tRole("manager")}</option>
            <option value="member">{tRole("member")}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card text-foreground py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="active">{tStatus("active")}</option>
            <option value="disabled">{tStatus("disabled")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-cyan-300" size={24} />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-300">{error}</div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UsersIcon size={36} className="mb-2 text-slate-300" />
            <p className="text-sm">{t("noResults")}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <Th>{t("email")}</Th>
                    <Th>
                      <span className="inline-flex items-center gap-1">
                        {t("role")}
                        <span
                          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-cyan-300 cursor-help"
                          title={t("roleTooltip")}
                        >
                          <Info size={12} />
                        </span>
                      </span>
                    </Th>
                    <Th>{t("status")}</Th>
                    <Th>{t("company")}</Th>
                    <Th>{t("lastLogin")}</Th>
                    <Th className="text-right">{t("actions")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.fullName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-xs font-medium ${
                            ROLE_COLORS[u.role] ??
                            "bg-muted text-foreground ring-border"
                          }`}
                        >
                          {tRole(u.role as "member")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[u.status] ??
                            "bg-muted text-foreground ring-border"
                          }`}
                        >
                          {tStatus(u.status as "active")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-foreground">
                          {u.company.name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {u.company.plan}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString()
                          : t("never")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {u.role !== "super_admin" && (
                            <>
                              {u.status === "active" ? (
                                <button
                                  onClick={() =>
                                    setConfirm({ type: "disable", user: u })
                                  }
                                  className="p-1.5 rounded hover:bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                  title={t("disable")}
                                >
                                  <UserX size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setConfirm({ type: "enable", user: u })
                                  }
                                  className="p-1.5 rounded hover:bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                  title={t("enable")}
                                >
                                  <UserCheck size={16} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setConfirm({ type: "reset", user: u })
                                }
                                className="p-1.5 rounded hover:bg-indigo-500/10 text-indigo-600"
                                title={t("forceReset")}
                              >
                                <KeyRound size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
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
                  className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">
              {confirm.type === "disable"
                ? t("confirmDisable")
                : confirm.type === "enable"
                ? t("enable") + "?"
                : t("confirmForceReset")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirm.type === "disable"
                ? t("confirmDisableMessage")
                : confirm.type === "reset"
                ? t("confirmForceResetMessage")
                : ""}
            </p>
            <div className="mt-3 rounded-lg bg-muted p-3 text-sm">
              <div className="font-medium text-foreground">{confirm.user.email}</div>
              <div className="text-xs text-muted-foreground">
                {confirm.user.company.name}
              </div>
            </div>

            {confirm.type === "disable" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirm(null);
                  setActionReason("");
                }}
                disabled={actionBusy}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionBusy}
                className="rounded-lg bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {actionBusy ? "..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temp password modal */}
      {tempPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">
              {t("tempPasswordGenerated")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Share this password with the user out-of-band. It will not be
              shown again.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-900 text-white px-3 py-2.5 font-mono text-sm">
              <span className="flex-1 select-all">{tempPassword}</span>
              <button
                onClick={copyPassword}
                className="rounded p-1.5 hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setTempPassword(null);
                  setCopied(false);
                }}
                className="rounded-lg bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Done
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
      className={`px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}
