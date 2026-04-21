"use client";

import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Globe,
  Clock,
  Languages,
  Upload,
  X as XIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { updateProfileApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

// ============================================================================
// PROFILE TAB — UX #7 expanded form
// ----------------------------------------------------------------------------
// 6 new fields + avatar upload on top of the old (fullName, phone, email)
// form: avatar, website, timezone, preferred language, billing email,
// notification preferences.
// ============================================================================

// Curated list of common MENA/Turkey timezones. Full tz db is ~600 entries
// which would overwhelm the UI for the business users we target. If
// someone needs a rare TZ, we can type it directly (the value is free-text
// on the backend).
const COMMON_TIMEZONES = [
  "Asia/Riyadh",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Africa/Cairo",
  "Asia/Baghdad",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Muscat",
  "UTC",
];

const NOTIFICATION_KEYS = [
  "email_daily_digest",
  "email_new_customer",
  "email_new_deal",
  "email_deal_won",
  "push_new_message",
  "push_task_due",
] as const;

// 1 MB file cap; base64 inflates ~33%, final data URL fits under backend limit.
const MAX_AVATAR_BYTES = 1 * 1024 * 1024;

export function ProfileTab() {
  const t = useTranslations("Settings.profile");
  const { user, refresh } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || null,
    website: user?.website || "",
    timezone: user?.timezone || "Asia/Riyadh",
    billingEmail: user?.billingEmail || "",
    preferredLocale:
      (user?.preferredLocale as "en" | "ar" | "tr" | null) ?? null,
    notificationPrefs: user?.notificationPrefs ?? {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(t("avatarTooLarge") || "Image must be under 1MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAvatarError(t("avatarNotImage") || "File must be an image");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, avatarUrl: reader.result as string }));
    };
    reader.onerror = () => {
      setAvatarError(t("avatarReadFailed") || "Failed to read the image");
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setForm((f) => ({ ...f, avatarUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleNotification = (key: string) => {
    setForm((f) => ({
      ...f,
      notificationPrefs: {
        ...f.notificationPrefs,
        [key]: !(f.notificationPrefs[key] ?? true),
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateProfileApi({
        fullName: form.fullName,
        phone: form.phone || undefined,
        // Empty strings → null so backend clears rather than saving ""
        avatarUrl: form.avatarUrl || null,
        website: form.website || null,
        timezone: form.timezone || null,
        billingEmail: form.billingEmail || null,
        preferredLocale: form.preferredLocale,
        notificationPrefs: form.notificationPrefs,
      });
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = form.fullName
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-ink">{t("heading")}</h2>

      {error && (
        <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg border border-danger/20 whitespace-pre-line">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-light text-success-dark text-sm p-3 rounded-lg border border-success/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {t("success")}
        </div>
      )}

      {/* Avatar */}
      <section className="rounded-xl border border-line bg-white p-4">
        <h3 className="text-sm font-bold text-ink mb-3">
          {t("avatar") || "Profile picture"}
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow overflow-hidden flex-shrink-0">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatarUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              initials || <User className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarPick}
            />
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-line hover:bg-bg-subtle text-ink rounded-lg text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5" />
                {form.avatarUrl
                  ? t("avatarReplace") || "Replace"
                  : t("avatarUpload") || "Upload image"}
              </button>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-slate-500 hover:text-rose-700 text-xs font-semibold"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  {t("avatarRemove") || "Remove"}
                </button>
              )}
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              {t("avatarHint") ||
                "PNG / JPG / WebP, up to 1 MB. Replaces the Zyrix logo in the sidebar."}
            </p>
            {avatarError && (
              <p className="text-xs text-rose-600 mt-1">{avatarError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Identity */}
      <section className="rounded-xl border border-line bg-white p-4 space-y-4">
        <h3 className="text-sm font-bold text-ink">{t("identity") || "Identity"}</h3>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {t("email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-subtle border border-line rounded-lg text-ink-light cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-ink-muted">{t("emailNote")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-sm font-medium text-ink">
              {t("fullName")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                id="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-ink">
              {t("phone")}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t("phonePlaceholder")}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact & billing */}
      <section className="rounded-xl border border-line bg-white p-4 space-y-4">
        <h3 className="text-sm font-bold text-ink">
          {t("contactInfo") || "Contact & billing"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="website" className="block text-sm font-medium text-ink">
              {t("website") || "Website"}
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                id="website"
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://zyrix.co"
                dir="ltr"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="billingEmail" className="block text-sm font-medium text-ink">
              {t("billingEmail") || "Billing email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                id="billingEmail"
                type="email"
                value={form.billingEmail}
                onChange={(e) =>
                  setForm({ ...form, billingEmail: e.target.value })
                }
                placeholder="billing@example.com"
                dir="ltr"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Region & language */}
      <section className="rounded-xl border border-line bg-white p-4 space-y-4">
        <h3 className="text-sm font-bold text-ink">
          {t("locale") || "Region & language"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="timezone" className="block text-sm font-medium text-ink">
              {t("timezone") || "Timezone"}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
              <select
                id="timezone"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                dir="ltr"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              <Languages className="inline w-3.5 h-3.5 me-1 align-text-bottom" />
              {t("preferredLocale") || "Preferred language"}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["en", "ar", "tr"] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setForm({ ...form, preferredLocale: loc })}
                  className={cn(
                    "px-2 py-2 text-xs font-semibold rounded-lg border transition-colors",
                    form.preferredLocale === loc
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white border-line text-ink hover:bg-bg-subtle"
                  )}
                >
                  {loc === "en" ? "English" : loc === "ar" ? "العربية" : "Türkçe"}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-muted">
              {t("preferredLocaleHint") ||
                "Used for emails + notifications. Web UI uses the selector in the header."}
            </p>
          </div>
        </div>
      </section>

      {/* Notification preferences */}
      <section className="rounded-xl border border-line bg-white p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">
          {t("notifications") || "Notifications"}
        </h3>
        <div className="space-y-1.5">
          {NOTIFICATION_KEYS.map((key) => {
            const enabled = form.notificationPrefs[key] ?? true;
            return (
              <label
                key={key}
                className="flex items-center justify-between gap-3 py-1.5 cursor-pointer"
              >
                <span className="text-sm text-ink flex-1">
                  {t(`notif.${key}`) || labelFromKey(key)}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => toggleNotification(key)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
                    enabled ? "bg-primary-600" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow",
                      enabled ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
              </label>
            );
          })}
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "px-6 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white",
          "hover:bg-primary-700 disabled:opacity-60",
          "flex items-center gap-2 transition-all"
        )}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {t("save")}
      </button>
    </form>
  );
}

function labelFromKey(key: string): string {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
