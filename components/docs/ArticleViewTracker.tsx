"use client";

import { useEffect } from "react";
import type { DocLocale } from "@/lib/docs/constants";

// ============================================================================
// ArticleViewTracker — fires one view event per mount (and a time-on-page
// beacon on unload) to the backend analytics endpoint. Best-effort only.
// ============================================================================

export default function ArticleViewTracker({
  locale,
  category,
  slug,
}: {
  locale: DocLocale;
  category: string;
  slug: string;
}) {
  useEffect(() => {
    const started = Date.now();
    const body = JSON.stringify({
      event: "view",
      locale,
      category,
      slug,
      path: `/${locale}/docs/${category}/${slug}`,
    });
    try {
      fetch("/api/docs/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch {
      /* no-op */
    }

    const onLeave = () => {
      const elapsed = Math.max(1, Math.round((Date.now() - started) / 1000));
      try {
        const payload = JSON.stringify({
          event: "dwell",
          locale,
          category,
          slug,
          seconds: elapsed,
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/docs/analytics",
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch("/api/docs/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        /* best effort */
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      onLeave();
    };
  }, [locale, category, slug]);

  return null;
}
