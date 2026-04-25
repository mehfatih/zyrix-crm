"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Plus,
  Download,
  Loader2,
  X,
  Save,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Receipt,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  regimesForCountry,
  availableCurrencies,
  getCountryProfile,
} from "@/lib/locale/country-profiles";
import {
  listTaxInvoices,
  issueTaxInvoice,
  buildTaxInvoiceXmlUrl,
  type TaxInvoice,
  type TaxRegime,
  type TaxLineItem,
  type TaxInvoiceStatus,
} from "@/lib/api/advanced";

// ============================================================================
// TAX INVOICES PAGE — issue + list + download XML
// ----------------------------------------------------------------------------
// Merchants use this to generate ZATCA-compliant (Saudi) or e-Fatura/
// e-Arşiv (Turkey) invoices. The generated XML + QR code can be
// downloaded, printed, or submitted to the regulator (submission UI
// comes later when provider certs are configured).
// ============================================================================

const REGIME_META: Record<
  TaxRegime,
  { label: { en: string; ar: string; tr: string }; country: string; currency: string; defaultTax: number }
> = {
  zatca: {
    label: { en: "Saudi Arabia (ZATCA)", ar: "السعودية (زاتكا)", tr: "Suudi Arabistan (ZATCA)" },
    country: "SA",
    currency: "SAR",
    defaultTax: 15,
  },
  efatura: {
    label: { en: "Turkey (e-Fatura)", ar: "تركيا (e-Fatura)", tr: "Türkiye (e-Fatura)" },
    country: "TR",
    currency: "TRY",
    defaultTax: 20,
  },
  earsiv: {
    label: { en: "Turkey (e-Arşiv)", ar: "تركيا (e-Arşiv)", tr: "Türkiye (e-Arşiv)" },
    country: "TR",
    currency: "TRY",
    defaultTax: 20,
  },
};

const STATUS_META: Record<
  TaxInvoiceStatus,
  { label: { en: string; ar: string; tr: string }; tone: string; icon: any }
