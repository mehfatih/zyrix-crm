#!/usr/bin/env node
/* eslint-disable */
/**
 * migrate-docs.js
 *
 * Parses the three Master Guide HTML files (EN/AR/TR) and writes one
 * markdown article per feature into content/docs/<lang>/features/<category>/.
 * Also writes 00-introduction.md, 01-getting-started.md, 02-the-zyrix-difference.md,
 * and faq.md in each language.
 *
 * Usage:
 *   node scripts/migrate-docs.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HTML_DIR = path.resolve(ROOT, "..", "Sprints");
const OUT_DIR = path.resolve(ROOT, "content", "docs");

// ────────────────────────────────────────────────────────────────────────
// 33 features in the exact order they appear in the HTML
// (matches the "feature-number" badges 1..33).
// ────────────────────────────────────────────────────────────────────────
const FEATURE_MAP = [
  // Sales (7)
  { n: 1, category: "sales", slug: "quotes-proposals", readTime: "5 min" },
  { n: 2, category: "sales", slug: "contracts", readTime: "5 min" },
  { n: 3, category: "sales", slug: "commission-engine", readTime: "5 min" },
  { n: 4, category: "sales", slug: "territory", readTime: "4 min" },
  { n: 5, category: "sales", slug: "quota-forecasting", readTime: "5 min" },
  { n: 6, category: "sales", slug: "e-signature", readTime: "4 min" },
  { n: 7, category: "sales", slug: "customer-health-score", readTime: "5 min" },
  // Growth (2)
  { n: 8, category: "growth", slug: "loyalty-program", readTime: "4 min" },
  { n: 9, category: "growth", slug: "marketing-automation", readTime: "5 min" },
  // AI (7)
  { n: 10, category: "ai", slug: "ai-cfo", readTime: "6 min" },
  { n: 11, category: "ai", slug: "ai-workflow", readTime: "6 min" },
  { n: 12, category: "ai", slug: "ai-architect", readTime: "6 min" },
  { n: 13, category: "ai", slug: "lead-scoring", readTime: "5 min" },
  { n: 14, category: "ai", slug: "conversation-intelligence", readTime: "5 min" },
  { n: 15, category: "ai", slug: "duplicate-detection", readTime: "4 min" },
  { n: 16, category: "ai", slug: "meeting-intelligence", readTime: "5 min" },
  // Operations (3)
  { n: 17, category: "operations", slug: "customer-portal", readTime: "5 min" },
  { n: 18, category: "operations", slug: "integrated-payments", readTime: "5 min" },
  { n: 19, category: "operations", slug: "team-collaboration", readTime: "4 min" },
  // Security (6)
  { n: 20, category: "security", slug: "rbac", readTime: "5 min" },
  { n: 21, category: "security", slug: "ip-allowlist", readTime: "4 min" },
  { n: 22, category: "security", slug: "retention", readTime: "4 min" },
  { n: 23, category: "security", slug: "compliance-api", readTime: "5 min" },
  { n: 24, category: "security", slug: "scim", readTime: "4 min" },
  { n: 25, category: "security", slug: "audit-log", readTime: "4 min" },
  // Tax (1)
  { n: 26, category: "tax", slug: "tax-invoices", readTime: "5 min" },
  // Integrations (2)
  { n: 27, category: "integrations", slug: "google-docs", readTime: "3 min" },
  { n: 28, category: "integrations", slug: "slack-teams", readTime: "4 min" },
  // Platform (1)
  { n: 29, category: "platform", slug: "network-controls", readTime: "4 min" },
  // Advanced (2)
  { n: 30, category: "advanced", slug: "multi-brand", readTime: "5 min" },
  { n: 31, category: "advanced", slug: "analytics", readTime: "4 min" },
  // Experience (2)
  { n: 32, category: "experience", slug: "onboarding-wizard", readTime: "3 min" },
  { n: 33, category: "experience", slug: "mobile-web", readTime: "3 min" },
];

const CATEGORY_PLAN_DEFAULTS = {
  sales: ["starter", "business", "enterprise"],
  growth: ["business", "enterprise"],
  ai: ["business", "enterprise"],
  operations: ["starter", "business", "enterprise"],
  security: ["enterprise"],
  tax: ["business", "enterprise"],
  integrations: ["starter", "business", "enterprise"],
  platform: ["enterprise"],
  advanced: ["business", "enterprise"],
  experience: ["free", "starter", "business", "enterprise"],
};

// ────────────────────────────────────────────────────────────────────────
// HTML → Markdown conversion (minimal, purpose-built)
// ────────────────────────────────────────────────────────────────────────
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).trim();
}

function extractTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = html.match(re);
  return m ? m[1] : "";
}

function listItems(html) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(html))) {
    items.push(inlineToMd(m[1]).trim());
  }
  return items;
}

function inlineToMd(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_")
      .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "_$1_")
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
      .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<span[^>]*>/gi, "")
      .replace(/<\/span>/gi, "")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
  ).replace(/\s+/g, " ").trim();
}

function blockToMd(html) {
  // Splits into paragraphs, ordered lists, and unordered lists preserving order.
  const blocks = [];
  const tokens = [];
  const tokenRe = /<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = tokenRe.exec(html))) {
    tokens.push({ type: m[1].toLowerCase(), body: m[2] });
  }
  for (const tok of tokens) {
    if (tok.type === "p") {
      const text = inlineToMd(tok.body);
      if (text) blocks.push(text);
    } else if (tok.type === "ul") {
      const items = listItems(tok.body).map((t) => `- ${t}`);
      if (items.length) blocks.push(items.join("\n"));
    } else if (tok.type === "ol") {
      const items = listItems(tok.body).map((t, i) => `${i + 1}. ${t}`);
      if (items.length) blocks.push(items.join("\n"));
    }
  }
  return blocks.join("\n\n");
}

// ────────────────────────────────────────────────────────────────────────
// Feature card parsing
// ────────────────────────────────────────────────────────────────────────
function normalizeDigits(s) {
  // Arabic-Indic (٠-٩) and Eastern Arabic (۰-۹) → ASCII
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
}

function parseFeatureCards(html) {
  const cards = [];
  const cardRe = /<div class="feature-card">([\s\S]*?)<\/div>\s*(?=<div class="feature-card">|<div class="section-title"|<h2|<\/body>|$)/gi;
  let m;
  while ((m = cardRe.exec(html))) {
    const body = m[1];
    const numMatch = body.match(/<div class="feature-number">([^<]+)<\/div>/);
    if (!numMatch) continue;
    const n = parseInt(normalizeDigits(numMatch[1].trim()), 10);
    if (!Number.isFinite(n)) continue;

    const titleMatch = body.match(/<h3>([\s\S]*?)<\/h3>/);
    const title = titleMatch ? stripTags(titleMatch[1]) : "";

    const planBadges = [];
    const badgeRe = /<span class="badge-([a-z]+)">([\s\S]*?)<\/span>/g;
    let b;
    while ((b = badgeRe.exec(body))) {
      planBadges.push({ type: b[1], label: stripTags(b[2]) });
    }

    const block = (className) => {
      const start = body.indexOf(`<div class="${className}">`);
      if (start < 0) return "";
      const openLen = `<div class="${className}">`.length;
      let i = start + openLen;
      let depth = 1;
      const openRe = /<div\b/gi;
      const closeRe = /<\/div>/gi;
      while (depth > 0 && i < body.length) {
        openRe.lastIndex = i;
        closeRe.lastIndex = i;
        const openM = openRe.exec(body);
        const closeM = closeRe.exec(body);
        if (!closeM) return "";
        if (openM && openM.index < closeM.index) {
          depth++;
          i = openM.index + 4;
        } else {
          depth--;
          i = closeM.index + 6;
          if (depth === 0) {
            return body.slice(start + openLen, closeM.index);
          }
        }
      }
      return "";
    };

    // Plain intro paragraphs before the first block
    const firstBlockIdx = body.search(
      /<div class="(key-benefits|example|how-to|sales-tip)"/i
    );
    const intro = firstBlockIdx > -1 ? body.slice(0, firstBlockIdx) : body;
    const introAfterHeader = intro.replace(
      /<div class="feature-header">[\s\S]*?<\/div>\s*<\/div>/,
      ""
    );
    const introMd = blockToMd(introAfterHeader);

    const benefitsHtml = block("key-benefits");
    const exampleHtml = block("example");
    const howToHtml = block("how-to");
    const tipHtml = block("sales-tip");

    const benefitsMd = blockToMd(
      benefitsHtml.replace(
        /<div class="key-benefits-title">[\s\S]*?<\/div>/,
        ""
      )
    );
    const exampleMd = blockToMd(
      exampleHtml
        .replace(/<div class="example-title">([\s\S]*?)<\/div>/, (_, t) => {
          const clean = stripTags(t);
          return `<p><strong>${clean}</strong></p>`;
        })
    );
    const howToMd = blockToMd(
      howToHtml.replace(/<div class="how-to-title">[\s\S]*?<\/div>/, "")
    );
    const tipMd = blockToMd(
      tipHtml.replace(/<div class="sales-tip-title">[\s\S]*?<\/div>/, "")
    );

    cards.push({ n, title, planBadges, introMd, benefitsMd, exampleMd, howToMd, tipMd });
  }
  return cards;
}

// ────────────────────────────────────────────────────────────────────────
// Translations for markdown section headings
// ────────────────────────────────────────────────────────────────────────
const HEADINGS = {
  en: {
    benefits: "Key Benefits",
    example: "Real-World Example",
    howTo: "How to Use It",
    tip: "Sales Pitch",
  },
  ar: {
    benefits: "الفوائد الرئيسية",
    example: "مثال من الواقع",
    howTo: "كيفية الاستخدام",
    tip: "حوار المبيعات",
  },
  tr: {
    benefits: "Başlıca Faydalar",
    example: "Gerçek Hayattan Örnek",
    howTo: "Nasıl Kullanılır",
    tip: "Satış Argümanı",
  },
};

function toPlansArray(badges) {
  if (!badges.length) return ["free", "starter", "business", "enterprise"];
  const out = new Set();
  for (const b of badges) {
    const l = b.label.toLowerCase();
    if (l.includes("all")) {
      return ["free", "starter", "business", "enterprise"];
    }
    if (l.includes("free") || l.includes("مجاني") || l.includes("ücretsiz")) out.add("free");
    if (l.includes("starter") || l.includes("أساسي") || l.includes("başlangıç")) out.add("starter");
    if (l.includes("business") || l.includes("الأعمال") || l.includes("işletme")) out.add("business");
    if (l.includes("enterprise") || l.includes("مؤسسي") || l.includes("kurumsal")) out.add("enterprise");
  }
  return Array.from(out);
}

function articleMarkdown({ meta, lang, card, planBadges }) {
  const T = HEADINGS[lang];
  const fm = [
    "---",
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    `slug: "${meta.slug}"`,
    `category: "${meta.category}"`,
    `order: ${meta.order}`,
    `plans: [${planBadges.map((p) => `"${p}"`).join(", ")}]`,
    `updatedAt: "2026-04-24"`,
    `readTime: "${meta.readTime}"`,
    `featureNumber: ${card.n}`,
    "---",
    "",
  ].join("\n");

  const parts = [fm, `# ${meta.title}`, ""];
  if (card.introMd) parts.push(card.introMd, "");
  if (card.benefitsMd) parts.push(`## ${T.benefits}`, "", card.benefitsMd, "");
  if (card.exampleMd) parts.push(`## ${T.example}`, "", card.exampleMd, "");
  if (card.howToMd) parts.push(`## ${T.howTo}`, "", card.howToMd, "");
  if (card.tipMd) {
    parts.push(
      `> **${T.tip}**`,
      "",
      card.tipMd
        .split("\n")
        .map((l) => (l ? `> ${l}` : ">"))
        .join("\n"),
      ""
    );
  }
  return parts.join("\n");
}

// ────────────────────────────────────────────────────────────────────────
// Static companion pages — introduction, getting-started, the Zyrix
// difference, faq. Mostly translated manually here so users get the
// same polish even though these sections aren't cards in the HTML.
// ────────────────────────────────────────────────────────────────────────
const COMPANION = {
  en: {
    introduction: {
      title: "Introduction",
      body: `Zyrix CRM is the first customer-relationship platform truly built for MENA, Turkey, and other emerging markets.\n\nWhatsApp-native. Arabic dialect-aware. AI-first. Priced per company, not per seat — so a whole team can finally afford the tools that used to live only inside Fortune 500 companies.\n\nThis documentation covers every one of the 33 features Zyrix ships with, along with guides for admins, sales reps, customers, and developers.`,
    },
    "getting-started": {
      title: "Getting Started",
      body: `Create your account, invite your team, and import your customer list — most teams finish in under 10 minutes.\n\n1. Sign up at [crm.zyrix.co](https://crm.zyrix.co/en/signup).\n2. Invite up to 5 teammates on the Free plan.\n3. Import customers from CSV or Excel.\n4. Connect WhatsApp Business so incoming messages flow straight into your CRM.\n5. Open the onboarding wizard for a 5-step guided setup.\n\nYou're ready to run your first pipeline.`,
    },
    "the-zyrix-difference": {
      title: "The Zyrix Difference",
      body: `Most CRMs were built for English-speaking markets and then translated. Zyrix was built Arabic-first, WhatsApp-first, and AI-first from day one.\n\n- **Arabic dialect AI** — understands Gulf, Levantine, Egyptian, and Maghrebi dialects, not just Modern Standard Arabic.\n- **WhatsApp-native** — every customer conversation already happens there; Zyrix makes it part of the CRM.\n- **Pricing per company, not per seat** — add every teammate, every intern, every founder to one subscription.\n- **Zyrix Pay + FinSuite integration** — charge customers and see the money on the same screen.\n- **Built for MENA & Turkey taxes** — ZATCA, e-Fatura, VAT and KDV out of the box.`,
    },
    faq: {
      title: "FAQ",
      body: `### Can we migrate from our current CRM?\nYes. Export a CSV from Salesforce, HubSpot, Zoho, or any spreadsheet tool, then use the import wizard.\n\n### Is our data secure?\nAll data is encrypted at rest and in transit. Enterprise plan adds IP allowlisting, SCIM, and custom retention.\n\n### What's the uptime SLA?\n99.9% on the Business plan, 99.99% on Enterprise.\n\n### Do you integrate with our existing tools?\nYes — Slack, Microsoft Teams, Google Docs, Zapier, and any tool via the public REST API and webhooks.\n\n### What happens if we want to leave?\nYour data belongs to you. Export every record to CSV or call the Compliance API (GDPR export) at any time.`,
    },
  },
  ar: {
    introduction: {
      title: "مقدمة",
      body: `Zyrix CRM هو أول نظام لإدارة علاقات العملاء مصمّم فعلياً لمنطقة الشرق الأوسط وTürkiye والأسواق الناشئة.\n\nمدمج مع واتساب، يفهم اللهجات العربية، ومبني حول الذكاء الاصطناعي. التسعير لكل شركة، وليس لكل مستخدم — حتى يستطيع الفريق كامله استخدام الأدوات التي كانت حكراً على الشركات الكبرى.\n\nهذه الوثائق تغطي جميع الميزات الـ33 التي يقدّمها Zyrix، بالإضافة إلى أدلة للمدراء والمندوبين والعملاء والمطوّرين.`,
    },
    "getting-started": {
      title: "البدء السريع",
      body: `أنشئ حسابك، ادعُ فريقك، واستورد قائمة عملائك — معظم الفرق تنتهي في أقل من 10 دقائق.\n\n1. سجّل من [crm.zyrix.co](https://crm.zyrix.co/ar/signup).\n2. ادعُ حتى 5 زملاء على الخطة المجانية.\n3. استورد العملاء من CSV أو Excel.\n4. اربط واتساب للأعمال حتى تصل الرسائل مباشرة إلى الـCRM.\n5. افتح معالج التهيئة للاطلاع على الخطوات الخمس.\n\nبهذا تكون جاهزاً لتشغيل أول خط مبيعات.`,
    },
    "the-zyrix-difference": {
      title: "ما الذي يميّز Zyrix",
      body: `معظم أنظمة الـCRM صُمّمت للأسواق الإنجليزية ثم ترجمت. أمّا Zyrix فقد بُني باللغة العربية أولاً، وواتساب أولاً، والذكاء الاصطناعي أولاً منذ اليوم الأول.\n\n- **ذكاء اصطناعي يفهم اللهجات** — الخليجية، والشامية، والمصرية، والمغاربية، وليس الفصحى فقط.\n- **واتساب مدمج** — كل محادثة عميل موجودة هناك أصلاً، وZyrix يجعلها جزءاً من الـCRM.\n- **تسعير لكل شركة، وليس لكل مستخدم** — أضف كل الفريق دون تكلفة إضافية.\n- **تكامل مع Zyrix Pay و FinSuite** — تحصيل الأموال ومراقبتها من نفس الشاشة.\n- **مبني لضرائب المنطقة** — ZATCA و e-Fatura وVAT وKDV دون إضافات.`,
    },
    faq: {
      title: "الأسئلة الشائعة",
      body: `### هل يمكن ترحيل البيانات من نظام CRM الحالي؟\nنعم. صدّر ملف CSV من Salesforce أو HubSpot أو Zoho أو أي جدول، ثم استخدم معالج الاستيراد.\n\n### هل بياناتنا آمنة؟\nجميع البيانات مشفّرة أثناء التخزين والنقل. الخطة المؤسسية تضيف IP Allowlist وSCIM وسياسات الاحتفاظ المخصّصة.\n\n### ما هو SLA الجاهزية؟\n99.9٪ على خطة الأعمال، و99.99٪ على الخطة المؤسسية.\n\n### هل تتكاملون مع أدواتنا الحالية؟\nنعم — Slack وMicrosoft Teams وGoogle Docs وZapier، وأي أداة عبر واجهة REST العامة وwebhooks.\n\n### ماذا لو أردنا المغادرة؟\nالبيانات ملكك. صدّرها كـCSV أو استخدم Compliance API للحصول على نسخة كاملة وفق GDPR.`,
    },
  },
  tr: {
    introduction: {
      title: "Giriş",
      body: `Zyrix CRM, MENA ve Türkiye ile gelişen pazarlar için gerçekten sıfırdan tasarlanmış ilk CRM'dir.\n\nWhatsApp entegre, Arapça lehçe destekli ve yapay zeka öncelikli. Kullanıcı başına değil, şirket başına ücretlendirme — böylece tüm ekibiniz Fortune 500 düzeyindeki araçlara erişebilir.\n\nBu dokümantasyon, Zyrix'in sunduğu 33 özelliğin tamamını kapsar; yönetici, satış, müşteri ve geliştiriciler için rehberler içerir.`,
    },
    "getting-started": {
      title: "Hızlı Başlangıç",
      body: `Hesabınızı oluşturun, ekibinizi davet edin ve müşteri listenizi içe aktarın — çoğu ekip 10 dakikadan kısa sürede tamamlar.\n\n1. [crm.zyrix.co](https://crm.zyrix.co/tr/signup) üzerinden kayıt olun.\n2. Ücretsiz planda 5 ekip arkadaşına kadar davet edin.\n3. Müşterileri CSV veya Excel'den içe aktarın.\n4. WhatsApp Business hesabını bağlayın; gelen mesajlar doğrudan CRM'inize düşsün.\n5. Kurulum sihirbazıyla 5 adımlık rehberi takip edin.\n\nİlk satış huninizi yönetmeye hazırsınız.`,
    },
    "the-zyrix-difference": {
      title: "Zyrix Farkı",
      body: `Çoğu CRM önce İngilizce pazar için yapıldı, sonra çevrildi. Zyrix ise ilk günden itibaren Arapça-öncelikli, WhatsApp-öncelikli ve AI-öncelikli inşa edildi.\n\n- **Arapça lehçe AI** — Körfez, Levanten, Mısır ve Mağrib lehçelerini anlar; yalnız standart Arapça değil.\n- **WhatsApp entegre** — müşteri sohbetleri zaten orada; Zyrix bunu CRM'in parçası yapar.\n- **Şirket başına ücret** — her ekip arkadaşı tek aboneliğe dahil.\n- **Zyrix Pay + FinSuite** — tahsilat ve parayı aynı ekranda görün.\n- **MENA & Türkiye vergileri için tasarlandı** — ZATCA, e-Fatura, KDV ve VAT kutudan çıkar çıkmaz.`,
    },
    faq: {
      title: "SSS",
      body: `### Mevcut CRM'imizden geçiş yapabilir miyiz?\nEvet. Salesforce, HubSpot, Zoho veya herhangi bir elektronik tablodan CSV dışa aktarın ve içe aktarma sihirbazını kullanın.\n\n### Verilerimiz güvende mi?\nTüm veriler saklanırken ve iletilirken şifrelenir. Kurumsal plan IP allowlist, SCIM ve özel saklama politikaları ekler.\n\n### Çalışma süresi SLA'sı nedir?\nBusiness planında %99.9, Kurumsal planda %99.99.\n\n### Mevcut araçlarımızla entegre olur musunuz?\nEvet — Slack, Microsoft Teams, Google Docs, Zapier ve herhangi bir aracı genel REST API ve webhook'larla kullanabilirsiniz.\n\n### Ayrılmak istersek ne olur?\nVeriler size aittir. İstediğiniz zaman CSV olarak dışa aktarın veya Compliance API (GDPR dışa aktarımı) aracılığıyla alın.`,
    },
  },
};

function companionMarkdown({ slug, order, lang, title, body, readTime }) {
  const fm = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `category: "overview"`,
    `order: ${order}`,
    `plans: ["free", "starter", "business", "enterprise"]`,
    `updatedAt: "2026-04-24"`,
    `readTime: "${readTime}"`,
    "---",
    "",
  ].join("\n");
  return `${fm}# ${title}\n\n${body}\n`;
}

function writeFile(p, contents) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, contents, "utf8");
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────
function run() {
  const langs = [
    { code: "en", file: "Zyrix_CRM_Master_Guide_EN.html" },
    { code: "ar", file: "Zyrix_CRM_Master_Guide_AR.html" },
    { code: "tr", file: "Zyrix_CRM_Master_Guide_TR.html" },
  ];

  const summary = { total: 0, perLang: {} };

  for (const lang of langs) {
    const htmlPath = path.join(HTML_DIR, lang.file);
    if (!fs.existsSync(htmlPath)) {
      console.error(`[SKIP] ${lang.code}: ${htmlPath} not found`);
      continue;
    }
    const html = fs.readFileSync(htmlPath, "utf8");
    const cards = parseFeatureCards(html);
    if (cards.length !== 33) {
      console.warn(
        `[WARN] ${lang.code}: parsed ${cards.length} feature cards (expected 33)`
      );
    }

    let written = 0;
    const missing = [];

    for (const meta of FEATURE_MAP) {
      const card = cards.find((c) => c.n === meta.n);
      if (!card) {
        missing.push(meta.n);
        continue;
      }
      const plans = toPlansArray(card.planBadges);
      const finalPlans = plans.length
        ? plans
        : CATEGORY_PLAN_DEFAULTS[meta.category] || ["business", "enterprise"];

      const title = card.title || meta.slug;
      const order = meta.n;
      const out = articleMarkdown({
        meta: { ...meta, title, order },
        lang: lang.code,
        card,
        planBadges: finalPlans,
      });
      const outPath = path.join(
        OUT_DIR,
        lang.code,
        "features",
        meta.category,
        `${meta.slug}.md`
      );
      writeFile(outPath, out);
      written++;
    }

    // Companion pages
    const companions = COMPANION[lang.code];
    writeFile(
      path.join(OUT_DIR, lang.code, "00-introduction.md"),
      companionMarkdown({
        slug: "introduction",
        order: 0,
        lang: lang.code,
        title: companions.introduction.title,
        body: companions.introduction.body,
        readTime: "3 min",
      })
    );
    writeFile(
      path.join(OUT_DIR, lang.code, "01-getting-started.md"),
      companionMarkdown({
        slug: "getting-started",
        order: 1,
        lang: lang.code,
        title: companions["getting-started"].title,
        body: companions["getting-started"].body,
        readTime: "4 min",
      })
    );
    writeFile(
      path.join(OUT_DIR, lang.code, "02-the-zyrix-difference.md"),
      companionMarkdown({
        slug: "the-zyrix-difference",
        order: 2,
        lang: lang.code,
        title: companions["the-zyrix-difference"].title,
        body: companions["the-zyrix-difference"].body,
        readTime: "4 min",
      })
    );
    writeFile(
      path.join(OUT_DIR, lang.code, "faq.md"),
      companionMarkdown({
        slug: "faq",
        order: 100,
        lang: lang.code,
        title: companions.faq.title,
        body: companions.faq.body,
        readTime: "5 min",
      })
    );

    summary.total += written;
    summary.perLang[lang.code] = { written, missing };
    console.log(
      `[${lang.code}] wrote ${written}/33 features${
        missing.length ? `, missing: ${missing.join(",")}` : ""
      }`
    );
  }

  console.log("");
  console.log(`Total articles: ${summary.total} (expected ${langs.length * 33})`);
}

run();
