'use client';

import { Suspense, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AITable, type AITableColumn } from '@/components/ai/AITable';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';
import { customersAI, type AICustomer } from '@/lib/ai/customersAI';
import { usePageContextSync } from '@/hooks/usePageContextSync';

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersPageInner />
    </Suspense>
  );
}

function CustomersPageInner() {
  usePageContextSync('customers');

  const t = useTranslations('customers');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // Onboarding wizard handoff: ?welcome=1 auto-opens the create modal
  // so the "let's create your first customer together" promise is kept.
  useEffect(() => {
    if (searchParams?.get('welcome') === '1') {
      setCreateOpen(true);
      router.replace(`/${locale}/customers`);
    }
  }, [searchParams, router, locale]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ai-customers', search],
    queryFn: () => customersAI.list({ search }),
  });

  const columns: AITableColumn<AICustomer>[] = [
    {
      key: 'name',
      header: t('name'),
      render: (c) => (
        <div>
          <div className="font-semibold text-foreground">{c.name}</div>
          {c.company && (
            <div className="text-xs text-muted-foreground">{c.company}</div>
          )}
        </div>
      ),
    },
    {
      key: 'segment',
      header: t('segment'),
      render: (c) => (
        <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-medium capitalize text-primaryDark">
          {c.segment}
        </span>
      ),
    },
    {
      key: 'ltv',
      header: t('ltv'),
      render: (c) => (
        <span className="font-semibold text-foreground">
          ${(c.ltv / 1000).toFixed(0)}k
        </span>
      ),
      sortable: true,
    },
    {
      key: 'lastContact',
      header: t('lastContact'),
      render: (c) => (
        <span
          className={
            c.lastContactDays > 30 ? 'text-amber-300' : 'text-muted-foreground'
          }
        >
          {c.lastContactDays}d
        </span>
      ),
    },
  ];

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">CUSTOMERS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {data?.totalCount ?? 0} {t('countSuffix')}
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
          data={data?.customers ?? []}
          columns={columns}
          entityType="customer"
          isLoading={isLoading}
          onRowClick={(c) => router.push(`/${locale}/customers/${c.id}`)}
        />

        {createOpen && (
          <CreateCustomerModal
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
