'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { decisionEngine } from '@/lib/ai/decisionEngine';
import { AITrustBadge } from '@/components/ai/AITrustBadge';
import { useAIStore } from '@/lib/stores/aiStore';

interface Props {
  workspaceId: string;
  userName?: string;
}

export function AIExecutiveSummary({ workspaceId, userName }: Props) {
  const locale = useLocale() as 'en' | 'ar' | 'tr';
  const t = useTranslations('ai.dashboard');
  const openAI = useAIStore((s) => s.open);

  const { data, isLoading } = useQuery({
    queryKey: ['ai-summary', workspaceId, locale],
    queryFn: () => decisionEngine.getExecutiveSummary({ workspaceId, userName, locale }),
  });

  if (isLoading || !data) {
    return <SummarySkeleton />;
  }

  const handleAction = (action: string) => {
    if (action === 'open-ai-panel') openAI();
    else if (action === 'scroll-priorities') {
      document.getElementById('priority-actions')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'scroll-revenue') {
      document.getElementById('revenue-brain')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zyrix-aiSurface via-white to-zyrix-aiSurface p-6 shadow-zyrix-ai-glow lg:p-8"
    >
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles size={13} />
          <span>{t('executiveSummary')}</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {data.greeting}
        </h1>

        <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg">
          {data.oneLineNarrative}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            icon={<Target size={14} />}
            label={t('topPriorities')}
            value={data.topPriorities.toString()}
          />
          <Stat
            icon={<AlertTriangle size={14} />}
            label={t('revenueAtRisk')}
            value={`$${(data.revenueAtRisk / 1000).toFixed(0)}k`}
            tone="warning"
          />
          <Stat
            icon={<TrendingUp size={14} />}
            label={t('opportunities')}
            value={data.opportunities.toString()}
            tone="success"
          />
          <div className="rounded-xl border border-violet-500/30 bg-card p-3">
            <AITrustBadge confidence={data.confidence} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {data.cta.map((c, i) => (
            <button
              key={i}
              onClick={() => handleAction(c.action)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-shadow ${
                i === 0
                  ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-md hover:shadow-md-hover'
                  : 'border border-violet-500/30 bg-card text-primaryDark hover:bg-violet-500/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  icon,
  label,
  value,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const colors = {
    default: 'text-primary',
    success: 'text-emerald-300',
    warning: 'text-amber-300',
  };
  return (
    <div className="rounded-xl border border-violet-500/30 bg-card p-3">
      <div
        className={`mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${colors[tone]}`}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-5 w-full animate-pulse rounded bg-muted" />
      <div className="mt-5 grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
