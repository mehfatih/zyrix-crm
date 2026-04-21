"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Activity,
  Phone,
  Mail,
  Calendar,
  FileText,
  Briefcase,
  TrendingUp,
  CheckSquare,
  CheckCircle,
  CheckCircle2,
  XCircle,
  FileSignature,
  Send,
  MessageCircle,
  Award,
  Gift,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import {
  fetchCustomerTimeline,
  type TimelineEvent,
} from "@/lib/api/advanced";

// ============================================================================
// ACTIVITY TIMELINE — customer detail tab
// ============================================================================

const ICON_MAP: Record<string, typeof Activity> = {
  activity: Activity,
  phone: Phone,
  mail: Mail,
  calendar: Calendar,
  "file-text": FileText,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  "check-square": CheckSquare,
  "check-circle": CheckCircle,
  "check-circle-2": CheckCircle2,
  "x-circle": XCircle,
  "file-signature": FileSignature,
  send: Send,
  "message-circle": MessageCircle,
  award: Award,
  gift: Gift,
};

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", ring: "ring-cyan-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-200" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-200" },
  slate: { bg: "bg-slate-50", text: "text-slate-600", ring: "ring-slate-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-200" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-200" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-200" },
  green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-200" },
};

interface ActivityTimelineProps {
  customerId: string;
  locale: string;
  maxEvents?: number;
}

export default function ActivityTimeline({
  customerId,
  locale,
  maxEvents = 100,
}: ActivityTimelineProps) {
  const t = useTranslations("Timeline");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCustomerTimeline(customerId, { limit: maxEvents });
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId, maxEvents]);

  const filtered = filter
    ? events.filter((e) => e.type.startsWith(filter) || e.type === filter)
    : events;

  // Get unique types for filter chips
  const types = Array.from(new Set(events.map((e) => e.type)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white border border-sky-100 rounded-xl p-10 text-center">
        <Sparkles className="w-10 h-10 text-sky-300 mx-auto mb-2" />
        <h3 className="text-base font-semibold text-cyan-900 mb-1">
          {t("empty.title")}
        </h3>
        <p className="text-sm text-slate-500">{t("empty.subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      {types.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter(null)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              filter === null
                ? "bg-cyan-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t("filters.all")} ({events.length})
          </button>
          {types.map((type) => {
            const count = events.filter((e) => e.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  filter === type
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t(`types.${type}`, { fallback: type.replace(/_/g, " ") })} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white border border-sky-100 rounded-xl p-6">
        <div className="relative space-y-4">
          {/* Vertical line */}
          <div className="absolute ltr:left-5 rtl:right-5 top-0 bottom-0 w-px bg-slate-200" />

          {filtered.map((ev, idx) => (
            <TimelineEventItem
              key={ev.id}
              event={ev}
              locale={locale}
              customerId={customerId}
              isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function buildDeepLink(
  event: TimelineEvent,
  locale: string,
  customerId: string
): string | null {
  const md = event.metadata || {};
  if (typeof md.dealId === "string") return `/${locale}/deals?highlight=${md.dealId}`;
  if (typeof md.quoteId === "string") return `/${locale}/quotes/${md.quoteId}`;
  if (typeof md.contractId === "string") return `/${locale}/contracts/${md.contractId}`;
  if (typeof md.taskId === "string") return `/${locale}/tasks?highlight=${md.taskId}`;
  // Activity/note/loyalty/whatsapp events stay on the customer detail page
  if (
    event.type.startsWith("activity") ||
    event.type === "whatsapp_message" ||
    event.type === "loyalty_earned"
  ) {
    return `/${locale}/customers/${customerId}`;
  }
  return null;
}

function TimelineEventItem({
  event,
  locale,
  customerId,
  isLast,
}: {
  event: TimelineEvent;
  locale: string;
  customerId: string;
  isLast: boolean;
}) {
  const Icon = ICON_MAP[event.icon] || Activity;
  const colors = COLOR_MAP[event.color] || COLOR_MAP.slate;
  const href = buildDeepLink(event, locale, customerId);

  const card = (
    <div
      className={`flex-1 min-w-0 bg-white border border-sky-50 rounded-lg p-3 shadow-sm ${
        href ? "hover:border-cyan-200 hover:bg-sky-50/40 transition-colors" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <h4 className="text-sm font-semibold text-cyan-900">{event.title}</h4>
        <time className="text-[10px] text-slate-500 flex-shrink-0">
          {formatTimeAgo(event.timestamp, locale)}
        </time>
      </div>
      {event.description && (
        <p className="text-xs text-slate-600 mt-1 line-clamp-3 whitespace-pre-wrap">
          {event.description}
        </p>
      )}
      {event.userName && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
          <User className="w-2.5 h-2.5" />
          {event.userName}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex items-start gap-3">
      <div
        className={`relative z-10 w-10 h-10 rounded-full ${colors.bg} ${colors.text} ring-4 ring-white flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-4 h-4" />
      </div>
      {href ? (
        <Link href={href} className="flex-1 min-w-0 no-underline">
          {card}
        </Link>
      ) : (
        card
      )}
    </div>
  );
}

function formatTimeAgo(iso: string, locale: string): string {
  const loc = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return locale === "ar" ? "الآن" : locale === "tr" ? "şimdi" : "just now";
    if (diffMin < 60)
      return locale === "ar"
        ? `منذ ${diffMin} د`
        : locale === "tr"
          ? `${diffMin}d önce`
          : `${diffMin}m ago`;
    if (diffHr < 24)
      return locale === "ar"
        ? `منذ ${diffHr} س`
        : locale === "tr"
          ? `${diffHr}s önce`
          : `${diffHr}h ago`;
    if (diffDay < 7)
      return locale === "ar"
        ? `منذ ${diffDay} ي`
        : locale === "tr"
          ? `${diffDay}g önce`
          : `${diffDay}d ago`;

    return date.toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
