"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Percent,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  X,
  AlertTriangle,
  Sparkles,
  Star,
  Globe,
} from "lucide-react";
import {
  fetchTaxRates,
  fetchTaxPresets,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
  seedTaxPresets,
  type TaxRate,
  type PresetCountry,
  type CreateTaxRateDto,
} from "@/lib/api/tax";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TaxPresetStrip } from "@/components/tax/TaxPresetStrip";

// ============================================================================
// TAX ENGINE PAGE
// ============================================================================

const COUNTRY_FLAG: Record<string, string> = {
  TR: "🇹🇷",
  SA: "🇸🇦",
  AE: "🇦🇪",
  EG: "🇪🇬",
  QA: "🇶🇦",
  KW: "🇰🇼",
  US: "🇺🇸",
  GB: "🇬🇧",
};

type FormState = {
  name: string;
  code: string;
  countryCode: string;
  ratePercent: string;
  isDefault: boolean;
  isActive: boolean;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  code: "",
  countryCode: "",
  ratePercent: "0",
  isDefault: false,
  isActive: true,
  description: "",
};

export default function TaxPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Tax");

  const [rates, setRates] = useState<TaxRate[]>([]);
  const [presets, setPresets] = useState<PresetCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const [seedingCountry, setSeedingCountry] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, p] = await Promise.all([fetchTaxRates(), fetchTaxPresets()]);
      setRates(r);
      setPresets(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr(null);
    setModalOpen(true);
  };

  const openEdit = (r: TaxRate) => {
    setEditing(r);
    setForm({
      name: r.name,
      code: r.code ?? "",
      countryCode: r.countryCode ?? "",
      ratePercent: String(r.ratePercent),
      isDefault: r.isDefault,
      isActive: r.isActive,
      description: r.description ?? "",
    });
    setFormErr(null);
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setFormErr(t("errors.enterName"));
      return;
    }
    const pct = Number(form.ratePercent);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setFormErr(t("errors.invalidRate"));
      return;
    }
    setSaving(true);
    setFormErr(null);
    try {
      const dto: CreateTaxRateDto = {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        countryCode: form.countryCode.trim() || undefined,
        ratePercent: pct,
        isDefault: form.isDefault,
        isActive: form.isActive,
        description: form.description.trim() || undefined,
      };
      if (editing) {
        await updateTaxRate(editing.id, dto);
      } else {
        await createTaxRate(dto);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await deleteTaxRate(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const handleSeed = async (country: string) => {
    if (!confirm(t("confirm.seed", { country }))) return;
    setSeedingCountry(country);
    try {
      const result = await seedTaxPresets(country);
      alert(
        t("alerts.seeded", {
          created: String(result.created),
          skipped: String(result.skipped),
        })
      );
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setSeedingCountry(null);
    }
  };

  // Group rates by country
  const grouped = rates.reduce<Record<string, TaxRate[]>>((acc, r) => {
    const key = r.countryCode || "—";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const seededCountries = new Set(
    rates
      .map((r) => r.countryCode)
      .filter((c): c is string => Boolean(c))
  );

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">TAX ENGINE</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Percent className="w-6 h-6 text-cyan-300" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("addRate")}
          </button>
        </div>

        {/* Presets quick-seed — Sprint 14t: country-aware single-card + dropdown */}
        {presets.length > 0 && (
          <TaxPresetStrip
            presets={presets}
            seededCountries={seededCountries}
            seedingCountry={seedingCountry}
            onSeed={handleSeed}
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-300 bg-rose-500/10 rounded-xl">
            <AlertTriangle className="w-5 h-5 inline ltr:mr-2 rtl:ml-2" />
            {error}
          </div>
        ) : rates.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-sky-300" />
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs mt-1">{t("empty.subtitle")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([country, items]) => (
              <div
                key={country}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="bg-muted px-5 py-3 border-b border-border flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-300" />
                  <span className="text-base">
                    {COUNTRY_FLAG[country] || ""}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {country === "—" ? t("noCountry") : country}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    ({items.length})
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-card border-b border-sky-50">
                    <tr className="text-left rtl:text-right text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-2 font-semibold">
                        {t("table.name")}
                      </th>
                      <th className="px-4 py-2 font-semibold">
                        {t("table.code")}
                      </th>
                      <th className="px-4 py-2 font-semibold ltr:text-right rtl:text-left">
                        {t("table.rate")}
                      </th>
                      <th className="px-4 py-2 font-semibold">
                        {t("table.status")}
                      </th>
                      <th className="px-4 py-2 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-sky-50 hover:bg-muted/40"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {r.name}
                            </span>
                            {r.isDefault && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 ring-1 ring-amber-500/30 rounded text-[10px] font-medium">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                {t("default")}
                              </span>
                            )}
                          </div>
                          {r.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-md">
                              {r.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {r.code || "—"}
                        </td>
                        <td className="px-4 py-2.5 ltr:text-right rtl:text-left font-bold text-foreground">
                          {Number(r.ratePercent)}%
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              r.isActive
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 ring-1 ring-emerald-500/30"
                                : "bg-muted text-muted-foreground ring-1 ring-border"
                            }`}
                          >
                            {r.isActive ? t("active") : t("inactive")}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1 ltr:justify-end rtl:justify-start">
                            <button
                              onClick={() => openEdit(r)}
                              className="p-1 text-muted-foreground hover:text-cyan-300"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-1 text-muted-foreground hover:text-rose-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaxFormModal
          t={t}
          editing={editing}
          form={form}
          setForm={setForm}
          formErr={formErr}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// Form Modal
// ============================================================================
function TaxFormModal({
  t,
  editing,
  form,
  setForm,
  formErr,
  saving,
  onClose,
  onSave,
}: {
  t: ReturnType<typeof useTranslations>;
  editing: TaxRate | null;
  form: FormState;
  setForm: (f: FormState) => void;
  formErr: string | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {editing ? t("form.editTitle") : t("form.createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.name")} *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("form.namePlaceholder")}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("form.ratePercent")} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  value={form.ratePercent}
                  onChange={(e) =>
                    setForm({ ...form, ratePercent: e.target.value })
                  }
                  className="w-full ltr:pr-8 rtl:pl-8 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-xs text-muted-foreground">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t("form.code")}
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. KDV_18"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.countryCode")}
            </label>
            <select
              value={form.countryCode}
              onChange={(e) =>
                setForm({ ...form, countryCode: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— {t("form.noCountry")} —</option>
              <option value="TR">🇹🇷 Turkey</option>
              <option value="SA">🇸🇦 Saudi Arabia</option>
              <option value="AE">🇦🇪 UAE</option>
              <option value="EG">🇪🇬 Egypt</option>
              <option value="QA">🇶🇦 Qatar</option>
              <option value="KW">🇰🇼 Kuwait</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t("form.description")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="w-4 h-4 rounded border-sky-300 text-cyan-300 focus:ring-primary"
              />
              <span className="text-sm text-foreground">
                {t("form.isDefault")}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-sky-300 text-cyan-300 focus:ring-primary"
              />
              <span className="text-sm text-foreground">
                {t("form.isActive")}
              </span>
            </label>
          </div>

          {formErr && (
            <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm p-2 rounded-lg border border-red-100">
              {formErr}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? t("actions.save") : t("actions.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
