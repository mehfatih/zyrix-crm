"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MessageCircle,
  Send,
  Loader2,
  Search,
  Phone,
  User,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  Bot,
  RefreshCw,
  Building2,
  Clock,
} from "lucide-react";
import {
  fetchInbox,
  fetchThread,
  sendWhatsappMessage,
  suggestAIReply,
  type InboxConversation,
  type WhatsappMessage,
  type WhatsappThread,
} from "@/lib/api/whatsapp";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// WHATSAPP CRM PAGE
// ============================================================================

const POLL_INTERVAL_MS = 6000;

export default function WhatsappPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const cfoLocale: "ar" | "en" | "tr" = (["ar", "en", "tr"].includes(locale)
    ? locale
    : "en") as "ar" | "en" | "tr";
  const t = useTranslations("Whatsapp");

  const [inbox, setInbox] = useState<InboxConversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [thread, setThread] = useState<WhatsappThread | null>(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Load inbox
  const loadInbox = async () => {
    try {
      const data = await fetchInbox();
      setInbox(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    loadInbox();
    const id = setInterval(loadInbox, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Load thread when selected phone changes
  useEffect(() => {
    if (!selectedPhone) {
      setThread(null);
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    let cancelled = false;
    setLoadingThread(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchThread(selectedPhone);
        if (!cancelled) setThread(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoadingThread(false);
      }
    })();

    // Poll thread every 6s
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (cancelled) return;
      try {
        const data = await fetchThread(selectedPhone);
        if (!cancelled) setThread(data);
      } catch {
        /* ignore */
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedPhone]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhone || !draft.trim() || sending) return;
    const text = draft.trim();
    setSending(true);
    setError(null);
    try {
      const res = await sendWhatsappMessage(selectedPhone, text);
      if (!res.success) {
        setAlert(res.error || t("alerts.sendWarning"));
      } else {
        setAlert(null);
      }
      setDraft("");
      // Reload thread + inbox
      const [fresh, freshInbox] = await Promise.all([
        fetchThread(selectedPhone),
        fetchInbox(),
      ]);
      setThread(fresh);
      setInbox(freshInbox);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSending(false);
    }
  };

  const handleSuggest = async () => {
    if (!thread || thread.messages.length === 0 || suggesting) return;
    // Use last incoming message as basis
    const lastIncoming = [...thread.messages]
      .reverse()
      .find((m) => m.direction === "incoming");
    if (!lastIncoming) {
      setAlert(t("alerts.noIncomingForSuggest"));
      return;
    }
    setSuggesting(true);
    try {
      const suggestion = await suggestAIReply(
        lastIncoming.messageText,
        thread.customer?.fullName,
        cfoLocale
      );
      setDraft(suggestion);
    } catch (e) {
      setAlert(e instanceof Error ? e.message : "AI failed");
    } finally {
      setSuggesting(false);
    }
  };

  const filtered = search
    ? inbox.filter(
        (c) =>
          c.phoneNumber.includes(search) ||
          c.customer?.fullName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          c.customer?.companyName
            ?.toLowerCase()
            .includes(search.toLowerCase())
      )
    : inbox;

  return (
    <DashboardShell locale={locale}>
      <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-sky-50/30">
        {/* Sidebar — inbox */}
        <aside className="w-full md:w-96 bg-white border-b md:border-b-0 ltr:md:border-r rtl:md:border-l border-sky-100 flex flex-col max-h-[45vh] md:max-h-none">
          <div className="p-4 border-b border-sky-100 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-sky-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                {t("title")}
              </h1>
              <p className="text-xs text-slate-500">{t("subtitle")}</p>
            </div>
            <button
              onClick={loadInbox}
              className="p-1.5 text-sky-500 hover:bg-sky-50 rounded-lg"
              title={t("refresh")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-sky-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 text-sm border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Inbox list */}
          <div className="flex-1 overflow-y-auto">
            {loadingInbox ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Sparkles className="w-10 h-10 mx-auto text-sky-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  {search ? t("noResults") : t("empty.title")}
                </p>
                {!search && (
                  <p className="text-xs text-slate-500 mt-2">
                    {t("empty.subtitle")}
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-sky-50">
                {filtered.map((conv, idx) => {
                  const selected = selectedPhone === conv.phoneNumber;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhone(conv.phoneNumber)}
                      className={`w-full text-left rtl:text-right px-4 py-3 flex items-center gap-3 transition-colors ${
                        selected ? "bg-emerald-50" : "hover:bg-sky-50/50"
                      }`}
                    >
                      <WhatsappAvatar
                        name={conv.customer?.fullName || conv.phoneNumber}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium text-sky-900 truncate text-sm">
                            {conv.customer?.fullName || conv.phoneNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {formatTimeShort(conv.lastTimestamp, locale)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {conv.lastDirection === "outgoing" && (
                            <CheckCircle2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="text-xs text-slate-600 truncate flex-1">
                            {conv.lastMessage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {conv.customer ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                              <UserPlus className="w-2.5 h-2.5" />
                              {conv.customer.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                              <Phone className="w-2.5 h-2.5" />
                              {conv.phoneNumber}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            · {conv.messageCount} {t("msgs")}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Conversation pane */}
        <div className="flex-1 flex flex-col min-h-0">
          {!selectedPhone ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-400 mb-4 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-lg font-bold text-sky-900">
                  {t("pickConversation")}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {t("pickConversationHint")}
                </p>
              </div>
            </div>
          ) : loadingThread && !thread ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : thread ? (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-sky-100 bg-white flex items-center gap-3 flex-wrap">
                <WhatsappAvatar
                  name={thread.customer?.fullName || thread.phoneNumber}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sky-900">
                    {thread.customer?.fullName || thread.phoneNumber}
                  </div>
                  <div className="text-xs text-slate-500 truncate flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {thread.phoneNumber}
                    </span>
                    {thread.customer?.companyName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {thread.customer.companyName}
                      </span>
                    )}
                    {thread.customer?.status && (
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 rounded text-[10px]">
                        {thread.customer.status}
                      </span>
                    )}
                  </div>
                </div>
                {!thread.customer && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-200 rounded text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {t("notACustomer")}
                  </span>
                )}
              </div>

              {/* Alerts */}
              {alert && (
                <div className="mx-4 mt-3 bg-amber-50 text-amber-700 text-xs p-2 rounded border border-amber-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {alert}
                  <button
                    onClick={() => setAlert(null)}
                    className="ltr:ml-auto rtl:mr-auto text-amber-600 hover:text-amber-900"
                  >
                    ×
                  </button>
                </div>
              )}
              {error && (
                <div className="mx-4 mt-3 bg-red-50 text-red-700 text-xs p-2 rounded border border-red-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-gradient-to-b from-emerald-50/20 to-white"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)",
                }}
              >
                {thread.messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <Sparkles className="w-8 h-8 mx-auto text-sky-300 mb-2" />
                    <p className="text-sm">{t("emptyThread")}</p>
                  </div>
                ) : (
                  thread.messages.map((m, idx) => (
                    <WhatsappBubble key={idx} message={m} locale={locale} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-sky-100 bg-white flex items-end gap-2"
              >
                <button
                  type="button"
                  onClick={handleSuggest}
                  disabled={suggesting || thread.messages.length === 0}
                  title={t("aiSuggest")}
                  className="flex-shrink-0 p-2 bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-lg disabled:opacity-50"
                >
                  {suggesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={t("messagePlaceholder")}
                  rows={1}
                  disabled={sending}
                  className="flex-1 px-3 py-2 text-sm border border-sky-200 rounded-lg resize-none min-h-[40px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex-shrink-0"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t("send")}
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// WhatsApp message bubble
// ============================================================================
function WhatsappBubble({
  message,
  locale,
}: {
  message: WhatsappMessage;
  locale: string;
}) {
  const fromMe = message.direction === "outgoing";
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
          fromMe
            ? "bg-emerald-500 text-white rounded-br-sm"
            : "bg-white border border-sky-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.messageText}
        </div>
        {message.aiExtracted && fromMe === false && (
          <AIInsightChip extracted={message.aiExtracted} />
        )}
        <div
          className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${
            fromMe ? "text-emerald-100" : "text-slate-400"
          }`}
        >
          <Clock className="w-2.5 h-2.5" />
          {formatTimeShort(message.timestamp, locale)}
          {fromMe && message.messageId && (
            <CheckCircle2 className="w-2.5 h-2.5" />
          )}
        </div>
      </div>
    </div>
  );
}

function AIInsightChip({ extracted }: { extracted: any }) {
  if (!extracted || typeof extracted !== "object") return null;
  const parts: string[] = [];
  if (extracted.intent) parts.push(extracted.intent);
  if (extracted.urgency) parts.push(`${extracted.urgency} urgency`);
  if (extracted.sentiment) parts.push(extracted.sentiment);
  if (parts.length === 0) return null;
  return (
    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
      <Bot className="w-2.5 h-2.5 text-sky-400" />
      {parts.map((p, i) => (
        <span
          key={i}
          className="text-[9px] px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded"
        >
          {p}
        </span>
      ))}
    </div>
  );
}

function WhatsappAvatar({ name }: { name: string }) {
  const initials = name
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 text-white font-bold flex items-center justify-center flex-shrink-0">
      {initials || <User className="w-5 h-5" />}
    </div>
  );
}

function formatTimeShort(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) {
      return d.toLocaleTimeString(loc, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString(loc, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
