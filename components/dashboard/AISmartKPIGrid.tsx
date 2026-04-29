'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Target } from 'lucide-react';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

interface SmartKPI {
  id: string;
  label: string;
  value: string;
  change: number;
  context: string;
  trend: 'up' | 'down' | 'flat';
  icon: 'revenue' | 'customers' | 'pipeline' | 'activity';
  confidence: number;
}

const ICON_MAP = {
  revenue: DollarSign,
  customers: Users,
  pipeline: Target,
  activity: Activity,
};

export function AISmartKPIGrid() {
  const t = useTranslations('ai.dashboard');

  // Demo data — replace with API call when backend is wired.
  // Per spec section 5: NEVER show raw numbers. Always include AI context.
  const kpis: SmartKPI[] = [
    {
      id: 'revenue',
      label: t('kpi.revenue'),
      value: '$388k',
      change: 12,
      context: 'On track to exceed last month by 12%',
      trend: 'up',
      icon: 'revenue',
      confidence: 86,
    },
    {
      id: 'customers',
      label: t('kpi.customers'),
      value: '247',
      change: 4.2,
      context: '8 new this week, 1 churned',
      trend: 'up',
      icon: 'customers',
      confidence: 92,
    },
    {
      id: 'pipeline',
      label: t('kpi.pipeline'),
      value: '$1.2M',
      change: -3,
      context: '$86k at risk in proposal stage',
      trend: 'down',
      icon: 'pipeline',
      confidence: 78,
    },
    {
      id: 'activity',
      label: t('kpi.activity'),
      value: '94%',
      change: 0,
      context: 'WhatsApp drives 2x replies vs email',
      trend: 'flat',
      icon: 'activity',
      confidence: 88,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}

function KPICard({ kpi }: { kpi: SmartKPI }) {
  const Icon = ICON_MAP[kpi.icon];
  const TrendIcon =
    kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Activity;
  const trendColor =
    kpi.trend === 'up'
      ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
      : kpi.trend === 'down'
        ? 'text-rose-300 bg-rose-500/15 border border-rose-500/30'
        : 'text-muted-foreground bg-muted border border-border';

  return (
    <article className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300">
          <Icon size={16} />
        </div>
        <div
          className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${trendColor}`}
        >
          <TrendIcon size={11} />
          <span>
            {kpi.change > 0 ? '+' : ''}
            {kpi.change}%
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs font-medium text-muted-foreground">{kpi.label}</div>
        <div className="mt-0.5 text-2xl font-bold text-foreground">{kpi.value}</div>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {kpi.context}
      </p>

      <div className="mt-3">
        <AITrustBadge confidence={kpi.confidence} size="sm" />
      </div>
    </article>
  );
}
