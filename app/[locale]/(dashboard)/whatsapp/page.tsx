"use client";

import { useParams } from "next/navigation";
import { MessageCircle, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function WhatsAppPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">WhatsApp Integration</h1>
          <p className="text-sm text-ink-light mt-1">
            Connect your WhatsApp Business account and let AI handle your leads.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-line-soft overflow-hidden">
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-cyan-100 mb-6">
              <MessageCircle className="w-10 h-10 text-primary-600" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Coming Soon
            </div>

            <h2 className="text-2xl font-bold text-ink mb-3">
              WhatsApp-native CRM
            </h2>
            <p className="text-base text-ink-light max-w-xl mx-auto mb-8">
              Soon you will be able to connect WhatsApp Business API, receive
              messages directly into your CRM, and use AI to automatically
              extract customer details, intent, and budget — in Arabic, Turkish,
              and English.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-bg-subtle rounded-lg">
                <div className="text-2xl mb-2">📥</div>
                <h3 className="text-sm font-semibold text-ink mb-1">Auto-capture</h3>
                <p className="text-xs text-ink-light">
                  Incoming messages become customer records automatically.
                </p>
              </div>

              <div className="p-4 bg-bg-subtle rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="text-sm font-semibold text-ink mb-1">AI extraction</h3>
                <p className="text-xs text-ink-light">
                  Names, companies, budgets, and intent extracted from chats.
                </p>
              </div>

              <div className="p-4 bg-bg-subtle rounded-lg">
                <div className="text-2xl mb-2">🌍</div>
                <h3 className="text-sm font-semibold text-ink mb-1">Multi-language</h3>
                <p className="text-xs text-ink-light">
                  Understands Arabic dialects, Turkish, and English naturally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
