import { apiClient } from '@/lib/api/client';

export type AgentRole =
  | 'sales-followup'
  | 'deal-risk'
  | 'revenue'
  | 'customer-profile'
  | 'messaging'
  | 'onboarding'
  | 'integration'
  | 'task';

export type AgentPermissionLevel = 1 | 2 | 3 | 4;

export interface AgentDefinition {
  role: AgentRole;
  name: string;
  description: string;
  defaultPermission: AgentPermissionLevel;
  iconKey: string;
  color: string;
}

export interface AgentOutput {
  id: string;
  agentRole: AgentRole;
  permissionLevel: AgentPermissionLevel;
  insight: string;
  reason: string;
  confidence: number;
  signals: string[];
  recommendedAction: string;
  cta: { label: string; action: string };
  draftPayload?: { type: string; content: string };
  entityType?: string;
  entityId?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'edited' | 'dismissed' | 'executed';
}

export const agentDefinitions: AgentDefinition[] = [
  {
    role: 'sales-followup',
    name: 'Sales Follow-up',
    description: 'Drafts and schedules follow-ups for stalled leads',
    defaultPermission: 2,
    iconKey: 'mail',
    color: '#0EA5E9',
  },
  {
    role: 'deal-risk',
    name: 'Deal Risk',
    description: 'Detects at-risk deals and proposes recovery plans',
    defaultPermission: 1,
    iconKey: 'alert',
    color: '#EF4444',
  },
  {
    role: 'revenue',
    name: 'Revenue',
    description: 'Forecasts revenue and identifies growth opportunities',
    defaultPermission: 1,
    iconKey: 'trending',
    color: '#22C55E',
  },
  {
    role: 'customer-profile',
    name: 'Customer Profile',
    description: 'Summarizes customer history and behavior patterns',
    defaultPermission: 1,
    iconKey: 'user',
    color: '#A855F7',
  },
  {
    role: 'messaging',
    name: 'Messaging',
    description: 'Drafts emails, WhatsApp replies, and improves tone',
    defaultPermission: 2,
    iconKey: 'message',
    color: '#06B6D4',
  },
  {
    role: 'onboarding',
    name: 'Onboarding',
    description: 'Guides new workspaces through setup',
    defaultPermission: 3,
    iconKey: 'rocket',
    color: '#F59E0B',
  },
  {
    role: 'integration',
    name: 'Integration',
    description: 'Manages Drive/Microsoft file actions',
    defaultPermission: 3,
    iconKey: 'link',
    color: '#0284C7',
  },
  {
    role: 'task',
    name: 'Task',
    description: 'Creates internal tasks from AI insights',
    defaultPermission: 4,
    iconKey: 'check',
    color: '#22D3EE',
  },
];

export const NEVER_AUTO_EXECUTE = [
  'send-payment',
  'change-tax-settings',
  'create-invoice',
  'edit-legal-doc',
  'send-external-message',
  'invite-user',
  'change-billing',
  'delete-data',
] as const;

class AgentsService {
  async runAll(workspaceId: string): Promise<AgentOutput[]> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/agents/run',
        { workspaceId },
        { timeout: 8000 },
      );
      return data;
    } catch {
      return this.demo();
    }
  }

  async approveOutput(outputId: string): Promise<void> {
    try {
      await apiClient.post(`/api/ai/agents/outputs/${outputId}/approve`);
    } catch {}
  }

  async dismissOutput(outputId: string): Promise<void> {
    try {
      await apiClient.post(`/api/ai/agents/outputs/${outputId}/dismiss`);
    } catch {}
  }

  async editOutput(outputId: string, edits: Partial<AgentOutput>): Promise<void> {
    try {
      await apiClient.post(`/api/ai/agents/outputs/${outputId}/edit`, edits);
    } catch {}
  }

  async updatePermission(role: AgentRole, level: AgentPermissionLevel): Promise<void> {
    try {
      await apiClient.put(`/api/ai/agents/${role}/permission`, { level });
    } catch {}
  }

  async getLogs(role?: AgentRole, limit = 50): Promise<AgentOutput[]> {
    try {
      const { data } = await apiClient.get('/api/ai/agents/logs', {
        params: { role, limit },
        timeout: 5000,
      });
      return data;
    } catch {
      return [];
    }
  }

  private demo(): AgentOutput[] {
    return [
      {
        id: 'a1',
        agentRole: 'sales-followup',
        permissionLevel: 2,
        insight: "Al-Faisal Trading hasn't replied in 8 days",
        reason:
          'Last activity 8 days ago. Workspace baseline: 5 days for proposal stage. Deal value: $24,000.',
        confidence: 88,
        signals: [
          '8 days silent',
          'Proposal stage',
          'High-value deal',
          'Previously responsive',
        ],
        recommendedAction: 'Send a personalized follow-up message to re-engage',
        cta: { label: 'Send follow-up', action: 'send-message' },
        draftPayload: {
          type: 'message',
          content:
            'Hi Khalid, just checking in on the proposal we shared last week. Happy to walk through any questions or adjust based on your priorities. When works for a quick call?',
        },
        entityType: 'deal',
        entityId: 'd1',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        status: 'pending',
      },
      {
        id: 'a2',
        agentRole: 'deal-risk',
        permissionLevel: 1,
        insight: 'Levant Foods deal showing churn signals',
        reason:
          '60 days inactive on a $42k LTV account. Sentiment dropped after last support ticket.',
        confidence: 76,
        signals: [
          '60 days inactive',
          'Support ticket sentiment dropped',
          'High-value account',
        ],
        recommendedAction: 'Schedule a personal check-in from owner within 48 hours',
        cta: { label: 'View recovery plan', action: 'open-recovery' },
        entityType: 'customer',
        entityId: 'c5',
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        status: 'pending',
      },
      {
        id: 'a3',
        agentRole: 'revenue',
        permissionLevel: 1,
        insight: 'Q2 target 78% complete with 14 days remaining',
        reason: 'Daily run-rate $7.4k vs required $8k. Closing-stage volume strong.',
        confidence: 71,
        signals: ['Run-rate $7.4k/day', 'Required $8k/day', '$112k gap'],
        recommendedAction: 'Push 3 closing-stage deals this week to close gap',
        cta: { label: 'Open revenue brain', action: 'open-revenue' },
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: 'pending',
      },
    ];
  }
}

export const agentsService = new AgentsService();
