"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Check } from "lucide-react";

// ============================================================================
// HEADER LANGUAGE SWITCHER
// ----------------------------------------------------------------------------
// Mirrors the mobile app design so platforms feel identical:
//   • Circular 40×40 pill button with white background + cyan border
//   • Shows short locale code (En/Ar/Tr) in bold 14px
//   • Dropdown opens with 3 language options + native names
//   • Current language row has a cyan background + checkmark
//
// Behavior:
//   • Only changes the URL locale segment — NEVER touches currency/country.
//   • Accessible: aria-label, keyboard Tab/Enter/Escape, visible focus ring.
// ============================================================================

const LOCALES = [
  { code: "en", short: "En", label: "English" },
  { code: "ar", short: "Ar", label: "العربية" },
  { code: "tr", short: "Tr", label: "Türkçe" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = ((params?.locale as string) || "en") as LocaleCode;
  const current = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const changeLocale = (nextLocale: LocaleCode) => {
    if (nextLocale === currentLocale) {
      setOpen(false);
      return;
    }
    // Persist preference so direct links still honour the user's choice.
    if (typeof document !== "undefined") {
      document.cookie = `zyrix_locale=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
    const segments = (pathname || `/${currentLocale}`).split("/");
    if (segments[1] && LOCALES.some((l) => l.code === segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const next = segments.join("/") || `/${nextLocale}`;
    setOpen(false);
    router.push(next);
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 40,
          height: 40,
          borderRadius: "9999px",
          background: "#FFFFFF",
          border: "1.5px solid #0891B2",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: "#0891B2",
          cursor: "pointer",
          boxShadow: open
            ? "0 4px 16px rgba(8,145,178,0.15)"
            : "0 1px 3px rgba(8,145,178,0.08)",
          transition: "box-shadow 180ms ease, transform 180ms ease",
        }}
      >
        <span>{current.short}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Language options"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 200,
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(8,145,178,0.15)",
            border: "1px solid #BAE6FD",
            padding: 4,
            zIndex: 60,
            overflow: "hidden",
          }}
        >
          {LOCALES.map((loc) => {
            const active = loc.code === currentLocale;
            return (
              <button
                key={loc.code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => changeLocale(loc.code)}
                style={{
                  width: "100%",
                  height: 40,
                  paddingLeft: 16,
                  paddingRight: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: active ? "rgba(8,145,178,0.08)" : "transparent",
                  color: active ? "#0891B2" : "#164E63",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "background-color 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "rgba(224, 242, 254, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, minWidth: 22 }}>
                    {loc.short}
                  </span>
                  <span style={{ color: "#475569", fontWeight: 500 }}>
                    {loc.label}
                  </span>
                </span>
                {active && (
                  <Check size={16} style={{ color: "#0891B2" }} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
