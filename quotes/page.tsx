"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://zyrix-backend-production.up.railway.app";
const font = "'DM Sans', 'Outfit', system-ui, sans-serif";
const C = {
  primary: "#6D28D9", primaryLight: "#8B5CF6",
  bg: "#F3EEFF", bgAlt: "#F8F4FF", bgCard: "#FFFFFF",
  border: "#DDD6FE", text: "#1A0A2E", textMid: "#3B1F6A", textLight: "#6B5C8A",
  success: "#059669", successBg: "#ECFDF5",
  warning: "#D97706", warningBg: "#FFFBEB",
  danger: "#DC2626", dangerBg: "#FEF2F2",
  gray: "#6B7280", grayBg: "#F9FAFB",
  finsuite: "#D4820A",
};

interface Quote {
  id: string;
  quoteNumber: string;
  customer: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  expiresAt: string;
  createdAt: string;
}

const DEMO_QUOTES: Quote[] = [
  { id: "1", quoteNumber: "QUO-0001", customer: "Ahmed Al-Rashid", amount: 48000, currency: "SAR", status: "accepted", expiresAt: "2025-02-01", createdAt: "2025-01-10" },
  { id: "2", quoteNumber: "QUO-0002", customer: "Fatima Hassan", amount: 12400, currency: "AED", status: "sent", expiresAt: "2025-01-28", createdAt: "2025-01-12" },
  { id: "3", quoteNumber: "QUO-0003", customer: "Mehmet Yilmaz", amount: 85000, currency: "TRY", status: "draft", expiresAt: "2025-02-10", createdAt: "2025-01-14" },
  { id: "4", quoteNumber: "QUO-0004", customer: "Sara Al-Otaibi", amount: 32000, currency: "KWD", status: "rejected", expiresAt: "2025-01-15", createdAt: "2025-01-05" },
  { id: "5", quoteNumber: "QUO-0005", customer: "Khalid Ibrahim", amount: 8900, currency: "USD", status: "expired", expiresAt: "2025-01-10", createdAt: "2024-12-28" },
  { id: "6", quoteNumber: "QUO-0006", customer: "Layla Karimi", amount: 21000, currency: "SAR", status: "sent", expiresAt: "2025-02-05", createdAt: "2025-01-13" },
];

