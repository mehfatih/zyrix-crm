"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShieldAlert, X } from "lucide-react";
import {
  setAccessToken,
  getAccessToken,
  clearAuth,
  getUser,
  setUser,
} from "@/lib/auth/token-storage";

// ============================================================================
// IMPERSONATION BANNER
// ============================================================================
// Behavior:
// 1. On mount, reads ?impersonation=<jwt> query param (if any).
// 2. Decodes JWT client-side, verifies imp:true claim, saves token, writes
//    the impersonated user into the user cache, strips the param from URL.
// 3. Renders a red sticky banner for the entire impersonation session.
// 4. "End session" button clears the token and closes the tab (or redirects
//    back to /admin if no opener).
// ============================================================================

interface DecodedJwt {
  userId?: string;
  companyId?: string;
  email?: string;
  role?: string;
  imp?: boolean;
  impBy?: string;
  exp?: number;
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : "";
    const json = atob(normalized + pad);
    return JSON.parse(json) as DecodedJwt;
  } catch {
    return null;
  }
}

interface Props {
  locale: string;
}

export default function ImpersonationBanner({ locale }: Props) {
  return (
    <Suspense fallback={null}>
      <ImpersonationBannerInner locale={locale} />
    </Suspense>
  );
}

function ImpersonationBannerInner({ locale }: Props) {
  const t = useTranslations("Admin.impersonation");
  const router = useRouter();
  const params = useSearchParams();

  const [active, setActive] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Step 1 — query param means this tab is being initialised as an
    // impersonation session. Adopt the token, then strip the param.
    const tokenFromUrl = params?.get("impersonation");
    if (tokenFromUrl) {
      const decoded = decodeJwt(tokenFromUrl);
      if (decoded?.imp && decoded.email && decoded.userId) {
        setAccessToken(tokenFromUrl);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          fullName: decoded.email,
          role: (decoded.role as "owner") ?? "owner",
          companyId: decoded.companyId ?? "",
          emailVerified: true,
        });
        setEmail(decoded.email);
        setActive(true);
        // Clean the URL
        router.replace(`/${locale}/dashboard`);
        return;
      }
    }

    // Step 2 — no URL param, but we may still be mid-impersonation from
    // a previous page load. Re-decode whatever token we already hold.
    const stored = getAccessToken();
    if (stored) {
      const decoded = decodeJwt(stored);
      if (decoded?.imp) {
        setEmail(decoded.email ?? getUser()?.email ?? null);
        setActive(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function endSession() {
    clearAuth();
    // Try to close the tab (only works if it was opened by window.open).
    // Otherwise redirect back to the admin panel.
    const closed = window.close();
    // close() returns undefined either way — wait a beat then redirect.
    setTimeout(() => {
      window.location.href = `/${locale}/admin/companies`;
    }, 100);
    void closed;
  }

  if (!active) return null;

  return (
    <div className="sticky top-0 z-50 bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 ring-2 ring-white/30 flex items-center justify-center">
            <ShieldAlert size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">
              {t("badge")}
            </div>
            <div className="text-sm font-semibold truncate">
              {t("banner", { email: email ?? "—" })}
            </div>
          </div>
        </div>
        <button
          onClick={endSession}
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 font-bold text-xs px-3 py-1.5 rounded-md shadow-sm"
        >
          <X size={14} />
          {t("endSession")}
        </button>
      </div>
    </div>
  );
}
