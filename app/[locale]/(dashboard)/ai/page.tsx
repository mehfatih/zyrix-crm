"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  PenTool,
  FileAudio,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// AI AGENTS HUB — picker page with cards linking to each agent
// ============================================================================

export default function AiHubPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const agents = [
    {
      key: "sales",
      href: `/${locale}/ai/sales`,
      icon: MessageSquare,
      gradient: "from-cyan-500 via-sky-500 to-blue-600",
      label: tr("Sales Assistant", "مساعد المبيعات", "Satış Asistanı"),
      tagline: tr(
        "Ask anything about your pipeline",
        "اسأل أي حاجة عن مسار المبيعات",
        "Satış süreciniz hakkında her şeyi sorun"
      ),
      description: tr(
        "Your AI co-pilot with full CRM access. Ask 'what deals should I follow up on today?' or 'show me all deals over $10k in proposal stage' and get grounded answers.",
        "المساعد الذكي مع وصول كامل للـ CRM. اسأله 'أي صفقات لازم أتابعها اليوم؟' أو 'اعرضلي كل الصفقات فوق 10 آلاف دولار في مرحلة العرض' واحصل على إجابات مبنية على بياناتك الفعلية.",
        "CRM'nize tam erişimi olan AI yardımcınız. 'Bugün hangi anlaşmaları takip etmeliyim?' veya 'teklif aşamasındaki 10.000 $ üzerindeki tüm anlaşmaları göster' gibi sorular sorun ve verilerinize dayalı yanıtlar alın."
      ),
      examples: [
        tr(
          "What deals should I follow up on?",
          "أي صفقات لازم أتابعها؟",
          "Hangi anlaşmaları takip etmeliyim?"
        ),
        tr(
          "Show me stale proposals",
          "اعرضلي العروض الراكدة",
          "Durgun teklifleri göster"
        ),
        tr(
          "Which customers haven't we talked to this month?",
          "مين العملاء اللي مكلمناهمش هذا الشهر؟",
          "Bu ay hangi müşterilerle konuşmadık?"
        ),
      ],
    },
    {
      key: "content",
      href: `/${locale}/ai/content`,
      icon: PenTool,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      label: tr("Content Writer", "كاتب المحتوى", "İçerik Yazarı"),
      tagline: tr(
        "Draft messages instantly",
        "اكتب رسائل فورًا",
        "Mesajları anında yazın"
      ),
      description: tr(
        "Generate emails, WhatsApp messages, and social posts. Pick a tone, pick a language, give a quick prompt — get a polished draft in seconds.",
        "أنشئ إيميلات، رسائل واتساب، ومنشورات سوشيال ميديا. اختار نبرة، لغة، واكتب طلب بسيط — ستحصل على مسودة احترافية في ثواني.",
        "E-postalar, WhatsApp mesajları ve sosyal medya gönderileri oluşturun. Bir ton seçin, bir dil seçin, hızlı bir istek yazın — saniyeler içinde cilalı bir taslak alın."
      ),
      examples: [
        tr(
          "Follow-up email after a demo",
          "إيميل متابعة بعد عرض تجريبي",
          "Demo sonrası takip e-postası"
        ),
        tr(
          "WhatsApp welcome message",
          "رسالة ترحيب واتساب",
          "WhatsApp karşılama mesajı"
        ),
        tr(
          "LinkedIn post about Q4 results",
          "منشور LinkedIn عن نتائج الربع الرابع",
          "Q4 sonuçları hakkında LinkedIn gönderisi"
        ),
      ],
    },
    {
      key: "meeting",
      href: `/${locale}/ai/meetings`,
      icon: FileAudio,
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      label: tr(
        "Meeting Notes",
        "ملاحظات الاجتماعات",
        "Toplantı Notları"
      ),
      tagline: tr(
        "Turn transcripts into action items",
        "حوّل النصوص لقائمة مهام",
        "Transkriptleri eylem öğelerine dönüştürün"
      ),
      description: tr(
        "Paste a meeting transcript — get a structured summary, action items with owners, decisions made, and open questions. Save time processing notes.",
        "الصق نص اجتماع — واحصل على ملخص منظم، قائمة إجراءات مع المسؤولين، القرارات المتخذة، والأسئلة المفتوحة. وفّر وقت معالجة الملاحظات.",
        "Bir toplantı transkripti yapıştırın — yapılandırılmış bir özet, sahipli eylem öğeleri, alınan kararlar ve açık sorular alın. Not işleme zamanından tasarruf edin."
      ),
      examples: [
        tr(
          "Weekly team sync",
          "اجتماع الفريق الأسبوعي",
          "Haftalık ekip toplantısı"
        ),
        tr(
          "Customer discovery call",
          "مكالمة اكتشاف عميل",
          "Müşteri keşif görüşmesi"
        ),
        tr(
          "Quarterly planning session",
          "جلسة تخطيط ربع سنوية",
          "Üç aylık planlama oturumu"
        ),
      ],
    },
  ];

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-5xl mx-auto space-y-6"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">
              {tr("AI Agents", "وكلاء الذكاء الاصطناعي", "AI Ajanları")}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "Three AI agents built into Zyrix — each purpose-built for a different workflow.",
                "ثلاثة وكلاء AI مدمجين في Zyrix — كل واحد مصمم لسير عمل مختلف.",
                "Zyrix'e entegre üç AI ajanı — her biri farklı bir iş akışı için özel olarak tasarlandı."
              )}
            </p>
          </div>
        </div>

        {/* Agent cards */}
        <div className="space-y-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Link
                key={agent.key}
                href={agent.href}
                className="group block rounded-2xl border border-sky-100 bg-white hover:border-cyan-400 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} text-white flex items-center justify-center shadow-md flex-shrink-0`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-cyan-900">
                        {agent.label}
                      </h2>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                        AI
                      </span>
                    </div>
                    <p className="text-sm text-cyan-700 font-medium mt-0.5">
                      {agent.tagline}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      {agent.examples.map((example, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] text-slate-600"
                        >
                          <Zap className="w-3 h-3 text-cyan-600" />
                          "{example}"
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 text-slate-300 group-hover:text-cyan-600 transition-colors flex-shrink-0 mt-2 ${
                      isRtl ? "-scale-x-100" : ""
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
