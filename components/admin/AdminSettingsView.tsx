"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchSuperAdmins,
  inviteSuperAdmin,
  revokeSuperAdmin,
  changeAdminPassword,
  getAdminUser,
  type SuperAdminRow,
} from "@/lib/api/admin";
import {
  Settings as SettingsIcon,
  UserPlus,
  ShieldCheck,
  Loader2,
  Trash2,
  Check,
  Copy,
  X,
  Lock,
  KeyRound,
} from "lucide-react";

// ============================================================================
// ADMIN SETTINGS VIEW
// ============================================================================

interface Props {
  locale: string;
}

export default function AdminSettingsView({ locale: _locale }: Props) {
  const t = useTranslations("Admin.settings");

  const me = getAdminUser();

  const [admins, setAdmins] = useState<SuperAdminRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invitedResult, setInvitedResult] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);
  const [copiedTemp, setCopiedTemp] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchSuperAdmins();
      setAdmins(rows);
    } catch (err) {
      console.error(err);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleInvite() {
    if (!inviteEmail.trim()) {
      alert(t("emailRequired"));
      return;
    }
    setInviting(true);
    try {
      const res = await inviteSuperAdmin({
        email: inviteEmail.trim(),
        fullName: inviteName.trim() || undefined,
      });
      setInvitedResult({
        email: res.email,
        tempPassword: res.tempPassword,
      });
      setInviteEmail("");
      setInviteName("");
      await load();
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (
              err.response as {
                data?: { error?: { message?: string } };
              }
            ).data?.error?.message
          : null;
      alert(msg ?? t("inviteError"));
    } finally {
      setInviting(false);
    }
  }

  async function handleRevoke(row: SuperAdminRow) {
    if (!confirm(t("confirmRevoke", { email: row.email }))) return;
    try {
      await revokeSuperAdmin(row.id);
      await load();
    } catch (err) {
      console.error(err);
      alert(t("revokeError"));
    }
  }

  async function handleChangePassword() {
    setPwError(null);
    setPwSuccess(false);
    if (newPassword.length < 8) {
      setPwError(t("passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(t("passwordsMismatch"));
      return;
    }
    setChangingPw(true);
    try {
      await changeAdminPassword({ currentPassword, newPassword });
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (
              err.response as {
                data?: { error?: { message?: string } };
              }
            ).data?.error?.message
          : null;
      setPwError(msg ?? t("passwordChangeError"));
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
      </div>

      {/* Change password card */}
      <div className="rounded-xl bg-white border border-sky-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-sky-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            {t("changePassword")}
          </h2>
        </div>
        <div className="max-w-md space-y-3">
          <PwField
            label={t("currentPassword")}
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PwField
            label={t("newPassword")}
            value={newPassword}
            onChange={setNewPassword}
          />
          <PwField
            label={t("confirmPassword")}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {pwError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              <Check size={14} />
              {t("passwordChanged")}
            </div>
          )}
          <button
            onClick={handleChangePassword}
            disabled={changingPw}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {changingPw && <Loader2 size={14} className="animate-spin" />}
            <KeyRound size={14} />
            {t("updatePassword")}
          </button>
        </div>
      </div>

      {/* Super admins card */}
      <div className="rounded-xl bg-white border border-sky-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-sky-500" />
            <h2 className="text-sm font-semibold text-slate-900">
              {t("superAdmins")}
            </h2>
            <span className="text-xs text-slate-500">
              ({admins?.length ?? 0})
            </span>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            <UserPlus size={14} />
            {t("invite")}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-sky-500" size={24} />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              {error}
            </div>
          </div>
        ) : !admins || admins.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            {t("noSuperAdmins")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("email")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("name")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("twoFactor")}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {t("lastLogin")}
                  </th>
                  <th className="px-4 py-3 text-end font-semibold">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {admins.map((row) => {
                  const isSelf = me?.id === row.id;
                  return (
                    <tr key={row.id} className="hover:bg-sky-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {row.email}
                        </div>
                        {isSelf && (
                          <div className="text-xs text-sky-600 font-semibold">
                            {t("you")}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {row.fullName}
                      </td>
                      <td className="px-4 py-3">
                        {row.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2 py-0.5 text-xs font-medium">
                            <Check size={12} />
                            {t("enabled")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 px-2 py-0.5 text-xs font-medium">
                            {t("disabled")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {row.lastLoginAt
                          ? new Date(row.lastLoginAt).toLocaleString()
                          : t("never")}
                      </td>
                      <td className="px-4 py-3 text-end">
                        {isSelf ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <button
                            onClick={() => handleRevoke(row)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={12} />
                            {t("revoke")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-sky-100">
            <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {invitedResult ? t("inviteSentTitle") : t("inviteNewAdmin")}
              </h2>
              <button
                onClick={() => {
                  setShowInvite(false);
                  setInvitedResult(null);
                }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            {invitedResult ? (
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  {t("inviteSentDescription", { email: invitedResult.email })}
                </p>
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1">
                    {t("tempPassword")}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm font-mono text-sky-900 break-all">
                      {invitedResult.tempPassword}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          invitedResult.tempPassword
                        );
                        setCopiedTemp(true);
                        setTimeout(() => setCopiedTemp(false), 1500);
                      }}
                      className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                      title={t("copy")}
                    >
                      {copiedTemp ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  {t("tempPasswordWarning")}
                </div>
                <button
                  onClick={() => {
                    setShowInvite(false);
                    setInvitedResult(null);
                  }}
                  className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("done")}
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("email")}
                    <span className="text-red-500 ms-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Full name (optional)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowInvite(false)}
                    disabled={inviting}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={inviting}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg disabled:opacity-50"
                  >
                    {inviting && <Loader2 size={14} className="animate-spin" />}
                    <UserPlus size={14} />
                    {t("sendInvite")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PwField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
        autoComplete="new-password"
      />
    </div>
  );
}
