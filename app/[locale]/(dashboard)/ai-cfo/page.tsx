"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  Loader2,
  Send,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Bell,
  Zap,
  ChevronDown,
  ChevronUp,
  Bot,
} from "lucide-react";
import {
  fetchSnapshot,
  fetchPromptTemplates,
  askAICFO,
  type BusinessSnapshot,
  type AIInsight,
  type PromptTemplate,
  type Locale as CFOLocale,
} from "@/lib/api/ai-cfo";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// AI CFO DASHBOARD
// ============================================================================

interface ConvTurn {
  question: string;
  answer: string;
  generatedAt: string;
}

export default function AICFOPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const cfoLocale: CFOLocale = (["en", "ar", "tr"].includes(locale)
    ? locale
    : "en") as CFOLocale;
  const t = useTranslations("AICFO");

  const [snapshot, setSnapshot] = useState<BusinessSnapshot | null>(null);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<ConvTurn[]>([]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingSnapshot(true);
      try {
        const [snap, tpls] = await Promise.all([
          fetchSnapshot(),
          fetchPromptTemplates(cfoLocale),
        ]);
        setSnapshot(snap);
        setTemplates(tpls);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoadingSnapshot(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ask = async (q: string) => {
    if (!q.trim() || asking) return;
    setAsking(true);
    setError(null);
    try {
      const result = await askAICFO(q, cfoLocale);
      setConversation((prev) => [
        ...prev,
        {
          question: result.question,
          answer: result.answer,
          generatedAt: result.generatedAt,
        },
      ]);
      setQuestion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get insight");
    } finally {
      setAsking(false);
    }
  };

  const handleTemplate = (tpl: PromptTemplate) => {
    ask(tpl.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-sky-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-sky-500" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-50 to-sky-50 border border-sky-200 rounded-full text-xs font-medium text-sky-600">
            <Bot className="w-3.5 h-3.5" />
            {t("poweredBy")}
          </div>
        </div>

        {/* Snapshot summary */}
        {loadingSnapshot ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : snapshot ? (
          <SnapshotCard
            t={t}
            snapshot={snapshot}
            open={snapshotOpen}
            setOpen={setSnapshotOpen}
            locale={locale}
          />
        ) : null}

        {/* Templates */}
        {conversation.length === 0 && templates.length > 0 && (
          <div className="bg-white border border-sky-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-sky-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {t("templates.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplate(tpl)}
                  disabled={asking}
                  className="text-left rtl:text-right px-4 py-3 bg-sky-50/40 hover:bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-lg text-sm text-slate-700 hover:text-sky-900 transition-colors disabled:opacity-50 flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        {conversation.length > 0 && (
          <div className="space-y-4">
            {conversation.map((turn, idx) => (
              <ConversationTurn
                key={idx}
                turn={turn}
                t={t}
                locale={locale}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-sky-200 rounded-xl p-2 flex items-end gap-2 sticky bottom-4 shadow-lg"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t("input.placeholder")}
            rows={1}
            disabled={asking}
            className="flex-1 px-3 py-2 text-sm border-0 focus:outline-none resize-none min-h-[40px] max-h-[120px] disabled:opacity-60"
            style={{ fontFamily: "inherit" }}
          />
          <button
            type="submit"
            disabled={!question.trim() || asking}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex-shrink-0"
          >
            {asking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {t("input.send")}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Snapshot Card
// ============================================================================
function SnapshotCard({
  t,
  snapshot,
  open,
  setOpen,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  snapshot: BusinessSnapshot;
  open: boolean;
  setOpen: (b: boolean) => void;
  locale: string;
}) {
  const ChevIcon = open ? ChevronUp : ChevronDown;

  return (
    <div className="bg-gradient-to-br from-white to-sky-50/30 border border-sky-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-sky-50 text-sky-500 p-2 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-left rtl:text-right">
            <div className="text-sm font-semibold text-sky-900">
              {t("snapshot.title")}
            </div>
            <div className="text-xs text-slate-500">
              {t("snapshot.subtitle")}
            </div>
          </div>
        </div>
        <ChevIcon className="w-5 h-5 text-slate-400" />
      </button>

      {open && (
        <div className="border-t border-sky-100 p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat
            icon={Users}
            label={t("snapshot.customers")}
            value={String(snapshot.customers.total)}
            hint={`+${snapshot.customers.new30d} ${t("snapshot.last30d")}`}
          />
          <MiniStat
            icon={DollarSign}
            label={t("snapshot.wonRevenue")}
            value={formatMoneyShort(snapshot.deals.wonValueLast30d)}
            hint={`${snapshot.deals.wonLast30d} ${t("snapshot.wonDeals")}`}
          />
          <MiniStat
            icon={TrendingUp}
            label={t("snapshot.weightedPipeline")}
            value={formatMoneyShort(snapshot.deals.weightedPipelineValue)}
            hint={`${snapshot.deals.open} ${t("snapshot.openDeals")}`}
          />
          <MiniStat
            icon={FileText}
            label={t("snapshot.quotesAccepted")}
            value={formatMoneyShort(snapshot.quotes.acceptedValueLast30d)}
            hint={`${snapshot.quotes.acceptRate.toFixed(0)}% ${t("snapshot.acceptRate")}`}
          />
          <MiniStat
            icon={Bell}
            label={t("snapshot.staleCustomers")}
            value={String(snapshot.followup.staleCustomers)}
            hint={`${snapshot.followup.criticalStale} ${t("snapshot.critical")}`}
          />
          <MiniStat
            icon={FileText}
            label={t("snapshot.pendingQuotes")}
            value={formatMoneyShort(snapshot.quotes.pendingValue)}
            hint={t("snapshot.awaitingResponse")}
          />
          <MiniStat
            icon={Zap}
            label={t("snapshot.avgDealSize")}
            value={formatMoneyShort(snapshot.deals.avgDealSize)}
            hint={t("snapshot.fromWonDeals")}
          />
          <MiniStat
            icon={Users}
            label={t("snapshot.loyaltyMembers")}
            value={String(snapshot.loyalty.activeMembers)}
            hint={`${formatNumber(snapshot.loyalty.totalPointsIssued)} ${t("snapshot.ptsIssued")}`}
          />
        </div>
      )}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-white border border-sky-100 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1 text-slate-500">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-lg font-bold text-sky-900 truncate">{value}</div>
      <div className="text-xs text-slate-500 truncate">{hint}</div>
    </div>
  );
}

// ============================================================================
// Conversation turn (Q + A bubbles)
// ============================================================================
function ConversationTurn({
  turn,
  t,
  locale,
}: {
  turn: ConvTurn;
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  return (
    <div className="space-y-3">
      {/* User question */}
      <div className="flex ltr:justify-end rtl:justify-start">
        <div className="bg-sky-500 text-white rounded-2xl ltr:rounded-br-sm rtl:rounded-bl-sm px-4 py-2.5 max-w-[80%] text-sm shadow-sm">
          {turn.question}
        </div>
      </div>

      {/* AI answer */}
      <div className="flex ltr:justify-start rtl:justify-end gap-2 items-start">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white border border-sky-100 rounded-2xl ltr:rounded-bl-sm rtl:rounded-br-sm px-5 py-4 max-w-[85%] shadow-sm">
          <div className="prose prose-sm max-w-none text-slate-700">
            <MarkdownRenderer text={turn.answer} />
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-sky-50 flex items-center gap-1.5">
            <Bot className="w-2.5 h-2.5" />
            {t("ai.poweredBy")}
            <span className="text-slate-300">·</span>
            <span>{formatTime(turn.generatedAt, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Minimal markdown renderer (supports headings, bullets, bold, paragraphs)
// ============================================================================
function MarkdownRenderer({ text }: { text: string }) {
  // Simple line-based renderer — good enough for Gemini's structured output
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const ListTag = listType === "ol" ? "ol" : "ul";
    out.push(
      <ListTag
        key={`list-${out.length}`}
        className={
          listType === "ol"
            ? "list-decimal list-inside space-y-1 my-2 text-sm"
            : "list-disc list-inside space-y-1 my-2 text-sm"
        }
      >
        {listBuffer.map((item, i) => (
          <li key={i} className="text-slate-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
          </li>
        ))}
      </ListTag>
    );
    listBuffer = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      flushList();
      out.push(
        <h3
          key={out.length}
          className="text-sm font-bold text-sky-900 mt-3 mb-1"
        >
          {line.slice(4)}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      out.push(
        <h2
          key={out.length}
          className="text-base font-bold text-sky-900 mt-4 mb-2"
        >
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      flushList();
      out.push(
        <h1
          key={out.length}
          className="text-lg font-bold text-sky-900 mt-4 mb-2"
        >
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    // Bullet lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(line.slice(2));
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(numMatch[2]);
      continue;
    }

    // Paragraph
    flushList();
    out.push(
      <p
        key={out.length}
        className="my-2 text-sm leading-relaxed text-slate-700"
      >
        <span dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      </p>
    );
  }
  flushList();

  return <>{out}</>;
}

function renderInline(text: string): string {
  // Escape HTML first
  let s = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Bold
  s = s.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-bold text-sky-900">$1</strong>'
  );
  // Italic
  s = s.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  // Inline code
  s = s.replace(
    /`([^`]+)`/g,
    '<code class="bg-sky-50 text-sky-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>'
  );
  return s;
}

// ============================================================================
// Helpers
// ============================================================================
function formatMoneyShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function formatTime(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleTimeString(loc, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
