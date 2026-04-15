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
  gold: "#D4820A",
};

interface Customer {
  id: string;
  name: string;
  phone: string;
  country: string;
  flag: string;
  totalSpend: number;
  currency: string;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  status: "active" | "vip" | "at-risk";
  lastActivity: string;
}

const DEMO_CUSTOMERS: Customer[] = [
  { id: "1", name: "Ahmed Al-Rashid", phone: "+966 55 123 4567", country: "SA", flag: "🇸🇦", totalSpend: 48200, currency: "SAR", level: "Gold", status: "active", lastActivity: "2025-01-14" },
  { id: "2", name: "Fatima Hassan", phone: "+971 50 234 5678", country: "AE", flag: "🇦🇪", totalSpend: 12400, currency: "AED", level: "Silver", status: "active", lastActivity: "2025-01-13" },
  { id: "3", name: "Mehmet Yilmaz", phone: "+90 532 345 6789", country: "TR", flag: "🇹🇷", totalSpend: 186000, currency: "TRY", level: "Platinum", status: "vip", lastActivity: "2025-01-14" },
  { id: "4", name: "Sara Al-Otaibi", phone: "+965 60 456 7890", country: "KW", flag: "🇰🇼", totalSpend: 32100, currency: "KWD", level: "Gold", status: "vip", lastActivity: "2025-01-12" },
  { id: "5", name: "Khalid Ibrahim", phone: "+974 33 567 8901", country: "QA", flag: "🇶🇦", totalSpend: 3200, currency: "QAR", level: "Bronze", status: "at-risk", lastActivity: "2024-12-20" },
  { id: "6", name: "Layla Karimi", phone: "+973 36 678 9012", country: "BH", flag: "🇧🇭", totalSpend: 8900, currency: "BHD", level: "Silver", status: "active", lastActivity: "2025-01-10" },
];

const levelCfg = {
  Bronze: { color: "#92400E", bg: "#FEF3C7", icon: "🥉" },
  Silver: { color: "#374151", bg: "#F3F4F6", icon: "🥈" },
  Gold: { color: "#92400E", bg: "#FEF3C7", icon: "🥇" },
  Platinum: { color: "#6D28D9", bg: "#F3EEFF", icon: "💎" },
};

const statusCfg = {
  active: { color: "#059669", bg: "#ECFDF5", label: "Active" },
  vip: { color: "#6D28D9", bg: "#F3EEFF", label: "VIP" },
  "at-risk": { color: "#DC2626", bg: "#FEF2F2", label: "At Risk" },
};

