// scripts/merge-sprint14f-solutions.cjs
// One-time script to add the 5 Solutions namespaces to en/ar/tr.json
// Run once: node scripts/merge-sprint14f-solutions.cjs

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MSG_DIR = path.join(ROOT, "messages");

// ============================================================================
// EN content
// ============================================================================
const EN = {
  SolutionsSales: {
    eyebrow: "FOR SALES TEAMS",
    hero: {
      title: "Close more deals. Forget the spreadsheets.",
      subtitle: "The CRM your sales team actually wants to use. WhatsApp-first, mobile-native, built for the way Arab and Turkish sales teams actually sell.",
      ctaPrimary: "Start free 14-day trial",
      ctaSecondary: "Talk to sales",
    },
    pain: {
      eyebrow: "WHY SALES TEAMS PICK ZYRIX",
      title: "Most CRMs are designed for managers. Yours should work for the closer.",
      subtitle: "We talked to 200+ sales reps across MENA and Türkiye. Three problems came up every single time:",
      point1: "Logging activities takes longer than the activities themselves. Reps stop logging — managers stop trusting the data.",
      point2: "WhatsApp is where the deals actually happen, but every CRM treats it as an afterthought. Reps copy-paste between apps all day.",
      point3: "Mobile apps are stripped-down toys. Reps in the field can't update deals, can't access notes, can't close from their phone.",
    },
    features: {
      eyebrow: "BUILT FOR THE WAY YOU SELL",
      title: "Everything a closer needs. Nothing they don't.",
      pipeline: { title: "Visual deal pipeline", desc: "Drag-and-drop kanban. Customize stages per product line. See every deal, every value, every next step at a glance." },
      calls: { title: "Click-to-call + auto-log", desc: "Tap to call any contact from web or mobile. Calls auto-log to the deal with duration. Optional recording for compliance." },
      team: { title: "Team collaboration", desc: "@mention teammates on deals. Internal chat threads per opportunity. Handoffs without context loss." },
      forecast: { title: "Sales forecasting", desc: "AI-powered forecast based on historical close rates. See projected revenue by month, quarter, rep, and region." },
      reports: { title: "Real-time dashboards", desc: "Custom reports for managers. Drill down by rep, region, product, or stage. Export to PDF or share via link." },
      automation: { title: "Smart automation", desc: "Auto-assign leads by territory. Auto-follow-up if no reply in 3 days. Auto-close deals stuck for 90 days. Less admin, more selling." },
    },
    workflow: {
      eyebrow: "A DAY WITH ZYRIX",
      title: "From lead to closed-won in 5 steps",
      subtitle: "How a typical deal flows through Zyrix in real Arab and Turkish sales contexts.",
      step1: { title: "Lead arrives via WhatsApp", desc: "Customer sends message to your business number. Zyrix auto-creates a contact and lead, tagged with source = WhatsApp." },
      step2: { title: "Auto-assigned to right rep", desc: "Round-robin or by region/language/product. Rep gets a push notification. Contact details + conversation history already in the deal." },
      step3: { title: "Rep qualifies + sends quote", desc: "Rep replies in WhatsApp from inside Zyrix. Sends product catalog. Generates a quote PDF in 30 seconds." },
      step4: { title: "Follow-ups happen automatically", desc: "No reply in 2 days? Zyrix sends a polite WhatsApp follow-up. Still no reply in 5 days? Manager gets a nudge. Deal never falls through." },
      step5: { title: "Close + handover to fulfillment", desc: "Customer agrees. Rep clicks 'Won'. Deal moves to fulfillment pipeline. Customer gets confirmation message. Internal Slack/Teams notification fires. Done." },
    },
    stats: { faster: "Faster deal cycles", deals: "More deals per rep", followup: "Follow-up consistency", access: "Mobile + web access" },
    cta: { title: "Built for the way you actually sell", subtitle: "Start free. No credit card. 14 days to fall in love.", primary: "Start free trial", secondary: "Talk to a human" },
  },
  SolutionsEcommerce: {
    eyebrow: "FOR E-COMMERCE",
    hero: {
      title: "WhatsApp-first commerce. Built for MENA and Türkiye.",
      subtitle: "Sync your Shopify or WooCommerce store. Recover abandoned carts via WhatsApp. Track COD orders. All in one CRM that speaks Arabic and Turkish natively.",
      ctaPrimary: "Start free 14-day trial",
      ctaSecondary: "Talk to sales",
    },
    pain: {
      eyebrow: "WHY E-COMMERCE PICKS ZYRIX",
      title: "Western e-commerce CRMs don't understand our market.",
      subtitle: "Selling in Saudi Arabia, the UAE, Iraq, or Türkiye? You face problems Shopify wasn't built for:",
      point1: "70% of orders are COD. Most CRMs have no concept of COD lifecycle — confirmed → shipped → collected → reconciled.",
      point2: "Arabic and Turkish customers expect WhatsApp replies in minutes, not 24 hours via support ticket. Bots that don't speak Arabic well lose trust fast.",
      point3: "Shipping in MENA means dozens of local couriers (SMSA, Aramex Saudi, Naqel, MNG, Yurtiçi…). Western CRMs only know UPS and FedEx.",
    },
    features: {
      eyebrow: "EVERYTHING YOUR STORE NEEDS",
      title: "Sync your store. Sell from WhatsApp. Track every order.",
      shopify: { title: "Shopify + WooCommerce sync", desc: "Connect your store in 2 minutes. Products, orders, customers — all sync automatically. Two-way: changes in Zyrix push back to your store." },
      inventory: { title: "Multi-warehouse inventory", desc: "Track stock across multiple warehouses (Riyadh, Istanbul, Dubai). Auto-reroute orders to the closest warehouse. Low-stock alerts." },
      whatsapp: { title: "WhatsApp catalog + checkout", desc: "Send product catalog via WhatsApp. Customer browses, orders, pays — all in WhatsApp. Order auto-creates in Zyrix and your store." },
      abandoned: { title: "Abandoned cart recovery", desc: "Customer leaves cart? Zyrix sends a personalized WhatsApp message in their language. Recover 30%+ of abandoned carts." },
      cod: { title: "COD order tracking", desc: "Track every COD order from confirmation → courier pickup → delivery → cash collected. Reconcile daily. Never lose a payment again." },
      shipping: { title: "Local courier integrations", desc: "SMSA, Aramex, Naqel, MNG Kargo, Yurtiçi, J&T, and 25+ more. Auto-create labels. Track every package without leaving Zyrix." },
    },
    workflow: {
      eyebrow: "FROM CLICK TO CASH",
      title: "How a WhatsApp order flows through Zyrix",
      subtitle: "A real customer journey for an Arab consumer buying skincare from a Saudi Shopify store.",
      step1: { title: "Customer messages on WhatsApp", desc: "Customer sees Instagram ad, taps 'Message us'. WhatsApp opens. Zyrix auto-greets in Arabic and shows the product catalog." },
      step2: { title: "Browses + adds to cart", desc: "Customer browses catalog inside WhatsApp. Adds 3 items. Zyrix calculates total in SAR including shipping and VAT. Cart held for 60 minutes." },
      step3: { title: "Checks out — selects COD", desc: "Customer enters address. Selects Cash on Delivery. Order is confirmed. Zyrix creates the order in Shopify, books the courier (SMSA), generates the shipping label." },
      step4: { title: "Auto-confirmation + tracking", desc: "Customer gets WhatsApp confirmation with order number and SMSA tracking URL. Zyrix monitors the SMSA API. Updates customer when picked up, when out for delivery." },
      step5: { title: "Delivery + cash reconciliation", desc: "Courier delivers, collects cash. SMSA syncs the status to Zyrix. Cash is reconciled to the merchant's bank deposit on day 7. Order marked complete. Customer added to retargeting segment." },
    },
    stats: { recovery: "Cart recovery", aov: "Average order value", repeat: "Repeat purchase rate", response: "Avg WhatsApp response" },
    cta: { title: "Stop fighting Western CRMs", subtitle: "Built for MENA + Türkiye. WhatsApp-first. COD-native. Arabic + Turkish + English.", primary: "Start free trial", secondary: "Schedule demo" },
  },
  SolutionsRealEstate: {
    eyebrow: "FOR REAL ESTATE",
    hero: {
      title: "Close more property deals. Lose fewer leads.",
      subtitle: "Built for real estate brokers in Riyadh, Istanbul, Dubai, and Cairo. Listings, virtual tours, viewings, contracts — all in one CRM that respects how the regional market actually works.",
      ctaPrimary: "Start free 14-day trial",
      ctaSecondary: "Talk to sales",
    },
    pain: {
      eyebrow: "WHY BROKERS PICK ZYRIX",
      title: "Real estate is local. Your CRM should be too.",
      subtitle: "Selling property in Saudi Arabia or Türkiye is different from selling in California. Three pain points:",
      point1: "Buyers contact 5-10 brokers at once via WhatsApp. The broker who replies first wins. Reply in 15 minutes or lose the lead.",
      point2: "Property contracts have regional specifics — KSA's Tabu system, Türkiye's iskan certificates, Egypt's contract notarization. Generic CRMs ignore them.",
      point3: "Brokers in the field need everything mobile. Western desktop-first CRMs are useless when you're walking a property with a buyer.",
    },
    features: {
      eyebrow: "EVERYTHING A BROKER NEEDS",
      title: "From listing to contract — built for the regional broker",
      listings: { title: "Property listings", desc: "Manage residential and commercial listings. Photos, floor plans, specs. Auto-publish to Sahibinden, Property Finder, Bayut. Update once, sync everywhere." },
      location: { title: "Location intelligence", desc: "Map view of all properties. Filter by district, school zone, distance to metro. Show comparable sales. Generate location reports for buyers." },
      virtual: { title: "Virtual tours + media", desc: "Upload 360° tours, video walkthroughs. Generate WhatsApp-ready property links. Track which media each buyer viewed and for how long." },
      viewings: { title: "Viewing scheduling", desc: "Buyers book viewings via WhatsApp or your website. Calendar sync. Auto-confirmations. Reminder 1 hour before. No-shows tracked." },
      contracts: { title: "Regional contracts", desc: "Tabu (KSA), Tapu (Türkiye), Title Deed (UAE) — built-in templates. E-signature. Document collection from buyer + seller. Audit trail for legal review." },
      brokers: { title: "Multi-broker teams", desc: "Track which broker brought which lead. Auto-assign by district, language, or property type. Commission splits. Performance dashboards by team." },
    },
    workflow: {
      eyebrow: "FROM LEAD TO HANDOVER",
      title: "How a property deal flows through Zyrix",
      subtitle: "A real journey for a Saudi family buying a villa in north Riyadh.",
      step1: { title: "Lead from Sahibinden / Property Finder", desc: "Buyer contacts via property listing. Zyrix creates the lead, attaches the property, notes their budget and preferred districts." },
      step2: { title: "Broker replies within 5 minutes", desc: "Auto-assigned broker gets a push notification. Replies on WhatsApp with 3 similar properties + 360° tour links. All from inside Zyrix." },
      step3: { title: "Viewings booked + attended", desc: "Family books 3 viewings via the broker's calendar link. Reminders sent. Broker logs viewing notes after each — what they liked, dislikes, body language." },
      step4: { title: "Offer + negotiation", desc: "Family sends offer. Owner counter-offers. Broker tracks the negotiation thread. Documents (income proof, ID copies) collected via secure upload. All inside the deal." },
      step5: { title: "Contract + handover", desc: "Final terms agreed. Tabu transfer paperwork generated from template. E-signature collected. Deposit paid. Tabu registration scheduled. Family hands over keys 4 weeks later. Broker earns commission, marked in pipeline." },
    },
    stats: { leadResponse: "Lead response time", conversions: "Viewings to offers", contractRetention: "Contract close rate", firstResponse: "Avg first reply" },
    cta: { title: "Built for regional brokers", subtitle: "Tabu, Tapu, Title Deed — all native. Arabic, Turkish, English. Mobile-first.", primary: "Start free trial", secondary: "Talk to a real estate specialist" },
  },
  SolutionsClinics: {
    eyebrow: "FOR HEALTHCARE",
    hero: {
      title: "Patient relationships, not just records.",
      subtitle: "Appointment booking, follow-ups, loyalty programs, and HIPAA-compliant patient communication. Built for clinics, dental practices, and aesthetic centers across MENA and Türkiye.",
      ctaPrimary: "Start free 14-day trial",
      ctaSecondary: "Talk to sales",
    },
    pain: {
      eyebrow: "WHY CLINICS PICK ZYRIX",
      title: "Patient experience is your competitive edge.",
      subtitle: "Healthcare is local, personal, and increasingly competitive. Three challenges every clinic faces:",
      point1: "30% of appointments are no-shows in the region. Manual reminders are inconsistent. Reception staff stretched thin.",
      point2: "Generic CRMs don't understand patient flows — appointment → consultation → treatment plan → follow-up → review. They store data, not relationships.",
      point3: "Patient communication regulations are tightening (Saudi NCDC, Turkish KVKK). Most CRMs aren't designed for medical compliance.",
    },
    features: {
      eyebrow: "FROM BOOKING TO LOYALTY",
      title: "Everything a modern clinic needs to grow.",
      appointments: { title: "Smart appointment booking", desc: "Patients book via website, WhatsApp, or app. See doctor availability. Confirm via WhatsApp. Reschedule with one tap. No double-booking." },
      records: { title: "Patient records", desc: "Centralized medical history, treatment plans, prescriptions, attachments. Search across patients in seconds. Doctor and admin views with role-based access." },
      followup: { title: "Automated follow-ups", desc: "Post-visit thank-you messages. Treatment plan reminders. Annual checkup nudges. Lab result delivery. All via WhatsApp in the patient's language." },
      reminders: { title: "Appointment reminders", desc: "24 hours before: WhatsApp reminder. 1 hour before: confirmation prompt. Cuts no-show rates by 60-80%." },
      loyalty: { title: "Patient loyalty", desc: "Track visits, points, referrals. Birthday wishes. Anniversary discounts. Family member identification. Turn one-time patients into lifetime ones." },
      privacy: { title: "Compliance + privacy", desc: "HIPAA-aligned. Saudi NCDC and Turkish KVKK compliant. Patient consent tracking. Data residency in your region. Audit logs." },
    },
    workflow: {
      eyebrow: "A PATIENT JOURNEY",
      title: "From first visit to lifetime patient",
      subtitle: "How a typical patient flows through Zyrix in a dental clinic in Istanbul.",
      step1: { title: "Booking via WhatsApp", desc: "Patient sees Instagram ad. Sends WhatsApp message. Zyrix bot offers available slots. Patient picks one. Confirmation sent. Calendar updated." },
      step2: { title: "Day-before reminder", desc: "Auto-WhatsApp reminder 24 hours before. Patient confirms. If no response, second reminder 4 hours before. Reception staff knows who's coming." },
      step3: { title: "Visit + treatment plan", desc: "Doctor sees patient. Logs diagnosis, treatment plan, before/after photos. Patient receives WhatsApp summary with cost estimate, next steps, and downloadable treatment plan." },
      step4: { title: "Follow-up + payment", desc: "Patient gets reminder for next visit (3 days for cleaning, 14 days for procedure). Payment link sent. Insurance documentation filed. Loyalty points credited." },
      step5: { title: "Long-term care", desc: "6 months: annual checkup reminder. 1 year: birthday wishes + 10% discount. 2 years: 'we miss you' message if no visit. Patients become advocates and refer family." },
    },
    stats: { noShow: "No-show reduction", retention: "Patient retention", satisfaction: "Patient satisfaction", timesSaved: "Reception time saved" },
    cta: { title: "Treat patients like people, not records", subtitle: "HIPAA-aligned. Multi-language. Compliant with regional health regulations.", primary: "Start free trial", secondary: "Schedule a clinic demo" },
  },
  SolutionsAgencies: {
    eyebrow: "FOR AGENCIES",
    hero: {
      title: "Run more clients. With fewer people. Without the chaos.",
      subtitle: "Multi-client management, white-label dashboards, automated reporting, and proposal-to-payment workflows. Built for marketing, digital, and consulting agencies serving MENA + Türkiye.",
      ctaPrimary: "Start free 14-day trial",
      ctaSecondary: "Talk to sales",
    },
    pain: {
      eyebrow: "WHY AGENCIES PICK ZYRIX",
      title: "Agencies are scaling on broken tooling.",
      subtitle: "If you run an agency in MENA or Türkiye, three things eat your margin:",
      point1: "Each new client = 3 hours of setup in 7 different tools. Agency margins compress with each scaled-up account.",
      point2: "Client reporting takes 20-40% of an account manager's week. Pulling numbers from Meta, Google, TikTok, then Excel-charting it for the client. Repeated weekly.",
      point3: "Proposals + contracts + invoices live in 4 different SaaS subscriptions. Each costs $30-100/month. Sales cycle is fragmented.",
    },
    features: {
      eyebrow: "EVERYTHING AGENCIES NEED",
      title: "Run dozens of clients without losing your sanity",
      clients: { title: "Multi-client workspace", desc: "Separate workspace per client. Shared data, isolated permissions. Account managers see only their clients. Agency leaders see everything." },
      reports: { title: "Automated reporting", desc: "Connect Meta Ads, Google Ads, TikTok, Snapchat, GA4. Auto-pull data daily. Generate client reports in 5 minutes. Schedule weekly emails. Custom branding per client." },
      team: { title: "Team collaboration", desc: "Account managers, designers, copywriters, media buyers — all in one tool. Tasks. Time tracking. Capacity planning. Who's available next month?" },
      proposals: { title: "Proposals + contracts", desc: "Pre-built proposal templates. Auto-fill from client brief. E-signature. Once signed: contract auto-generates, invoicing schedule kicks off, project tasks created." },
      workflow: { title: "Workflow automation", desc: "New client onboarding (12 tasks across 4 teams). Monthly retainer billing. Quarterly business reviews. Set it once, runs every month forever." },
      whitelabel: { title: "White-label client portals", desc: "Each client logs in to your-agency.zyrix.co (or custom domain). Sees their dashboards, reports, projects. Looks 100% like your agency. Charges them for the access." },
    },
    workflow: {
      eyebrow: "A CLIENT LIFECYCLE",
      title: "From first call to long-term retainer",
      subtitle: "How a digital agency in Istanbul wins and runs a Saudi e-commerce client.",
      step1: { title: "Lead → discovery call", desc: "Saudi brand books a call via your website. Zyrix logs the lead. Discovery questionnaire sent. Pre-call brief auto-generated for the AM." },
      step2: { title: "Proposal + close", desc: "AM uses Zyrix template, fills in scope and pricing. Sent to client via white-label portal. Client signs. Contract + first invoice generated automatically." },
      step3: { title: "Onboarding (12 tasks, 4 teams)", desc: "Zyrix kicks off the onboarding workflow. Designer creates brand assets. Media buyer connects accounts. Copywriter drafts content calendar. Project manager schedules kickoff. All tasks tracked." },
      step4: { title: "Monthly execution + reporting", desc: "Campaigns run. Daily ad management. Zyrix pulls performance data daily. Monthly: report auto-generated, AM reviews, sends to client. Client sees ROAS, CPL, CAC, conversions." },
      step5: { title: "Retention + upsell", desc: "Quarterly business reviews scheduled. Performance tracked against KPIs. Upsell opportunities flagged (new channel, market expansion). Client renews retainer at higher tier." },
    },
    stats: { scale: "Client capacity", margin: "Margin improvement", retention: "Client retention", report: "Time to generate report" },
    cta: { title: "Scale your agency. Keep your sanity.", subtitle: "Multi-client workspaces. White-label. Automated reporting. Built for MENA + Türkiye agencies.", primary: "Start free trial", secondary: "Talk to an agency specialist" },
  },
};

