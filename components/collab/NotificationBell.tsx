"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  Trash2,
  User as UserIcon,
  AtSign,
  MessageSquare,
  Briefcase,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import {
  listNotifications,
  getNotificationUnreadCount,
  markNotificationsRead,
  deleteNotification,
  type Notification,
} from "@/lib/api/advanced";

// ============================================================================
// NOTIFICATION BELL
// ----------------------------------------------------------------------------
// Header dropdown. Polls unread count every 30s so the badge stays
// fresh without SSE. Opens a tray on click showing the most recent 20
// notifications; clicking one marks it read and navigates to its link.
// ============================================================================

const POLL_MS = 30_000;

export function NotificationBell() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const n = await getNotificationUnreadCount();
      setUnreadCount(n);
    } catch {
      /* silent */
    }
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const page = await listNotifications({ limit: 20 });
      setItems(page.items);
      setUnreadCount(page.unreadCount);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, POLL_MS);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  // When opened, fetch full list
  useEffect(() => {
    if (open) loadItems();
  }, [open, loadItems]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleItemClick = async (n: Notification) => {
    if (!n.readAt) {
      try {
        await markNotificationsRead([n.id]);
        setUnreadCount((c) => Math.max(0, c - 1));
        setItems((prev) =>
          prev.map((p) =>
            p.id === n.id ? { ...p, readAt: new Date().toISOString() } : p
          )
        );
      } catch {
        /* silent */
      }
    }
    setOpen(false);
    if (n.link) router.push(`/${locale}${n.link}`);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markNotificationsRead();
      setUnreadCount(0);
      setItems((prev) =>
        prev.map((p) =>
          p.readAt ? p : { ...p, readAt: new Date().toISOString() }
        )
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id: string, wasUnread: boolean) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotification(id);
    } catch {
      // Best-effort; the UI already updated optimistically
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-lg text-muted-foreground hover:text-cyan-300 hover:bg-muted flex items-center justify-center transition-colors"
        aria-label={tr("Notifications", "الإشعارات", "Bildirimler")}
      >
        <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        {unreadCount > 0 && (
          <span className="absolute top-0 end-0 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute top-11 ${
            isRtl ? "left-0" : "right-0"
          } w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-xl overflow-hidden z-50`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 p-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              {tr("Notifications", "الإشعارات", "Bildirimler")}
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded px-1 py-0.5">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-[11px] font-semibold text-cyan-300 hover:text-foreground inline-flex items-center gap-1 disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                {tr("Mark all read", "قراءة الكل", "Tümünü okundu işaretle")}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {tr(
                    "You're all caught up!",
                    "أنت على اطلاع بكل شيء!",
                    "Her şeyi takip ettin!"
                  )}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-sky-50">
                {items.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    locale={locale}
                    tr={tr}
                    onClick={() => handleItemClick(n)}
                    onDelete={() => handleDelete(n.id, !n.readAt)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-sky-50 bg-muted/30">
            <Link
              href={`/${locale}/notifications`}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-cyan-300 hover:text-foreground py-1"
            >
              {tr(
                "View all notifications",
                "عرض كل الإشعارات",
                "Tüm bildirimleri gör"
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ROW
// ============================================================================

function NotificationRow({
  notification,
  locale,
  tr,
  onClick,
  onDelete,
}: {
  notification: Notification;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onClick: () => void;
  onDelete: () => void;
}) {
  const Icon = iconForKind(notification.kind);
  const unread = !notification.readAt;
  return (
    <div
      className={`group flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 relative ${
        unread ? "bg-muted/30" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          unread
            ? "bg-gradient-to-br from-sky-400 to-sky-600 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-foreground line-clamp-2">
          {notification.title}
        </div>
        {notification.body && (
          <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
            {notification.body}
          </div>
        )}
        <div className="text-[10px] text-muted-foreground mt-1 tabular-nums" dir="ltr">
          {relativeTime(notification.createdAt, locale)}
        </div>
      </div>
      {unread && (
        <span className="absolute top-3 end-2 w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 absolute bottom-2 end-2 w-5 h-5 rounded text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center transition-opacity"
        title={tr("Delete", "حذف", "Sil")}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function iconForKind(kind: string) {
  switch (kind) {
    case "mention":
      return AtSign;
    case "comment_reply":
      return MessageSquare;
    case "deal_assigned":
      return Briefcase;
    case "task_due":
      return CheckSquare;
    default:
      return Sparkles;
  }
}

function relativeTime(
  iso: string,
  locale: "en" | "ar" | "tr"
): string {
  const date = new Date(iso);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(
    locale === "ar" ? "ar" : locale === "tr" ? "tr" : "en",
    { numeric: "auto" }
  );
  if (diffSec < 60) return rtf.format(-diffSec, "second");
  if (diffSec < 3600) return rtf.format(-Math.floor(diffSec / 60), "minute");
  if (diffSec < 86400) return rtf.format(-Math.floor(diffSec / 3600), "hour");
  if (diffSec < 604800) return rtf.format(-Math.floor(diffSec / 86400), "day");
  return date.toLocaleDateString(
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
    { month: "short", day: "numeric" }
  );
}
