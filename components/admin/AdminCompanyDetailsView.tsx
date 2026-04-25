"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  fetchCompany,
  updateCompany,
  suspendCompany,
  resumeCompany,
  impersonateCompanyToken,
  fetchPlanOverrides,
  createPlanOverride,
  deletePlanOverride,
  fetchPlansAdmin,
  ALL_FEATURES,
  type AdminCompanyDetails,
  type PlanOverride,
  type AdminPlan,
} from "@/lib/api/admin";
import {
  Building2,
  Users as UsersIcon,
  Package,
  Shield,
  Loader2,
  ChevronLeft,
  Pause,
  Play,
  UserCog,
  Plus,
  X,
  Check,
  AlertCircle,
  Zap,
} from "lucide-react";
import { AdminFeatureToggles } from "./AdminFeatureToggles";

// ============================================================================
// ADMIN COMPANY DETAILS VIEW
// ============================================================================

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  suspended: "bg-amber-50 text-amber-700 ring-amber-200",
  trial: "bg-sky-50 text-sky-700 ring-sky-200",
  deleted: "bg-slate-100 text-slate-600 ring-slate-200",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-50 text-red-700 ring-red-200",
  owner: "bg-sky-50 text-sky-600 ring-sky-200",
  admin: "bg-sky-50 text-sky-700 ring-sky-200",
  manager: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  member: "bg-slate-50 text-slate-700 ring-slate-200",
};

interface Props {
  companyId: string;
  locale: string;
}