// ============================================================================
// AR content (verbatim from prompt)
// ============================================================================
const AR = {
  SolutionsSales: {
    eyebrow: "لفرق المبيعات",
    hero: { title: "أغلق صفقات أكثر. وانسَ جداول البيانات.", subtitle: "نظام CRM فريق مبيعاتك سيستخدمه فعلاً. واتساب أولاً، يعمل على الجوال، مصمم لطريقة بيع فرق المبيعات العربية والتركية.", ctaPrimary: "ابدأ تجربة مجانية 14 يوماً", ctaSecondary: "تحدث مع المبيعات" },
    pain: { eyebrow: "لماذا تختار فرق المبيعات Zyrix", title: "معظم أنظمة CRM مصممة للمدراء. نظامك يجب أن يعمل للبائع.", subtitle: "تحدثنا مع أكثر من 200 مندوب مبيعات في منطقة الشرق الأوسط وتركيا. ثلاث مشاكل كانت تتكرر في كل مرة:", point1: "تسجيل الأنشطة يستغرق وقتاً أطول من الأنشطة نفسها. المندوبون يتوقفون عن التسجيل، والمدراء يتوقفون عن الثقة بالبيانات.", point2: "واتساب هو حيث تحدث الصفقات فعلياً، لكن كل CRM يتعامل معه كفكرة لاحقة. المندوبون ينسخون ويلصقون بين التطبيقات طوال اليوم.", point3: "تطبيقات الجوال نسخ مبسطة لا فائدة منها. المندوبون في الميدان لا يستطيعون تحديث الصفقات، ولا الوصول للملاحظات، ولا الإغلاق من هواتفهم." },
    features: {
      eyebrow: "مصمم لطريقة بيعك",
      title: "كل ما يحتاجه البائع المحترف. ولا شيء غير ذلك.",
      pipeline: { title: "خط مبيعات مرئي", desc: "السحب والإفلات على لوحة كانبان. خصص المراحل لكل خط منتجات. شاهد كل صفقة وكل قيمة وكل خطوة تالية بنظرة واحدة." },
      calls: { title: "اضغط للاتصال + تسجيل تلقائي", desc: "اتصل بأي جهة اتصال من الويب أو الجوال بضغطة. المكالمات تُسجَّل تلقائياً مع المدة. تسجيل اختياري للامتثال." },
      team: { title: "تعاون الفريق", desc: "اذكر زملاءك بـ @ في الصفقات. محادثات داخلية لكل فرصة. تسليمات بدون فقدان السياق." },
      forecast: { title: "توقع المبيعات", desc: "توقعات مدعومة بالذكاء الاصطناعي بناءً على معدلات الإغلاق التاريخية. شاهد الإيرادات المتوقعة بالشهر، الربع، المندوب، والمنطقة." },
      reports: { title: "لوحات قيادة فورية", desc: "تقارير مخصصة للمدراء. تعمق بالمندوب، المنطقة، المنتج، أو المرحلة. صدِّر كـ PDF أو شارك عبر رابط." },
      automation: { title: "أتمتة ذكية", desc: "توزيع تلقائي للعملاء المحتملين حسب المنطقة. متابعة تلقائية إذا لم يردوا في 3 أيام. إغلاق تلقائي للصفقات الراكدة 90 يوماً. إدارة أقل، بيع أكثر." },
    },
    workflow: {
      eyebrow: "يوم مع Zyrix",
      title: "من العميل المحتمل إلى الإغلاق في 5 خطوات",
      subtitle: "كيف تتدفق الصفقة المعتادة عبر Zyrix في سياقات المبيعات العربية والتركية الحقيقية.",
      step1: { title: "العميل المحتمل يصل عبر واتساب", desc: "العميل يرسل رسالة لرقم عملك. Zyrix ينشئ تلقائياً جهة اتصال وعميلاً محتملاً، مُصنفاً بالمصدر = واتساب." },
      step2: { title: "تعيين تلقائي للمندوب المناسب", desc: "بالتدوير أو حسب المنطقة/اللغة/المنتج. المندوب يتلقى إشعاراً. تفاصيل الاتصال + سجل المحادثة موجودة بالفعل في الصفقة." },
      step3: { title: "المندوب يؤهل ويرسل عرض السعر", desc: "المندوب يرد في واتساب من داخل Zyrix. يرسل كتالوج المنتجات. يولد عرض سعر PDF في 30 ثانية." },
      step4: { title: "المتابعات تحدث تلقائياً", desc: "لا رد خلال يومين؟ Zyrix يرسل متابعة لطيفة عبر واتساب. لا يزال لا رد بعد 5 أيام؟ المدير يحصل على تنبيه. الصفقة لا تضيع أبداً." },
      step5: { title: "الإغلاق + تسليم للتنفيذ", desc: "العميل يوافق. المندوب يضغط 'فاز'. الصفقة تنتقل لخط أنابيب التنفيذ. العميل يحصل على رسالة تأكيد. إشعار داخلي على Slack/Teams ينطلق. تم." },
    },
    stats: { faster: "دورات صفقات أسرع", deals: "صفقات أكثر لكل مندوب", followup: "اتساق المتابعة", access: "الوصول من الجوال + الويب" },
    cta: { title: "مصمم لطريقة بيعك الحقيقية", subtitle: "ابدأ مجاناً. لا حاجة لبطاقة ائتمان. 14 يوماً لتقع في حبه.", primary: "ابدأ التجربة المجانية", secondary: "تحدث مع إنسان" },
  },
  SolutionsEcommerce: {
    eyebrow: "للتجارة الإلكترونية",
    hero: { title: "تجارة بأولوية واتساب. مصممة للشرق الأوسط وتركيا.", subtitle: "زامن متجر Shopify أو WooCommerce. استرد العربات المتروكة عبر واتساب. تتبع طلبات الدفع عند الاستلام. كل ذلك في CRM واحد يتحدث العربية والتركية بطلاقة أصلية.", ctaPrimary: "ابدأ تجربة مجانية 14 يوماً", ctaSecondary: "تحدث مع المبيعات" },
    pain: { eyebrow: "لماذا تختار التجارة الإلكترونية Zyrix", title: "أنظمة CRM الغربية للتجارة الإلكترونية لا تفهم سوقنا.", subtitle: "تبيع في السعودية، الإمارات، العراق، أو تركيا؟ تواجه مشاكل لم يُصمم Shopify لحلها:", point1: "70% من الطلبات دفع عند الاستلام. معظم أنظمة CRM ليس لديها مفهوم دورة حياة COD — تأكيد ← شحن ← تحصيل ← تسوية.", point2: "العملاء العرب والأتراك يتوقعون ردود واتساب في دقائق، لا 24 ساعة عبر تذكرة دعم. الروبوتات التي لا تتحدث العربية جيداً تفقد الثقة بسرعة.", point3: "الشحن في المنطقة يعني عشرات الشركات المحلية (سمسا، أرامكس السعودية، ناقل، MNG، يورتيتشي…). أنظمة CRM الغربية تعرف فقط UPS و FedEx." },
    features: {
      eyebrow: "كل ما يحتاجه متجرك",
      title: "زامن متجرك. بِع من واتساب. تتبع كل طلب.",
      shopify: { title: "مزامنة Shopify + WooCommerce", desc: "اربط متجرك في دقيقتين. المنتجات، الطلبات، العملاء — كلها تتزامن تلقائياً. ثنائي الاتجاه: التغييرات في Zyrix تُدفع لمتجرك." },
      inventory: { title: "مخزون متعدد المستودعات", desc: "تتبع المخزون عبر مستودعات متعددة (الرياض، إسطنبول، دبي). إعادة توجيه تلقائية للطلبات لأقرب مستودع. تنبيهات نقص المخزون." },
      whatsapp: { title: "كتالوج واتساب + الدفع", desc: "أرسل كتالوج المنتجات عبر واتساب. العميل يتصفح، يطلب، يدفع — كل ذلك في واتساب. الطلب يُنشأ تلقائياً في Zyrix ومتجرك." },
      abandoned: { title: "استرداد العربات المتروكة", desc: "العميل ترك العربة؟ Zyrix يرسل رسالة واتساب مخصصة بلغته. استرد 30%+ من العربات المتروكة." },
      cod: { title: "تتبع طلبات الدفع عند الاستلام", desc: "تتبع كل طلب COD من التأكيد ← استلام شركة الشحن ← التسليم ← تحصيل النقد. تسوية يومية. لا تفقد دفعة بعد الآن." },
      shipping: { title: "تكاملات شركات الشحن المحلية", desc: "سمسا، أرامكس، ناقل، MNG، يورتيتشي، J&T، و25+ أخرى. إنشاء بطاقات شحن تلقائي. تتبع كل طرد دون مغادرة Zyrix." },
    },
    workflow: {
      eyebrow: "من النقرة إلى النقد",
      title: "كيف يتدفق طلب واتساب عبر Zyrix",
      subtitle: "رحلة عميل حقيقية لمستهلك عربي يشتري منتجات العناية بالبشرة من متجر Shopify سعودي.",
      step1: { title: "العميل يراسل عبر واتساب", desc: "العميل يرى إعلان إنستغرام، يضغط 'راسلنا'. واتساب يفتح. Zyrix يرحب تلقائياً بالعربية ويعرض كتالوج المنتجات." },
      step2: { title: "يتصفح + يضيف للسلة", desc: "العميل يتصفح الكتالوج داخل واتساب. يضيف 3 منتجات. Zyrix يحسب الإجمالي بالريال شامل الشحن وضريبة القيمة المضافة. السلة محفوظة 60 دقيقة." },
      step3: { title: "يكمل الشراء — يختار الدفع عند الاستلام", desc: "العميل يدخل العنوان. يختار الدفع عند الاستلام. الطلب مؤكد. Zyrix ينشئ الطلب في Shopify، يحجز شركة الشحن (سمسا)، يولد بطاقة الشحن." },
      step4: { title: "تأكيد تلقائي + تتبع", desc: "العميل يحصل على تأكيد واتساب برقم الطلب ورابط تتبع سمسا. Zyrix يراقب API سمسا. يحدث العميل عند الاستلام، عند الخروج للتسليم." },
      step5: { title: "التسليم + تسوية النقد", desc: "شركة الشحن تسلم، تحصِّل النقد. سمسا تزامن الحالة مع Zyrix. النقد يُسوى لإيداع التاجر البنكي في اليوم 7. الطلب علامة مكتمل. العميل أُضيف لقطاع الاستهداف." },
    },
    stats: { recovery: "استرداد السلة", aov: "متوسط قيمة الطلب", repeat: "معدل إعادة الشراء", response: "متوسط رد واتساب" },
    cta: { title: "توقف عن محاربة أنظمة CRM الغربية", subtitle: "مصمم للشرق الأوسط + تركيا. واتساب أولاً. الدفع عند الاستلام أصلي. عربي + تركي + إنجليزي.", primary: "ابدأ التجربة المجانية", secondary: "احجز عرضاً توضيحياً" },
  },
  SolutionsRealEstate: {
    eyebrow: "للعقارات",
    hero: { title: "أغلق صفقات عقارية أكثر. اخسر عملاء محتملين أقل.", subtitle: "مصمم لوسطاء العقارات في الرياض، إسطنبول، دبي، والقاهرة. القوائم، الجولات الافتراضية، المعاينات، العقود — كلها في CRM واحد يحترم طريقة عمل السوق الإقليمي الفعلية.", ctaPrimary: "ابدأ تجربة مجانية 14 يوماً", ctaSecondary: "تحدث مع المبيعات" },
    pain: { eyebrow: "لماذا يختار الوسطاء Zyrix", title: "العقارات محلية. نظام CRM الخاص بك يجب أن يكون كذلك.", subtitle: "بيع العقارات في السعودية أو تركيا يختلف عن البيع في كاليفورنيا. ثلاث نقاط ألم:", point1: "المشترون يتواصلون مع 5-10 وسطاء في نفس الوقت عبر واتساب. الوسيط الذي يرد أولاً يفوز. ردّ خلال 15 دقيقة أو اخسر العميل.", point2: "العقود العقارية لها خصوصيات إقليمية — نظام طابو السعودية، شهادات الإسكان التركية، توثيق العقود المصرية. أنظمة CRM العامة تتجاهلها.", point3: "الوسطاء في الميدان يحتاجون كل شيء على الجوال. أنظمة CRM الغربية المصممة للسطح المكتبي عديمة الفائدة عند معاينة عقار مع مشترٍ." },
    features: {
      eyebrow: "كل ما يحتاجه الوسيط",
      title: "من القائمة إلى العقد — مصمم للوسيط الإقليمي",
      listings: { title: "قوائم العقارات", desc: "إدارة القوائم السكنية والتجارية. الصور، المخططات، المواصفات. نشر تلقائي على Sahibinden، Property Finder، Bayut. حدّث مرة، تزامن في كل مكان." },
      location: { title: "ذكاء الموقع", desc: "عرض الخريطة لجميع العقارات. تصفية بالحي، منطقة المدارس، المسافة للمترو. عرض المبيعات المماثلة. توليد تقارير الموقع للمشترين." },
      virtual: { title: "الجولات الافتراضية + الوسائط", desc: "ارفع جولات 360°، فيديوهات. ولّد روابط عقارات جاهزة لواتساب. تتبع أي وسائط شاهدها كل مشترٍ ولكم من الوقت." },
      viewings: { title: "جدولة المعاينات", desc: "المشترون يحجزون المعاينات عبر واتساب أو موقعك. مزامنة التقويم. تأكيدات تلقائية. تذكير قبل ساعة. تتبع الذين لم يحضروا." },
      contracts: { title: "العقود الإقليمية", desc: "طابو (السعودية)، تابو (تركيا)، صك الملكية (الإمارات) — قوالب مدمجة. توقيع إلكتروني. جمع الوثائق من المشتري + البائع. سجل تدقيق للمراجعة القانونية." },
      brokers: { title: "فرق متعددة الوسطاء", desc: "تتبع أي وسيط أحضر أي عميل. تعيين تلقائي بالحي، اللغة، أو نوع العقار. تقاسم العمولات. لوحات أداء الفريق." },
    },
    workflow: {
      eyebrow: "من العميل المحتمل إلى التسليم",
      title: "كيف تتدفق صفقة عقارية عبر Zyrix",
      subtitle: "رحلة حقيقية لعائلة سعودية تشتري فيلا في شمال الرياض.",
      step1: { title: "عميل محتمل من Sahibinden / Property Finder", desc: "المشتري يتواصل عبر قائمة العقار. Zyrix ينشئ العميل المحتمل، يرفق العقار، يلاحظ ميزانيتهم والأحياء المفضلة." },
      step2: { title: "الوسيط يرد خلال 5 دقائق", desc: "الوسيط المُعيَّن يحصل على إشعار. يرد على واتساب بـ 3 عقارات مشابهة + روابط جولات 360°. كل ذلك من داخل Zyrix." },
      step3: { title: "حجز المعاينات وحضورها", desc: "العائلة تحجز 3 معاينات عبر رابط تقويم الوسيط. يتم إرسال التذكيرات. الوسيط يسجل ملاحظات المعاينة بعد كل واحدة — ما أعجبهم، ما لم يعجبهم، لغة الجسد." },
      step4: { title: "العرض + التفاوض", desc: "العائلة ترسل عرضاً. المالك يقدم عرضاً مضاداً. الوسيط يتتبع موضوع التفاوض. الوثائق (إثبات الدخل، نسخ الهوية) تُجمع عبر رفع آمن. كل ذلك داخل الصفقة." },
      step5: { title: "العقد + التسليم", desc: "الشروط النهائية مُتفق عليها. أوراق نقل الطابو تُنشأ من القالب. التوقيع الإلكتروني يُجمع. الوديعة مدفوعة. تسجيل الطابو مُجدول. العائلة تستلم المفاتيح بعد 4 أسابيع. الوسيط يكسب العمولة، علامة في خط الأنابيب." },
    },
    stats: { leadResponse: "وقت رد العميل", conversions: "تحويل المعاينات لعروض", contractRetention: "معدل إغلاق العقود", firstResponse: "متوسط أول رد" },
    cta: { title: "مصمم للوسطاء الإقليميين", subtitle: "طابو، تابو، صك الملكية — كلها أصلية. عربي، تركي، إنجليزي. الجوال أولاً.", primary: "ابدأ التجربة المجانية", secondary: "تحدث مع متخصص عقارات" },
  },
  SolutionsClinics: {
    eyebrow: "للرعاية الصحية",
    hero: { title: "علاقات المرضى، ليس مجرد سجلات.", subtitle: "حجز المواعيد، المتابعات، برامج الولاء، والتواصل مع المرضى المتوافق مع HIPAA. مصمم للعيادات وعيادات الأسنان ومراكز التجميل عبر الشرق الأوسط وتركيا.", ctaPrimary: "ابدأ تجربة مجانية 14 يوماً", ctaSecondary: "تحدث مع المبيعات" },
    pain: { eyebrow: "لماذا تختار العيادات Zyrix", title: "تجربة المريض هي ميزتك التنافسية.", subtitle: "الرعاية الصحية محلية، شخصية، ومتزايدة التنافسية. ثلاثة تحديات تواجه كل عيادة:", point1: "30% من المواعيد عدم حضور في المنطقة. التذكيرات اليدوية غير متسقة. موظفو الاستقبال مرهقون.", point2: "أنظمة CRM العامة لا تفهم تدفقات المرضى — موعد ← استشارة ← خطة علاج ← متابعة ← تقييم. تخزن البيانات، لا العلاقات.", point3: "أنظمة الاتصال بالمرضى تتشدد (المركز الوطني للأمراض المعدية السعودي، KVKK التركي). معظم أنظمة CRM ليست مصممة للامتثال الطبي." },
    features: {
      eyebrow: "من الحجز إلى الولاء",
      title: "كل ما تحتاجه العيادة الحديثة للنمو.",
      appointments: { title: "حجز مواعيد ذكي", desc: "المرضى يحجزون عبر الموقع، واتساب، أو التطبيق. شاهد توفر الطبيب. أكد عبر واتساب. أعد الجدولة بضغطة. لا حجز مزدوج." },
      records: { title: "سجلات المرضى", desc: "تاريخ طبي مركزي، خطط علاج، وصفات، مرفقات. ابحث عبر المرضى في ثوانٍ. رؤى الطبيب والإدارة بصلاحيات قائمة على الدور." },
      followup: { title: "متابعات تلقائية", desc: "رسائل شكر بعد الزيارة. تذكيرات بخطط العلاج. تنبيهات الفحوصات السنوية. تسليم نتائج المختبر. كل ذلك عبر واتساب بلغة المريض." },
      reminders: { title: "تذكيرات المواعيد", desc: "قبل 24 ساعة: تذكير واتساب. قبل ساعة: مطالبة تأكيد. يقلل معدلات عدم الحضور بنسبة 60-80%." },
      loyalty: { title: "ولاء المريض", desc: "تتبع الزيارات، النقاط، الإحالات. تهاني عيد الميلاد. خصومات الذكرى السنوية. تعريف أفراد الأسرة. حوّل المرضى لمرة واحدة إلى مرضى مدى الحياة." },
      privacy: { title: "الامتثال + الخصوصية", desc: "متوافق مع HIPAA. متوافق مع المركز الوطني السعودي و KVKK التركي. تتبع موافقة المريض. إقامة البيانات في منطقتك. سجلات تدقيق." },
    },
    workflow: {
      eyebrow: "رحلة المريض",
      title: "من أول زيارة إلى مريض مدى الحياة",
      subtitle: "كيف يتدفق مريض نموذجي عبر Zyrix في عيادة أسنان في إسطنبول.",
      step1: { title: "الحجز عبر واتساب", desc: "المريض يرى إعلان إنستغرام. يرسل رسالة واتساب. روبوت Zyrix يعرض المواعيد المتاحة. المريض يختار واحداً. يُرسل التأكيد. يُحدَّث التقويم." },
      step2: { title: "تذكير قبل يوم", desc: "تذكير واتساب تلقائي قبل 24 ساعة. المريض يؤكد. إذا لم يرد، تذكير ثانٍ قبل 4 ساعات. موظفو الاستقبال يعرفون من قادم." },
      step3: { title: "الزيارة + خطة العلاج", desc: "الطبيب يرى المريض. يسجل التشخيص، خطة العلاج، صور قبل/بعد. المريض يستلم ملخص واتساب مع تقدير التكلفة، الخطوات التالية، وخطة العلاج القابلة للتحميل." },
      step4: { title: "المتابعة + الدفع", desc: "المريض يحصل على تذكير للزيارة التالية (3 أيام للتنظيف، 14 يوماً للإجراء). يُرسل رابط الدفع. توثيق التأمين مُلف. نقاط الولاء تُضاف." },
      step5: { title: "الرعاية طويلة المدى", desc: "6 أشهر: تذكير الفحص السنوي. سنة: تهاني عيد الميلاد + خصم 10%. سنتان: رسالة 'نفتقدك' إذا لا زيارة. المرضى يصبحون مناصرين ويحيلون الأسرة." },
    },
    stats: { noShow: "تقليل عدم الحضور", retention: "الاحتفاظ بالمرضى", satisfaction: "رضا المرضى", timesSaved: "وقت الاستقبال الموفر" },
    cta: { title: "عامل المرضى كأناس، لا كسجلات", subtitle: "متوافق مع HIPAA. متعدد اللغات. متوافق مع لوائح الصحة الإقليمية.", primary: "ابدأ التجربة المجانية", secondary: "احجز عرضاً توضيحياً للعيادة" },
  },
  SolutionsAgencies: {
    eyebrow: "للوكالات",
    hero: { title: "أدر عملاء أكثر. بأشخاص أقل. بدون فوضى.", subtitle: "إدارة عملاء متعددين، لوحات تحكم بعلامة بيضاء، تقارير آلية، وسير عمل من العرض للدفع. مصمم لوكالات التسويق والرقمية والاستشارية التي تخدم الشرق الأوسط + تركيا.", ctaPrimary: "ابدأ تجربة مجانية 14 يوماً", ctaSecondary: "تحدث مع المبيعات" },
    pain: { eyebrow: "لماذا تختار الوكالات Zyrix", title: "الوكالات تتوسع على أدوات مكسورة.", subtitle: "إذا كنت تدير وكالة في الشرق الأوسط أو تركيا، ثلاثة أشياء تأكل هامش الربح:", point1: "كل عميل جديد = 3 ساعات إعداد في 7 أدوات مختلفة. هوامش الوكالات تنضغط مع كل حساب موسع.", point2: "تقارير العميل تستغرق 20-40% من أسبوع مدير الحساب. سحب الأرقام من Meta، Google، TikTok، ثم رسم Excel للعميل. مكرر أسبوعياً.", point3: "العروض + العقود + الفواتير في 4 اشتراكات SaaS مختلفة. كل واحد يكلف 30-100$/شهر. دورة المبيعات مجزأة." },
    features: {
      eyebrow: "كل ما تحتاجه الوكالات",
      title: "أدر عشرات العملاء دون فقدان عقلك",
      clients: { title: "مساحة عمل متعددة العملاء", desc: "مساحة عمل منفصلة لكل عميل. بيانات مشتركة، صلاحيات معزولة. مدراء الحسابات يرون عملاءهم فقط. قادة الوكالة يرون كل شيء." },
      reports: { title: "تقارير آلية", desc: "اربط Meta Ads، Google Ads، TikTok، Snapchat، GA4. سحب البيانات تلقائياً يومياً. ولّد تقارير العميل في 5 دقائق. جدول رسائل أسبوعية. علامة تجارية مخصصة لكل عميل." },
      team: { title: "تعاون الفريق", desc: "مدراء حسابات، مصممون، كتاب، مشترو وسائط — كلهم في أداة واحدة. مهام. تتبع الوقت. تخطيط السعة. من المتاح الشهر القادم؟" },
      proposals: { title: "العروض + العقود", desc: "قوالب عروض جاهزة. ملء تلقائي من بريف العميل. توقيع إلكتروني. بمجرد التوقيع: العقد يُولد تلقائياً، جدول الفواتير ينطلق، مهام المشروع تُنشأ." },
      workflow: { title: "أتمتة سير العمل", desc: "تأهيل عميل جديد (12 مهمة عبر 4 فرق). فوترة المحتفظ الشهرية. مراجعات الأعمال الفصلية. اضبطها مرة، تعمل كل شهر للأبد." },
      whitelabel: { title: "بوابات عملاء بعلامة بيضاء", desc: "كل عميل يدخل على your-agency.zyrix.co (أو نطاق مخصص). يرى لوحات تحكمه، تقاريره، مشاريعه. يبدو 100% كوكالتك. اشحنهم للوصول." },
    },
    workflow: {
      eyebrow: "دورة حياة العميل",
      title: "من أول مكالمة إلى محتفظ طويل المدى",
      subtitle: "كيف تكسب وكالة رقمية في إسطنبول وتدير عميل تجارة إلكترونية سعودي.",
      step1: { title: "العميل المحتمل ← مكالمة استكشاف", desc: "علامة سعودية تحجز مكالمة عبر موقعك. Zyrix يسجل العميل المحتمل. استبيان استكشاف يُرسل. بريف ما قبل المكالمة يُولد تلقائياً لمدير الحساب." },
      step2: { title: "العرض + الإغلاق", desc: "مدير الحساب يستخدم قالب Zyrix، يملأ النطاق والتسعير. يُرسل للعميل عبر بوابة العلامة البيضاء. العميل يوقع. العقد + الفاتورة الأولى تُولد تلقائياً." },
      step3: { title: "التأهيل (12 مهمة، 4 فرق)", desc: "Zyrix يبدأ سير عمل التأهيل. المصمم يصنع أصول العلامة. مشتري الوسائط يربط الحسابات. الكاتب يصمم تقويم محتوى. مدير المشروع يجدول الانطلاق. كل المهام مُتتبعة." },
      step4: { title: "التنفيذ الشهري + التقارير", desc: "الحملات تعمل. إدارة الإعلانات اليومية. Zyrix يسحب بيانات الأداء يومياً. شهرياً: التقرير يُولد تلقائياً، مدير الحساب يراجع، يرسل للعميل. العميل يرى ROAS، CPL، CAC، التحويلات." },
      step5: { title: "الاحتفاظ + البيع الإضافي", desc: "مراجعات الأعمال الفصلية مُجدولة. الأداء مُتتبع مقابل KPIs. فرص البيع الإضافي مُعلَّمة (قناة جديدة، توسع السوق). العميل يجدد المحتفظ بطبقة أعلى." },
    },
    stats: { scale: "سعة العملاء", margin: "تحسن الهامش", retention: "الاحتفاظ بالعملاء", report: "وقت توليد التقرير" },
    cta: { title: "وسّع وكالتك. احتفظ بعقلك.", subtitle: "مساحات عمل متعددة العملاء. علامة بيضاء. تقارير آلية. مصمم لوكالات الشرق الأوسط + تركيا.", primary: "ابدأ التجربة المجانية", secondary: "تحدث مع متخصص وكالات" },
  },
};

