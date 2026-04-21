"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PenTool,
  Mail,
  MessageSquare,
  Share2,
  Loader2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { generateAiContent } from "@/lib/api/advanced";

// ============================================================================
// CONTENT WRITER — one-shot draft generator
// ============================================================================

const TONES = [
  { key: "professional", label: { en: "Professional", ar: "احترافي", tr: "Profesyonel" } },
  { key: "casual", label: { en: "Casual", ar: "ودود", tr: "Samimi" } },
  { key: "friendly", label: { en: "Friendly", ar: "لطيف", tr: "Arkadaş canlısı" } },
  { key: "formal", label: { en: "Formal", ar: "رسمي", tr: "Resmi" } },
  { key: "persuasive", label: { en: "Persuasive", ar: "مقنع", tr: "İkna edici" } },
];

export default function ContentWriterPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [kind, setKind] = useState<"email" | "whatsapp" | "social">("email");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState<"ar" | "en" | "tr">(locale);
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(
        tr("Please describe what you want", "اكتب وصف لما تريده", "Ne istediğinizi açıklayın")
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateAiContent({
        kind,
        prompt: prompt.trim(),
        tone,
        language,
      });
      setDraft(result.draft);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const kindSpecs = [
    {
      key: "email" as const,
      icon: Mail,
      label: tr("Email", "بريد إلكتروني", "E-posta"),
    },
    {
      key: "whatsapp" as const,
      icon: MessageSquare,
      label: tr("WhatsApp", "واتساب", "WhatsApp"),
    },
    {
      key: "social" as const,
      icon: Share2,
      label: tr("Social post", "منشور سوشيال", "Sosyal gönderi"),
    },
  ];

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-3xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ai`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-cyan-700"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">
              {tr("Content Writer", "كاتب المحتوى", "İçerik Yazarı")}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "Draft emails, WhatsApp messages, and social posts in seconds.",
                "اكتب إيميلات، رسائل واتساب، ومنشورات سوشيال في ثواني.",
                "Saniyeler içinde e-posta, WhatsApp mesajı ve sosyal gönderi oluşturun."
              )}
            </p>
          </div>
        </div>

        {/* Kind picker */}
        <div className="rounded-xl border border-sky-100 bg-white p-4">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-2">
            {tr("Content type", "نوع المحتوى", "İçerik türü")}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {kindSpecs.map((k) => {
              const Icon = k.icon;
              const active = kind === k.key;
              return (
                <button
                  key={k.key}
                  onClick={() => setKind(k.key)}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all flex items-center gap-2 ${
                    active
                      ? "border-violet-500 bg-violet-50 text-violet-900 ring-2 ring-violet-200"
                      : "border-sky-100 bg-white text-slate-700 hover:border-violet-300"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "text-violet-700" : "text-slate-500"}`}
                  />
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone + language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              {tr("Tone", "النبرة", "Ton")}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {TONES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label[locale]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              {tr("Language", "اللغة", "Dil")}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "en" | "tr")}
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("What do you want to write?", "ماذا تريد أن تكتب؟", "Ne yazmak istiyorsunuz?")}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={tr(
              "E.g. Follow-up email to a customer after a product demo, mention our 30-day free trial, keep it under 150 words.",
              "مثلاً: إيميل متابعة لعميل بعد عرض تجريبي، اذكر التجربة المجانية 30 يوم، خليه أقل من 150 كلمة.",
              "Örn: Ürün demosu sonrası müşteriye takip e-postası, 30 günlük ücretsiz denememizden bahset, 150 kelimenin altında tut."
            )}
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {draft
            ? tr("Regenerate", "أعد التوليد", "Yeniden oluştur")
            : tr("Generate draft", "أنشئ مسودة", "Taslak oluştur")}
        </button>

        {/* Draft output */}
        {draft && (
          <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/40 to-fuchsia-50/20 overflow-hidden">
            <div className="p-3 border-b border-violet-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-violet-900">
                <Sparkles className="w-4 h-4" />
                {tr("Draft", "مسودة", "Taslak")}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-violet-200 text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      {tr("Copied", "تم النسخ", "Kopyalandı")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {tr("Copy", "نسخ", "Kopyala")}
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 rounded-md text-xs font-semibold disabled:opacity-50"
                  title={tr("Regenerate", "أعد التوليد", "Yeniden oluştur")}
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <pre
                className="text-sm whitespace-pre-wrap break-words font-sans text-slate-800 leading-relaxed"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {draft}
              </pre>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
