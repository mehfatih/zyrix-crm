"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://zyrix-backend-production.up.railway.app";
const font = "'DM Sans','Outfit',system-ui,sans-serif";
const C = {
  primary: "#6D28D9", bg: "#F3EEFF", bgAlt: "#F8F4FF", bgCard: "#fff",
  border: "#DDD6FE", text: "#1A0A2E", textMid: "#3B1F6A", textLight: "#6B5C8A",
  success: "#059669", successBg: "#ECFDF5",
  warning: "#D97706", danger: "#DC2626",
  wa: "#25D366", email: "#2563EB", sms: "#D97706",
};

interface Campaign {
  id: string; name: string; type: "whatsapp"|"email"|"sms";
  status: "active"|"draft"|"completed"|"paused";
  audience: string; sent: number; delivered: number;
  opened: number; clicked: number; converted: number;
  scheduledAt: string; createdAt: string;
}

const DEMO: Campaign[] = [
  { id:"1", name:"Ramadan Special Offer 🌙", type:"whatsapp", status:"active", audience:"All Customers", sent:1248, delivered:1190, opened:987, clicked:423, converted:89, scheduledAt:"2026-04-10 09:00", createdAt:"2026-04-09" },
  { id:"2", name:"Monthly Newsletter — April", type:"email", status:"completed", audience:"VIP Members", sent:340, delivered:332, opened:218, clicked:94, converted:31, scheduledAt:"2026-04-01 08:00", createdAt:"2026-03-28" },
  { id:"3", name:"Flash Sale — 24hrs", type:"sms", status:"completed", audience:"Gold + Platinum", sent:186, delivered:180, opened:180, clicked:92, converted:44, scheduledAt:"2026-04-05 12:00", createdAt:"2026-04-04" },
  { id:"4", name:"Win-back — Inactive Customers", type:"whatsapp", status:"paused", audience:"At-Risk", sent:0, delivered:0, opened:0, clicked:0, converted:0, scheduledAt:"2026-04-20 10:00", createdAt:"2026-04-12" },
  { id:"5", name:"Product Launch — Summer Line", type:"email", status:"draft", audience:"All Customers", sent:0, delivered:0, opened:0, clicked:0, converted:0, scheduledAt:"—", createdAt:"2026-04-14" },
];

const typeCfg = {
  whatsapp: { color:C.wa,    bg:"#E8FFF0", icon:"💬", label:"WhatsApp" },
  email:    { color:C.email, bg:"#EFF6FF", icon:"📧", label:"Email" },
  sms:      { color:C.sms,   bg:"#FFFBEB", icon:"📱", label:"SMS" },
};

const statusCfg = {
  active:    { color:"#059669", bg:"#ECFDF5", label:"Active" },
  draft:     { color:"#94A3B8", bg:"#F1F5F9", label:"Draft" },
  completed: { color:"#6D28D9", bg:"#F3EEFF", label:"Completed" },
  paused:    { color:"#D97706", bg:"#FFFBEB", label:"Paused" },
};

