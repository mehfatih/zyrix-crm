'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { pipelineAI, type StageHealth } from '@/lib/ai/pipelineAI';
import { type AIDeal, type DealStage } from '@/lib/ai/dealsAI';
import { AITrustBadge } from '@/components/ai/AITrustBadge';

const STAGES: { id: DealStage; key: string; tone: string }[] = [
  { id: 'lead', key: 'lead', tone: 'border-t-slate-400' },
  { id: 'qualified', key: 'qualified', tone: 'border-t-sky-500' },
  { id: 'proposal', key: 'proposal', tone: 'border-t-cyan-500' },
  { id: 'negotiation', key: 'negotiation', tone: 'border-t-amber-500' },
  { id: 'closing', key: 'closing', tone: 'border-t-emerald-500' },
];

interface Props {
  workspaceId: string;
  onDealClick?: (deal: AIDeal) => void;
}

export function AIPipelineBoard({ workspaceId, onDealClick }: Props) {
  const t = useTranslations('ai.pipeline');
  const tStages = useTranslations('ai.pipeline.stages');
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const { data, isLoading } = useQuery({
    queryKey: ['pipeline', workspaceId],
    queryFn: () => pipelineAI.getSnapshot(workspaceId),
  });

  const updateStage = useMutation({
    mutationFn: ({ dealId, stage }: { dealId: string; stage: DealStage }) =>
      pipelineAI.updateDealStage(dealId, stage),
    onMutate: async ({ dealId, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['pipeline', workspaceId] });
      const previous = queryClient.getQueryData(['pipeline', workspaceId]);
      queryClient.setQueryData(['pipeline', workspaceId], (old: unknown) => {
        if (!old) return old;
        const snap = old as { deals: AIDeal[] };
        return {
          ...snap,
          deals: snap.deals.map((d) =>
            d.id === dealId ? { ...d, stage, daysInStage: 0 } : d,
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['pipeline', workspaceId], context.previous);
      }
      toast.error(t('moveError'));
    },
    onSuccess: () => toast.success(t('moveSuccess')),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const dealId = active.id as string;
    const newStage = over.id as DealStage;
    const deal = data?.deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;
    updateStage.mutate({ dealId, stage: newStage });
  };

  if (isLoading || !data) return <PipelineSkeleton />;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {STAGES.map((stage) => {
            const stageDeals = data.deals.filter((d) => d.stage === stage.id);
            const health = data.stageHealth[stage.id];
            return (
              <StageColumn
                key={stage.id}
                stageId={stage.id}
                label={tStages(stage.key)}
                tone={stage.tone}
                deals={stageDeals}
                health={health}
                onDealClick={onDealClick}
              />
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}

function StageColumn({
  stageId,
  label,
  tone,
  deals,
  health,
  onDealClick,
}: {
  stageId: DealStage;
  label: string;
  tone: string;
  deals: AIDeal[];
  health: StageHealth;
  onDealClick?: (d: AIDeal) => void;
}) {
  const t = useTranslations('ai.pipeline');
  const { setNodeRef, isOver } = useDroppable({ id: stageId });

  return (
    <div className="flex w-72 flex-col">
      <div
        className={`rounded-t-xl border border-b-0 border-zyrix-border border-t-4 bg-card p-3 ${tone}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zyrix-textHeading">{label}</span>
          <span className="rounded-md bg-zyrix-cardBgAlt px-1.5 py-0.5 text-[11px] font-bold text-zyrix-textMuted">
            {deals.length}
          </span>
        </div>
        <div className="mt-1 text-base font-bold text-zyrix-primary">
          ${(health.totalValue / 1000).toFixed(0)}k
        </div>
        {health.isBottleneck && (
          <div className="mt-2 flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300">
            <AlertTriangle size={11} />
            <span>
              {t('bottleneck')} {health.avgDaysInStage}d / {health.baselineDays}d
            </span>
          </div>
        )}
        {health.stuckDealIds.length > 0 && (
          <div className="mt-1 text-[11px] font-semibold text-rose-300">
            {health.stuckDealIds.length} {t('stuckDeals')}
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 rounded-b-xl border border-zyrix-border bg-zyrix-cardBgAlt p-2 transition-colors ${
          isOver ? 'bg-zyrix-aiSurface' : ''
        }`}
        style={{ minHeight: 400 }}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            isStuck={health.stuckDealIds.includes(deal.id)}
            onClick={() => onDealClick?.(deal)}
          />
        ))}
        {deals.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-zyrix-border text-xs text-zyrix-textMuted">
            {t('dragDealsHere')}
          </div>
        )}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  isStuck,
  onClick,
}: {
  deal: AIDeal;
  isStuck: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
      }
    : {};

  const borderColor = isStuck
    ? 'border-l-red-500'
    : deal.riskLevel === 'medium'
    ? 'border-l-amber-500'
    : 'border-l-emerald-500';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-grab rounded-lg border border-zyrix-border border-l-[3px] bg-card p-3 hover:shadow-zyrix-card active:cursor-grabbing ${borderColor}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-1 text-sm font-bold text-zyrix-textHeading">
          {deal.name}
        </h4>
        <span className="shrink-0 rounded-md bg-zyrix-aiSurface px-1.5 py-0.5 text-[11px] font-bold text-zyrix-primary">
          {deal.aiScore}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-zyrix-textMuted">{deal.customerName}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-zyrix-textBody">
          ${deal.value.toLocaleString()}
        </span>
        <span className="text-[11px] text-zyrix-textMuted">
          {deal.daysInStage}d
        </span>
      </div>
      <div className="mt-2">
        <AITrustBadge
          confidence={deal.nextActionConfidence}
          signals={deal.signals}
          size="sm"
        />
      </div>
    </motion.div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-96 w-72 animate-pulse rounded-xl bg-card" />
      ))}
    </div>
  );
}
