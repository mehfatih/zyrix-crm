"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MessageSquare,
  Send,
  Loader2,
  Search,
  User,
  Plus,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  fetchThreads,
  fetchTeam,
  fetchConversation,
  sendChatMessage,
  type ChatThread,
  type ChatUser,
  type ChatMessage,
} from "@/lib/api/chat";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// INTERNAL CHAT PAGE
// ============================================================================

const POLL_INTERVAL_MS = 5000;

export default function ChatPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Chat");

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [team, setTeam] = useState<ChatUser[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null
  );
  const [partner, setPartner] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConv, setLoadingConv] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserId = useRef<string | null>(null);

  // Get current user ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("zyrix_user");
      if (u) {
        try {
          currentUserId.current = JSON.parse(u).id;
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  // Initial load
  const loadThreads = async () => {
    try {
      const [th, tm] = await Promise.all([fetchThreads(), fetchTeam()]);
      setThreads(th);
      setTeam(tm);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  // Poll threads every 5s (for badge + last-message updates)
  useEffect(() => {
    const id = setInterval(() => {
      fetchThreads().then(setThreads).catch(() => {});
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Load conversation when partner changes
  useEffect(() => {
    if (!selectedPartnerId) {
      setPartner(null);
      setMessages([]);
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    let cancelled = false;
    setLoadingConv(true);
    (async () => {
      try {
        const conv = await fetchConversation(selectedPartnerId);
        if (cancelled) return;
        setPartner(conv.partner);
        setMessages(conv.messages);
        setLoadingConv(false);
        // Refresh threads so unread badges clear
        fetchThreads().then(setThreads).catch(() => {});
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed");
          setLoadingConv(false);
        }
      }
    })();

    // Start polling for new messages
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (cancelled) return;
      try {
        const latest = messages[messages.length - 1];
        const since = latest ? latest.createdAt : undefined;
        const conv = await fetchConversation(selectedPartnerId, since);
        if (!cancelled && conv.messages.length > 0) {
          setMessages((prev) => {
            const existing = new Set(prev.map((m) => m.id));
            const newOnes = conv.messages.filter((m) => !existing.has(m.id));
            if (newOnes.length === 0) return prev;
            return [...prev, ...newOnes];
          });
        }
      } catch {
        /* network error — try next poll */
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPartnerId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerId || !draft.trim() || sending) return;
    const content = draft.trim();
    setSending(true);
    try {
      const sent = await sendChatMessage(selectedPartnerId, content);
      setMessages((prev) => [...prev, sent]);
      setDraft("");
      // Refresh threads (last message update)
      fetchThreads().then(setThreads).catch(() => {});
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setSending(false);
    }
  };

  const startChat = (u: ChatUser) => {
    setSelectedPartnerId(u.id);
    setShowTeam(false);
    setSearchTerm("");
    // Add optimistic thread if not exists
    setThreads((prev) => {
      if (prev.some((th) => th.partnerId === u.id)) return prev;
      return [
        {
          partnerId: u.id,
          user: u,
          lastMessage: "",
          lastMessageAt: new Date().toISOString(),
          lastFromMe: false,
          unread: 0,
        },
        ...prev,
      ];
    });
  };

  const filteredTeam = searchTerm
    ? team.filter(
        (u) =>
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : team;

  return (
    <DashboardShell locale={locale}>
      <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-muted/30">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-card border-b md:border-b-0 ltr:md:border-r rtl:md:border-l border-border flex flex-col max-h-[40vh] md:max-h-none">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                {t("title")}
              </h2>
              <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
            </div>
            <button
              onClick={() => setShowTeam(!showTeam)}
              title={t("newChat")}
              className="p-1.5 text-cyan-300 hover:bg-muted rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showTeam && (
            <div className="p-3 border-b border-border bg-muted/40">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute top-1/2 -translate-y-1/2 ltr:left-2.5 rtl:right-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("searchTeam")}
                  className="w-full ltr:pl-8 rtl:pr-8 ltr:pr-2 rtl:pl-2 py-1.5 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredTeam.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    {t("noTeamMembers")}
                  </div>
                ) : (
                  filteredTeam.map((u, idx) => (
                    <button
                      key={idx}
                      onClick={() => startChat(u)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-card rounded text-sm text-left rtl:text-right"
                    >
                      <Avatar name={u.fullName} small />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate text-xs">
                          {u.fullName}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {u.role}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Sparkles className="w-8 h-8 mx-auto text-sky-300 mb-2" />
                <p className="text-xs font-medium text-muted-foreground">
                  {t("noThreads")}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {t("noThreadsHint")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-sky-50">
                {threads.map((th, idx) => {
                  const selected = selectedPartnerId === th.partnerId;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPartnerId(th.partnerId)}
                      className={`w-full text-left rtl:text-right px-3 py-3 flex items-center gap-3 transition-colors ${
                        selected
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Avatar name={th.user.fullName} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium text-foreground truncate text-sm">
                            {th.user.fullName}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {formatTimeShort(th.lastMessageAt, locale)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-muted-foreground truncate flex-1">
                            {th.lastFromMe && (
                              <span className="text-muted-foreground">
                                {t("you")}:{" "}
                              </span>
                            )}
                            {th.lastMessage || t("noMessagesYet")}
                          </span>
                          {th.unread > 0 && (
                            <span className="flex-shrink-0 bg-sky-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                              {th.unread > 99 ? "99+" : th.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Conversation Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          {error && !selectedPartnerId && (
            <div className="p-4 bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!selectedPartnerId ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-sky-300 mb-3" />
                <h3 className="text-lg font-bold text-foreground">
                  {t("selectChat")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("selectChatHint")}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              {partner && (
                <div className="px-5 py-3 border-b border-border bg-card flex items-center gap-3">
                  <Avatar name={partner.fullName} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground">
                      {partner.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {partner.email} · {partner.role}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-gradient-to-b from-sky-50/20 to-white">
                {loadingConv ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Sparkles className="w-8 h-8 mx-auto text-sky-300 mb-2" />
                    <p className="text-sm">{t("emptyConversation")}</p>
                    <p className="text-xs mt-1">{t("emptyConversationHint")}</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const fromMe = m.fromUserId === currentUserId.current;
                    return (
                      <MessageBubble
                        key={idx}
                        message={m}
                        fromMe={fromMe}
                        locale={locale}
                      />
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-border bg-card flex items-end gap-2"
              >
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
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg resize-none min-h-[40px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 flex-shrink-0"
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
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Message bubble
// ============================================================================
function MessageBubble({
  message,
  fromMe,
  locale,
}: {
  message: ChatMessage;
  fromMe: boolean;
  locale: string;
}) {
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          fromMe
            ? "bg-sky-500 text-white rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div
          className={`text-[10px] mt-1 ${
            fromMe ? "text-sky-100" : "text-muted-foreground"
          }`}
        >
          {formatTimeShort(message.createdAt, locale)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Avatar
// ============================================================================
function Avatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const sz = small ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-sky-400 to-sky-500 text-white font-bold flex items-center justify-center flex-shrink-0`}
    >
      {initials || <User className="w-4 h-4" />}
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
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
