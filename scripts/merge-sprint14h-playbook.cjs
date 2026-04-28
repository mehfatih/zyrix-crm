// scripts/merge-sprint14h-playbook.cjs
// One-time: add Playbook namespace to en/ar/tr.json
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MSG_DIR = path.join(ROOT, "messages");

// ============================================================================
// EN (verbatim from prompt)
// ============================================================================
const EN = {
  Playbook: {
    eyebrow: "PLAYBOOK",
    title: "The WhatsApp Sales Playbook for MENA + Türkiye",
    subtitle: "Six chapters of hard-won lessons from 500+ businesses selling on WhatsApp across Saudi Arabia, the Gulf, Türkiye, and Egypt. Free. Tactical. Battle-tested.",
    toc: { eyebrow: "WHAT YOU'LL LEARN", title: "Table of contents", chapter: "CHAPTER" },
    ch1: {
      title: "The first reply wins (or loses) the deal",
      intro: "On WhatsApp, the customer messages 5-10 businesses at once. Whoever replies first earns the right to negotiate. The math is brutal: reply within 5 minutes and you have a 70% chance of winning the conversation; reply after 30 minutes and you're at 8%.",
      rule1: { title: "Rule 1: Sub-5-minute first reply", body: "Build your team's first-reply SLA at under 5 minutes during business hours. This is non-negotiable. Hire enough agents, automate the initial qualifier, or both — but never let the customer wait." },
      example1: { title: "Example: Saudi e-commerce store, skincare", body: "Customer messages 'Hi, I'm interested in your serum.' Bad reply (after 47 minutes): 'Hi! Yes, here is the product link.' Good reply (after 90 seconds): 'Hi Mariam, welcome to Levana. The vitamin C serum is our best-seller — would you like to see results from someone with similar skin? Also, are you in Riyadh? We deliver same-day there.'" },
      rule2: { title: "Rule 2: Personalize the first message", body: "Use their name (WhatsApp shows it). Reference what they asked about. Mention their region if known. Generic 'Welcome to our store' replies feel like spam — and customers can tell." },
      warning1: { title: "Don't use auto-responders that pretend to be human", body: "Customers know when they're talking to a bot. If you're using automation for the first reply, be honest: 'A team member will reply in under 5 minutes — meanwhile, here's our catalog.' Honesty builds trust. Pretending erodes it." },
    },
    ch2: {
      title: "Match the response cadence to the channel",
      intro: "WhatsApp isn't email. The expected response time is 5-15 minutes during business hours, not 24-48 hours. Customers will leave you for a competitor who replies faster.",
      rule1: { title: "Set explicit business hours — and respect them", body: "If you're closed at 11pm, say so in your WhatsApp Business profile and your auto-reply. Customers respect honest boundaries. They lose patience with silent ghosting." },
      example1: { title: "Example: Setting expectations", body: "Off-hours auto-reply: 'Thanks for reaching out! Our team is offline (10pm-9am UAE time). We'll reply first thing tomorrow morning. For urgent orders, browse our catalog: [link]. Or we'll get back to you at 9am sharp.'" },
      rule2: { title: "Never let a conversation go cold mid-thread", body: "If you're researching something for the customer (checking stock, getting approval), say so explicitly: 'Let me check this with our warehouse, I'll have an answer in 10 minutes.' Then deliver. Silent gaps kill deals." },
    },
    ch3: {
      title: "Templates are leverage, not laziness",
      intro: "Hand-typing every reply doesn't scale. Templates do — but only if they're written well. Bad templates feel robotic. Good templates feel like a smart human who anticipated the conversation.",
      rule1: { title: "Build templates for the top 20 questions", body: "Audit your team's last 500 customer messages. Identify the 20 most common questions ('Do you ship to Kuwait?', 'How do I pay?', 'When does it arrive?'). Write a great template for each. Train your team to start from the template and personalize." },
      example1: { title: "Template: Shipping question", body: "'Great question! We ship to all GCC countries. Delivery times: KSA 1-2 days, UAE 2-3 days, Kuwait/Qatar 3-4 days, Bahrain/Oman 4-5 days. All shipping is free for orders over 200 SAR. Want me to share tracking once your order ships?'" },
      example2: { title: "Template: Payment options", body: "'We accept: 💳 Mada/Visa/Mastercard online, 💵 Cash on Delivery (KSA only), 🏦 Bank transfer (immediate). For your first order, COD is most popular — only pay when you receive the package and inspect it. Want to try that?'" },
      warning1: { title: "Personalize before sending", body: "Replace [Name] with the actual name. Adjust tone to match the conversation. Add a relevant question at the end. Templates are starting points, not final messages. Customers can smell a copy-paste." },
    },
    ch4: {
      title: "Build a team workflow that scales",
      intro: "One person can handle 50 conversations a day. Past that, you need structure: who replies first, when do specialists step in, what gets escalated to a manager, and how is the workload distributed.",
      rule1: { title: "Triage with the 3-tier model", body: "Tier 1: Generalist agent handles all first replies and basic questions. Tier 2: Product specialist handles technical questions, custom requests. Tier 3: Manager handles complaints, refunds, enterprise deals. Clear handoffs with notes — no customer should re-explain themselves." },
      rule2: { title: "Round-robin or geographic routing", body: "Round-robin works for small teams. For larger teams, route by language (Arabic-speaker to Arab agent), region (Saudi customer to KSA agent who knows local context), or product line. Customers get faster, more relevant replies." },
      example1: { title: "Example: Handoff with context", body: "Bad handoff: 'Hi, I'm taking over from Ahmed.' (Customer thinks: who is Ahmed? what did we discuss?) Good handoff: 'Hi Layla, this is Sarah. I see Ahmed was helping you choose between the 30ml and 50ml serum. The 30ml is our most popular for first-time customers — want to start with that and upgrade if you love it?'" },
    },
    ch5: {
      title: "Automate the boring. Keep the human.",
      intro: "Automation is your friend for the predictable parts of the conversation: order confirmations, shipping updates, follow-ups. It's your enemy for the moments that matter: complaints, custom requests, complex questions.",
      rule1: { title: "Automate post-purchase, not pre-purchase", body: "After a customer buys: order confirmation, shipping notifications, delivery reminders, post-delivery follow-up — all great for automation. Before they buy: keep humans in the loop. The pre-purchase conversation is where deals are won." },
      example1: { title: "Example: 4-step post-purchase flow", body: "1. Order confirmation (immediate): 'Thanks for your order! Your tracking number is [X]. Estimated delivery: Wednesday.' 2. Shipping update (when shipped): 'Your order is on the way! Track here: [link].' 3. Delivery confirmation (when delivered): 'Your order arrived. Hope you love it! Need anything?' 4. Follow-up (3 days later): 'How's the product working out? We'd love your feedback.'" },
      warning1: { title: "Don't automate apologies", body: "Bot-generated 'We're sorry to hear that' for a complaint is worse than no reply at all. Customers feel disrespected. For complaints, refunds, and complex issues — always have a real human respond. Zyrix's auto-routing flags complaints for immediate human attention." },
    },
    ch6: {
      title: "Advanced tactics for high-volume operators",
      intro: "If you're past 1,000 conversations a month, you need techniques that smaller operators don't. Catalogs in WhatsApp, broadcast lists, integrations with your CRM — these are force multipliers when used right.",
      rule1: { title: "Use the catalog as your storefront", body: "WhatsApp Catalog (in WhatsApp Business) lets you display products inline. Customers browse without leaving the chat. For e-commerce: this dramatically reduces friction vs. sending external links. Set up your catalog properly and watch conversion rates climb." },
      rule2: { title: "Broadcast lists, not group chats", body: "Broadcast lists send to 256+ contacts at once but each recipient sees a private message. Group chats are for community. Don't confuse them. For sales updates, abandoned cart reminders, restock alerts — broadcast lists. For VIP communities and events — groups." },
      example1: { title: "Example: Broadcast list use cases", body: "Restock alert: 'Hi! The Hyaluronic Serum is back in stock. We sold out 3 days early last time. Tap to order before it's gone again.' Abandoned cart: 'Hi Sarah, you left these in your cart yesterday: [products]. Order in the next 4 hours and shipping is on us.' Customer appreciation: 'Hi Mohammed, you've been with us 6 months. Here's 20% off your next order: [code]. Thank you for being a Levana customer.'" },
    },
    cta: {
      title: "Put this playbook into practice",
      subtitle: "Zyrix is built for everything in this playbook — fast first replies, smart templates, team routing, automation, broadcast lists, catalogs. Try it free.",
      primary: "Start free 14-day trial",
      secondary: "Talk to a specialist",
    },
  },
};

