"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  GripVertical,
  Settings,
  RotateCcw,
  Save,
  Loader2,
  Check,
  Pencil,
  Maximize2,
} from "lucide-react";
import {
  getDashboardLayout,
  saveDashboardLayout,
  resetDashboardLayout,
  type DashboardWidget,
  type WidgetWidth,
} from "@/lib/api/advanced";
import { WidgetRenderer } from "./WidgetRenderer";
import { WIDGET_REGISTRY, getWidgetMeta, ACCENT_BG } from "./registry";

// ============================================================================
// DASHBOARD GRID
// ----------------------------------------------------------------------------
// The customizable widget surface. Normal mode: renders widgets read-only.
// Edit mode: drag to reorder, remove with X button, resize via width dropdown,
// 'Add widget' opens a library modal. Save button persists via PUT, Reset
// deletes the user's layout so future reads fall through to company/default.
// ============================================================================

// Tailwind grid column spans — map widget.width → col-span class.
// Static strings so the JIT includes them in the final bundle.
const WIDTH_SPAN: Record<WidgetWidth, string> = {
  full: "md:col-span-12",
  half: "md:col-span-6",
  third: "md:col-span-4",
  quarter: "md:col-span-3",
};

const WIDTH_LABELS: Record<
  WidgetWidth,
  { en: string; ar: string; tr: string }
> = {
  full: { en: "Full", ar: "كامل", tr: "Tam" },
  half: { en: "Half", ar: "نصف", tr: "Yarı" },
  third: { en: "Third", ar: "ثلث", tr: "Üçte bir" },
  quarter: { en: "Quarter", ar: "ربع", tr: "Çeyrek" },
};

