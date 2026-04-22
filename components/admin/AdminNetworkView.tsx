"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Network,
  Shield,
  Timer,
  Activity,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  PowerOff,
  Power,
  X,
} from "lucide-react";
import {
  fetchNetworkRules,
  createNetworkRule,
  updateNetworkRule,
  deleteNetworkRule,
  type NetworkRule,
  type NetworkRuleType,
} from "@/lib/api/admin";

const TYPE_META: Record<
  NetworkRuleType,
  { label: string; icon: any; hint: string }
> = {
  geo_block: {
    label: "Geo block (CIDR deny list)",
    icon: Shield,
    hint: 'config: { "blockedCidrs": ["203.0.113.0/24", "198.51.100.42/32"] }',
  },
  rate_limit: {
    label: "Rate limit (per IP)",
    icon: Timer,
    hint: 'config: { "windowMs": 60000, "max": 600, "path": "/api/auth" }',
  },
  ddos_heuristic: {
    label: "DDoS heuristic (reserved, not yet applied)",
    icon: Activity,
    hint: 'config: { "windowMs": 1000, "spike": 200 } — persisted for future use',
  },
};

export default function AdminNetworkView({ locale }: { locale: string }) {
  const isRtl = locale === "ar";

  const [rules, setRules] = useState<NetworkRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newType, setNewType] = useState<NetworkRuleType>("geo_block");
  const [newLabel, setNewLabel] = useState("");
  const [newConfig, setNewConfig] = useState(
    '{\n  "blockedCidrs": []\n}'
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRules(await fetchNetworkRules());
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    setError(null);
    let parsedConfig: Record<string, unknown>;
    try {
      parsedConfig = JSON.parse(newConfig);
    } catch {
      setError("config must be valid JSON");
      return;
    }
    if (!newLabel.trim()) {
      setError("label required");
      return;
    }
    try {
      await createNetworkRule({
        type: newType,
        label: newLabel.trim(),
        config: parsedConfig,
      });
      setNewLabel("");
      setShowNew(false);
      await load();
      setSuccess("Rule created.");
      setTimeout(() => setSuccess(null), 2500);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    }
  };

  const handleToggle = async (rule: NetworkRule) => {
    try {
      await updateNetworkRule(rule.id, { active: !rule.active });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    }
  };

  const handleDelete = async (rule: NetworkRule) => {
    if (!confirm(`Delete "${rule.label}"?`)) return;
    try {
      await deleteNetworkRule(rule.id);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">Network rules</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Platform-level geo blocks, rate limits, and reserved DDoS
              heuristics.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          New rule
        </button>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-center gap-2 text-sm text-emerald-900">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex items-start gap-2 text-sm text-rose-700">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {showNew && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-cyan-900">New rule</h2>
            <button
              onClick={() => setShowNew(false)}
              className="text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
                Type
              </label>
              <select
                value={newType}
                onChange={(e) => {
                  const t = e.target.value as NetworkRuleType;
                  setNewType(t);
                  if (t === "geo_block") setNewConfig('{\n  "blockedCidrs": []\n}');
                  else if (t === "rate_limit")
                    setNewConfig(
                      '{\n  "windowMs": 60000,\n  "max": 600\n}'
                    );
                  else setNewConfig('{\n  "windowMs": 1000,\n  "spike": 200\n}');
                }}
                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {(Object.keys(TYPE_META) as NetworkRuleType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
                Label
              </label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Block Tor exit nodes"
                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">
              Config (JSON)
            </label>
            <textarea
              value={newConfig}
              onChange={(e) => setNewConfig(e.target.value)}
              rows={6}
              dir="ltr"
              className="w-full px-3 py-2 border border-sky-200 rounded-lg text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {TYPE_META[newType].hint}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold"
            >
              Save rule
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sky-200 bg-white p-10 text-center">
          <Network className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No rules yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((r) => {
            const Icon = TYPE_META[r.type as NetworkRuleType]?.icon ?? Network;
            return (
              <div
                key={r.id}
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  r.active ? "border-cyan-100 bg-white" : "border-slate-200 bg-slate-50 opacity-80"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.active
                      ? "bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-cyan-900">{r.label}</h3>
                    <code className="text-[10px] font-mono text-slate-500">
                      {r.type}
                    </code>
                    {!r.active && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                        Paused
                      </span>
                    )}
                  </div>
                  <pre
                    dir="ltr"
                    className="mt-1 bg-sky-50/60 border border-sky-100 rounded p-2 text-[10px] font-mono overflow-x-auto max-h-40"
                  >
                    {JSON.stringify(r.config, null, 2)}
                  </pre>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(r)}
                    className="w-7 h-7 rounded text-slate-500 hover:text-cyan-700 hover:bg-sky-50 flex items-center justify-center"
                    title={r.active ? "Pause" : "Activate"}
                  >
                    {r.active ? (
                      <PowerOff className="w-3.5 h-3.5" />
                    ) : (
                      <Power className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    className="w-7 h-7 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