export default function CustomersPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string): string {
    return locale === "ar" ? ar : locale === "tr" ? tr : en;
  }

  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", country: "SA", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("zyrix_merchant_token");
    if (!token) return;
    fetch(`${API}/api/customers?filter=${filter === "all" ? "" : filter}&search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d?.data) setCustomers(d.data); })
      .catch(() => {});
  }, [filter, search]);

  const filtered = customers.filter(c => {
    const mf = filter === "all" || c.status === filter;
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    return mf && ms;
  });

  const addCustomer = async () => {
    const token = localStorage.getItem("zyrix_merchant_token");
    try {
      const res = await fetch(`${API}/api/customers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const d = await res.json();
      if (d?.data) setCustomers(p => [d.data, ...p]);
    } catch {
      const mock: Customer = { id: Date.now().toString(), name: newCustomer.name, phone: newCustomer.phone, country: newCustomer.country, flag: "🌍", totalSpend: 0, currency: "USD", level: "Bronze", status: "active", lastActivity: new Date().toISOString().split("T")[0] };
      setCustomers(p => [mock, ...p]);
    }
    setShowModal(false);
    setNewCustomer({ name: "", phone: "", country: "SA", email: "" });
  };

  const filters = [
    ["all", L("All", "الكل", "Tümü")],
    ["active", L("Active", "نشط", "Aktif")],
    ["vip", "VIP"],
    ["at-risk", L("At Risk", "في خطر", "Risk Altında")],
  ];

  const inputStyle: React.CSSProperties = { padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 13, color: C.text, outline: "none", backgroundColor: C.bgCard };

  return (
    <div style={{ fontFamily: font, backgroundColor: C.bg, minHeight: "100vh" }} dir={dir}>
      <header style={{ backgroundColor: C.bgCard, borderBottom: `1.5px solid ${C.border}`, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize: 13, color: C.primary, fontWeight: 700, textDecoration: "none" }}>← {L("Dashboard", "اللوحة", "Panel")}</a>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>👥 {L("Customers", "العملاء", "Müşteriler")}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: font, fontSize: 12, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
            📥 {L("Import CSV", "استيراد CSV", "CSV İçe Aktar")}
          </button>
          <button onClick={() => setShowModal(true)} style={{ padding: "8px 18px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            + {L("Add Customer", "إضافة عميل", "Müşteri Ekle")}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 5, backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
            {filters.map(([val, label], i) => (
              <button key={i} onClick={() => setFilter(val)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: font, fontSize: 12, fontWeight: 700,
                backgroundColor: filter === val ? C.primary : "transparent",
                color: filter === val ? "#FFFFFF" : C.textLight,
              }}>{label}</button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L("Search customers...", "بحث في العملاء...", "Müşteri ara...")} style={{ ...inputStyle, width: 220 }} />
        </div>

        <div style={{ backgroundColor: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font }}>
            <thead>
              <tr style={{ backgroundColor: C.bgAlt }}>
                {[L("Customer", "العميل", "Müşteri"), L("Phone", "الهاتف", "Telefon"), L("Country", "الدولة", "Ülke"), L("Total Spend", "إجمالي الإنفاق", "Toplam Harcama"), L("Level", "المستوى", "Seviye"), L("Status", "الحالة", "Durum"), L("Last Activity", "آخر نشاط", "Son Aktivite"), ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: dir === "rtl" ? "right" : "left", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const lc = levelCfg[c.level];
                const sc = statusCfg[c.status];
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => setSelectedCustomer(c)}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: `${C.primary}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: C.textLight }}>{c.flag} {c.country}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: C.textMid }}>{c.phone}</td>
                    <td style={{ padding: "13px 16px", fontSize: 18 }}>{c.flag}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 800, color: C.text }}>{c.totalSpend.toLocaleString()} {c.currency}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: lc.color, backgroundColor: lc.bg, padding: "3px 9px", borderRadius: 20 }}>{lc.icon} {c.level}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: "3px 9px", borderRadius: 20 }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: C.textLight }}>{c.lastActivity}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <button onClick={e => { e.stopPropagation(); setSelectedCustomer(c); }} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 11, fontWeight: 700, color: C.primary, cursor: "pointer" }}>
                        {L("View", "عرض", "Görüntüle")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.textLight, fontSize: 14 }}>
              {L("No customers found", "لا يوجد عملاء", "Müşteri bulunamadı")}
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Panel */}
      {selectedCustomer && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 1000 }} onClick={e => e.target === e.currentTarget && setSelectedCustomer(null)}>
          <div style={{ width: 420, height: "100vh", backgroundColor: C.bgCard, boxShadow: "-8px 0 40px rgba(0,0,0,.15)", padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: C.text }}>{L("Customer Details", "تفاصيل العميل", "Müşteri Detayları")}</div>
              <button onClick={() => setSelectedCustomer(null)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: C.bgAlt, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: `${C.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{selectedCustomer.name}</div>
                <div style={{ fontSize: 12, color: C.textLight }}>{selectedCustomer.flag} {selectedCustomer.country} · {selectedCustomer.phone}</div>
              </div>
            </div>
            {[
              [L("Total Spend", "إجمالي الإنفاق", "Toplam Harcama"), `${selectedCustomer.totalSpend.toLocaleString()} ${selectedCustomer.currency}`],
              [L("Loyalty Level", "مستوى الولاء", "Sadakat Seviyesi"), `${levelCfg[selectedCustomer.level].icon} ${selectedCustomer.level}`],
              [L("Status", "الحالة", "Durum"), statusCfg[selectedCustomer.status].label],
              [L("Last Activity", "آخر نشاط", "Son Aktivite"), selectedCustomer.lastActivity],
            ].map(([label, value], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                💬 WhatsApp
              </button>
              <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ✏️ {L("Edit", "تعديل", "Düzenle")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ backgroundColor: C.bgCard, borderRadius: 20, padding: "28px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 20 }}>{L("Add Customer", "إضافة عميل", "Müşteri Ekle")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                [L("Full Name", "الاسم الكامل", "Ad Soyad"), "name", "text"],
                [L("Phone", "الهاتف", "Telefon"), "phone", "tel"],
                [L("Email", "البريد الإلكتروني", "E-posta"), "email", "email"],
              ].map(([label, key, type], i) => (
                <div key={i}>
                  <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input type={type} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box" }} value={newCustomer[key as keyof typeof newCustomer]} onChange={e => setNewCustomer(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{L("Country", "الدولة", "Ülke")}</label>
                <select style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 14, color: C.text, outline: "none", appearance: "none" }} value={newCustomer.country} onChange={e => setNewCustomer(p => ({ ...p, country: e.target.value }))}>
                  {[["SA","🇸🇦 Saudi Arabia"],["AE","🇦🇪 UAE"],["TR","🇹🇷 Turkey"],["KW","🇰🇼 Kuwait"],["QA","🇶🇦 Qatar"]].map(([v, l], i) => <option key={i} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${C.border}`, backgroundColor: "transparent", fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textMid, cursor: "pointer" }}>
                {L("Cancel", "إلغاء", "İptal")}
              </button>
              <button onClick={addCustomer} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", backgroundColor: C.primary, color: "#FFFFFF", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {L("Add Customer", "إضافة العميل", "Müşteri Ekle")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}