"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Mail,
  Plus,
  Loader2,
  Send,
  X,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MousePointerClick,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Tag,
  Edit3,
  BookOpen,
} from "lucide-react";
import {
  fetchCampaigns,
  fetchCampaign,
  fetchCampaignStats,
  createCampaign,
  updateCampaign,
  sendCampaign,
  deleteCampaign,
  type Campaign,
  type CampaignDetail,
  type CampaignStats,
  type CampaignStatus,
  type Channel,
  type TargetType,
  type RecipientStatus,
  type CreateCampaignDto,
} from "@/lib/api/campaigns";
import { listTemplates, markTemplateUsed, type EmailTemplate } from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// CAMPAIGNS PAGE
// ============================================================================

const CHANNEL_META: Record<
  Channel,
  { bg: string; text: string; Icon: typeof Mail }
> = {
  email: { bg: "bg-cyan-50", text: "text-cyan-700", Icon: Mail },
  whatsapp: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    Icon: MessageCircle,
  },
  sms: { bg: "bg-sky-50", text: "text-sky-700", Icon: Phone },
};

const STATUS_META: Record<
  CampaignStatus,
  { bg: string; text: string; ring: string }
> = {
  draft: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200" },
  scheduled: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  sending: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  sent: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  failed: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
  },
};

