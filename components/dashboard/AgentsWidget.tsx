'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { agentsService, type AgentOutput } from '@/lib/ai/agents';
import { AIAgentCard } from '@/components/ai/AIAgentCard';

export function AgentsWidget() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const t = useTranslations('ai.agents');
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ['agent-outputs', 'current'],
    queryFn: () => agentsService.runAll('current'),
  });

  const top3 = data.slice(0, 3);

  const handleApprove = async (id: string) => {
    await agentsService.approveOutput(id);
    queryClient.setQueryData(['agent-outputs', 'current'], (old: AgentOutput[] = []) =>
      old.filter((o) => o.id !== id),
    );
  };

  const handleDismiss = async (id: string) => {
    await agentsService.dismissOutput(id);
    queryClient.setQueryData(['agent-outputs', 'current'], (old: AgentOutput[] = []) =>
      old.filter((o) => o.id !== id),
    );
  };

  if (top3.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t('title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('widgetSubtitle', { count: data.length })}
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/ai-agents`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-primaryDark hover:bg-card"
        >
          {t('viewAll')}
          <ArrowRight size={12} />
        </button>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {top3.map((output) => (
          <AIAgentCard
            key={output.id}
            output={output}
            onApprove={handleApprove}
            onEdit={() => router.push(`/${locale}/ai-agents`)}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </section>
  );
}
