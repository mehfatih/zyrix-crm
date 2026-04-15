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
  gold: "#D4820A", goldBg: "#FFF7E6",
  silver: "#6B7280", bronze: "#92400E",
};

interface LoyaltyMember {
  id: string; name: string; phone: string; flag: string;
  points: number; level: "Bronze"|"Silver"|"Gold"|"Platinum";
  totalSpend: number; currency: string; joinDate: string; lastActivity: string;
}

const DEMO: LoyaltyMember[] = [
  { id:"1", name:"Ahmed Al-Rashid", phone:"+966 55 123 4567", flag:"🇸🇦", points:4820, level:"Gold", totalSpend:48200, currency:"SAR", joinDate:"2024-06-15", lastActivity:"2026-04-14" },
  { id:"2", name:"Mehmet Yilmaz", phone:"+90 532 345 6789", flag:"🇹🇷", points:9640, level:"Platinum", totalSpend:186000, currency:"TRY", joinDate:"2024-03-10", lastActivity:"2026-04-14" },
  { id:"3", name:"Sara Al-Otaibi", phone:"+965 60 456 7890", flag:"🇰🇼", points:3210, level:"Gold", totalSpend:32100, currency:"KWD", joinDate:"2024-09-22", lastActivity:"2026-04-12" },
  { id:"4", name:"Fatima Hassan", phone:"+971 50 234 5678", flag:"🇦🇪", points:1240, level:"Silver", totalSpend:12400, currency:"AED", joinDate:"2025-01-08", lastActivity:"2026-04-13" },
  { id:"5", name:"Khalid Ibrahim", phone:"+974 33 567 8901", flag:"🇶🇦", points:320, level:"Bronze", totalSpend:3200, currency:"QAR", joinDate:"2025-08-14", lastActivity:"2026-03-20" },
  { id:"6", name:"Layla Karimi", phone:"+973 36 678 9012", flag:"🇧🇭", points:890, level:"Silver", totalSpend:8900, currency:"BHD", joinDate:"2025-04-01", lastActivity:"2026-04-10" },
];

const levelCfg = {
  Bronze:   { color:"#92400E", bg:"#FEF3C7", icon:"🥉", min:0,    max:999,  next:"Silver" },
  Silver:   { color:"#6B7280", bg:"#F3F4F6", icon:"🥈", min:1000, max:2999, next:"Gold" },
  Gold:     { color:"#D4820A", bg:"#FFF7E6", icon:"🥇", min:3000, max:9999, next:"Platinum" },
  Platinum: { color:"#6D28D9", bg:"#F3EEFF", icon:"💎", min:10000, max:99999, next:"—" },
};

const REWARDS = [
  { id:"1", name:"Free Shipping", points:500, icon:"🚚", category:"Shipping", available:true },
  { id:"2", name:"10% Discount", points:1000, icon:"🏷️", category:"Discount", available:true },
  { id:"3", name:"Priority Support", points:2000, icon:"⭐", category:"Service", available:true },
  { id:"4", name:"Free Month Subscription", points:5000, icon:"🎁", category:"Subscription", available:true },
  { id:"5", name:"VIP Badge", points:10000, icon:"👑", category:"Status", available:false },
];

