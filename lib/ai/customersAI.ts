import { apiClient } from '@/lib/api/client';

export type RiskLevel = 'low' | 'medium' | 'high';
export type CustomerSegment =
  | 'champion'
  | 'growth'
  | 'at-risk'
  | 'new'
  | 'dormant';

export interface AICustomer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  segment: CustomerSegment;
  ltv: number;
  aiScore: number;
  riskLevel: RiskLevel;
  nextAction: string;
  nextActionConfidence: number;
  signals: string[];
  lastContactDays: number;
  totalRevenue: number;
}

export interface CustomerListResponse {
  customers: AICustomer[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CustomerListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  segment?: CustomerSegment;
  riskLevel?: RiskLevel;
}

class CustomersAIService {
  async list(params: CustomerListParams): Promise<CustomerListResponse> {
    try {
      const { data } = await apiClient.get('/api/ai/customers', {
        params,
        timeout: 5000,
      });
      return data;
    } catch {
      return this.demo(params);
    }
  }

  private demo(params: CustomerListParams): CustomerListResponse {
    const pool: AICustomer[] = [
      {
        id: 'c1',
        name: 'Khalid Al-Faisal',
        company: 'Al-Faisal Trading',
        email: 'k@alfaisal.sa',
        country: 'SA',
        segment: 'champion',
        ltv: 124000,
        aiScore: 92,
        riskLevel: 'low',
        nextAction: 'Send upgrade proposal — 240% usage growth',
        nextActionConfidence: 88,
        signals: ['Usage +240%', 'Plan limits hit 4x'],
        lastContactDays: 3,
        totalRevenue: 84000,
      },
      {
        id: 'c2',
        name: 'Sara Demir',
        company: 'Demir Tekstil',
        email: 's@demir.tr',
        country: 'TR',
        segment: 'growth',
        ltv: 56000,
        aiScore: 78,
        riskLevel: 'low',
        nextAction: 'Schedule quarterly business review',
        nextActionConfidence: 72,
        signals: ['Steady growth 8%/mo', 'Engaged DM'],
        lastContactDays: 12,
        totalRevenue: 32000,
      },
      {
        id: 'c5',
        name: 'Levant Foods',
        company: 'Levant Foods Ltd',
        email: 'ops@levant.ae',
        country: 'AE',
        segment: 'at-risk',
        ltv: 42000,
        aiScore: 38,
        riskLevel: 'high',
        nextAction: 'Personal check-in within 48h — churn risk',
        nextActionConfidence: 84,
        signals: ['60d inactive', 'Sentiment dropped', 'Support ticket open'],
        lastContactDays: 60,
        totalRevenue: 38000,
      },
      {
        id: 'c8',
        name: 'Ahmed Mansour',
        company: 'Mansour Holdings',
        email: 'a@mansour.eg',
        country: 'EG',
        segment: 'new',
        ltv: 8500,
        aiScore: 65,
        riskLevel: 'medium',
        nextAction: 'Send onboarding checklist',
        nextActionConfidence: 91,
        signals: ['Signed up 5d ago', 'Activation 40%'],
        lastContactDays: 2,
        totalRevenue: 2400,
      },
      {
        id: 'c12',
        name: 'Fatima Al-Zahra',
        company: 'AlZahra Cosmetics',
        email: 'f@alzahra.kw',
        country: 'KW',
        segment: 'champion',
        ltv: 89000,
        aiScore: 94,
        riskLevel: 'low',
        nextAction: 'Refer-a-friend campaign — high NPS',
        nextActionConfidence: 76,
        signals: ['NPS 9', '12 months active', 'Expanded twice'],
        lastContactDays: 1,
        totalRevenue: 76000,
      },
      {
        id: 'c14',
        name: 'Yusuf Ozkan',
        company: 'Ozkan Logistics',
        email: 'y@ozkan.tr',
        country: 'TR',
        segment: 'dormant',
        ltv: 24000,
        aiScore: 22,
        riskLevel: 'high',
        nextAction: 'Win-back offer — 90d silent',
        nextActionConfidence: 68,
        signals: ['90d no login', 'No recent invoices'],
        lastContactDays: 92,
        totalRevenue: 18000,
      },
    ];

    let filtered = pool;
    if (params.segment) {
      filtered = filtered.filter((c) => c.segment === params.segment);
    }
    if (params.riskLevel) {
      filtered = filtered.filter((c) => c.riskLevel === params.riskLevel);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q),
      );
    }

    return {
      customers: filtered,
      totalCount: filtered.length,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 50,
    };
  }
}

export const customersAI = new CustomersAIService();
