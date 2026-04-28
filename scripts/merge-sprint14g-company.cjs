// scripts/merge-sprint14g-company.cjs
// One-time: add Customers, Careers, Press namespaces to en/ar/tr.json

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MSG_DIR = path.join(ROOT, "messages");

// ============================================================================
// EN
// ============================================================================
const EN = {
  Customers: {
    eyebrow: "CUSTOMERS",
    title: "Built for the way Arab and Turkish businesses actually grow.",
    subtitle: "From e-commerce in Jeddah to dental clinics in Istanbul, real estate brokers in Dubai to digital agencies in Cairo — Zyrix powers businesses that understand their market.",
    logosTitle: "TRUSTED BY GROWING TEAMS",
    stats: { businesses: "Active businesses", countries: "Countries served", languages: "Native languages", uptime: "Platform uptime" },
    casesEyebrow: "SUCCESS STORIES",
    casesTitle: "Real teams. Real results.",
    case1: {
      industry: "E-COMMERCE",
      location: "Jeddah, Saudi Arabia",
      metric1: "Revenue growth",
      metric2: "Cart recovery",
      metric3: "WhatsApp response time",
      quote: "We used to spend 4 hours a day reconciling COD orders across SMSA, Aramex, and our books. Zyrix automated everything. Now our finance team focuses on growth instead of spreadsheets.",
      role: "Operations Manager",
    },
    case2: {
      industry: "REAL ESTATE",
      location: "Istanbul, Türkiye",
      metric1: "Lead response improvement",
      metric2: "Viewings to offers",
      metric3: "Average first reply",
      quote: "Our brokers used to lose half their leads because they couldn't reply fast enough on WhatsApp. With Zyrix, the whole team replies within 15 minutes. Conversion doubled in 60 days.",
      role: "Sales Director",
    },
    case3: {
      industry: "HEALTHCARE",
      location: "Riyadh, Saudi Arabia",
      metric1: "No-show reduction",
      metric2: "Patient retention",
      metric3: "Patient satisfaction",
      quote: "We had a 35% no-show rate before Zyrix. The automated WhatsApp reminders cut it to 11%. That's pure recovered revenue with zero extra work for the front desk.",
      role: "Clinic Director",
    },
    case4: {
      industry: "DIGITAL AGENCY",
      location: "Cairo, Egypt",
      metric1: "Client capacity scaled",
      metric2: "Margin improvement",
      metric3: "Time per client report",
      quote: "We went from managing 8 clients to 27 with the same team. Zyrix's automated reporting alone saves us 30 hours a week. Our margins finally make sense.",
      role: "Agency Founder",
    },
    cta: { title: "Join 500+ businesses scaling with Zyrix", subtitle: "Start free. See results in 30 days. Cancel anytime.", primary: "Start free trial", secondary: "Talk to sales" },
  },
  Careers: {
    eyebrow: "CAREERS",
    title: "Build the CRM the Arab world deserves.",
    subtitle: "We're a small, intentionally lean team building software for businesses that have been ignored by Silicon Valley for too long. Join us.",
    location: "Istanbul, Türkiye · Remote-friendly",
    mission: { eyebrow: "WHY WE EXIST", title: "Most software is built for someone else's market.", body: "Zyrix exists because Arab, Turkish, and MENA businesses deserve tools built for how they actually work — Arabic-first, WhatsApp-native, COD-aware, regulation-compliant. We're not translating Silicon Valley products. We're building something native." },
    values: {
      eyebrow: "WHO WE ARE",
      title: "How we work",
      customer: { title: "Customer-first", desc: "We don't chase vanity metrics. If a feature doesn't make a customer's day easier, we don't build it." },
      team: { title: "Small team, big trust", desc: "We hire slowly and trust completely. Everyone owns their domain end-to-end. Less management, more shipping." },
      regional: { title: "Regional, not global-minus", desc: "We're not a watered-down version of a US product. We're built for this region — Arabic-first, WhatsApp-native, COD-aware." },
      ship: { title: "Ship, then learn", desc: "We deploy every week. We'd rather ship something imperfect and improve it than wait six months to be wrong." },
      learn: { title: "Always learning", desc: "$2,000/year per person for books, courses, conferences. We hire smart, then we keep them smart." },
      balance: { title: "Sustainable pace", desc: "We move fast without burning out. No 70-hour weeks. No on-call rotations for engineers building features. Real weekends." },
    },
    perks: {
      eyebrow: "WHAT WE OFFER",
      title: "Compensation + benefits",
      equity: { title: "Meaningful equity", desc: "Every full-time hire gets equity. Our success is your success." },
      remote: { title: "Remote-friendly", desc: "Istanbul HQ. Remote within Türkiye, KSA, UAE, and Egypt. We meet quarterly." },
      health: { title: "Health insurance", desc: "Full coverage for you and immediate family. Mental health included." },
      learning: { title: "Learning budget", desc: "$2,000/year for books, courses, conferences. Use it however helps you grow." },
      equipment: { title: "Best equipment", desc: "MacBook Pro M-series. External monitor. Whatever you need to do your best work." },
      timeoff: { title: "Generous time off", desc: "30 days paid time off plus regional holidays. We mean it — take the time." },
    },
    positions: {
      eyebrow: "OPEN POSITIONS",
      title: "Hiring soon",
      subtitle: "We're a small team scaling intentionally. We hire when we have a real need, not before.",
      openTitle: "We're not hiring publicly right now",
      openBody: "But if you're exceptional and your skills match what we're building, we want to hear from you. Send us a note about who you are, what you've built, and why Zyrix. The best hires often come from unsolicited applications.",
    },
    cta: { title: "Don't wait for a job posting", subtitle: "If you'd be incredible at Zyrix, tell us. We'll find a way to work together.", primary: "Get in touch" },
  },
  Press: {
    eyebrow: "PRESS",
    title: "Press & Media",
    subtitle: "Resources for journalists, bloggers, analysts, and partners covering the MENA + Türkiye SaaS market.",
    kit: {
      title: "Press Kit",
      body: "Everything you need to write about Zyrix — logos, brand guidelines, screenshots, and our company fact sheet. Available in EN, AR, and TR.",
      logos: "Logos (PNG, SVG, light + dark)",
      brandGuide: "Brand guidelines and color palette",
      screenshots: "Product screenshots (high-res)",
      factSheet: "Company fact sheet",
      cta: "Request press kit",
    },
    facts: {
      eyebrow: "COMPANY FACTS",
      title: "Quick facts",
      founded: "Founded",
      foundedValue: "2025",
      hq: "Headquarters",
      hqValue: "Istanbul, Türkiye",
      markets: "Active markets",
      marketsValue: "MENA + Türkiye (12 countries)",
      employees: "Team size",
      employeesValue: "Small, intentional team",
      languages: "Languages supported",
      languagesValue: "Arabic, Turkish, English (native RTL)",
      industries: "Industries served",
      industriesValue: "E-commerce, real estate, healthcare, agencies, sales",
    },
    releases: { eyebrow: "PRESS RELEASES", title: "Recent announcements" },
    release1: {
      title: "Zyrix CRM launches in Türkiye and KSA simultaneously",
      body: "Zyrix announces general availability of its WhatsApp-first CRM platform across Türkiye and Saudi Arabia, with native support for Arabic, Turkish, and English. The launch coincides with integrations for SMSA, Aramex, MNG Kargo, and Yurtiçi Kargo.",
    },
    release2: {
      title: "Zyrix integrates Meta Cloud API for enterprise WhatsApp",
      body: "Direct integration with Meta's WhatsApp Cloud API enables Zyrix customers to send templated messages, manage business profiles, and access advanced analytics — all from inside the Zyrix CRM dashboard.",
    },
    release3: {
      title: "Zyrix releases multi-currency reporting for MENA businesses",
      body: "New reporting engine supports SAR, AED, EGP, TRY, KWD, QAR, USD with automatic FX conversion using daily TCMB and SAMA rates. Enables accurate cross-border financial reporting for businesses operating in multiple Arab markets.",
    },
    contact: {
      title: "Media inquiries",
      body: "For interviews, expert commentary on the MENA SaaS market, or product information, please reach out. We typically respond within 24 hours.",
    },
  },
};

