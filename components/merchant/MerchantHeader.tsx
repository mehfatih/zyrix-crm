"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, Plus, Search } from "lucide-react";

import { NotificationsPanel } from "./NotificationsPanel";
import { openQuickAdd } from "./MerchantGlobalShortcuts";
import { NAV_ITEMS } from "./sidebar/nav-config";
import { getInitials } from "@/lib/utils";

interface MerchantHeaderProps {
  locale: string;
  isRTL: boolean;
  user: {
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
  onOpenSidebar?: () => void;
}

export function MerchantHeader({
  locale,
  isRTL,
  user,
  onLogout,
  onOpenSidebar,
}: MerchantHeaderProps) {
  const t = useTranslations("MerchantHeader");
  const sidebarT = useTranslations("MerchantSidebar");
  const pathname = usePathname() || "";

  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // Derive page title from current merchant path
  const slug = pathname.replace(`/${locale}/merchant`, "").replace(/^\//, "");
  const current = NAV_ITEMS.find((n) => n.path === slug);
  const titleKey = current?.labelKey || "home";
  const pageTitle = sidebarT(`items.${titleKey}`);

  const openSearch = () => {
    // Dispatch the same shortcut GlobalSearch listens for
    const ev = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: !isMac(),
      metaKey: isMac(),
      bubbles: true,
    });
    window.dispatchEvent(ev);
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center gap-3 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile hamburger handled inside MerchantShell */}
      {onOpenSidebar && (
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-current relative before:block before:absolute before:content-[''] before:w-5 before:h-0.5 before:bg-current before:-top-1.5 after:block after:absolute after:content-[''] after:w-5 after:h-0.5 after:bg-current after:top-1.5" />
        </button>
      )}

      {/* Page title / breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[18px] font-semibold text-[#0C4A6E] truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex-1" />

      {/* Search trigger */}
      <button
        type="button"
        onClick={openSearch}
        className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-muted-foreground hover:border-border hover:text-cyan-300 transition-colors"
        title={sidebarT("searchPlaceholder")}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">{sidebarT("searchPlaceholder")}</span>
        <kbd className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">
          {isMac() ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      {/* Create — opens QuickAdd modal */}
      <button
        type="button"
        onClick={() => openQuickAdd()}
        className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm active:scale-[0.97] transition-transform"
        title={t("create")}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{t("create")}</span>
        <kbd className="hidden md:inline-block text-[10px] font-semibold bg-card/20 border border-white/30 rounded px-1 py-0.5 ml-0.5">
          C
        </kbd>
      </button>

      {/* Notifications */}
      <NotificationsPanel locale={locale} isRTL={isRTL} />

      {/* Avatar menu */}
      <div ref={avatarRef} className="relative">
        <button
          type="button"
          onClick={() => setAvatarOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full hover:bg-muted p-1 pr-2 rtl:pl-2 rtl:pr-1"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center text-xs font-semibold">
              {getInitials(user.fullName)}
            </div>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {avatarOpen && (
          <div
            className={`absolute top-full mt-1 ${
              isRTL ? "left-0" : "right-0"
            } w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-40`}
          >
            <div className="px-3 py-2 text-xs text-muted-foreground truncate border-b border-border">
              {user.email}
            </div>
            <Link
              href={`/${locale}/merchant/settings`}
              onClick={() => setAvatarOpen(false)}
              className="block px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              {t("profile")}
            </Link>
            <Link
              href={`/${locale}/merchant/settings`}
              onClick={() => setAvatarOpen(false)}
              className="block px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              {t("settings")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setAvatarOpen(false);
                onLogout();
              }}
              className="w-full text-left block px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 border-t border-border"
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}
