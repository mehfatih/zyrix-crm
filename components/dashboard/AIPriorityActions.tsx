'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  TrendingUp,
  Mail,
  Target,
  Heart,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { decisionEngine, type AIPriorityAction } from '@/lib/ai/decisionEngine';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import {
  PriorityImpactChart,
  type PriorityKind,
  type PriorityChartItem,
} from '@/components/dashboard/PriorityImpactChart';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────────────────
// Sprint 14q — Priority Actions redesign
// 5 kind-based identities with distinct accent colors, prominent rank
// badges, accent gradient backgrounds, and per-card impact bars.
// A small bar chart beside the section header shows per-rank impact.
// ────────────────────────────────────────────────────────────────────

// Map API priority types to visual kinds.
const TYPE_TO_KIND: Record<AIPriorityAction['type'], PriorityKind> = {
  risk: 'critical',
  opportunity: 'opportunity',
  followup: 'action',
  revenue: 'progress',
  retention: 'renewal',
};

const KIND_STYLES: Record<
  PriorityKind,
  {
    ring: string;
    bg: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    rankBg: string;
    rankText: string;
    barFrom: string;
    barTo: string;
    cta: string;
    Icon: LucideIcon;
  }
> = {
  critical: {
    ring: 'ring-1 ring-rose-500/30 hover:ring-rose-500/60',
    bg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent',
    iconBg: 'bg-rose-500/20',
    iconBorder: 'border-rose-500/40',
    iconText: 'text-rose-200',
    rankBg: 'bg-rose-500/20 border-rose-500/40',
    rankText: 'text-rose-200',
    barFrom: 'from-rose-500',
    barTo: 'to-rose-300',
    cta: 'text-rose-300 hover:text-rose-200',
    Icon: AlertTriangle,
  },
  action: {
    ring: 'ring-1 ring-amber-500/30 hover:ring-amber-500/60',
    bg: 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/20',
    iconBorder: 'border-amber-500/40',
    iconText: 'text-amber-200',
    rankBg: 'bg-amber-500/20 border-amber-500/40',
    rankText: 'text-amber-200',
    barFrom: 'from-amber-500',
    barTo: 'to-amber-300',
    cta: 'text-amber-300 hover:text-amber-200',
    Icon: Mail,
  },
  opportunity: {
    ring: 'ring-1 ring-emerald-500/30 hover:ring-emerald-500/60',
    bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/20',
    iconBorder: 'border-emerald-500/40',
    iconText: 'text-emerald-200',
    rankBg: 'bg-emerald-500/20 border-emerald-500/40',
    rankText: 'text-emerald-200',
    barFrom: 'from-emerald-500',
    barTo: 'to-emerald-300',
    cta: 'text-emerald-300 hover:text-emerald-200',
    Icon: TrendingUp,
  },
  progress: {
    ring: 'ring-1 ring-cyan-500/30 hover:ring-cyan-500/60',
    bg: 'bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-cyan-500/20',
    iconBorder: 'border-cyan-500/40',
    iconText: 'text-cyan-200',
    rankBg: 'bg-cyan-500/20 border-cyan-500/40',
    rankText: 'text-cyan-200',
    barFrom: 'from-cyan-500',
    barTo: 'to-cyan-300',
    cta: 'text-cyan-300 hover:text-cyan-200',
    Icon: Target,
  },
  renewal: {
    ring: 'ring-1 ring-violet-500/30 hover:ring-violet-500/60',
    bg: 'bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent',
    iconBg: 'bg-violet-500/20',
    iconBorder: 'border-violet-500/40',
    iconText: 'text-violet-200',
    rankBg: 'bg-violet-500/20 border-violet-500/40',
    rankText: 'text-violet-200',
    barFrom: 'from-violet-500',
    barTo: 'to-violet-300',
    cta: 'text-violet-300 hover:text-violet-200',
    Icon: Heart,
  },
};

// Derive an "impact" percentage from the action — confidence is the
// best proxy when the API doesn't supply an explicit impact field.
function impactFor(action: AIPriorityAction): number {
  // Top-ranked items skew higher impact; combine rank weight w/ confidence.
  const rankWeight = Math.max(0, 100 - (action.rank - 1) * 15);
  return Math.round((rankWeight * 0.4 + action.confidence * 0.6));
}

interface Props {
  workspaceId: string;
}

export function AIPriorityActions({ workspaceId }: Props) {
  const locale = useLocale() as 'en' | 'ar' | 'tr';
  const t = useTranslations('ai.dashboard');

  const { data, isLoading } = useQuery({
    queryKey: ['ai-priorities', workspaceId, locale],
    queryFn: () => decisionEngine.getPriorityActions({ workspaceId, locale }),
  });

  const actions = data ?? [];
  const chartItems: PriorityChartItem[] = actions.map((a) => ({
    rank: a.rank,
    kind: TYPE_TO_KIND[a.type],
    impactPercent: impactFor(a),
    title: a.title,
  }));

  return (
    <section id="priority-actions" className="space-y-4">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sky-300 text-xs font-bold uppercase tracking-widest mb-1">
            {t('priorityActions') ?? 'PRIORITY ACTIONS'}
          </p>
          <h2 className="text-foreground text-2xl font-bold leading-tight">
            {t('priorityActionsHeadline') ?? 'What needs your attention'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('priorityActionsSubtitle')}
          </p>
        </div>
        <PriorityImpactChart actions={chartItems} />
      </header>

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-card border border-border"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {actions.map((action, idx) => (
            <PriorityCard
              key={action.id}
              action={action}
              kind={TYPE_TO_KIND[action.type]}
              impactPercent={impactFor(action)}
              index={idx}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PriorityCard({
  action,
  kind,
  impactPercent,
  index,
}: {
  action: AIPriorityAction;
  kind: PriorityKind;
  impactPercent: number;
  index: number;
}) {
  const router = useRouter();
  const s = KIND_STYLES[kind];

  const handleClick = () => {
    if (action.cta.targetUrl) router.push(action.cta.targetUrl);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card transition-all duration-300 p-5 md:p-6',
        s.ring,
        s.bg,
      )}
    >
      <span
        className={cn(
          'absolute top-4 end-4 w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm tabular-nums',
          s.rankBg,
          s.rankText,
        )}
      >
        #{action.rank}
      </span>

      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center',
            s.iconBg,
            s.iconBorder,
          )}
        >
          <s.Icon className={cn('w-5 h-5', s.iconText)} />
        </div>
        <div className="flex-1 min-w-0 pe-12">
          <h3 className="text-foreground text-base md:text-lg font-bold leading-tight mb-1.5">
            {action.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {action.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <AITrustBadge
          confidence={action.confidence}
          reason={action.reason}
          signals={action.signals}
          recommendedAction={action.recommendedAction}
          size="sm"
        />
        <span className="text-muted-foreground text-xs uppercase tracking-wider tabular-nums">
          {impactPercent}% impact
        </span>
      </div>

      <div className="bg-background/60 border border-border h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r', s.barFrom, s.barTo)}
          style={{ width: `${Math.min(100, Math.max(0, impactPercent))}%` }}
        />
      </div>

      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-bold transition-colors',
          s.cta,
        )}
      >
        {action.cta.label}
        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </motion.article>
  );
}