export default function AdminCompanyDetailsView({ companyId, locale }: Props) {
  const t = useTranslations("Admin.companyDetails");
  const tCompanies = useTranslations("Admin.companies");
  const tStatus = useTranslations("Admin.status");
  const tRole = useTranslations("Admin.role");
  const router = useRouter();

  const [company, setCompany] = useState<AdminCompanyDetails | null>(null);
  const [overrides, setOverrides] = useState<PlanOverride[]>([]);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    plan: string;
    billingEmail: string;
    country: string;
    industry: string;
    size: string;
    baseCurrency: string;
    idleTimeoutMinutes: number;
  }>({
    name: "",
    plan: "",
    billingEmail: "",
    country: "",
    industry: "",
    size: "",
    baseCurrency: "",
    idleTimeoutMinutes: 10,
  });
  const [saving, setSaving] = useState(false);

  // Action modals
  const [actionBusy, setActionBusy] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  // Override add
  const [overrideFeature, setOverrideFeature] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideBusy, setOverrideBusy] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, o, p] = await Promise.all([
        fetchCompany(companyId),
        fetchPlanOverrides(companyId).catch(() => []),
        fetchPlansAdmin().catch(() => []),
      ]);
      setCompany(c);
      setOverrides(Array.isArray(o) ? o : []);
      setPlans(Array.isArray(p) ? p : []);
      setEditForm({
        name: c.name || "",
        plan: c.plan || "",
        billingEmail: c.billingEmail || "",
        country: c.country || "",
        industry: c.industry || "",
        size: c.size || "",
        baseCurrency: c.baseCurrency || "",
        idleTimeoutMinutes:
          typeof c.idleTimeoutMinutes === "number" ? c.idleTimeoutMinutes : 10,
      });
    } catch (err: unknown) {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateCompany(companyId, {
        name: editForm.name,
        plan: editForm.plan,
        billingEmail: editForm.billingEmail,
        country: editForm.country,
        industry: editForm.industry,
        size: editForm.size,
        baseCurrency: editForm.baseCurrency || null,
        idleTimeoutMinutes:
          editForm.idleTimeoutMinutes > 0 ? editForm.idleTimeoutMinutes : null,
      });
      setBanner({ tone: "success", text: t("saved") });
      setEditing(false);
      await loadAll();
    } catch {
      setBanner({ tone: "error", text: t("saveError") });
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!company) return;
    setActionBusy(true);
    try {
      await suspendCompany(company.id, suspendReason || undefined);
      setBanner({ tone: "success", text: tCompanies("suspended") });
      setSuspendOpen(false);
      setSuspendReason("");
      await loadAll();
    } catch {
      setBanner({ tone: "error", text: tCompanies("loadError") });
    } finally {
      setActionBusy(false);
    }
  };

  const handleResume = async () => {
    if (!company) return;
    setActionBusy(true);
    try {
      await resumeCompany(company.id);
      setBanner({ tone: "success", text: tCompanies("resumed") });
      await loadAll();
    } catch {
      setBanner({ tone: "error", text: tCompanies("loadError") });
    } finally {
      setActionBusy(false);
    }
  };

  const handleImpersonate = async () => {
    if (!company) return;
    setActionBusy(true);
    try {
      const res = await impersonateCompanyToken(company.id);
      const url = `${window.location.origin}/${locale}/dashboard?impersonation=${encodeURIComponent(
        res.accessToken
      )}`;
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        setBanner({
          tone: "error",
          text: t("impersonatePopupBlocked"),
        });
      } else {
        setBanner({
          tone: "success",
          text: t("impersonateReady", { email: res.targetUser.email }),
        });
      }
    } catch {
      setBanner({ tone: "error", text: t("impersonateError") });
    } finally {
      setActionBusy(false);
    }
  };

  const handleAddOverride = async () => {
    if (!company || !overrideFeature) return;
    setOverrideBusy(true);
    try {
      await createPlanOverride({
        companyId: company.id,
        featureSlug: overrideFeature,
        enabled: true,
        reason: overrideReason || undefined,
      });
      setOverrideFeature("");
      setOverrideReason("");
      setBanner({ tone: "success", text: t("overrideAdded") });
      await loadAll();
    } catch {
      setBanner({ tone: "error", text: t("overrideError") });
    } finally {
      setOverrideBusy(false);
    }
  };

  const handleRemoveOverride = async (id: string) => {
    setOverrideBusy(true);
    try {
      await deletePlanOverride(id);
      setBanner({ tone: "success", text: t("overrideRemoved") });
      await loadAll();
    } catch {
      setBanner({ tone: "error", text: t("overrideError") });
    } finally {
      setOverrideBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <AlertCircle className="mb-2 size-6" />
        <p className="font-medium">{error || t("notFound")}</p>
        <Link
          href={`/${locale}/admin/companies`}
          className="mt-3 inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-900"
        >
          <ChevronLeft className="size-4" />
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const statusColor =
    STATUS_COLORS[company.status] || STATUS_COLORS.active;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/${locale}/admin/companies`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft className="size-4" />
            {t("backToList")}
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Building2 className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-sky-900">
                {company.name}
              </h1>
              <p className="text-sm text-slate-500">
                {company.slug} · {company._count.users} {t("users")} ·{" "}
                {company._count.customers} {t("customers")}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusColor}`}
            >
              {tStatus(company.status as "active" | "suspended" | "trial" | "deleted")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {company.status === "active" ? (
            <button
              onClick={() => setSuspendOpen(true)}
              disabled={actionBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
            >
              <Pause className="size-4" />
              {tCompanies("suspend")}
            </button>
          ) : company.status === "suspended" ? (
            <button
              onClick={handleResume}
              disabled={actionBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            >
              <Play className="size-4" />
              {tCompanies("resume")}
            </button>
          ) : null}
          <button
            onClick={handleImpersonate}
            disabled={actionBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-100 disabled:opacity-50"
          >
            <UserCog className="size-4" />
            {tCompanies("impersonate")}
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Info + Edit */}
      <div className="rounded-xl border border-sky-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sky-900">
            {t("information")}
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-sky-600 hover:text-sky-900"
            >
              {tCompanies("edit")}
            </button>
          )}
        </div>

        {!editing ? (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label={t("name")} value={company.name} />
            <InfoRow label={t("slug")} value={company.slug} />
            <InfoRow label={t("plan")} value={company.plan} />
            <InfoRow
              label={t("billingEmail")}
              value={company.billingEmail || "—"}
            />
            <InfoRow label={t("country")} value={company.country || "—"} />
            <InfoRow label={t("industry")} value={company.industry || "—"} />
            <InfoRow label={t("size")} value={company.size || "—"} />
            <InfoRow
              label={t("createdAt")}
              value={new Date(company.createdAt).toLocaleDateString(locale)}
            />
          </dl>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label={t("name")}
              value={editForm.name}
              onChange={(v) => setEditForm({ ...editForm, name: v })}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t("plan")}
              </label>
              <select
                value={editForm.plan}
                onChange={(e) =>
                  setEditForm({ ...editForm, plan: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              label={t("billingEmail")}
              value={editForm.billingEmail}
              onChange={(v) => setEditForm({ ...editForm, billingEmail: v })}
              type="email"
            />
            <FormField
              label={t("country")}
              value={editForm.country}
              onChange={(v) => setEditForm({ ...editForm, country: v })}
            />
            <FormField
              label={t("industry")}
              value={editForm.industry}
              onChange={(v) => setEditForm({ ...editForm, industry: v })}
            />
            <FormField
              label={t("size")}
              value={editForm.size}
              onChange={(v) => setEditForm({ ...editForm, size: v })}
            />

            {/* Base currency — dropdown with curated list. Merchant's
                default reporting currency; feeds the /reports page
                pill toggle (SAR (Yours) / USD). */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-slate-500 tracking-wide">
                {t("baseCurrency") ?? "Base currency"}
              </label>
              <select
                value={editForm.baseCurrency}
                onChange={(e) =>
                  setEditForm({ ...editForm, baseCurrency: e.target.value })
                }
                dir="ltr"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="">
                  {t("useCountryDefault") ?? "Use country default"}
                </option>
                {["USD", "SAR", "TRY", "AED", "EUR", "GBP", "EGP", "KWD", "QAR", "BHD", "OMR", "IQD"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {t("baseCurrencyHint") ??
                  "Default reporting currency. Leave empty to use the country's currency."}
              </p>
            </div>

            {/* Idle timeout — slider 0..60 minutes with "Disabled" label
                when 0. Merchant's dashboard auto-locks after this many
                minutes of inactivity. Also explicitly zero-out button
                for TV-dashboard / kiosk merchants. */}
            <div className="col-span-full">
              <label className="mb-1 flex items-center justify-between text-xs font-medium uppercase text-slate-500 tracking-wide">
                <span>{t("idleTimeout") ?? "Idle auto-lock timeout"}</span>
                <span className="font-mono tabular-nums text-sm text-sky-900 normal-case tracking-normal">
                  {editForm.idleTimeoutMinutes === 0
                    ? t("disabled") ?? "Disabled"
                    : `${editForm.idleTimeoutMinutes} ${t("minutes") ?? "min"}`}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={60}
                step={1}
                value={editForm.idleTimeoutMinutes}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    idleTimeoutMinutes: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-500"
              />
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>0 ({t("disabled") ?? "Disabled"})</span>
                <span>10 ({t("default") ?? "Default"})</span>
                <span>60</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t("idleTimeoutHint") ??
                  "Dashboard auto-locks after this many idle minutes. Set to 0 for TV dashboards or kiosks that should stay signed in."}
              </p>
            </div>

            <div className="col-span-full flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                {t("save")}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users in this company */}
      <div className="rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sky-900">
          <UsersIcon className="size-5 text-sky-500" />
          {t("usersTitle")} ({company.users.length})
        </h2>
        {company.users.length === 0 ? (
          <p className="text-sm text-slate-500">{t("noUsers")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase text-slate-500">
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("userEmail")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("userName")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("userRole")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("userStatus")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("userLastLogin")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {company.users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {u.email}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {u.fullName}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          ROLE_COLORS[u.role] || ROLE_COLORS.member
                        }`}
                      >
                        {tRole(u.role as "super_admin" | "owner" | "admin" | "manager" | "member")}
                      </span>
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          STATUS_COLORS[u.status] || STATUS_COLORS.active
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-500">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString(locale)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Plan overrides */}
      <div className="rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sky-900">
          <Shield className="size-5 text-sky-500" />
          {t("overridesTitle")} ({overrides.length})
        </h2>

        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg bg-sky-50/50 p-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {t("overrideFeature")}
            </label>
            <select
              value={overrideFeature}
              onChange={(e) => setOverrideFeature(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            >
              <option value="">{t("overrideSelectFeature")}</option>
              {ALL_FEATURES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {t("overrideReason")}
            </label>
            <input
              type="text"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder={t("overrideReasonPlaceholder")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
          <button
            onClick={handleAddOverride}
            disabled={!overrideFeature || overrideBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {overrideBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {t("overrideAdd")}
          </button>
        </div>

        {overrides.length === 0 ? (
          <p className="text-sm text-slate-500">{t("noOverrides")}</p>
        ) : (
          <div className="space-y-2">
            {overrides.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <Check
                    className={`size-4 ${o.enabled ? "text-emerald-600" : "text-slate-400"}`}
                  />
                  <span className="font-medium text-slate-800">
                    {o.featureSlug}
                  </span>
                  {o.reason && (
                    <span className="text-xs text-slate-500">
                      — {o.reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveOverride(o.id)}
                  disabled={overrideBusy}
                  className="text-slate-400 hover:text-red-600"
                  aria-label={t("overrideRemove")}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-company feature toggles — platform owner controls which
          Zyrix features this merchant has access to. Independent of
          plan tier; useful for pilots + one-off disablement. */}
      <div className="rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sky-900">
          <Zap className="size-5 text-sky-500" />
          {locale === "ar"
            ? "صلاحيات الميزات"
            : locale === "tr"
              ? "Özellik erişimleri"
              : "Feature access"}
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          {locale === "ar"
            ? "تحكم في أي ميزة متاحة لهذا العميل. الميزات المعطَّلة تختفي من قائمة التنقل الخاصة به."
            : locale === "tr"
              ? "Bu müşterinin hangi özelliklere erişebileceğini kontrol edin. Devre dışı özellikler kenar çubuğundan kaybolur."
              : "Control which features this merchant can access. Disabled features disappear from their sidebar."}
        </p>
        <AdminFeatureToggles
          companyId={companyId}
          locale={locale as "en" | "ar" | "tr"}
        />
      </div>

      {/* Subscriptions (read-only for now) */}
      {company.subscriptions && company.subscriptions.length > 0 && (
        <div className="rounded-xl border border-sky-100 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sky-900">
            <Package className="size-5 text-sky-500" />
            {t("subscriptionsTitle")} ({company.subscriptions.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase text-slate-500">
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("subPlan")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("subStatus")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("subCycle")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("subAmount")}</th>
                  <th className="pb-2 ltr:pr-4 rtl:pl-4">{t("subStarted")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {company.subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {s.planSlug}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {s.status}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {s.billingCycle}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-700">
                      {s.amount} {s.currency}
                    </td>
                    <td className="py-2 ltr:pr-4 rtl:pl-4 text-slate-500">
                      {new Date(s.startedAt).toLocaleDateString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suspend modal */}
      {suspendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-sky-900">
              {tCompanies("confirmSuspend")}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {tCompanies("confirmSuspendMessage")}
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {tCompanies("suspendReason")}
              </label>
              <input
                type="text"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSuspendOpen(false)}
                disabled={actionBusy}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSuspend}
                disabled={actionBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {actionBusy && <Loader2 className="size-4 animate-spin" />}
                {tCompanies("suspend")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      />
    </div>
  );
}
