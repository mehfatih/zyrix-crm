'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AIMessageComposer } from '@/components/messaging/AIMessageComposer';
import { usePageContextSync } from '@/hooks/usePageContextSync';

type Channel = 'email' | 'whatsapp';

export default function MessagingPage() {
  usePageContextSync('messaging');
  const t = useTranslations('ai.messaging');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';

  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [conversation, setConversation] = useState<
    Array<{ from: 'me' | 'them'; content: string; time: string }>
  >([
    {
      from: 'them',
      content: 'Hi, I had a few questions about the proposal you sent last week.',
      time: '10:24 AM',
    },
    {
      from: 'me',
      content: 'Hi Khalid, happy to help. What questions do you have?',
      time: '10:31 AM',
    },
    {
      from: 'them',
      content: 'Could you walk me through the pricing for the enterprise tier?',
      time: '10:45 AM',
    },
  ]);

  return (
    <DashboardShell locale={locale}>
      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-[300px_1fr] lg:p-8">
        <aside className="overflow-hidden rounded-xl border border-zyrix-border bg-white">
          <div className="border-b border-zyrix-border p-3">
            <h2 className="text-sm font-bold text-zyrix-textHeading">
              {t('conversations')}
            </h2>
          </div>
          <div className="space-y-px overflow-y-auto p-2">
            {[
              {
                name: 'Khalid Al-Faisal',
                preview: 'Could you walk me through...',
                unread: 1,
              },
              { name: 'Sara Demir', preview: 'Thanks, sounds good', unread: 0 },
              { name: 'Levant Foods', preview: 'We need to reschedule', unread: 0 },
            ].map((c, i) => (
              <button
                key={i}
                className={`block w-full rounded-lg p-3 text-start hover:bg-zyrix-aiSurface ${
                  i === 0 ? 'bg-zyrix-aiSurface' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zyrix-textHeading">
                    {c.name}
                  </span>
                  {c.unread > 0 && (
                    <span className="rounded-full bg-zyrix-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-zyrix-textMuted">
                  {c.preview}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex flex-col overflow-hidden rounded-xl border border-zyrix-border bg-white">
          <header className="flex items-center justify-between border-b border-zyrix-border p-4">
            <div>
              <h2 className="text-sm font-bold text-zyrix-textHeading">
                Khalid Al-Faisal
              </h2>
              <p className="text-xs text-zyrix-textMuted">Al-Faisal Trading</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-zyrix-border p-0.5">
              <button
                onClick={() => setChannel('whatsapp')}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
                  channel === 'whatsapp'
                    ? 'bg-zyrix-aiSurface text-zyrix-primary'
                    : 'text-zyrix-textMuted'
                }`}
              >
                <MessageSquare size={12} /> WhatsApp
              </button>
              <button
                onClick={() => setChannel('email')}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
                  channel === 'email'
                    ? 'bg-zyrix-aiSurface text-zyrix-primary'
                    : 'text-zyrix-textMuted'
                }`}
              >
                <Mail size={12} /> Email
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {conversation.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.from === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      m.from === 'me'
                        ? 'bg-zyrix-ai-gradient text-white'
                        : 'bg-zyrix-cardBgAlt text-zyrix-textBody'
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                    <p
                      className={`mt-0.5 text-[10px] ${
                        m.from === 'me' ? 'text-white/70' : 'text-zyrix-textMuted'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AIMessageComposer
            context="Customer asking about enterprise pricing"
            channel={channel}
            onSend={(content) => {
              setConversation((prev) => [
                ...prev,
                {
                  from: 'me',
                  content,
                  time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
              ]);
            }}
          />
        </main>
      </div>
    </DashboardShell>
  );
}