// ============================================================================
// AR — formal MSA, professional brand tone
// ============================================================================
const AR = {
  Customers: {
    eyebrow: "العملاء",
    title: "مصمم للطريقة التي تنمو بها الأعمال العربية والتركية فعلياً.",
    subtitle: "من التجارة الإلكترونية في جدة إلى عيادات الأسنان في إسطنبول، ومن وسطاء العقارات في دبي إلى الوكالات الرقمية في القاهرة — Zyrix يدعم الأعمال التي تفهم سوقها.",
    logosTitle: "موثوق به من فرق متنامية",
    stats: { businesses: "أعمال نشطة", countries: "دول مخدومة", languages: "لغات أصلية", uptime: "وقت تشغيل المنصة" },
    casesEyebrow: "قصص نجاح",
    casesTitle: "فرق حقيقية. نتائج حقيقية.",
    case1: {
      industry: "تجارة إلكترونية",
      location: "جدة، المملكة العربية السعودية",
      metric1: "نمو الإيرادات",
      metric2: "استرداد العربات",
      metric3: "وقت الرد على واتساب",
      quote: "كنا نقضي 4 ساعات يومياً في تسوية طلبات الدفع عند الاستلام بين سمسا وأرامكس وحساباتنا. Zyrix أتمت كل شيء. الآن فريقنا المالي يركز على النمو بدلاً من جداول البيانات.",
      role: "مدير العمليات",
    },
    case2: {
      industry: "عقارات",
      location: "إسطنبول، تركيا",
      metric1: "تحسن الرد على العملاء المحتملين",
      metric2: "تحويل المعاينات إلى عروض",
      metric3: "متوسط أول رد",
      quote: "كان وسطاؤنا يخسرون نصف عملائهم المحتملين لأنهم لم يتمكنوا من الرد بسرعة كافية على واتساب. مع Zyrix، الفريق بأكمله يرد خلال 15 دقيقة. التحويل تضاعف خلال 60 يوماً.",
      role: "مدير المبيعات",
    },
    case3: {
      industry: "رعاية صحية",
      location: "الرياض، المملكة العربية السعودية",
      metric1: "تقليل عدم الحضور",
      metric2: "الاحتفاظ بالمرضى",
      metric3: "رضا المرضى",
      quote: "كان لدينا معدل 35% عدم حضور قبل Zyrix. التذكيرات الآلية عبر واتساب خفضته إلى 11%. هذه إيرادات صافية مستردة بدون أي عمل إضافي على الاستقبال.",
      role: "مدير العيادة",
    },
    case4: {
      industry: "وكالة رقمية",
      location: "القاهرة، مصر",
      metric1: "زيادة سعة العملاء",
      metric2: "تحسن الهامش",
      metric3: "الوقت لكل تقرير عميل",
      quote: "انتقلنا من إدارة 8 عملاء إلى 27 بنفس الفريق. تقارير Zyrix الآلية وحدها توفر علينا 30 ساعة أسبوعياً. هوامشنا أصبحت منطقية أخيراً.",
      role: "مؤسس الوكالة",
    },
    cta: { title: "انضم إلى أكثر من 500 عمل ينمو مع Zyrix", subtitle: "ابدأ مجاناً. شاهد النتائج في 30 يوماً. ألغِ في أي وقت.", primary: "ابدأ التجربة المجانية", secondary: "تحدث مع المبيعات" },
  },
  Careers: {
    eyebrow: "وظائف",
    title: "ابنِ نظام CRM الذي يستحقه العالم العربي.",
    subtitle: "نحن فريق صغير، رشيق عن قصد، نبني برامج للأعمال التي تجاهلتها وادي السيليكون لفترة طويلة. انضم إلينا.",
    location: "إسطنبول، تركيا · صديق للعمل عن بُعد",
    mission: { eyebrow: "لماذا نوجد", title: "معظم البرامج مصممة لسوق شخص آخر.", body: "Zyrix موجود لأن الأعمال العربية والتركية وفي منطقة الشرق الأوسط وشمال إفريقيا تستحق أدوات مصممة لطريقة عملها الفعلية — العربية أولاً، واتساب أصلي، يدرك الدفع عند الاستلام، متوافق مع اللوائح. نحن لا نترجم منتجات وادي السيليكون. نحن نبني شيئاً أصلياً." },
    values: {
      eyebrow: "من نحن",
      title: "كيف نعمل",
      customer: { title: "العميل أولاً", desc: "لا نلاحق المقاييس الزائفة. إذا لم تجعل ميزة يوم العميل أسهل، فإننا لا نبنيها." },
      team: { title: "فريق صغير، ثقة كبيرة", desc: "نوظف ببطء ونثق تماماً. كل شخص يمتلك مجاله من البداية إلى النهاية. إدارة أقل، شحن أكثر." },
      regional: { title: "إقليمي، وليس عالمي ناقص", desc: "نحن لسنا نسخة مخففة من منتج أمريكي. نحن مصممون لهذه المنطقة — العربية أولاً، واتساب أصلي، يدرك الدفع عند الاستلام." },
      ship: { title: "اشحن، ثم تعلم", desc: "ننشر كل أسبوع. نفضل شحن شيء غير مثالي وتحسينه على الانتظار ستة أشهر لنكون مخطئين." },
      learn: { title: "نتعلم دائماً", desc: "2,000$ سنوياً لكل شخص للكتب والدورات والمؤتمرات. نوظف الأذكياء، ثم نحافظ عليهم أذكياء." },
      balance: { title: "وتيرة مستدامة", desc: "نتحرك بسرعة دون إرهاق. لا أسابيع 70 ساعة. لا مناوبات استدعاء للمهندسين الذين يبنون الميزات. عطلات نهاية أسبوع حقيقية." },
    },
    perks: {
      eyebrow: "ما نقدمه",
      title: "التعويضات + المزايا",
      equity: { title: "حصص ملكية ذات معنى", desc: "كل توظيف بدوام كامل يحصل على حصة. نجاحنا هو نجاحك." },
      remote: { title: "صديق للعمل عن بُعد", desc: "المقر الرئيسي في إسطنبول. عمل عن بُعد داخل تركيا والسعودية والإمارات ومصر. نلتقي ربع سنوياً." },
      health: { title: "تأمين صحي", desc: "تغطية كاملة لك ولأفراد الأسرة المباشرين. الصحة النفسية مشمولة." },
      learning: { title: "ميزانية تعلم", desc: "2,000$ سنوياً للكتب والدورات والمؤتمرات. استخدمها بأي طريقة تساعدك على النمو." },
      equipment: { title: "أفضل المعدات", desc: "MacBook Pro سلسلة M. شاشة خارجية. كل ما تحتاجه لأفضل عمل." },
      timeoff: { title: "إجازة سخية", desc: "30 يوم إجازة مدفوعة بالإضافة إلى العطل الإقليمية. نعنيها — خذ الوقت." },
    },
    positions: {
      eyebrow: "وظائف شاغرة",
      title: "التوظيف قريباً",
      subtitle: "نحن فريق صغير يتوسع عن قصد. نوظف عندما يكون لدينا حاجة حقيقية، ليس قبل ذلك.",
      openTitle: "لا نوظف علنياً الآن",
      openBody: "لكن إذا كنت استثنائياً ومهاراتك تتطابق مع ما نبنيه، نريد أن نسمع منك. أرسل لنا ملاحظة عن من أنت، وما الذي بنيته، ولماذا Zyrix. أفضل التوظيفات تأتي غالباً من تطبيقات غير مطلوبة.",
    },
    cta: { title: "لا تنتظر إعلان وظيفة", subtitle: "إذا كنت ستكون رائعاً في Zyrix، أخبرنا. سنجد طريقة للعمل معاً.", primary: "تواصل معنا" },
  },
  Press: {
    eyebrow: "صحافة",
    title: "الصحافة والإعلام",
    subtitle: "موارد للصحفيين والمدونين والمحللين والشركاء الذين يغطون سوق SaaS في الشرق الأوسط وشمال إفريقيا وتركيا.",
    kit: {
      title: "حزمة الصحافة",
      body: "كل ما تحتاجه للكتابة عن Zyrix — الشعارات، إرشادات العلامة، لقطات الشاشة، وورقة حقائق الشركة. متاحة بالإنجليزية والعربية والتركية.",
      logos: "الشعارات (PNG، SVG، فاتح + داكن)",
      brandGuide: "إرشادات العلامة ولوحة الألوان",
      screenshots: "لقطات شاشة المنتج (دقة عالية)",
      factSheet: "ورقة حقائق الشركة",
      cta: "اطلب حزمة الصحافة",
    },
    facts: {
      eyebrow: "حقائق الشركة",
      title: "حقائق سريعة",
      founded: "تأسست",
      foundedValue: "2025",
      hq: "المقر الرئيسي",
      hqValue: "إسطنبول، تركيا",
      markets: "الأسواق النشطة",
      marketsValue: "الشرق الأوسط وشمال إفريقيا + تركيا (12 دولة)",
      employees: "حجم الفريق",
      employeesValue: "فريق صغير، مقصود",
      languages: "اللغات المدعومة",
      languagesValue: "العربية، التركية، الإنجليزية (RTL أصلي)",
      industries: "الصناعات المخدومة",
      industriesValue: "تجارة إلكترونية، عقارات، رعاية صحية، وكالات، مبيعات",
    },
    releases: { eyebrow: "إصدارات صحفية", title: "إعلانات حديثة" },
    release1: {
      title: "Zyrix CRM يطلق في تركيا والسعودية في وقت واحد",
      body: "تعلن Zyrix عن التوفر العام لمنصة CRM التي تعطي الأولوية لواتساب عبر تركيا والمملكة العربية السعودية، مع دعم أصلي للعربية والتركية والإنجليزية. يتزامن الإطلاق مع تكاملات سمسا وأرامكس و MNG Kargo و Yurtiçi Kargo.",
    },
    release2: {
      title: "Zyrix يدمج Meta Cloud API لواتساب المؤسسات",
      body: "التكامل المباشر مع Meta WhatsApp Cloud API يمكّن عملاء Zyrix من إرسال رسائل مُعدّة، وإدارة ملفات الأعمال التجارية، والوصول إلى تحليلات متقدمة — كل ذلك من داخل لوحة Zyrix CRM.",
    },
    release3: {
      title: "Zyrix يطلق تقارير متعددة العملات لأعمال الشرق الأوسط",
      body: "محرك تقارير جديد يدعم SAR و AED و EGP و TRY و KWD و QAR و USD مع تحويل تلقائي للعملات باستخدام أسعار TCMB و SAMA اليومية. يمكّن من إعداد تقارير مالية دقيقة عبر الحدود للأعمال العاملة في أسواق عربية متعددة.",
    },
    contact: {
      title: "استفسارات الإعلام",
      body: "للمقابلات أو التعليقات الخبيرة على سوق SaaS في الشرق الأوسط أو معلومات المنتج، يرجى التواصل. عادة نرد خلال 24 ساعة.",
    },
  },
};

