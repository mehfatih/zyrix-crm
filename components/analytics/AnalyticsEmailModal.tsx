"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { AnalyticsTab } from "@/lib/analytics/tab-catalog";
import { TAB_DOT, TAB_EYEBROW } from "./colors";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
  onClose: () => void;
}

export function AnalyticsEmailModal({ tab, locale, onClose }: Props) {
  const t = useTranslations("Analytics");
  const today = useMemo(
    () => new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : locale === "ar" ? "ar-EG" : "en-US"),
    [locale],
  );

  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Pre-fill on mount or when tab/locale changes.
  useEffect(() => {
    setSubject(`${t("email.subjectPrefix")} ${tab.name[locale]} — ${today}`);
    setMessage(t("email.messageTemplate", { tab: tab.name[locale], date: today }));
  }, [tab.id, tab.name, locale, today, t]);

  // Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const recipientList = recipients
    .split(/[,\s;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const handleSend = () => {
    const count = recipientList.length;
    if (count === 0) {
      toast.error(t("email.noRecipientsError"));
      return;
    }
    toast.success(t("email.queuedToast", { count }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/40 text-violet-200 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className={`${TAB_EYEBROW[tab.color]} text-[11px] font-bold uppercase tracking-widest mb-0.5`}>
                {t("email.modalEyebrow")}
              </p>
              <h3 className="text-foreground text-lg font-bold">
                {t("email.modalTitle")}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {t("email.recipients")}
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
            />
            {recipientList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recipientList.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-200 text-xs"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {t("email.subject")}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {t("email.message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40 resize-y"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("email.preview")}
            </p>
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${TAB_DOT[tab.color]}`} />
                <h4 className="font-bold text-sm text-foreground">{tab.name[locale]}</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tab.widgets.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-md border border-border p-2"
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {w.label[locale]}
                    </p>
                    <p className="text-sm font-bold text-foreground">{w.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("email.previewFooter", { count: tab.widgets.length, date: today })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
          >
            {t("email.cancel")}
          </button>
          <button
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 border border-violet-500/50 text-violet-200 rounded-lg text-xs font-semibold hover:bg-violet-500/30"
          >
            <Send className="w-3.5 h-3.5" />
            {t("email.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
