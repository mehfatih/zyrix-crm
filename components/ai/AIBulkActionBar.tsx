'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  CheckSquare,
  Download,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { bulkActions, type BulkActionType } from '@/lib/ai/bulkActions';

interface Props {
  selectedCount: number;
  selectedIds: string[];
  entityType: 'customer' | 'deal';
  onClear: () => void;
  onActionComplete?: () => void;
}

export function AIBulkActionBar({
  selectedCount,
  selectedIds,
  entityType,
  onClear,
  onActionComplete,
}: Props) {
  const t = useTranslations('ai.bulkActions');
  const [running, setRunning] = useState<BulkActionType | null>(null);

  const run = async (type: BulkActionType) => {
    setRunning(type);
    const result = await bulkActions.execute({
      type,
      entityType,
      entityIds: selectedIds,
    });
    setRunning(null);
    if (result.success) {
      toast.success(result.message);
      onActionComplete?.();
      if (type !== 'draft-messages') onClear();
    } else {
      toast.error(t('failed'));
    }
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-xl border border-zyrix-aiBorder bg-white p-2 shadow-zyrix-ai-glow">
            <div className="flex items-center gap-2 px-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zyrix-ai-gradient">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="text-sm font-bold text-zyrix-textHeading">
                {selectedCount} {t('selected')}
              </span>
            </div>

            <div className="h-6 w-px bg-zyrix-border" />

            <ActionButton
              icon={<Sparkles size={13} />}
              label={t('askAI')}
              loading={running === 'ask-ai'}
              onClick={() => run('ask-ai')}
            />
            <ActionButton
              icon={<MessageSquare size={13} />}
              label={t('draftMessages')}
              loading={running === 'draft-messages'}
              onClick={() => run('draft-messages')}
            />
            <ActionButton
              icon={<CheckSquare size={13} />}
              label={t('createTasks')}
              loading={running === 'create-tasks'}
              onClick={() => run('create-tasks')}
            />
            <ActionButton
              icon={<Download size={13} />}
              label={t('export')}
              loading={running === 'export'}
              onClick={() => run('export')}
            />

            <div className="h-6 w-px bg-zyrix-border" />

            <button
              onClick={onClear}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zyrix-textMuted hover:bg-zyrix-cardBgAlt"
              aria-label={t('clear')}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ActionButton({
  icon,
  label,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-zyrix-primaryDark transition-colors hover:bg-zyrix-aiSurface disabled:opacity-50"
    >
      {loading ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-zyrix-primary border-t-transparent" />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
}