// ============================================================================
// TR — professional business tone, technical terms preserved
// ============================================================================
const TR = {
  Customers: {
    eyebrow: "MÜŞTERİLER",
    title: "Arap ve Türk işletmelerinin gerçekte büyüdüğü şekilde tasarlandı.",
    subtitle: "Cidde'deki e-ticaret işletmelerinden İstanbul'daki diş kliniklerine, Dubai'deki emlak danışmanlarından Kahire'deki dijital ajanslara kadar — Zyrix, pazarını anlayan işletmelere güç veriyor.",
    logosTitle: "BÜYÜYEN EKİPLER TARAFINDAN GÜVENİLİYOR",
    stats: { businesses: "Aktif işletmeler", countries: "Hizmet verilen ülkeler", languages: "Yerel diller", uptime: "Platform çalışma süresi" },
    casesEyebrow: "BAŞARI HİKAYELERİ",
    casesTitle: "Gerçek ekipler. Gerçek sonuçlar.",
    case1: {
      industry: "E-TİCARET",
      location: "Cidde, Suudi Arabistan",
      metric1: "Gelir büyümesi",
      metric2: "Sepet kurtarma",
      metric3: "WhatsApp yanıt süresi",
      quote: "Eskiden günde 4 saatimizi SMSA, Aramex ve hesaplarımız arasında Kapıda Ödeme siparişlerini mutabık kılmakla geçiriyorduk. Zyrix her şeyi otomatikleştirdi. Artık finans ekibimiz Excel yerine büyümeye odaklanıyor.",
      role: "Operasyon Müdürü",
    },
    case2: {
      industry: "EMLAK",
      location: "İstanbul, Türkiye",
      metric1: "Müşteri yanıt iyileştirmesi",
      metric2: "Gösterimden tekliflere",
      metric3: "Ortalama ilk yanıt",
      quote: "Danışmanlarımız WhatsApp'ta yeterince hızlı yanıt veremedikleri için müşterilerinin yarısını kaybediyorlardı. Zyrix ile tüm ekip 15 dakika içinde yanıt veriyor. Dönüşüm 60 günde iki katına çıktı.",
      role: "Satış Direktörü",
    },
    case3: {
      industry: "SAĞLIK",
      location: "Riyad, Suudi Arabistan",
      metric1: "Gelmeme azaltma",
      metric2: "Hasta tutma",
      metric3: "Hasta memnuniyeti",
      quote: "Zyrix öncesi %35 gelmeme oranımız vardı. Otomatik WhatsApp hatırlatmaları bunu %11'e düşürdü. Bu, resepsiyona ek iş yükü olmadan saf kurtarılmış gelir.",
      role: "Klinik Direktörü",
    },
    case4: {
      industry: "DİJİTAL AJANS",
      location: "Kahire, Mısır",
      metric1: "Müşteri kapasitesi ölçeklendi",
      metric2: "Marj iyileştirmesi",
      metric3: "Müşteri raporu başına süre",
      quote: "Aynı ekiple 8 müşteri yönetmekten 27'ye geçtik. Zyrix'in otomatik raporlaması bile bize haftada 30 saat tasarruf sağlıyor. Marjlarımız nihayet anlamlı.",
      role: "Ajans Kurucusu",
    },
    cta: { title: "Zyrix ile büyüyen 500+ işletmeye katılın", subtitle: "Ücretsiz başlayın. 30 günde sonuçları görün. Her zaman iptal edin.", primary: "Ücretsiz denemeye başla", secondary: "Satışla görüş" },
  },
  Careers: {
    eyebrow: "KARİYER",
    title: "Arap dünyasının hak ettiği CRM'i inşa edin.",
    subtitle: "Silikon Vadisi'nin uzun zamandır görmezden geldiği işletmeler için yazılım inşa eden, kasıtlı olarak küçük ve verimli bir ekibiz. Bize katılın.",
    location: "İstanbul, Türkiye · Uzaktan çalışmaya uygun",
    mission: { eyebrow: "NEDEN VARIZ", title: "Çoğu yazılım başkasının pazarı için tasarlandı.", body: "Zyrix, Arap, Türk ve MENA işletmelerinin gerçekte nasıl çalıştığına göre tasarlanmış araçları hak ettiği için var — Arapça öncelikli, WhatsApp yerel, Kapıda Ödeme bilincine sahip, düzenleme uyumlu. Silikon Vadisi ürünlerini çevirmiyoruz. Yerel bir şey inşa ediyoruz." },
    values: {
      eyebrow: "BİZ KİMİZ",
      title: "Nasıl çalışıyoruz",
      customer: { title: "Müşteri öncelikli", desc: "Vanity metriklerin peşinden koşmuyoruz. Bir özellik müşterinin gününü kolaylaştırmıyorsa, onu inşa etmiyoruz." },
      team: { title: "Küçük ekip, büyük güven", desc: "Yavaş işe alıyoruz ve tamamen güveniyoruz. Herkes kendi alanına baştan sona sahip. Daha az yönetim, daha çok teslimat." },
      regional: { title: "Bölgesel, küresel-eksi değil", desc: "ABD ürününün sulandırılmış bir versiyonu değiliz. Bu bölge için inşa edildik — Arapça öncelikli, WhatsApp yerel, Kapıda Ödeme bilincine sahip." },
      ship: { title: "Teslim et, sonra öğren", desc: "Her hafta dağıtıyoruz. Yanlış olmak için altı ay beklemektense kusurlu bir şeyi teslim edip iyileştirmeyi tercih ederiz." },
      learn: { title: "Her zaman öğreniyoruz", desc: "Kişi başı yıllık 2.000$ kitap, kurs ve konferans için. Akıllıları işe alır, sonra akıllı kalmalarını sağlarız." },
      balance: { title: "Sürdürülebilir tempo", desc: "Tükenmeden hızlı hareket ederiz. 70 saatlik haftalar yok. Özellik inşa eden mühendisler için on-call rotasyon yok. Gerçek hafta sonları." },
    },
    perks: {
      eyebrow: "NE SUNUYORUZ",
      title: "Tazminat + yan haklar",
      equity: { title: "Anlamlı hisse senedi", desc: "Tam zamanlı her işe alım hisse senedi alır. Başarımız sizin başarınızdır." },
      remote: { title: "Uzaktan çalışmaya uygun", desc: "İstanbul merkez. Türkiye, Suudi Arabistan, BAE ve Mısır içinde uzaktan. Üç ayda bir buluşuyoruz." },
      health: { title: "Sağlık sigortası", desc: "Sizin ve yakın ailenizin tam kapsamı. Ruh sağlığı dahil." },
      learning: { title: "Öğrenme bütçesi", desc: "Yıllık 2.000$ kitap, kurs, konferans için. Büyümenize yardımcı olacak şekilde kullanın." },
      equipment: { title: "En iyi ekipman", desc: "MacBook Pro M serisi. Harici monitör. En iyi işinizi yapmak için neye ihtiyacınız varsa." },
      timeoff: { title: "Cömert izin", desc: "30 gün ücretli izin artı bölgesel tatiller. Ciddiyiz — zamanı alın." },
    },
    positions: {
      eyebrow: "AÇIK POZİSYONLAR",
      title: "Yakında işe alım",
      subtitle: "Kasıtlı olarak ölçeklenen küçük bir ekibiz. Gerçek bir ihtiyacımız olduğunda işe alıyoruz, daha önce değil.",
      openTitle: "Şu anda halka açık işe alım yapmıyoruz",
      openBody: "Ama olağanüstüyseniz ve becerileriniz inşa ettiğimizle eşleşiyorsa, sizden haber almak istiyoruz. Kim olduğunuz, ne inşa ettiğiniz ve neden Zyrix hakkında bize bir not gönderin. En iyi işe alımlar genellikle istenmeden gelen başvurulardan gelir.",
    },
    cta: { title: "Bir iş ilanı beklemeyin", subtitle: "Zyrix'te inanılmaz olacaksanız, bize söyleyin. Birlikte çalışmanın bir yolunu bulacağız.", primary: "İletişime geç" },
  },
  Press: {
    eyebrow: "BASIN",
    title: "Basın & Medya",
    subtitle: "MENA + Türkiye SaaS pazarını kapsayan gazeteciler, blog yazarları, analistler ve ortaklar için kaynaklar.",
    kit: {
      title: "Basın Kiti",
      body: "Zyrix hakkında yazmak için ihtiyacınız olan her şey — logolar, marka kuralları, ekran görüntüleri ve şirket gerçek sayfamız. EN, AR ve TR'de mevcuttur.",
      logos: "Logolar (PNG, SVG, açık + koyu)",
      brandGuide: "Marka kuralları ve renk paleti",
      screenshots: "Ürün ekran görüntüleri (yüksek çözünürlük)",
      factSheet: "Şirket gerçek sayfası",
      cta: "Basın kiti talep et",
    },
    facts: {
      eyebrow: "ŞİRKET GERÇEKLERİ",
      title: "Hızlı gerçekler",
      founded: "Kuruluş",
      foundedValue: "2025",
      hq: "Genel Merkez",
      hqValue: "İstanbul, Türkiye",
      markets: "Aktif pazarlar",
      marketsValue: "MENA + Türkiye (12 ülke)",
      employees: "Ekip büyüklüğü",
      employeesValue: "Küçük, kasıtlı ekip",
      languages: "Desteklenen diller",
      languagesValue: "Arapça, Türkçe, İngilizce (yerel RTL)",
      industries: "Hizmet verilen sektörler",
      industriesValue: "E-ticaret, emlak, sağlık, ajanslar, satış",
    },
    releases: { eyebrow: "BASIN BÜLTENLERİ", title: "Son duyurular" },
    release1: {
      title: "Zyrix CRM, Türkiye ve Suudi Arabistan'da eş zamanlı olarak başlıyor",
      body: "Zyrix, WhatsApp öncelikli CRM platformunun Türkiye ve Suudi Arabistan'da genel kullanılabilirliğini, Arapça, Türkçe ve İngilizce için yerel destekle birlikte duyurdu. Lansman, SMSA, Aramex, MNG Kargo ve Yurtiçi Kargo entegrasyonlarıyla aynı zamana denk geliyor.",
    },
    release2: {
      title: "Zyrix, kurumsal WhatsApp için Meta Cloud API'yi entegre ediyor",
      body: "Meta'nın WhatsApp Cloud API'siyle doğrudan entegrasyon, Zyrix müşterilerinin şablonlu mesajlar göndermesine, işletme profillerini yönetmesine ve gelişmiş analizlere erişmesine olanak tanır — hepsi Zyrix CRM panelinin içinden.",
    },
    release3: {
      title: "Zyrix, MENA işletmeleri için çok para birimli raporlama yayınladı",
      body: "Yeni raporlama motoru, günlük TCMB ve SAMA kurları kullanarak otomatik FX dönüşümü ile SAR, AED, EGP, TRY, KWD, QAR, USD'yi destekler. Birden fazla Arap pazarında faaliyet gösteren işletmeler için doğru sınır ötesi mali raporlamayı sağlar.",
    },
    contact: {
      title: "Medya soruları",
      body: "Röportajlar, MENA SaaS pazarı üzerine uzman yorumları veya ürün bilgisi için lütfen iletişime geçin. Genellikle 24 saat içinde yanıt veriyoruz.",
    },
  },
};

