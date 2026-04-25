"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  X,
  AlertTriangle,
  Wand2,
  Building2,
  BarChart3,
} from "lucide-react";
import {
  aiArchitect,
  aiBuilder,
  aiReport,
  type AiArchitectOutput,
  type AiBuilderOutput,
  type AiReportOutput,
  type AiBuilderArtifactType,
} from "@/lib/api/advanced";
import { extractErrorMessage } from "@/lib/errors";

// ============================================================================
// AI BUILD MODAL (P11)
// ----------------------------------------------------------------------------
// Global "Build" modal exposing the three AI modes:
//   • Architect  — suggested CRM config from a business description
//   • Builder    — workflow/email/landing artifact from an intent
//   • Report     — ad-hoc natural-language analytics
// Renders the output in readable format; no auto-apply yet — the user
// copies what they want into the respective pages (workflows, etc.).
// ============================================================================

type Mode = "architect" | "builder" | "report";
type Locale = "en" | "ar" | "tr";

export function AiBuildModal({
  open,
  onClose,
  locale = "en",
}: {
  open: boolean;
  onClose: () => void;
  locale?: Locale;
}) {
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [mode, setMode] = useState<Mode>("architect");
  const [input, setInput] = useState("");
  const [artifactType, setArtifactType] =
    useState<AiBuilderArtifactType>("workflow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    AiArchitectOutput | AiBuilderOutput | AiReportOutput | null
  >(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (mode === "architect") {
        const out = await aiArchitect({
          businessDescription: input,
          locale,
        });
        setResult(out);
      } else if (mode === "builder") {
        const out = await aiBuilder({ intent: input, artifactType });
        setResult(out);
      } else {
        const out = await aiReport({ question: input, locale });
        setResult(out);
      }
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const placeholders: Record<Mode, string> = {
    architect: tr(
      "e.g. A boutique perfume brand in Riyadh with 3 stores, B2C + corporate gifting",
      "مثل: متجر عطور في الرياض بـ 3 فروع، B2C + هدايا للشركات",
      "örn. Riyad'da 3 mağazası olan butik parfüm markası, B2C + kurumsal hediyeler"
    ),
    builder: tr(
      "e.g. When a deal goes to 'won', email the customer a receipt + thank-you",
      "مثل: عند انتقال الصفقة إلى 'won'، أرسل إيصالًا وشكرًا للعميل",
      "örn. Anlaşma 'won' olunca müşteriye makbuz ve teşekkür e-postası gönder"
    ),
    report: tr(
      "e.g. What were my top customers by revenue last quarter?",
      "مثل: من أكبر عملائي من حيث الإيرادات في الربع الماضي؟",
      "örn. Geçen çeyrekte en büyük gelir getiren müşterilerim kimlerdi?"
    ),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/30 backdrop-blur-sm p-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-2xl mt-10 rounded-2xl bg-white border border-sky-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-sky-100 bg-gradient-to-br from-sky-50 via-sky-50 to-blue-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-sky-900">
              {tr("Build with AI", "بناء بالذكاء الاصطناعي", "AI ile oluştur")}
            </h2>
            <p className="text-xs text-slate-600">
              {tr(
                "Describe what you want; we'll draft it.",
                "صف ما تريد وسنقوم بصياغته.",
                "İstediğinizi tarif edin; biz taslağını hazırlayalım."
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-500 hover:bg-white/70 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-sky-100">
          <ModeTab
            label={tr("Architect", "مهندس", "Mimar")}
            icon={Building2}
            active={mode === "architect"}
            onClick={() => {
              setMode("architect");
              setResult(null);
            }}
          />
          <ModeTab
            label={tr("Builder", "باني", "Oluşturucu")}
            icon={Wand2}
            active={mode === "builder"}
            onClick={() => {
              setMode("builder");
              setResult(null);
            }}
          />
          <ModeTab
            label={tr("Report", "تقرير", "Rapor")}
            icon={BarChart3}
            active={mode === "report"}
            onClick={() => {
              setMode("report");
              setResult(null);
            }}
          />
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {mode === "builder" && (
            <div className="flex flex-wrap gap-1">
              {(
                ["workflow", "email", "landing"] as AiBuilderArtifactType[]
              ).map((t) => (
                <button
                  key={t}
                  onClick={() => setArtifactType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    artifactType === t
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white border-sky-200 text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  {t === "workflow"
                    ? tr("Workflow", "سير العمل", "Akış")
                    : t === "email"
                      ? tr("Email template", "قالب بريد", "E-posta şablonu")
                      : tr("Landing page", "صفحة وصول", "Açılış sayfası")}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[mode]}
            rows={3}
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          />
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 flex items-start gap-2 text-xs text-rose-700">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {tr("Generate", "توليد", "Oluştur")}
            </button>
          </div>

          {result && (
            <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 space-y-2 max-h-[50vh] overflow-auto">
              {mode === "report" && (result as AiReportOutput).narrative && (
                <p className="text-sm text-sky-900 font-semibold">
                  {(result as AiReportOutput).narrative}
                </p>
              )}
              {mode === "architect" && (result as AiArchitectOutput).rationale && (
                <p className="text-sm text-sky-900 font-semibold">
                  {(result as AiArchitectOutput).rationale}
                </p>
              )}
              <pre
                dir="ltr"
                className="bg-white p-2 rounded border border-sky-200 text-[11px] font-mono overflow-x-auto"
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModeTab({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
        active
          ? "border-sky-500 text-sky-600 bg-sky-50/40"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
