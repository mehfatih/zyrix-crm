'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Download, Sparkles } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import {
  reportsAI,
  type ReportType,
  type AIReportChart,
} from '@/lib/ai/reportsAI';
import { usePageContextSync } from '@/hooks/usePageContextSync';

const REPORT_TYPES: ReportType[] = ['sales', 'pipeline', 'customers', 'revenue'];

export default function ReportsPage() {
  usePageContextSync('reports');

  const t = useTranslations('ai.reports');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const [type, setType] = useState<ReportType>('sales');

  const { data, isLoading } = useQuery({
    queryKey: ['ai-report', type],
    queryFn: () => reportsAI.getReport(type),
  });

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sky-300 text-xs font-bold uppercase tracking-widest mb-2">REPORTS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:shadow-md-hover">
            <Download size={14} />
            {t('export')}
          </button>
        </header>

        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt}
              onClick={() => setType(rt)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                type === rt
                  ? 'bg-primary text-white'
                  : 'border border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {t(`types.${rt}`)}
            </button>
          ))}
        </div>

        {isLoading || !data ? (
          <div className="h-96 animate-pulse rounded-2xl bg-card" />
        ) : (
          <>
            <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zyrix-aiSurface via-white to-zyrix-aiSurface p-6 shadow-zyrix-ai-glow lg:p-8">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
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

            <section>
              <h2 className="mb-3 text-sm font-bold text-foreground">
                {t('keyInsights')}
              </h2>
              <div className="grid gap-3 lg:grid-cols-3">
                {data.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <h3 className="text-sm font-bold text-foreground">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-foreground">
                {t('visualAnalysis')}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {data.charts.map((chart) => (
                  <ChartCard key={chart.id} chart={chart} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

function ChartCard({ chart }: { chart: AIReportChart }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold text-foreground">{chart.title}</h3>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          {chart.kind === 'bar' ? (
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BAE6FD',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BAE6FD',
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ fill: '#0EA5E9', r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 rounded-lg border-l-[3px] border-primary bg-violet-500/10 p-3">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles size={11} />
          <span>AI Interpretation</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {chart.aiInterpretation}
        </p>
        <div className="mt-2">
          <AITrustBadge confidence={chart.confidence} size="sm" />
        </div>
      </div>
    </article>
  );
}