// ============================================================================
// Apply
// ============================================================================
function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf-8")); }
function writeJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8"); }
function getKeyPaths(obj, prefix = "") {
  const keys = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const full = prefix ? `${prefix}.${k}` : k;
      keys.push(full);
      keys.push(...getKeyPaths(v, full));
    }
  }
  return keys;
}

const NAMESPACES = ["Customers", "Careers", "Press"];
const sets = { en: EN, ar: AR, tr: TR };
const reports = [];

for (const loc of ["en", "ar", "tr"]) {
  const targetPath = path.join(MSG_DIR, `${loc}.json`);
  const target = readJSON(targetPath);
  const beforeBytes = Buffer.byteLength(fs.readFileSync(targetPath, "utf-8"), "utf-8");
  const beforeTopKeys = Object.keys(target).length;

  for (const ns of NAMESPACES) {
    if (ns in target) console.warn(`  ⚠ ${loc}.json: ${ns} already exists — overwriting`);
    target[ns] = sets[loc][ns];
  }

  writeJSON(targetPath, target);
  const written = readJSON(targetPath);
  const afterBytes = Buffer.byteLength(fs.readFileSync(targetPath, "utf-8"), "utf-8");

  reports.push({
    locale: loc,
    topKeys: `${beforeTopKeys} → ${Object.keys(written).length}`,
    bytes: `${beforeBytes} → ${afterBytes}`,
    delta: `+${afterBytes - beforeBytes}`,
  });
}

