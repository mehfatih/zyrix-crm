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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Network rules</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Platform-level geo blocks, rate limits, and reserved DDoS
              heuristics.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          New rule
        </button>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 text-sm text-emerald-900">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2 text-sm text-rose-300">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {showNew && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">New rule</h2>
            <button
              onClick={() => setShowNew(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
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
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {(Object.keys(TYPE_META) as NetworkRuleType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
                Label
              </label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Block Tor exit nodes"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
              Config (JSON)
            </label>
            <textarea
              value={newConfig}
              onChange={(e) => setNewConfig(e.target.value)}
              rows={6}
              dir="ltr"
              className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              {TYPE_META[newType].hint}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold"
            >
              Save rule
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <Network className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No rules yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((r) => {
            const Icon = TYPE_META[r.type as NetworkRuleType]?.icon ?? Network;
            return (
              <div
                key={r.id}
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  r.active ? "border-border bg-card" : "border-border bg-muted opacity-80"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.active
                      ? "bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white"
                      : "bg-slate-200 text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground">{r.label}</h3>
                    <code className="text-[10px] font-mono text-muted-foreground">
                      {r.type}
                    </code>
                    {!r.active && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-foreground">
                        Paused
                      </span>
                    )}
                  </div>
                  <pre
                    dir="ltr"
                    className="mt-1 bg-muted/60 border border-border rounded p-2 text-[10px] font-mono overflow-x-auto max-h-40"
                  >
                    {JSON.stringify(r.config, null, 2)}
                  </pre>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(r)}
                    className="w-7 h-7 rounded text-muted-foreground hover:text-cyan-300 hover:bg-muted flex items-center justify-center"
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
                    className="w-7 h-7 rounded text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center"
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
