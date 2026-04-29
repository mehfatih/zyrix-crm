'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AIPipelineBoard } from '@/components/pipeline/AIPipelineBoard';
import { AIDealTimelineDrawer } from '@/components/deals/AIDealTimelineDrawer';
import { usePageContextSync } from '@/hooks/usePageContextSync';
import { type AIDeal } from '@/lib/ai/dealsAI';

export default function PipelinePage() {
  const t = useTranslations('ai.pipeline');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const [selectedDeal, setSelectedDeal] = useState<AIDeal | null>(null);

  usePageContextSync(
    'pipeline',
    selectedDeal ? { id: selectedDeal.id, type: 'deal' } : null,
  );

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <header>
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2">PIPELINE</p>
          <h1 className="text-2xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>

        <AIPipelineBoard workspaceId="current" onDealClick={setSelectedDeal} />

        <AIDealTimelineDrawer
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      </div>
    </DashboardShell>
  );
}
