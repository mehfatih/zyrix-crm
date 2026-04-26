import { apiClient } from '@/lib/api/client';

export type ReportType = 'sales' | 'pipeline' | 'customers' | 'revenue';

export interface AIReportInsight {
  title: string;
  description: string;
}

export interface AIReportChart {
  id: string;
  title: string;
  kind: 'bar' | 'line' | 'pie';
  data: Array<{ label: string; value: number }>;
  aiInterpretation: string;
  confidence: number;
}

export interface AIReport {
  type: ReportType;
  narrative: string;
  insights: AIReportInsight[];
  charts: AIReportChart[];
  generatedAt: string;
  confidence: number;
}

class ReportsAIService {
  async getReport(type: ReportType): Promise<AIReport> {
    try {
      const { data } = await apiClient.get(
        `/api/ai/reports/${type}`,
        { timeout: 8000 },
      );
      return data;
    } catch {
      return this.demo(type);
    }
  }

  private demo(type: ReportType): AIReport {
    return {
      type,
      narrative:
        'Sales performance this month is 12% above target, driven by strong closing rate in negotiation. However, 3 high-value deals show stalling signs and need immediate attention. Customer retention improved 8% but acquisition cost rose 15% due to longer sales cycles.',
      insights: [
        {
          title: 'Closing rate up 18%',
          description: 'Negotiation stage now converts at 64% vs 54% baseline.',
        },
        {
          title: '3 deals at risk',
          description: 'Combined value $86,500 — recommend immediate outreach.',
        },
        {
          title: 'WhatsApp drives 2x replies',
          description: 'Switching primary channel to WhatsApp recommended.',
        },
      ],
      charts: [
        {
          id: 'c1',
          title: 'Revenue by stage',
          kind: 'bar',
          data: [
            { label: 'Lead', value: 12 },
            { label: 'Qualified', value: 42 },
            { label: 'Proposal', value: 64 },
            { label: 'Negotiation', value: 38 },
            { label: 'Closing', value: 86 },
          ],
          aiInterpretation:
            'Closing stage holds 60% of total pipeline value but moves slowest — bottleneck detected.',
          confidence: 84,
        },
        {
          id: 'c2',
          title: 'Activity by day',
          kind: 'line',
          data: [
            { label: 'Mon', value: 28 },
            { label: 'Tue', value: 64 },
            { label: 'Wed', value: 78 },
            { label: 'Thu', value: 71 },
            { label: 'Fri', value: 45 },
            { label: 'Sat', value: 18 },
            { label: 'Sun', value: 12 },
          ],
          aiInterpretation:
            'Tuesday-Thursday show highest engagement. Schedule key outreach in this window.',
          confidence: 78,
        },
      ],
      generatedAt: new Date().toISOString(),
      confidence: 82,
    };
  }
}

export const reportsAI = new ReportsAIService();
