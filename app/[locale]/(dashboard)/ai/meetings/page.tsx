"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileAudio,
  FileText,
  Loader2,
  Sparkles,
  CheckSquare,
  HelpCircle,
  Target,
  User as UserIcon,
  Copy,
  Check,
  Upload,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  extractAiMeetingNotes,
  type MeetingNotesResult,
} from "@/lib/api/advanced";

// ============================================================================
// MEETING NOTES — paste transcript → structured output
// ============================================================================

export default function MeetingNotesPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<"ar" | "en" | "tr">(locale);
  const [result, setResult] = useState<MeetingNotesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (transcript.trim().length < 20) {
      setError(
        tr(
          "Transcript is too short (min 20 characters)",
          "النص قصير جدًا (الحد الأدنى 20 حرفًا)",
          "Transkript çok kısa (en az 20 karakter)"
        )
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await extractAiMeetingNotes({
        transcript: transcript.trim(),
        language,
      });
      setResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.match(/\.(txt|md|vtt|srt)$/i)) {
      alert(
        tr(
          "Please upload a text file (.txt, .md, .vtt, .srt)",
          "ارفع ملف نصي (.txt, .md, .vtt, .srt)",
          "Bir metin dosyası yükleyin (.txt, .md, .vtt, .srt)"
        )
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") setTranscript(text);
    };
    reader.readAsText(file);
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ai`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white flex items-center justify-center shadow">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">AI AGENTS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr("Meeting Notes", "ملاحظات الاجتماعات", "Toplantı Notları")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Paste a meeting transcript — get action items, decisions, and open questions.",
                "الصق نص الاجتماع — واحصل على قائمة مهام، قرارات، وأسئلة مفتوحة.",
                "Bir toplantı transkripti yapıştırın — eylem öğeleri, kararlar ve açık sorular alın."
              )}
            </p>
          </div>
        </div>

        {/* Input section */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {tr("Language", "اللغة", "Dil")}
              </label>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "ar" | "en" | "tr")
                }
                className="px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-card"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border hover:bg-muted rounded-md text-xs font-semibold text-foreground cursor-pointer">
              <Upload className="w-3 h-3" />
              {tr("Upload file", "رفع ملف", "Dosya yükle")}
              <input
                type="file"
                accept=".txt,.md,.vtt,.srt,text/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            placeholder={tr(
              "Paste the meeting transcript here…\n\nExample:\n\nAhmed: Let's review the Q4 roadmap. Sarah, do we have the design mockups ready?\nSarah: Yes, I'll share them by Friday.\nAhmed: Good. We also need to decide on pricing…",
              "الصق نص الاجتماع هنا…\n\nمثال:\n\nأحمد: خلونا نراجع خريطة الربع الرابع. سارة، هل التصاميم جاهزة؟\nسارة: أيوة، هبعتهم يوم الجمعة.\nأحمد: كويس. محتاجين نقرر السعر كمان…",
              "Toplantı transkriptini buraya yapıştırın…\n\nÖrnek:\n\nAhmet: Q4 yol haritasını inceleyelim. Ayşe, tasarım mockupları hazır mı?\nAyşe: Evet, cuma gününe kadar paylaşacağım.\nAhmet: İyi. Fiyatlandırmaya da karar vermeliyiz…"
            )}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          <div className="text-xs text-muted-foreground">
            {transcript.length.toLocaleString()}{" "}
            {tr("characters", "حرف", "karakter")}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Extract button */}
        <button
          onClick={handleExtract}
          disabled={loading || transcript.trim().length < 20}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {result
            ? tr("Re-extract", "إعادة الاستخراج", "Yeniden çıkar")
            : tr("Extract notes", "استخراج الملاحظات", "Notları çıkar")}
        </button>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <ResultSection
              icon={<FileText className="w-4 h-4" />}
              accent="emerald"
              title={tr("Summary", "الملخص", "Özet")}
              content={result.summary}
              copyable
              locale={locale}
              tr={tr}
            />

            {result.actionItems.length > 0 && (
              <ActionItemsSection
                items={result.actionItems}
                locale={locale}
                tr={tr}
              />
            )}

            {result.decisions.length > 0 && (
              <ListSection
                icon={<Target className="w-4 h-4" />}
                accent="sky"
                title={tr("Decisions", "القرارات", "Kararlar")}
                items={result.decisions}
                locale={locale}
                tr={tr}
              />
            )}

            {result.openQuestions.length > 0 && (
              <ListSection
                icon={<HelpCircle className="w-4 h-4" />}
                accent="amber"
                title={tr(
                  "Open questions",
                  "أسئلة مفتوحة",
                  "Açık sorular"
                )}
                items={result.openQuestions}
                locale={locale}
                tr={tr}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ResultSection({
  icon,
  accent,
  title,
  content,
  copyable,
  locale,
  tr,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  content: string;
  copyable?: boolean;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const [copied, setCopied] = useState(false);
  const tones: Record<string, { border: string; bg: string; text: string }> = {
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-900",
    },
    sky: {
      border: "border-border",
      bg: "bg-muted/40",
      text: "text-foreground",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-50/40",
      text: "text-amber-900",
    },
  };
  const t = tones[accent] ?? tones.emerald;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`rounded-xl border ${t.border} ${t.bg} overflow-hidden`}>
      <div
        className={`p-3 flex items-center justify-between gap-2 ${t.border} border-b`}
      >
        <div className={`inline-flex items-center gap-2 text-sm font-bold ${t.text}`}>
          {icon}
          {title}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-card border border-border rounded text-[10px] font-semibold text-muted-foreground hover:text-cyan-300"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-300" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {tr("Copy", "نسخ", "Kopyala")}
          </button>
        )}
      </div>
      <div className="p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}

function ActionItemsSection({
  items,
  locale,
  tr,
}: {
  items: Array<{ owner?: string; task: string }>;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <CheckSquare className="w-4 h-4" />
          {tr("Action items", "قائمة المهام", "Eylem öğeleri")}
          <span className="text-xs font-normal text-muted-foreground">
            ({items.length})
          </span>
        </div>
      </div>
      <ul className="p-2 space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-card text-sm"
          >
            <span className="w-5 h-5 rounded bg-sky-100 text-cyan-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              {item.owner && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 text-foreground text-[10px] font-semibold me-2">
                  <UserIcon className="w-2.5 h-2.5" />
                  {item.owner}
                </span>
              )}
              <span className="text-foreground">{item.task}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListSection({
  icon,
  accent,
  title,
  items,
  locale,
  tr,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  items: string[];
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
}) {
  const tones: Record<string, { border: string; bg: string; text: string; bullet: string }> = {
    sky: {
      border: "border-border",
      bg: "bg-muted/30",
      text: "text-foreground",
      bullet: "bg-sky-400",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-900",
      bullet: "bg-amber-400",
    },
  };
  const t = tones[accent] ?? tones.sky;
  return (
    <div className={`rounded-xl border ${t.border} ${t.bg} overflow-hidden`}>
      <div className={`p-3 ${t.border} border-b flex items-center justify-between`}>
        <div className={`inline-flex items-center gap-2 text-sm font-bold ${t.text}`}>
          {icon}
          {title}
          <span className="text-xs font-normal text-muted-foreground">
            ({items.length})
          </span>
        </div>
      </div>
      <ul className="p-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <span
              className={`w-1.5 h-1.5 rounded-full ${t.bullet} flex-shrink-0 mt-2`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
