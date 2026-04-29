'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Brain, AlertCircle, ArrowRight } from 'lucide-react';
import { revenueBrain, type RevenueScenario } from '@/lib/ai/revenueBrain';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

interface Props {
  workspaceId: string;
}

export function AIRevenueBrainPanel({ workspaceId }: Props) {
  const t = useTranslations('ai.dashboard');

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-brain', workspaceId],
    queryFn: () => revenueBrain.getRevenueBrain(workspaceId),
  });

  if (isLoading || !data) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card" />;
  }

  return (
    <section
      id="revenue-brain"
      className="rounded-2xl border border-violet-500/30 bg-card p-6 shadow-md lg:p-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Brain size={13} />
            <span>{t('revenueBrain')}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-foreground">
            {t('revenueForecast')}
          </h2>
        </div>
        <AITrustBadge confidence={data.confidence} />
      </header>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">{t('monthlyTarget')}</span>
          <span className="text-2xl font-bold text-foreground">
            ${(data.monthlyActual / 1000).toFixed(0)}k
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / ${(data.monthlyTarget / 1000).toFixed(0)}k
            </span>
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all"
            style={{ width: `${Math.min(data.monthlyProgress, 100)}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs font-semibold text-primary">
          {data.monthlyProgress}%
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-foreground">
          {t('scenarios')}
        </h3>
        <div className="grid gap-3 lg:grid-cols-3">
          {data.scenarios.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <AlertCircle size={14} className="text-amber-500" />
          {t('revenueLeakage')}
        </h3>
        <div className="space-y-2">
          {data.leakage.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3"
            >
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {l.category}
                </div>
                <div className="text-xs text-muted-foreground">{l.reason}</div>
              </div>
              <div className="text-sm font-bold text-amber-300">
                -${(l.amount / 1000).toFixed(0)}k
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-foreground">
          {t('recommendedActions')}
        </h3>
        <div className="space-y-2">
          {data.recommendedActions.map((a, i) => (
            <button
              key={i}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:border-violet-500/30 hover:shadow-md"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {a.label}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs">
                  <span className="font-bold text-emerald-300">
                    +${(a.impact / 1000).toFixed(0)}k impact
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{a.confidence}% confidence</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-primary" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioCard({ scenario }: { scenario: RevenueScenario }) {
  const tone =
    scenario.id === 'conservative'
      ? 'border-border bg-card'
      : scenario.id === 'expected'
        ? 'border-violet-500/30 bg-violet-500/10'
        : 'border-emerald-500/30 bg-emerald-500/10';

  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {scenario.label}
      </div>
      <div className="mt-1 text-2xl font-bold text-foreground">
        ${(scenario.amount / 1000).toFixed(0)}k
      </div>
      <div className="mt-1 text-xs font-semibold text-primary">
        {scenario.probability}% likely
      </div>
      <ul className="mt-3 space-y-1">
        {scenario.drivers.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 text-xs text-muted-foreground"
          >
            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
