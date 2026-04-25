"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, X } from "lucide-react";

// ============================================================================
// PERSISTENT "START FREE" CALL-TO-ACTION
// ----------------------------------------------------------------------------
// Floating button on desktop (bottom-right) / sticky bottom bar on mobile.
// Visible to logged-out visitors on every public landing page so the primary
// conversion action is always one click away.
//
// Hides on /signup + /signin to avoid redundant CTAs, and can be dismissed
// by the user (preference stored in sessionStorage for the current tab).
// Token presence check intentionally runs client-side only — this is purely
// a UX nudge for anonymous visitors.
// ============================================================================

const DISMISS_KEY = "zyrix_sticky_cta_dismissed";
const TOKEN_KEY = "zyrix_merchant_token";

export default function StickyCTA() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("Home.hero");

  const [dismissed, setDismissed] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
      setLoggedIn(Boolean(localStorage.getItem(TOKEN_KEY)));
    } catch {
      setLoggedIn(false);
    }
  }, []);

  if (loggedIn !== false) return null; // don't render on server or for signed-in users
  if (dismissed) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setDismissed(true);
  };

  return (
    <>
      {/* Mobile: full-width sticky bottom bar */}
      <div
        className="sticky-cta-mobile"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid #BAE6FD",
          boxShadow: "0 -6px 20px rgba(8, 145, 178, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link
          href={`/${locale}/signup`}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 18px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #0EA5E9 0%, #22D3EE 100%)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(8, 145, 178, 0.3)",
          }}
        >
          <Sparkles size={16} />
          {t("stickyCta")}
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "#F0F9FF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0284C7",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Desktop: bottom-right floating pill */}
      <div
        className="sticky-cta-desktop"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Link
          href={`/${locale}/signup`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 22px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, #0EA5E9 0%, #22D3EE 100%)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 10px 32px rgba(8, 145, 178, 0.35)",
            transition: "transform 180ms ease, box-shadow 180ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(0)";
          }}
        >
          <Sparkles size={16} />
          {t("stickyCta")}
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            width: 36,
            height: 36,
            borderRadius: "9999px",
            background: "#FFFFFF",
            border: "1px solid #BAE6FD",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0284C7",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(8, 145, 178, 0.12)",
          }}
        >
          <X size={16} />
        </button>
      </div>

      <style jsx>{`
        .sticky-cta-desktop {
          display: none;
        }
        .sticky-cta-mobile {
          display: flex;
        }
        @media (min-width: 768px) {
          .sticky-cta-desktop {
            display: flex;
          }
          .sticky-cta-mobile {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
