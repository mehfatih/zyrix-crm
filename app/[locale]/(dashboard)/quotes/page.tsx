"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Plus,
  Loader2,
  FileText,
  Search,
  X,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Calendar,
  DollarSign,
  Trash2,
  Pencil,
  Copy,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  fetchQuotes,
  fetchQuoteStats,
  createQuote,
  updateQuote,
  deleteQuote,
  sendQuote,
  acceptQuote,
  rejectQuote,
  type Quote,
  type QuoteStats,
  type QuoteStatus,
  type ListQuotesParams,
  type CreateQuoteDto,
  type QuoteItemInput,
} from "@/lib/api/quotes";
import { listCustomers, type Customer } from "@/lib/api/customers";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// QUOTES PAGE
// ============================================================================

const STATUS_META: Record<
  QuoteStatus,
  { bg: string; text: string; ring: string; Icon: typeof FileText }
> = {
  draft: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-200",
    Icon: FileText,
  },
  sent: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    Icon: Send,
  },
  viewed: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
    Icon: Eye,
  },
  accepted: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    Icon: CheckCircle2,
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    Icon: XCircle,
  },
  expired: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    Icon: Clock,
  },
};

type FormItem = {
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
  taxPercent: string;
};

interface FormState {
  customerId: string;
  dealId: string;
  title: string;
  currency: string;
  validUntil: string;
  notes: string;
  terms: string;
  items: FormItem[];
}

const EMPTY_ITEM: FormItem = {
  name: "",
  description: "",
  quantity: "1",
  unitPrice: "0",
  discountPercent: "0",
  taxPercent: "20",
};

const EMPTY_FORM: FormState = {
  customerId: "",
  dealId: "",
  title: "",
  currency: "TRY",
  validUntil: "",
  notes: "",
  terms: "",
  items: [{ ...EMPTY_ITEM }],
};

