"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://zyrix-backend-production.up.railway.app";
const font = "'DM Sans', 'Outfit', system-ui, sans-serif";
const C = {
  primary: "#6D28D9", primaryLight: "#8B5CF6",
  bg: "#F3EEFF", bgAlt: "#F8F4FF", bgCard: "#FFFFFF",
  border: "#DDD6FE", text: "#1A0A2E", textMid: "#3B1F6A", textLight: "#6B5C8A",
  success: "#059669", successBg: "#ECFDF5",
  warning: "#D97706", warningBg: "#FFFBEB",
  danger: "#DC2626",
};

interface Deal {
  id: string;
  title: string;
  customer: string;
  amount: number;
  currency: string;
  probability: number;
  stage: string;
  owner: string;
  createdAt: string;
}

const STAGES = [
  { key: "lead", label: "Lead", color: "#6B7280", bg: "#F9FAFB" },
  { key: "qualified", label: "Qualified", color: "#0891B2", bg: "#ECFEFF" },
  { key: "proposal", label: "Proposal", color: "#D97706", bg: "#FFFBEB" },
  { key: "negotiation", label: "Negotiation", color: "#7C3AED", bg: "#F3EEFF" },
  { key: "won", label: "Won ✓", color: "#059669", bg: "#ECFDF5" },
];

const DEMO_DEALS: Deal[] = [
  { id: "1", title: "Enterprise License", customer: "Ahmed Al-Rashid", amount: 48000, currency: "SAR", probability: 80, stage: "negotiation", owner: "Sarah", createdAt: "2025-01-10" },
  { id: "2", title: "Pay Gateway Setup", customer: "Fatima Hassan", amount: 12000, currency: "AED", probability: 60, stage: "proposal", owner: "Khalid", createdAt: "2025-01-08" },
  { id: "3", title: "FinSuite Subscription", customer: "Mehmet Yilmaz", amount: 85000, currency: "TRY", probability: 40, stage: "qualified", owner: "Sarah", createdAt: "2025-01-12" },
  { id: "4", title: "CRM + Pay Bundle", customer: "Sara Al-Otaibi", amount: 25000, currency: "KWD", probability: 90, stage: "won", owner: "Ahmed", createdAt: "2025-01-05" },
  { id: "5", title: "Initial Contact", customer: "Layla Karimi", amount: 8000, currency: "USD", probability: 20, stage: "lead", owner: "Khalid", createdAt: "2025-01-14" },
  { id: "6", title: "Annual Contract", customer: "Omar Farouk", amount: 32000, currency: "SAR", probability: 70, stage: "proposal", owner: "Ahmed", createdAt: "2025-01-07" },
  { id: "7", title: "SME Package", customer: "Rania Aziz", amount: 6000, currency: "USD", probability: 30, stage: "lead", owner: "Sarah", createdAt: "2025-01-13" },
  { id: "8", title: "Multi-product Deal", customer: "Tariq Nasser", amount: 18000, currency: "AED", probability: 75, stage: "negotiation", owner: "Ahmed", createdAt: "2025-01-09" },
];

const sym: Record<string, string> = { SAR: "﷼", AED: "د.إ", TRY: "₺", KWD: "د.ك", USD: "$", EUR: "€" };