export default function LoyaltyPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string) { return locale==="ar"?ar:locale==="tr"?tr:en; }

  const [members, setMembers] = useState<LoyaltyMember[]>(DEMO);
  const [tab, setTab] = useState<"members"|"rewards"|"settings">("members");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAward, setShowAward] = useState<LoyaltyMember|null>(null);
  const [awardPoints, setAwardPoints] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("zyrix_merchant_token");
    if (!token) return;
    fetch(`${API}/api/loyalty/members`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ if(d?.data) setMembers(d.data); }).catch(()=>{});
  }, []);

  const filtered = members.filter(m => {
    const mf = filter==="all" || m.level.toLowerCase()===filter;
    const ms = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    return mf && ms;
  });

  const totalPoints = members.reduce((s,m)=>s+m.points,0);
  const avgPoints = Math.round(totalPoints / Math.max(members.length,1));

  const kpis = [
    { label:L("Total Members","إجمالي الأعضاء","Toplam Üye"), value:members.length, color:C.primary, icon:"👥" },
    { label:L("Points Issued","نقاط صادرة","Verilen Puan"), value:totalPoints.toLocaleString(), color:C.gold, icon:"⭐" },
    { label:L("Avg Points","متوسط النقاط","Ort. Puan"), value:avgPoints.toLocaleString(), color:"#2563EB", icon:"📊" },
    { label:L("Platinum Members","أعضاء بلاتينيوم","Platinum Üye"), value:members.filter(m=>m.level==="Platinum").length, color:C.primary, icon:"💎" },
  ];

  return (
    <div style={{ fontFamily:font, backgroundColor:C.bg, minHeight:"100vh" }} dir={dir}>
      <header style={{ backgroundColor:C.bgCard, borderBottom:`1.5px solid ${C.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize:13, color:C.primary, fontWeight:700, textDecoration:"none" }}>← {L("Dashboard","اللوحة","Panel")}</a>
          <span style={{ color:C.border }}>/</span>
          <span style={{ fontSize:14, fontWeight:800, color:C.text }}>⭐ {L("Loyalty Program","برنامج الولاء","Sadakat Programı")}</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {(["members","rewards","settings"] as const).map((t,i) => (
            <button key={i} onClick={()=>setTab(t)} style={{ padding:"7px 16px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700, backgroundColor:tab===t?C.primary:"transparent", color:tab===t?"#fff":C.textLight }}>
              {t==="members"?L("Members","الأعضاء","Üyeler"):t==="rewards"?L("Rewards","المكافآت","Ödüller"):L("Settings","الإعدادات","Ayarlar")}
            </button>
          ))}
        </div>
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

        {tab === "members" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <div style={{ display:"flex", gap:5, backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:10, padding:4 }}>
                {[["all",L("All","الكل","Tümü")],["bronze","🥉 Bronze"],["silver","🥈 Silver"],["gold","🥇 Gold"],["platinum","💎 Platinum"]].map(([val,label],i) => (
                  <button key={i} onClick={()=>setFilter(val)} style={{ padding:"6px 12px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700, backgroundColor:filter===val?C.primary:"transparent", color:filter===val?"#fff":C.textLight }}>
                    {label}
                  </button>
                ))}
              </div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={L("Search members...","بحث...","Ara...")} style={{ padding:"8px 12px", borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:13, color:C.text, outline:"none", width:200 }} />
            </div>

            <div style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:font }}>
                <thead>
                  <tr style={{ backgroundColor:C.bgAlt }}>
                    {[L("Member","العضو","Üye"), L("Points","النقاط","Puan"), L("Level","المستوى","Seviye"), L("Progress","التقدم","İlerleme"), L("Total Spend","الإنفاق","Harcama"), L("Last Activity","آخر نشاط","Son Aktivite"), ""].map((h,i) => (
                      <th key={i} style={{ padding:"12px 16px", textAlign:dir==="rtl"?"right":"left", fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m,i) => {
                    const lc = levelCfg[m.level];
                    const pct = m.level==="Platinum" ? 100 : Math.round(((m.points-lc.min)/(lc.max-lc.min))*100);
                    return (
                      <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"13px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:"50%", backgroundColor:`${C.primary}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
                            <div>
                              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.flag} {m.name}</div>
                              <div style={{ fontSize:11, color:C.textLight }}>{m.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"13px 16px", fontSize:15, fontWeight:900, color:C.gold, fontFamily:"monospace" }}>{m.points.toLocaleString()}</td>
                        <td style={{ padding:"13px 16px" }}>
                          <span style={{ fontSize:11, fontWeight:700, color:lc.color, backgroundColor:lc.bg, padding:"3px 9px", borderRadius:20 }}>{lc.icon} {m.level}</span>
                        </td>
                        <td style={{ padding:"13px 16px", minWidth:120 }}>
                          <div style={{ height:6, backgroundColor:`${lc.color}20`, borderRadius:3, overflow:"hidden", marginBottom:3 }}>
                            <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, backgroundColor:lc.color, borderRadius:3 }} />
                          </div>
                          <div style={{ fontSize:10, color:C.textLight }}>{m.level==="Platinum"?"Max":` ${lc.max-m.points} to ${lc.next}`}</div>
                        </td>
                        <td style={{ padding:"13px 16px", fontSize:12, fontWeight:700, color:C.text }}>{m.totalSpend.toLocaleString()} {m.currency}</td>
                        <td style={{ padding:"13px 16px", fontSize:12, color:C.textLight }}>{m.lastActivity}</td>
                        <td style={{ padding:"13px 16px" }}>
                          <button onClick={()=>setShowAward(m)} style={{ padding:"4px 10px", borderRadius:7, border:`1px solid ${C.primary}44`, backgroundColor:`${C.primary}08`, fontFamily:font, fontSize:11, fontWeight:700, color:C.primary, cursor:"pointer" }}>
                            ⭐ {L("Award","منح","Ver")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "rewards" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {REWARDS.map((r,i) => (
              <div key={i} style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, padding:22, display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ fontSize:36 }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{r.name}</div>
                  <div style={{ fontSize:11, color:C.textLight, marginTop:3 }}>{r.category}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20, fontWeight:900, color:C.gold, fontFamily:"monospace" }}>{r.points.toLocaleString()}</span>
                  <span style={{ fontSize:12, color:C.textLight, fontWeight:600 }}>⭐ {L("points","نقطة","puan")}</span>
                </div>
                <button style={{ padding:"9px", borderRadius:10, border:"none", backgroundColor:r.available?C.primary:"#E2E8F0", color:r.available?"#fff":"#94A3B8", fontFamily:font, fontSize:12, fontWeight:700, cursor:r.available?"pointer":"not-allowed" }}>
                  {r.available ? L("Configure Reward","إعداد المكافأة","Ödülü Yapılandır") : L("Coming Soon","قريباً","Yakında")}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, padding:28, maxWidth:600 }}>
            <div style={{ fontWeight:800, fontSize:17, color:C.text, marginBottom:20 }}>{L("Loyalty Program Settings","إعدادات برنامج الولاء","Sadakat Programı Ayarları")}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {[
                [L("Points per SAR spent","نقطة لكل ريال يُنفق","Harcanan SAR başına puan"), "10"],
                [L("Minimum redemption points","الحد الأدنى لاسترداد النقاط","Min. kullanım puanı"), "500"],
                [L("Points expiry (months)","انتهاء صلاحية النقاط (أشهر)","Puan geçerlilik süresi (ay)"), "12"],
              ].map(([label,val],i) => (
                <div key={i}>
                  <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:5, textTransform:"uppercase" }}>{label}</label>
                  <input defaultValue={val} type="number" style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:14, color:C.text, outline:"none", boxSizing:"border-box" }} />
                </div>
              ))}
              <button style={{ padding:"12px", borderRadius:12, border:"none", backgroundColor:C.primary, color:"#fff", fontFamily:font, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                {L("Save Settings","حفظ الإعدادات","Ayarları Kaydet")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Award Points Modal */}
      {showAward && (
        <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={e=>e.target===e.currentTarget&&setShowAward(null)}>
          <div style={{ backgroundColor:C.bgCard, borderRadius:20, padding:28, width:"100%", maxWidth:400 }}>
            <div style={{ fontWeight:800, fontSize:17, color:C.text, marginBottom:16 }}>⭐ {L("Award Points","منح نقاط","Puan Ver")}</div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"12px 16px", backgroundColor:C.bgAlt, borderRadius:12 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", backgroundColor:`${C.primary}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👤</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{showAward.flag} {showAward.name}</div>
                <div style={{ fontSize:12, color:C.gold, fontWeight:600 }}>⭐ {showAward.points.toLocaleString()} {L("current points","النقاط الحالية","mevcut puan")}</div>
              </div>
            </div>
            <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:8, textTransform:"uppercase" }}>{L("Points to Award","النقاط الممنوحة","Verilecek Puan")}</label>
            <input type="number" value={awardPoints} onChange={e=>setAwardPoints(e.target.value)} placeholder="e.g. 500" style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:16, color:C.text, outline:"none", boxSizing:"border-box", marginBottom:20 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowAward(null)} style={{ flex:1, padding:11, borderRadius:10, border:`1.5px solid ${C.border}`, backgroundColor:"transparent", fontFamily:font, fontSize:13, fontWeight:700, color:C.textMid, cursor:"pointer" }}>
                {L("Cancel","إلغاء","İptal")}
              </button>
              <button onClick={()=>{ if(awardPoints){ setMembers(p=>p.map(m=>m.id===showAward.id?{...m,points:m.points+parseInt(awardPoints)}:m)); setShowAward(null); setAwardPoints(""); } }} style={{ flex:2, padding:11, borderRadius:10, border:"none", backgroundColor:C.gold, color:"#fff", fontFamily:font, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                ⭐ {L("Award Points","منح النقاط","Puan Ver")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}