// Cheap UUID — no need for crypto polyfill; local drag IDs only.
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function DashboardGrid({ locale }: { locale: "en" | "ar" | "tr" }) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [originalWidgets, setOriginalWidgets] = useState<DashboardWidget[]>([]);
  const [source, setSource] = useState<"user" | "company" | "default">("default");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Drag-drop state — simple HTML5 DnD, no external lib.
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const layout = await getDashboardLayout();
      setWidgets(layout.widgets);
      setOriginalWidgets(layout.widgets);
      setSource(layout.source);
    } catch (e) {
      console.error("Load layout failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const hasChanges =
    JSON.stringify(widgets) !== JSON.stringify(originalWidgets);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveDashboardLayout(widgets);
      setWidgets(result.widgets);
      setOriginalWidgets(result.widgets);
      setSource("user");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      setEditMode(false);
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        tr(
          "Reset your dashboard to the default layout?",
          "إعادة تعيين لوحة التحكم للتخطيط الافتراضي؟",
          "Panoyu varsayılan düzene sıfırlansın mı?"
        )
      )
    )
      return;
    setSaving(true);
    try {
      const layout = await resetDashboardLayout();
      setWidgets(layout.widgets);
      setOriginalWidgets(layout.widgets);
      setSource(layout.source);
      setEditMode(false);
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setWidgets(originalWidgets);
    setEditMode(false);
  };

  const removeWidget = (id: string) => {
    setWidgets((ws) => ws.filter((w) => w.id !== id));
  };

  const changeWidth = (id: string, width: WidgetWidth) => {
    setWidgets((ws) => ws.map((w) => (w.id === id ? { ...w, width } : w)));
  };

  const addWidget = (type: string) => {
    const meta = getWidgetMeta(type);
    if (!meta) return;
    const newWidget: DashboardWidget = {
      id: uid(),
      type,
      width: meta.defaultWidth,
    };
    setWidgets((ws) => [...ws, newWidget]);
    setShowLibrary(false);
  };

  // Drag-reorder implementation
  const onDragStart = (id: string) => setDraggedId(id);
  const onDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;
    setWidgets((ws) => {
      const fromIdx = ws.findIndex((w) => w.id === draggedId);
      const toIdx = ws.findIndex((w) => w.id === overId);
      if (fromIdx === -1 || toIdx === -1) return ws;
      const next = [...ws];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const onDragEnd = () => setDraggedId(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Settings className="w-3.5 h-3.5" />
          <span>
            {source === "user"
              ? tr("Your custom layout", "تخطيطك المخصص", "Özel düzeniniz")
              : source === "company"
                ? tr(
                    "Company default layout",
                    "التخطيط الافتراضي للشركة",
                    "Şirket varsayılan düzeni"
                  )
                : tr("Default layout", "التخطيط الافتراضي", "Varsayılan düzen")}
          </span>
          {justSaved && (
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
              <Check className="w-3 h-3" />
              {tr("Saved", "تم الحفظ", "Kaydedildi")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <button
                onClick={() => setShowLibrary(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                {tr("Add widget", "إضافة ويدجت", "Widget ekle")}
              </button>
              <button
                onClick={handleReset}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {tr("Reset", "إعادة تعيين", "Sıfırla")}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {tr("Cancel", "إلغاء", "İptal")}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {tr("Save", "حفظ", "Kaydet")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground"
            >
              <Pencil className="w-3.5 h-3.5" />
              {tr("Customize", "تخصيص", "Özelleştir")}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {widgets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm font-semibold text-foreground">
            {tr("Empty dashboard", "لوحة فارغة", "Boş pano")}
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            {tr(
              "Add widgets to see your most important data at a glance.",
              "أضف ويدجات لرؤية أهم بياناتك في لمحة.",
              "En önemli verilerinizi tek bakışta görmek için widget ekleyin."
            )}
          </p>
          <button
            onClick={() => {
              setEditMode(true);
              setShowLibrary(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            {tr("Add your first widget", "أضف أول ويدجت", "İlk widget'ı ekle")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {widgets.map((widget) => {
            const meta = getWidgetMeta(widget.type);
            const isDragged = draggedId === widget.id;
            return (
              <div
                key={widget.id}
                className={`${WIDTH_SPAN[widget.width]} relative transition-opacity ${
                  isDragged ? "opacity-40" : ""
                }`}
                draggable={editMode}
                onDragStart={() => onDragStart(widget.id)}
                onDragOver={(e) => onDragOver(e, widget.id)}
                onDragEnd={onDragEnd}
              >
                {/* Edit controls overlay */}
                {editMode && (
                  <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-10 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-0.5 shadow-sm">
                    <button
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-cyan-300 hover:bg-muted cursor-grab active:cursor-grabbing"
                      title={tr("Drag", "اسحب", "Sürükle")}
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </button>
                    <select
                      value={widget.width}
                      onChange={(e) =>
                        changeWidth(widget.id, e.target.value as WidgetWidth)
                      }
                      className="text-[10px] bg-transparent border-0 font-semibold text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
                      title={tr("Width", "العرض", "Genişlik")}
                    >
                      {(["full", "half", "third", "quarter"] as WidgetWidth[]).map(
                        (w) => (
                          <option key={w} value={w}>
                            {WIDTH_LABELS[w][locale]}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10"
                      title={tr("Remove", "إزالة", "Kaldır")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <WidgetRenderer widget={widget} locale={locale} />
              </div>
            );
          })}
        </div>
      )}

      {/* Widget library modal */}
      {showLibrary && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLibrary(false)}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div
            className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {tr("Add a widget", "إضافة ويدجت", "Widget ekle")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tr(
                    "Pick from the library — you can resize and reorder later.",
                    "اختر من المكتبة — يمكنك تغيير الحجم والترتيب لاحقًا.",
                    "Kütüphaneden seçin — boyutu ve sırayı daha sonra değiştirebilirsiniz."
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowLibrary(false)}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WIDGET_REGISTRY.map((meta) => {
                const Icon = meta.icon;
                return (
                  <button
                    key={meta.type}
                    onClick={() => addWidget(meta.type)}
                    className="text-left rtl:text-right p-3 rounded-xl border border-border hover:border-sky-300 hover:bg-muted/50 transition-colors flex items-start gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ACCENT_BG[meta.accent] || ACCENT_BG.cyan}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">
                        {meta.label[locale]}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {meta.description[locale]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
