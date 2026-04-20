"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { verifyEmailApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";

interface VerifyEmailClientProps {
  locale: string;
}

function VerifyEmailContent({ locale }: { locale: string }) {
  const t = useTranslations("Auth.verifyEmail");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("noToken"));
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailApi(token);
        setStatus("success");
        setMessage(t("successMessage"));
        setTimeout(() => {
          router.push(`/${locale}/signin`);
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(extractErrorMessage(error));
      }
    };

    verify();
  }, [token, locale, router, t]);

  return (
    <div className="max-w-md mx-auto text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-ink mb-2">{t("verifying")}</h2>
          <p className="text-sm text-ink-light">{t("pleaseWait")}</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">{t("success")}</h2>
          <p className="text-sm text-ink-light mb-6">{message}</p>
          <p className="text-xs text-ink-muted mb-4">{t("redirectingToSignIn")}</p>
          <Link
            href={`/${locale}/signin`}
            className="inline-block px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
          >
            {t("goToSignIn")}
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">{t("failed")}</h2>
          <p className="text-sm text-ink-light mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${locale}/signin`}
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
            >
              {t("signIn")}
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="px-6 py-2.5 border border-line text-ink text-sm font-medium rounded-lg hover:bg-bg-subtle inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {t("signUp")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export function VerifyEmailClient({ locale }: VerifyEmailClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <VerifyEmailContent locale={locale} />
    </Suspense>
  );
}
