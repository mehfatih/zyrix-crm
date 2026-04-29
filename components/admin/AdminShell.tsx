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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname.startsWith(`/${locale}${href}`) ||
    pathname === `/${locale}${href}`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-card border-e border-border shadow-sm">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck size={18} className="text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-foreground">
                {t("brand")}
              </div>
              <div className="text-[10px] font-semibold text-cyan-300 tracking-wide">
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
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-cyan-300" : "text-muted-foreground"}
                />
                <span>{tNav(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        <div className="border-t border-border p-3">
          <div className="rounded-lg bg-muted p-3 mb-2">
            <div className="text-xs text-muted-foreground">{me?.email}</div>
            <div className="text-xs font-semibold text-cyan-300 mt-0.5">
              {t(`role.${me?.role ?? "super_admin"}`)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            {tNav("logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (admin mode indicator) */}
        <div className="h-2 bg-gradient-to-r from-primary via-violet-500 to-primary" />

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck size={14} className="text-primary-foreground" />
            </div>
            <div className="text-sm font-bold text-foreground">
              {t("brand")}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-rose-300"
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
