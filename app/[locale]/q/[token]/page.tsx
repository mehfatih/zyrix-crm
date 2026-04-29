"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Building2,
  Calendar,
} from "lucide-react";
import {
  fetchPublicQuote,
  acceptPublicQuote,
  rejectPublicQuote,
  type Quote,
} from "@/lib/api/quotes";

// ============================================================================
// PUBLIC QUOTE VIEW — customer-facing, no auth required
// ============================================================================

export default function PublicQuotePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const token = params?.token as string;
  const t = useTranslations("PublicQuote");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const q = await fetchPublicQuote(token);
        setQuote(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load quote");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleAccept = async () => {
    if (!confirm(t("confirm.accept"))) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await acceptPublicQuote(token);
      setQuote(updated);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(t("confirm.reject"))) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await rejectPublicQuote(token);
      setQuote(updated);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-white flex items-center justify-center p-6">
        <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-foreground">
            {t("notFound.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {error || t("notFound.subtitle")}
          </p>
        </div>
      </div>
    );
  }

  const isResolved =
    quote.status === "accepted" || quote.status === "rejected";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-white py-8 px-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header card */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-sky-500 text-white p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 text-sky-100 text-sm mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="font-mono">{quote.quoteNumber}</span>
                </div>
                <h1 className="text-2xl font-bold">{quote.title}</h1>
                <p className="text-sky-100 text-sm mt-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {quote.customer.companyName || quote.customer.fullName}
                </p>
              </div>
              <StatusBadge status={quote.status} t={t} />
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg border border-border px-3 py-2">
                <div className="text-xs text-muted-foreground uppercase font-medium">
                  {t("meta.issued")}
                </div>
                <div className="text-sm text-foreground font-medium mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {quote.issuedAt
                    ? formatDate(quote.issuedAt, locale)
                    : "—"}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg border border-border px-3 py-2">
                <div className="text-xs text-muted-foreground uppercase font-medium">
                  {t("meta.validUntil")}
                </div>
                <div className="text-sm text-foreground font-medium mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {quote.validUntil
                    ? formatDate(quote.validUntil, locale)
                    : "—"}
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                {t("items.title")}
              </h2>
              <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-sky-100/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 ltr:text-left rtl:text-right">
                        {t("items.item")}
                      </th>
                      <th className="px-3 py-2 text-center">
                        {t("items.qty")}
                      </th>
                      <th className="px-3 py-2 ltr:text-right rtl:text-left">
                        {t("items.price")}
                      </th>
                      <th className="px-3 py-2 ltr:text-right rtl:text-left">
                        {t("items.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-border"
                      >
                        <td className="px-3 py-2">
                          <div className="font-medium text-foreground">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-foreground">
                          {Number(item.quantity)}
                        </td>
                        <td className="px-3 py-2 ltr:text-right rtl:text-left text-foreground">
                          {formatMoney(
                            Number(item.unitPrice),
                            quote.currency,
                            locale
                          )}
                        </td>
                        <td className="px-3 py-2 ltr:text-right rtl:text-left font-medium text-foreground">
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
            </div>

            {/* Totals */}
            <div className="bg-muted border border-border rounded-lg p-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("totals.subtotal")}</span>
                <span>
                  {formatMoney(
                    Number(quote.subtotal),
                    quote.currency,
                    locale
                  )}
                </span>
              </div>
              {Number(quote.discountAmount) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("totals.discount")}</span>
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
              <div className="flex justify-between text-muted-foreground">
                <span>{t("totals.tax")}</span>
                <span>
                  {formatMoney(
                    Number(quote.taxAmount),
                    quote.currency,
                    locale
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-lg">
                <span>{t("totals.total")}</span>
                <span>
                  {formatMoney(
                    Number(quote.total),
                    quote.currency,
                    locale
                  )}
                </span>
              </div>
            </div>

            {quote.notes && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {t("notes")}
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {quote.notes}
                </div>
              </div>
            )}

            {quote.terms && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {t("terms")}
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 border border-border rounded-lg p-3">
                  {quote.terms}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isResolved && (
              <div className="border-t border-border pt-5 flex items-center gap-3 justify-end flex-wrap">
                {actionError && (
                  <div className="w-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm p-2 rounded-lg border border-red-100">
                    {actionError}
                  </div>
                )}
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-card border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4" />
                  {t("actions.reject")}
                </button>
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {t("actions.accept")}
                </button>
              </div>
            )}

            {isResolved && (
              <div
                className={`p-4 rounded-lg text-center text-sm font-medium ${
                  quote.status === "accepted"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 border border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-300 border border-rose-500/30 border border-rose-500/30"
                }`}
              >
                {quote.status === "accepted"
                  ? t("resolved.accepted")
                  : t("resolved.rejected")}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("poweredBy")}{" "}
          <a
            href="https://zyrix.co"
            className="text-cyan-300 hover:underline font-medium"
          >
            Zyrix CRM
          </a>
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const styles: Record<string, string> = {
    draft: "bg-card/20 text-white",
    sent: "bg-sky-100 text-foreground",
    viewed: "bg-indigo-100 text-indigo-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-card/20 text-white"}`}
    >
      {t(`status.${status}`)}
    </span>
  );
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
