'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Brain, AlertCircle, ArrowRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { revenueBrain, type RevenueScenario } from '@/lib/ai/revenueBrain';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import {
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
} from '@/lib/chart-styles';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────────────────
// Sprint 14q — Revenue Brain panel
// Adds an inline AreaChart for cumulative monthly target progress.
// 3 scenarios now visually distinct: Conservative (rose) / Expected
// (violet, featured) / Optimistic (emerald).
// ────────────────────────────────────────────────────────────────────

interface Props {
  workspaceId: string;
}

// Synthesize a daily cumulative progress series from the actual monthly
// progress percent — backend will eventually supply this directly.
function synthesizeProgressSeries(
  monthlyActual: number,
  monthlyProgress: number,
): { day: number; value: number }[] {
  // 6 evenly-spaced waypoints from day 1 → day 30. Final value is the
  // current actual; intermediate values are linearly interpolated.
  const days = [1, 5, 10, 15, 20, 25, 30];
  const final = monthlyActual / 1000;
  // If progress < 100%, simulate the remaining days having no growth yet.
  const reachedDay = Math.max(
    1,
    Math.min(30, Math.round((monthlyProgress / 100) * 30)),
  );
  return days.map((d) => {
    if (d > reachedDay) return { day: d, value: final };
    return { day: d, value: Math.round((d / reachedDay) * final) };
  });
}

export function AIRevenueBrainPanel({ workspaceId }: Props) {
  const t = useTranslations('ai.dashboard');

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-brain', workspaceId],
    queryFn: () => revenueBrain.getRevenueBrain(workspaceId),
  });

  if (isLoading || !data) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  }

  const series = synthesizeProgressSeries(data.monthlyActual, data.monthlyProgress);
  const remainingDays = Math.max(0, 30 - Math.round((data.monthlyProgress / 100) * 30));

  return (
    <section
      id="revenue-brain"
      className="rounded-2xl border border-violet-500/30 bg-card p-6 shadow-md lg:p-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-violet-300">
            <Brain size={13} />
            <span>{t('revenueBrain')}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-foreground">
            {t('revenueForecast')}
          </h2>
        </div>
        <AITrustBadge confidence={data.confidence} />
      </header>

      {/* Monthly target progress with inline AreaChart */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-card border border-violet-500/20 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
            {t('monthlyTarget')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-violet-100 text-2xl font-bold tabular-nums">
              ${(data.monthlyActual / 1000).toFixed(0)}k
            </span>
            <span className="text-muted-foreground text-sm">
              / ${(data.monthlyTarget / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="h-16 -mx-2 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
            >
              <defs>
                <linearGradient id="brainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(((v: number) => [`$${v}k`, 'Cumulative']) as never)}
                labelFormatter={(l) => `Day ${l}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#brainGrad)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-violet-300 text-xs font-bold tabular-nums">
            {data.monthlyProgress}%
          </span>
          <span className="text-muted-foreground text-xs">
            {remainingDays} days remaining
          </span>
        </div>
      </div>

      {/* Scenarios — distinct visual identity */}
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

      {/* Revenue leakage */}
      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <AlertCircle size={14} className="text-amber-300" />
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
              <div className="text-sm font-bold text-amber-300 tabular-nums">
                -${(l.amount / 1000).toFixed(0)}k
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended actions */}
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
                  <span className="font-bold text-emerald-300 tabular-nums">
                    +${(a.impact / 1000).toFixed(0)}k impact
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground tabular-nums">
                    {a.confidence}% confidence
                  </span>
                </div>
              </div>
              <ArrowRight size={16} className="text-violet-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// ScenarioCard — Conservative (rose) / Expected (violet, featured)
// / Optimistic (emerald). Distinct ring, gradient, value color, and
// label tint per scenario id.
// ──────────────────────────────────────────────────────────────────
type ScenarioAccent = 'rose' | 'violet' | 'emerald';

const SCENARIO_STYLES: Record<
  ScenarioAccent,
  { ring: string; bg: string; value: string; label: string; bullet: string }
> = {
  rose: {
    ring: 'ring-1 ring-rose-500/30',
    bg: 'bg-gradient-to-b from-rose-500/10 to-card',
    value: 'text-rose-100',
    label: 'text-rose-300',
    bullet: 'bg-rose-300',
  },
  violet: {
    ring: 'ring-2 ring-violet-500/40',
    bg: 'bg-gradient-to-b from-violet-500/15 to-card',
    value: 'text-violet-100',
    label: 'text-violet-300',
    bullet: 'bg-violet-300',
  },
  emerald: {
    ring: 'ring-1 ring-emerald-500/30',
    bg: 'bg-gradient-to-b from-emerald-500/10 to-card',
    value: 'text-emerald-100',
    label: 'text-emerald-300',
    bullet: 'bg-emerald-300',
  },
};

function accentForScenario(id: string): ScenarioAccent {
  if (id === 'conservative') return 'rose';
  if (id === 'optimistic') return 'emerald';
  return 'violet';
}

function ScenarioCard({ scenario }: { scenario: RevenueScenario }) {
  const accent = accentForScenario(scenario.id);
  const s = SCENARIO_STYLES[accent];

  return (
    <div className={cn('rounded-xl p-4', s.ring, s.bg)}>
      <div
        className={cn(
          'text-[11px] font-bold uppercase tracking-wider',
          s.label,
        )}
      >
        {scenario.label}
      </div>
      <div className={cn('mt-1 text-2xl font-bold tabular-nums', s.value)}>
        ${(scenario.amount / 1000).toFixed(0)}k
      </div>
      <div className={cn('mt-1 text-xs font-bold tabular-nums', s.label)}>
        {scenario.probability}% likely
      </div>
      <ul className="mt-3 space-y-1">
        {scenario.drivers.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className={cn('mt-1.5 h-1 w-1 rounded-full', s.bullet)}
              aria-hidden
            />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
