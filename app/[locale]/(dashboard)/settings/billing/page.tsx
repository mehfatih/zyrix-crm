"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CreditCard,
  Loader2,
  Check,
  X,
  AlertTriangle,
  Calendar,
  Zap,
  Crown,
  Sparkles,
  RefreshCw,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  listBillingPlans,
  getCurrentBilling,
  listInvoices,
  cancelSubscription,
  resumeSubscription,
  createCheckoutSession,
  type BillingPlan,
  type CurrentBilling,
  type Invoice,
  type InvoicePage,
} from "@/lib/api/advanced";

// ============================================================================
// SETTINGS → BILLING
// ----------------------------------------------------------------------------
// Merchant self-service billing: see current plan + next renewal, pick a
// new plan (redirects to gateway checkout), view invoice history, cancel
// or resume a subscription. Owner/admin only for the mutating actions —
// the underlying endpoints also enforce this, but we hide the buttons too
// so regular members don't see controls they can't use.
// ============================================================================

const BILLING_CYCLES: Array<{
  key: "monthly" | "yearly";
  label: { en: string; ar: string; tr: string };
}> = [
  { key: "monthly", label: { en: "Monthly", ar: "شهري", tr: "Aylık" } },
  { key: "yearly", label: { en: "Yearly — save 20%", ar: "سنوي — وفّر 20%", tr: "Yıllık — %20 tasarruf" } },
];

