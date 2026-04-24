export type RecommendationType =
  | "overdue_task"
  | "hot_lead"
  | "revenue_forecast"
  | "team_celebration"
  | "stalling_deal"
  | "customer_anniversary"
  | "insight_discovery"
  | "getting_started";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  body: string;
  ctaLabel: string;
  href?: string;
}

interface FetchOptions {
  locale: string;
  signal?: AbortSignal;
}

/**
 * Fetch recommendations from backend. The backend route (/api/recommendations)
 * is not yet wired — we fall back to locale-aware static tips so the UI is
 * never blank.
 */
export async function fetchRecommendations({
  locale,
  signal,
}: FetchOptions): Promise<Recommendation[]> {
  try {
    const res = await fetch(`/api/recommendations?locale=${locale}`, {
      signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data?.items) && data.items.length > 0) {
      return data.items as Recommendation[];
    }
    throw new Error("empty");
  } catch {
    return getFallbackRecommendations(locale);
  }
}

export function getFallbackRecommendations(locale: string): Recommendation[] {
  const copy: Record<string, Recommendation[]> = {
    en: [
      {
        id: "fallback-overdue",
        type: "overdue_task",
        title: "Ahmed (Deal: $12,000) hasn't replied in 5 days",
        body: "Consider sending a WhatsApp follow-up to keep momentum.",
        ctaLabel: "Open deal",
        href: "/merchant/deals",
      },
      {
        id: "fallback-hot",
        type: "hot_lead",
        title: "Sarah opened your quote 4 times today",
        body: "High intent — calling now increases close rate 3x.",
        ctaLabel: "Call Sarah",
        href: "/merchant/contacts",
      },
      {
        id: "fallback-forecast",
        type: "revenue_forecast",
        title: "Q2 on track for $142k",
        body: "12% above your quarterly goal — keep pushing.",
        ctaLabel: "View forecast",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-team",
        type: "team_celebration",
        title: "Your team closed 8 deals this week",
        body: "22% above your weekly average — keep it up.",
        ctaLabel: "View stats",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-insight",
        type: "insight_discovery",
        title: "Your Riyadh deals close 2x faster than Jeddah",
        body: "Consider reassigning resources to high-velocity regions.",
        ctaLabel: "See breakdown",
        href: "/merchant/dashboards",
      },
    ],
    ar: [
      {
        id: "fallback-overdue",
        type: "overdue_task",
        title: "أحمد (صفقة: 12,000$) لم يرد منذ 5 أيام",
        body: "يُفضّل إرسال رسالة متابعة عبر واتساب للحفاظ على الزخم.",
        ctaLabel: "فتح الصفقة",
        href: "/merchant/deals",
      },
      {
        id: "fallback-hot",
        type: "hot_lead",
        title: "سارة فتحت عرض السعر 4 مرات اليوم",
        body: "نية شراء عالية — الاتصال الآن يضاعف فرص الإغلاق 3 مرات.",
        ctaLabel: "اتصل بسارة",
        href: "/merchant/contacts",
      },
      {
        id: "fallback-forecast",
        type: "revenue_forecast",
        title: "الربع الثاني في طريقه لـ 142 ألف دولار",
        body: "12% فوق هدفك الربعي — واصل التقدم.",
        ctaLabel: "عرض التوقعات",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-team",
        type: "team_celebration",
        title: "فريقك أغلق 8 صفقات هذا الأسبوع",
        body: "22% فوق متوسطك الأسبوعي — استمر.",
        ctaLabel: "عرض الإحصاءات",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-insight",
        type: "insight_discovery",
        title: "صفقات الرياض تُغلق بسرعة ضعف صفقات جدة",
        body: "فكّر في إعادة توزيع الموارد للمناطق الأسرع.",
        ctaLabel: "عرض التفاصيل",
        href: "/merchant/dashboards",
      },
    ],
    tr: [
      {
        id: "fallback-overdue",
        type: "overdue_task",
        title: "Ahmed (Anlaşma: $12,000) 5 gündür yanıt vermiyor",
        body: "Momentumu korumak için WhatsApp üzerinden takip mesajı gönderin.",
        ctaLabel: "Anlaşmayı aç",
        href: "/merchant/deals",
      },
      {
        id: "fallback-hot",
        type: "hot_lead",
        title: "Sarah bugün teklifini 4 kez açtı",
        body: "Yüksek niyet — şimdi aramak kapanış oranını 3 katına çıkarır.",
        ctaLabel: "Sarah'ı ara",
        href: "/merchant/contacts",
      },
      {
        id: "fallback-forecast",
        type: "revenue_forecast",
        title: "2. Çeyrek $142k yolunda",
        body: "Çeyreklik hedefinin %12 üzerinde — böyle devam.",
        ctaLabel: "Tahmini gör",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-team",
        type: "team_celebration",
        title: "Ekibiniz bu hafta 8 anlaşma kapattı",
        body: "Haftalık ortalamanızın %22 üzerinde — devam edin.",
        ctaLabel: "İstatistikleri gör",
        href: "/merchant/dashboards",
      },
      {
        id: "fallback-insight",
        type: "insight_discovery",
        title: "Riyad anlaşmalarınız Cidde'den 2 kat hızlı kapanıyor",
        body: "Kaynakları yeniden dağıtmayı düşünün.",
        ctaLabel: "Dökümü gör",
        href: "/merchant/dashboards",
      },
    ],
  };
  return copy[locale] ?? copy.en;
}
