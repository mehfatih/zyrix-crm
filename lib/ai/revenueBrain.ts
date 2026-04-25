import axios from 'axios';

export interface RevenueScenario {
  id: 'conservative' | 'expected' | 'optimistic';
  label: string;
  amount: number;
  probability: number;
  drivers: string[];
}

export interface RevenueLeakage {
  category: string;
  amount: number;
  reason: string;
}

export interface RevenueBrainData {
  monthlyTarget: number;
  monthlyActual: number;
  monthlyProgress: number;
  scenarios: RevenueScenario[];
  leakage: RevenueLeakage[];
  recommendedActions: Array<{ label: string; impact: number; confidence: number }>;
  confidence: number;
}

class RevenueBrainService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

  async getRevenueBrain(workspaceId: string): Promise<RevenueBrainData> {
    try {
      const { data } = await axios.get(`${this.baseURL}/api/ai/revenue-brain`, {
        params: { workspaceId },
        timeout: 5000,
      });
      return data;
    } catch {
      return this.demo();
    }
  }

  private demo(): RevenueBrainData {
    return {
      monthlyTarget: 500000,
      monthlyActual: 388000,
      monthlyProgress: 78,
      scenarios: [
        {
          id: 'conservative',
          label: 'Conservative',
          amount: 462000,
          probability: 90,
          drivers: ['Confirmed deals only', 'No new closes assumed'],
        },
        {
          id: 'expected',
          label: 'Expected',
          amount: 524000,
          probability: 65,
          drivers: ['Current pipeline velocity', 'Historical close rate'],
        },
        {
          id: 'optimistic',
          label: 'Optimistic',
          amount: 612000,
          probability: 25,
          drivers: ['All proposal-stage deals close', 'Upsell program active'],
        },
      ],
      leakage: [
        { category: 'Stalled deals', amount: 42000, reason: '8 deals silent >7 days' },
        { category: 'Discounting', amount: 18000, reason: 'Avg discount 14% vs 8% baseline' },
        { category: 'Lost competitive', amount: 26000, reason: '3 deals lost to undercut pricing' },
      ],
      recommendedActions: [
        { label: 'Recover 4 stalled deals via AI follow-up', impact: 28000, confidence: 78 },
        { label: 'Tighten discount policy >10%', impact: 12000, confidence: 84 },
        { label: 'Launch upsell campaign on 14 high-fit accounts', impact: 38000, confidence: 71 },
      ],
      confidence: 82,
    };
  }
}

export const revenueBrain = new RevenueBrainService();