console.log("=== Sprint 14g — Company namespaces merged ===");
console.table(reports);

console.log("\n=== Parity check ===");
const en = readJSON(path.join(MSG_DIR, "en.json"));
const ar = readJSON(path.join(MSG_DIR, "ar.json"));
const tr = readJSON(path.join(MSG_DIR, "tr.json"));

let parityOk = true;
for (const ns of NAMESPACES) {
  const enKeys = new Set(getKeyPaths(en[ns]));
  const arKeys = new Set(getKeyPaths(ar[ns]));
  const trKeys = new Set(getKeyPaths(tr[ns]));
  const arDiff = [...enKeys].filter((k) => !arKeys.has(k)).concat([...arKeys].filter((k) => !enKeys.has(k)));
  const trDiff = [...enKeys].filter((k) => !trKeys.has(k)).concat([...trKeys].filter((k) => !enKeys.has(k)));
  if (arDiff.length === 0 && trDiff.length === 0) {
    console.log(`  ✅ ${ns}: ${enKeys.size} keys × 3 locales — identical`);
  } else {
    parityOk = false;
    console.log(`  ❌ ${ns} parity FAIL`);
    if (arDiff.length) console.log("     en↔ar diff:", arDiff);
    if (trDiff.length) console.log("     en↔tr diff:", trDiff);
  }
}

if (!parityOk) process.exit(1);
console.log("\n✅ All 3 namespaces merged with full parity across en/ar/tr.");
