"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Shield,
  ChevronDown,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  listCompanyUsers,
  listRoles,
  assignUserRole,
  type TeamMember,
  type Role,
} from "@/lib/api/roles";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

type BuiltInRole = "owner" | "admin" | "manager" | "member";

const BUILT_IN_LABELS: Record<BuiltInRole, { en: string; ar: string; tr: string }> = {
  owner: { en: "Owner", ar: "مالك", tr: "Sahip" },
  admin: { en: "Admin", ar: "مسؤول", tr: "Yönetici" },
  manager: { en: "Manager", ar: "مدير", tr: "Müdür" },
  member: { en: "Member", ar: "عضو", tr: "Üye" },
};

const ROLE_ORDER: BuiltInRole[] = ["owner", "admin", "manager", "member"];

export default function TeamUsersPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const { hasPermission, user: me, isLoading: authLoading } = useAuth();
  const canEdit = hasPermission("settings:users");

  const [users, setUsers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userList, roleList] = await Promise.all([
        listCompanyUsers(),
        listRoles().catch(() => [] as Role[]),
      ]);
      setUsers(userList);
      setRoles(roleList);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  const customRoles = useMemo(() => roles.filter((r) => !r.isSystem), [roles]);

  const handleBuiltInChange = async (user: TeamMember, nextRole: BuiltInRole) => {
    if (user.role === nextRole && !user.customRoleId) return;
    setSavingUserId(user.id);
    setError(null);
    try {
      // Changing built-in role clears any custom role override by default —
      // the picker below still lets the owner re-apply a custom role.
      await assignUserRole(user.id, { role: nextRole, customRoleId: null });
      await load();
      setSuccess(
        tr(
          `Role updated for ${user.fullName}.`,
          `تم تحديث دور ${user.fullName}.`,
          `${user.fullName} için rol güncellendi.`
        )
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSavingUserId(null);
    }
  };

  const handleCustomRoleChange = async (
    user: TeamMember,
    nextCustomRoleId: string | null
  ) => {
    if (user.customRoleId === nextCustomRoleId) return;
    setSavingUserId(user.id);
    setError(null);
    try {
      await assignUserRole(user.id, { customRoleId: nextCustomRoleId });
      await load();
      setSuccess(
        tr(
          `Custom role updated for ${user.fullName}.`,
          `تم تحديث الدور المخصص لـ ${user.fullName}.`,
          `${user.fullName} için özel rol güncellendi.`
        )
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/settings`}
              className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-cyan-700"
            >
              <ArrowLeft
                className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </Link>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {tr("Team members", "أعضاء الفريق", "Ekip üyeleri")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Manage who has access and what they can do.",
                  "أدر من لديه الوصول وماذا يمكنه فعله.",
                  "Kimin erişimi olduğunu ve ne yapabileceğini yönetin."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Banners */}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2 text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex items-start gap-2 text-sm text-rose-700 whitespace-pre-line">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {!canEdit && !loading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 text-sm text-amber-900">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {tr(
                "You can view team members but only users with settings:users can edit roles.",
                "يمكنك عرض أعضاء الفريق لكن فقط المستخدمون بصلاحية settings:users يمكنهم تعديل الأدوار.",
                "Ekip üyelerini görebilirsiniz ancak yalnızca settings:users iznine sahip kullanıcılar rolleri düzenleyebilir."
              )}
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-200 bg-white p-10 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {tr(
                "No team members yet.",
                "لا يوجد أعضاء فريق بعد.",
                "Henüz ekip üyesi yok."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                isSelf={me?.id === u.id}
                canEdit={canEdit}
                saving={savingUserId === u.id}
                customRoles={customRoles}
                locale={locale}
                tr={tr}
                onBuiltInChange={handleBuiltInChange}
                onCustomRoleChange={handleCustomRoleChange}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// USER ROW
// ============================================================================

function UserRow({
  user,
  isSelf,
  canEdit,
  saving,
  customRoles,
  locale,
  tr,
  onBuiltInChange,
  onCustomRoleChange,
}: {
  user: TeamMember;
  isSelf: boolean;
  canEdit: boolean;
  saving: boolean;
  customRoles: Role[];
  locale: Locale;
  tr: (en: string, ar: string, trk: string) => string;
  onBuiltInChange: (u: TeamMember, r: BuiltInRole) => void;
  onCustomRoleChange: (u: TeamMember, id: string | null) => void;
}) {
  const initials = user.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  const disabled = !canEdit || saving || isSelf;
  const disabledReason = isSelf
    ? tr(
        "You can't change your own role here.",
        "لا يمكنك تغيير دورك من هنا.",
        "Kendi rolünüzü buradan değiştiremezsiniz."
      )
    : !canEdit
    ? tr("Insufficient permission", "صلاحية غير كافية", "Yetersiz izin")
    : undefined;

  return (
    <div
      className={`rounded-xl border p-4 flex items-start gap-3 ${
        user.status === "disabled"
          ? "border-slate-200 bg-slate-50"
          : "border-sky-100 bg-white"
      }`}
    >
      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials || "?"}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-cyan-900">{user.fullName}</h3>
          {isSelf && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
              {tr("You", "أنت", "Sen")}
            </span>
          )}
          {user.status === "disabled" && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              {tr("Disabled", "معطل", "Devre dışı")}
            </span>
          )}
        </div>
        <p
          className="text-xs text-slate-500 truncate"
          dir={locale === "ar" ? "ltr" : undefined}
        >
          {user.email}
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Built-in role picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              {tr("Built-in role", "الدور الأساسي", "Yerleşik rol")}
            </label>
            <div className="relative">
              <select
                value={user.role}
                disabled={disabled}
                title={disabledReason}
                onChange={(e) =>
                  onBuiltInChange(user, e.target.value as BuiltInRole)
                }
                className="w-full appearance-none bg-white border border-sky-200 rounded-lg px-3 py-2 pr-8 rtl:pl-8 rtl:pr-3 text-xs font-semibold text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {ROLE_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {BUILT_IN_LABELS[r][locale]}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                  locale === "ar" ? "left-2" : "right-2"
                }`}
              />
            </div>
          </div>
          {/* Custom role picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              {tr(
                "Custom role (optional)",
                "دور مخصص (اختياري)",
                "Özel rol (isteğe bağlı)"
              )}
            </label>
            <div className="relative">
              <select
                value={user.customRoleId ?? ""}
                disabled={disabled || customRoles.length === 0}
                title={
                  customRoles.length === 0
                    ? tr(
                        "Create a custom role first at /settings/roles.",
                        "أنشئ دورًا مخصصًا أولاً من /settings/roles.",
                        "Önce /settings/roles üzerinden bir özel rol oluşturun."
                      )
                    : disabledReason
                }
                onChange={(e) =>
                  onCustomRoleChange(user, e.target.value || null)
                }
                className="w-full appearance-none bg-white border border-sky-200 rounded-lg px-3 py-2 pr-8 rtl:pl-8 rtl:pr-3 text-xs font-semibold text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {tr(
                    "— use built-in role —",
                    "— استخدام الدور الأساسي —",
                    "— yerleşik rolü kullan —"
                  )}
                </option>
                {customRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                  locale === "ar" ? "left-2" : "right-2"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-shrink-0">
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
        ) : user.customRoleId ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200"
            title={tr("Custom role active", "دور مخصص نشط", "Özel rol aktif")}
          >
            <Shield className="w-2.5 h-2.5" />
            {tr("Custom", "مخصص", "Özel")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
