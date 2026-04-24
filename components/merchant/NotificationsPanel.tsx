"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  NotificationItem,
  type MerchantNotification,
} from "./NotificationItem";

interface NotificationsPanelProps {
  locale: string;
  isRTL: boolean;
}

type FilterTab = "all" | "unread" | "mentions";

// Local-only sample data for now. When /api/notifications is ready,
// swap the useEffect to fetch from that endpoint — shape matches
// MerchantNotification already.
const SAMPLE: MerchantNotification[] = [
  {
    id: "n1",
    type: "deal",
    title: "Ahmed moved to Negotiation",
    body: "Deal \"Levana Q2 Refill\" entered the Negotiation stage.",
    href: "",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
    mention: false,
  },
  {
    id: "n2",
    type: "task",
    title: "Task overdue: Follow up with Noor",
    body: "Assigned to you, was due yesterday.",
    href: "",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    read: false,
    mention: false,
  },
  {
    id: "n3",
    type: "message",
    title: "@you in WhatsApp thread with Reem",
    body: "\"Please confirm the price for the 50ml bottle before Friday.\"",
    href: "",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    mention: true,
  },
  {
    id: "n4",
    type: "system",
    title: "Plan renewed",
    body: "Your Business plan renewed successfully.",
    href: "",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
    mention: false,
  },
];

function formatAgo(
  iso: string,
  t: (key: string, values?: Record<string, number | string>) => string
) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMin = Math.max(0, Math.round((now - then) / 60000));
  if (diffMin < 1) return t("justNow");
  if (diffMin < 60) return t("minuteAgo", { n: diffMin });
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return t("hourAgo", { n: diffHr });
  const diffDay = Math.round(diffHr / 24);
  return t("dayAgo", { n: diffDay });
}

export function NotificationsPanel({ locale, isRTL }: NotificationsPanelProps) {
  const t = useTranslations("MerchantNotifications");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const [items, setItems] = useState<MerchantNotification[]>(SAMPLE);
  const ref = useRef<HTMLDivElement | null>(null);

  // Give sample items proper hrefs that match locale
  useEffect(() => {
    setItems((prev) =>
      prev.map((n) => ({
        ...n,
        href:
          n.id === "n1"
            ? `/${locale}/merchant/deals`
            : n.id === "n2"
              ? `/${locale}/merchant/tasks`
              : n.id === "n3"
                ? `/${locale}/merchant/conversations`
                : `/${locale}/merchant/settings`,
      }))
    );
  }, [locale]);

  // Close on outside click
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

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const filtered = useMemo(() => {
    if (tab === "unread") return items.filter((n) => !n.read);
    if (tab === "mentions") return items.filter((n) => n.mention);
    return items;
  }, [items, tab]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const showEmptyCaughtUp = tab === "unread" && filtered.length === 0;
  const showEmptyNone =
    (tab === "all" || tab === "mentions") && filtered.length === 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t("title")}
        aria-label={t("title")}
        className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 ltr:-right-0.5 rtl:-left-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#f97373" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 ${
            isRTL ? "left-0" : "right-0"
          } w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl overflow-hidden z-50`}
          style={{
            boxShadow: "0 10px 40px rgba(8,145,178,0.12)",
            border: "1px solid rgba(224,242,254,0.8)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sky-100">
            <div className="text-[14px] font-bold text-[#0C4A6E]">
              {t("title")}
            </div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                unreadCount === 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-cyan-700 hover:text-cyan-800"
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {t("markAllRead")}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center px-2 border-b border-sky-100">
            {(["all", "unread", "mentions"] as FilterTab[]).map((f) => {
              const active = tab === f;
              const label =
                f === "all"
                  ? t("tabAll")
                  : f === "unread"
                    ? t("tabUnread")
                    : t("tabMentions");
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTab(f)}
                  className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "text-cyan-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-cyan-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="max-h-[440px] overflow-y-auto">
            {showEmptyCaughtUp && (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCheck className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-[#0C4A6E]">
                  {t("emptyCaughtUp")}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("emptyCaughtUpSubtitle")}
                </div>
              </div>
            )}
            {showEmptyNone && (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-sky-50 text-cyan-600 flex items-center justify-center mb-3">
                  <Inbox className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-[#0C4A6E]">
                  {t("emptyNone")}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("emptyNoneSubtitle")}
                </div>
              </div>
            )}
            {filtered.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onDelete={dismiss}
                timeLabel={formatAgo(n.createdAt, t as (k: string, v?: Record<string, number | string>) => string)}
                dismissLabel={t("dismiss")}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-sky-100 px-4 py-2.5 text-center">
            <Link
              href={`/${locale}/merchant/notifications`}
              onClick={() => setOpen(false)}
              className="inline-block text-xs font-semibold text-cyan-700 hover:text-cyan-800"
            >
              {t("viewAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
