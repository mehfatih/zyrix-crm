"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { verifyEmailApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";

interface VerifyEmailClientProps {
  locale: string;
}

function VerifyEmailContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailApi(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        setTimeout(() => {
          router.push(`/${locale}/signin`);
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(extractErrorMessage(error));
      }
    };

    verify();
  }, [token, locale, router]);

  return (
    <div className="max-w-md mx-auto text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-ink mb-2">
            Verifying your email...
          </h2>
          <p className="text-sm text-ink-light">Please wait a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">
            Email Verified!
          </h2>
          <p className="text-sm text-ink-light mb-6">{message}</p>
          <p className="text-xs text-ink-muted mb-4">
            Redirecting to sign-in in 3 seconds...
          </p>
          <Link
            href={`/${locale}/signin`}
            className="inline-block px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
          >
            Go to Sign In
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">
            Verification Failed
          </h2>
          <p className="text-sm text-ink-light mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${locale}/signin`}
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
            >
              Sign In
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="px-6 py-2.5 border border-line text-ink text-sm font-medium rounded-lg hover:bg-bg-subtle inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Sign Up
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