export default function BillingPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "admin";

  const [billing, setBilling] = useState<CurrentBilling | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [invoicePage, setInvoicePage] = useState<InvoicePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceOffset, setInvoiceOffset] = useState(0);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [error, setError] = useState<string | null>(null);
  const [actingPlan, setActingPlan] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Resolve currency: use company.baseCurrency if set, else fall back to USD.
  // Plan pricing only exists for USD/TRY/SAR — for everything else we show
  // USD pricing (it's a universal fallback that every region understands).
  const resolvedCurrency: "USD" | "TRY" | "SAR" | "AED" = (() => {
    const c = billing?.company.baseCurrency?.toUpperCase();
    if (c === "TRY" || c === "SAR" || c === "AED") return c;
    return "USD";
  })();

  // Name + description picker by locale
  const nameForPlan = (plan: BillingPlan): string =>
    locale === "ar" ? plan.nameAr : locale === "tr" ? plan.nameTr : plan.name;
  const descriptionForPlan = (plan: BillingPlan): string =>
    (locale === "ar"
      ? plan.descriptionAr
      : locale === "tr"
        ? plan.descriptionTr
        : plan.description) ||
    "";

  // Price picker by currency + cycle. Schema stores USD/TRY/SAR directly;
  // AED shares USD pricing for now (the backend's payment.service maps
  // AED → USD columns).
  const priceForPlan = (plan: BillingPlan, cyc: "monthly" | "yearly"): number => {
    const c = resolvedCurrency;
    const key =
      c === "TRY"
        ? cyc === "monthly"
          ? plan.priceMonthlyTry
          : plan.priceYearlyTry
        : c === "SAR"
          ? cyc === "monthly"
            ? plan.priceMonthlySar
            : plan.priceYearlySar
          : cyc === "monthly"
            ? plan.priceMonthlyUsd
            : plan.priceYearlyUsd;
    return parseFloat(key) || 0;
  };

  const load = async () => {
    try {
      const [b, p, i] = await Promise.all([
        getCurrentBilling(),
        listBillingPlans(),
        listInvoices(10, invoiceOffset),
      ]);
      setBilling(b);
      setPlans(p);
      setInvoicePage(i);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message || e?.message || "Failed to load billing"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceOffset]);

  const handleUpgrade = async (plan: BillingPlan) => {
    if (!user || !billing) return;
    setActingPlan(plan.slug);
    try {
      const appOrigin = window.location.origin;
      const session = await createCheckoutSession({
        companyId: billing.company.id,
        planSlug: plan.slug,
        billingCycle: cycle,
        currency: resolvedCurrency,
        buyerCountry: undefined,
        successUrl: `${appOrigin}/${locale}/checkout/success`,
        cancelUrl: `${appOrigin}/${locale}/checkout/cancel`,
      });
      window.location.href = session.redirectUrl;
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Checkout failed");
      setActingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!billing?.subscription) return;
    if (
      !confirm(
        tr(
          "Cancel your subscription? You'll keep access until the end of the current period.",
          "إلغاء اشتراكك؟ ستحتفظ بالوصول حتى نهاية الفترة الحالية.",
          "Aboneliğinizi iptal etmek istiyor musunuz? Mevcut dönem sonuna kadar erişiminiz devam edecek."
        )
      )
    )
      return;
    setCancelLoading(true);
    try {
      await cancelSubscription(billing.subscription.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleResume = async () => {
    if (!billing?.subscription) return;
    setCancelLoading(true);
    try {
      await resumeSubscription(billing.subscription.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Resume failed");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell locale={locale}>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      </DashboardShell>
    );
  }

  const sub = billing?.subscription;
  const currentPlanSlug = sub?.plan.slug || "free";
  const scheduledToCancel = sub?.cancelAt && !sub.cancelledAt;

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-5xl mx-auto space-y-6" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              {tr("Billing", "الفوترة", "Faturalama")}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "Manage your plan, payment method, and invoices.",
                "قم بإدارة خطتك وطريقة الدفع والفواتير.",
                "Planınızı, ödeme yönteminizi ve faturalarınızı yönetin."
              )}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Scheduled cancellation banner */}
        {scheduledToCancel && sub && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">
                {tr(
                  "Subscription scheduled to cancel",
                  "تم جدولة إلغاء الاشتراك",
                  "Abonelik iptal için planlandı"
                )}
              </p>
              <p className="text-xs text-amber-800 mt-1">
                {tr(
                  `Your access ends on ${new Date(sub.cancelAt!).toLocaleDateString()}. You can keep your subscription to continue beyond that date.`,
                  `وصولك ينتهي في ${new Date(sub.cancelAt!).toLocaleDateString()}. يمكنك إبقاء اشتراكك للاستمرار بعد هذا التاريخ.`,
                  `Erişiminiz ${new Date(sub.cancelAt!).toLocaleDateString()} tarihinde sona erecek. Bu tarihten sonra devam etmek için aboneliğinizi koruyabilirsiniz.`
                )}
              </p>
              {canManage && (
                <button
                  onClick={handleResume}
                  disabled={cancelLoading}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg text-xs font-semibold text-amber-900 disabled:opacity-50"
                >
                  {cancelLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {tr("Keep subscription", "الاحتفاظ بالاشتراك", "Aboneliği koru")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Trial banner */}
        {billing?.company.trialEndsAt &&
          new Date(billing.company.trialEndsAt) > new Date() && (
            <div className="rounded-xl bg-gradient-to-r from-sky-50 to-sky-50 border border-sky-200 p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-sky-900">
                  {tr("Free trial active", "النسخة التجريبية مفعّلة", "Ücretsiz deneme aktif")}
                </p>
                <p className="text-xs text-sky-800 mt-1">
                  {tr(
                    `Trial ends on ${new Date(billing.company.trialEndsAt).toLocaleDateString()}. Upgrade any time to keep your features.`,
                    `تنتهي النسخة التجريبية في ${new Date(billing.company.trialEndsAt).toLocaleDateString()}. ترقّ في أي وقت للحفاظ على ميزاتك.`,
                    `Deneme ${new Date(billing.company.trialEndsAt).toLocaleDateString()} tarihinde sona eriyor. Özelliklerinizi korumak için dilediğiniz zaman yükseltin.`
                  )}
                </p>
              </div>
            </div>
          )}

        {/* Current plan card */}
        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-start gap-4 flex-wrap">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
              style={{
                background: sub?.plan
                  ? `linear-gradient(135deg, ${plans.find((p) => p.slug === sub.plan.slug)?.color || "#0EA5E9"}, #0284C7)`
                  : "linear-gradient(135deg, #64748B, #475569)",
              }}
            >
              {currentPlanSlug === "free" ? (
                <Zap className="w-5 h-5" />
              ) : currentPlanSlug === "enterprise" ? (
                <Crown className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-sky-900 capitalize">
                  {sub?.plan
                    ? locale === "ar"
                      ? sub.plan.nameAr
                      : locale === "tr"
                        ? sub.plan.nameTr
                        : sub.plan.name
                    : tr("Free plan", "الخطة المجانية", "Ücretsiz plan")}
                </h2>
                {sub && (
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      sub.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.status === "past_due"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {sub.status}
                  </span>
                )}
              </div>
              {sub ? (
                <>
                  <p className="text-sm text-slate-700 mt-1">
                    <span className="font-mono tabular-nums" dir="ltr">
                      {sub.amount} {sub.currency}
                    </span>
                    <span className="text-slate-500">
                      {" "}
                      /{" "}
                      {sub.billingCycle === "yearly"
                        ? tr("year", "سنة", "yıl")
                        : tr("month", "شهر", "ay")}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {tr(
                      `Next renewal: ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`,
                      `التجديد التالي: ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`,
                      `Sonraki yenileme: ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-600 mt-1">
                  {tr(
                    "Upgrade to unlock premium features.",
                    "قم بالترقية لفتح الميزات المتقدمة.",
                    "Premium özellikleri açmak için yükseltin."
                  )}
                </p>
              )}
            </div>
            {canManage && sub && !scheduledToCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg text-xs font-semibold text-rose-700 disabled:opacity-50"
              >
                {cancelLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                {tr("Cancel", "إلغاء", "İptal")}
              </button>
            )}
          </div>
        </div>

        {/* Plans picker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-sky-900">
              {tr("Available plans", "الخطط المتاحة", "Mevcut planlar")}
            </h3>
            <div className="inline-flex bg-white border border-sky-200 rounded-lg p-0.5">
              {BILLING_CYCLES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCycle(c.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    cycle === c.key
                      ? "bg-sky-500 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  {c.label[locale]}
                </button>
              ))}
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-xl border border-sky-100 bg-white p-6 text-sm text-slate-600 text-center">
              {tr(
                "Plans aren't configured yet. Contact support to upgrade.",
                "لم يتم تكوين الخطط بعد. اتصل بالدعم للترقية.",
                "Planlar henüz yapılandırılmadı. Yükseltmek için destekle iletişime geçin."
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isCurrent = plan.slug === currentPlanSlug;
                const price = priceForPlan(plan, cycle);
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border p-5 relative transition-all ${
                      isCurrent
                        ? "border-sky-400 ring-2 ring-sky-100 bg-sky-50/50"
                        : plan.isFeatured
                          ? "border-sky-300 bg-white hover:border-sky-400"
                          : "border-sky-100 bg-white hover:border-sky-300"
                    }`}
                  >
                    {plan.isFeatured && !isCurrent && (
                      <span className="absolute -top-2 right-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow">
                        {tr("Recommended", "موصى به", "Önerilen")}
                      </span>
                    )}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${plan.color}, #0284C7)`,
                      }}
                    >
                      {plan.slug === "free" ? (
                        <Zap className="w-4 h-4" />
                      ) : plan.slug === "enterprise" ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-sky-900 capitalize">
                      {nameForPlan(plan)}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {descriptionForPlan(plan) || " "}
                    </p>
                    <div className="mt-3">
                      <span
                        className="text-2xl font-bold text-sky-900 tabular-nums"
                        dir="ltr"
                      >
                        {price === 0
                          ? tr("Free", "مجاني", "Ücretsiz")
                          : `${price} ${resolvedCurrency}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-slate-500">
                          {" "}
                          /{" "}
                          {cycle === "yearly"
                            ? tr("year", "سنة", "yıl")
                            : tr("month", "شهر", "ay")}
                        </span>
                      )}
                    </div>
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                      {(plan.features || []).slice(0, 6).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(plan)}
                      disabled={
                        isCurrent || !canManage || actingPlan !== null
                      }
                      className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                        isCurrent
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50"
                      }`}
                    >
                      {actingPlan === plan.slug && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {isCurrent
                        ? tr("Current plan", "الخطة الحالية", "Mevcut plan")
                        : price === 0
                          ? tr("Downgrade", "التخفيض", "Düşür")
                          : tr("Upgrade", "ترقية", "Yükselt")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!canManage && (
            <p className="text-xs text-slate-500">
              {tr(
                "Only owners and admins can change the subscription.",
                "يمكن للمالكين والمديرين فقط تغيير الاشتراك.",
                "Yalnızca sahipler ve yöneticiler aboneliği değiştirebilir."
              )}
            </p>
          )}
        </div>

        {/* Invoices */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-500" />
            <h3 className="text-lg font-bold text-sky-900">
              {tr("Invoices", "الفواتير", "Faturalar")}
            </h3>
          </div>

          {!invoicePage || invoicePage.items.length === 0 ? (
            <div className="rounded-xl border border-sky-100 bg-white p-6 text-sm text-slate-500 text-center">
              {tr("No invoices yet.", "لا توجد فواتير بعد.", "Henüz fatura yok.")}
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-sky-100 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-sky-50 text-xs text-slate-600 uppercase">
                    <tr>
                      <th className="text-left rtl:text-right px-4 py-2.5">
                        {tr("Date", "التاريخ", "Tarih")}
                      </th>
                      <th className="text-left rtl:text-right px-4 py-2.5">
                        {tr("Plan", "الخطة", "Plan")}
                      </th>
                      <th className="text-right rtl:text-left px-4 py-2.5">
                        {tr("Amount", "المبلغ", "Tutar")}
                      </th>
                      <th className="text-center px-4 py-2.5">
                        {tr("Status", "الحالة", "Durum")}
                      </th>
                      <th className="text-left rtl:text-right px-4 py-2.5">
                        {tr("Method", "الطريقة", "Yöntem")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicePage.items.map((inv) => (
                      <InvoiceRow key={inv.id} inv={inv} locale={locale} />
                    ))}
                  </tbody>
                </table>
              </div>

              {invoicePage.pagination.total > 10 && (
                <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                  <span>
                    {tr(
                      `${invoiceOffset + 1}–${Math.min(invoiceOffset + 10, invoicePage.pagination.total)} of ${invoicePage.pagination.total}`,
                      `${invoiceOffset + 1}–${Math.min(invoiceOffset + 10, invoicePage.pagination.total)} من ${invoicePage.pagination.total}`,
                      `${invoiceOffset + 1}–${Math.min(invoiceOffset + 10, invoicePage.pagination.total)} / ${invoicePage.pagination.total}`
                    )}
                  </span>
                  <button
                    onClick={() => setInvoiceOffset(Math.max(0, invoiceOffset - 10))}
                    disabled={invoiceOffset === 0}
                    className="p-1.5 rounded bg-white border border-sky-200 hover:bg-sky-50 disabled:opacity-40"
                  >
                    <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? "-scale-x-100" : ""}`} />
                  </button>
                  <button
                    onClick={() => setInvoiceOffset(invoiceOffset + 10)}
                    disabled={invoiceOffset + 10 >= invoicePage.pagination.total}
                    className="p-1.5 rounded bg-white border border-sky-200 hover:bg-sky-50 disabled:opacity-40"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? "-scale-x-100" : ""}`} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function InvoiceRow({
  inv,
  locale,
}: {
  inv: Invoice;
  locale: "en" | "ar" | "tr";
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const statusStyle: Record<string, string> = {
    succeeded: "bg-emerald-100 text-emerald-800",
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    failed: "bg-rose-100 text-rose-800",
    refunded: "bg-slate-100 text-slate-700",
  };
  return (
    <tr className="border-t border-sky-100 hover:bg-sky-50/40">
      <td className="px-4 py-2.5">
        <time dir="ltr" className="text-xs tabular-nums">
          {new Date(inv.createdAt).toLocaleDateString()}
        </time>
      </td>
      <td className="px-4 py-2.5 text-slate-700">
        {inv.subscription?.plan.name || inv.description || "—"}
        {inv.subscription?.billingCycle && (
          <span className="text-xs text-slate-500 ml-1.5 rtl:ml-0 rtl:mr-1.5">
            ·{" "}
            {inv.subscription.billingCycle === "yearly"
              ? tr("yearly", "سنوي", "yıllık")
              : tr("monthly", "شهري", "aylık")}
          </span>
        )}
      </td>
      <td className="px-4 py-2.5 text-right rtl:text-left font-mono tabular-nums" dir="ltr">
        {inv.amount} {inv.currency}
      </td>
      <td className="px-4 py-2.5 text-center">
        <span
          className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
            statusStyle[inv.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {inv.status}
        </span>
      </td>
      <td className="px-4 py-2.5 text-xs text-slate-600">
        {inv.last4 ? (
          <span dir="ltr">
            {inv.cardBrand || "card"} •••• {inv.last4}
          </span>
        ) : (
          inv.method || inv.gateway
        )}
      </td>
    </tr>
  );
}
