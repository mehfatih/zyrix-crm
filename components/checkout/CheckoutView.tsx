"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  createCheckoutSession,
  type CheckoutBilling,
  type CheckoutCurrency,
} from "@/lib/api/payments";
import { getUser, getCompany, getAccessToken } from "@/lib/auth/token-storage";
import { Loader2, ShieldCheck, CreditCard, AlertCircle } from "lucide-react";

// ============================================================================
// CHECKOUT VIEW
// ============================================================================
// Reads ?plan=business&billing=monthly&currency=SAR, verifies the user is
// signed in (else redirects to signup?next=/checkout?...), calls
// /api/payments/checkout/create-session, then redirects to the gateway.
//
// Wrapped in <Suspense> because useSearchParams opts the tree into CSR only;
// Next.js 15+ requires the boundary to allow the surrounding page to still
// prerender its static chrome.
// ============================================================================

const CURRENCY_SYMBOL: Record<CheckoutCurrency, string> = {
  USD: "$",
  TRY: "₺",
  SAR: "﷼",
  AED: "د.إ",
};

interface Props {
  locale: string;
}

export default function CheckoutView({ locale }: Props) {
  return (
    <Suspense fallback={<CheckoutLoadingFallback />}>
      <CheckoutContent locale={locale} />
    </Suspense>
  );
}

function CheckoutLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 p-8 text-center">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
      </div>
    </div>
  );
}

function CheckoutContent({ locale }: Props) {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const params = useSearchParams();

  const plan = params?.get("plan") ?? "";
  const billing = (params?.get("billing") ?? "monthly") as CheckoutBilling;
  const currency = (params?.get("currency") ?? "USD") as CheckoutCurrency;

  const [status, setStatus] = useState<
    "init" | "redirecting" | "error" | "need_signup"
  >("init");
  const [error, setError] = useState<string | null>(null);

  const originUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  useEffect(() => {
    // Validate params
    if (!plan || plan === "free" || plan === "enterprise") {
      setStatus("error");
      setError(t("invalidPlan"));
      return;
    }
    if (!["monthly", "yearly"].includes(billing)) {
      setStatus("error");
      setError(t("invalidBilling"));
      return;
    }
    if (!["USD", "TRY", "SAR", "AED"].includes(currency)) {
      setStatus("error");
      setError(t("invalidCurrency"));
      return;
    }

    // Check auth — user must be signed in to have a companyId
    const user = getUser();
    const company = getCompany();
    const token = getAccessToken();
    if (!user || !company || !token) {
      setStatus("need_signup");
      return;
    }

    // Fire the checkout session creation
    (async () => {
      setStatus("redirecting");
      try {
        const successUrl = `${originUrl}/${locale}/checkout/success`;
        const cancelUrl = `${originUrl}/${locale}/checkout/cancel`;
        const result = await createCheckoutSession(
          {
            companyId: company.id,
            planSlug: plan,
            billingCycle: billing,
            currency,
            successUrl,
            cancelUrl,
          },
          token
        );

        // Persist the clientReference so the success page can confirm stub
        try {
          sessionStorage.setItem(
            "zyrix_checkout_session",
            JSON.stringify({
              clientReference: result.clientReference,
              gateway: result.gateway,
              amount: result.amount,
              currency: result.currency,
              planSlug: plan,
            })
          );
        } catch {
          // ignore
        }

        // Redirect to gateway (real or stub)
        window.location.href = result.redirectUrl;
      } catch (err: unknown) {
        setStatus("error");
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { error?: { message?: string } } } })
            .response?.data?.error?.message === "string"
        ) {
          setError(
            (err as { response: { data: { error: { message: string } } } })
              .response.data.error.message
          );
        } else {
          setError(t("genericError"));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, billing, currency]);

  const signupHref = `/${locale}/signup?plan=${plan}&next=${encodeURIComponent(
    `/${locale}/checkout?plan=${plan}&billing=${billing}&currency=${currency}`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-cyan-600 flex items-center justify-center">
            <CreditCard size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t("title")}</h1>
            <p className="text-xs text-slate-500">{t("subtitle")}</p>
          </div>
        </div>

        {/* Plan summary */}
        {plan && (
          <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {t("plan")}
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1 capitalize">
                  {plan}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {billing === "monthly" ? t("billedMonthly") : t("billedYearly")}
                </div>
              </div>
              <div className="text-end">
                <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {t("currency")}
                </div>
                <div className="text-lg font-bold text-cyan-700 mt-1">
                  {CURRENCY_SYMBOL[currency]} {currency}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {status === "init" && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="animate-spin text-cyan-600" />
          </div>
        )}

        {status === "redirecting" && (
          <div className="text-center py-8">
            <Loader2
              size={32}
              className="animate-spin text-cyan-600 mx-auto mb-3"
            />
            <p className="text-sm font-medium text-slate-800">
              {t("redirecting")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t("redirectingDetail")}
            </p>
          </div>
        )}

        {status === "need_signup" && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 text-amber-800 px-3 py-2 text-sm font-medium mb-4 ring-1 ring-amber-200">
              <AlertCircle size={16} />
              {t("needSignup")}
            </div>
            <p className="text-sm text-slate-600 mb-5">
              {t("needSignupDetail")}
            </p>
            <Link
              href={signupHref}
              className="inline-flex items-center justify-center w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              {t("continueToSignup")}
            </Link>
            <div className="mt-3 text-xs text-slate-500">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href={`/${locale}/signin?next=${encodeURIComponent(
                  `/${locale}/checkout?plan=${plan}&billing=${billing}&currency=${currency}`
                )}`}
                className="text-cyan-700 font-semibold hover:underline"
              >
                {t("signIn")}
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 mb-4">
              <div className="font-semibold mb-1">{t("errorTitle")}</div>
              <div>{error}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.back()}
                className="flex-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold"
              >
                {t("goBack")}
              </button>
              <Link
                href={`/${locale}/pricing`}
                className="flex-1 text-center rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 text-sm font-semibold"
              >
                {t("backToPricing")}
              </Link>
            </div>
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-cyan-600" />
          {t("secureCheckout")}
        </div>
      </div>
    </div>
  );
}
