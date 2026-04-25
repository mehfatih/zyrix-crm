"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FileSignature,
  Plus,
  Loader2,
  Search,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Pencil,
  Trash2,
  X,
  Save,
  Calendar,
  Bell,
  ExternalLink,
  DollarSign,
  Building2,
} from "lucide-react";
import {
  fetchContracts,
  fetchContract,
  fetchContractStats,
  createContract,
  updateContract,
  deleteContract,
  createContractReminder,
  type Contract,
  type ContractStats,
  type ContractStatus,
  type CreateContractDto,
} from "@/lib/api/contracts";
import { listCustomers, type Customer } from "@/lib/api/customers";
import { extractErrorMessage } from "@/lib/errors";
import { DashboardShell } from "@/components/layout/DashboardShell";
import ExportButton from "@/components/advanced/ExportButton";

// ============================================================================
// CONTRACTS PAGE
// ============================================================================

const STATUS_META: Record<
  ContractStatus,
  { bg: string; text: string; ring: string }
> = {
  draft: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200" },
  pending_signature: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  signed: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  expired: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
  },
  terminated: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-300",
  },
};

type FormState = {
  customerId: string;
  dealId: string;
  title: string;
  description: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  renewalDate: string;
  value: string;
  currency: string;
  fileUrl: string;
  fileName: string;
  notes: string;
  terms: string;
};

const EMPTY_FORM: FormState = {
  customerId: "",
  dealId: "",
  title: "",
  description: "",
  status: "draft",
  startDate: "",
  endDate: "",
  renewalDate: "",
  value: "0",
  currency: "TRY",
  fileUrl: "",
  fileName: "",
  notes: "",
  terms: "",
};