export default function PipelinePage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string): string {
    return locale === "ar" ? ar : locale === "tr" ? tr : en;
  }

  const [deals, setDeals] = useState<Deal[]>(DEMO_DEALS);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterOwner, setFilterOwner] = useState("all");
  const [newDeal, setNewDeal] = useState({ title: "", customer: "", amount: "", currency: "SAR", probability: "50", stage: "lead" });

  useEffect(() => {
    const token = localStorage.getItem("zyrix_merchant_token");
    if (!token) return;
    fetch(`${API}/api/deals`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d?.data) setDeals(d.data); })
      .catch(() => {});
  }, []);

  const stageDeals = (stageKey: string) =>
    deals.filter(d => d.stage === stageKey && (filterOwner === "all" || d.owner === filterOwner));

  const stageTotal = (stageKey: string) =>
    deals.filter(d => d.stage === stageKey).reduce((sum, d) => sum + d.amount, 0);

  const onDragStart = (id: string) => setDragging(id);
  const onDragEnd = () => { setDragging(null); setDragOver(null); };
  const onDrop = async (stageKey: string) => {
    if (!dragging) return;
    setDeals(p => p.map(d => d.id === dragging ? { ...d, stage: stageKey } : d));
    const token = localStorage.getItem("zyrix_merchant_token");
    try {
      await fetch(`${API}/api/deals/${dragging}/stage`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stageKey }),
      });
    } catch {}
    setDragging(null);
    setDragOver(null);
  };

  const addDeal = async () => {
    const token = localStorage.getItem("zyrix_merchant_token");
    const body = { ...newDeal, amount: parseFloat(newDeal.amount) || 0, probability: parseInt(newDeal.probability) || 50 };
    try {
      const res = await fetch(`${API}/api/deals`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d?.data) setDeals(p => [d.data, ...p]);
    } catch {
      setDeals(p => [{ id: Date.now().toString(), ...body, owner: "Me", createdAt: new Date().toISOString().split("T")[0] }, ...p]);
    }
    setShowModal(false);
    setNewDeal({ title: "", customer: "", amount: "", currency: "SAR", probability: "50", stage: "lead" });
  };

  const owners = ["all", ...Array.from(new Set(deals.map(d => d.owner)))];
  const inputStyle: React.CSSProperties = { padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 13, color: C.text, outline: "none", backgroundColor: C.bgCard, width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: font, backgroundColor: C.bg, minHeight: "100vh" }} dir={dir}>
      <header style={{ backgroundColor: C.bgCard, borderBottom: `1.5px solid ${C.border}`, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize: 13, color: C.primary, fontWeight: 700, textDecoration: "none" }}>← {L("Dashboard", "اللوحة", "Panel")}</a>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>🤝 {L("Pipeline", "خط المبيعات", "Satış Hattı")}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 12, color: C.text, outline: "none", backgroundColor: C.bgCard, appearance: "none", cursor: "pointer" }}>
            {owners.map((o, i) => <option key={i} value={o}>{o === "all" ? L("All Owners", "الكل", "Tümü") : o}</option>)}
          </select>
          <button onClick={() => setShowModal(true)} style={{ padding: "8px 18px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            + {L("Add Deal", "إضافة صفقة", "Fırsat Ekle")}
          </button>
        </div>
      </header>

      {/* Pipeline stats bar */}
      <div style={{ display: "flex", gap: 16, padding: "14px 28px", backgroundColor: C.bgCard, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {[
          { label: L("Total Pipeline", "إجمالي الخط", "Toplam Hat"), value: `$${(deals.reduce((s, d) => s + d.amount, 0) / 1000).toFixed(0)}K`, color: C.primary },
          { label: L("Open Deals", "صفقات مفتوحة", "Açık Fırsatlar"), value: String(deals.filter(d => d.stage !== "won").length), color: C.warning },
          { label: L("Won This Month", "مُغلق هذا الشهر", "Bu Ay Kazanılan"), value: String(deals.filter(d => d.stage === "won").length), color: C.success },
          { label: L("Win Rate", "معدل الفوز", "Kazanma Oranı"), value: `${Math.round((deals.filter(d => d.stage === "won").length / deals.length) * 100)}%`, color: C.success },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingInlineEnd: 16, borderInlineEnd: i < 3 ? `1px solid ${C.border}` : "none", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ padding: "20px 24px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 14, minWidth: "fit-content" }}>
          {STAGES.map((stage, si) => {
            const stageItems = stageDeals(stage.key);
            const total = stageTotal(stage.key);
            const isOver = dragOver === stage.key;
            return (
              <div
                key={si}
                onDragOver={e => { e.preventDefault(); setDragOver(stage.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(stage.key)}
                style={{
                  width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
                  backgroundColor: isOver ? `${stage.color}0C` : C.bgAlt,
                  border: `1.5px solid ${isOver ? stage.color : C.border}`,
                  borderRadius: 14, overflow: "hidden",
                  transition: "all .15s",
                }}
              >
                {/* Column header */}
                <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, backgroundColor: stage.bg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: stage.color }}>{stage.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", backgroundColor: stage.color, padding: "1px 7px", borderRadius: 10 }}>{stageItems.length}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>
                    {sym[deals[0]?.currency] || "$"}{total.toLocaleString()}
                  </div>
                </div>

                {/* Cards */}
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: 8, minHeight: 200, flex: 1 }}>
                  {stageItems.map((deal, di) => (
                    <div
                      key={di}
                      draggable
                      onDragStart={() => onDragStart(deal.id)}
                      onDragEnd={onDragEnd}
                      style={{
                        backgroundColor: C.bgCard, border: `1.5px solid ${C.border}`,
                        borderRadius: 11, padding: "12px 13px", cursor: "grab",
                        opacity: dragging === deal.id ? 0.5 : 1,
                        boxShadow: "0 1px 6px rgba(109,40,217,.06)",
                        borderInlineStart: `3px solid ${stage.color}`,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{deal.title}</div>
                      <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>👤 {deal.customer}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: stage.color }}>
                          {sym[deal.currency] || ""}{deal.amount.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: deal.probability >= 70 ? C.success : deal.probability >= 40 ? C.warning : C.danger, backgroundColor: deal.probability >= 70 ? C.successBg : deal.probability >= 40 ? C.warningBg : "#FEF2F2", padding: "2px 7px", borderRadius: 6 }}>
                          {deal.probability}%
                        </span>
                      </div>
                      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: `${C.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>
                        <span style={{ fontSize: 10, color: C.textLight }}>{deal.owner}</span>
                      </div>
                    </div>
                  ))}
                  {stageItems.length === 0 && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.textLight, fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                      {L("Drop here", "أسقط هنا", "Buraya bırak")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ backgroundColor: C.bgCard, borderRadius: 20, padding: "28px", width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 20 }}>{L("Add Deal", "إضافة صفقة", "Fırsat Ekle")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                [L("Deal Title", "عنوان الصفقة", "Fırsat Başlığı"), "title", "text"],
                [L("Customer Name", "اسم العميل", "Müşteri Adı"), "customer", "text"],
                [L("Deal Value", "قيمة الصفقة", "Fırsat Değeri"), "amount", "number"],
                [L("Probability %", "الاحتمالية %", "Olasılık %"), "probability", "number"],
              ].map(([label, key, type], i) => (
                <div key={i}>
                  <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input type={type} style={inputStyle} value={newDeal[key as keyof typeof newDeal]} onChange={e => setNewDeal(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{L("Currency", "العملة", "Para Birimi")}</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={newDeal.currency} onChange={e => setNewDeal(p => ({ ...p, currency: e.target.value }))}>
                    {["SAR", "AED", "TRY", "KWD", "USD", "EUR"].map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{L("Stage", "المرحلة", "Aşama")}</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={newDeal.stage} onChange={e => setNewDeal(p => ({ ...p, stage: e.target.value }))}>
                    {STAGES.map((s, i) => <option key={i} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                {L("Cancel", "إلغاء", "İptal")}
              </button>
              <button onClick={addDeal} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {L("Add Deal", "إضافة الصفقة", "Fırsat Ekle")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}