"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Check,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissionCatalog,
  type Role,
  type Permission,
  type PermissionEntry,
  type PermissionModule,
} from "@/lib/api/roles";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

const MODULE_ORDER: PermissionModule[] = [
  "customers",
  "deals",
  "quotes",
  "contracts",
  "invoices",
  "reports",
  "settings",
  "admin",
];

const MODULE_LABELS: Record<
  PermissionModule,
  { en: string; ar: string; tr: string }
> = {
  customers: { en: "Customers", ar: "العملاء", tr: "Müşteriler" },
  deals: { en: "Deals", ar: "الصفقات", tr: "Anlaşmalar" },
  quotes: { en: "Quotes", ar: "العروض", tr: "Teklifler" },
  contracts: { en: "Contracts", ar: "العقود", tr: "Sözleşmeler" },
  invoices: { en: "Invoices", ar: "الفواتير", tr: "Faturalar" },
  reports: { en: "Reports", ar: "التقارير", tr: "Raporlar" },
  settings: { en: "Settings", ar: "الإعدادات", tr: "Ayarlar" },
  admin: { en: "Admin", ar: "الإدارة", tr: "Yönetim" },
};

const SYSTEM_ROLE_LABEL: Record<
  string,
  { en: string; ar: string; tr: string }
> = {
  owner: { en: "Owner", ar: "مالك", tr: "Sahip" },
  admin: { en: "Admin", ar: "مسؤول", tr: "Yönetici" },
  manager: { en: "Manager", ar: "مدير", tr: "Müdür" },
  member: { en: "Member", ar: "عضو", tr: "Üye" },
};

