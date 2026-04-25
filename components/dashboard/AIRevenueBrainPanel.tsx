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
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />;
  }

  return (
    <section
      id="revenue-brain"
      className="rounded-2xl border border-zyrix-aiBorder bg-white p-6 shadow-zyrix-card lg:p-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
            <Brain size={13} />
            <span>{t('revenueBrain')}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-zyrix-textHeading">
            {t('revenueForecast')}
          </h2>
        </div>
        <AITrustBadge confidence={data.confidence} />
      </header>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-zyrix-textMuted">{t('monthlyTarget')}</span>
          <span className="text-2xl font-bold text-zyrix-textHeading">
            ${(data.monthlyActual / 1000).toFixed(0)}k
            <span className="ml-1 text-sm font-normal text-zyrix-textMuted">
              / ${(data.monthlyTarget / 1000).toFixed(0)}k
            </span>
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-zyrix-cardBgAlt">
          <div
            className="h-full rounded-full bg-zyrix-ai-gradient transition-all"
            style={{ width: `${Math.min(data.monthlyProgress, 100)}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs font-semibold text-zyrix-primary">
          {data.monthlyProgress}%
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-zyrix-textHeading">
          {t('scenarios')}
        </h3>
        <div className="grid gap-3 lg:grid-cols-3">
          {data.scenarios.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zyrix-textHeading">
          <AlertCircle size={14} className="text-amber-500" />
          {t('revenueLeakage')}
        </h3>
        <div className="space-y-2">
          {data.leakage.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 p-3"
            >
              <div>
                <div className="text-sm font-semibold text-zyrix-textHeading">
                  {l.category}
                </div>
                <div className="text-xs text-zyrix-textBody">{l.reason}</div>
              </div>
              <div className="text-sm font-bold text-amber-700">
                -${(l.amount / 1000).toFixed(0)}k
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-zyrix-textHeading">
          {t('recommendedActions')}
        </h3>
        <div className="space-y-2">
          {data.recommendedActions.map((a, i) => (
            <button
              key={i}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-zyrix-border bg-white p-3 text-left transition-shadow hover:border-zyrix-aiBorder hover:shadow-zyrix-card"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-zyrix-textHeading">
                  {a.label}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs">
                  <span className="font-bold text-emerald-600">
                    +${(a.impact / 1000).toFixed(0)}k impact
                  </span>
                  <span className="text-zyrix-textMuted">·</span>
                  <span className="text-zyrix-textMuted">{a.confidence}% confidence</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-zyrix-primary" />
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
      ? 'border-zyrix-border bg-white'
      : scenario.id === 'expected'
        ? 'border-zyrix-aiBorder bg-zyrix-aiSurface'
        : 'border-emerald-200 bg-emerald-50/40';

  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
        {scenario.label}
      </div>
      <div className="mt-1 text-2xl font-bold text-zyrix-textHeading">
        ${(scenario.amount / 1000).toFixed(0)}k
      </div>
      <div className="mt-1 text-xs font-semibold text-zyrix-primary">
        {scenario.probability}% likely
      </div>
      <ul className="mt-3 space-y-1">
        {scenario.drivers.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 text-xs text-zyrix-textBody"
          >
            <span className="mt-1.5 h-1 w-1 rounded-full bg-zyrix-primary" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
