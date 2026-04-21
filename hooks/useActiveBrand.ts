"use client";

import { useEffect, useState } from "react";
import { getActiveBrandId } from "@/lib/api/advanced";

// ============================================================================
// useActiveBrand
// ----------------------------------------------------------------------------
// Returns the currently-selected brand id from localStorage + listens to
// the 'zyrix:brand-changed' window event so list pages auto-refetch when
// the user picks a different brand from the header switcher.
// ============================================================================

export function useActiveBrand(): string | null {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR — hydrate on mount
    setBrandId(getActiveBrandId());
    setMounted(true);

    const handler = (e: Event) => {
      const next = (e as CustomEvent).detail as string | null;
      setBrandId(next);
    };
    window.addEventListener("zyrix:brand-changed", handler as EventListener);
    return () =>
      window.removeEventListener(
        "zyrix:brand-changed",
        handler as EventListener
      );
  }, []);

  // Returns null during SSR hydration to avoid mismatched first render
  return mounted ? brandId : null;
}