export default function RolesPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const { hasPermission, isLoading: authLoading } = useAuth();
  const canEdit = hasPermission("settings:roles");

  const [roles, setRoles] = useState<Role[]>([]);
  const [catalog, setCatalog] = useState<PermissionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roleList, cat] = await Promise.all([
        listRoles(),
        fetchPermissionCatalog(),
      ]);
      setRoles(roleList);
      setCatalog(cat.catalog);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  const handleDelete = async (role: Role) => {
    if (
      !confirm(
        tr(
          `Delete "${role.name}"? Users assigned to this role will fall back to their built-in role.`,
          `حذف "${role.name}"؟ سيعود المستخدمون المعينون لهذا الدور إلى دورهم الأساسي.`,
          `"${role.name}" silinsin mi? Bu role atanmış kullanıcılar yerleşik rollerine dönecek.`
        )
      )
    )
      return;
    try {
      const result = await deleteRole(role.id);
      await load();
      setSuccess(
        tr(
          `Role deleted. ${result.detachedUsers} user(s) detached.`,
          `تم حذف الدور. تم فصل ${result.detachedUsers} مستخدم.`,
          `Rol silindi. ${result.detachedUsers} kullanıcının ataması kaldırıldı.`
        )
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const systemRoles = roles.filter((r) => r.isSystem);
  const customRoles = roles.filter((r) => !r.isSystem);

  return (
    <>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/settings`}
              className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
            >
              <ArrowLeft
                className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </Link>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
              <h1 className="text-2xl font-bold text-foreground">
                {tr("Roles & permissions", "الأدوار والصلاحيات", "Roller ve izinler")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {tr(
                  "Define who can see and do what across your Zyrix workspace.",
                  "حدد من يمكنه رؤية وفعل ماذا في مساحة عمل Zyrix.",
                  "Zyrix çalışma alanında kimin neyi görüp yapabileceğini tanımlayın."
                )}
              </p>
            </div>
          </div>
          {canEdit && !creatingNew && !editing && (
            <button
              onClick={() => setCreatingNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {tr("New role", "دور جديد", "Yeni rol")}
            </button>
          )}
        </div>

        {/* Banners */}
        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-2 text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2 text-sm text-rose-300 whitespace-pre-line">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {!canEdit && !loading && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2 text-sm text-amber-900">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {tr(
                "You can view roles but only account owners can edit them.",
                "يمكنك عرض الأدوار لكن فقط مالكو الحساب يمكنهم تعديلها.",
                "Rolleri görüntüleyebilirsiniz ancak yalnızca hesap sahipleri düzenleyebilir."
              )}
            </span>
          </div>
        )}

        {/* Form */}
        {(creatingNew || editing) && catalog.length > 0 && (
          <RoleForm
            locale={locale}
            tr={tr}
            editing={editing}
            catalog={catalog}
            onCancel={() => {
              setCreatingNew(false);
              setEditing(null);
            }}
            onSaved={() => {
              setCreatingNew(false);
              setEditing(null);
              setSuccess(
                tr(
                  "Role saved.",
                  "تم حفظ الدور.",
                  "Rol kaydedildi."
                )
              );
              setTimeout(() => setSuccess(null), 3000);
              load();
            }}
          />
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : (
          <>
            {/* System roles */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {tr("Built-in roles", "الأدوار الافتراضية", "Yerleşik roller")}
              </h2>
              {systemRoles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-card p-4 text-xs text-muted-foreground">
                  {tr(
                    "Built-in roles will appear here after the server seeds them.",
                    "ستظهر الأدوار الافتراضية هنا بعد أن يُنشئها الخادم.",
                    "Yerleşik roller, sunucu tarafından oluşturulduğunda burada görünecek."
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {systemRoles.map((r) => (
                    <RoleRow
                      key={r.id}
                      role={r}
                      locale={locale}
                      tr={tr}
                      canEdit={false}
                      onEdit={() => setEditing(r)}
                      onDelete={() => handleDelete(r)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Custom roles */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {tr("Custom roles", "الأدوار المخصصة", "Özel roller")}
              </h2>
              {customRoles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {tr(
                      "No custom roles yet.",
                      "لا توجد أدوار مخصصة بعد.",
                      "Henüz özel rol yok."
                    )}
                  </p>
                  {canEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {tr(
                        "Create one to give your team precise permissions.",
                        "أنشئ دورًا لإعطاء فريقك صلاحيات دقيقة.",
                        "Ekibinize kesin izinler vermek için bir rol oluşturun."
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {customRoles.map((r) => (
                    <RoleRow
                      key={r.id}
                      role={r}
                      locale={locale}
                      tr={tr}
                      canEdit={canEdit}
                      onEdit={() => setEditing(r)}
                      onDelete={() => handleDelete(r)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}

// ============================================================================
// ROLE ROW
// ============================================================================

function RoleRow({
  role,
  locale,
  tr,
  canEdit,
  onEdit,
  onDelete,
}: {
  role: Role;
  locale: Locale;
  tr: (en: string, ar: string, trk: string) => string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const displayName =
    role.isSystem && SYSTEM_ROLE_LABEL[role.name]
      ? SYSTEM_ROLE_LABEL[role.name][locale]
      : role.name;

  return (
    <div
      className={`rounded-xl border p-4 flex items-start gap-3 ${
        role.isSystem
          ? "border-border bg-muted/40"
          : "border-border bg-card"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${
          role.isSystem
            ? "bg-gradient-to-br from-teal-500 via-sky-400 to-sky-600 text-white"
            : "bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white"
        }`}
      >
        {role.isSystem ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Shield className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-foreground">{displayName}</h3>
          {role.isSystem && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-foreground border border-border">
              {tr("Built-in", "افتراضي", "Yerleşik")}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {role.permissions.length}{" "}
            {tr("permissions", "صلاحية", "izin")}
          </span>
        </div>
        {role.description && (
          <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {canEdit && !role.isSystem ? (
          <>
            <button
              onClick={onEdit}
              className="w-7 h-7 rounded text-muted-foreground hover:text-cyan-300 hover:bg-muted flex items-center justify-center"
              title={tr("Edit", "تعديل", "Düzenle")}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center"
              title={tr("Delete", "حذف", "Sil")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="px-2 py-1 text-[10px] font-bold uppercase text-cyan-300 hover:bg-muted rounded"
          >
            {tr("View", "عرض", "Görüntüle")}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FORM
// ============================================================================

function RoleForm({
  locale,
  tr,
  editing,
  catalog,
  onCancel,
  onSaved,
}: {
  locale: Locale;
  tr: (en: string, ar: string, trk: string) => string;
  editing: Role | null;
  catalog: PermissionEntry[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const readOnly = !!editing?.isSystem;
  const [name, setName] = useState(
    editing && editing.isSystem && SYSTEM_ROLE_LABEL[editing.name]
      ? SYSTEM_ROLE_LABEL[editing.name][locale]
      : editing?.name ?? ""
  );
  const [description, setDescription] = useState(editing?.description ?? "");
  const [selected, setSelected] = useState<Set<Permission>>(
    new Set(editing?.permissions ?? [])
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<PermissionModule>>(new Set());

  const grouped = useMemo(() => {
    const map = new Map<PermissionModule, PermissionEntry[]>();
    for (const m of MODULE_ORDER) map.set(m, []);
    for (const entry of catalog) {
      const bucket = map.get(entry.module);
      if (bucket) bucket.push(entry);
    }
    return map;
  }, [catalog]);

  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.trim().toLowerCase();
    const out = new Map<PermissionModule, PermissionEntry[]>();
    for (const [module, entries] of grouped) {
      const matches = entries.filter(
        (e) =>
          e.key.includes(q) ||
          e.label.en.toLowerCase().includes(q) ||
          e.label.ar.includes(search.trim()) ||
          e.label.tr.toLowerCase().includes(q)
      );
      if (matches.length > 0) out.set(module, matches);
    }
    return out;
  }, [grouped, search]);

  const togglePermission = (key: Permission) => {
    if (readOnly) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleModule = (module: PermissionModule, entries: PermissionEntry[]) => {
    if (readOnly) return;
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = entries.every((e) => next.has(e.key));
      if (allSelected) {
        for (const e of entries) next.delete(e.key);
      } else {
        for (const e of entries) next.add(e.key);
      }
      return next;
    });
  };

  const toggleCollapsed = (module: PermissionModule) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(module)) next.delete(module);
      else next.add(module);
      return next;
    });
  };

  const handleSave = async () => {
    if (readOnly) return;
    if (!name.trim()) {
      setErr(tr("Name is required", "الاسم مطلوب", "Ad gerekli"));
      return;
    }
    if (selected.size === 0) {
      setErr(
        tr(
          "Pick at least one permission",
          "اختر صلاحية واحدة على الأقل",
          "En az bir izin seçin"
        )
      );
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        permissions: Array.from(selected),
      };
      if (editing && !editing.isSystem) {
        await updateRole(editing.id, payload);
      } else if (!editing) {
        await createRole(payload);
      }
      onSaved();
    } catch (e) {
      setErr(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = selected.size;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          {readOnly
            ? tr("Built-in role", "دور افتراضي", "Yerleşik rol")
            : editing
            ? tr("Edit role", "تعديل الدور", "Rolü düzenle")
            : tr("New role", "دور جديد", "Yeni rol")}
        </h2>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded text-muted-foreground hover:bg-muted flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-300 whitespace-pre-line">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
            {tr("Name", "الاسم", "Ad")}
          </label>
          <input
            value={name}
            readOnly={readOnly}
            onChange={(e) => setName(e.target.value)}
            placeholder={tr(
              "Sales viewer",
              "مشاهد المبيعات",
              "Satış görüntüleyici"
            )}
            maxLength={100}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card disabled:bg-muted read-only:bg-muted read-only:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
            {tr("Description (optional)", "الوصف (اختياري)", "Açıklama (isteğe bağlı)")}
          </label>
          <input
            value={description ?? ""}
            readOnly={readOnly}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tr(
              "Can view revenue but not edit billing",
              "يستطيع عرض الإيرادات لكن ليس تعديل الفوترة",
              "Geliri görebilir ancak faturayı düzenleyemez"
            )}
            maxLength={500}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card read-only:bg-muted read-only:text-muted-foreground"
          />
        </div>
      </div>

      {/* Permission picker */}
      <div className="rounded-lg border border-border bg-card p-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            {tr("Permissions", "الصلاحيات", "İzinler")}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-cyan-300 text-[10px] font-bold">
              {selectedCount}/{catalog.length}
            </span>
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground ${
                locale === "ar" ? "right-2" : "left-2"
              }`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr("Search…", "بحث…", "Ara…")}
              className={`w-full py-1.5 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-card ${
                locale === "ar" ? "pr-7 pl-2" : "pl-7 pr-2"
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          {Array.from(filtered.entries()).map(([module, entries]) => {
            if (entries.length === 0) return null;
            const isCollapsed = collapsed.has(module);
            const allSelected = entries.every((e) => selected.has(e.key));
            const someSelected = entries.some((e) => selected.has(e.key));
            return (
              <div
                key={module}
                className="rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => toggleCollapsed(module)}
                    className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-cyan-300 hover:bg-card"
                  >
                    {isCollapsed ? (
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${isRtl(locale) ? "-scale-x-100" : ""}`}
                      />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="flex-1 text-xs font-bold text-foreground">
                    {MODULE_LABELS[module][locale]}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {entries.filter((e) => selected.has(e.key)).length}/
                    {entries.length}
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => toggleModule(module, entries)}
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                        allSelected
                          ? "bg-sky-500 text-white border-sky-500"
                          : someSelected
                          ? "bg-amber-500/10 text-amber-800 border-amber-500/30 hover:bg-amber-100"
                          : "bg-card text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {allSelected
                        ? tr("None", "لا شيء", "Hiçbiri")
                        : tr("All", "الكل", "Tümü")}
                    </button>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="divide-y divide-sky-100 border-t border-border">
                    {entries.map((entry) => {
                      const isChecked = selected.has(entry.key);
                      return (
                        <button
                          type="button"
                          key={entry.key}
                          onClick={() => togglePermission(entry.key)}
                          disabled={readOnly}
                          className={`w-full text-start flex items-start gap-2 p-2 ${
                            readOnly
                              ? "cursor-default"
                              : isChecked
                              ? "bg-muted/60 hover:bg-muted"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                              isChecked
                                ? "bg-sky-500 border-sky-500 text-white"
                                : "bg-card border-border"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground">
                                {entry.label[locale]}
                              </span>
                              <code className="text-[10px] text-muted-foreground font-mono">
                                {entry.key}
                              </code>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {entry.description[locale]}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          {readOnly
            ? tr("Close", "إغلاق", "Kapat")
            : tr("Cancel", "إلغاء", "İptal")}
        </button>
        {!readOnly && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editing
              ? tr("Save", "حفظ", "Kaydet")
              : tr("Create", "إنشاء", "Oluştur")}
          </button>
        )}
      </div>
    </div>
  );
}

function isRtl(locale: Locale) {
  return locale === "ar";
}
