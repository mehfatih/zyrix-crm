import { apiClient } from '@/lib/api/client';
import type { AIDeal, DealStage } from './dealsAI';

export interface StageHealth {
  stageId: DealStage;
  totalValue: number;
  dealCount: number;
  avgDaysInStage: number;
  baselineDays: number;
  isBottleneck: boolean;
  stuckDealIds: string[];
}

export interface PipelineSnapshot {
  deals: AIDeal[];
  stageHealth: Record<DealStage, StageHealth>;
}

class PipelineAIService {
  async getSnapshot(workspaceId: string): Promise<PipelineSnapshot> {
    try {
      const { data } = await apiClient.get('/api/ai/pipeline', {
        params: { workspaceId },
        timeout: 5000,
      });
      return data;
    } catch {
      return this.demo();
    }
  }

  async updateDealStage(dealId: string, newStage: DealStage): Promise<void> {
    try {
      await apiClient.patch(`/api/deals/${dealId}/stage`, {
        stage: newStage,
      });
    } catch {
      // Silent fail in demo mode
    }
  }

  private demo(): PipelineSnapshot {
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
        signals: ['Active negotiation'],
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
        signals: ['Stalled 22d', 'Customer at-risk'],
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
        signals: ['Verbal commitment'],
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
        signals: ['New lead'],
      },
      {
        id: 'd6',
        name: 'Ozkan Logistics Q3',
        customerId: 'c14',
        customerName: 'Ozkan Logistics',
        stage: 'proposal',
        value: 28000,
        currency: 'USD',
        probability: 45,
        aiScore: 58,
        riskLevel: 'medium',
        daysInStage: 11,
        expectedClose: '2026-05-20',
        nextAction: 'Decision-maker has not opened proposal',
        nextActionConfidence: 72,
        signals: ['11d silent', 'Email unopened'],
      },
    ];

    const stages: DealStage[] = [
      'lead',
      'qualified',
      'proposal',
      'negotiation',
      'closing',
    ];
    const baselines: Record<DealStage, number> = {
      lead: 3,
      qualified: 7,
      proposal: 5,
      negotiation: 6,
      closing: 4,
      won: 0,
      lost: 0,
    };

    const stageHealth = {} as Record<DealStage, StageHealth>;
    for (const stage of stages) {
      const stageDeals = deals.filter((d) => d.stage === stage);
      const totalValue = stageDeals.reduce((s, d) => s + d.value, 0);
      const avgDays = stageDeals.length
        ? stageDeals.reduce((s, d) => s + d.daysInStage, 0) / stageDeals.length
        : 0;
      const baseline = baselines[stage];
      const stuck = stageDeals.filter((d) => d.daysInStage > baseline * 1.5);
      stageHealth[stage] = {
        stageId: stage,
        totalValue,
        dealCount: stageDeals.length,
        avgDaysInStage: Math.round(avgDays),
        baselineDays: baseline,
        isBottleneck: avgDays > baseline * 1.4,
        stuckDealIds: stuck.map((d) => d.id),
      };
    }

    return { deals, stageHealth };
  }
}

export const pipelineAI = new PipelineAIService();
