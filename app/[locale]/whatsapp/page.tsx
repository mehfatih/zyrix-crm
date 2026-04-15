"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://zyrix-backend-production.up.railway.app";
const font = "'DM Sans','Outfit',system-ui,sans-serif";
const C = {
  primary: "#6D28D9", bg: "#F3EEFF", bgAlt: "#F8F4FF", bgCard: "#fff",
  border: "#DDD6FE", text: "#1A0A2E", textMid: "#3B1F6A", textLight: "#6B5C8A",
  success: "#059669", successBg: "#ECFDF5",
  warning: "#D97706", warningBg: "#FFFBEB",
  danger: "#DC2626",
  wa: "#25D366", waDark: "#128C7E", waBg: "#DCF8C6",
};

interface Contact {
  id: string; name: string; phone: string; flag: string;
  status: "online"|"offline"|"typing"; lastMsg: string; lastTime: string;
  unread: number; avatar: string; tag: string;
}

interface Message {
  id: string; from: "me"|"them"; text: string; time: string; status: "sent"|"delivered"|"read";
}

const CONTACTS: Contact[] = [
  { id:"1", name:"Ahmed Al-Rashid", phone:"+966 55 123 4567", flag:"🇸🇦", status:"online", lastMsg:"شكراً على التواصل!", lastTime:"10:32", unread:2, avatar:"🧑", tag:"VIP" },
  { id:"2", name:"Mehmet Yilmaz", phone:"+90 532 345 6789", flag:"🇹🇷", status:"typing", lastMsg:"Teşekkürler...", lastTime:"10:18", unread:0, avatar:"👨", tag:"Lead" },
  { id:"3", name:"Sara Al-Otaibi", phone:"+965 60 456 7890", flag:"🇰🇼", status:"offline", lastMsg:"هل يمكن إلغاء الطلب؟", lastTime:"09:55", unread:1, avatar:"👩", tag:"Support" },
  { id:"4", name:"Layla Karimi", phone:"+973 36 678 9012", flag:"🇧🇭", status:"online", lastMsg:"تم استلام الطرد", lastTime:"09:30", unread:0, avatar:"🧕", tag:"Customer" },
  { id:"5", name:"Khalid Ibrahim", phone:"+974 33 567 8901", flag:"🇶🇦", status:"offline", lastMsg:"متى سيصل الطلب؟", lastTime:"أمس", unread:0, avatar:"👴", tag:"Lead" },
];

const MESSAGES: Record<string, Message[]> = {
  "1": [
    { id:"1", from:"them", text:"مرحباً، أريد الاستفسار عن منتج معين", time:"10:15", status:"read" },
    { id:"2", from:"me", text:"أهلاً أحمد! يسعدني مساعدتك. ما هو المنتج الذي تبحث عنه؟", time:"10:17", status:"read" },
    { id:"3", from:"them", text:"أبحث عن باقة الأعمال المميزة", time:"10:20", status:"read" },
    { id:"4", from:"me", text:"ممتاز! باقة الأعمال تتضمن: دفع متعدد العملات، تقارير متقدمة، ودعم على مدار الساعة.", time:"10:22", status:"read" },
    { id:"5", from:"them", text:"شكراً على التواصل!", time:"10:32", status:"delivered" },
  ],
  "2": [
    { id:"1", from:"them", text:"Merhaba, sipariş durumumu öğrenmek istiyorum", time:"10:10", status:"read" },
    { id:"2", from:"me", text:"Merhaba Mehmet! Sipariş numaranızı paylaşır mısınız?", time:"10:12", status:"read" },
    { id:"3", from:"them", text:"Teşekkürler...", time:"10:18", status:"delivered" },
  ],
};

const TEMPLATES = [
  { title:"Welcome Message", text:"مرحباً {name}! شكراً لتواصلك مع Zyrix. كيف يمكنني مساعدتك؟" },
  { title:"Order Confirmation", text:"تم تأكيد طلبك #{order_id} بنجاح. سيصلك خلال 2-3 أيام عمل." },
  { title:"Payment Reminder", text:"تذكير: لديك فاتورة مستحقة بقيمة {amount}. يرجى السداد قبل {date}." },
  { title:"Follow-up", text:"مرحباً {name}، نتابع معك بخصوص طلبك السابق. هل تحتاج إلى أي مساعدة؟" },
];

