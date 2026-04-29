'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { decisionEngine, type AIPriorityAction } from '@/lib/ai/decisionEngine';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

const ICON_MAP = {
  risk: AlertTriangle,
  opportunity: TrendingUp,
  followup: MessageSquare,
  revenue: DollarSign,
  retention: Heart,
};

const TONE_MAP = {
  risk: { border: 'border-rose-500/30', bg: 'bg-red-50', text: 'text-rose-300' },
  opportunity: { border: 'border-emerald-500/30', bg: 'bg-emerald-50', text: 'text-emerald-300' },
  followup: { border: 'border-border', bg: 'bg-sky-50', text: 'text-cyan-300' },
  revenue: { border: 'border-amber-500/30', bg: 'bg-amber-50', text: 'text-amber-300' },
  retention: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-700' },
};

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

  return (
    <section id="priority-actions" className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {t('priorityActions')}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t('priorityActionsSubtitle')}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {data?.map((action, idx) => (
            <PriorityCard key={action.id} action={action} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
}

function PriorityCard({ action, index }: { action: AIPriorityAction; index: number }) {
  const router = useRouter();
  const Icon = ICON_MAP[action.type];
  const tone = TONE_MAP[action.type];

  const handleClick = () => {
    if (action.cta.targetUrl) router.push(action.cta.targetUrl);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md-hover"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground">{action.title}</h3>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.bg} ${tone.text}`}
            >
              #{action.rank}
            </span>
          </div>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {action.description}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <AITrustBadge
              confidence={action.confidence}
              reason={action.reason}
              signals={action.signals}
              recommendedAction={action.recommendedAction}
              size="sm"
            />
            <button
              onClick={handleClick}
              className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-primaryDark hover:bg-zyrix-borderSky"
            >
              {action.cta.label} →
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
