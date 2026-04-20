"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { confirmStubPayment } from "@/lib/api/payments";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

// ============================================================================
// CHECKOUT SUCCESS VIEW
// ============================================================================
// Two possible states:
//   1. Stub mode (backend has no gateway creds) — this page received ?stub=1
//      in the URL and must call POST /api/payments/checkout/confirm-stub
//      with the stored clientReference to activate the subscription.
//   2. Real gateway — the gateway already sent the webhook to our backend,
//      which activated the subscription. We just display success.
//
// Wrapped in <Suspense> — useSearchParams requires it under Next 15+.
// ============================================================================

interface Props {
  locale: string;
}

type Status = "confirming" | "succeeded" | "failed";

export default function CheckoutSuccessView({ locale }: Props) {
  return (
    <Suspense fallback={<SuccessLoadingFallback />}>
      <SuccessContent locale={locale} />
    </Suspense>
  );
}

function SuccessLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 p-8 text-center">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
      </div>
    </div>
  );
}

function SuccessContent({ locale }: Props) {
  const t = useTranslations("Checkout");
  const params = useSearchParams();

  const [status, setStatus] = useState<Status>("confirming");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{
    clientReference?: string;
    gateway?: string;
    amount?: number;
    currency?: string;
    planSlug?: string;
  } | null>(null);

  useEffect(() => {
    // Pull the persisted checkout session
    let stored: typeof session = null;
    try {
      const raw = sessionStorage.getItem("zyrix_checkout_session");
      if (raw) stored = JSON.parse(raw);
    } catch {
      // ignore
    }
    setSession(stored);

    const isStub = params?.get("stub") === "1";
    const ref = params?.get("ref") ?? stored?.clientReference;

    if (isStub && ref) {
      (async () => {
        try {
          await confirmStubPayment(ref);
          setStatus("succeeded");
          try {
            sessionStorage.removeItem("zyrix_checkout_session");
          } catch {
            // ignore
          }
        } catch (err: unknown) {
          setStatus("failed");
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
            setError(t("confirmFailed"));
          }
        }
      })();
    } else {
      // Real gateway — webhook already activated us. Just show success.
      setStatus("succeeded");
      try {
        sessionStorage.removeItem("zyrix_checkout_session");
      } catch {
        // ignore
      }
    }
  }, [params, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cyan-100 p-8">
        {status === "confirming" && (
          <div className="text-center py-6">
            <Loader2
              size={44}
              className="animate-spin text-cyan-600 mx-auto mb-5"
            />
            <h1 className="text-lg font-bold text-slate-900">
              {t("activating")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("activatingDetail")}
            </p>
          </div>
        )}

        {status === "succeeded" && (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-50">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {t("successTitle")}
            </h1>
            <p className="text-sm text-slate-600 mt-2">{t("successDetail")}</p>

            {session && session.amount !== undefined && (
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 mt-5 text-start">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      {t("plan")}
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5 capitalize">
                      {session.planSlug}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      {t("amount")}
                    </div>
                    <div className="text-base font-bold text-cyan-700 mt-0.5">
                      {session.currency} {session.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center justify-center w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-4 py-2.5 text-sm font-semibold mt-6"
            >
              {t("goToDashboard")}
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5 ring-4 ring-red-50">
              <XCircle size={32} className="text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {t("failedTitle")}
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              {error ?? t("failedDetail")}
            </p>
            <div className="flex gap-2 mt-5">
              <Link
                href={`/${locale}/pricing`}
                className="flex-1 text-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold"
              >
                {t("backToPricing")}
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                className="flex-1 text-center rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 text-sm font-semibold"
              >
                {t("goToDashboard")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
