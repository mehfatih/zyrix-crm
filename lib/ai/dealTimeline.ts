import axios from 'axios';

export interface TimelineEvent {
  id: string;
  day: number;
  date: string;
  label: string;
  type: 'normal' | 'warning' | 'risk';
  aiNote?: {
    insight: string;
    confidence: number;
    signals: string[];
  };
}

export interface DealTimelineData {
  events: TimelineEvent[];
  recoveryPlan?: string;
}

class DealTimelineService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

  async getTimeline(dealId: string): Promise<DealTimelineData> {
    try {
      const { data } = await axios.get(
        `${this.baseURL}/api/ai/deals/${dealId}/timeline`,
        { timeout: 5000 },
      );
      return data;
    } catch {
      return this.demo();
    }
  }

  private demo(): DealTimelineData {
    return {
      events: [
        { id: '1', day: 1, date: 'Apr 18', label: 'Lead created', type: 'normal' },
        {
          id: '2',
          day: 2,
          date: 'Apr 19',
          label: 'First contact via email',
          type: 'normal',
        },
        { id: '3', day: 5, date: 'Apr 22', label: 'Proposal sent', type: 'normal' },
        {
          id: '4',
          day: 8,
          date: 'Apr 25',
          label: 'No response — 3 days silent',
          type: 'warning',
          aiNote: {
            insight:
              'Delay above normal for proposal stage. Workspace baseline: 5 days. Currently: 8 days.',
            confidence: 82,
            signals: [
              '8d since contact',
              'Stage baseline 5d',
              '60% above baseline',
              'Customer was responsive',
            ],
          },
        },
      ],
      recoveryPlan:
        'Send a brief, value-focused check-in within 24 hours. Reference proposal specifics. If no reply within 48 hours, escalate to a phone call from deal owner.',
    };
  }
}

export const dealTimeline = new DealTimelineService();
