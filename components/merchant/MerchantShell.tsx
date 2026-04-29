"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SmartSidebar } from "./SmartSidebar";
import { MerchantHeader } from "./MerchantHeader";
import { MerchantGlobalShortcuts } from "./MerchantGlobalShortcuts";
import { useAuth } from "@/lib/auth/context";
import { getDirection, type Locale } from "@/i18n";

interface MerchantShellProps {
  locale: string;
  children: ReactNode;
}

export function MerchantShell({ locale, children }: MerchantShellProps) {
  const router = useRouter();
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/signin`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated (and router.replace hasn't happened yet), render fallback
  if (!isAuthenticated || !user || !company) {
    return null;
  }

  const isRTL = getDirection(locale as Locale) === "rtl";

  const sidebarProps = {
    locale,
    isRTL,
    user: {
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
    },
    company: {
      name: company.name,
      plan: company.plan,
    },
    onLogout: () => {
      void logout();
    },
  };

  return (
    <div
      className="min-h-screen bg-background flex"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Desktop / tablet sidebar — always mounted */}
      <div className="hidden lg:flex">
        <SmartSidebar {...sidebarProps} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-background/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`h-full bg-card ${
              isRTL ? "order-first" : ""
            }`}
            style={{ width: 280 }}
          >
            <SmartSidebar
              {...sidebarProps}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <MerchantHeader
          locale={locale}
          isRTL={isRTL}
          user={{
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatarUrl || undefined,
          }}
          onLogout={() => {
            void logout();
          }}
          onOpenSidebar={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <MerchantGlobalShortcuts locale={locale} isRTL={isRTL} />
    </div>
  );
}
