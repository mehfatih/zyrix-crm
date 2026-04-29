'use client';

import { useTranslations } from 'next-intl';
import {
  Mail,
  AlertTriangle,
  TrendingUp,
  User,
  MessageSquare,
  Rocket,
  Link2,
  CheckSquare,
  Check,
  Edit2,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { agentDefinitions, type AgentOutput } from '@/lib/ai/agents';
import { AITrustBadge } from './AITrustBadge';

const ICON_MAP = {
  mail: Mail,
  alert: AlertTriangle,
  trending: TrendingUp,
  user: User,
  message: MessageSquare,
  rocket: Rocket,
  link: Link2,
  check: CheckSquare,
};

interface Props {
  output: AgentOutput;
  onApprove: (id: string) => void;
  onEdit: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AIAgentCard({ output, onApprove, onEdit, onDismiss }: Props) {
  const t = useTranslations('ai.agents');
  const def = agentDefinitions.find((d) => d.role === output.agentRole);
  const Icon = def ? ICON_MAP[def.iconKey as keyof typeof ICON_MAP] : Mail;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-violet-500/30 bg-card p-5 shadow-md"
    >
      <header className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${def?.color}15`, color: def?.color }}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground">{def?.name}</div>
          <div className="text-[11px] text-muted-foreground">{formatTimeAgo(output.createdAt)}</div>
        </div>
        <span className="rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          L{output.permissionLevel}
        </span>
      </header>

      <h3 className="text-base font-bold leading-snug text-foreground">
        {output.insight}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{output.reason}</p>

      <div className="mt-3">
        <AITrustBadge
          confidence={output.confidence}
          reason={output.reason}
          signals={output.signals}
          recommendedAction={output.recommendedAction}
        />
      </div>

      {output.draftPayload && (
        <div className="mt-3 rounded-lg border-l-[3px] border-primary bg-violet-500/10 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {t('draft')}
          </div>
          <p className="mt-1 text-xs italic leading-relaxed text-muted-foreground">
            {output.draftPayload.content}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onApprove(output.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-3 py-2 text-xs font-bold text-white shadow-md hover:shadow-md-hover"
        >
          <Check size={13} />
          {t('approve')}
        </button>
        <button
          onClick={() => onEdit(output.id)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-primaryDark hover:bg-violet-500/10"
        >
          <Edit2 size={13} />
          {t('edit')}
        </button>
        <button
          onClick={() => onDismiss(output.id)}
          className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          <X size={13} />
          {t('dismiss')}
        </button>
      </div>
    </motion.article>
  );
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
