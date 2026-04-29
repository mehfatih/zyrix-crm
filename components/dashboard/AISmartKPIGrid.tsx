'use client';

import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Users,
  DollarSign,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────────────────
// Sprint 14q — Executive KPI grid with per-card identity + sparkline
// 4 KPIs (Revenue / Customers / Pipeline / Activity), each with its
// own gradient, icon tint, value color, sparkline color, and AI pill.
// ────────────────────────────────────────────────────────────────────

type Variant = 'revenue' | 'customers' | 'pipeline' | 'activity';

interface SmartKPI {
  id: string;
  variant: Variant;
  label: string;
  value: string;
  change: number;
  context: string;
  Icon: LucideIcon;
  spark: number[];
  confidence: number;
}

const VARIANT_STYLES: Record<
  Variant,
  {
    ring: string;
    bg: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    valueColor: string;
    sparkColor: string;
  }
> = {
  revenue: {
    ring: 'ring-1 ring-emerald-500/30 hover:ring-emerald-500/50',
    bg: 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-card',
    iconBg: 'bg-emerald-500/20',
    iconBorder: 'border-emerald-500/40',
    iconText: 'text-emerald-200',
    valueColor: 'text-emerald-100',
    sparkColor: '#34d399',
  },
  customers: {
    ring: 'ring-1 ring-violet-500/30 hover:ring-violet-500/50',
    bg: 'bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-card',
    iconBg: 'bg-violet-500/20',
    iconBorder: 'border-violet-500/40',
    iconText: 'text-violet-200',
    valueColor: 'text-violet-100',
    sparkColor: '#a78bfa',
  },
  pipeline: {
    ring: 'ring-1 ring-cyan-500/30 hover:ring-cyan-500/50',
    bg: 'bg-gradient-to-br from-cyan-500/15 via-cyan-500/5 to-card',
    iconBg: 'bg-cyan-500/20',
    iconBorder: 'border-cyan-500/40',
    iconText: 'text-cyan-200',
    valueColor: 'text-cyan-100',
    sparkColor: '#22d3ee',
  },
  activity: {
    ring: 'ring-1 ring-amber-500/30 hover:ring-amber-500/50',
    bg: 'bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card',
    iconBg: 'bg-amber-500/20',
    iconBorder: 'border-amber-500/40',
    iconText: 'text-amber-200',
    valueColor: 'text-amber-100',
    sparkColor: '#fbbf24',
  },
};

const TREND_BADGE = {
  up: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  down: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
  flat: 'bg-slate-500/20 text-slate-200 border-slate-500/40',
};

export function AISmartKPIGrid() {
  const t = useTranslations('ai.dashboard');

  // Demo data — replace with API call when backend is wired.
  const kpis: SmartKPI[] = [
    {
      id: 'revenue',
      variant: 'revenue',
      label: t('kpi.revenue'),
      value: '$388k',
      change: 12,
      context: 'On track to exceed last month by 12%',
      Icon: DollarSign,
      spark: [320, 340, 335, 360, 355, 372, 388],
      confidence: 86,
    },
    {
      id: 'customers',
      variant: 'customers',
      label: t('kpi.customers'),
      value: '247',
      change: 4.2,
      context: '8 new this week, 1 churned',
      Icon: Users,
      spark: [232, 235, 239, 242, 244, 245, 247],
      confidence: 92,
    },
    {
      id: 'pipeline',
      variant: 'pipeline',
      label: t('kpi.pipeline'),
      value: '$1.2M',
      change: -3,
      context: '$86k at risk in proposal stage',
      Icon: Target,
      spark: [1.10, 1.13, 1.15, 1.17, 1.19, 1.20, 1.20],
      confidence: 78,
    },
    {
      id: 'activity',
      variant: 'activity',
      label: t('kpi.activity'),
      value: '94%',
      change: 0,
      context: 'WhatsApp drives 2x replies vs email',
      Icon: Activity,
      spark: [88, 90, 91, 92, 93, 94, 94],
      confidence: 88,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}

function KPICard({ kpi }: { kpi: SmartKPI }) {
  const s = VARIANT_STYLES[kpi.variant];
  const trendKey = kpi.change > 0 ? 'up' : kpi.change < 0 ? 'down' : 'flat';
  const TrendIcon =
    kpi.change > 0 ? TrendingUp : kpi.change < 0 ? TrendingDown : Minus;
  const trendLabel = `${kpi.change > 0 ? '+' : ''}${kpi.change}%`;
  const sparkData = kpi.spark.map((y, x) => ({ x, y }));

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all duration-300 p-5 min-h-[180px] flex flex-col',
        s.ring,
        s.bg,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0',
            s.iconBg,
            s.iconBorder,
          )}
        >
          <kpi.Icon className={cn('w-5 h-5', s.iconText)} />
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold',
            TREND_BADGE[trendKey],
          )}
        >
          <TrendIcon className="w-3 h-3" />
          {trendLabel}
        </span>
      </div>

      <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
        {kpi.label}
      </p>
      <p className={cn('text-3xl font-bold tabular-nums mb-1', s.valueColor)}>
        {kpi.value}
      </p>
      <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-snug">
        {kpi.context}
      </p>

      <div className="h-10 -mx-1 mb-3 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '11px',
                padding: '4px 8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(((v: number) => [v, '']) as never)}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke={s.sparkColor}
              strokeWidth={2}
              dot={false}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AITrustBadge confidence={kpi.confidence} size="sm" />
    </article>
  );
}
