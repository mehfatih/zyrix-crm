'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';

interface AITrustBadgeProps {
  confidence: number;
  reason?: string;
  signals?: string[];
  recommendedAction?: string;
  size?: 'sm' | 'md';
}

export function AITrustBadge({
  confidence,
  reason,
  signals,
  recommendedAction,
  size = 'md',
}: AITrustBadgeProps) {
  const t = useTranslations('ai.trustBadge');
  const [open, setOpen] = useState(false);

  const tone =
    confidence >= 80
      ? { bg: 'bg-emerald-50', text: 'text-emerald-300', dot: 'bg-emerald-500' }
      : confidence >= 60
      ? { bg: 'bg-sky-50', text: 'text-cyan-300', dot: 'bg-sky-500' }
      : { bg: 'bg-amber-50', text: 'text-amber-300', dot: 'bg-amber-500' };

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding} ${tone.bg} ${tone.text} hover:shadow-md transition-shadow`}
      >
        <Sparkles size={size === 'sm' ? 11 : 13} />
        <span>
          {t('label')} · {confidence}%
        </span>
        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-80 rounded-xl border border-violet-500/30 bg-card p-4 shadow-zyrix-ai-glow"
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primaryDark">
                <Info size={12} />
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
                    {signals.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendedAction && (
                <div className="rounded-lg bg-violet-500/10 p-2.5 text-xs font-medium text-primaryDark">
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
