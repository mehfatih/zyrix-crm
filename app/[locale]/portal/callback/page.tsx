"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { verifyMagicToken, setPortalSession } from "@/lib/api/portal";

// ============================================================================
// PORTAL CALLBACK — exchanges ?token= for session, redirects to dashboard
// ============================================================================

export default function PortalCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );
}

function CallbackInner() {
  const router = useRouter();
  const search = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Portal.callback");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = search?.get("token");
    if (!token) {
      setError(t("errors.missingToken"));
      return;
    }

    (async () => {
      try {
        const result = await verifyMagicToken(token);
        setPortalSession(result.sessionToken);
        router.replace(`/${locale}/portal/dashboard`);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errors.invalidToken"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-lg mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {error ? (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-xl">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-900 mb-1">
              {t("errorTitle")}
            </h2>
            <p className="text-sm text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/${locale}/portal`)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg"
            >
              {t("backToLogin")}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-sky-900">{t("title")}</h2>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
