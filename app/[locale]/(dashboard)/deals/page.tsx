'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AITable, type AITableColumn } from '@/components/ai/AITable';
import { CreateDealModal } from '@/components/deals/CreateDealModal';
import { dealsAI, type AIDeal, type DealStage } from '@/lib/ai/dealsAI';
import { usePageContextSync } from '@/hooks/usePageContextSync';
import { cn } from '@/lib/utils';

const STAGE_TONE: Record<DealStage, string> = {
  lead: 'bg-muted text-cyan-300',
  qualified: 'bg-sky-100 text-foreground',
  proposal: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
  negotiation: 'bg-violet-500/10 text-violet-700',
  closing: 'bg-cyan-500/10 text-cyan-700',
  won: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
  lost: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
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
        <span
          className={cn(
            'inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize',
            STAGE_TONE[d.stage],
          )}
        >
          {d.stage}
        </span>
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
