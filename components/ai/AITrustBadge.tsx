'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────────────────
// AITrustBadge (Sprint 14q rework)
// Tier-tinted on dark — never light backgrounds, never low-contrast.
// Color tier reflects confidence:
//   ≥90  → violet  (premium / high-trust)
//   ≥80  → emerald (high)
//   ≥60  → cyan    (medium)
//   <60  → amber   (low / caution)
// Bigger default font (text-sm), bolder (font-bold), brighter text (-200)
// for legibility on dark surfaces.
// ────────────────────────────────────────────────────────────────────

interface AITrustBadgeProps {
  confidence: number; // 0-100
  reason?: string;
  signals?: string[];
  recommendedAction?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

type Tier = 'violet' | 'emerald' | 'cyan' | 'amber';

const TIER_CLASSES: Record<
  Tier,
  { bg: string; border: string; text: string; dot: string; pop: string }
> = {
  violet: {
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/40',
    text: 'text-violet-200',
    dot: 'bg-violet-300',
    pop: 'border-violet-500/40',
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-200',
    dot: 'bg-emerald-300',
    pop: 'border-emerald-500/40',
  },
  cyan: {
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/40',
    text: 'text-cyan-200',
    dot: 'bg-cyan-300',
    pop: 'border-cyan-500/40',
  },
  amber: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-200',
    dot: 'bg-amber-300',
    pop: 'border-amber-500/40',
  },
};

const SIZE_CLASSES: Record<
  'sm' | 'md' | 'lg',
  { wrapper: string; icon: string; sparkle: number; dot: string }
> = {
  sm: { wrapper: 'px-2 py-0.5 text-xs gap-1.5', icon: 'w-3 h-3', sparkle: 11, dot: 'w-1 h-1' },
  md: { wrapper: 'px-2.5 py-1 text-sm gap-2', icon: 'w-3.5 h-3.5', sparkle: 13, dot: 'w-1.5 h-1.5' },
  lg: { wrapper: 'px-3 py-1.5 text-base gap-2', icon: 'w-4 h-4', sparkle: 15, dot: 'w-1.5 h-1.5' },
};

function tierFor(value: number): Tier {
  if (value >= 90) return 'violet';
  if (value >= 80) return 'emerald';
  if (value >= 60) return 'cyan';
  return 'amber';
}

export function AITrustBadge({
  confidence,
  reason,
  signals,
  recommendedAction,
  size = 'md',
  className,
}: AITrustBadgeProps) {
  const t = useTranslations('ai.trustBadge');
  const [open, setOpen] = useState(false);
  const tier = TIER_CLASSES[tierFor(confidence)];
  const s = SIZE_CLASSES[size];

  const hasPopover = !!reason || !!(signals && signals.length) || !!recommendedAction;

  const pillContent = (
    <>
      <Sparkles size={s.sparkle} aria-hidden />
      <span>{t('label')}</span>
      <span className={cn('inline-block rounded-full', s.dot, tier.dot)} aria-hidden />
      <span className="tabular-nums">{confidence}%</span>
    </>
  );

  const pillClass = cn(
    'inline-flex items-center rounded-full border font-bold transition-shadow',
    tier.bg,
    tier.border,
    tier.text,
    s.wrapper,
    hasPopover && 'hover:shadow-md cursor-pointer',
    className,
  );

  if (!hasPopover) {
    return <span className={pillClass}>{pillContent}</span>;
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={pillClass}
        aria-expanded={open}
      >
        {pillContent}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-50 mt-2 w-80 rounded-xl border bg-card p-4 shadow-lg',
                tier.pop,
              )}
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground">
                <Info size={12} className={tier.text} />
                <span>{t('whyTitle')}</span>
              </div>

              {reason && (
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {reason}
                </p>
              )}

              {signals && signals.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('signals')}
                  </div>
                  <ul className="space-y-1">
                    {signals.map((sig, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span
                          className={cn(
                            'mt-1.5 h-1 w-1 rounded-full',
                            tier.dot,
                          )}
                        />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendedAction && (
                <div
                  className={cn(
                    'rounded-lg border p-2.5 text-xs font-medium',
                    tier.bg,
                    tier.border,
                    tier.text,
                  )}
                >
                  → {recommendedAction}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
