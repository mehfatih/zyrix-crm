"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SearchOverlay from "./SearchOverlay";
import DocsSidebar from "./DocsSidebar";
import type { SearchRecord } from "@/lib/docs/buildSearchIndex";
import type { DocLocale } from "@/lib/docs/constants";

interface SidebarArticle {
  slug: string;
  title: string;
  category: string;
  order: number;
  path: string;
}

interface DocsShellProps {
  locale: DocLocale;
  articles: SidebarArticle[];
  searchRecords: SearchRecord[];
  children: ReactNode;
  showSidebar?: boolean;
  rightRail?: ReactNode;
}

export default function DocsShell({
  locale,
  articles,
  searchRecords,
  children,
  showSidebar = true,
  rightRail,
}: DocsShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const isMac =
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    const onKey = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {showSidebar && (
          <DocsSidebar
            locale={locale}
            articles={articles}
            onSearchClick={() => setSearchOpen(true)}
          />
        )}
        <main className="flex-1 min-w-0">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">{children}</div>
            {rightRail}
          </div>
        </main>
      </div>

      <SearchOverlay
        locale={locale}
        records={searchRecords}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
