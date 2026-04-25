'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { AIBulkActionBar } from './AIBulkActionBar';
import { AITrustBadge } from './AITrustBadge';

export interface AITableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface AITableRow {
  id: string;
  aiScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  nextAction: string;
  nextActionConfidence: number;
  signals: string[];
}

interface Props<T extends AITableRow> {
  data: T[];
  columns: AITableColumn<T>[];
  entityType: 'customer' | 'deal';
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function AITable<T extends AITableRow>({
  data,
  columns,
  entityType,
  onRowClick,
  isLoading,
}: Props<T>) {
  const t = useTranslations('ai.table');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = data.length > 0 && selected.size === data.length;
  const someSelected = selected.size > 0 && selected.size < data.length;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map((d) => d.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zyrix-border bg-white p-12 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zyrix-aiBorder border-t-zyrix-primary" />
        <p className="mt-4 text-sm text-zyrix-textMuted">{t('loading')}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zyrix-border bg-white p-12 text-center">
        <Sparkles size={28} className="mx-auto text-zyrix-primary" />
        <h3 className="mt-3 text-sm font-bold text-zyrix-textHeading">
          {t('emptyTitle')}
        </h3>
        <p className="mt-1 text-xs text-zyrix-textMuted">{t('emptyHint')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zyrix-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zyrix-border bg-zyrix-cardBgAlt">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-zyrix-border text-zyrix-primary focus:ring-zyrix-primary"
                  />
                </th>
                <th className="w-16 px-3 py-3 text-start">
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
                    <Sparkles size={11} />
                    {t('aiScore')}
                  </span>
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted"
                    style={{ width: col.width }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && <ArrowUpDown size={10} />}
                    </span>
                  </th>
                ))}
                <th className="w-24 px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
                  {t('risk')}
                </th>
                <th className="px-3 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
                  {t('nextAction')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-zyrix-border transition-colors hover:bg-zyrix-aiSurface/50 ${
                    selected.has(row.id) ? 'bg-zyrix-aiSurface' : 'bg-white'
                  }`}
                >
                  <td
                    className="px-3 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleOne(row.id)}
                      className="h-4 w-4 rounded border-zyrix-border text-zyrix-primary focus:ring-zyrix-primary"
                    />
                  </td>
                  <td
                    className="cursor-pointer px-3 py-3"
                    onClick={() => onRowClick?.(row)}
                  >
                    <AIScoreBadge score={row.aiScore} />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="cursor-pointer px-3 py-3 text-sm text-zyrix-textBody"
                      onClick={() => onRowClick?.(row)}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                  <td
                    className="cursor-pointer px-3 py-3"
                    onClick={() => onRowClick?.(row)}
                  >
                    <RiskBadge level={row.riskLevel} />
                  </td>
                  <td
                    className="cursor-pointer px-3 py-3"
                    onClick={() => onRowClick?.(row)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-1 text-xs text-zyrix-textBody">
                        {row.nextAction}
                      </span>
                      <AITrustBadge
                        confidence={row.nextActionConfidence}
                        signals={row.signals}
                        size="sm"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIBulkActionBar
        selectedCount={selected.size}
        selectedIds={Array.from(selected)}
        entityType={entityType}
        onClear={clearSelection}
      />
    </>
  );
}

function AIScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : score >= 50
        ? 'bg-sky-50 text-sky-700 border-sky-200'
        : 'bg-red-50 text-red-700 border-red-200';
  return (
    <span
      className={`inline-flex h-7 w-10 items-center justify-center rounded-md border text-xs font-bold ${tone}`}
    >
      {score}
    </span>
  );
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const map = {
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Low' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Med' },
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      label: 'High',
      icon: <AlertTriangle size={10} />,
    },
  } as const;
  const c = map[level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${c.bg} ${c.text}`}
    >
      {'icon' in c ? c.icon : null}
      {c.label}
    </span>
  );
}
