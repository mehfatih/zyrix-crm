"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const ACCENT  = "#6D28D9";
const ACCENT2 = "#A78BFA";
const BG      = "linear-gradient(160deg,#2D0B6B 0%,#4A1A9E 40%,#6D28D9 100%)";
const DARK    = "#1A0547";
const NAV_BG  = "#130340";

const FEATURES = [
  { icon: "📊", en: { title: "Sales Pipeline", desc: "Visualize your sales process with custom stages, deal values, and probability tracking." }, ar: { title: "Sales Pipeline", desc: "تصوّر عملية مبيعاتك بمراحل مخصصة وقيم الصفقات وتتبع الاحتمالية." }, tr: { title: "Satış Pipeline'ı", desc: "Özel aşamalar, anlaşma değerleri ve olasılık takibi ile satış sürecinizi görselleştirin." } },
  { icon: "⭐", en: { title: "Customer Loyalty Points", desc: "Reward customers with points, manage tiers (Bronze/Silver/Gold), and offer redemption discounts." }, ar: { title: "نقاط الولاء", desc: "كافئ العملاء بالنقاط، إدارة المستويات (برونز/فضي/ذهبي)، وتقديم خصومات الاسترداد." }, tr: { title: "Müşteri Sadakat Puanları", desc: "Müşterileri puanlarla ödüllendirin, katmanları yönetin ve geri ödeme indirimleri sunun." } },
  { icon: "🤖", en: { title: "AI CFO Dashboard", desc: "Get AI-powered financial insights, cash flow forecasts, and business recommendations in Arabic & Turkish." }, ar: { title: "لوحة CFO الذكية", desc: "احصل على رؤى مالية مدعومة بالذكاء الاصطناعي وتوقعات التدفق النقدي بالعربية والتركية." }, tr: { title: "AI CFO Paneli", desc: "Arapça ve Türkçe olarak yapay zeka destekli finansal içgörüler ve nakit akışı tahminleri alın." } },
  { icon: "📢", en: { title: "Marketing Campaigns", desc: "Launch targeted email and SMS campaigns, track opens/clicks, and automate follow-ups." }, ar: { title: "الحملات التسويقية", desc: "أطلق حملات بريد إلكتروني ورسائل SMS مستهدفة وأتمتة المتابعة." }, tr: { title: "Pazarlama Kampanyaları", desc: "Hedefli e-posta ve SMS kampanyaları başlatın ve takibi otomatikleştirin." } },
  { icon: "🌐", en: { title: "Customer Portal", desc: "Self-service portal where customers view invoices, quotes, loyalty points, and transaction history." }, ar: { title: "بوابة العملاء", desc: "بوابة ذاتية الخدمة يرى فيها العملاء الفواتير وعروض الأسعار ونقاط الولاء." }, tr: { title: "Müşteri Portalı", desc: "Müşterilerin faturaları, teklifleri ve sadakat puanlarını görüntüleyebildiği self-servis portal." } },
  { icon: "💸", en: { title: "Commission Engine", desc: "Automate team commissions with custom rules, track earnings, and generate commission reports." }, ar: { title: "محرك العمولات", desc: "أتمتة عمولات الفريق بقواعد مخصصة وتتبع الأرباح وإنشاء تقارير العمولات." }, tr: { title: "Komisyon Motoru", desc: "Özel kurallarla ekip komisyonlarını otomatikleştirin ve komisyon raporları oluşturun." } },
];

const STATS = [
  { val: "12+", en: "CRM Features",     ar: "ميزة CRM",          tr: "CRM Özelliği" },
  { val: "AI",  en: "CFO Dashboard",    ar: "لوحة CFO الذكية",   tr: "AI CFO Paneli" },
  { val: "3",   en: "Languages",        ar: "لغات مدعومة",       tr: "Dil Desteği" },
  { val: "∞",   en: "Customers",        ar: "عملاء غير محدودين", tr: "Sınırsız Müşteri" },
];

