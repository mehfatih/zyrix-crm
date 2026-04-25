'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { dealTimeline, type TimelineEvent } from '@/lib/ai/dealTimeline';
import { type AIDeal } from '@/lib/ai/dealsAI';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

interface Props {
  deal: AIDeal | null;
  onClose: () => void;
}

export function AIDealTimelineDrawer({ deal, onClose }: Props) {
  const t = useTranslations('ai.dealTimeline');

  const { data } = useQuery({
    queryKey: ['deal-timeline', deal?.id],
    queryFn: () => (deal ? dealTimeline.getTimeline(deal.id) : null),
    enabled: !!deal,
  });

  return (
    <AnimatePresence>
      {deal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zyrix-textHeading/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl"
          >
            <header className="border-b border-zyrix-border px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
                    {t('label')}
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-zyrix-textHeading">
                    {deal.name}
                  </h2>
                  <p className="mt-1 text-sm text-zyrix-textMuted">
                    {deal.customerName} · ${deal.value.toLocaleString()} ·{' '}
                    {deal.probability}% {t('likely')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zyrix-textMuted hover:bg-zyrix-cardBgAlt"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <ScoreCell
                  label={t('aiScore')}
                  value={deal.aiScore.toString()}
                  tone="primary"
                />
                <ScoreCell
                  label={t('risk')}
                  value={deal.riskLevel.toUpperCase()}
                  tone={
                    deal.riskLevel === 'high'
                      ? 'danger'
                      : deal.riskLevel === 'medium'
                      ? 'warning'
                      : 'success'
                  }
                />
                <ScoreCell label={t('stage')} value={deal.stage} tone="primary" />
              </div>
            </header>

            <div className="px-6 py-5">
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
                {t('activityTimeline')}
              </h3>

              <div className="space-y-1">
                {data?.events.map((event) => (
                  <TimelineItem key={event.id} event={event} />
                ))}
              </div>
            </div>

            {data?.recoveryPlan && (
              <div className="mx-6 mb-6 rounded-xl border border-zyrix-aiBorder bg-zyrix-aiSurface p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
                  <Sparkles size={12} />
                  <span>{t('recoveryPlan')}</span>
                </div>
                <p className="text-sm leading-relaxed text-zyrix-textBody">
                  {data.recoveryPlan}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-lg bg-zyrix-ai-gradient px-3 py-1.5 text-xs font-bold text-white shadow-zyrix-card hover:shadow-zyrix-card-hover">
                    {t('generateFollowup')}
                  </button>
                  <button className="rounded-lg border border-zyrix-aiBorder bg-white px-3 py-1.5 text-xs font-bold text-zyrix-primaryDark hover:bg-zyrix-aiSurface">
                    {t('createTask')}
                  </button>
                  <button className="rounded-lg border border-zyrix-border bg-white px-3 py-1.5 text-xs font-medium text-zyrix-textMuted hover:bg-zyrix-cardBgAlt">
                    {t('escalate')}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ScoreCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const colors = {
    primary: 'text-zyrix-primary',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  };
  return (
    <div className="rounded-lg bg-zyrix-cardBgAlt p-2.5 text-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-zyrix-textMuted">
        {label}
      </div>
      <div className={`mt-0.5 text-base font-bold capitalize ${colors[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  const Icon =
    event.type === 'risk'
      ? AlertCircle
      : event.type === 'warning'
      ? AlertCircle
      : CheckCircle2;
  const dotColor =
    event.type === 'risk'
      ? 'text-red-500'
      : event.type === 'warning'
      ? 'text-amber-500'
      : 'text-emerald-500';

  return (
    <div className="relative flex gap-3 pb-4">
      <div className="flex flex-col items-center">
        <Icon size={18} className={dotColor} />
        <div className="mt-1 w-px flex-1 bg-zyrix-border" />
      </div>

      <div className="flex-1 pb-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
          Day {event.day} · {event.date}
        </div>
        <div
          className={`mt-0.5 text-sm font-semibold ${
            event.type === 'risk' ? 'text-red-700' : 'text-zyrix-textHeading'
          }`}
        >
          {event.label}
        </div>

        {event.aiNote && (
          <div className="mt-2 rounded-lg border-l-[3px] border-zyrix-primary bg-zyrix-aiSurface p-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
              ✨ AI
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zyrix-textBody">
              {event.aiNote.insight}
            </p>
            <div className="mt-2">
              <AITrustBadge
                confidence={event.aiNote.confidence}
                signals={event.aiNote.signals}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
