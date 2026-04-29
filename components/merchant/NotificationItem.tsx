"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckSquare,
  MessageSquare,
  Settings,
  AlertCircle,
  X,
  type LucideIcon,
} from "lucide-react";

export type NotificationType = "deal" | "task" | "message" | "system";

export interface MerchantNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
  createdAt: string; // ISO
  read: boolean;
  mention?: boolean;
}

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  deal: Briefcase,
  task: CheckSquare,
  message: MessageSquare,
  system: Settings,
};

const TYPE_COLOR: Record<NotificationType, { bg: string; text: string }> = {
  deal: { bg: "#ecfeff", text: "#0284C7" },
  task: { bg: "#ecfdf5", text: "#047857" },
  message: { bg: "#fff1f2", text: "#be123c" },
  system: { bg: "#f5f3ff", text: "#6d28d9" },
};

interface NotificationItemProps {
  notification: MerchantNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  timeLabel: string;
  dismissLabel: string;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  timeLabel,
  dismissLabel,
}: NotificationItemProps) {
  const Icon = TYPE_ICON[notification.type] || AlertCircle;
  const color = TYPE_COLOR[notification.type];

  const content = (
    <div
      className={`relative group flex items-start gap-3 px-4 py-3 transition-colors border-l-4 ${
        notification.read
          ? "bg-muted border-transparent"
          : "bg-card border-l-[#f97373]"
      } hover:bg-muted/40`}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm ${
            notification.read
              ? "text-muted-foreground"
              : "text-[#0C4A6E] font-semibold"
          } truncate`}
        >
          {notification.title}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.body}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">{timeLabel}</div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(notification.id);
        }}
        title={dismissLabel}
        aria-label={dismissLabel}
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 ltr:right-2 rtl:left-2 w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  if (notification.href) {
    return (
      <Link
        href={notification.href}
        onClick={() => {
          if (!notification.read) onMarkRead(notification.id);
        }}
        className="block"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.read) onMarkRead(notification.id);
      }}
      className="w-full text-left block"
    >
      {content}
    </button>
  );
}