export default function QuotesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Quotes");

  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "">("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [viewQuote, setViewQuote] = useState<Quote | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p: ListQuotesParams = { limit: 100 };
      if (search.trim()) p.search = search.trim();
      if (statusFilter) p.status = statusFilter;

      const [s, q, c] = await Promise.all([
        fetchQuoteStats(),
        fetchQuotes(p),
        listCustomers({ limit: 200 }),
      ]);
      setStats(s);
      setQuotes(q.items);
      setCustomers(c.customers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setEditingQuote(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setForm({
      customerId: quote.customerId,
      dealId: quote.dealId ?? "",
      title: quote.title,
      currency: quote.currency,
      validUntil: quote.validUntil ? quote.validUntil.slice(0, 10) : "",
      notes: quote.notes ?? "",
      terms: quote.terms ?? "",
      items: quote.items.map((i) => ({
        name: i.name,
        description: i.description ?? "",
        quantity: String(i.quantity),
        unitPrice: String(i.unitPrice),
        discountPercent: String(i.discountPercent),
        taxPercent: String(i.taxPercent),
      })),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingQuote(null);
    setFormError(null);
  };

  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  };

  const removeItem = (idx: number) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx: number, patch: Partial<FormItem>) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const totals = useMemo(() => computeTotals(form.items), [form.items]);

  const save = async () => {
    setFormError(null);

    if (!form.customerId) {
      setFormError(t("errors.selectCustomer"));
      return;
    }
    if (!form.title.trim()) {
      setFormError(t("errors.enterTitle"));
      return;
    }
    const validItems = form.items.filter(
      (it) => it.name.trim() && Number(it.quantity) > 0
    );
    if (validItems.length === 0) {
      setFormError(t("errors.addItem"));
      return;
    }

    const dto: CreateQuoteDto = {
      customerId: form.customerId,
      dealId: form.dealId || null,
      title: form.title.trim(),
      currency: form.currency,
      validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
      notes: form.notes.trim() || null,
      terms: form.terms.trim() || null,
      items: validItems.map<QuoteItemInput>((it, idx) => ({
        name: it.name.trim(),
        description: it.description.trim() || null,
        quantity: Number(it.quantity) || 0,
        unitPrice: Number(it.unitPrice) || 0,
        discountPercent: Number(it.discountPercent) || 0,
        taxPercent: Number(it.taxPercent) || 0,
        position: idx,
      })),
    };

    setSaving(true);
    try {
      if (editingQuote) {
        await updateQuote(editingQuote.id, dto);
      } else {
        await createQuote(dto);
      }
      closeModal();
      await load();
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : t("errors.saveFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await deleteQuote(id);
      setViewQuote(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : t("errors.deleteFailed"));
    }
  };

  const handleSend = async (id: string) => {
    try {
      const updated = await sendQuote(id);
      setViewQuote(updated);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : t("errors.actionFailed"));
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const updated = await acceptQuote(id);
      setViewQuote(updated);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : t("errors.actionFailed"));
    }
  };

  const handleReject = async (id: string) => {
    try {
      const updated = await rejectQuote(id);
      setViewQuote(updated);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : t("errors.actionFailed"));
    }
  };

  const publicUrl = (quote: Quote) =>
    quote.publicToken
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/${locale}/q/${quote.publicToken}`
      : "";

  const copyPublicLink = (quote: Quote) => {
    const url = publicUrl(quote);
    if (!url) return;
    navigator.clipboard.writeText(url);
    alert(t("alerts.linkCopied"));
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("newQuote")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={FileText}
            label={t("stats.total")}
            value={stats?.total ?? 0}
            color="cyan"
          />
          <StatCard
            icon={Send}
            label={t("stats.pending")}
            value={(stats?.byStatus.sent ?? 0) + (stats?.byStatus.viewed ?? 0)}
            color="sky"
          />
          <StatCard
            icon={CheckCircle2}
            label={t("stats.accepted")}
            value={stats?.byStatus.accepted ?? 0}
            color="emerald"
          />
          <StatCard
            icon={DollarSign}
            label={t("stats.acceptedValue")}
            value={formatMoneyShort(stats?.acceptedValue ?? 0)}
            color="amber"
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
              className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as QuoteStatus | "")
            }
            className="px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">{t("filters.allStatuses")}</option>
            <option value="draft">{t("status.draft")}</option>
            <option value="sent">{t("status.sent")}</option>
            <option value="viewed">{t("status.viewed")}</option>
            <option value="accepted">{t("status.accepted")}</option>
            <option value="rejected">{t("status.rejected")}</option>
            <option value="expired">{t("status.expired")}</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-700 bg-red-50">
              <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
              {error}
            </div>
          ) : quotes.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
              <p className="text-sm">{t("empty.title")}</p>
              <p className="text-xs mt-1">{t("empty.subtitle")}</p>
            </div>
          ) : (
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
                      {t("table.validUntil")}
                    </th>
                    <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                      {t("table.total")}
                    </th>
                    <th className="px-4 py-3 font-semibold w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote, idx) => {
                    const meta = STATUS_META[quote.status];
                    const Icon = meta.Icon;
                    return (
                      <tr
                        key={idx}
                        onClick={() => setViewQuote(quote)}
                        className="border-b border-sky-50 hover:bg-sky-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-cyan-700 font-medium">
                          {quote.quoteNumber}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-cyan-900">
                            {quote.customer.fullName}
                          </div>
                          {quote.customer.companyName && (
                            <div className="text-xs text-slate-500">
                              {quote.customer.companyName}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                          {quote.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                          >
                            <Icon className="w-3 h-3" />
                            {t(`status.${quote.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {quote.validUntil
                            ? formatDate(quote.validUntil, locale)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 ltr:text-right rtl:text-left font-semibold text-cyan-900">
                          {formatMoney(Number(quote.total), quote.currency, locale)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewQuote(quote);
                            }}
                            className="text-slate-400 hover:text-cyan-600"
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
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <QuoteFormModal
          t={t}
          locale={locale}
          editingQuote={editingQuote}
          form={form}
          setForm={setForm}
          customers={customers}
          totals={totals}
          formError={formError}
          saving={saving}
          onClose={closeModal}
          onSave={save}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
        />
      )}

      {/* View / detail modal */}
      {viewQuote && (
        <QuoteDetailModal
          t={t}
          locale={locale}
          quote={viewQuote}
          onClose={() => setViewQuote(null)}
          onEdit={() => {
            openEdit(viewQuote);
            setViewQuote(null);
          }}
          onDelete={() => handleDelete(viewQuote.id)}
          onSend={() => handleSend(viewQuote.id)}
          onAccept={() => handleAccept(viewQuote.id)}
          onReject={() => handleReject(viewQuote.id)}
          onCopyLink={() => copyPublicLink(viewQuote)}
          publicLink={publicUrl(viewQuote)}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Stat Card
// ============================================================================
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  color: "cyan" | "sky" | "emerald" | "amber";
}) {
  const colors: Record<
    string,
    { bg: string; text: string; iconBg: string; iconText: string }
  > = {
    cyan: {
      bg: "bg-white",
      text: "text-cyan-900",
      iconBg: "bg-cyan-50",
      iconText: "text-cyan-600",
    },
    sky: {
      bg: "bg-white",
      text: "text-sky-900",
      iconBg: "bg-sky-50",
      iconText: "text-sky-600",
    },
    emerald: {
      bg: "bg-white",
      text: "text-emerald-900",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    amber: {
      bg: "bg-white",
      text: "text-amber-900",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
  };
  const c = colors[color];
  return (
    <div
      className={`${c.bg} border border-sky-100 rounded-xl p-4 flex items-center gap-3`}
    >
      <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 truncate">{label}</div>
        <div className={`text-lg font-bold ${c.text} truncate`}>{value}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Form Modal
// ============================================================================
function QuoteFormModal({
  t,
  locale,
  editingQuote,
  form,
  setForm,
  customers,
  totals,
  formError,
  saving,
  onClose,
  onSave,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
  editingQuote: Quote | null;
  form: FormState;
  setForm: (f: FormState) => void;
  customers: Customer[];
  totals: { subtotal: number; taxAmount: number; total: number };
  formError: string | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
  onUpdateItem: (idx: number, patch: Partial<FormItem>) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cyan-900">
            {editingQuote ? t("form.editTitle") : t("form.createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Top row: customer + title */}
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
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.titleLabel")} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t("form.titlePlaceholder")}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.currency")}
              </label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="TRY">TRY — Türk Lirası</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="SAR">SAR — Saudi Riyal</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.validUntil")}
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) =>
                  setForm({ ...form, validUntil: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-700">
                {t("form.items")} *
              </label>
              <button
                onClick={onAddItem}
                className="text-xs text-cyan-700 hover:text-cyan-800 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {t("form.addItem")}
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-sky-50/40 border border-sky-100 rounded-lg p-3 space-y-2"
                >
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        onUpdateItem(idx, { name: e.target.value })
                      }
                      placeholder={t("form.itemName")}
                      className="col-span-12 md:col-span-6 px-2 py-1.5 text-sm border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(idx, { quantity: e.target.value })
                      }
                      placeholder={t("form.qty")}
                      className="col-span-3 md:col-span-2 px-2 py-1.5 text-sm border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        onUpdateItem(idx, { unitPrice: e.target.value })
                      }
                      placeholder={t("form.unitPrice")}
                      className="col-span-4 md:col-span-3 px-2 py-1.5 text-sm border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={() => onRemoveItem(idx)}
                      disabled={form.items.length === 1}
                      className="col-span-1 flex items-center justify-center text-slate-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        onUpdateItem(idx, { description: e.target.value })
                      }
                      placeholder={t("form.descriptionOptional")}
                      className="col-span-12 md:col-span-6 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div className="col-span-6 md:col-span-3 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={item.discountPercent}
                        onChange={(e) =>
                          onUpdateItem(idx, { discountPercent: e.target.value })
                        }
                        placeholder="0"
                        className="flex-1 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-slate-500">
                        % {t("form.discount")}
                      </span>
                    </div>
                    <div className="col-span-6 md:col-span-3 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={item.taxPercent}
                        onChange={(e) =>
                          onUpdateItem(idx, { taxPercent: e.target.value })
                        }
                        placeholder="20"
                        className="flex-1 px-2 py-1.5 text-xs border border-sky-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-slate-500">
                        % {t("form.tax")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals preview */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t("form.subtotal")}</span>
              <span>{formatMoney(totals.subtotal, form.currency, locale)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t("form.taxTotal")}</span>
              <span>{formatMoney(totals.taxAmount, form.currency, locale)}</span>
            </div>
            <div className="flex justify-between font-bold text-cyan-900 pt-1 border-t border-cyan-200">
              <span>{t("form.total")}</span>
              <span>{formatMoney(totals.total, form.currency, locale)}</span>
            </div>
          </div>

          {/* Notes + terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.notes")}
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("form.terms")}
              </label>
              <textarea
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
              {formError}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 flex items-center justify-end gap-2 bg-sky-50/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingQuote ? t("actions.save") : t("actions.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Detail Modal
// ============================================================================
function QuoteDetailModal({
  t,
  locale,
  quote,
  onClose,
  onEdit,
  onDelete,
  onSend,
  onAccept,
  onReject,
  onCopyLink,
  publicLink,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
  quote: Quote;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSend: () => void;
  onAccept: () => void;
  onReject: () => void;
  onCopyLink: () => void;
  publicLink: string;
}) {
  const meta = STATUS_META[quote.status];
  const Icon = meta.Icon;
  const canSend = quote.status === "draft";
  const canAcceptReject =
    quote.status === "sent" ||
    quote.status === "viewed" ||
    quote.status === "draft";

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-cyan-700 font-semibold">
                {quote.quoteNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
              >
                <Icon className="w-3 h-3" />
                {t(`status.${quote.status}`)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-cyan-900">{quote.title}</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {quote.customer.fullName}
              {quote.customer.companyName
                ? ` — ${quote.customer.companyName}`
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
          {/* Meta row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <MetaBox
              label={t("detail.issuedAt")}
              value={
                quote.issuedAt ? formatDate(quote.issuedAt, locale) : "—"
              }
            />
            <MetaBox
              label={t("detail.validUntil")}
              value={
                quote.validUntil ? formatDate(quote.validUntil, locale) : "—"
              }
            />
            <MetaBox
              label={t("detail.createdBy")}
              value={quote.createdBy.fullName}
            />
          </div>

          {/* Items */}
          <div className="bg-sky-50/40 border border-sky-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-sky-100/50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2 ltr:text-left rtl:text-right">
                    {t("detail.item")}
                  </th>
                  <th className="px-3 py-2 text-center">{t("detail.qty")}</th>
                  <th className="px-3 py-2 ltr:text-right rtl:text-left">
                    {t("detail.price")}
                  </th>
                  <th className="px-3 py-2 ltr:text-right rtl:text-left">
                    {t("detail.total")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-sky-100 hover:bg-white/40"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-cyan-900">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-700">
                      {Number(item.quantity)}
                    </td>
                    <td className="px-3 py-2 ltr:text-right rtl:text-left text-slate-700">
                      {formatMoney(
                        Number(item.unitPrice),
                        quote.currency,
                        locale
                      )}
                    </td>
                    <td className="px-3 py-2 ltr:text-right rtl:text-left font-medium text-cyan-900">
                      {formatMoney(
                        Number(item.lineTotal),
                        quote.currency,
                        locale
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t("form.subtotal")}</span>
              <span>
                {formatMoney(Number(quote.subtotal), quote.currency, locale)}
              </span>
            </div>
            {Number(quote.discountAmount) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{t("detail.discount")}</span>
                <span>
                  −{" "}
                  {formatMoney(
                    Number(quote.discountAmount),
                    quote.currency,
                    locale
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{t("form.taxTotal")}</span>
              <span>
                {formatMoney(Number(quote.taxAmount), quote.currency, locale)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-cyan-900 pt-1 border-t border-cyan-200 text-base">
              <span>{t("form.total")}</span>
              <span>
                {formatMoney(Number(quote.total), quote.currency, locale)}
              </span>
            </div>
          </div>

          {quote.notes && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                {t("form.notes")}
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-sky-50/30 border border-sky-100 rounded-lg p-3">
                {quote.notes}
              </div>
            </div>
          )}

          {quote.terms && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                {t("form.terms")}
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-sky-50/30 border border-sky-100 rounded-lg p-3">
                {quote.terms}
              </div>
            </div>
          )}

          {publicLink && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center gap-2">
              <Copy className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <code className="text-xs text-slate-700 flex-1 truncate">
                {publicLink}
              </code>
              <button
                onClick={onCopyLink}
                className="text-xs text-amber-700 hover:text-amber-800 font-medium whitespace-nowrap"
              >
                {t("actions.copyLink")}
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 flex items-center justify-between gap-2 bg-sky-50/30 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm text-cyan-700 hover:bg-cyan-50 rounded-lg flex items-center gap-1.5"
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
          <div className="flex items-center gap-2">
            {canSend && (
              <button
                onClick={onSend}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {t("actions.send")}
              </button>
            )}
            {canAcceptReject && (
              <>
                <button
                  onClick={onReject}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  {t("actions.reject")}
                </button>
                <button
                  onClick={onAccept}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("actions.accept")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sky-50/40 border border-sky-100 rounded-lg px-3 py-2">
      <div className="text-xs text-slate-500 uppercase font-medium">
        {label}
      </div>
      <div className="text-sm text-cyan-900 font-medium mt-0.5">{value}</div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function computeTotals(items: FormItem[]): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  let subtotal = 0;
  let taxAmount = 0;
  for (const it of items) {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.unitPrice) || 0;
    const discount = Number(it.discountPercent) || 0;
    const tax = Number(it.taxPercent) || 0;
    const gross = qty * price;
    const afterDiscount = gross * (1 - discount / 100);
    const lineTax = afterDiscount * (tax / 100);
    subtotal += afterDiscount;
    taxAmount += lineTax;
  }
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round((subtotal + taxAmount) * 100) / 100,
  };
}

function formatMoney(amount: number, currency: string, locale: string): string {
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

function formatMoneyShort(amount: number): string {
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toFixed(0);
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