export default function CampaignsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Campaigns");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<CampaignDetail | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, s] = await Promise.all([
        fetchCampaigns({ limit: 100 }),
        fetchCampaignStats(),
      ]);
      setCampaigns(c.items);
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDetail = async (c: Campaign) => {
    try {
      const full = await fetchCampaign(c.id);
      setDetailOpen(full);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
              <Mail className="w-6 h-6 text-cyan-600" />
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("newCampaign")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Send}
            label={t("stats.total")}
            value={stats?.total ?? 0}
            color="cyan"
          />
          <StatCard
            icon={Users}
            label={t("stats.totalSent")}
            value={formatNumber(stats?.totalMessagesSent ?? 0)}
            color="sky"
          />
          <StatCard
            icon={Eye}
            label={t("stats.totalOpens")}
            value={formatNumber(stats?.totalOpens ?? 0)}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            label={t("stats.openRate")}
            value={`${(stats?.openRatePercent ?? 0).toFixed(1)}%`}
            color="amber"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-xl py-16 text-center text-slate-500">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs mt-1">{t("empty.subtitle")}</p>
          </div>
        ) : (
          <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sky-50 border-b border-sky-100">
                  <tr className="text-left rtl:text-right text-xs uppercase text-slate-600">
                    <th className="px-4 py-3 font-semibold">
                      {t("table.name")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.channel")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.status")}
                    </th>
                    <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                      {t("table.recipients")}
                    </th>
                    <th className="px-4 py-3 font-semibold ltr:text-right rtl:text-left">
                      {t("table.sent")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("table.created")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, idx) => {
                    const chMeta = CHANNEL_META[c.channel];
                    const ChIcon = chMeta.Icon;
                    const stMeta = STATUS_META[c.status];
                    return (
                      <tr
                        key={idx}
                        onClick={() => openDetail(c)}
                        className="border-b border-sky-50 hover:bg-sky-50/40 cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-cyan-900">
                            {c.name}
                          </div>
                          {c.subject && (
                            <div className="text-xs text-slate-500 truncate max-w-sm">
                              {c.subject}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${chMeta.bg} ${chMeta.text}`}
                          >
                            <ChIcon className="w-3 h-3" />
                            {t(`channel.${c.channel}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ${stMeta.bg} ${stMeta.text} ${stMeta.ring}`}
                          >
                            {t(`status.${c.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3 ltr:text-right rtl:text-left text-slate-700">
                          {c.recipientCount}
                        </td>
                        <td className="px-4 py-3 ltr:text-right rtl:text-left font-medium text-cyan-900">
                          {c.sentCount}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {formatDate(c.createdAt, locale)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {wizardOpen && (
        <WizardModal
          t={t}
          onClose={() => setWizardOpen(false)}
          onCreated={async () => {
            setWizardOpen(false);
            await load();
          }}
        />
      )}

      {detailOpen && (
        <DetailModal
          t={t}
          locale={locale}
          campaign={detailOpen}
          onClose={() => setDetailOpen(null)}
          onChanged={async () => {
            setDetailOpen(null);
            await load();
          }}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Wizard Modal — 4 steps
// ============================================================================
type WizardStep = 1 | 2 | 3 | 4;

function WizardModal({
  t,
  onClose,
  onCreated,
}: {
  t: ReturnType<typeof useTranslations>;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState({
    name: "",
    channel: "email" as Channel,
    targetType: "all" as TargetType,
    targetValue: "",
    subject: "",
    bodyText: "",
    bodyHtml: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    scheduledAt: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Lazy-load templates the first time we hit step 3 for an email campaign
  useEffect(() => {
    if (step === 3 && form.channel === "email" && !templatesLoaded) {
      listTemplates()
        .then((rows) => setTemplates(rows))
        .catch(() => setTemplates([]))
        .finally(() => setTemplatesLoaded(true));
    }
  }, [step, form.channel, templatesLoaded]);

  const applyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const tpl = templates.find((x) => x.id === templateId);
    if (!tpl) return;
    // Strip HTML tags to produce a plain-text preview for the textarea
    const plain = tpl.bodyText || tpl.bodyHtml.replace(/<[^>]*>/g, "").trim();
    setForm((prev) => ({
      ...prev,
      subject: prev.subject || tpl.subject,
      bodyText: prev.bodyText || plain,
      bodyHtml: prev.bodyHtml || tpl.bodyHtml,
    }));
  };

  const next = () => setStep((s) => Math.min(4, s + 1) as WizardStep);
  const back = () => setStep((s) => Math.max(1, s - 1) as WizardStep);

  const canProceed = (): boolean => {
    if (step === 1) return !!form.channel;
    if (step === 2) return !!form.targetType;
    if (step === 3) {
      if (form.channel === "email") return !!form.subject.trim() && !!form.bodyText.trim();
      return !!form.bodyText.trim();
    }
    return true;
  };

  const submit = async (sendNow: boolean) => {
    if (!form.name.trim()) {
      setErr(t("wizard.errors.enterName"));
      setStep(1);
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const dto: CreateCampaignDto = {
        name: form.name.trim(),
        channel: form.channel,
        subject: form.subject.trim() || undefined,
        bodyText: form.bodyText || undefined,
        bodyHtml: form.bodyHtml || undefined,
        fromName: form.fromName.trim() || undefined,
        fromEmail: form.fromEmail.trim() || undefined,
        replyTo: form.replyTo.trim() || undefined,
        targetType: form.targetType,
        targetValue: form.targetValue.trim() || undefined,
        scheduledAt: form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : null,
      };
      const created = await createCampaign(dto);
      if (sendNow) {
        await sendCampaign(created.id);
      }
      // Best-effort usage tracking; don't block the UI if it fails
      if (selectedTemplateId) {
        markTemplateUsed(selectedTemplateId).catch(() => {});
      }
      await onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-cyan-900">
              {t("wizard.title")}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-cyan-600" : "bg-sky-100"
                  }`}
                  style={{ minWidth: 40 }}
                />
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t("wizard.step", { step: String(step), total: "4" })}:{" "}
              {step === 1 && t("wizard.steps.channel")}
              {step === 2 && t("wizard.steps.audience")}
              {step === 3 && t("wizard.steps.content")}
              {step === 4 && t("wizard.steps.review")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t("wizard.fields.name")} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("wizard.fields.namePlaceholder")}
                  className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  {t("wizard.fields.channel")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["email", "whatsapp", "sms"] as Channel[]).map((ch) => {
                    const meta = CHANNEL_META[ch];
                    const Icon = meta.Icon;
                    const active = form.channel === ch;
                    return (
                      <button
                        key={ch}
                        onClick={() => setForm({ ...form, channel: ch })}
                        className={`px-3 py-4 rounded-lg border flex flex-col items-center gap-1 text-sm font-medium transition-colors ${
                          active
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                            : "border-sky-200 bg-white text-slate-600 hover:bg-sky-50"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        {t(`channel.${ch}`)}
                        {ch !== "email" && (
                          <span className="text-[10px] text-amber-600">
                            {t("wizard.beta")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  {t("wizard.fields.targetType")}
                </label>
                <div className="space-y-2">
                  {(
                    [
                      { id: "all", label: t("wizard.target.all") },
                      { id: "status", label: t("wizard.target.status") },
                      { id: "tag", label: t("wizard.target.tag") },
                      { id: "manual", label: t("wizard.target.manual") },
                    ] as { id: TargetType; label: string }[]
                  ).map((opt) => {
                    const active = form.targetType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setForm({ ...form, targetType: opt.id })
                        }
                        className={`w-full text-left rtl:text-right px-4 py-3 rounded-lg border text-sm transition-colors ${
                          active
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                            : "border-sky-200 bg-white text-slate-600 hover:bg-sky-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {form.targetType === "status" && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t("wizard.fields.statusValue")}
                  </label>
                  <select
                    value={form.targetValue}
                    onChange={(e) =>
                      setForm({ ...form, targetValue: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                  >
                    <option value="">—</option>
                    <option value="new">new</option>
                    <option value="qualified">qualified</option>
                    <option value="customer">customer</option>
                  </select>
                </div>
              )}
              {form.targetType === "tag" && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t("wizard.fields.tagValue")}
                  </label>
                  <input
                    type="text"
                    value={form.targetValue}
                    onChange={(e) =>
                      setForm({ ...form, targetValue: e.target.value })
                    }
                    placeholder={t("wizard.fields.tagPlaceholder")}
                    className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {form.channel === "email" && templates.length > 0 && (
                <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-3">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-cyan-900 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Use a saved template
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white"
                    >
                      <option value="">— Start from scratch —</option>
                      {templates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name}
                          {tpl.category && tpl.category !== "general"
                            ? ` (${tpl.category})`
                            : ""}
                          {tpl.usageCount > 0 ? ` · used ${tpl.usageCount}×` : ""}
                        </option>
                      ))}
                    </select>
                    {selectedTemplateId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId("");
                          setForm((prev) => ({
                            ...prev,
                            subject: "",
                            bodyText: "",
                            bodyHtml: "",
                          }));
                        }}
                        className="px-2 py-2 text-xs text-slate-600 hover:bg-white rounded-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Picking a template fills in any empty fields below. You can still edit them.
                  </p>
                </div>
              )}
              {form.channel === "email" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t("wizard.fields.subject")} *
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t("wizard.fields.fromName")}
                      </label>
                      <input
                        type="text"
                        value={form.fromName}
                        onChange={(e) =>
                          setForm({ ...form, fromName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t("wizard.fields.replyTo")}
                      </label>
                      <input
                        type="email"
                        value={form.replyTo}
                        onChange={(e) =>
                          setForm({ ...form, replyTo: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t("wizard.fields.body")} *
                </label>
                <textarea
                  value={form.bodyText}
                  onChange={(e) =>
                    setForm({ ...form, bodyText: e.target.value })
                  }
                  rows={8}
                  placeholder={t("wizard.fields.bodyPlaceholder")}
                  className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <ReviewRow
                label={t("wizard.review.name")}
                value={form.name || "—"}
              />
              <ReviewRow
                label={t("wizard.review.channel")}
                value={t(`channel.${form.channel}`)}
              />
              <ReviewRow
                label={t("wizard.review.audience")}
                value={
                  form.targetType === "all"
                    ? t("wizard.target.all")
                    : `${t(`wizard.target.${form.targetType}`)}: ${form.targetValue || "—"}`
                }
              />
              {form.channel === "email" && form.subject && (
                <ReviewRow
                  label={t("wizard.review.subject")}
                  value={form.subject}
                />
              )}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t("wizard.fields.scheduledAt")}
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm({ ...form, scheduledAt: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {t("wizard.scheduleHint")}
                </p>
              </div>
            </div>
          )}

          {err && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg border border-red-100">
              {err}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 flex items-center justify-between gap-2 bg-sky-50/30">
          <button
            onClick={step === 1 ? onClose : back}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? t("wizard.actions.cancel") : t("wizard.actions.back")}
          </button>
          {step < 4 ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
            >
              {t("wizard.actions.next")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => submit(false)}
                disabled={saving}
                className="px-4 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("wizard.actions.saveDraft")
                )}
              </button>
              <button
                onClick={() => submit(true)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {t("wizard.actions.sendNow")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-sky-50/30 border border-sky-100 rounded-lg px-3 py-2">
      <div className="text-xs font-medium text-slate-600 min-w-[100px]">
        {label}
      </div>
      <div className="text-sm text-cyan-900 font-medium flex-1">{value}</div>
    </div>
  );
}

// ============================================================================
// Detail Modal
// ============================================================================
function DetailModal({
  t,
  locale,
  campaign,
  onClose,
  onChanged,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
  campaign: CampaignDetail;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [sending, setSending] = useState(false);
  const chMeta = CHANNEL_META[campaign.channel];
  const ChIcon = chMeta.Icon;
  const stMeta = STATUS_META[campaign.status];
  const canSend =
    campaign.status === "draft" || campaign.status === "scheduled";

  const handleSend = async () => {
    if (!confirm(t("confirm.send", { count: String(campaign.recipientCount) })))
      return;
    setSending(true);
    try {
      await sendCampaign(campaign.id);
      await onChanged();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await deleteCampaign(campaign.id);
      await onChanged();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const recipientStats = {
    queued: campaign.recipients.filter((r) => r.status === "queued").length,
    sent: campaign.recipients.filter((r) => r.status === "sent").length,
    failed: campaign.recipients.filter((r) => r.status === "failed").length,
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${chMeta.bg} ${chMeta.text}`}
              >
                <ChIcon className="w-3 h-3" />
                {t(`channel.${campaign.channel}`)}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ${stMeta.bg} ${stMeta.text} ${stMeta.ring}`}
              >
                {t(`status.${campaign.status}`)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-cyan-900">{campaign.name}</h2>
            {campaign.subject && (
              <p className="text-sm text-slate-600 mt-0.5">{campaign.subject}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <MiniStat
              label={t("detail.recipients")}
              value={String(campaign.recipientCount)}
            />
            <MiniStat
              label={t("detail.sent")}
              value={String(campaign.sentCount)}
            />
            <MiniStat
              label={t("detail.opened")}
              value={String(campaign.openedCount)}
            />
            <MiniStat
              label={t("detail.failed")}
              value={String(campaign.failedCount)}
            />
          </div>

          {campaign.bodyText && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                {t("detail.body")}
              </div>
              <div className="bg-sky-50/30 border border-sky-100 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {campaign.bodyText}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
              {t("detail.recipientsList")} ({campaign.recipients.length})
            </div>
            {campaign.recipients.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">
                {t("detail.noRecipients")}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border border-sky-100 rounded-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-sky-50">
                    {campaign.recipients.slice(0, 50).map((r, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/30">
                        <td className="px-3 py-2">
                          <div className="font-medium text-cyan-900 text-sm">
                            {r.customer.fullName}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {r.email || r.phone || "—"}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <RecipientStatusBadge status={r.status} t={t} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {campaign.recipients.length > 50 && (
                  <div className="text-xs text-slate-500 text-center py-2 border-t border-sky-100">
                    + {campaign.recipients.length - 50}{" "}
                    {t("detail.moreRecipients")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-sky-100 flex items-center justify-between gap-2 bg-sky-50/30 flex-wrap">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            {t("actions.delete")}
          </button>
          {canSend && (
            <button
              onClick={handleSend}
              disabled={sending || campaign.recipientCount === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {t("actions.sendNow")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipientStatusBadge({
  status,
  t,
}: {
  status: RecipientStatus;
  t: ReturnType<typeof useTranslations>;
}) {
  const styles: Record<RecipientStatus, string> = {
    queued: "bg-slate-50 text-slate-600 ring-slate-200",
    sent: "bg-sky-50 text-sky-700 ring-sky-200",
    delivered: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    opened: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    clicked: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    bounced: "bg-amber-50 text-amber-700 ring-amber-200",
    failed: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ${styles[status]}`}
    >
      {t(`recipientStatus.${status}`)}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sky-50/40 border border-sky-100 rounded-lg px-2 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold text-cyan-900">{value}</div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Mail;
  label: string;
  value: string | number;
  color: "cyan" | "sky" | "emerald" | "amber";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-cyan-50", iconText: "text-cyan-600" },
    sky: { iconBg: "bg-sky-50", iconText: "text-sky-600" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
  };
  const c = colors[color];
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4 flex items-center gap-3">
      <div className={`${c.iconBg} ${c.iconText} p-2 rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 truncate">{label}</div>
        <div className="text-lg font-bold text-cyan-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