// ============================================================================
// AR (formal MSA, professional brand tone)
// ============================================================================
const AR = {
  Playbook: {
    eyebrow: "الدليل العملي",
    title: "دليل المبيعات على واتساب للشرق الأوسط وشمال إفريقيا + تركيا",
    subtitle: "ستة فصول من الدروس المكتسبة بصعوبة من أكثر من 500 عمل يبيع على واتساب في المملكة العربية السعودية والخليج وتركيا ومصر. مجاني. تكتيكي. مُختبر في الميدان.",
    toc: { eyebrow: "ما الذي ستتعلمه", title: "جدول المحتويات", chapter: "الفصل" },
    ch1: {
      title: "أول رد يكسب (أو يخسر) الصفقة",
      intro: "على واتساب، العميل يراسل 5-10 أعمال في وقت واحد. من يرد أولاً يكسب حق التفاوض. الحساب قاسٍ: ردّ خلال 5 دقائق ولديك 70% فرصة لكسب المحادثة؛ ردّ بعد 30 دقيقة وأنت عند 8%.",
      rule1: { title: "القاعدة 1: أول رد خلال أقل من 5 دقائق", body: "ابنِ اتفاقية مستوى خدمة لفريقك للرد الأول خلال أقل من 5 دقائق في ساعات العمل. هذا غير قابل للتفاوض. وظف ما يكفي من المسؤولين، أتمت المؤهل الأولي، أو كلاهما — لكن لا تدع العميل ينتظر أبداً." },
      example1: { title: "مثال: متجر تجارة إلكترونية سعودي، عناية بالبشرة", body: "العميل يراسل 'مرحباً، أنا مهتم بسيرومكم.' رد سيء (بعد 47 دقيقة): 'مرحباً! نعم، هذا رابط المنتج.' رد جيد (بعد 90 ثانية): 'مرحباً مريم، أهلاً بكِ في ليفانا. سيروم فيتامين C هو الأكثر مبيعاً لدينا — هل تودين رؤية النتائج من شخص ببشرة مشابهة؟ كذلك، هل أنتِ في الرياض؟ نوصل في نفس اليوم هناك.'" },
      rule2: { title: "القاعدة 2: شخصن الرسالة الأولى", body: "استخدم اسمهم (واتساب يعرضه). أشر إلى ما سألوا عنه. اذكر منطقتهم إذا كانت معروفة. ردود 'أهلاً بكم في متجرنا' العامة تبدو كرسائل عشوائية — والعملاء يلاحظون." },
      warning1: { title: "لا تستخدم ردوداً تلقائية تتظاهر بأنها بشرية", body: "العملاء يعرفون متى يتحدثون مع روبوت. إذا كنت تستخدم الأتمتة للرد الأول، كن صادقاً: 'سيرد عضو الفريق خلال أقل من 5 دقائق — في هذه الأثناء، إليك كتالوجنا.' الصدق يبني الثقة. التظاهر يفسدها." },
    },
    ch2: {
      title: "اضبط وتيرة الرد لتناسب القناة",
      intro: "واتساب ليس بريداً إلكترونياً. وقت الرد المتوقع 5-15 دقيقة في ساعات العمل، وليس 24-48 ساعة. العملاء سيتركونك لمنافس يرد أسرع.",
      rule1: { title: "حدد ساعات عمل واضحة — واحترمها", body: "إذا كنت مغلقاً في الساعة 11 مساءً، قل ذلك في ملف واتساب الأعمال وفي ردك التلقائي. العملاء يحترمون الحدود الصادقة. يفقدون الصبر مع الصمت غير المبرر." },
      example1: { title: "مثال: تحديد التوقعات", body: "رد تلقائي خارج ساعات العمل: 'شكراً للتواصل! فريقنا غير متاح (10 مساءً - 9 صباحاً بتوقيت الإمارات). سنرد أول شيء صباح الغد. للطلبات العاجلة، تصفح كتالوجنا: [رابط]. أو سنعود إليكم في تمام التاسعة صباحاً.'" },
      rule2: { title: "لا تترك محادثة تبرد في منتصف الموضوع", body: "إذا كنت تبحث عن شيء للعميل (التحقق من المخزون، الحصول على موافقة)، قل ذلك صراحة: 'دعني أتحقق من هذا مع المستودع، سأكون لدي إجابة خلال 10 دقائق.' ثم نفّذ. الفجوات الصامتة تقتل الصفقات." },
    },
    ch3: {
      title: "القوالب رافعة، وليست كسلاً",
      intro: "كتابة كل رد يدوياً لا تتوسع. القوالب تتوسع — لكن فقط إذا كُتبت بشكل جيد. القوالب السيئة تشعر بأنها آلية. القوالب الجيدة تشعر بأنها إنسان ذكي توقع المحادثة.",
      rule1: { title: "ابنِ قوالب لأكثر 20 سؤالاً شيوعاً", body: "راجع آخر 500 رسالة عميل لفريقك. حدد الأسئلة الـ 20 الأكثر شيوعاً ('هل تشحنون للكويت؟'، 'كيف أدفع؟'، 'متى يصل؟'). اكتب قالباً ممتازاً لكل واحد. درّب فريقك على البدء من القالب وتشخيصه." },
      example1: { title: "قالب: سؤال الشحن", body: "'سؤال رائع! نشحن لجميع دول مجلس التعاون الخليجي. أوقات التسليم: السعودية 1-2 يوم، الإمارات 2-3 أيام، الكويت/قطر 3-4 أيام، البحرين/عمان 4-5 أيام. الشحن مجاني للطلبات أكثر من 200 ريال. هل تريد مني مشاركة التتبع بمجرد شحن طلبك؟'" },
      example2: { title: "قالب: خيارات الدفع", body: "'نقبل: 💳 مدى/فيزا/ماستركارد عبر الإنترنت، 💵 الدفع عند الاستلام (السعودية فقط)، 🏦 التحويل البنكي (فوري). لطلبك الأول، الدفع عند الاستلام هو الأكثر شيوعاً — تدفع فقط عند استلام الطرد وفحصه. هل تريد تجربة ذلك؟'" },
      warning1: { title: "شخصن قبل الإرسال", body: "استبدل [الاسم] بالاسم الفعلي. اضبط النبرة لتطابق المحادثة. أضف سؤالاً ذا صلة في النهاية. القوالب نقاط بداية، لا رسائل نهائية. العملاء يشعرون بالنسخ واللصق." },
    },
    ch4: {
      title: "ابنِ سير عمل فريق يتوسع",
      intro: "شخص واحد يستطيع التعامل مع 50 محادثة في اليوم. بعد ذلك، تحتاج هيكلية: من يرد أولاً، متى يدخل المتخصصون، ما الذي يُصعَّد للمدير، وكيف يُوزع عبء العمل.",
      rule1: { title: "صنّف بنموذج المستويات الثلاثة", body: "المستوى 1: الموظف العام يتعامل مع جميع الردود الأولى والأسئلة الأساسية. المستوى 2: متخصص المنتج يتعامل مع الأسئلة التقنية والطلبات المخصصة. المستوى 3: المدير يتعامل مع الشكاوى والاستردادات وصفقات المؤسسات. تسليمات واضحة بملاحظات — لا يجب أن يعيد أي عميل شرح نفسه." },
      rule2: { title: "التدوير أو التوجيه الجغرافي", body: "التدوير يعمل للفرق الصغيرة. للفرق الأكبر، وجّه باللغة (الناطق بالعربية لموظف عربي)، المنطقة (العميل السعودي لموظف من السعودية يعرف السياق المحلي)، أو خط المنتج. العملاء يحصلون على ردود أسرع وأكثر ملاءمة." },
      example1: { title: "مثال: تسليم بسياق", body: "تسليم سيء: 'مرحباً، أنا أتسلم من أحمد.' (العميل يفكر: من أحمد؟ ماذا ناقشنا؟) تسليم جيد: 'مرحباً ليلى، أنا سارة. أرى أن أحمد كان يساعدكِ في الاختيار بين سيروم 30 مل و50 مل. الـ 30 مل هو الأكثر شيوعاً للعميلات الجديدات — هل تريدين البدء به والترقية إذا أعجبك؟'" },
    },
    ch5: {
      title: "أتمت الممل. احتفظ بالإنسان.",
      intro: "الأتمتة صديقتك للأجزاء المتوقعة من المحادثة: تأكيدات الطلبات، تحديثات الشحن، المتابعات. هي عدوتك للحظات المهمة: الشكاوى، الطلبات المخصصة، الأسئلة المعقدة.",
      rule1: { title: "أتمت ما بعد الشراء، لا ما قبل الشراء", body: "بعد شراء العميل: تأكيد الطلب، إشعارات الشحن، تذكيرات التسليم، متابعة ما بعد التسليم — كلها رائعة للأتمتة. قبل أن يشتروا: احتفظ بالبشر في الحلقة. المحادثة قبل الشراء هي حيث تُربح الصفقات." },
      example1: { title: "مثال: تدفق ما بعد الشراء بـ 4 خطوات", body: "1. تأكيد الطلب (فوري): 'شكراً لطلبك! رقم التتبع الخاص بك [X]. التسليم المتوقع: الأربعاء.' 2. تحديث الشحن (عند الشحن): 'طلبك في الطريق! تتبع هنا: [رابط].' 3. تأكيد التسليم (عند التسليم): 'وصل طلبك. نتمنى أن يعجبك! تحتاج أي شيء؟' 4. المتابعة (بعد 3 أيام): 'كيف يعمل المنتج؟ نحب ملاحظاتك.'" },
      warning1: { title: "لا تؤتمت الاعتذارات", body: "رد روبوت 'نأسف لسماع ذلك' لشكوى أسوأ من لا رد. العملاء يشعرون بعدم الاحترام. للشكاوى والاستردادات والمشاكل المعقدة — دائماً اجعل إنساناً حقيقياً يرد. توجيه Zyrix التلقائي يعلّم الشكاوى للاهتمام البشري الفوري." },
    },
    ch6: {
      title: "تكتيكات متقدمة للمشغلين عالي الحجم",
      intro: "إذا تجاوزت 1,000 محادثة في الشهر، تحتاج تقنيات لا يحتاجها المشغلون الأصغر. الكتالوجات في واتساب، قوائم البث، التكاملات مع CRM — هذه مضاعفات للقوة عند استخدامها بشكل صحيح.",
      rule1: { title: "استخدم الكتالوج كواجهة متجرك", body: "كتالوج واتساب (في واتساب الأعمال) يدعك تعرض المنتجات داخل المحادثة. العملاء يتصفحون دون مغادرة الدردشة. للتجارة الإلكترونية: هذا يقلل الاحتكاك بشكل كبير مقابل إرسال روابط خارجية. اضبط كتالوجك بشكل صحيح وشاهد معدلات التحويل ترتفع." },
      rule2: { title: "قوائم البث، وليس مجموعات الدردشة", body: "قوائم البث ترسل لأكثر من 256 جهة اتصال في وقت واحد لكن كل مستلم يرى رسالة خاصة. مجموعات الدردشة للمجتمع. لا تخلط بينهما. لتحديثات المبيعات، تذكيرات السلال المتروكة، تنبيهات إعادة التخزين — قوائم البث. لمجتمعات VIP والفعاليات — المجموعات." },
      example1: { title: "مثال: حالات استخدام قائمة البث", body: "تنبيه إعادة تخزين: 'مرحباً! سيروم حمض الهيالورونيك عاد للمخزون. نفد منا قبل 3 أيام في المرة الماضية. اضغط للطلب قبل أن يختفي مرة أخرى.' سلة متروكة: 'مرحباً سارة، تركتِ هذه في سلتك أمس: [منتجات]. اطلبي خلال الساعات الأربع القادمة والشحن علينا.' تقدير العميل: 'مرحباً محمد، أنت معنا منذ 6 أشهر. هذا خصم 20% على طلبك التالي: [كود]. شكراً لكونك عميل ليفانا.'" },
    },
    cta: {
      title: "ضع هذا الدليل موضع التنفيذ",
      subtitle: "Zyrix مصمم لكل ما في هذا الدليل — ردود أولى سريعة، قوالب ذكية، توجيه الفريق، الأتمتة، قوائم البث، الكتالوجات. جربه مجاناً.",
      primary: "ابدأ تجربة مجانية 14 يوماً",
      secondary: "تحدث مع متخصص",
    },
  },
};

