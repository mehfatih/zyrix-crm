"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  clearAdminAuth,
  fetchMe,
  getAdminAccessToken,
  getAdminUser,
  isAdminTokenExpired,
  type AdminUser,
} from "@/lib/api/admin";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Receipt,
  FileText,
  Megaphone,
  LifeBuoy,
  Settings,
  LogOut,
  ShieldCheck,
  Loader2,
  BookOpen,
} from "lucide-react";

// ============================================================================
// ADMIN SHELL — sidebar + topbar + auth guard
// ============================================================================

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { href: "/admin/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/companies", labelKey: "companies", icon: Building2 },
  { href: "/admin/users", labelKey: "users", icon: Users },
  { href: "/admin/plans", labelKey: "plans", icon: Package },
  { href: "/admin/billing", labelKey: "billing", icon: Receipt },
  { href: "/admin/docs", labelKey: "docs", icon: BookOpen },
  { href: "/admin/audit", labelKey: "audit", icon: FileText },
  { href: "/admin/announcements", labelKey: "announcements", icon: Megaphone },
  { href: "/admin/support", labelKey: "support", icon: LifeBuoy },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
];

export default function AdminShell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const t = useTranslations("Admin");
  const tNav = useTranslations("Admin.nav");
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<AdminUser | null>(null);

  useEffect(() => {
    const token = getAdminAccessToken();
    if (!token) {
      router.replace(`/${locale}/admin/login`);
      return;
    }

    // Short-circuit when the stored expiry has already passed. Skips
    // the network round-trip and keeps the redirect UX snappy.
    if (isAdminTokenExpired()) {
      clearAdminAuth();
      router.replace(`/${locale}/admin/login`);
      return;
    }

    const cached = getAdminUser();
    if (cached) setMe(cached);

    fetchMe()
      .then((user) => {
        if (user.role !== "super_admin") {
          clearAdminAuth();
          router.replace(`/${locale}/admin/login`);
          return;
        }
        setMe(user);
        setReady(true);
      })
      .catch(() => {
        clearAdminAuth();
        router.replace(`/${locale}/admin/login`);
      });
  }, [locale, router]);

  function handleLogout() {
    clearAdminAuth();
    router.replace(`/${locale}/admin/login`);
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname.startsWith(`/${locale}${href}`) ||
    pathname === `/${locale}${href}`;

  return (
    <div className="min-h-screen flex bg-sky-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-e border-sky-100 shadow-sm">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900">
                {t("brand")}
              </div>
              <div className="text-[10px] font-semibold text-sky-600 tracking-wide">
                {t("badge")}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-sky-500" : "text-slate-500"}
                />
                <span>{tNav(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        <div className="border-t border-sky-100 p-3">
          <div className="rounded-lg bg-sky-50 p-3 mb-2">
            <div className="text-xs text-slate-500">{me?.email}</div>
            <div className="text-xs font-semibold text-sky-600 mt-0.5">
              {t(`role.${me?.role ?? "super_admin"}`)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={16} />
            {tNav("logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (admin mode indicator) */}
        <div className="h-2 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500" />

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              {t("brand")}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-600 hover:text-red-600"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