const statusCfg = {
  draft: { color: "#6B7280", bg: "#F9FAFB", border: "#D1D5DB", label: "Draft" },
  sent: { color: "#0891B2", bg: "#ECFEFF", border: "#67E8F9", label: "Sent" },
  accepted: { color: "#059669", bg: "#ECFDF5", border: "#6EE7B7", label: "Accepted" },
  rejected: { color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", label: "Rejected" },
  expired: { color: "#9CA3AF", bg: "#F3F4F6", border: "#D1D5DB", label: "Expired" },
};

const sym: Record<string, string> = { SAR: "﷼", AED: "د.إ", TRY: "₺", KWD: "د.ك", USD: "$", EUR: "€" };

export default function QuotesPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string): string {
    return locale === "ar" ? ar : locale === "tr" ? tr : en;
  }

  const [quotes, setQuotes] = useState<Quote[]>(DEMO_QUOTES);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [newQuote, setNewQuote] = useState({ customer: "", amount: "", currency: "SAR", expiresAt: "", notes: "" });
  const [converting, setConverting] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("zyrix_merchant_token");
    if (!token) return;
    fetch(`${API}/api/quotes?status=${filter === "all" ? "" : filter}&search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d?.data) setQuotes(d.data); })
      .catch(() => {});
  }, [filter, search]);

  const filtered = quotes.filter(q => {
    const mf = filter === "all" || q.status === filter;
    const ms = !search || q.customer.toLowerCase().includes(search.toLowerCase()) || q.quoteNumber.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const createQuote = async () => {
    const token = localStorage.getItem("zyrix_merchant_token");
    try {
      const res = await fetch(`${API}/api/quotes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...newQuote, amount: parseFloat(newQuote.amount) || 0, status: "draft" }),
      });
      const d = await res.json();
      if (d?.data) setQuotes(p => [d.data, ...p]);
    } catch {
      const mock: Quote = { id: Date.now().toString(), quoteNumber: `QUO-${String(quotes.length + 1).padStart(4, "0")}`, customer: newQuote.customer, amount: parseFloat(newQuote.amount) || 0, currency: newQuote.currency, status: "draft", expiresAt: newQuote.expiresAt, createdAt: new Date().toISOString().split("T")[0] };
      setQuotes(p => [mock, ...p]);
    }
    setShowModal(false);
    setNewQuote({ customer: "", amount: "", currency: "SAR", expiresAt: "", notes: "" });
  };

  const sendQuote = async (id: string) => {
    const token = localStorage.getItem("zyrix_merchant_token");
    try {
      await fetch(`${API}/api/quotes/${id}/send`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    setQuotes(p => p.map(q => q.id === id ? { ...q, status: "sent" } : q));
  };

  const convertToInvoice = async (id: string) => {
    setConverting(id);
    const token = localStorage.getItem("zyrix_merchant_token");
    try {
      await fetch(`${API}/api/quotes/${id}/convert-to-invoice`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      alert(L("Quote converted to invoice successfully!", "تم تحويل العرض إلى فاتورة بنجاح!", "Teklif başarıyla faturaya dönüştürüldü!"));
    } catch {
      alert(L("Converted to invoice (demo mode)", "تم التحويل (وضع تجريبي)", "Dönüştürüldü (demo)"));
    }
    setConverting(null);
  };

  const filters = [
    ["all", L("All", "الكل", "Tümü")],
    ["draft", L("Draft", "مسودة", "Taslak")],
    ["sent", L("Sent", "مُرسل", "Gönderildi")],
    ["accepted", L("Accepted", "مقبول", "Kabul Edildi")],
    ["rejected", L("Rejected", "مرفوض", "Reddedildi")],
    ["expired", L("Expired", "منتهي", "Süresi Doldu")],
  ];

  const inputStyle: React.CSSProperties = { padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 13, color: C.text, outline: "none", backgroundColor: C.bgCard, width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: font, backgroundColor: C.bg, minHeight: "100vh" }} dir={dir}>
      <header style={{ backgroundColor: C.bgCard, borderBottom: `1.5px solid ${C.border}`, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize: 13, color: C.primary, fontWeight: 700, textDecoration: "none" }}>← {L("Dashboard", "اللوحة", "Panel")}</a>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>📋 {L("Quotes", "عروض الأسعار", "Teklifler")}</span>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "8px 18px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + {L("Create Quote", "إنشاء عرض", "Teklif Oluştur")}
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: L("Total Quotes", "إجمالي العروض", "Toplam Teklifler"), value: String(quotes.length), color: C.primary },
            { label: L("Accepted", "مقبولة", "Kabul Edildi"), value: String(quotes.filter(q => q.status === "accepted").length), color: C.success },
            { label: L("Pending", "معلقة", "Beklemede"), value: String(quotes.filter(q => q.status === "sent").length), color: C.warning },
            { label: L("Win Rate", "معدل القبول", "Kabul Oranı"), value: `${Math.round((quotes.filter(q => q.status === "accepted").length / quotes.length) * 100)}%`, color: C.success },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 5, backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, flexWrap: "wrap" }}>
            {filters.map(([val, label], i) => (
              <button key={i} onClick={() => setFilter(val)} style={{
                padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: font, fontSize: 11, fontWeight: 700,
                backgroundColor: filter === val ? C.primary : "transparent",
                color: filter === val ? "#FFFFFF" : C.textLight,
              }}>{label}</button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L("Search quotes...", "بحث في العروض...", "Teklif ara...")} style={{ ...inputStyle, width: 200 }} />
        </div>

        {/* Table */}
        <div style={{ backgroundColor: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font }}>
            <thead>
              <tr style={{ backgroundColor: C.bgAlt }}>
                {[L("Quote #", "رقم العرض", "Teklif #"), L("Customer", "العميل", "Müşteri"), L("Amount", "المبلغ", "Tutar"), L("Status", "الحالة", "Durum"), L("Expires", "ينتهي", "Bitiş"), L("Actions", "الإجراءات", "İşlemler")].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: dir === "rtl" ? "right" : "left", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => {
                const sc = statusCfg[q.status];
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: C.primary }}>{q.quoteNumber}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>{q.customer}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 800, color: C.text }}>{sym[q.currency] || ""}{q.amount.toLocaleString()} {q.currency}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, padding: "3px 9px", borderRadius: 20 }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: new Date(q.expiresAt) < new Date() ? C.danger : C.textLight, fontWeight: new Date(q.expiresAt) < new Date() ? 700 : 400 }}>
                      {q.expiresAt}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <button onClick={() => setPreviewQuote(q)} style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                          👁️
                        </button>
                        {q.status === "draft" && (
                          <button onClick={() => sendQuote(q.id)} style={{ padding: "4px 10px", borderRadius: 7, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            {L("Send", "إرسال", "Gönder")}
                          </button>
                        )}
                        {q.status === "accepted" && (
                          <button onClick={() => convertToInvoice(q.id)} disabled={converting === q.id} style={{ padding: "4px 10px", borderRadius: 7, border: "none", backgroundColor: C.finsuite, color: "#FFFFFF", fontFamily: font, fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: converting === q.id ? 0.6 : 1 }}>
                            {converting === q.id ? "..." : L("→ Invoice", "→ فاتورة", "→ Fatura")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.textLight, fontSize: 14 }}>
              {L("No quotes found", "لا توجد عروض", "Teklif bulunamadı")}
            </div>
          )}
        </div>
      </div>

      {/* Quote Preview Portal */}
      {previewQuote && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={e => e.target === e.currentTarget && setPreviewQuote(null)}>
          <div style={{ backgroundColor: C.bgCard, borderRadius: 20, padding: "36px", width: "100%", maxWidth: 520, boxShadow: "0 24px 80px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 20, color: C.text }}>Zyrix CRM</div>
                <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{L("Quote Preview", "معاينة العرض", "Teklif Önizleme")}</div>
              </div>
              <button onClick={() => setPreviewQuote(null)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: C.bgAlt, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ borderTop: `2px solid ${C.primary}`, borderBottom: `1px solid ${C.border}`, padding: "16px 0", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{L("Quote Number", "رقم العرض", "Teklif No")}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{previewQuote.quoteNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{L("Customer", "العميل", "Müşteri")}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{previewQuote.customer}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{L("Valid Until", "صالح حتى", "Geçerlilik")}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{previewQuote.expiresAt}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>Status</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: statusCfg[previewQuote.status].color, backgroundColor: statusCfg[previewQuote.status].bg, padding: "2px 8px", borderRadius: 20 }}>{statusCfg[previewQuote.status].label}</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: `${C.primary}08`, borderRadius: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.textMid }}>{L("Total Amount", "المبلغ الإجمالي", "Toplam Tutar")}</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: C.primary }}>{sym[previewQuote.currency] || ""}{previewQuote.amount.toLocaleString()} {previewQuote.currency}</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPreviewQuote(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                {L("Close", "إغلاق", "Kapat")}
              </button>
              {previewQuote.status === "accepted" && (
                <button onClick={() => { convertToInvoice(previewQuote.id); setPreviewQuote(null); }} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", backgroundColor: C.finsuite, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {L("Convert to Invoice →", "تحويل إلى فاتورة →", "Faturaya Dönüştür →")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ backgroundColor: C.bgCard, borderRadius: 20, padding: "28px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 20 }}>{L("Create Quote", "إنشاء عرض", "Teklif Oluştur")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                [L("Customer Name", "اسم العميل", "Müşteri Adı"), "customer", "text"],
                [L("Amount", "المبلغ", "Tutar"), "amount", "number"],
                [L("Expiry Date", "تاريخ الانتهاء", "Bitiş Tarihi"), "expiresAt", "date"],
              ].map(([label, key, type], i) => (
                <div key={i}>
                  <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input type={type} style={inputStyle} value={newQuote[key as keyof typeof newQuote]} onChange={e => setNewQuote(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{L("Currency", "العملة", "Para Birimi")}</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={newQuote.currency} onChange={e => setNewQuote(p => ({ ...p, currency: e.target.value }))}>
                  {["SAR", "AED", "TRY", "KWD", "USD", "EUR"].map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{L("Notes", "ملاحظات", "Notlar")}</label>
                <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={newQuote.notes} onChange={e => setNewQuote(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                {L("Cancel", "إلغاء", "İptal")}
              </button>
              <button onClick={createQuote} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {L("Create Quote", "إنشاء العرض", "Teklif Oluştur")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}