// ============================================================================
// TR (professional business Turkish, technical terms preserved)
// ============================================================================
const TR = {
  Playbook: {
    eyebrow: "REHBER",
    title: "MENA + Türkiye için WhatsApp Satış Rehberi",
    subtitle: "Suudi Arabistan, Körfez, Türkiye ve Mısır'da WhatsApp'ta satış yapan 500'den fazla işletmeden öğrenilen altı bölüm. Ücretsiz. Taktik. Sahada test edilmiş.",
    toc: { eyebrow: "NE ÖĞRENECEKSİNİZ", title: "İçindekiler", chapter: "BÖLÜM" },
    ch1: {
      title: "İlk yanıt anlaşmayı kazanır (veya kaybeder)",
      intro: "WhatsApp'ta müşteri aynı anda 5-10 işletmeye mesaj gönderir. İlk yanıt veren müzakere etme hakkını kazanır. Matematik acımasız: 5 dakika içinde yanıtlayın ve konuşmayı kazanma şansınız %70; 30 dakika sonra yanıtlayın ve %8'e düşersiniz.",
      rule1: { title: "Kural 1: 5 dakikadan az ilk yanıt", body: "Ekibinizin ilk yanıt SLA'sını çalışma saatlerinde 5 dakikadan kısa sürede yapın. Bu pazarlık konusu değil. Yeterli temsilci işe alın, ilk niteleyiciyi otomatikleştirin veya her ikisini — ama müşteriyi asla bekletmeyin." },
      example1: { title: "Örnek: Suudi e-ticaret mağazası, cilt bakımı", body: "Müşteri 'Merhaba, serumunuzla ilgileniyorum.' diye mesaj atar. Kötü yanıt (47 dakika sonra): 'Merhaba! Evet, ürün bağlantısı burada.' İyi yanıt (90 saniye sonra): 'Merhaba Mariam, Levana'ya hoş geldin. C vitamini serumumuz en çok satanımız — benzer cilt tipindeki birinin sonuçlarını görmek ister misin? Ayrıca, Riyad'da mısın? Orada aynı gün teslimat yapıyoruz.'" },
      rule2: { title: "Kural 2: İlk mesajı kişiselleştirin", body: "İsimlerini kullanın (WhatsApp gösterir). Ne sorduklarına atıfta bulunun. Biliniyorsa bölgelerinden bahsedin. Genel 'Mağazamıza hoş geldiniz' yanıtları spam gibi hissettirir — ve müşteriler bunu fark eder." },
      warning1: { title: "İnsan gibi davranan otomatik yanıtlayıcılar kullanmayın", body: "Müşteriler bir botla konuştuklarını anlar. İlk yanıt için otomasyon kullanıyorsanız, dürüst olun: 'Bir ekip üyesi 5 dakikadan kısa sürede yanıt verecek — bu arada, kataloğumuz burada.' Dürüstlük güven oluşturur. Numara yapmak güveni aşındırır." },
    },
    ch2: {
      title: "Yanıt temposunu kanala uygun ayarlayın",
      intro: "WhatsApp e-posta değildir. Beklenen yanıt süresi çalışma saatlerinde 5-15 dakikadır, 24-48 saat değil. Müşteriler daha hızlı yanıt veren bir rakibe sizi terk eder.",
      rule1: { title: "Açık çalışma saatleri belirleyin — ve onlara saygı gösterin", body: "Eğer 23:00'te kapalıysanız, bunu WhatsApp Business profilinizde ve otomatik yanıtınızda söyleyin. Müşteriler dürüst sınırlara saygı duyar. Sessiz hayalete sabırlarını kaybederler." },
      example1: { title: "Örnek: Beklentileri ayarlama", body: "Mesai dışı otomatik yanıt: 'Ulaştığınız için teşekkürler! Ekibimiz çevrimdışı (BAE saatiyle 22:00-09:00). Yarın sabah ilk iş yanıtlayacağız. Acil siparişler için kataloğumuza göz atın: [bağlantı]. Veya tam saat 09:00'da size geri döneriz.'" },
      rule2: { title: "Bir konuşmayı asla orta yerinde soğumaya bırakmayın", body: "Müşteri için bir şey araştırıyorsanız (stok kontrolü, onay alma), bunu açıkça söyleyin: 'Bunu deponuzla kontrol edeyim, 10 dakika içinde cevap alacağım.' Sonra teslim edin. Sessiz boşluklar anlaşmaları öldürür." },
    },
    ch3: {
      title: "Şablonlar tembellik değil, kaldıraçtır",
      intro: "Her yanıtı elle yazmak ölçeklenmez. Şablonlar ölçeklenir — ama yalnızca iyi yazılmışlarsa. Kötü şablonlar robotik hissettirir. İyi şablonlar konuşmayı önceden tahmin eden akıllı bir insan gibi hissettirir.",
      rule1: { title: "En çok sorulan 20 soru için şablonlar oluşturun", body: "Ekibinizin son 500 müşteri mesajını denetleyin. En yaygın 20 soruyu belirleyin ('Kuveyt'e gönderiyor musunuz?', 'Nasıl ödüyorum?', 'Ne zaman gelir?'). Her biri için harika bir şablon yazın. Ekibinizi şablondan başlayıp kişiselleştirmeleri konusunda eğitin." },
      example1: { title: "Şablon: Kargo sorusu", body: "'Harika soru! Tüm GCC ülkelerine kargo gönderiyoruz. Teslimat süreleri: Suudi Arabistan 1-2 gün, BAE 2-3 gün, Kuveyt/Katar 3-4 gün, Bahreyn/Umman 4-5 gün. 200 SAR üzeri siparişlerde kargo ücretsizdir. Siparişiniz gönderildiğinde takip bilgisini paylaşmamı ister misiniz?'" },
      example2: { title: "Şablon: Ödeme seçenekleri", body: "'Kabul ediyoruz: 💳 Mada/Visa/Mastercard çevrimiçi, 💵 Kapıda Ödeme (yalnızca Suudi Arabistan), 🏦 Banka transferi (anında). İlk siparişiniz için Kapıda Ödeme en popüler — yalnızca paketi alıp incelediğinizde ödeyin. Bunu denemek ister misiniz?'" },
      warning1: { title: "Göndermeden önce kişiselleştirin", body: "[Ad]'ı gerçek adla değiştirin. Tonu konuşmaya uydurun. Sonuna ilgili bir soru ekleyin. Şablonlar başlangıç noktalarıdır, son mesajlar değil. Müşteriler kopyala-yapıştırı koklayabilir." },
    },
    ch4: {
      title: "Ölçeklenen bir ekip iş akışı oluşturun",
      intro: "Bir kişi günde 50 konuşmayı yönetebilir. Bunun ötesinde yapıya ihtiyacınız var: kim önce yanıtlar, uzmanlar ne zaman devreye girer, neyin yöneticiye yükseltileceği ve iş yükünün nasıl dağıtılacağı.",
      rule1: { title: "3 katmanlı modelle önceliklendirin", body: "Katman 1: Genel temsilci tüm ilk yanıtları ve temel soruları yönetir. Katman 2: Ürün uzmanı teknik soruları, özel istekleri yönetir. Katman 3: Yönetici şikayetleri, iadeleri, kurumsal anlaşmaları yönetir. Notlarla net teslimler — hiçbir müşteri kendini yeniden açıklamamalı." },
      rule2: { title: "Round-robin veya coğrafi yönlendirme", body: "Round-robin küçük ekipler için işe yarar. Daha büyük ekipler için, dile göre yönlendirin (Arapça konuşan müşteriyi Arap temsilciye), bölgeye göre (Suudi müşteriyi yerel bağlamı bilen Suudi temsilciye), veya ürün hattına. Müşteriler daha hızlı, daha alakalı yanıtlar alır." },
      example1: { title: "Örnek: Bağlamla teslim", body: "Kötü teslim: 'Merhaba, Ahmed'den devralıyorum.' (Müşteri düşünür: Ahmed kim? ne tartıştık?) İyi teslim: 'Merhaba Layla, ben Sarah. Ahmed'in 30ml ve 50ml serum arasında seçim yapmana yardım ettiğini görüyorum. 30ml ilk kez alan müşteriler için en popüler olanımız — ondan başlayıp beğenirsen yükseltmek ister misin?'" },
    },
    ch5: {
      title: "Sıkıcıyı otomatikleştirin. İnsanı tutun.",
      intro: "Otomasyon, konuşmanın öngörülebilir kısımları için arkadaşınızdır: sipariş onayları, kargo güncellemeleri, takipler. Önemli anlar için düşmanınızdır: şikayetler, özel istekler, karmaşık sorular.",
      rule1: { title: "Satın alma sonrasını otomatikleştirin, öncesini değil", body: "Bir müşteri satın aldıktan sonra: sipariş onayı, kargo bildirimleri, teslimat hatırlatmaları, teslimat sonrası takip — hepsi otomasyon için harika. Satın almadan önce: insanları döngüde tutun. Satın alma öncesi konuşma anlaşmaların kazanıldığı yerdir." },
      example1: { title: "Örnek: 4 adımlı satın alma sonrası akış", body: "1. Sipariş onayı (anında): 'Siparişiniz için teşekkürler! Takip numaranız [X]. Tahmini teslimat: Çarşamba.' 2. Kargo güncellemesi (gönderildiğinde): 'Siparişiniz yolda! Buradan takip edin: [bağlantı].' 3. Teslimat onayı (teslim edildiğinde): 'Siparişiniz geldi. Beğenmenizi umuyoruz! Bir şeye ihtiyacınız var mı?' 4. Takip (3 gün sonra): 'Ürün nasıl çalışıyor? Geri bildiriminizi çok isteriz.'" },
      warning1: { title: "Özürleri otomatikleştirmeyin", body: "Bir şikayete bot tarafından oluşturulmuş 'Bunu duyduğumuza üzüldük' yanıtı, hiç yanıt vermemekten daha kötüdür. Müşteriler saygısızlığa uğradığını hisseder. Şikayetler, iadeler ve karmaşık sorunlar için — her zaman gerçek bir insanın yanıt vermesini sağlayın. Zyrix'in otomatik yönlendirmesi şikayetleri anında insan dikkatine için işaretler." },
    },
    ch6: {
      title: "Yüksek hacimli operatörler için ileri taktikler",
      intro: "Ayda 1.000 konuşmayı geçtiyseniz, daha küçük operatörlerin ihtiyaç duymadığı tekniklere ihtiyacınız var. WhatsApp'taki kataloglar, yayın listeleri, CRM'inizle entegrasyonlar — doğru kullanıldığında bunlar güç çarpanlarıdır.",
      rule1: { title: "Kataloğu vitrin olarak kullanın", body: "WhatsApp Kataloğu (WhatsApp Business'ta) ürünleri satır içinde göstermenize olanak tanır. Müşteriler sohbetten ayrılmadan göz atar. E-ticaret için: bu, harici bağlantılar göndermeye kıyasla sürtünmeyi büyük ölçüde azaltır. Kataloğunuzu doğru ayarlayın ve dönüşüm oranlarının yükselişini izleyin." },
      rule2: { title: "Yayın listeleri, grup sohbetleri değil", body: "Yayın listeleri 256+ kişiye aynı anda gönderir, ancak her alıcı özel bir mesaj görür. Grup sohbetleri topluluk içindir. Bunları karıştırmayın. Satış güncellemeleri, terk edilen sepet hatırlatmaları, yeniden stok uyarıları için — yayın listeleri. VIP toplulukları ve etkinlikler için — gruplar." },
      example1: { title: "Örnek: Yayın listesi kullanım durumları", body: "Yeniden stok uyarısı: 'Merhaba! Hyaluronik Serum tekrar stokta. Geçen sefer 3 gün erken tükendik. Tekrar gitmeden önce sipariş vermek için dokun.' Terk edilen sepet: 'Merhaba Sarah, bunları dün sepetinde bıraktın: [ürünler]. Önümüzdeki 4 saat içinde sipariş ver, kargo bizden.' Müşteri takdiri: 'Merhaba Mohammed, 6 aydır bizimlesin. İşte bir sonraki siparişin için %20 indirim: [kod]. Levana müşterisi olduğun için teşekkürler.'" },
    },
    cta: {
      title: "Bu rehberi uygulamaya koyun",
      subtitle: "Zyrix bu rehberdeki her şey için tasarlandı — hızlı ilk yanıtlar, akıllı şablonlar, ekip yönlendirmesi, otomasyon, yayın listeleri, kataloglar. Ücretsiz deneyin.",
      primary: "14 gün ücretsiz deneme başlat",
      secondary: "Bir uzmanla konuş",
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

const NAMESPACES = ["Playbook"];
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

console.log("=== Sprint 14h — Playbook namespace merged ===");
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
console.log("\n✅ Playbook namespace merged with full parity across en/ar/tr.");
