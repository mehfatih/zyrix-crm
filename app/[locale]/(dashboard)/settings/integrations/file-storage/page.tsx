'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, FolderOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  googleDriveService,
  type DriveSyncStatus,
} from '@/lib/integrations/googleDrive';
import {
  microsoftService,
  type MicrosoftSyncStatus,
} from '@/lib/integrations/microsoft';
import { usePageContextSync } from '@/hooks/usePageContextSync';

type ProviderStatus = DriveSyncStatus | MicrosoftSyncStatus | undefined;

export default function IntegrationsPage() {
  usePageContextSync('settings');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const t = useTranslations('ai.integrations');
  const queryClient = useQueryClient();

  const [confirmAction, setConfirmAction] = useState<{
    provider: 'drive' | 'microsoft';
  } | null>(null);

  const { data: driveStatus } = useQuery({
    queryKey: ['integration-status', 'drive'],
    queryFn: () => googleDriveService.getStatus(),
  });

  const { data: msStatus } = useQuery({
    queryKey: ['integration-status', 'microsoft'],
    queryFn: () => microsoftService.getStatus(),
  });

  const handleDisconnect = async () => {
    if (!confirmAction) return;
    if (confirmAction.provider === 'drive') {
      await googleDriveService.disconnect();
      queryClient.invalidateQueries({ queryKey: ['integration-status', 'drive'] });
    } else {
      await microsoftService.disconnect();
      queryClient.invalidateQueries({ queryKey: ['integration-status', 'microsoft'] });
    }
    setConfirmAction(null);
    toast.success(t('disconnected'));
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-zyrix-textHeading">{t('title')}</h1>
          <p className="mt-0.5 text-sm text-zyrix-textMuted">{t('subtitle')}</p>
        </header>

        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-zyrix-textMuted">
            {t('fileStorage')}
          </h2>
          <div className="space-y-3">
            <ProviderCard
              name="Google Drive"
              description={t('googleDriveDescription')}
              icon={<FolderOpen size={20} className="text-blue-500" />}
              brandColor="#4285F4"
              status={driveStatus}
              onConnect={() => googleDriveService.connect()}
              onDisconnect={() => setConfirmAction({ provider: 'drive' })}
            />
            <ProviderCard
              name="Microsoft 365"
              description={t('microsoftDescription')}
              icon={<Cloud size={20} className="text-sky-500" />}
              brandColor="#0078D4"
              status={msStatus}
              onConnect={() => microsoftService.connect()}
              onDisconnect={() => setConfirmAction({ provider: 'microsoft' })}
            />
          </div>
        </section>

        <AnimatePresence>
          {confirmAction && (
            <ConfirmModal
              onCancel={() => setConfirmAction(null)}
              onConfirm={handleDisconnect}
              providerName={
                confirmAction.provider === 'drive' ? 'Google Drive' : 'Microsoft 365'
              }
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}

function ProviderCard({
  name,
  description,
  icon,
  brandColor,
  status,
  onConnect,
  onDisconnect,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  brandColor: string;
  status: ProviderStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const t = useTranslations('ai.integrations');

  return (
    <article className="flex items-center gap-4 rounded-xl border border-zyrix-border bg-white p-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${brandColor}15` }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-zyrix-textHeading">{name}</h3>
          {status?.connected && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 size={10} />
              {t('connected')}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-zyrix-textMuted">{description}</p>

        {status?.connected && (
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-zyrix-textMuted">
            <span>
              {t('lastSync')}:{' '}
              <span className="font-semibold text-zyrix-textBody">
                {status.lastSync ? new Date(status.lastSync).toLocaleString() : 'never'}
              </span>
            </span>
            <span>
              {status.itemsSynced} {t('itemsSynced')}
            </span>
            {status.errors > 0 && (
              <span className="text-red-600">
                {status.errors} {t('errors')}
              </span>
            )}
          </div>
        )}
      </div>

      {status?.connected ? (
        <button
          onClick={onDisconnect}
          className="rounded-lg border border-zyrix-border bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
        >
          {t('disconnect')}
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="rounded-lg bg-zyrix-ai-gradient px-4 py-1.5 text-xs font-bold text-white shadow-zyrix-card hover:shadow-zyrix-card-hover"
        >
          {t('connect')}
        </button>
      )}
    </article>
  );
}

function ConfirmModal({
  onCancel,
  onConfirm,
  providerName,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  providerName: string;
}) {
  const t = useTranslations('ai.integrations');

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-zyrix-textHeading/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zyrix-textHeading">
              {t('confirmDisconnect', { provider: providerName })}
            </h3>
            <p className="mt-1 text-sm text-zyrix-textBody">{t('disconnectWarning')}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-zyrix-border bg-white px-4 py-2 text-sm font-semibold text-zyrix-textBody hover:bg-zyrix-cardBgAlt"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            {t('disconnect')}
          </button>
        </div>
      </motion.div>
    </>
  );
}
