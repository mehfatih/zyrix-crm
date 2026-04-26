import { apiClient } from '@/lib/api/client';

export interface AIPriorityAction {
  id: string;
  rank: number;
  type: 'risk' | 'opportunity' | 'followup' | 'revenue' | 'retention';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  signals: string[];
  recommendedAction: string;
  cta: { label: string; action: string; targetUrl?: string };
  entityId?: string;
  entityType?: string;
}

export interface AIExecutiveSummary {
  greeting: string;
  oneLineNarrative: string;
  topPriorities: number;
  revenueAtRisk: number;
  opportunities: number;
  confidence: number;
  cta: Array<{ label: string; action: string }>;
}

export interface AIDecisionContext {
  workspaceId: string;
  userName?: string;
  locale: 'en' | 'ar' | 'tr';
}

class DecisionEngineService {
  async getExecutiveSummary(ctx: AIDecisionContext): Promise<AIExecutiveSummary> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/executive-summary',
        ctx,
        { timeout: 5000 }
      );
      return data;
    } catch {
      return this.demoSummary(ctx);
    }
  }

  async getPriorityActions(ctx: AIDecisionContext): Promise<AIPriorityAction[]> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/priority-actions',
        ctx,
        { timeout: 5000 }
      );
      return data;
    } catch {
      return this.demoActions(ctx);
    }
  }

  private demoSummary(ctx: AIDecisionContext): AIExecutiveSummary {
    const greetings = {
      en: `Good morning${ctx.userName ? `, ${ctx.userName}` : ''}`,
      ar: `صباح الخير${ctx.userName ? `، ${ctx.userName}` : ''}`,
      tr: `Günaydın${ctx.userName ? `, ${ctx.userName}` : ''}`,
    };
    const narratives = {
      en: 'Pipeline is healthy this week. 2 high-value deals need attention. Revenue is on track to exceed last month by 12%.',
      ar: 'خط المبيعات في حالة جيدة هذا الأسبوع. صفقتان عاليتا القيمة بحاجة لاهتمامك. الإيرادات في طريقها لتجاوز الشهر الماضي بنسبة 12%.',
      tr: 'Boru hattı bu hafta sağlıklı. 2 yüksek değerli anlaşmaya dikkat gerekiyor. Gelir geçen ayı %12 aşma yolunda.',
    };
    const ctaLabels = {
      en: [
        { label: 'Show priorities', action: 'scroll-priorities' },
        { label: 'Open revenue brain', action: 'scroll-revenue' },
        { label: 'Ask AI', action: 'open-ai-panel' },
      ],
      ar: [
        { label: 'عرض الأولويات', action: 'scroll-priorities' },
        { label: 'فتح عقل الإيرادات', action: 'scroll-revenue' },
        { label: 'اسأل الذكاء', action: 'open-ai-panel' },
      ],
      tr: [
        { label: 'Öncelikleri göster', action: 'scroll-priorities' },
        { label: 'Gelir beynini aç', action: 'scroll-revenue' },
        { label: "AI'a sor", action: 'open-ai-panel' },
      ],
    };
    return {
      greeting: greetings[ctx.locale],
      oneLineNarrative: narratives[ctx.locale],
      topPriorities: 5,
      revenueAtRisk: 86500,
      opportunities: 3,
      confidence: 84,
      cta: ctaLabels[ctx.locale],
    };
  }

  private demoActions(ctx: AIDecisionContext): AIPriorityAction[] {
    const copy = {
      en: [
        {
          title: 'Levant Foods showing churn signals',
          description: 'Customer LTV $42k. Sentiment dropped after support ticket on Apr 18.',
          reason: '60 days inactive on a high-value account; sentiment shift detected.',
          signals: ['60 days inactive', 'Support sentiment dropped', 'High LTV'],
          recommendedAction: 'Schedule personal check-in within 48 hours',
          ctaLabel: 'Open recovery plan',
        },
        {
          title: 'Al-Faisal Trading ready to upgrade',
          description: 'Usage pattern indicates 3x current plan needs.',
          reason: 'API calls increased 240% over 30 days; 4 users hit free-tier limits.',
          signals: ['Usage +240%', 'Plan limits hit 4x', 'Engaged decision-maker'],
          recommendedAction: 'Send tailored upgrade proposal with ROI breakdown',
          ctaLabel: 'Draft proposal',
        },
        {
          title: '8 deals silent past baseline',
          description: 'Combined value $180k waiting on first follow-up.',
          reason: 'Average response delay exceeds workspace baseline by 60%.',
          signals: ['Avg delay 8d (baseline 5d)', '8 deals affected'],
          recommendedAction: 'Run bulk follow-up batch with personalized AI drafts',
          ctaLabel: 'Open bulk drafts',
        },
        {
          title: 'Q2 target 78% complete',
          description: '$112k remaining across 14 days.',
          reason: 'Daily run-rate $7.4k; target $8k.',
          signals: ['Run-rate $7.4k/day', 'Required $8k/day', 'Closing-stage volume strong'],
          recommendedAction: 'Push 3 closing-stage deals this week to close gap',
          ctaLabel: 'Open revenue brain',
        },
        {
          title: 'Renewal queue: 6 contracts in 30 days',
          description: 'Combined ARR $94k.',
          reason: 'Auto-detected from contracts module.',
          signals: ['6 contracts in 30 days', 'Combined ARR $94k', '2 at-risk'],
          recommendedAction: 'Start renewal conversations now for at-risk accounts',
          ctaLabel: 'Open renewals',
        },
      ],
      ar: [
        {
          title: 'Levant Foods تظهر إشارات تسرب',
          description: 'قيمة العميل مدى الحياة 42 ألف $. انخفض الانطباع بعد تذكرة الدعم في 18 أبريل.',
          reason: '60 يومًا من الخمول على حساب عالي القيمة؛ تم رصد تحول في الانطباع.',
          signals: ['60 يومًا خامل', 'انخفاض انطباع الدعم', 'قيمة عمر عالية'],
          recommendedAction: 'جدولة محادثة شخصية خلال 48 ساعة',
          ctaLabel: 'افتح خطة الاستعادة',
        },
        {
          title: 'Al-Faisal Trading جاهز للترقية',
          description: 'نمط الاستخدام يشير إلى 3 أضعاف احتياجات الخطة الحالية.',
          reason: 'زادت طلبات API بنسبة 240% خلال 30 يومًا؛ وصل 4 مستخدمين لحدود الخطة المجانية.',
          signals: ['الاستخدام +240%', 'تجاوز حدود الخطة 4 مرات', 'صانع قرار متفاعل'],
          recommendedAction: 'أرسل عرض ترقية مخصصًا مع تحليل العائد',
          ctaLabel: 'صياغة العرض',
        },
        {
          title: '8 صفقات صامتة بعد الحد الأساسي',
          description: 'قيمة مجمعة 180 ألف $ تنتظر أول متابعة.',
          reason: 'متوسط تأخير الرد يتجاوز الأساس بـ 60%.',
          signals: ['متوسط التأخير 8 أيام (الأساس 5)', '8 صفقات متأثرة'],
          recommendedAction: 'تشغيل دفعة متابعة جماعية بمسودات AI مخصصة',
          ctaLabel: 'فتح المسودات الجماعية',
        },
        {
          title: 'هدف الربع الثاني مكتمل 78%',
          description: '112 ألف $ متبقية على مدى 14 يومًا.',
          reason: 'معدل يومي 7.4 ألف $؛ المستهدف 8 آلاف $.',
          signals: ['معدل التشغيل 7.4 ألف $/يوم', 'المطلوب 8 آلاف $/يوم', 'حجم مرحلة الإغلاق قوي'],
          recommendedAction: 'ادفع 3 صفقات في مرحلة الإغلاق هذا الأسبوع',
          ctaLabel: 'فتح عقل الإيرادات',
        },
        {
          title: 'قائمة التجديد: 6 عقود خلال 30 يومًا',
          description: 'إيراد سنوي مجمع 94 ألف $.',
          reason: 'تم رصدها تلقائيًا من وحدة العقود.',
          signals: ['6 عقود خلال 30 يومًا', 'ARR مجمع 94 ألف $', '2 في خطر'],
          recommendedAction: 'ابدأ محادثات التجديد الآن للحسابات في خطر',
          ctaLabel: 'فتح التجديدات',
        },
      ],
      tr: [
        {
          title: 'Levant Foods kayıp sinyalleri gösteriyor',
          description: 'Müşteri LTV $42k. 18 Nisan destek talebinden sonra duygu düştü.',
          reason: 'Yüksek değerli hesapta 60 gün hareketsiz; duygu değişimi tespit edildi.',
          signals: ['60 gün hareketsiz', 'Destek duygusu düştü', 'Yüksek LTV'],
          recommendedAction: '48 saat içinde kişisel görüşme planlayın',
          ctaLabel: 'Kurtarma planını aç',
        },
        {
          title: 'Al-Faisal Trading yükseltmeye hazır',
          description: 'Kullanım şablonu mevcut planın 3 katı ihtiyacı gösteriyor.',
          reason: '30 günde API çağrıları %240 arttı; 4 kullanıcı ücretsiz katman sınırlarına ulaştı.',
          signals: ['Kullanım +%240', 'Plan limitleri 4 kez aşıldı', 'Etkin karar verici'],
          recommendedAction: 'ROI dökümlü kişiselleştirilmiş yükseltme teklifi gönderin',
          ctaLabel: 'Teklif taslağı',
        },
        {
          title: '8 anlaşma temel çizginin ötesinde sessiz',
          description: 'İlk takibi bekleyen toplam değer $180k.',
          reason: 'Ortalama yanıt gecikmesi çalışma alanı temelini %60 aşıyor.',
          signals: ['Ort. gecikme 8g (temel 5g)', '8 anlaşma etkilendi'],
          recommendedAction: 'Kişiselleştirilmiş AI taslakları ile toplu takip başlatın',
          ctaLabel: 'Toplu taslakları aç',
        },
        {
          title: 'Q2 hedefi %78 tamamlandı',
          description: '14 gün içinde kalan $112k.',
          reason: 'Günlük çalışma oranı $7.4k; hedef $8k.',
          signals: ['Çalışma oranı $7.4k/gün', 'Gerekli $8k/gün', 'Kapanış aşaması hacmi güçlü'],
          recommendedAction: 'Açığı kapatmak için bu hafta 3 kapanış aşaması anlaşmasını itin',
          ctaLabel: 'Gelir beynini aç',
        },
        {
          title: 'Yenileme kuyruğu: 30 günde 6 sözleşme',
          description: 'Toplam ARR $94k.',
          reason: 'Sözleşmeler modülünden otomatik tespit edildi.',
          signals: ['30 günde 6 sözleşme', 'Toplam ARR $94k', '2 risk altında'],
          recommendedAction: 'Risk altındaki hesaplar için yenileme görüşmelerini şimdi başlatın',
          ctaLabel: 'Yenilemeleri aç',
        },
      ],
    };

    const c = copy[ctx.locale];
    const types: AIPriorityAction['type'][] = ['risk', 'opportunity', 'followup', 'revenue', 'retention'];
    const meta: Array<{
      id: string;
      rank: number;
      confidence: number;
      cta: { label: string; action: string; targetUrl?: string };
      entityId?: string;
      entityType?: string;
    }> = [
      {
        id: 'a1',
        rank: 1,
        confidence: 82,
        cta: { label: c[0].ctaLabel, action: 'open-recovery', targetUrl: '/customers/c5' },
        entityId: 'c5',
        entityType: 'customer',
      },
      {
        id: 'a2',
        rank: 2,
        confidence: 88,
        cta: { label: c[1].ctaLabel, action: 'draft-proposal', targetUrl: '/customers/c12' },
        entityId: 'c12',
        entityType: 'customer',
      },
      {
        id: 'a3',
        rank: 3,
        confidence: 76,
        cta: { label: c[2].ctaLabel, action: 'open-bulk-followup' },
      },
      {
        id: 'a4',
        rank: 4,
        confidence: 71,
        cta: { label: c[3].ctaLabel, action: 'scroll-revenue' },
      },
      {
        id: 'a5',
        rank: 5,
        confidence: 92,
        cta: { label: c[4].ctaLabel, action: 'open-renewals' },
      },
    ];

    return c.map((item, idx) => ({
      ...meta[idx],
      type: types[idx],
      title: item.title,
      description: item.description,
      reason: item.reason,
      signals: item.signals,
      recommendedAction: item.recommendedAction,
    }));
  }
}

export const decisionEngine = new DecisionEngineService();
