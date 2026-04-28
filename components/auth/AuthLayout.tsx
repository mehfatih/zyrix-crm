"use client";

import { type ReactNode } from "react";
import { Nav } from "@/components/experience/Nav";
import { SiteFooter } from "@/components/experience/SiteFooter";

interface AuthLayoutProps {
  children: ReactNode;
  locale: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-20 pt-24 md:pt-28">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-card border border-border shadow-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
