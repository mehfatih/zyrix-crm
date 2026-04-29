'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AITable, type AITableColumn } from '@/components/ai/AITable';
import { CreateDealModal } from '@/components/deals/CreateDealModal';
import { TopDealsHero } from '@/components/deals/TopDealsHero';
import {
  StatusPill,
  STAGE_TONE,
  type StatusTone,
} from '@/components/ui/StatusPill';
import { dealsAI, type AIDeal, type DealStage } from '@/lib/ai/dealsAI';
import { usePageContextSync } from '@/hooks/usePageContextSync';

// Local fallback so a never-before-seen stage at least renders neutrally.
const STAGE_TONE_FALLBACK: Record<DealStage, StatusTone> = {
  lead: 'neutral',
  qualified: 'info',
  proposal: 'warning',
  negotiation: 'warning',
  closing: 'premium',
  won: 'success',
  lost: 'danger',
};

export default function DealsPage() {
  usePageContextSync('deals');

  const t = useTranslations('deals');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';

  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ai-deals', search],
    queryFn: () => dealsAI.list({ search }),
  });

  const columns: AITableColumn<AIDeal>[] = [
    {
      key: 'name',
      header: t('name'),
      render: (d) => (
        <div>
          <div className="font-semibold text-foreground">{d.name}</div>
          <div className="text-xs text-muted-foreground">{d.customerName}</div>
        </div>
      ),
    },
    {
      key: 'stage',
      header: t('stage'),
      render: (d) => (
        <StatusPill
          tone={STAGE_TONE[d.stage] ?? STAGE_TONE_FALLBACK[d.stage] ?? 'neutral'}
          size="sm"
        >
          <span className="capitalize">{d.stage}</span>
        </StatusPill>
      ),
    },
    {
      key: 'value',
      header: t('value'),
      render: (d) => (
        <span className="font-semibold text-foreground">
          {d.currency} {d.value.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'daysInStage',
      header: t('daysInStage'),
      render: (d) => (
        <span
          className={
            d.daysInStage > 14 ? 'text-amber-300' : 'text-muted-foreground'
          }
        >
          {d.daysInStage}d
        </span>
      ),
    },
    {
      key: 'expectedClose',
      header: t('expectedClose'),
      render: (d) => (
        <span className="text-xs text-muted-foreground">
          {new Date(d.expectedClose).toLocaleDateString(locale)}
        </span>
      ),
    },
  ];

  const wonValue = (data?.deals ?? [])
    .filter((d) => d.stage === 'won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">DEALS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {data?.totalCount ?? 0} {t('countSuffix')} · ${wonValue.toLocaleString()} {t('won')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:shadow-md-hover"
            >
              <Plus size={14} />
              {t('create')}
            </button>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <div className="relative max-w-md flex-1">
            <Search
              size={14}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-lg border border-border bg-card px-9 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Filter size={14} />
            {t('filters')}
          </button>
        </div>

        <TopDealsHero
          deals={(data?.deals ?? []).map((d) => ({
            id: d.id,
            name: d.name,
            customer: d.customerName,
            value: d.value,
            stage: d.stage,
          }))}
        />

        <AITable
          data={data?.deals ?? []}
          columns={columns}
          entityType="deal"
          isLoading={isLoading}
        />

        {createOpen && (
          <CreateDealModal
            onClose={() => setCreateOpen(false)}
            onSuccess={() => {
              setCreateOpen(false);
              refetch();
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}
