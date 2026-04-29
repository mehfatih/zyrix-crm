"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Check,
  ChevronDown,
  Loader2,
  Plus,
  Layers,
} from "lucide-react";
import {
  listBrands,
  getActiveBrandId,
  setActiveBrandId,
  type Brand,
} from "@/lib/api/advanced";

// ============================================================================
// BRAND SWITCHER
// ----------------------------------------------------------------------------
// Compact dropdown that sits next to the NotificationBell. Reads the list
// of brands on mount, stores the current selection in localStorage via
// setActiveBrandId, and dispatches a zyrix:brand-changed event so list
// pages can refetch their data with the new filter.
// ============================================================================

export function BrandSwitcher() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setLocalActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listBrands();
      setBrands(data);
      // If there's no active selection yet, default to the flagged default
      const current = getActiveBrandId();
      if (current === null) {
        const def = data.find((b) => b.isDefault);
        if (def) {
          setActiveBrandId(def.id);
          setLocalActive(def.id);
        }
      } else {
        // Verify the cached activeBrandId still exists + is not archived
        const stillValid = data.find((b) => b.id === current && !b.isArchived);
        if (!stillValid) {
          const def = data.find((b) => b.isDefault);
          setActiveBrandId(def?.id ?? null);
          setLocalActive(def?.id ?? null);
        } else {
          setLocalActive(current);
        }
      }
    } catch {
      /* silent — no brands yet or offline */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Listen for brand-changed events from other parts of the app
    const handler = (e: Event) => {
      const next = (e as CustomEvent).detail as string | null;
      setLocalActive(next);
    };
    window.addEventListener("zyrix:brand-changed", handler as EventListener);
    return () =>
      window.removeEventListener("zyrix:brand-changed", handler as EventListener);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const activeBrand = activeBrandId
    ? brands.find((b) => b.id === activeBrandId)
    : null;

  const handlePick = (id: string | null) => {
    setActiveBrandId(id);
    setLocalActive(id);
    setOpen(false);
  };

  // Hide the switcher entirely when there are no brands configured —
  // single-brand merchants don't need to see it.
  if (!loading && brands.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted border border-border bg-card max-w-40"
        aria-label={tr("Switch brand", "تبديل العلامة", "Markayı değiştir")}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        ) : (
          <>
            <BrandDot color={activeBrand?.primaryColor ?? null} />
            <span className="truncate">
              {activeBrand?.name ?? tr("All brands", "كل العلامات", "Tüm markalar")}
            </span>
          </>
        )}
        <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute top-10 ${
            isRtl ? "left-0" : "right-0"
          } w-64 rounded-xl border border-border bg-card shadow-xl overflow-hidden z-50`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="p-2 border-b border-sky-50">
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide px-2 pt-1 pb-0.5">
              {tr("Active brand", "العلامة النشطة", "Aktif marka")}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {/* 'All brands' option */}
            <button
              onClick={() => handlePick(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left rtl:text-right hover:bg-muted ${
                !activeBrandId ? "bg-muted" : ""
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center flex-shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  {tr("All brands", "كل العلامات", "Tüm markalar")}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {tr("Show everything", "عرض الكل", "Her şeyi göster")}
                </div>
              </div>
              {!activeBrandId && (
                <Check className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
              )}
            </button>

            {/* Individual brands */}
            {brands
              .filter((b) => !b.isArchived)
              .map((b) => (
                <button
                  key={b.id}
                  onClick={() => handlePick(b.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left rtl:text-right hover:bg-muted ${
                    activeBrandId === b.id ? "bg-muted" : ""
                  }`}
                >
                  <BrandBadge brand={b} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1">
                      {b.name}
                      {b.isDefault && (
                        <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-amber-100 text-amber-800">
                          {tr("Default", "افتراضي", "Varsayılan")}
                        </span>
                      )}
                    </div>
                    <code className="text-[10px] text-muted-foreground font-mono" dir="ltr">
                      {b.slug}
                    </code>
                  </div>
                  {activeBrandId === b.id && (
                    <Check className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
                  )}
                </button>
              ))}
          </div>

          <div className="p-1 border-t border-sky-50 bg-muted/30">
            <Link
              href={`/${locale}/settings/brands`}
              onClick={() => setOpen(false)}
              className="block w-full text-center text-[11px] font-semibold text-cyan-300 hover:text-foreground py-1.5"
            >
              <Plus className="w-3 h-3 inline me-1" />
              {tr("Manage brands", "إدارة العلامات", "Markaları yönet")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function BrandDot({ color }: { color: string | null }) {
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{
        background: color ?? "linear-gradient(135deg, #0EA5E9, #38BDF8)",
      }}
    />
  );
}

function BrandBadge({ brand }: { brand: Brand }) {
  const initials = brand.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-7 h-7 rounded-lg text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{
        background: brand.primaryColor ?? "linear-gradient(135deg, #0EA5E9, #38BDF8)",
      }}
    >
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        initials || <Store className="w-3.5 h-3.5" />
      )}
    </div>
  );
}