const PRICING = [
  { en: { name: "Starter",   sub: "Free forever",    cta: "Get Started" },    ar: { name: "مجاني",    sub: "مجاناً للأبد",      cta: "ابدأ الآن" },        tr: { name: "Başlangıç", sub: "Sonsuza ücretsiz", cta: "Başla" },           price: "$0",  highlight: false, features: { en: ["Up to 100 customers","Sales Pipeline","Basic reports","Email support"],                                                                         ar: ["حتى 100 عميل","Sales Pipeline","تقارير أساسية","دعم بريد إلكتروني"],                                                                       tr: ["100'e kadar müşteri","Satış Pipeline'ı","Temel raporlar","E-posta desteği"] } },
  { en: { name: "Business",  sub: "Per month",        cta: "Start Business" }, ar: { name: "الأعمال", sub: "شهرياً",             cta: "ابدأ الأعمال" },      tr: { name: "İş",        sub: "Aylık",            cta: "İş'i Başlat" },      price: "$49", highlight: true,  features: { en: ["Unlimited customers","Loyalty Points","AI CFO Dashboard","Marketing campaigns","Customer portal","Commission engine","Priority support"], ar: ["عملاء غير محدودين","نقاط الولاء","لوحة CFO الذكية","حملات تسويقية","بوابة العملاء","محرك العمولات","دعم أولوية"],                           tr: ["Sınırsız müşteri","Sadakat Puanları","AI CFO Paneli","Pazarlama kampanyaları","Müşteri portalı","Komisyon motoru","Öncelikli destek"] } },
  { en: { name: "Enterprise", sub: "Custom pricing", cta: "Contact Sales" },  ar: { name: "المؤسسي", sub: "أسعار مخصصة",        cta: "تواصل مع المبيعات" }, tr: { name: "Kurumsal",  sub: "Özel fiyat",       cta: "Satışla İletişim" }, price: "—",   highlight: false, features: { en: ["White-Label","API access","Custom integrations","Dedicated manager","SLA guarantee"],                                                     ar: ["وايت لايبل","وصول API","تكاملات مخصصة","مدير مخصص","ضمان SLA"],                                                                             tr: ["Beyaz Etiket","API erişimi","Özel entegrasyonlar","Özel yönetici","SLA garantisi"] } },
];