// ============================================================================
// TR content (authored — natural professional Turkish, mirrors EN structure)
// ============================================================================
const TR = {
  SolutionsSales: {
    eyebrow: "SATIŞ EKİPLERİ İÇİN",
    hero: { title: "Daha çok anlaşma kapatın. Excel'i unutun.", subtitle: "Satış ekibinizin gerçekten kullanmak isteyeceği CRM. WhatsApp öncelikli, mobil yerel, Türk ve Arap satış ekiplerinin gerçekte sattığı şekilde tasarlandı.", ctaPrimary: "14 gün ücretsiz dene", ctaSecondary: "Satışla görüş" },
    pain: { eyebrow: "SATIŞ EKİPLERİ NEDEN ZYRIX'İ SEÇİYOR", title: "Çoğu CRM yöneticiler için tasarlandı. Sizinki satış elemanı için çalışmalı.", subtitle: "MENA ve Türkiye'de 200+ satış temsilcisiyle konuştuk. Üç sorun her seferinde tekrarlandı:", point1: "Aktiviteleri kayıt altına almak, aktivitelerin kendisinden uzun sürüyor. Temsilciler kaydetmeyi bırakıyor — yöneticiler veriye güvenmeyi bırakıyor.", point2: "Anlaşmalar gerçekte WhatsApp'ta oluyor, ama her CRM bunu sonradan eklenmiş bir şey gibi görüyor. Temsilciler bütün gün uygulamalar arasında kopyala-yapıştır yapıyor.", point3: "Mobil uygulamalar küçültülmüş oyuncaklar. Sahadaki temsilciler anlaşmayı güncelleyemiyor, notlara erişemiyor, telefondan kapatamıyor." },
    features: {
      eyebrow: "SATTIĞINIZ ŞEKİLDE TASARLANDI",
      title: "Bir kapanışçının ihtiyacı olan her şey. Olmayan hiçbir şey.",
      pipeline: { title: "Görsel anlaşma hunisi", desc: "Sürükle-bırak kanban. Ürün hattına göre özelleştirilmiş aşamalar. Her anlaşmayı, her değeri, her sonraki adımı tek bakışta görün." },
      calls: { title: "Tıkla-ara + otomatik kayıt", desc: "Web veya mobilden herhangi bir kişiye dokunarak arayın. Aramalar süre ile birlikte anlaşmaya otomatik kaydedilir. Uyumluluk için isteğe bağlı kayıt." },
      team: { title: "Ekip işbirliği", desc: "Anlaşmalarda takım arkadaşlarınızı @-bahisle. Her fırsat için iç sohbet konuları. Bağlam kaybı olmadan teslimler." },
      forecast: { title: "Satış tahmini", desc: "Tarihsel kapanış oranlarına dayalı AI destekli tahmin. Aya, çeyreğe, temsilciye ve bölgeye göre öngörülen geliri görün." },
      reports: { title: "Gerçek zamanlı paneller", desc: "Yöneticiler için özel raporlar. Temsilci, bölge, ürün veya aşamaya göre derinlemesine inceleyin. PDF olarak dışa aktarın veya bağlantı ile paylaşın." },
      automation: { title: "Akıllı otomasyon", desc: "Müşteri adaylarını bölgeye göre otomatik atayın. 3 günde yanıt yoksa otomatik takip. 90 gündür hareketsiz anlaşmaları otomatik kapat. Daha az yönetim, daha çok satış." },
    },
    workflow: {
      eyebrow: "ZYRIX İLE BİR GÜN",
      title: "Müşteri adayından kazanılan anlaşmaya 5 adımda",
      subtitle: "Tipik bir anlaşmanın gerçek Arap ve Türk satış bağlamlarında Zyrix üzerinden nasıl aktığı.",
      step1: { title: "Müşteri adayı WhatsApp'tan geliyor", desc: "Müşteri iş numaranıza mesaj gönderiyor. Zyrix otomatik olarak bir kişi ve müşteri adayı oluşturur, kaynak = WhatsApp olarak etiketler." },
      step2: { title: "Doğru temsilciye otomatik atama", desc: "Round-robin ya da bölge/dil/ürüne göre. Temsilci push bildirimi alır. İletişim detayları + konuşma geçmişi zaten anlaşmanın içinde." },
      step3: { title: "Temsilci nitelendirir + teklif gönderir", desc: "Temsilci Zyrix içinden WhatsApp'ta yanıt verir. Ürün kataloğunu gönderir. 30 saniyede PDF teklif oluşturur." },
      step4: { title: "Takipler otomatik yapılır", desc: "2 günde yanıt yok mu? Zyrix kibar bir WhatsApp takibi gönderir. 5 günde hâlâ yanıt yok mu? Yönetici uyarı alır. Anlaşma asla düşmez." },
      step5: { title: "Kapanış + tedarik teslimi", desc: "Müşteri kabul eder. Temsilci 'Kazanıldı'ya tıklar. Anlaşma tedarik hunisine geçer. Müşteri onay mesajı alır. Slack/Teams iç bildirimi tetiklenir. Tamamlandı." },
    },
    stats: { faster: "Daha hızlı anlaşma döngüleri", deals: "Temsilci başına daha çok anlaşma", followup: "Takip tutarlılığı", access: "Mobil + web erişimi" },
    cta: { title: "Gerçekten sattığınız şekilde tasarlandı", subtitle: "Ücretsiz başlayın. Kredi kartı yok. Aşık olmak için 14 gün.", primary: "Ücretsiz denemeye başla", secondary: "Bir insanla konuş" },
  },
  SolutionsEcommerce: {
    eyebrow: "E-TİCARET İÇİN",
    hero: { title: "WhatsApp öncelikli ticaret. MENA ve Türkiye için tasarlandı.", subtitle: "Shopify veya WooCommerce mağazanızı senkronize edin. Terk edilmiş sepetleri WhatsApp'tan kurtarın. Kapıda Ödeme siparişlerini takip edin. Hepsi Arapça ve Türkçe'yi yerel olarak konuşan tek bir CRM'de.", ctaPrimary: "14 gün ücretsiz dene", ctaSecondary: "Satışla görüş" },
    pain: { eyebrow: "E-TİCARET NEDEN ZYRIX'İ SEÇİYOR", title: "Batılı e-ticaret CRM'leri pazarımızı anlamıyor.", subtitle: "Suudi Arabistan, BAE, Irak veya Türkiye'de mi satıyorsunuz? Shopify'ın çözmek için tasarlanmadığı sorunlarla karşılaşıyorsunuz:", point1: "Siparişlerin %70'i Kapıda Ödeme. Çoğu CRM'de KÖ yaşam döngüsü kavramı yok — onaylandı → gönderildi → tahsil edildi → mutabakat sağlandı.", point2: "Arap ve Türk müşteriler WhatsApp yanıtlarını dakikalar içinde bekliyor, destek bileti üzerinden 24 saat sonra değil. Arapça'yı iyi konuşmayan botlar güveni hızla kaybediyor.", point3: "MENA'da kargo, onlarca yerel kargo şirketi (SMSA, Aramex Suudi, Naqel, MNG, Yurtiçi…) demek. Batılı CRM'ler yalnızca UPS ve FedEx'i tanıyor." },
    features: {
      eyebrow: "MAĞAZANIZIN İHTİYACI OLAN HER ŞEY",
      title: "Mağazanı senkronize et. WhatsApp'tan sat. Her siparişi takip et.",
      shopify: { title: "Shopify + WooCommerce senkronu", desc: "Mağazanızı 2 dakikada bağlayın. Ürünler, siparişler, müşteriler — hepsi otomatik senkron. İki yönlü: Zyrix'teki değişiklikler mağazanıza geri gönderilir." },
      inventory: { title: "Çoklu depo envanter", desc: "Birden fazla depo (Riyad, İstanbul, Dubai) arasında stoğu takip edin. Siparişleri otomatik olarak en yakın depoya yönlendirin. Düşük stok uyarıları." },
      whatsapp: { title: "WhatsApp katalog + ödeme", desc: "Ürün kataloğunu WhatsApp'ta gönderin. Müşteri tarar, sipariş verir, öder — hepsi WhatsApp'ta. Sipariş Zyrix ve mağazanızda otomatik oluşur." },
      abandoned: { title: "Terk edilen sepet kurtarma", desc: "Müşteri sepeti terk mi etti? Zyrix kendi dilinde kişiselleştirilmiş bir WhatsApp mesajı gönderir. Terk edilen sepetlerin %30'undan fazlasını kurtarın." },
      cod: { title: "Kapıda Ödeme takibi", desc: "Her KÖ siparişini onaydan → kargo teslim alımına → teslimata → nakit tahsilatına kadar takip edin. Günlük mutabakat. Bir daha asla ödeme kaybetme." },
      shipping: { title: "Yerel kargo entegrasyonları", desc: "SMSA, Aramex, Naqel, MNG Kargo, Yurtiçi, J&T ve 25+ daha. Etiketleri otomatik oluşturun. Zyrix'ten ayrılmadan her paketi takip edin." },
    },
    workflow: {
      eyebrow: "TIKLAMADAN NAKİTE",
      title: "Bir WhatsApp siparişi Zyrix'ten nasıl akar",
      subtitle: "Suudi bir Shopify mağazasından cilt bakım ürünleri alan Arap bir tüketici için gerçek bir müşteri yolculuğu.",
      step1: { title: "Müşteri WhatsApp'tan mesaj atar", desc: "Müşteri Instagram reklamını görür, 'Bize Mesaj Gönder'e dokunur. WhatsApp açılır. Zyrix otomatik olarak Arapça selamlar ve ürün kataloğunu gösterir." },
      step2: { title: "Tarar + sepete ekler", desc: "Müşteri WhatsApp içinde kataloğu tarar. 3 ürün ekler. Zyrix kargo ve KDV dahil toplamı SAR cinsinden hesaplar. Sepet 60 dakika tutulur." },
      step3: { title: "Ödemeye geçer — KÖ seçer", desc: "Müşteri adres girer. Kapıda Ödemeyi seçer. Sipariş onaylanır. Zyrix Shopify'da siparişi oluşturur, kargo şirketini (SMSA) ayırtır, kargo etiketi oluşturur." },
      step4: { title: "Otomatik onay + takip", desc: "Müşteri sipariş numarası ve SMSA takip URL'si ile WhatsApp onayı alır. Zyrix SMSA API'sini izler. Alındığında, dağıtıma çıktığında müşteriyi günceller." },
      step5: { title: "Teslimat + nakit mutabakatı", desc: "Kargo şirketi teslim eder, nakit tahsil eder. SMSA durumu Zyrix'e senkronize eder. Nakit, satıcının banka mevduatına 7. günde mutabakat sağlanır. Sipariş tamamlandı olarak işaretlenir. Müşteri yeniden hedefleme segmentine eklenir." },
    },
    stats: { recovery: "Sepet kurtarma", aov: "Ortalama sipariş değeri", repeat: "Tekrar satın alma oranı", response: "Ortalama WhatsApp yanıtı" },
    cta: { title: "Batılı CRM'lerle savaşmayı bırak", subtitle: "MENA + Türkiye için tasarlandı. WhatsApp öncelikli. Kapıda Ödeme yerel. Arapça + Türkçe + İngilizce.", primary: "Ücretsiz denemeye başla", secondary: "Demo planla" },
  },
  SolutionsRealEstate: {
    eyebrow: "EMLAK İÇİN",
    hero: { title: "Daha çok mülk anlaşması kapat. Daha az müşteri adayı kaybet.", subtitle: "Riyad, İstanbul, Dubai ve Kahire'deki emlak danışmanları için tasarlandı. İlanlar, sanal turlar, gösterimler, sözleşmeler — hepsi bölgesel pazarın gerçekte nasıl çalıştığına saygı duyan tek bir CRM'de.", ctaPrimary: "14 gün ücretsiz dene", ctaSecondary: "Satışla görüş" },
    pain: { eyebrow: "DANIŞMANLAR NEDEN ZYRIX'İ SEÇİYOR", title: "Emlak yereldir. CRM'iniz de öyle olmalı.", subtitle: "Suudi Arabistan veya Türkiye'de mülk satmak Kaliforniya'da satmaktan farklıdır. Üç sıkıntı noktası:", point1: "Alıcılar WhatsApp üzerinden 5-10 danışmana aynı anda ulaşıyor. İlk yanıt veren danışman kazanıyor. 15 dakika içinde yanıtla, ya da müşteriyi kaybet.", point2: "Mülk sözleşmelerinin bölgesel özellikleri var — Suudi Tabu sistemi, Türkiye iskan sertifikaları, Mısır sözleşme tasdikleri. Genel CRM'ler bunları görmezden gelir.", point3: "Sahadaki danışmanlar her şeyi mobilden yapmak zorunda. Bir alıcıyla mülk gezerken Batılı masaüstü öncelikli CRM'ler işe yaramaz." },
    features: {
      eyebrow: "BİR DANIŞMANIN İHTİYACI OLAN HER ŞEY",
      title: "İlandan sözleşmeye — bölgesel danışman için tasarlandı",
      listings: { title: "Mülk ilanları", desc: "Konut ve ticari ilanları yönetin. Fotoğraflar, kat planları, özellikler. Sahibinden, Property Finder, Bayut'a otomatik yayınlayın. Bir kez güncelleyin, her yerde senkronize olsun." },
      location: { title: "Lokasyon zekası", desc: "Tüm mülklerin harita görünümü. Mahalleye, okul bölgesine, metroya uzaklığa göre filtreleyin. Karşılaştırılabilir satışları gösterin. Alıcılar için lokasyon raporları oluşturun." },
      virtual: { title: "Sanal turlar + medya", desc: "360° turlar, video gezintileri yükleyin. WhatsApp'a hazır mülk bağlantıları oluşturun. Her alıcının hangi medyayı ve ne kadar süre izlediğini takip edin." },
      viewings: { title: "Gösterim planlama", desc: "Alıcılar WhatsApp veya web sitenizden gösterimleri rezerve eder. Takvim senkronu. Otomatik onaylar. 1 saat öncesi hatırlatma. Gelmeyenler takip edilir." },
      contracts: { title: "Bölgesel sözleşmeler", desc: "Tabu (Suudi), Tapu (Türkiye), Title Deed (BAE) — yerleşik şablonlar. E-imza. Alıcı + satıcıdan belge toplama. Hukuki inceleme için denetim izi." },
      brokers: { title: "Çoklu danışman ekipleri", desc: "Hangi danışmanın hangi müşteri adayını getirdiğini takip edin. Mahalleye, dile veya mülk türüne göre otomatik atama. Komisyon paylaşımları. Ekibe göre performans panelleri." },
    },
    workflow: {
      eyebrow: "MÜŞTERİ ADAYINDAN TESLİME",
      title: "Bir mülk anlaşmasının Zyrix'ten nasıl aktığı",
      subtitle: "Riyad'ın kuzeyinde villa satın alan Suudi bir aile için gerçek bir yolculuk.",
      step1: { title: "Sahibinden / Property Finder müşteri adayı", desc: "Alıcı mülk ilanından iletişime geçer. Zyrix müşteri adayını oluşturur, mülkü ekler, bütçelerini ve tercih ettikleri mahalleleri not eder." },
      step2: { title: "Danışman 5 dakika içinde yanıt verir", desc: "Otomatik atanan danışman push bildirimi alır. WhatsApp'ta 3 benzer mülk + 360° tur bağlantılarıyla yanıt verir. Hepsi Zyrix içinden." },
      step3: { title: "Gösterimler ayarlanır + katılım", desc: "Aile danışmanın takvim bağlantısı üzerinden 3 gösterim ayarlar. Hatırlatmalar gönderilir. Danışman her birinin ardından gösterim notlarını kaydeder — neyi sevdikleri, sevmedikleri, beden dili." },
      step4: { title: "Teklif + müzakere", desc: "Aile teklif gönderir. Sahip karşı teklif verir. Danışman müzakere konusunu takip eder. Belgeler (gelir kanıtı, kimlik kopyaları) güvenli yükleme ile toplanır. Hepsi anlaşmanın içinde." },
      step5: { title: "Sözleşme + teslim", desc: "Nihai şartlar üzerinde anlaşılır. Tabu transfer evrakları şablondan oluşturulur. E-imza toplanır. Depozito ödenir. Tabu kaydı planlanır. Aile 4 hafta sonra anahtarları teslim alır. Danışman komisyon kazanır, hunide işaretlenir." },
    },
    stats: { leadResponse: "Müşteri yanıt süresi", conversions: "Gösterimden teklife", contractRetention: "Sözleşme kapanış oranı", firstResponse: "Ortalama ilk yanıt" },
    cta: { title: "Bölgesel danışmanlar için tasarlandı", subtitle: "Tabu, Tapu, Title Deed — hepsi yerel. Arapça, Türkçe, İngilizce. Mobil öncelikli.", primary: "Ücretsiz denemeye başla", secondary: "Bir emlak uzmanıyla konuş" },
  },
  SolutionsClinics: {
    eyebrow: "SAĞLIK İÇİN",
    hero: { title: "Hasta ilişkileri, sadece kayıtlar değil.", subtitle: "Randevu rezervasyonu, takipler, sadakat programları ve HIPAA uyumlu hasta iletişimi. MENA ve Türkiye'deki klinikler, diş muayenehaneleri ve estetik merkezler için tasarlandı.", ctaPrimary: "14 gün ücretsiz dene", ctaSecondary: "Satışla görüş" },
    pain: { eyebrow: "KLİNİKLER NEDEN ZYRIX'İ SEÇİYOR", title: "Hasta deneyimi sizin rekabet avantajınızdır.", subtitle: "Sağlık hizmetleri yerel, kişisel ve giderek daha rekabetçi. Her kliniğin karşılaştığı üç zorluk:", point1: "Bölgede randevuların %30'u gelmeyenler. Manuel hatırlatmalar tutarsız. Resepsiyon personeli yorgun.", point2: "Genel CRM'ler hasta akışlarını anlamıyor — randevu → konsültasyon → tedavi planı → takip → değerlendirme. Veri saklıyorlar, ilişkiler değil.", point3: "Hasta iletişim düzenlemeleri sıkılaşıyor (Suudi NCDC, Türk KVKK). Çoğu CRM tıbbi uyumluluk için tasarlanmamış." },
    features: {
      eyebrow: "REZERVASYONDAN SADAKATE",
      title: "Modern bir kliniğin büyümek için ihtiyacı olan her şey.",
      appointments: { title: "Akıllı randevu rezervasyonu", desc: "Hastalar web sitesinden, WhatsApp'tan veya uygulamadan rezerve eder. Doktor müsaitliğini görün. WhatsApp'tan onaylayın. Tek dokunuşla yeniden planlayın. Çift rezervasyon yok." },
      records: { title: "Hasta kayıtları", desc: "Merkezi tıbbi geçmiş, tedavi planları, reçeteler, ekler. Hastalar arasında saniyeler içinde arama. Doktor ve yönetici görünümleri rol bazlı erişimle." },
      followup: { title: "Otomatik takipler", desc: "Ziyaret sonrası teşekkür mesajları. Tedavi planı hatırlatmaları. Yıllık kontrol uyarıları. Lab sonuçlarının teslimi. Hepsi WhatsApp'tan hastanın dilinde." },
      reminders: { title: "Randevu hatırlatmaları", desc: "24 saat önce: WhatsApp hatırlatması. 1 saat önce: onay istemi. Gelmeme oranlarını %60-80 azaltır." },
      loyalty: { title: "Hasta sadakati", desc: "Ziyaretleri, puanları, yönlendirmeleri takip edin. Doğum günü dilekleri. Yıldönümü indirimleri. Aile üyesi tanımlama. Tek seferlik hastaları yaşam boyu hastalara dönüştürün." },
      privacy: { title: "Uyumluluk + gizlilik", desc: "HIPAA uyumlu. Suudi NCDC ve Türk KVKK uyumlu. Hasta onay takibi. Bölgenizde veri ikametgahı. Denetim günlükleri." },
    },
    workflow: {
      eyebrow: "BİR HASTA YOLCULUĞU",
      title: "İlk ziyaretten ömür boyu hastaya",
      subtitle: "İstanbul'da bir diş kliniğinde tipik bir hastanın Zyrix üzerinden nasıl aktığı.",
      step1: { title: "WhatsApp'tan rezervasyon", desc: "Hasta Instagram reklamını görür. WhatsApp mesajı gönderir. Zyrix botu mevcut slotları sunar. Hasta birini seçer. Onay gönderilir. Takvim güncellenir." },
      step2: { title: "Bir gün önce hatırlatma", desc: "24 saat önce otomatik WhatsApp hatırlatması. Hasta onaylar. Yanıt yoksa, 4 saat önce ikinci hatırlatma. Resepsiyon personeli kimin geldiğini bilir." },
      step3: { title: "Ziyaret + tedavi planı", desc: "Doktor hastayı görür. Tanıyı, tedavi planını, öncesi/sonrası fotoğrafları kaydeder. Hasta maliyet tahmini, sonraki adımlar ve indirilebilir tedavi planı içeren WhatsApp özeti alır." },
      step4: { title: "Takip + ödeme", desc: "Hasta sonraki ziyaret için hatırlatma alır (temizlik için 3 gün, prosedür için 14 gün). Ödeme bağlantısı gönderilir. Sigorta belgeleri dosyalanır. Sadakat puanları yatırılır." },
      step5: { title: "Uzun vadeli bakım", desc: "6 ay: yıllık kontrol hatırlatması. 1 yıl: doğum günü dilekleri + %10 indirim. 2 yıl: ziyaret yoksa 'sizi özlüyoruz' mesajı. Hastalar savunucu olur ve aileyi yönlendirir." },
    },
    stats: { noShow: "Gelmeme azaltma", retention: "Hasta tutma", satisfaction: "Hasta memnuniyeti", timesSaved: "Resepsiyon zamanı tasarrufu" },
    cta: { title: "Hastalara kayıtlar gibi değil, insanlar gibi davranın", subtitle: "HIPAA uyumlu. Çoklu dil. Bölgesel sağlık düzenlemeleriyle uyumlu.", primary: "Ücretsiz denemeye başla", secondary: "Klinik demosu planla" },
  },
  SolutionsAgencies: {
    eyebrow: "AJANSLAR İÇİN",
    hero: { title: "Daha çok müşteri yönet. Daha az kişiyle. Kaos olmadan.", subtitle: "Çoklu müşteri yönetimi, beyaz etiket panelleri, otomatik raporlama ve teklif-ödemeye iş akışları. MENA + Türkiye'ye hizmet veren pazarlama, dijital ve danışmanlık ajansları için tasarlandı.", ctaPrimary: "14 gün ücretsiz dene", ctaSecondary: "Satışla görüş" },
    pain: { eyebrow: "AJANSLAR NEDEN ZYRIX'İ SEÇİYOR", title: "Ajanslar bozuk araçlarla ölçekleniyor.", subtitle: "MENA veya Türkiye'de bir ajans yönetiyorsanız, üç şey kar marjınızı yiyor:", point1: "Her yeni müşteri = 7 farklı araçta 3 saat kurulum. Ajans marjları her büyütülmüş hesapla sıkışıyor.", point2: "Müşteri raporlaması, hesap yöneticisinin haftasının %20-40'ını alıyor. Meta, Google, TikTok'tan rakamları çekmek, sonra müşteri için Excel grafikleri çizmek. Her hafta tekrarlanıyor.", point3: "Teklifler + sözleşmeler + faturalar 4 farklı SaaS aboneliğinde yaşıyor. Her biri 30-100$/ay. Satış döngüsü parçalanmış." },
    features: {
      eyebrow: "AJANSLARIN İHTİYACI OLAN HER ŞEY",
      title: "Aklınızı kaybetmeden onlarca müşteri yönetin",
      clients: { title: "Çoklu müşteri çalışma alanı", desc: "Her müşteri için ayrı çalışma alanı. Paylaşılan veri, izole edilmiş izinler. Hesap yöneticileri yalnızca kendi müşterilerini görür. Ajans liderleri her şeyi görür." },
      reports: { title: "Otomatik raporlama", desc: "Meta Ads, Google Ads, TikTok, Snapchat, GA4 bağlayın. Veriyi günlük olarak otomatik çekin. 5 dakikada müşteri raporları oluşturun. Haftalık e-postaları planlayın. Her müşteriye özel marka." },
      team: { title: "Ekip işbirliği", desc: "Hesap yöneticileri, tasarımcılar, metin yazarları, medya alıcıları — hepsi tek bir araçta. Görevler. Zaman takibi. Kapasite planlama. Önümüzdeki ay kim müsait?" },
      proposals: { title: "Teklifler + sözleşmeler", desc: "Önceden oluşturulmuş teklif şablonları. Müşteri brifinginden otomatik doldurma. E-imza. İmzalandığında: sözleşme otomatik oluşur, faturalandırma planı başlar, proje görevleri oluşturulur." },
      workflow: { title: "İş akışı otomasyonu", desc: "Yeni müşteri onboarding (4 ekipte 12 görev). Aylık hizmet bedeli faturalandırması. Çeyreklik iş incelemeleri. Bir kez ayarlayın, her ay sonsuza kadar çalışsın." },
      whitelabel: { title: "Beyaz etiket müşteri portalları", desc: "Her müşteri your-agency.zyrix.co (veya özel alan adı) üzerinden giriş yapar. Panellerini, raporlarını, projelerini görür. %100 sizin ajansınız gibi görünür. Erişim için onlardan ücret alın." },
    },
    workflow: {
      eyebrow: "BİR MÜŞTERİ YAŞAM DÖNGÜSÜ",
      title: "İlk aramadan uzun vadeli müşteriye",
      subtitle: "İstanbul'daki bir dijital ajans, bir Suudi e-ticaret müşterisini nasıl kazanır ve yönetir.",
      step1: { title: "Müşteri adayı → keşif görüşmesi", desc: "Suudi bir marka web sitenizden bir görüşme rezerve eder. Zyrix müşteri adayını kaydeder. Keşif anketi gönderilir. Hesap yöneticisi için görüşme öncesi brif otomatik oluşturulur." },
      step2: { title: "Teklif + kapanış", desc: "Hesap yöneticisi Zyrix şablonunu kullanır, kapsam ve fiyatlandırmayı doldurur. Müşteriye beyaz etiket portalı üzerinden gönderilir. Müşteri imzalar. Sözleşme + ilk fatura otomatik oluşturulur." },
      step3: { title: "Onboarding (4 ekipte 12 görev)", desc: "Zyrix onboarding iş akışını başlatır. Tasarımcı marka varlıklarını oluşturur. Medya alıcısı hesapları bağlar. Metin yazarı içerik takvimini taslak haline getirir. Proje yöneticisi başlangıcı planlar. Tüm görevler takip edilir." },
      step4: { title: "Aylık yürütme + raporlama", desc: "Kampanyalar yürür. Günlük reklam yönetimi. Zyrix performans verisini günlük çeker. Aylık: rapor otomatik oluşturulur, hesap yöneticisi inceler, müşteriye gönderir. Müşteri ROAS, CPL, CAC, dönüşümleri görür." },
      step5: { title: "Tutma + üst satış", desc: "Çeyreklik iş incelemeleri planlanır. Performans KPI'lara karşı takip edilir. Üst satış fırsatları işaretlenir (yeni kanal, pazar genişlemesi). Müşteri daha yüksek katmanda hizmet bedelini yeniler." },
    },
    stats: { scale: "Müşteri kapasitesi", margin: "Marj iyileştirme", retention: "Müşteri tutma", report: "Rapor oluşturma süresi" },
    cta: { title: "Ajansını ölçeklendir. Aklını koru.", subtitle: "Çoklu müşteri çalışma alanları. Beyaz etiket. Otomatik raporlama. MENA + Türkiye ajansları için tasarlandı.", primary: "Ücretsiz denemeye başla", secondary: "Bir ajans uzmanıyla konuş" },
  },
};

// ============================================================================
// Apply
// ============================================================================
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}
function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8");
}
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

const NAMESPACES = ["SolutionsSales", "SolutionsEcommerce", "SolutionsRealEstate", "SolutionsClinics", "SolutionsAgencies"];
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

console.log("=== Sprint 14f — Solutions namespaces merged ===");
console.table(reports);

// Parity check
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

if (!parityOk) {
  console.error("\nParity check failed.");
  process.exit(1);
}

console.log("\n✅ All 5 namespaces merged with full parity across en/ar/tr.");
