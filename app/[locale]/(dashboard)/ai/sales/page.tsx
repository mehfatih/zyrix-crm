"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  Zap,
  Bot,
  User as UserIcon,
  Code2,
  Trash2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listAiThreads,
  getAiThread,
  createAiThread,
  sendAiMessage,
  archiveAiThread,
  type AiThread,
  type AiMessage,
  type AiThreadWithMessages,
} from "@/lib/api/advanced";

// ============================================================================
// SALES ASSISTANT CHAT
// ----------------------------------------------------------------------------
// Two-pane layout on desktop: thread list on the side, chat on the right.
// Mobile collapses to a drawer. Messages show user bubbles + assistant
// bubbles + tool-call pills (muted) for transparency about what the
// agent is doing under the hood.
// ============================================================================

export default function SalesAssistantPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [threads, setThreads] = useState<AiThread[]>([]);
  const [activeThread, setActiveThread] =
    useState<AiThreadWithMessages | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const data = await listAiThreads("sales");
      setThreads(data);
      if (!activeThread && data.length > 0) {
        await loadThread(data[0].id);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load threads");
    } finally {
      setLoadingThreads(false);
    }
  };

  const loadThread = async (id: string) => {
    setLoadingThread(true);
    try {
      const data = await getAiThread(id);
      setActiveThread(data);
      setSidebarOpen(false);
    } finally {
      setLoadingThread(false);
    }
  };

  const startNewThread = async () => {
    try {
      const thread = await createAiThread({ agentKind: "sales" });
      await loadThreads();
      await loadThread(thread.id);
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    let threadId = activeThread?.id;

    // If no active thread, create one on the fly
    if (!threadId) {
      try {
        const thread = await createAiThread({ agentKind: "sales" });
        threadId = thread.id;
        setActiveThread({
          ...thread,
          messages: [],
        });
        await loadThreads();
      } catch (e: any) {
        alert(e?.response?.data?.error?.message || e?.message);
        return;
      }
    }

    const userMsg = input.trim();
    setInput("");
    setSending(true);

    // Optimistically append user message
    setActiveThread((curr) =>
      curr
        ? {
            ...curr,
            messages: [
              ...curr.messages,
              {
                id: `tmp-${Date.now()}`,
                role: "user",
                content: userMsg,
                toolCall: null,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : null
    );

    try {
      await sendAiMessage(threadId!, userMsg);
      // Reload full thread to get tool-call messages + final reply in order
      const refreshed = await getAiThread(threadId!);
      setActiveThread(refreshed);
      await loadThreads(); // bump updatedAt in sidebar
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm(tr("Archive this thread?", "أرشفة هذا الحوار؟", "Bu sohbeti arşivle?"))) return;
    try {
      await archiveAiThread(id);
      if (activeThread?.id === id) setActiveThread(null);
      await loadThreads();
    } catch (e: any) {
      alert(e?.message);
    }
  };

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.messages.length, sending]);

  return (
    <DashboardShell locale={locale}>
      <div
        className="flex h-[calc(100vh-4rem)] overflow-hidden"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Sidebar — thread list */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full"
          } md:translate-x-0 fixed md:static top-0 bottom-0 ${isRtl ? "right-0" : "left-0"} z-40 w-72 bg-white border-e border-sky-100 flex-shrink-0 flex flex-col transition-transform md:transition-none`}
        >
          <div className="p-3 border-b border-sky-100 flex items-center gap-2">
            <Link
              href={`/${locale}/ai`}
              className="w-8 h-8 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
            >
              <ArrowLeft
                className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-sky-900 truncate flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                {tr("Sales Assistant", "مساعد المبيعات", "Satış Asistanı")}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={startNewThread}
            className="mx-3 mt-3 mb-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            {tr("New chat", "محادثة جديدة", "Yeni sohbet")}
          </button>

          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {loadingThreads ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              </div>
            ) : threads.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8 px-4">
                {tr(
                  "No conversations yet — start your first chat.",
                  "لا محادثات بعد — ابدأ أول محادثة.",
                  "Henüz sohbet yok — ilk sohbetinizi başlatın."
                )}
              </p>
            ) : (
              <div className="space-y-0.5">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    className={`group relative rounded-lg ${
                      activeThread?.id === t.id
                        ? "bg-sky-50 text-sky-900"
                        : "text-slate-700 hover:bg-sky-50/50"
                    }`}
                  >
                    <button
                      onClick={() => loadThread(t.id)}
                      className="w-full text-left rtl:text-right px-2 py-2 text-xs"
                    >
                      <div className="font-medium truncate pr-6 rtl:pr-0 rtl:pl-6">
                        {t.title || tr("(untitled)", "(بدون عنوان)", "(başlıksız)")}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                        {new Date(t.updatedAt).toLocaleDateString(
                          locale === "ar"
                            ? "ar-SA"
                            : locale === "tr"
                              ? "tr-TR"
                              : "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => handleArchive(t.id)}
                      className="absolute top-1/2 -translate-y-1/2 end-1 opacity-0 group-hover:opacity-100 w-6 h-6 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-opacity"
                      title={tr("Archive", "أرشفة", "Arşivle")}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-slate-900/50"
          />
        )}

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden p-3 border-b border-sky-100 flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0 text-sm font-bold text-sky-900 truncate">
              {activeThread?.title || tr("New chat", "محادثة جديدة", "Yeni sohbet")}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            {loadingThread ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : !activeThread || activeThread.messages.length === 0 ? (
              <EmptyState locale={locale} tr={tr} onPick={(s) => setInput(s)} />
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                {activeThread.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    locale={locale}
                    tr={tr}
                  />
                ))}
                {sending && <ThinkingBubble tr={tr} />}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-sky-100 bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 rounded-xl border border-sky-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200 bg-white overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={tr(
                    "Ask about your deals, customers, or what to do today…",
                    "اسأل عن الصفقات، العملاء، أو ماذا تفعل اليوم…",
                    "Anlaşmalarınız, müşterileriniz veya bugün ne yapmanız gerektiği hakkında sorun…"
                  )}
                  rows={1}
                  className="flex-1 px-3 py-2.5 text-sm resize-none focus:outline-none max-h-32 bg-transparent"
                  style={{
                    minHeight: "42px",
                    height: Math.min(input.split("\n").length * 20 + 22, 128),
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="m-1 w-9 h-9 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send
                      className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                    />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                {tr(
                  "AI can make mistakes — always verify important details.",
                  "الذكاء الاصطناعي ممكن يغلط — دائمًا تحقق من التفاصيل المهمة.",
                  "AI hata yapabilir — önemli ayrıntıları her zaman doğrulayın."
                )}
              </p>
            </div>
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function EmptyState({
  locale,
  tr,
  onPick,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onPick: (prompt: string) => void;
}) {
  const suggestions = [
    tr(
      "What deals should I follow up on today?",
      "أي صفقات لازم أتابعها اليوم؟",
      "Bugün hangi anlaşmaları takip etmeliyim?"
    ),
    tr(
      "Show me all deals in negotiation stage",
      "اعرضلي كل الصفقات في مرحلة التفاوض",
      "Müzakere aşamasındaki tüm anlaşmaları göster"
    ),
    tr(
      "Which customers haven't been contacted in 2 weeks?",
      "مين العملاء اللي مكلمناهمش من أسبوعين؟",
      "2 haftadır iletişime geçilmeyen müşteriler kimler?"
    ),
    tr(
      "Summarize my pipeline",
      "لخصلي المسار",
      "Pipeline'ımı özetle"
    ),
    tr(
      "What's the biggest stale deal?",
      "إيه أكبر صفقة راكدة؟",
      "En büyük durgun anlaşma hangisi?"
    ),
    tr(
      "How did we perform this week?",
      "إزاي كان أداءنا هذا الأسبوع؟",
      "Bu hafta nasıl performans gösterdik?"
    ),
  ];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-sky-900 mt-4">
          {tr(
            "Sales Assistant",
            "مساعد المبيعات",
            "Satış Asistanı"
          )}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {tr(
            "Ask anything about your pipeline, customers, or tasks.",
            "اسأل أي حاجة عن المسار، العملاء، أو المهام.",
            "Pipeline'ınız, müşterileriniz veya görevleriniz hakkında her şeyi sorun."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="text-left rtl:text-right p-3 rounded-xl border border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/40 text-sm text-slate-700 transition-colors flex items-start gap-2"
          >
            <Zap className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
            <span>{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  locale,
  tr,
}: {
  message: AiMessage;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  // Tool calls — rendered as muted pills mid-conversation
  if (message.role === "assistant" && message.toolCall) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 pl-11 rtl:pl-0 rtl:pr-11">
        <Code2 className="w-3.5 h-3.5" />
        <span>
          {tr("Calling", "يستدعي", "Çağırıyor")}{" "}
          <code className="font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
            {message.toolCall.name ?? "tool"}
          </code>
        </span>
      </div>
    );
  }
  if (message.role === "tool") {
    const result = message.toolCall?.result;
    const summary = summarizeToolResult(result);
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 pl-11 rtl:pl-0 rtl:pr-11">
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="line-clamp-1">{summary}</span>
      </div>
    );
  }

  // Real messages
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-slate-200 text-slate-600"
            : "bg-gradient-to-br from-sky-400 to-sky-600 text-white"
        }`}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`rounded-xl px-3.5 py-2.5 text-sm ${
            isUser
              ? "bg-sky-500 text-white"
              : "bg-white border border-sky-100 text-slate-800"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingBubble({
  tr,
}: {
  tr: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
        <Bot className="w-4 h-4" />
      </div>
      <div className="rounded-xl px-3.5 py-2.5 bg-white border border-sky-100 text-sm text-slate-500 inline-flex items-center gap-1.5">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {tr("Thinking…", "يفكر…", "Düşünüyor…")}
      </div>
    </div>
  );
}

function summarizeToolResult(result: unknown): string {
  if (!result || typeof result !== "object") return "Tool result";
  const r = result as any;
  if (r.error) return `Error: ${r.error}`;
  if (typeof r.count === "number") {
    return `Found ${r.count} result${r.count === 1 ? "" : "s"}`;
  }
  if (Array.isArray(r.deals)) return `Found ${r.deals.length} deals`;
  if (Array.isArray(r.customers)) return `Found ${r.customers.length} customers`;
  if (Array.isArray(r.tasks)) return `Found ${r.tasks.length} tasks`;
  if (r.stages) return "Pipeline summary retrieved";
  return "Tool result";
}
