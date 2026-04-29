'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Sparkles, Wand2, Languages, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  messagingAI,
  type MessageTone,
  type MessageLanguage,
  type AIMessageDraft,
} from '@/lib/ai/messagingAI';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

interface Props {
  context?: string;
  channel: 'email' | 'whatsapp';
  onSend?: (content: string) => void;
}

export function AIMessageComposer({ context = '', channel, onSend }: Props) {
  const locale = useLocale() as MessageLanguage;
  const t = useTranslations('ai.messaging');

  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState<AIMessageDraft[]>([]);
  const [generating, setGenerating] = useState(false);
  const [improvingTone, setImprovingTone] = useState<MessageTone | null>(null);

  const generate = async () => {
    setGenerating(true);
    const result = await messagingAI.generateDrafts({
      context: context || content || 'Follow up on previous conversation',
      channel,
      language: locale,
      variants: 3,
    });
    setDrafts(result);
    setGenerating(false);
  };

  const improveTone = async (tone: MessageTone) => {
    if (!content.trim()) {
      toast.error(t('writeFirst'));
      return;
    }
    setImprovingTone(tone);
    const improved = await messagingAI.improveTone(content, tone, locale);
    setContent(improved);
    setImprovingTone(null);
    toast.success(t('toneImproved'));
  };

  const send = () => {
    if (!content.trim()) return;
    onSend?.(content);
    setContent('');
    setDrafts([]);
    toast.success(t('sent'));
  };

  return (
    <div className="space-y-3 border-t border-border bg-card p-4">
      {drafts.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {t('aiSuggestions')}
          </div>
          <div className="grid gap-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <button
                key={draft.id}
                onClick={() => {
                  setContent(draft.content);
                  setDrafts([]);
                }}
                className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-start transition-shadow hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary capitalize">
                    {t(`tone.${draft.tone}`)}
                  </span>
                  <AITrustBadge confidence={draft.confidence} size="sm" />
                </div>
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {draft.content}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('placeholder')}
        rows={4}
        className="w-full rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-md-hover disabled:opacity-60"
        >
          {generating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Sparkles size={13} />
          )}
          <span>{t('aiSuggest')}</span>
        </button>

        <ToneMenu onSelect={improveTone} loading={improvingTone} />

        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
          <Languages size={13} />
          <span>{t('translate')}</span>
        </button>

        <div className="ml-auto" />

        <button
          onClick={send}
          disabled={!content.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primaryDark disabled:opacity-50"
        >
          <Send size={13} />
          <span>{t('send')}</span>
        </button>
      </div>
    </div>
  );
}

function ToneMenu({
  onSelect,
  loading,
}: {
  onSelect: (tone: MessageTone) => void;
  loading: MessageTone | null;
}) {
  const t = useTranslations('ai.messaging');
  const [open, setOpen] = useState(false);
  const tones: MessageTone[] = ['professional', 'friendly', 'concise', 'persuasive'];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Wand2 size={13} />
        )}
        <span>{t('improveTone')}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-40 mb-1 w-44 rounded-lg border border-border bg-card p-1 shadow-md">
            {tones.map((tone) => (
              <button
                key={tone}
                onClick={() => {
                  onSelect(tone);
                  setOpen(false);
                }}
                className="block w-full rounded-md px-2 py-1.5 text-start text-xs text-muted-foreground hover:bg-violet-500/10"
              >
                {t(`tone.${tone}`)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