function Navbar({ locale, isRTL }: { locale: string; isRTL: boolean }) {
  const s = { signUp: locale === "ar" ? "إنشاء حساب" : locale === "tr" ? "Üye Ol" : "Sign Up", signIn: locale === "ar" ? "تسجيل الدخول" : locale === "tr" ? "Giriş Yap" : "Sign In", pricing: locale === "ar" ? "الأسعار" : locale === "tr" ? "Fiyatlar" : "Pricing", about: locale === "ar" ? "من نحن" : locale === "tr" ? "Hakkımızda" : "About" };
  return (
    <nav style={{ background: NAV_BG, borderBottom: "1px solid rgba(109,40,217,0.3)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 }} dir={isRTL ? "rtl" : "ltr"}>
      <a href={`/${locale}`} style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "'Georgia',serif", fontSize: 22, fontWeight: 900, color: "#fff", direction: "ltr", unicodeBidi: "embed" }}>
          <span style={{ color: "#2563EB" }}>Z</span>yrix<span style={{ color: "#2563EB", fontSize: 26 }}>.</span>
          <span style={{ color: ACCENT2, fontSize: 14, fontFamily: "Cairo,sans-serif", fontWeight: 700, marginLeft: 6 }}>CRM</span>
        </span>
      </a>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[{ label: s.pricing, href: `/${locale}#pricing` }, { label: s.about, href: "https://zyrix.co" }].map(item => (
          <a key={item.label} href={item.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"}>{item.label}</a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <a href={`/${locale}/signin`} style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", padding: "8px 14px", textDecoration: "none" }}>{s.signIn}</a>
        <a href={`/${locale}/signup`} style={{ fontSize: 13, fontWeight: 700, background: ACCENT, color: "#fff", padding: "9px 20px", borderRadius: 9, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = ACCENT2} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ACCENT}>{s.signUp}</a>
      </div>
    </nav>
  );
}

export default function CRMPage() {
  const locale = useLocale();
  const isRTL  = locale === "ar";
  function tx(obj: { en: string; ar: string; tr: string }) { return obj[locale as "en"|"ar"|"tr"] ?? obj.en; }

  const heroTitle = { en: <><span style={{ color: "#fff" }}>The Complete</span><br /><span style={{ color: ACCENT2 }}>CRM Suite</span><br /><span style={{ color: "rgba(255,255,255,0.85)" }}>for MENA & Turkey</span></>, ar: <><span style={{ color: "#fff" }}>منظومة CRM</span><br /><span style={{ color: ACCENT2 }}>المتكاملة</span><br /><span style={{ color: "rgba(255,255,255,0.85)" }}>لـ MENA وتركيا</span></>, tr: <><span style={{ color: "#fff" }}>MENA ve Türkiye için</span><br /><span style={{ color: ACCENT2 }}>Eksiksiz CRM</span><br /><span style={{ color: "rgba(255,255,255,0.85)" }}>Paketi</span></> };
  const heroSub  = { en: "Sales pipeline, customer loyalty, AI CFO dashboard, marketing automation, and commission engine — all in one platform.", ar: "Pipeline المبيعات، ولاء العملاء، لوحة CFO الذكية، أتمتة التسويق، ومحرك العمولات — كلها في منصة واحدة.", tr: "Satış pipeline'ı, müşteri sadakati, AI CFO paneli, pazarlama otomasyonu ve komisyon motoru — hepsi tek platformda." };
  const ctaFree  = locale === "ar" ? "ابدأ مجاناً" : locale === "tr" ? "Ücretsiz Başla" : "Start Free";
  const popular  = locale === "ar" ? "الأكثر شيوعاً" : locale === "tr" ? "En Popüler" : "Most Popular";
  const ctaTitle = locale === "ar" ? "حوّل علاقات عملائك اليوم" : locale === "tr" ? "Bugün Müşteri İlişkilerinizi Dönüştürün" : "Transform Your Customer Relationships Today";

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: "Cairo, sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <Navbar locale={locale} isRTL={isRTL} />

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(109,40,217,0.2)", border: "1.5px solid rgba(109,40,217,0.45)", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: ACCENT2, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT2, display: "inline-block" }} />
              {locale === "ar" ? "منظومة CRM المتكاملة" : locale === "tr" ? "Eksiksiz CRM Paketi" : "Complete CRM Suite"}
            </div>
            <h1 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>{heroTitle[locale as keyof typeof heroTitle] ?? heroTitle.en}</h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, fontWeight: 600, lineHeight: 1.8, marginBottom: 32, maxWidth: 460 }}>{tx(heroSub)}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isRTL ? "flex-end" : "flex-start" }}>
              <Link href={`/${locale}/signup`} style={{ background: "#fff", color: DARK, fontWeight: 700, padding: "14px 28px", borderRadius: 10, fontSize: 14, textDecoration: "none" }}>{ctaFree}</Link>
              <Link href={`/${locale}/demo`} style={{ border: "2px solid rgba(255,255,255,0.5)", color: "#fff", fontWeight: 700, padding: "14px 28px", borderRadius: 10, fontSize: 14, textDecoration: "none" }}>{locale === "ar" ? "شاهد العرض" : locale === "tr" ? "Demo İzle" : "Watch Demo"}</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36, maxWidth: 320 }}>
              {STATS.map(s => (
                <div key={s.val} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, fontWeight: 900, color: ACCENT2 }}>{s.val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{tx(s)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(109,40,217,0.35)", borderRadius: 24, padding: 28, width: "100%", maxWidth: 380 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT2, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>{locale === "ar" ? "Pipeline المبيعات" : locale === "tr" ? "Satış Pipeline'ı" : "Sales Pipeline"}</div>
              {[
                { stage: locale === "ar" ? "عميل محتمل" : locale === "tr" ? "Potansiyel" : "Lead",       count: 12, value: "SAR 48,000",  color: "#6366F1" },
                { stage: locale === "ar" ? "تفاوض"      : locale === "tr" ? "Müzakere"   : "Negotiation", count: 5,  value: "SAR 92,500",  color: "#8B5CF6" },
                { stage: locale === "ar" ? "عرض سعر"    : locale === "tr" ? "Teklif"     : "Proposal",    count: 3,  value: "SAR 67,200",  color: ACCENT },
                { stage: locale === "ar" ? "مغلق"       : locale === "tr" ? "Kapandı"    : "Closed Won",  count: 8,  value: "SAR 156,000", color: "#10B981" },
              ].map(row => (
                <div key={row.stage} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{row.stage}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{row.count} {locale === "ar" ? "صفقة" : locale === "tr" ? "anlaşma" : "deals"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, textAlign: "center", marginBottom: 40, letterSpacing: "-1px" }}>{locale === "ar" ? "الميزات الرئيسية" : locale === "tr" ? "Temel Özellikler" : "Key Features"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
          {FEATURES.map(f => {
            const data = f[locale as keyof typeof f] as { title: string; desc: string } ?? f.en;
            return (
              <div key={f.icon} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 24 }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.5)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{data.title}</h3>
                <p style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>{data.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, textAlign: "center", marginBottom: 40, letterSpacing: "-1px" }}>{locale === "ar" ? "الأسعار" : locale === "tr" ? "Fiyatlar" : "Pricing"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {PRICING.map(p => {
            const data  = p[locale as keyof typeof p] as { name: string; sub: string; cta: string } ?? p.en;
            const feats = (p.features as Record<string, string[]>)[locale] ?? p.features.en;
            return (
              <div key={p.price} style={{ background: p.highlight ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.08)", border: p.highlight ? `3px solid ${ACCENT}` : "1.5px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 28, position: "relative" }}>
                {p.highlight && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>{popular}</div>}
                <h3 style={{ fontWeight: 800, fontSize: 18, color: p.highlight ? DARK : "#fff", marginBottom: 4 }}>{data.name}</h3>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 38, fontWeight: 900, color: p.highlight ? ACCENT : ACCENT2, marginBottom: 2 }}>{p.price}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: p.highlight ? "#4A6C8C" : "rgba(255,255,255,0.6)", marginBottom: 20 }}>{data.sub}</div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {feats.map((f: string) => <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: p.highlight ? "#1A3A55" : "rgba(255,255,255,0.82)", fontWeight: 600 }}><span style={{ color: ACCENT, fontWeight: 900 }}>✓</span> {f}</li>)}
                </ul>
                <Link href={`/${locale}/signup`} style={{ display: "block", textAlign: "center", fontWeight: 700, fontSize: 14, padding: "12px 0", borderRadius: 12, textDecoration: "none", background: p.highlight ? ACCENT : "transparent", color: p.highlight ? "#fff" : ACCENT2, border: p.highlight ? "none" : `2px solid ${ACCENT2}` }}>{data.cta}</Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 40px 80px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ background: "rgba(0,0,0,0.25)", border: "1.5px solid rgba(109,40,217,0.4)", borderRadius: 28, padding: "52px 44px" }}>
          <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 12 }}>{ctaTitle}</h2>
          <p style={{ color: "rgba(255,255,255,0.80)", fontSize: 15, fontWeight: 600, marginBottom: 28 }}>{locale === "ar" ? "Pipeline المبيعات ونقاط الولاء ولوحة CFO الذكية في مكان واحد" : locale === "tr" ? "Satış pipeline'ı, sadakat puanları ve AI CFO paneli tek bir yerde" : "Sales pipeline, loyalty points, and AI CFO dashboard in one place"}</p>
          <Link href={`/${locale}/signup`} style={{ display: "inline-block", background: "#fff", color: DARK, fontWeight: 700, padding: "14px 36px", borderRadius: 12, fontSize: 15, textDecoration: "none" }}>{ctaFree}</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: NAV_BG, borderTop: "2px solid rgba(109,40,217,0.25)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }} dir={isRTL ? "rtl" : "ltr"}>
        <a href="https://zyrix.co" style={{ textDecoration: "none" }}><span style={{ fontFamily: "'Georgia',serif", fontSize: 20, fontWeight: 900, color: "#fff", direction: "ltr", unicodeBidi: "embed" }}><span style={{ color: "#2563EB" }}>Z</span>yrix<span style={{ color: "#2563EB", fontSize: 24 }}>.</span></span></a>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ en: "Privacy", ar: "الخصوصية", tr: "Gizlilik", href: `/${locale}/privacy` }, { en: "Terms", ar: "الشروط", tr: "Koşullar", href: `/${locale}/terms` }, { en: "Contact", ar: "تواصل", tr: "İletişim", href: `/${locale}/contact` }].map(item => (
            <a key={item.en} href={item.href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{tx(item)}</a>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, direction: "ltr" }}>© 2026 Zyrix CRM</div>
      </footer>
    </div>
  );
}