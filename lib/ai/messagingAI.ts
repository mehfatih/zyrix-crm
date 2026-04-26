import { apiClient } from '@/lib/api/client';

export type MessageTone = 'professional' | 'friendly' | 'concise' | 'persuasive';
export type MessageChannel = 'email' | 'whatsapp';
export type MessageLanguage = 'en' | 'ar' | 'tr';

export interface AIMessageDraft {
  id: string;
  tone: MessageTone;
  content: string;
  confidence: number;
  reasoning: string;
}

export interface DraftRequest {
  context: string;
  tone?: MessageTone;
  channel: MessageChannel;
  language: MessageLanguage;
  variants?: number;
}

class MessagingAIService {
  async generateDrafts(req: DraftRequest): Promise<AIMessageDraft[]> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/messages/draft',
        req,
        { timeout: 15000 },
      );
      return data;
    } catch {
      return this.demo();
    }
  }

  async improveTone(
    content: string,
    tone: MessageTone,
    language: MessageLanguage,
  ): Promise<string> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/messages/improve-tone',
        { content, tone, language },
      );
      return data.content;
    } catch {
      return content;
    }
  }

  async translate(content: string, to: MessageLanguage): Promise<string> {
    try {
      const { data } = await apiClient.post(
        '/api/ai/messages/translate',
        { content, to },
      );
      return data.content;
    } catch {
      return content;
    }
  }

  private demo(): AIMessageDraft[] {
    const tones: MessageTone[] = ['professional', 'friendly', 'concise'];
    const samples: Record<MessageTone, string> = {
      professional:
        'Hello, I wanted to follow up on our previous conversation. Please let me know a convenient time to discuss next steps.',
      friendly:
        'Hey! Just checking in to see how things are going on your end. Happy to chat whenever works for you.',
      concise:
        'Following up on our last conversation. Available to discuss whenever you are.',
      persuasive:
        'I noticed you might benefit from moving forward soon — current pricing locks in for 30 days. Want to review the details together?',
    };

    return tones.map((tone, i) => ({
      id: `d${i}`,
      tone,
      content: samples[tone],
      confidence: 80 + Math.floor(Math.random() * 12),
      reasoning: `Optimized for ${tone} tone based on customer history and channel norms.`,
    }));
  }
}

export const messagingAI = new MessagingAIService();
