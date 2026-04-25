'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, Lightbulb, History } from 'lucide-react';
import { useAIStore } from '@/lib/stores/aiStore';

export function AISidePanel() {
  const { isOpen, close, context, selectedEntityId, selectedEntityType } = useAIStore();
  const t = useTranslations('ai.sidePanel');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zyrix-textHeading/30 backdrop-blur-sm lg:hidden"
            onClick={close}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl border-l border-zyrix-border flex flex-col"
          >
            <header className="flex items-center justify-between border-b border-zyrix-border bg-gradient-to-br from-zyrix-aiSurface to-white px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zyrix-ai-gradient">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
                    {t('aiAssistant')}
                  </div>
                  <div className="text-sm font-semibold text-zyrix-textHeading capitalize">
                    {context}
                  </div>
                </div>
              </div>
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-zyrix-textMuted hover:bg-zyrix-cardBgAlt hover:text-zyrix-textBody"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                <ContextSection
                  icon={<Lightbulb size={14} />}
                  title={t('whatYouAreSeeing')}
                  body={getContextDescription(context)}
                />

                <ContextSection
                  icon={<Sparkles size={14} />}
                  title={t('whatAINotices')}
                  body={t('placeholder.notices')}
                />

                <ContextSection
                  icon={<History size={14} />}
                  title={t('recentChanges')}
                  body={t('placeholder.changes')}
                />

                <ContextSection
                  icon={<MessageSquare size={14} />}
                  title={t('askAI')}
                  body={t('placeholder.ask')}
                  cta={t('openChat')}
                />
              </div>

              {selectedEntityId && (
                <div className="mt-4 rounded-xl border border-zyrix-aiBorder bg-zyrix-aiSurface p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
                    {t('selectedEntity')}
                  </div>
                  <div className="mt-1 text-sm text-zyrix-textBody">
                    {selectedEntityType}: {selectedEntityId}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ContextSection({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: string;
}) {
  return (
    <section className="rounded-xl border border-zyrix-border bg-white p-4 hover:shadow-zyrix-card transition-shadow">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zyrix-primary">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm leading-relaxed text-zyrix-textBody">{body}</p>
      {cta && (
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-zyrix-ai-gradient px-3 py-1.5 text-xs font-bold text-white hover:opacity-90">
          {cta}
        </button>
      )}
    </section>
  );
}

function getContextDescription(context: string): string {
  const map: Record<string, string> = {
    dashboard: 'AI executive summary, priority actions, and revenue brain',
    customers: 'AI-scored customer table with bulk AI actions',
    deals: 'AI-scored deals with risk and recovery plans',
    pipeline: 'Stage health, bottlenecks, and stuck deals',
    reports: 'AI narrative and interpreted charts',
    messaging: 'AI message drafting with tone variations',
    agents: '8 controlled AI agents with permission levels',
    settings: 'Workspace and integration configuration',
    generic: 'Page context will load here',
  };
  return map[context] ?? map.generic;
}
