"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface UserCardProps {
  locale: string;
  collapsed: boolean;
  fullName: string;
  email: string;
  avatarUrl?: string;
  online?: boolean;
  companyName: string;
  plan: "free" | "starter" | "business" | "enterprise" | string;
  planLabels: Record<string, string>;
  t: {
    profile: string;
    settings: string;
    logout: string;
  };
  onLogout: () => void;
}

const PLAN_ACCENTS: Record<string, { bg: string; text: string }> = {
  free: { bg: "#ecfdf5", text: "#059669" },
  starter: { bg: "#e0f2fe", text: "#0369a1" },
  business: { bg: "#fef9c3", text: "#b45309" },
  enterprise: { bg: "#ede9fe", text: "#6d28d9" },
};

export function UserCard({
  locale,
  collapsed,
  fullName,
  email,
  avatarUrl,
  online = true,
  companyName,
  plan,
  planLabels,
  t,
  onLogout,
}: UserCardProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const planKey = (plan || "free").toLowerCase();
  const planAccent = PLAN_ACCENTS[planKey] || PLAN_ACCENTS.free;
  const planLabel = planLabels[planKey] || plan;

  const avatar = (
    <div className="relative w-11 h-11 flex-shrink-0">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-11 h-11 rounded-full object-cover"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-semibold text-sm">
          {getInitials(fullName)}
        </div>
      )}
      {online && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-sky-300 pointer-events-none"
        />
      )}
      {online && (
        <span
          aria-hidden
          className="absolute bottom-0 ltr:right-0 rtl:left-0 w-3 h-3 rounded-full bg-sky-400 ring-2 ring-white"
        />
      )}
    </div>
  );

  if (collapsed) {
    return (
      <div className="flex justify-center py-3" title={fullName}>
        {avatar}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sky-50/60 transition-colors text-left"
      >
        {avatar}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#0C4A6E] leading-tight truncate">
            {fullName}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
          <div className="mt-0.5 text-[12px] text-slate-500 leading-tight flex items-center gap-1.5">
            <span className="truncate">{companyName}</span>
            <span className="text-slate-300">·</span>
            <span
              className="inline-flex items-center px-1.5 h-4 rounded text-[10px] font-semibold"
              style={{ backgroundColor: planAccent.bg, color: planAccent.text }}
            >
              {planLabel}
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="absolute z-20 ltr:left-0 rtl:right-0 top-full mt-1 w-full bg-white border border-sky-100 rounded-xl shadow-lg overflow-hidden">
          <Link
            href={`/${locale}/merchant/settings`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
          >
            <UserCircle className="w-4 h-4 text-slate-500" />
            {t.profile}
          </Link>
          <Link
            href={`/${locale}/merchant/settings`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            {t.settings}
          </Link>
          <div className="border-t border-sky-100" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
          <div className="px-3 py-1.5 text-[11px] text-slate-400 truncate border-t border-sky-100">
            {email}
          </div>
        </div>
      )}
    </div>
  );
}
