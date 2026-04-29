'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AIPipelineBoard } from '@/components/pipeline/AIPipelineBoard';
import { AIDealTimelineDrawer } from '@/components/deals/AIDealTimelineDrawer';
import { TopFiveHero, type TopFiveItem } from '@/components/shared/TopFiveHero';
import { usePageContextSync } from '@/hooks/usePageContextSync';
import { type AIDeal } from '@/lib/ai/dealsAI';
import { pipelineAI } from '@/lib/ai/pipelineAI';

export default function PipelinePage() {
  const t = useTranslations('ai.pipeline');
  const tStages = useTranslations('ai.pipeline.stages');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const [selectedDeal, setSelectedDeal] = useState<AIDeal | null>(null);

  usePageContextSync(
    'pipeline',
    selectedDeal ? { id: selectedDeal.id, type: 'deal' } : null,
  );

  // Same query key as AIPipelineBoard — React Query dedupes, so this
  // shares the fetch and we don't double-call /api/ai/pipeline.
  const workspaceId = 'current';
  const { data: snapshot } = useQuery({
    queryKey: ['pipeline', workspaceId],
    queryFn: () => pipelineAI.getSnapshot(workspaceId),
  });

  // Build the hero items from stageHealth (top 5 stages by total value).
  const stageItems: TopFiveItem[] = snapshot
    ? Object.values(snapshot.stageHealth).map((sh) => ({
        id: sh.stageId,
        primary: tStages(sh.stageId),
        secondary: `${sh.dealCount} deal${sh.dealCount === 1 ? '' : 's'}`,
        metric: sh.totalValue,
        badge: sh.isBottleneck ? `bottleneck · ${sh.avgDaysInStage}d` : undefined,
      }))
    : [];

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <header>
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2">
            PIPELINE
          </p>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>

        <TopFiveHero
          eyebrow="TOP 5 STAGES"
          title="Pipeline value by stage"
          accentText="text-cyan-300"
          items={stageItems}
          chartTitle="VALUE BY STAGE"
          chartSubtitle="Pipeline distribution"
        />

        <AIPipelineBoard workspaceId={workspaceId} onDealClick={setSelectedDeal} />

        <AIDealTimelineDrawer
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      </div>
    </DashboardShell>
  );
}
