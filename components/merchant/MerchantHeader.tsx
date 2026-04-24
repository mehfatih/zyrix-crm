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
      className="sticky top-0 z-30 h-16 bg-white border-b border-sky-100 flex items-center gap-3 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile hamburger handled inside MerchantShell */}
      {onOpenSidebar && (
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:bg-cyan-50"
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
        className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-sky-100 text-slate-400 hover:border-cyan-200 hover:text-cyan-700 transition-colors"
        title={sidebarT("searchPlaceholder")}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">{sidebarT("searchPlaceholder")}</span>
        <kbd className="text-[10px] font-semibold text-slate-500 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5">
          {isMac() ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      {/* Create — opens QuickAdd modal */}
      <button
        type="button"
        onClick={() => openQuickAdd()}
        className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm active:scale-[0.97] transition-transform"
        title={t("create")}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{t("create")}</span>
        <kbd className="hidden md:inline-block text-[10px] font-semibold bg-white/20 border border-white/30 rounded px-1 py-0.5 ml-0.5">
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
          className="flex items-center gap-1.5 rounded-full hover:bg-cyan-50 p-1 pr-2 rtl:pl-2 rtl:pr-1"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center text-xs font-semibold">
              {getInitials(user.fullName)}
            </div>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
        {avatarOpen && (
          <div
            className={`absolute top-full mt-1 ${
              isRTL ? "left-0" : "right-0"
            } w-56 bg-white border border-sky-100 rounded-xl shadow-lg overflow-hidden z-40`}
          >
            <div className="px-3 py-2 text-xs text-slate-500 truncate border-b border-sky-100">
              {user.email}
            </div>
            <Link
              href={`/${locale}/merchant/settings`}
              onClick={() => setAvatarOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50"
            >
              {t("profile")}
            </Link>
            <Link
              href={`/${locale}/merchant/settings`}
              onClick={() => setAvatarOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50"
            >
              {t("settings")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setAvatarOpen(false);
                onLogout();
              }}
              className="w-full text-left block px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 border-t border-sky-100"
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