export default function ContractsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Contracts");

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "">("");
  const [expiringOnly, setExpiringOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const [viewing, setViewing] = useState<Contract | null>(null);
  const [reminderLoading, setReminderLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const q: Record<string, unknown> = { limit: 100 };
      if (search.trim()) q.search = search.trim();
      if (statusFilter) q.status = statusFilter;
      if (expiringOnly) q.expiringWithinDays = 30;

      const [c, s, cs] = await Promise.all([
        fetchContracts(q),
        fetchContractStats(),
        listCustomers({ limit: 200 }),
      ]);
      setContracts(c.items);
      setStats(s);
      setCustomers(cs.customers);
    } catch (e) {
      setError(extractErrorMessage(e) || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, expiringOnly]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr(null);
    setModalOpen(true);
  };

  const openEdit = (c: Contract) => {
    setEditing(c);
    setForm({
      customerId: c.customerId,
      dealId: c.dealId ?? "",
      title: c.title,
      description: c.description ?? "",
      status: c.status,
      startDate: c.startDate ? c.startDate.slice(0, 10) : "",
      endDate: c.endDate ? c.endDate.slice(0, 10) : "",
      renewalDate: c.renewalDate ? c.renewalDate.slice(0, 10) : "",
      value: String(c.value),
      currency: c.currency,
      fileUrl: c.fileUrl ?? "",
      fileName: c.fileName ?? "",
      notes: c.notes ?? "",
      terms: c.terms ?? "",
    });
    setFormErr(null);
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.customerId) {
      setFormErr(t("errors.selectCustomer"));
      return;
    }
    if (!form.title.trim()) {
      setFormErr(t("errors.enterTitle"));
      return;
    }
    const dto: CreateContractDto = {
      customerId: form.customerId,
      dealId: form.dealId || null,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      renewalDate: form.renewalDate
        ? new Date(form.renewalDate).toISOString()
        : null,
      value: Number(form.value) || 0,
      currency: form.currency,
      fileUrl: form.fileUrl.trim() || undefined,
      fileName: form.fileName.trim() || undefined,
      notes: form.notes.trim() || undefined,
      terms: form.terms.trim() || undefined,
    };
    setSaving(true);
    setFormErr(null);
    try {
      if (editing) {
        await updateContract(editing.id, dto);
      } else {
        await createContract(dto);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormErr(extractErrorMessage(e) || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await deleteContract(id);
      setViewing(null);
      await load();
    } catch (e) {
      alert(extractErrorMessage(e) || "Failed");
    }
  };

  const handleReminder = async (id: string) => {
    setReminderLoading(true);
    try {
      await createContractReminder(id);
      alert(t("alerts.reminderCreated"));
      await load();
      if (viewing) {
        const updated = await fetchContract(viewing.id);
        setViewing(updated);
      }
    } catch (e) {
      alert(extractErrorMessage(e) || "Failed");
    } finally {
      setReminderLoading(false);
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-sky-900 flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-sky-500" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton entityType="contracts" />
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t("newContract")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={FileSignature}
            label={t("stats.total")}
            value={stats?.total ?? 0}
            color="cyan"
          />
          <StatCard
            icon={CheckCircle2}
            label={t("stats.active")}
            value={stats?.byStatus.active ?? 0}
            color="emerald"
          />
          <StatCard
            icon={Clock}
            label={t("stats.pending")}
            value={stats?.byStatus.pending ?? 0}
            color="amber"
          />
          <StatCard
            icon={AlertTriangle}
            label={t("stats.expiringSoon")}
            value={stats?.expiringSoon ?? 0}
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-sky-100 rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ContractStatus | "")
            }
            className="px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="">{t("filters.allStatuses")}</option>
            <option value="draft">{t("status.draft")}</option>
            <option value="pending_signature">
              {t("status.pending_signature")}
            </option>
            <option value="signed">{t("status.signed")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="expired">{t("status.expired")}</option>
            <option value="terminated">{t("status.terminated")}</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={expiringOnly}
              onChange={(e) => setExpiringOnly(e.target.checked)}
              className="w-4 h-4 rounded border-sky-300 text-sky-500 focus:ring-sky-400"
            />
            <span className="text-slate-700">{t("filters.expiringOnly")}</span>
          </label>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-xl py-16 text-center text-slate-500">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs mt-1">{t("empty.subtitle")}</p>
          </div>
        ) : (
          <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sky-50 border-b border-sky-100">
                  <tr className="text-left rtl:text-right text-xs uppercase text-slate-600">
                    <th className="px-4 py-3 font-semibold">
                      {t("table.number")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.customer")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.title")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.status")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.endDate")}
                    </th>
                    <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                      {t("table.value")}
                    </th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c, idx) => {
                    const meta = STATUS_META[c.status];
                    const isExpiring =
                      c.endDate &&
                      (c.status === "active" || c.status === "signed") &&
                      new Date(c.endDate).getTime() - Date.now() <
                        30 * 24 * 60 * 60 * 1000 &&
                      new Date(c.endDate).getTime() - Date.now() > 0;
                    return (
                      <tr
                        key={idx}
                        onClick={() => setViewing(c)}
                        className="border-b border-sky-50 hover:bg-sky-50/40 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-sky-600 font-medium">
                          {c.contractNumber}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-sky-900">
                            {c.customer.fullName}
                          </div>
                          {c.customer.companyName && (
                            <div className="text-xs text-slate-500">
                              {c.customer.companyName}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                          >
                            {t(`status.${c.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.endDate ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-700 text-xs">
                                {formatDate(c.endDate, locale)}
                              </span>
                              {isExpiring && (
                                <span
                                  title={t("table.expiringSoon")}
                                  className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"
                                />
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 ltr:text-right rtl:text-left font-semibold text-sky-900">
                          {formatMoney(Number(c.value), c.currency, locale)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewing(c);
                            }}
                            className="text-slate-400 hover:text-sky-500"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
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

      {modalOpen && (
        <ContractFormModal
          t={t}
          editing={editing}
          form={form}
          setForm={setForm}
          customers={customers}
          formErr={formErr}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}

      {viewing && (
        <ContractDetailModal
          t={t}
          locale={locale}
          contract={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            openEdit(viewing);
            setViewing(null);
          }}
          onDelete={() => handleDelete(viewing.id)}
          onReminder={() => handleReminder(viewing.id)}
          reminderLoading={reminderLoading}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Form Modal
// ============================================================================
function ContractFormModal({
  t,
  editing,
  form,
  setForm,
  customers,
  formErr,
  saving,
  onClose,
  onSave,
}: {
  t: ReturnType<typeof useTranslations>;
  editing: Contract | null;
  form: FormState;
  setForm: (f: FormState) => void;
  customers: Customer[];
  formErr: string | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-sky-900">
            {editing ? t("form.editTitle") : t("form.createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.customer")} *
              </label>
              <select
                value={form.customerId}
                onChange={(e) =>
                  setForm({ ...form, customerId: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              >
                <option value="">{t("form.selectCustomer")}</option>
                {customers.map((c, i) => (
                  <option key={i} value={c.id}>
                    {c.fullName}
                    {c.companyName ? ` — ${c.companyName}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.status")}
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as ContractStatus,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              >
                <option value="draft">{t("status.draft")}</option>
                <option value="pending_signature">
                  {t("status.pending_signature")}
                </option>
                <option value="signed">{t("status.signed")}</option>
                <option value="active">{t("status.active")}</option>
                <option value="expired">{t("status.expired")}</option>
                <option value="terminated">{t("status.terminated")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("form.titleLabel")} *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t("form.titlePlaceholder")}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("form.description")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.startDate")}
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.endDate")}
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.renewalDate")}
              </label>
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) =>
                  setForm({ ...form, renewalDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.value")}
              </label>
              <input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.currency")}
              </label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
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

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("form.fileUrl")}
            </label>
            <input
              type="url"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://drive.google.com/file/..."
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">
              {t("form.fileUrlHint")}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("form.notes")}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg resize-none"
            />
          </div>

          {formErr && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg border border-red-100 whitespace-pre-line">
              {formErr}
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
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
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
// Detail Modal
// ============================================================================
function ContractDetailModal({
  t,
  locale,
  contract,
  onClose,
  onEdit,
  onDelete,
  onReminder,
  reminderLoading,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
  contract: Contract;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReminder: () => void;
  reminderLoading: boolean;
}) {
  const meta = STATUS_META[contract.status];

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-sky-600 font-semibold">
                {contract.contractNumber}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
              >
                {t(`status.${contract.status}`)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-sky-900">
              {contract.title}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {contract.customer.fullName}
              {contract.customer.companyName
                ? ` — ${contract.customer.companyName}`
                : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {contract.description && (
            <p className="text-sm text-slate-700">{contract.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <MetaBox
              label={t("detail.startDate")}
              icon={Calendar}
              value={
                contract.startDate
                  ? formatDate(contract.startDate, locale)
                  : "—"
              }
            />
            <MetaBox
              label={t("detail.endDate")}
              icon={Calendar}
              value={
                contract.endDate ? formatDate(contract.endDate, locale) : "—"
              }
            />
            <MetaBox
              label={t("detail.renewal")}
              icon={Calendar}
              value={
                contract.renewalDate
                  ? formatDate(contract.renewalDate, locale)
                  : "—"
              }
            />
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-medium">
                {t("detail.value")}
              </div>
              <div className="text-2xl font-bold text-sky-900 mt-1">
                {formatMoney(
                  Number(contract.value),
                  contract.currency,
                  locale
                )}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-sky-300" />
          </div>

          {contract.fileUrl && (
            <a
              href={contract.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-lg text-sm text-sky-600 hover:bg-sky-100"
            >
              <FileText className="w-4 h-4" />
              <span className="flex-1 truncate">
                {contract.fileName || contract.fileUrl}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {contract.notes && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                {t("detail.notes")}
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-sky-50/30 border border-sky-100 rounded-lg p-3">
                {contract.notes}
              </div>
            </div>
          )}

          {contract.terms && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                {t("detail.terms")}
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-sky-50/30 border border-sky-100 rounded-lg p-3 max-h-40 overflow-y-auto">
                {contract.terms}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 flex items-center justify-between gap-2 bg-sky-50/30 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-50 rounded-lg flex items-center gap-1.5"
            >
              <Pencil className="w-4 h-4" />
              {t("actions.edit")}
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              {t("actions.delete")}
            </button>
          </div>
          <button
            onClick={onReminder}
            disabled={reminderLoading || contract.reminderSent}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 ${
              contract.reminderSent
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            } disabled:opacity-60`}
          >
            {reminderLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            {contract.reminderSent
              ? t("actions.reminderDone")
              : t("actions.createReminder")}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaBox({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: typeof Calendar;
  value: string;
}) {
  return (
    <div className="bg-sky-50/40 border border-sky-100 rounded-lg px-3 py-2">
      <div className="text-xs text-slate-500 uppercase font-medium">
        {label}
      </div>
      <div className="text-sm text-sky-900 font-medium mt-0.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {value}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof FileSignature;
  label: string;
  value: number | string;
  color: "cyan" | "emerald" | "amber" | "red";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-sky-50", iconText: "text-sky-500" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
    red: { iconBg: "bg-red-50", iconText: "text-red-600" },
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
