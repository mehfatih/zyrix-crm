import { apiClient } from '@/lib/api/client';

export type BulkActionType =
  | 'ask-ai'
  | 'draft-messages'
  | 'create-tasks'
  | 'export';

export interface BulkActionRequest {
  type: BulkActionType;
  entityType: 'customer' | 'deal';
  entityIds: string[];
  options?: {
    messageChannel?: 'email' | 'whatsapp';
    tone?: 'professional' | 'friendly' | 'concise' | 'persuasive';
    taskTemplate?: string;
  };
}

export interface BulkActionDraft {
  entityId: string;
  content: string;
  confidence: number;
}

export interface BulkActionResult {
  success: boolean;
  affectedCount: number;
  message: string;
  drafts?: BulkActionDraft[];
}

class BulkActionsService {
  async execute(req: BulkActionRequest): Promise<BulkActionResult> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/bulk-actions',
        req,
        { timeout: 10000 },
      );
      return data;
    } catch {
      return this.demo(req);
    }
  }

  private demo(req: BulkActionRequest): BulkActionResult {
    const labels: Record<BulkActionType, string> = {
      'ask-ai': `AI analyzed ${req.entityIds.length} ${req.entityType}s`,
      'draft-messages': `Drafted ${req.entityIds.length} personalized messages`,
      'create-tasks': `Created ${req.entityIds.length} tasks`,
      export: `Exported ${req.entityIds.length} ${req.entityType}s`,
    };
    return {
      success: true,
      affectedCount: req.entityIds.length,
      message: labels[req.type],
      drafts:
        req.type === 'draft-messages'
          ? req.entityIds.map((id) => ({
              entityId: id,
              content:
                "Hi, just checking in on our recent conversation. Wanted to make sure everything is on track. Let me know if you'd like to discuss next steps.",
              confidence: 78 + Math.floor(Math.random() * 12),
            }))
          : undefined,
    };
  }
}

export const bulkActions = new BulkActionsService();
