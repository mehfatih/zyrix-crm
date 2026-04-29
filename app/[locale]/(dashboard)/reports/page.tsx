'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Download, Sparkles } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import { ReportTabs, type ReportTabId } from '@/components/reports/ReportTabs';
import { KeyInsights } from '@/components/reports/KeyInsights';
import { VisualAnalysis } from '@/components/reports/VisualAnalysis';
import { reportsAI, type ReportType } from '@/lib/ai/reportsAI';
import { usePageContextSync } from '@/hooks/usePageContextSync';

// ────────────────────────────────────────────────────────────────────
// Sprint 14u — Reports BI overhaul
// Tabs are now customizable (4 default + 9 addable) and persist in
// localStorage. Each tab still calls the existing reportsAI service for
// the AI narrative; Key Insights + Visual Analysis are static demo data
// for now (varied chart types per the spec).
// ────────────────────────────────────────────────────────────────────

// Map our customizable tab IDs back onto the backend's ReportType enum.
// Tabs that don't have a backend report type fall back to the closest
// match so the AI narrative still renders.
const TAB_TO_REPORT_TYPE: Record<ReportTabId, ReportType> = {
  sales: 'sales',
  pipeline: 'pipeline',
  customers: 'customers',
  revenue: 'revenue',
  // Extras — map to the most semantically-related backend report.
  deals: 'pipeline',
  team: 'sales',
  activity: 'sales',
  leakage: 'revenue',
  products: 'revenue',
  channels: 'sales',
  geography: 'customers',
  cohorts: 'customers',
  tax: 'revenue',
};

export default function ReportsPage() {
  usePageContextSync('reports');

  const t = useTranslations('ai.reports');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const [activeTab, setActiveTab] = useState<ReportTabId>('sales');

  const reportType = TAB_TO_REPORT_TYPE[activeTab];
  const { data, isLoading } = useQuery({
    queryKey: ['ai-report', reportType],
    queryFn: () => reportsAI.getReport(reportType),
  });

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sky-300 text-xs font-bold uppercase tracking-widest mb-2">
              REPORTS
            </p>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-colors">
            <Download size={14} />
            {t('export')}
          </button>
        </header>

        {/* Customizable tabs (4 default + addable extras) */}
        <ReportTabs active={activeTab} onSelect={setActiveTab} />

        {isLoading || !data ? (
          <div className="h-32 animate-pulse rounded-2xl bg-card border border-border" />
        ) : (
          <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-card p-6 lg:p-8">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-violet-300">
              <Sparkles size={13} />
              <span>{t('aiNarrative')}</span>
            </div>
            <p className="max-w-4xl text-base leading-relaxed text-foreground lg:text-lg">
              {data.narrative}
            </p>
            <div className="mt-4">
              <AITrustBadge confidence={data.confidence} />
            </div>
          </section>
        )}

        {/* Key Insights — 3 distinct cards with mini charts */}
        <section className="space-y-3">
          <h2 className="text-foreground text-sm font-bold">
            {t('keyInsights')}
          </h2>
          <KeyInsights />
        </section>

        {/* Visual Analysis — 4 different chart types */}
        <VisualAnalysis />
      </div>
    </DashboardShell>
  );
}
