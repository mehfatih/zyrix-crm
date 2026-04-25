"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Star,
  Users,
  Briefcase,
  Activity as ActivityIcon,
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listBrands,
  getBrandStats,
  createBrand,
  updateBrand,
  setDefaultBrand,
  deleteBrand,
  type Brand,
  type BrandStats,
} from "@/lib/api/advanced";

// ============================================================================
// BRANDS CRUD PAGE
// ============================================================================

export default function BrandsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<Map<string, BrandStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [brandsData, statsData] = await Promise.all([
        listBrands({ includeArchived: showArchived }),
        getBrandStats(),
      ]);
      setBrands(brandsData);
      const map = new Map<string, BrandStats>();
      for (const s of statsData) {
        if (s.brandId) map.set(s.brandId, s);
      }
      setStats(map);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSetDefault = async (brand: Brand) => {
    try {
      await setDefaultBrand(brand.id);
      await load();
      setSuccess(tr("Default brand updated", "تم تحديث العلامة الافتراضية", "Varsayılan marka güncellendi"));
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleArchive = async (brand: Brand) => {
    if (
      !confirm(
        tr(
          `Archive "${brand.name}"? Rows tagged with this brand stay visible but the brand disappears from the switcher.`,
          `أرشفة "${brand.name}"؟ الصفوف الموسومة بهذه العلامة تبقى ظاهرة لكن العلامة تختفي من القائمة.`,
          `"${brand.name}" arşivlensin mi? Bu markayla etiketlenmiş satırlar görünür kalır, marka geçiş menüsünden kaybolur.`
        )
      )
    )
      return;
    try {
      await updateBrand(brand.id, { isArchived: true });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleUnarchive = async (brand: Brand) => {
    try {
      await updateBrand(brand.id, { isArchived: false });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (
      !confirm(
        tr(
          `Permanently delete "${brand.name}"? If any customers/deals/activities are tagged with it, the brand will be archived instead.`,
          `حذف "${brand.name}" نهائيًا؟ إذا كان مرتبطًا بعملاء/صفقات/أنشطة فستُأرشَف بدلاً من الحذف.`,
          `"${brand.name}" kalıcı olarak silinsin mi? Müşteriler/anlaşmalar/etkinlikler etiketliyse silinmek yerine arşivlenir.`
        )
      )
    )
      return;
    try {
      const result = await deleteBrand(brand.id);
      await load();
      if (result.archived) {
        setSuccess(
          tr(
            "Brand is in use — archived instead of deleted.",
            "العلامة مستخدمة — تمت أرشفتها بدلاً من حذفها.",
            "Marka kullanımda — silinmek yerine arşivlendi."
          )
        );
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
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
              className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-sky-600"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
            </Link>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-600 text-white flex items-center justify-center shadow">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">
                {tr("Brands", "العلامات التجارية", "Markalar")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Manage multiple brands under one Zyrix account.",
                  "إدارة عدة علامات تجارية من حساب Zyrix واحد.",
                  "Tek bir Zyrix hesabında birden fazla markayı yönetin."
                )}
              </p>
            </div>
          </div>
          {!creatingNew && !editing && (
            <button
              onClick={() => setCreatingNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {tr("New brand", "علامة جديدة", "Yeni marka")}
            </button>
          )}
        </div>

        {/* Banners */}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2 text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex items-start gap-2 text-sm text-rose-700">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {(creatingNew || editing) && (
          <BrandForm
            locale={locale}
            tr={tr}
            editing={editing}
            onCancel={() => {
              setCreatingNew(false);
              setEditing(null);
            }}
            onSaved={() => {
              setCreatingNew(false);
              setEditing(null);
              load();
            }}
          />
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : brands.length === 0 && !creatingNew ? (
          <div className="rounded-xl border border-dashed border-sky-200 bg-white p-10 text-center">
            <Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {tr(
                "No brands yet — create your first one.",
                "لا علامات بعد — أنشئ أول علامة.",
                "Henüz marka yok — ilkini oluştur."
              )}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="accent-sky-500"
                />
                {tr("Show archived", "عرض المؤرشفة", "Arşivlenmişleri göster")}
              </label>
            </div>
            <div className="space-y-2">
              {brands.map((b) => (
                <BrandRow
                  key={b.id}
                  brand={b}
                  stats={stats.get(b.id)}
                  locale={locale}
                  tr={tr}
                  onEdit={() => setEditing(b)}
                  onSetDefault={() => handleSetDefault(b)}
                  onArchive={() => handleArchive(b)}
                  onUnarchive={() => handleUnarchive(b)}
                  onDelete={() => handleDelete(b)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// BRAND ROW
// ============================================================================

function BrandRow({
  brand,
  stats,
  locale,
  tr,
  onEdit,
  onSetDefault,
  onArchive,
  onUnarchive,
  onDelete,
}: {
  brand: Brand;
  stats: BrandStats | undefined;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onEdit: () => void;
  onSetDefault: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}) {
  const initials = brand.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div
      className={`rounded-xl border p-4 ${
        brand.isArchived
          ? "border-slate-200 bg-slate-50 opacity-75"
          : "border-sky-100 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-lg text-white flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{
            background:
              brand.primaryColor ?? "linear-gradient(135deg, #0EA5E9, #38BDF8)",
          }}
        >
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-sm font-bold">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-sky-900">{brand.name}</h3>
            {brand.isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                <Star className="w-2.5 h-2.5" />
                {tr("Default", "افتراضي", "Varsayılan")}
              </span>
            )}
            {brand.isArchived && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                <Archive className="w-2.5 h-2.5" />
                {tr("Archived", "مؤرشفة", "Arşivlenmiş")}
              </span>
            )}
          </div>
          <code className="text-[11px] text-slate-500 font-mono" dir="ltr">
            {brand.slug}
          </code>
          {brand.description && (
            <p className="text-xs text-slate-600 mt-1">{brand.description}</p>
          )}
          {stats && (
            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stats.customerCount}{" "}
                {tr("customers", "عميل", "müşteri")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {stats.dealCount} {tr("deals", "صفقة", "anlaşma")}
              </span>
              <span className="inline-flex items-center gap-1">
                <ActivityIcon className="w-3 h-3" />
                {stats.activityCount}{" "}
                {tr("activities", "نشاط", "etkinlik")}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
          {!brand.isArchived && !brand.isDefault && (
            <button
              onClick={onSetDefault}
              className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white border border-amber-200 hover:bg-amber-50 text-amber-700"
              title={tr("Make default", "جعلها افتراضية", "Varsayılan yap")}
            >
              <Star className="w-3 h-3 inline" />
            </button>
          )}
          {!brand.isArchived ? (
            <>
              <button
                onClick={onEdit}
                className="w-7 h-7 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
                title={tr("Edit", "تعديل", "Düzenle")}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onArchive}
                className="w-7 h-7 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-50 flex items-center justify-center"
                title={tr("Archive", "أرشفة", "Arşivle")}
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onUnarchive}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase"
            >
              {tr("Restore", "استعادة", "Geri yükle")}
            </button>
          )}
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center"
            title={tr("Delete", "حذف", "Sil")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FORM
// ============================================================================

function BrandForm({
  locale,
  tr,
  editing,
  onCancel,
  onSaved,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  editing: Brand | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [slug, setSlug] = useState(editing?.slug ?? "");
  const [slugEditedManually, setSlugEditedManually] = useState(!!editing);
  const [primaryColor, setPrimaryColor] = useState(
    editing?.primaryColor ?? "#0EA5E9"
  );
  const [logoUrl, setLogoUrl] = useState(editing?.logoUrl ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Auto-generate slug from name unless user edited it manually
  useEffect(() => {
    if (slugEditedManually || editing) return;
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 62)
    );
  }, [name, slugEditedManually, editing]);

  const handleSave = async () => {
    if (!name.trim()) {
      setErr(tr("Name required", "الاسم مطلوب", "Ad gerekli"));
      return;
    }
    if (!slug || slug.length < 3) {
      setErr(
        tr("Slug must be 3+ chars", "المعرف يجب 3 أحرف+", "Slug 3+ karakter olmalı")
      );
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: name.trim(),
        slug,
        primaryColor: primaryColor || null,
        logoUrl: logoUrl.trim() || null,
        description: description.trim() || null,
      };
      if (editing) {
        await updateBrand(editing.id, payload);
      } else {
        await createBrand(payload);
      }
      onSaved();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-sky-900">
          {editing
            ? tr("Edit brand", "تعديل العلامة", "Markayı düzenle")
            : tr("New brand", "علامة جديدة", "Yeni marka")}
        </h2>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded text-slate-500 hover:bg-slate-100 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Name", "الاسم", "Ad")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Levana Cosmetics"
            maxLength={100}
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr(
              "Slug (URL identifier)",
              "المعرف في الرابط",
              "Slug (URL tanımlayıcısı)"
            )}
          </label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              setSlugEditedManually(true);
            }}
            placeholder="levana"
            maxLength={62}
            dir="ltr"
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Brand color", "لون العلامة", "Marka rengi")}
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-sky-200 focus-within:ring-2 focus-within:ring-sky-400 overflow-hidden bg-white">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-9 border-0 cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#0EA5E9"
              pattern="^#[0-9a-fA-F]{6}$"
              dir="ltr"
              className="flex-1 px-2 py-2 text-sm font-mono focus:outline-none bg-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
            {tr("Logo URL", "رابط الشعار", "Logo URL'si")}
          </label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://cdn.example.com/logo.png"
            dir="ltr"
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
          {tr("Description", "الوصف", "Açıklama")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder={tr(
            "What kind of products or services does this brand offer?",
            "ما نوع المنتجات أو الخدمات لهذه العلامة؟",
            "Bu marka ne tür ürün veya hizmet sunuyor?"
          )}
          className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
        />
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-sky-100 bg-white p-3 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg text-white flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: primaryColor }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs font-bold">
              {name
                .split(" ")
                .slice(0, 2)
                .map((w) => w.charAt(0).toUpperCase())
                .join("") || "??"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-sky-900">
            {name || tr("Brand name", "اسم العلامة", "Marka adı")}
          </div>
          <code className="text-xs text-slate-500 font-mono" dir="ltr">
            {slug || "brand-slug"}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </button>
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
          {editing ? tr("Save", "حفظ", "Kaydet") : tr("Create", "إنشاء", "Oluştur")}
        </button>
      </div>
    </div>
  );
}