export default function WhatsAppCRMPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  function L(en: string, ar: string, tr: string) { return locale==="ar"?ar:locale==="tr"?tr:en; }

  const [contacts] = useState<Contact[]>(CONTACTS);
  const [activeContact, setActiveContact] = useState<Contact>(CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>(MESSAGES["1"] || []);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [tab, setTab] = useState<"chats"|"broadcast"|"analytics">("chats");
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const selectContact = (c: Contact) => {
    setActiveContact(c);
    setMessages(MESSAGES[c.id] || [
      { id:"1", from:"them", text:c.lastMsg, time:c.lastTime, status:"delivered" },
    ]);
    setShowTemplates(false);
  };

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = { id:Date.now().toString(), from:"me", text:input.trim(), time:new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}), status:"sent" };
    setMessages(p=>[...p, msg]);
    setInput("");
    setTimeout(()=>setMessages(p=>p.map(m=>m.id===msg.id?{...m,status:"delivered"}:m)), 1000);
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const kpis = [
    { label:L("Active Chats","محادثات نشطة","Aktif Sohbet"), value:"24", color:C.wa, icon:"💬" },
    { label:L("Unread","غير مقروءة","Okunmamış"), value:contacts.reduce((s,c)=>s+c.unread,0).toString(), color:C.danger, icon:"🔴" },
    { label:L("Response Rate","معدل الرد","Yanıt Oranı"), value:"94%", color:C.success, icon:"⚡" },
    { label:L("Avg Response","متوسط الرد","Ort. Yanıt"), value:"3m", color:C.primary, icon:"⏱" },
  ];

  return (
    <div style={{ fontFamily:font, backgroundColor:C.bg, minHeight:"100vh" }} dir={dir}>
      <header style={{ backgroundColor:C.bgCard, borderBottom:`1.5px solid ${C.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize:13, color:C.primary, fontWeight:700, textDecoration:"none" }}>← {L("Dashboard","اللوحة","Panel")}</a>
          <span style={{ color:C.border }}>/</span>
          <span style={{ fontSize:14, fontWeight:800, color:C.text }}>💬 {L("WhatsApp CRM","واتساب CRM","WhatsApp CRM")}</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {(["chats","broadcast","analytics"] as const).map((t,i) => (
            <button key={i} onClick={()=>setTab(t)} style={{ padding:"7px 16px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700, backgroundColor:tab===t?C.primary:"transparent", color:tab===t?"#fff":C.textLight }}>
              {t==="chats"?L("Chats","المحادثات","Sohbetler"):t==="broadcast"?L("Broadcast","بث","Yayın"):L("Analytics","التحليلات","Analitik")}
            </button>
          ))}
        </div>
      </header>

      {tab === "chats" && (
        <div style={{ display:"flex", height:"calc(100vh - 60px)", overflow:"hidden" }}>
          {/* Contacts sidebar */}
          <div style={{ width:320, backgroundColor:C.bgCard, borderRight:`1.5px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}` }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={L("Search contacts...","بحث...","Ara...")} style={{ width:"100%", padding:"8px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {filteredContacts.map((c,i) => (
                <div key={i} onClick={()=>selectContact(c)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer", borderBottom:`1px solid ${C.border}`, backgroundColor:activeContact.id===c.id?`${C.primary}08`:"transparent" }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:42, height:42, borderRadius:"50%", backgroundColor:`${C.primary}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.avatar}</div>
                    <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", backgroundColor:c.status==="online"?C.wa:c.status==="typing"?C.warning:"#94A3B8", border:"2px solid #fff" }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{c.name}</span>
                      <span style={{ fontSize:10, color:C.textLight }}>{c.lastTime}</span>
                    </div>
                    <div style={{ fontSize:11, color:c.status==="typing"?C.wa:C.textLight, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {c.status==="typing"?"typing...":c.lastMsg}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <div style={{ width:18, height:18, borderRadius:"50%", backgroundColor:C.wa, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff", flexShrink:0 }}>{c.unread}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
            {/* Chat header */}
            <div style={{ backgroundColor:C.bgCard, borderBottom:`1.5px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ position:"relative" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", backgroundColor:`${C.primary}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{activeContact.avatar}</div>
                  <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", backgroundColor:activeContact.status==="online"?C.wa:activeContact.status==="typing"?C.warning:"#94A3B8", border:"2px solid #fff" }} />
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:C.text }}>{activeContact.flag} {activeContact.name}</div>
                  <div style={{ fontSize:11, color:activeContact.status==="typing"?C.wa:C.textLight, fontWeight:600 }}>
                    {activeContact.status==="typing"?"typing...":activeContact.status==="online"?L("Online","متصل","Çevrimiçi"):L("Offline","غير متصل","Çevrimdışı")}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, backgroundColor:`${C.primary}14`, color:C.primary }}>{activeContact.tag}</span>
                <button style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, backgroundColor:"transparent", fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, cursor:"pointer" }}>
                  👤 {L("Profile","الملف","Profil")}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:10, backgroundColor:"#FAFAF8" }}>
              {messages.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"70%", padding:"10px 14px", borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", backgroundColor:m.from==="me"?C.waBg:C.bgCard, border:`1px solid ${m.from==="me"?"#B7E4C7":C.border}`, fontSize:13, color:C.text, lineHeight:1.5 }}>
                    <div>{m.text}</div>
                    <div style={{ fontSize:10, color:C.textLight, marginTop:4, textAlign:"right", display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4 }}>
                      {m.time}
                      {m.from==="me" && <span style={{ fontSize:12 }}>{m.status==="read"?"✓✓":m.status==="delivered"?"✓✓":"✓"}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={msgEnd} />
            </div>

            {/* Templates */}
            {showTemplates && (
              <div style={{ backgroundColor:C.bgCard, borderTop:`1px solid ${C.border}`, padding:"12px 20px", maxHeight:180, overflowY:"auto" }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.textLight, marginBottom:8, textTransform:"uppercase" }}>{L("Quick Templates","قوالب سريعة","Hızlı Şablonlar")}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {TEMPLATES.map((t,i) => (
                    <button key={i} onClick={()=>{ setInput(t.text); setShowTemplates(false); }} style={{ textAlign:"left", padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, backgroundColor:C.bgAlt, cursor:"pointer", fontFamily:font, fontSize:12, color:C.text }}>
                      <strong style={{ color:C.primary }}>{t.title}</strong> — {t.text.slice(0,60)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{ backgroundColor:C.bgCard, borderTop:`1.5px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={()=>setShowTemplates(p=>!p)} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${C.border}`, backgroundColor:showTemplates?`${C.primary}14`:"transparent", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>⚡</button>
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                placeholder={L("Type a message...","اكتب رسالة...","Mesaj yaz...")}
                style={{ flex:1, padding:"10px 14px", borderRadius:22, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:13, color:C.text, outline:"none", backgroundColor:C.bgAlt }}
              />
              <button onClick={send} disabled={!input.trim()} style={{ width:40, height:40, borderRadius:"50%", border:"none", backgroundColor:input.trim()?C.wa:"#E2E8F0", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:input.trim()?1:0.5 }}>➤</button>
            </div>
          </div>
        </div>
      )}

      {tab === "broadcast" && (
        <div style={{ maxWidth:800, margin:"32px auto", padding:"0 20px" }}>
          <div style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, padding:28 }}>
            <div style={{ fontWeight:800, fontSize:18, color:C.text, marginBottom:20 }}>📢 {L("Broadcast Message","رسالة جماعية","Toplu Mesaj")}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase" }}>{L("Target Audience","الجمهور المستهدف","Hedef Kitle")}</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {["All Customers","VIP","Leads","At-Risk","By Country"].map((seg,i) => (
                    <button key={i} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${i===0?C.primary:C.border}`, backgroundColor:i===0?`${C.primary}12`:"transparent", color:i===0?C.primary:C.textMid, fontFamily:font, fontSize:12, fontWeight:700, cursor:"pointer" }}>{seg}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase" }}>{L("Message","الرسالة","Mesaj")}</label>
                <textarea rows={4} placeholder={L("Type your broadcast message...","اكتب رسالتك الجماعية...","Toplu mesajınızı yazın...")} style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:font, fontSize:13, color:C.text, outline:"none", resize:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", backgroundColor:C.bgAlt, borderRadius:10 }}>
                <span style={{ fontSize:13, color:C.textLight }}>{L("Recipients: 1,248 contacts","المستلمون: 1,248 جهة اتصال","Alıcılar: 1.248 kişi")}</span>
                <button style={{ padding:"10px 24px", borderRadius:10, border:"none", backgroundColor:C.wa, color:"#fff", fontFamily:font, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  📤 {L("Send Broadcast","إرسال جماعي","Toplu Gönder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div style={{ maxWidth:900, margin:"32px auto", padding:"0 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
            {kpis.map((k,i) => (
              <div key={i} style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"18px 20px", borderTop:`4px solid ${k.color}` }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{k.icon}</div>
                <div style={{ fontSize:26, fontWeight:900, color:k.color, fontFamily:"monospace" }}>{k.value}</div>
                <div style={{ fontSize:12, color:C.textLight, marginTop:4, fontWeight:600 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor:C.bgCard, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
            <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:16 }}>{L("Message Activity","نشاط الرسائل","Mesaj Aktivitesi")}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[["Sent","مُرسلة","Gönderilen","1,248",C.primary,85],["Delivered","مُسلَّمة","Teslim","1,190",C.success,80],["Read","مقروءة","Okundu","987",C.wa,67],["Replied","تم الرد","Yanıt","423",C.warning,29]].map(([en,ar,tr,val,color,pct],i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:80, fontSize:12, fontWeight:600, color:C.textLight, flexShrink:0 }}>{locale==="ar"?ar:locale==="tr"?tr:en}</div>
                  <div style={{ flex:1, height:8, backgroundColor:`${color}20`, borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, backgroundColor:color as string, borderRadius:4 }} />
                  </div>
                  <div style={{ width:50, fontSize:13, fontWeight:800, color:color as string, textAlign:"right", fontFamily:"monospace" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}