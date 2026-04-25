'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AIAgentCard } from '@/components/ai/AIAgentCard';
import {
  agentsService,
  agentDefinitions,
  type AgentRole,
  type AgentPermissionLevel,
  type AgentOutput,
  type AgentDefinition,
} from '@/lib/ai/agents';
import { usePageContextSync } from '@/hooks/usePageContextSync';

type TabKey = 'pending' | 'settings' | 'logs';

const PERMISSION_LABELS: Record<AgentPermissionLevel, string> = {
  1: 'Suggest only',
  2: 'Draft (user approves)',
  3: 'Execute with approval',
  4: 'Auto-execute low-risk',
};

export default function AIAgentsPage() {
  usePageContextSync('agents');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const t = useTranslations('ai.agents');
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<TabKey>('pending');
  const [filter, setFilter] = useState<AgentRole | 'all'>('all');

  const [permissions, setPermissions] = useState<Record<AgentRole, AgentPermissionLevel>>(
    () =>
      Object.fromEntries(
        agentDefinitions.map((d) => [d.role, d.defaultPermission]),
      ) as Record<AgentRole, AgentPermissionLevel>,
  );

  const { data: outputs = [] } = useQuery({
    queryKey: ['agent-outputs', 'current'],
    queryFn: () => agentsService.runAll('current'),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['agent-logs'],
    queryFn: () => agentsService.getLogs(),
  });

  const handleApprove = async (id: string) => {
    await agentsService.approveOutput(id);
    queryClient.setQueryData(['agent-outputs', 'current'], (old: AgentOutput[] = []) =>
      old.filter((o) => o.id !== id),
    );
    toast.success(t('approved'));
  };

  const handleDismiss = async (id: string) => {
    await agentsService.dismissOutput(id);
    queryClient.setQueryData(['agent-outputs', 'current'], (old: AgentOutput[] = []) =>
      old.filter((o) => o.id !== id),
    );
    toast.success(t('dismissed'));
  };

  const handleEdit = (_id: string) => {
    toast(t('editComingSoon'));
  };

  const handlePermissionChange = async (role: AgentRole, level: AgentPermissionLevel) => {
    setPermissions((prev) => ({ ...prev, [role]: level }));
    await agentsService.updatePermission(role, level);
    toast.success(t('permissionUpdated'));
  };

  const filteredOutputs =
    filter === 'all' ? outputs : outputs.filter((o) => o.agentRole === filter);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-zyrix-textHeading">{t('title')}</h1>
          <p className="mt-0.5 text-sm text-zyrix-textMuted">
            {t('subtitle', { count: outputs.length })}
          </p>
        </header>

        <div className="flex gap-1 border-b border-zyrix-border">
          {(['pending', 'settings', 'logs'] as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === key
                  ? 'text-zyrix-primary'
                  : 'text-zyrix-textMuted hover:text-zyrix-textBody'
              }`}
            >
              {t(`tabs.${key}`)}
              {key === 'pending' && outputs.length > 0 && (
                <span className="ms-2 rounded-md bg-zyrix-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {outputs.length}
                </span>
              )}
              {tab === key && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-zyrix-primary" />
              )}
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label={t('filter.all')}
                active={filter === 'all'}
                count={outputs.length}
                onClick={() => setFilter('all')}
              />
              {agentDefinitions.map((def) => {
                const count = outputs.filter((o) => o.agentRole === def.role).length;
                if (count === 0) return null;
                return (
                  <FilterChip
                    key={def.role}
                    label={def.name}
                    active={filter === def.role}
                    count={count}
                    onClick={() => setFilter(def.role)}
                  />
                );
              })}
            </div>

            {filteredOutputs.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredOutputs.map((output) => (
                  <AIAgentCard
                    key={output.id}
                    output={output}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'settings' && (
          <div className="grid gap-4 lg:grid-cols-2">
            {agentDefinitions.map((def) => (
              <AgentSettingsCard
                key={def.role}
                definition={def}
                currentLevel={permissions[def.role]}
                onLevelChange={(level) => handlePermissionChange(def.role, level)}
              />
            ))}
          </div>
        )}

        {tab === 'logs' && <ActivityLogsTable logs={logs} />}
      </div>
    </DashboardShell>
  );
}

function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-zyrix-primary text-white'
          : 'border border-zyrix-border bg-white text-zyrix-textBody hover:bg-zyrix-cardBgAlt'
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
            active ? 'bg-white/20' : 'bg-zyrix-aiSurface text-zyrix-primary'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function AgentSettingsCard({
  definition,
  currentLevel,
  onLevelChange,
}: {
  definition: AgentDefinition;
  currentLevel: AgentPermissionLevel;
  onLevelChange: (level: AgentPermissionLevel) => void;
}) {
  return (
    <article className="rounded-xl border border-zyrix-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${definition.color}15`, color: definition.color }}
        >
          ●
        </div>
        <div>
          <div className="text-sm font-bold text-zyrix-textHeading">{definition.name}</div>
          <div className="text-[11px] text-zyrix-textMuted">L{currentLevel}</div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zyrix-textBody">
        {definition.description}
      </p>

      <div className="mt-4">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
          Permission Level
        </div>
        <div className="space-y-1.5">
          {([1, 2, 3, 4] as AgentPermissionLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              className={`block w-full rounded-lg border px-3 py-2 text-start text-xs transition-colors ${
                currentLevel === level
                  ? 'border-zyrix-primary bg-zyrix-aiSurface font-bold text-zyrix-primary'
                  : 'border-transparent bg-zyrix-cardBgAlt text-zyrix-textBody hover:border-zyrix-border'
              }`}
            >
              <span className="font-bold">L{level}</span>
              <span className="ms-2">{PERMISSION_LABELS[level]}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function ActivityLogsTable({ logs }: { logs: AgentOutput[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-zyrix-border bg-white p-12 text-center">
        <p className="text-sm text-zyrix-textMuted">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zyrix-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zyrix-border bg-zyrix-cardBgAlt">
            <th className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
              Time
            </th>
            <th className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
              Agent
            </th>
            <th className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
              Insight
            </th>
            <th className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-zyrix-border last:border-0">
              <td className="px-3 py-3 text-xs text-zyrix-textMuted">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-3 py-3 text-xs text-zyrix-textBody">
                {agentDefinitions.find((d) => d.role === log.agentRole)?.name ??
                  log.agentRole}
              </td>
              <td className="px-3 py-3 text-xs text-zyrix-textBody">{log.insight}</td>
              <td className="px-3 py-3">
                <StatusBadge status={log.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: AgentOutput['status'] }) {
  const tones: Record<AgentOutput['status'], string> = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    edited: 'bg-sky-50 text-sky-700',
    dismissed: 'bg-slate-50 text-slate-600',
    executed: 'bg-emerald-100 text-emerald-800',
  };
  return (
    <span
      className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tones[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-zyrix-border bg-white p-12 text-center">
      <Sparkles size={28} className="mx-auto text-zyrix-primary" />
      <h3 className="mt-3 text-sm font-bold text-zyrix-textHeading">All caught up</h3>
      <p className="mt-1 text-xs text-zyrix-textMuted">
        No pending agent outputs. Agents will surface new insights as conditions change.
      </p>
    </div>
  );
}