export default function CampaignsPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string) { return locale==="ar"?ar:locale==="tr"?tr:en; }

  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Campaign|null>(null);
  const [form, setForm] = useState({ name:"", type:"whatsapp", audience:"all", message:"" });

  useEffect(() => {
    const token = localStorage.getItem("zyrix_merchant_token");
    if (!token) return;
    fetch(`${API}/api/marketing-campaigns`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ if(d?.data) setCampaigns(d.data); }).catch(()=>{});
  }, []);

  const filtered = campaigns.filter(c => filter==="all" || c.status===filter || c.type===filter);

  const kpis = [
    { label:L("Total Campaigns","إجمالي الحملات","Toplam Kampanya"), value:campaigns.length, color:C.primary, icon:"📢" },
    { label:L("Total Sent","إجمالي المُرسَل","Toplam Gönderilen"), value:campaigns.reduce((s,c)=>s+c.sent,0).toLocaleString(), color:"#2563EB", icon:"📤" },
    { label:L("Avg Open Rate","متوسط فتح","Ort. Açılma"), value:`${Math.round(campaigns.filter(c=>c.sent>0).reduce((s,c)=>s+(c.opened/Math.max(c.delivered,1)*100),0)/Math.max(campaigns.filter(c=>c.sent>0).length,1))}%`, color:C.success, icon:"👁" },
    { label:L("Conversions","التحويلات","Dönüşümler"), value:campaigns.reduce((s,c)=>s+c.converted,0), color:C.warning, icon:"💰" },
  ];

  return (
    <div style={{ fontFamily:font, backgroundColor:C.bg, minHeight:"100vh" }} dir={dir}>
      <header style={{ backgroundColor:C.bgCard, borderBottom:`1.5px solid ${C.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize:13, color:C.primary, fontWeight:700, textDecoration:"none" }}>← {L("Dashboard","اللوحة","Panel")}</a>
          <span style={{ color:C.border }}>/</span>
          <span style={{ fontSize:14, fontWeight:800, color:C.text }}>📢 {L("Campaigns","الحملات","Kampanyalar")}</span>
        </div>
        <button onClick={()=>setShowCreate(true)} style={{ padding:"8px 18px", borderRadius:10, border:"none", backgroundColor:C.primary, color:"#fff", fontFamily:font, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          + {L("New Campaign","حملة جديدة","Yeni Kampanya")}
        </button>
      </header>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
          {kpis.map((k,i) => (
            <div key={i} style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"18px 20px", borderTop:`4px solid ${k.color}` }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{k.icon}</div>
              <div style={{ fontSize:24, fontWeight:900, color:k.color, fontFamily:"monospace" }}>{k.value}</div>
              <div style={{ fontSize:12, color:C.textLight, marginTop:4, fontWeight:600 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:5, backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:10, padding:4, marginBottom:20, flexWrap:"wrap" }}>
          {[
            ["all",L("All","الكل","Tümü")],
            ["active",L("Active","نشطة","Aktif")],
            ["draft",L("Draft","مسودة","Taslak")],
            ["completed",L("Completed","مكتملة","Tamamlandı")],
            ["whatsapp","💬 WhatsApp"],
            ["email","📧 Email"],
            ["sms","📱 SMS"],
          ].map(([val,label],i) => (
            <button key={i} onClick={()=>setFilter(val)} style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700, backgroundColor:filter===val?C.primary:"transparent", color:filter===val?"#fff":C.textLight }}>
              {label}
            </button>
          ))}
        </div>

        {/* Campaigns grid */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {filtered.map((c,i) => {
            const tc = typeCfg[c.type];
            const sc = statusCfg[c.status];
            const openRate = c.delivered > 0 ? Math.round((c.opened/c.delivered)*100) : 0;
            const clickRate = c.opened > 0 ? Math.round((c.clicked/c.opened)*100) : 0;
            const cvr = c.clicked > 0 ? Math.round((c.converted/c.clicked)*100) : 0;
            return (
              <div key={i} style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, padding:"20px 24px", cursor:"pointer" }} onClick={()=>setSelected(c)}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, backgroundColor:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{tc.icon}</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{c.name}</div>
                      <div style={{ fontSize:12, color:C.textLight, marginTop:2 }}>
                        <span style={{ color:tc.color, fontWeight:600 }}>{tc.label}</span>
                        {" · "}{c.audience}
                        {c.scheduledAt !== "—" && ` · ${c.scheduledAt}`}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:sc.color, backgroundColor:sc.bg, padding:"3px 10px", borderRadius:20 }}>{sc.label}</span>
                </div>
                {c.sent > 0 && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))", gap:10 }}>
                    {[
                      [L("Sent","مُرسَل","Gönderildi"), c.sent.toLocaleString(), "#2563EB"],
                      [L("Delivered","مُسلَّم","Teslim"), c.delivered.toLocaleString(), C.success],
                      [L("Opened","مفتوح","Açıldı"), `${openRate}%`, C.primary],
                      [L("Clicked","نُقر","Tıklandı"), `${clickRate}%`, C.warning],
                      [L("Converted","حُوِّل","Dönüştü"), `${cvr}%`, "#D4820A"],
                    ].map(([label,value,color],j) => (
                      <div key={j} style={{ backgroundColor:C.bgAlt, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:900, color:color as string, fontFamily:"monospace" }}>{value}</div>
                        <div style={{ fontSize:10, color:C.textLight, marginTop:2, fontWeight:600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {c.status === "draft" && (
                  <div style={{ marginTop:12, padding:"10px 14px", backgroundColor:C.bgAlt, borderRadius:10, fontSize:12, color:C.textLight }}>
                    📝 {L("Draft — not yet scheduled or sent","مسودة — لم يُجدول أو يُرسل بعد","Taslak — henüz zamanlanmadı veya gönderilmedi")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreate && (
        <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={e=>e.target===e.currentTarget&&setShowCreate(false)}>
          <div style={{ backgroundColor:C.bgCard, borderRadius:20, padding:28, width:"100%", maxWidth:500 }}>
            <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:20 }}>📢 {L("New Campaign","حملة جديدة","Yeni Kampanya")}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:5, textTransform:"uppercase" }}>{L("Campaign Name","اسم الحملة","Kampanya Adı")}</label>
                <input style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:14, color:C.text, outline:"none", boxSizing:"border-box" }} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder={L("e.g. Summer Sale Campaign","مثال: حملة تخفيضات الصيف","Örn: Yaz İndirim Kampanyası")} />
              </div>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:8, textTransform:"uppercase" }}>{L("Channel","القناة","Kanal")}</label>
                <div style={{ display:"flex", gap:8 }}>
                  {(["whatsapp","email","sms"] as const).map((t,i) => (
                    <button key={i} onClick={()=>setForm(p=>({...p,type:t}))} style={{ flex:1, padding:"10px 8px", borderRadius:10, border:`2px solid ${form.type===t?typeCfg[t].color:C.border}`, backgroundColor:form.type===t?typeCfg[t].bg:"transparent", color:form.type===t?typeCfg[t].color:C.textMid, fontFamily:font, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {typeCfg[t].icon} {typeCfg[t].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:5, textTransform:"uppercase" }}>{L("Target Audience","الجمهور","Hedef Kitle")}</label>
                <select style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:14, color:C.text, outline:"none", appearance:"none" }} value={form.audience} onChange={e=>setForm(p=>({...p,audience:e.target.value}))}>
                  {["all","vip","gold_platinum","at_risk","new"].map((a,i) => (
                    <option key={i} value={a}>{a==="all"?L("All Customers","جميع العملاء","Tüm Müşteriler"):a==="vip"?"VIP":a==="gold_platinum"?"Gold + Platinum":a==="at_risk"?L("At-Risk","في خطر","Risk Altında"):L("New Customers","عملاء جدد","Yeni Müşteriler")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:5, textTransform:"uppercase" }}>{L("Message","الرسالة","Mesaj")}</label>
                <textarea rows={4} style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:13, color:C.text, outline:"none", resize:"none", boxSizing:"border-box" }} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder={L("Write your campaign message...","اكتب رسالة حملتك...","Kampanya mesajınızı yazın...")} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:22 }}>
              <button onClick={()=>setShowCreate(false)} style={{ flex:1, padding:11, borderRadius:10, border:`1.5px solid ${C.border}`, backgroundColor:"transparent", fontFamily:font, fontSize:13, fontWeight:700, color:C.textMid, cursor:"pointer" }}>
                {L("Cancel","إلغاء","İptal")}
              </button>
              <button onClick={()=>{ if(form.name){ const mock:Campaign={id:Date.now().toString(),name:form.name,type:form.type as "whatsapp"|"email"|"sms",status:"draft",audience:form.audience,sent:0,delivered:0,opened:0,clicked:0,converted:0,scheduledAt:"—",createdAt:new Date().toISOString().split("T")[0]}; setCampaigns(p=>[mock,...p]); setShowCreate(false); setForm({name:"",type:"whatsapp",audience:"all",message:""}); }}} style={{ flex:2, padding:11, borderRadius:10, border:"none", backgroundColor:C.primary, color:"#fff", fontFamily:font, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {L("Create Campaign","إنشاء الحملة","Kampanya Oluştur")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}