> = {
  draft: {
    label: { en: "Draft", ar: "مسودة", tr: "Taslak" },
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  submitted: {
    label: { en: "Submitted", ar: "مُرسلة", tr: "Gönderildi" },
    tone: "bg-sky-50 text-sky-800 border-sky-200",
    icon: Globe,
  },
  approved: {
    label: { en: "Approved", ar: "معتمدة", tr: "Onaylandı" },
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: { en: "Rejected", ar: "مرفوضة", tr: "Reddedildi" },
    tone: "bg-rose-50 text-rose-800 border-rose-200",
    icon: AlertTriangle,
  },
};

export default function TaxInvoicesPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  // Location-gating: only show regimes that apply to the merchant's
  // country. A Saudi merchant shouldn't see Turkish e-Fatura options
  // and vice versa.
  const { company } = useAuth();
  const allowedRegimes = regimesForCountry(company?.country);

  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [total, setTotal] = useState(0);
  const [regimeFilter, setRegimeFilter] = useState<TaxRegime | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIssue, setShowIssue] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await listTaxInvoices({
        regime: regimeFilter || undefined,
        limit: 50,
      });
      setInvoices(page.items);
      setTotal(page.total);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, [regimeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-5xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white flex items-center justify-center shadow">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">
                {tr("Tax invoices", "الفواتير الضريبية", "Vergi faturaları")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "ZATCA (Saudi) + e-Fatura/e-Arşiv (Turkey) compliant invoices with XML + QR code.",
                  "فواتير مطابقة لزاتكا (السعودية) + e-Fatura/e-Arşiv (تركيا) مع XML + رمز QR.",
                  "ZATCA (Suudi) + e-Fatura/e-Arşiv (Türkiye) uyumlu faturalar, XML + QR kod ile."
                )}
              </p>
            </div>
          </div>
          {!showIssue && (
            <button
              onClick={() => setShowIssue(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {tr("Issue invoice", "إصدار فاتورة", "Fatura oluştur")}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Issue form */}
        {showIssue && (
          <IssueInvoiceForm
            locale={locale}
            tr={tr}
            allowedRegimes={allowedRegimes}
            countryIso2={company?.country ?? null}
            onCancel={() => setShowIssue(false)}
            onSaved={() => {
              setShowIssue(false);
              load();
            }}
          />
        )}

        {/* Regime filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setRegimeFilter("")}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              !regimeFilter
                ? "bg-sky-500 text-white"
                : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
            }`}
          >
            {tr("All", "الكل", "Tümü")}
            <span className="ms-1 opacity-70">({total})</span>
          </button>
          {(Object.keys(REGIME_META) as TaxRegime[])
            .filter((r) => allowedRegimes.includes(r))
            .map((r) => (
            <button
              key={r}
              onClick={() => setRegimeFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                regimeFilter === r
                  ? "bg-sky-500 text-white"
                  : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
              }`}
            >
              {REGIME_META[r].label[locale]}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-200 bg-white p-12 text-center">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {tr(
                "No tax invoices yet — issue your first one.",
                "لا فواتير ضريبية بعد — أصدر أول واحدة.",
                "Henüz vergi faturası yok — ilkini oluştur."
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-sky-100 bg-white overflow-hidden divide-y divide-sky-50">
            {invoices.map((inv) => (
              <InvoiceRow
                key={inv.id}
                invoice={inv}
                locale={locale}
                tr={tr}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// INVOICE ROW
// ============================================================================

function InvoiceRow({
  invoice,
  locale,
  tr,
}: {
  invoice: TaxInvoice;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const StatusIcon = STATUS_META[invoice.status].icon;
  return (
    <div className="p-4 hover:bg-sky-50/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0">
          <Receipt className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-mono font-bold text-sky-900" dir="ltr">
              {REGIME_META[invoice.regime].country}-{invoice.invoiceNumber}
            </code>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${STATUS_META[invoice.status].tone}`}
            >
              <StatusIcon className="w-2.5 h-2.5" />
              {STATUS_META[invoice.status].label[locale]}
            </span>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {REGIME_META[invoice.regime].label[locale]}
            </span>
          </div>
          <div className="text-xs text-slate-700 mt-0.5 truncate">
            {invoice.buyerName}
            {invoice.buyerVatNo && (
              <span className="text-slate-400 ms-2 font-mono" dir="ltr">
                {invoice.buyerVatNo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
            <span className="font-mono tabular-nums" dir="ltr">
              {new Date(invoice.issuedAt).toLocaleDateString(
                locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US"
              )}
            </span>
            <span className="tabular-nums font-mono" dir="ltr">
              {Number(invoice.totalAmount).toLocaleString()} {invoice.currency}
            </span>
            <span>
              {tr("VAT", "ضريبة", "KDV")} {Number(invoice.taxRate).toFixed(0)}%
            </span>
          </div>
          {invoice.rejectionReason && (
            <div className="mt-1 text-[11px] text-rose-700 bg-rose-50 rounded px-2 py-1 border border-rose-100">
              {invoice.rejectionReason}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {invoice.xml && (
            <a
              href={buildTaxInvoiceXmlUrl(invoice.id)}
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-md text-[11px] font-semibold"
            >
              <Download className="w-3 h-3" />
              XML
            </a>
          )}
          {invoice.qrCode && (
            <QrPreview qrCode={invoice.qrCode} locale={locale} tr={tr} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QR PREVIEW — compact inline QR display
// ============================================================================

function QrPreview({
  qrCode,
  locale,
  tr,
}: {
  qrCode: string;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const [open, setOpen] = useState(false);
  // Use Google Chart API for QR rendering — no client dependency
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(qrCode)}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-md text-[11px] font-semibold"
      >
        QR
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-xs w-full relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 end-2 w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-sky-900 text-center mb-2">
              {tr("ZATCA QR code", "رمز QR زاتكا", "ZATCA QR kodu")}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              {tr(
                "Scan with the ZATCA verification app.",
                "امسح بتطبيق التحقق من زاتكا.",
                "ZATCA doğrulama uygulamasıyla tarayın."
              )}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR code"
              className="w-full h-auto mx-auto"
            />
            <details className="mt-3 text-[10px]">
              <summary className="cursor-pointer text-slate-500">
                {tr("Raw TLV", "TLV الخام", "Ham TLV")}
              </summary>
              <code
                dir="ltr"
                className="mt-1 block break-all font-mono text-slate-600 bg-slate-50 p-2 rounded"
              >
                {qrCode}
              </code>
            </details>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// ISSUE FORM
// ============================================================================

function IssueInvoiceForm({
  locale,
  tr,
  allowedRegimes,
  countryIso2,
  onCancel,
  onSaved,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  allowedRegimes: TaxRegime[];
  countryIso2: string | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  // Default regime: first allowed for this country (falls back to zatca
  // only if country is unknown, which shouldn't happen in practice).
  const defaultRegime: TaxRegime =
    allowedRegimes[0] ?? ("zatca" as TaxRegime);
  const currencyOptions = availableCurrencies(countryIso2);

  const [regime, setRegime] = useState<TaxRegime>(defaultRegime);
  const [type, setType] = useState<"standard" | "simplified">("standard");
  const [sellerName, setSellerName] = useState("");
  const [sellerVatNo, setSellerVatNo] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerVatNo, setBuyerVatNo] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [currency, setCurrency] = useState(REGIME_META[defaultRegime].currency);
  const [taxRate, setTaxRate] = useState(REGIME_META[defaultRegime].defaultTax);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [items, setItems] = useState<TaxLineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, lineTotal: 0 },
  ]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Update defaults when regime changes
  const handleRegimeChange = (r: TaxRegime) => {
    setRegime(r);
    setCurrency(REGIME_META[r].currency);
    setTaxRate(REGIME_META[r].defaultTax);
  };

  const updateItem = (idx: number, patch: Partial<TaxLineItem>) => {
    setItems((prev) => {
      const next = [...prev];
      const merged = { ...next[idx], ...patch };
      merged.lineTotal = Number(merged.quantity) * Number(merged.unitPrice);
      next[idx] = merged;
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unitPrice: 0, lineTotal: 0 },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Live totals
  const subtotal = items.reduce((sum, i) => sum + Number(i.lineTotal), 0);
  const taxable = Math.max(subtotal - discountAmount, 0);
  const taxAmount = (taxable * taxRate) / 100;
  const total = taxable + taxAmount;

  const handleSubmit = async () => {
    if (!sellerName.trim() || !buyerName.trim()) {
      setErr(tr("Seller and buyer names required", "اسم البائع والمشتري مطلوبان", "Satıcı ve alıcı adları gerekli"));
      return;
    }
    const validItems = items.filter((i) => i.description.trim() && i.quantity > 0);
    if (validItems.length === 0) {
      setErr(tr("At least one line item", "بند واحد على الأقل", "En az bir kalem gerekli"));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await issueTaxInvoice({
        regime,
        type,
        sellerName: sellerName.trim(),
        sellerVatNo: sellerVatNo.trim() || undefined,
        sellerAddress: sellerAddress.trim() || undefined,
        buyerName: buyerName.trim(),
        buyerVatNo: buyerVatNo.trim() || undefined,
        buyerAddress: buyerAddress.trim() || undefined,
        currency,
        taxRate,
        discountAmount,
        lineItems: validItems,
      });
      onSaved();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-sky-900">
          {tr("New tax invoice", "فاتورة ضريبية جديدة", "Yeni vergi faturası")}
        </h2>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded text-slate-500 hover:bg-slate-100 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
          {err}
        </div>
      )}

      {/* Regime picker */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
          {tr("Regime", "النظام الضريبي", "Rejim")}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(REGIME_META) as TaxRegime[])
            .filter((r) => allowedRegimes.includes(r))
            .map((r) => (
            <button
              key={r}
              onClick={() => handleRegimeChange(r)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                regime === r
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white border-sky-200 text-slate-700 hover:bg-sky-50"
              }`}
            >
              {REGIME_META[r].label[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Type picker (only for ZATCA) */}
      {regime === "zatca" && (
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Type", "النوع", "Tür")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType("standard")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                type === "standard"
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white border-sky-200 text-slate-700"
              }`}
            >
              {tr("Standard (B2B)", "قياسية (B2B)", "Standart (B2B)")}
            </button>
            <button
              onClick={() => setType("simplified")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                type === "simplified"
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white border-sky-200 text-slate-700"
              }`}
            >
              {tr("Simplified (B2C)", "مبسطة (B2C)", "Basitleştirilmiş (B2C)")}
            </button>
          </div>
        </div>
      )}

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-sky-100 rounded-lg p-3">
          <legend className="text-[10px] font-bold uppercase text-slate-500 tracking-wide px-1">
            {tr("Seller (you)", "البائع (أنت)", "Satıcı (sen)")}
          </legend>
          <input
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder={tr("Company name", "اسم الشركة", "Şirket adı")}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white mb-1.5"
          />
          <input
            value={sellerVatNo}
            onChange={(e) => setSellerVatNo(e.target.value)}
            placeholder={tr("VAT number", "الرقم الضريبي", "VKN/VAT")}
            dir="ltr"
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white mb-1.5"
          />
          <input
            value={sellerAddress}
            onChange={(e) => setSellerAddress(e.target.value)}
            placeholder={tr("Address", "العنوان", "Adres")}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white"
          />
        </fieldset>
        <fieldset className="border border-sky-100 rounded-lg p-3">
          <legend className="text-[10px] font-bold uppercase text-slate-500 tracking-wide px-1">
            {tr("Buyer", "المشتري", "Alıcı")}
          </legend>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder={tr("Customer name", "اسم العميل", "Müşteri adı")}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white mb-1.5"
          />
          <input
            value={buyerVatNo}
            onChange={(e) => setBuyerVatNo(e.target.value)}
            placeholder={tr("VAT / TCKN / VKN", "الرقم الضريبي", "VKN/TCKN")}
            dir="ltr"
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white mb-1.5"
          />
          <input
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
            placeholder={tr("Address", "العنوان", "Adres")}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white"
          />
        </fieldset>
      </div>

      {/* Line items */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
          {tr("Line items", "بنود الفاتورة", "Kalemler")}
        </label>
        <div className="rounded-lg border border-sky-200 bg-white overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-sky-50/50 border-b border-sky-100">
              <tr>
                <th className="px-2 py-1.5 text-start font-semibold text-sky-900">
                  {tr("Description", "الوصف", "Açıklama")}
                </th>
                <th className="px-2 py-1.5 text-start font-semibold text-sky-900 w-20">
                  {tr("Qty", "الكمية", "Adet")}
                </th>
                <th className="px-2 py-1.5 text-start font-semibold text-sky-900 w-28">
                  {tr("Unit price", "السعر", "Birim")}
                </th>
                <th className="px-2 py-1.5 text-end font-semibold text-sky-900 w-28">
                  {tr("Total", "الإجمالي", "Toplam")}
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} className="border-b border-sky-50 last:border-b-0">
                  <td className="px-2 py-1">
                    <input
                      value={it.description}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                      className="w-full px-1.5 py-1 border border-transparent focus:border-sky-400 rounded text-xs focus:outline-none bg-transparent"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                      className="w-full px-1.5 py-1 border border-transparent focus:border-sky-400 rounded text-xs font-mono focus:outline-none bg-transparent tabular-nums"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={it.unitPrice}
                      onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                      className="w-full px-1.5 py-1 border border-transparent focus:border-sky-400 rounded text-xs font-mono focus:outline-none bg-transparent tabular-nums"
                    />
                  </td>
                  <td className="px-2 py-1 text-end font-mono text-xs tabular-nums text-slate-700">
                    {Number(it.lineTotal).toFixed(2)}
                  </td>
                  <td className="px-1 py-1">
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-6 h-6 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addItem}
          className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-md text-xs font-semibold"
        >
          <Plus className="w-3 h-3" />
          {tr("Add line", "إضافة بند", "Kalem ekle")}
        </button>
      </div>

      {/* Totals + tax rate */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Currency", "العملة", "Para birimi")}
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            dir="ltr"
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs font-mono bg-white"
          >
            {currencyOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {c.label[locale]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {getCountryProfile(countryIso2)?.taxName[locale] ??
              tr("Tax", "ضريبة", "Vergi")}{" "}
            %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs font-mono bg-white tabular-nums"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Discount", "خصم", "İndirim")}
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value))}
            className="w-full px-2 py-1.5 border border-sky-200 rounded text-xs font-mono bg-white tabular-nums"
          />
        </div>
        <div className="rounded-lg bg-sky-500 text-white p-2 flex flex-col justify-center">
          <div className="text-[10px] opacity-80 font-bold uppercase">
            {tr("Total", "الإجمالي", "Toplam")}
          </div>
          <div className="text-lg font-mono tabular-nums font-bold" dir="ltr">
            {total.toFixed(2)} {currency}
          </div>
          <div className="text-[9px] opacity-80 font-mono tabular-nums" dir="ltr">
            {getCountryProfile(countryIso2)?.taxName[locale] ??
              tr("Tax", "ضريبة", "Vergi")}{" "}
            {taxAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {tr("Issue invoice", "إصدار الفاتورة", "Faturayı oluştur")}
        </button>
      </div>
    </div>
  );
}
