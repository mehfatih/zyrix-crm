import axios from 'axios';

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closing'
  | 'won'
  | 'lost';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface AIDeal {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  stage: DealStage;
  value: number;
  currency: string;
  probability: number;
  aiScore: number;
  riskLevel: RiskLevel;
  daysInStage: number;
  expectedClose: string;
  nextAction: string;
  nextActionConfidence: number;
  signals: string[];
  ownerName?: string;
}

export interface DealListParams {
  stage?: DealStage;
  riskLevel?: RiskLevel;
  search?: string;
}

class DealsAIService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

  async list(
    params: DealListParams,
  ): Promise<{ deals: AIDeal[]; totalCount: number }> {
    try {
      const { data } = await axios.get(`${this.baseURL}/api/ai/deals`, {
        params,
        timeout: 5000,
      });
      return data;
    } catch {
      return this.demo(params);
    }
  }

  private demo(params: DealListParams) {
    const deals: AIDeal[] = [
      {
        id: 'd1',
        name: 'Al-Faisal Q3 Expansion',
        customerId: 'c1',
        customerName: 'Al-Faisal Trading',
        stage: 'proposal',
        value: 24000,
        currency: 'USD',
        probability: 68,
        aiScore: 78,
        riskLevel: 'medium',
        daysInStage: 8,
        expectedClose: '2026-05-12',
        nextAction: 'Follow up — proposal sent 8 days ago',
        nextActionConfidence: 84,
        signals: ['8d in stage (baseline 5d)', 'High-fit account'],
      },
      {
        id: 'd2',
        name: 'Demir Tekstil Renewal',
        customerId: 'c2',
        customerName: 'Demir Tekstil',
        stage: 'negotiation',
        value: 18000,
        currency: 'USD',
        probability: 75,
        aiScore: 82,
        riskLevel: 'low',
        daysInStage: 4,
        expectedClose: '2026-05-05',
        nextAction: 'Send revised contract',
        nextActionConfidence: 79,
        signals: ['Active negotiation', 'Decision maker engaged'],
      },
      {
        id: 'd3',
        name: 'Levant Foods New Markets',
        customerId: 'c5',
        customerName: 'Levant Foods Ltd',
        stage: 'qualified',
        value: 42000,
        currency: 'USD',
        probability: 28,
        aiScore: 35,
        riskLevel: 'high',
        daysInStage: 22,
        expectedClose: '2026-06-01',
        nextAction: 'Re-engage — 22 days stalled',
        nextActionConfidence: 71,
        signals: ['Stalled 22d', 'Customer at-risk', 'No champion'],
      },
      {
        id: 'd4',
        name: 'AlZahra Cosmetics Upsell',
        customerId: 'c12',
        customerName: 'AlZahra Cosmetics',
        stage: 'closing',
        value: 36000,
        currency: 'USD',
        probability: 88,
        aiScore: 91,
        riskLevel: 'low',
        daysInStage: 2,
        expectedClose: '2026-04-30',
        nextAction: 'Confirm signing date',
        nextActionConfidence: 86,
        signals: ['Verbal commitment', 'Champion confirmed'],
      },
      {
        id: 'd5',
        name: 'Mansour Holdings Pilot',
        customerId: 'c8',
        customerName: 'Mansour Holdings',
        stage: 'lead',
        value: 12000,
        currency: 'USD',
        probability: 35,
        aiScore: 52,
        riskLevel: 'medium',
        daysInStage: 1,
        expectedClose: '2026-06-15',
        nextAction: 'Schedule discovery call',
        nextActionConfidence: 88,
        signals: ['New lead', 'Inbound from website'],
      },
    ];

    let filtered = deals;
    if (params.stage) {
      filtered = filtered.filter((d) => d.stage === params.stage);
    }
    if (params.riskLevel) {
      filtered = filtered.filter((d) => d.riskLevel === params.riskLevel);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q),
      );
    }

    return { deals: filtered, totalCount: filtered.length };
  }
}

export const dealsAI = new DealsAIService();
