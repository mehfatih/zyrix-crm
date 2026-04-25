"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Loader2,
  Trash2,
  AtSign,
  MessageSquare,
  Briefcase,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listNotifications,
  markNotificationsRead,
  deleteNotification,
  type Notification,
} from "@/lib/api/advanced";

// ============================================================================
// NOTIFICATIONS HISTORY PAGE
// ----------------------------------------------------------------------------
// Full-page view of all notifications with filter tabs (All / Unread).
// Paginates with infinite scroll via a Load More button.
// ============================================================================

export default function NotificationsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const router = useRouter();

  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 30;

  const load = useCallback(
    async (reset = true) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const offset = reset ? 0 : items.length;
        const page = await listNotifications({
          onlyUnread: filter === "unread",
          limit: PAGE_SIZE,
          offset,
        });
        if (reset) setItems(page.items);
        else setItems((prev) => [...prev, ...page.items]);
        setUnreadCount(page.unreadCount);
        setHasMore(page.items.length === PAGE_SIZE);
      } catch (e: any) {
        setError(e?.response?.data?.error?.message || e?.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter, items.length]
  );

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
    if (n.link) router.push(`/${locale}${n.link}`);
  };

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead();
      setUnreadCount(0);
      setItems((prev) =>
        prev.map((p) =>
          p.readAt ? p : { ...p, readAt: new Date().toISOString() }
        )
      );
      if (filter === "unread") setItems([]);
    } catch {
      /* silent */
    }
  };

  const handleDelete = async (id: string, wasUnread: boolean) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotification(id);
    } catch {
      /* best-effort */
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-3xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">
                {tr("Notifications", "الإشعارات", "Bildirimler")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {unreadCount > 0
                  ? tr(
                      `${unreadCount} unread`,
                      `${unreadCount} غير مقروءة`,
                      `${unreadCount} okunmadı`
                    )
                  : tr(
                      "You're all caught up",
                      "أنت على اطلاع بكل شيء",
                      "Her şeyi takip ettin"
                    )}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {tr("Mark all read", "قراءة الكل", "Tümünü okundu")}
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "unread"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                filter === k
                  ? "bg-sky-500 text-white"
                  : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
              }`}
            >
              {k === "all"
                ? tr("All", "الكل", "Tümü")
                : tr("Unread", "غير مقروءة", "Okunmamış")}
              {k === "unread" && unreadCount > 0 && (
                <span className="ms-1 opacity-80">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-200 bg-white p-12 text-center">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {filter === "unread"
                ? tr(
                    "No unread notifications.",
                    "لا إشعارات غير مقروءة.",
                    "Okunmamış bildirim yok."
                  )
                : tr(
                    "No notifications yet.",
                    "لا إشعارات بعد.",
                    "Henüz bildirim yok."
                  )}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-sky-100 bg-white overflow-hidden divide-y divide-sky-50">
              {items.map((n) => (
                <NotificationListRow
                  key={n.id}
                  notification={n}
                  locale={locale}
                  tr={tr}
                  onClick={() => handleItemClick(n)}
                  onDelete={() => handleDelete(n.id, !n.readAt)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => load(false)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-semibold"
                >
                  {loadingMore && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {tr("Load more", "تحميل المزيد", "Daha fazla")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}

function NotificationListRow({
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
      className={`group flex items-start gap-3 p-4 cursor-pointer hover:bg-sky-50/40 ${
        unread ? "bg-sky-50/20" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          unread
            ? "bg-gradient-to-br from-sky-400 to-sky-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-sky-900">
          {notification.title}
        </div>
        {notification.body && (
          <div className="text-xs text-slate-600 mt-0.5 line-clamp-2">
            {notification.body}
          </div>
        )}
        <div className="text-[11px] text-slate-400 mt-1 tabular-nums" dir="ltr">
          {new Date(notification.createdAt).toLocaleString(
            locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
            { dateStyle: "short", timeStyle: "short" }
          )}
        </div>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-opacity"
      >
        <Trash2 className="w-3.5 h-3.5" />
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
