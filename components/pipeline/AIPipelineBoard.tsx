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
        <div className="flex min-w-max items-stretch gap-4">
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
    <div className="flex w-72 flex-col self-stretch">
      <div
        className={`rounded-t-xl border border-b-0 border-border border-t-4 bg-card p-3 ${tone}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">{label}</span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
            {deals.length}
          </span>
        </div>
        <div className="mt-1 text-base font-bold text-primary tabular-nums">
          ${(health.totalValue / 1000).toFixed(0)}k
        </div>
        {health.isBottleneck && (
          <div className="mt-2 flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300 border border-amber-500/30">
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
        className={`flex-1 min-h-[600px] space-y-2 rounded-b-xl border border-border bg-muted p-2 transition-colors ${
          isOver ? 'bg-violet-500/10' : ''
        }`}
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
          <div className="flex flex-1 min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground">
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
      className={`cursor-grab rounded-lg border border-border border-l-[3px] bg-card p-3 hover:shadow-md active:cursor-grabbing ${borderColor}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-1 text-sm font-bold text-foreground">
          {deal.name}
        </h4>
        <span className="shrink-0 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[11px] font-bold text-primary">
          {deal.aiScore}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{deal.customerName}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-muted-foreground">
          ${deal.value.toLocaleString()}
        </span>
        <span className="text-[11px] text-muted-foreground">
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
