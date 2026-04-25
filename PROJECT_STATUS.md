# Zyrix CRM — Project Status & Continuation Guide

> **آخر تحديث:** أبريل 2026  
> **الحالة:** في مرحلة التخطيط التنفيذي  
> **Repo:** https://github.com/mehfatih/zyrix-crm  
> **Backend Repo:** https://github.com/mehfatih/zyrix-crm-backend (سيُنشأ)

---

## 📖 كيف تقرأ هذا الملف؟

هذا الملف مُعدّ ليكون **أول ملف يقرأه أي شات جديد** يستكمل العمل على Zyrix CRM. يحتوي على كل ما يحتاجه لفهم:
- ما هو المشروع
- أين نحن الآن
- ما القواعد الثابتة
- ماذا نفعل تالياً

---

## 🎯 المشروع في جملة واحدة

**Zyrix CRM** — أول نظام CRM مبني حقاً لسوق MENA وتركيا. WhatsApp في قلبه، الذكاء الاصطناعي يفهم اللهجات، والتكامل المالي مع Zyrix Pay و FinSuite مدمج أصلياً.

---

## 🏗️ الـ Stack التقني

### Frontend (هذا الـ Repo)
```
Next.js 16.2.4
React 19
TypeScript 5
next-intl 3.26 (i18n: en/ar/tr)
Tailwind CSS 3.4
```

### Backend (Repo منفصل — zyrix-crm-backend)
```
Node.js 20 LTS
Express.js
TypeScript
Prisma 5.x (ORM)
PostgreSQL 16 (Railway)
Redis 7 (cache + queues)
BullMQ (background jobs)
```

### AI
```
Gemini 2.0 Flash (primary) — استخدمناه من قبل وأثبت كفاءة
OpenAI Whisper API (STT للعربية واللهجات)
LangGraph (multi-agent orchestration)
Google text-embedding-004 (embeddings)
```

### Infrastructure
```
Railway: Backend + PostgreSQL + Redis
Netlify: Frontend deployment
Cloudflare: DNS + CDN
GitHub: Version control
```

---

## 🎨 القواعد الثابتة (غير قابلة للتفاوض)

### 1. الألوان — سماوي فقط، لا قاتم أبداً

**المعتمد:**
```js
const COLOR = {
  // === NEW STANDARD (Apr 2026) - Unified Mobile + Web ===
  primary:      "#0EA5E9", // Sky Blue 500 (master)
  primaryDark:  "#0284C7", // Sky 600 (headings, active states)
  primaryLight: "#7DD3FC", // Sky 300 (hover, soft accents)
  accent:       "#22D3EE", // Cyan 400 (secondary)
  azure:        "#38BDF8", // Sky 400
  sky:          "#BAE6FD", // Sky 200 (very soft surfaces)

  // Backgrounds
  bg:           "#F0F9FF", // Sky 50 (page background)
  bgCard:       "#FFFFFF", // Pure white for cards
  bgCardAlt:    "#F8FAFC", // Slate 50 (alt surface)
  aiSurface:    "#F0F9FF", // AI chip backgrounds
  aiBorder:     "#BAE6FD", // AI element borders

  // Text
  text:         "#0C4A6E", // Sky 950 (headings - never pure black)
  textMid:      "#0369A1", // Sky 700
  textBody:     "#1E293B", // Slate 800 (body)
  textLight:    "#64748B", // Slate 500 (muted)

  // Lines
  border:       "#E2E8F0", // Slate 200
  borderSky:    "#BAE6FD", // Sky 200

  // Semantic
  success:      "#22C55E", // Green 500
  warning:      "#F59E0B", // Amber 500
  danger:       "#EF4444", // Red 500
  info:         "#0EA5E9", // Same as primary
};
```

**الممنوع تماماً:**
- البنفسجي الداكن: `#2D0B6B`, `#4A1A9E`, `#6D28D9`, `#130340` (الموجودة الآن خطأ)
- الأسود: `#000000`
- أي لون بقيمة Lightness أقل من 40%

### 2. Backend منفصل تماماً
- Repo مستقل: `zyrix-crm-backend`
- قاعدة بيانات PostgreSQL منفصلة
- JWT secrets مختلفة
- نطاق فرعي: `api.crm.zyrix.co`
- **لا ربط مع باك اندات Zyrix Pay/FinSuite** — التكامل عبر APIs فقط

### 3. قواعد الكود (موروثة من مشاريع Zyrix السابقة)
```typescript
// Import paths:
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

// Wrapper pattern لكل authenticated route:
router.get('/customers',
  authenticateToken,
  (req: Request, res: Response) =>
    getCustomers(req as AuthenticatedRequest, res)
);

// Raw SQL يستخدم:
prisma.$queryRawUnsafe(...)
prisma.$executeRawUnsafe(...)

// Prisma enum values على أسطر منفصلة
```

### 4. قواعد التسليم
- كل ملف يجب أن يكون **كاملاً جاهزاً للنسخ**
- لا partial snippets، لا "replace line X"
- قبل بناء أي screen، اسأل: "هل الملف موجود بالفعل؟"
- Delivery order: Backend → Website → App

### 5. الثلاث لغات دائماً
- العربية (RTL، Cairo font)
- الإنجليزية (LTR)
- التركية (LTR)
- **كل نص في الواجهة يجب أن يكون بالثلاث لغات**

---

## 📊 الحالة الراهنة (ما تم وما لم يتم)

### ✅ ما تم
- بنية Next.js 16 + React 19 + TypeScript
- i18n مع 3 لغات (en/ar/tr)
- Middleware للغات
- Metadata/SEO structure
- 4 صفحات ديمو:
  - `/[locale]/customers` (269 سطر)
  - `/[locale]/whatsapp` (274 سطر)
  - `/[locale]/loyalty` (243 سطر)
  - `/[locale]/campaigns` (210 أسطر)

### 🔴 مشاكل حرجة (يجب إصلاحها في الأسبوع 0)

| # | المشكلة | الحل |
|---|---------|------|
| 1 | `package.json` اسمه `"zyrix-pay"` | تغيير إلى `"zyrix-crm"` |
| 2 | Metadata في `layout.tsx` تقول FinSuite/Pay | استبدال بنصوص CRM بالثلاث لغات |
| 3 | `app/[locale]/page.tsx` بألوان بنفسجية داكنة | استبدال بالسماوي حسب القواعد |
| 4 | مجلدات `pipeline/` و `quotes/` خارج `app/` | نقلهم إلى `app/[locale]/` |
| 5 | `NEXT_PUBLIC_API_URL` يشير إلى `zyrix-backend-production.up.railway.app` (Pay) | تغيير إلى الـ Backend الجديد |
| 6 | `theme-color` meta = `#6D28D9` | تغيير إلى `#0891B2` |

### ❌ ما لم يتم بعد
- Backend بالكامل (Repo لم يُنشأ)
- قاعدة البيانات (Prisma schema)
- نظام Auth
- 60+ صفحة ناقصة (pricing, features/*, app/*, legal)
- كل الـ 40 فكرة الإبداعية

---

## 🗺️ خارطة الطريق (12 شهراً)

### Phase 1 — Foundation (Weeks 0-8)
- Week 0: **Cleanup** — إصلاح المشاكل الحرجة
- Weeks 1-2: Backend setup (Express + Prisma + Auth)
- Weeks 3-4: Frontend redesign (سماوي + shared components)
- Weeks 5-6: Public pages (Pricing, Features, Legal)
- Weeks 7-8: Core App Dashboard + Customers + Pipeline

### Phase 2 — Deepening (Weeks 9-20)
- Weeks 9-10: WhatsApp Integration + **Idea #2** (Zero-Input)
- Weeks 11-12: Quotes + Invoices + Zyrix Pay integration
- Weeks 13-14: Loyalty + Campaigns
- Weeks 15-16: Commission + **Idea #11** (AI CFO Cash Prediction)
- Weeks 17-18: **Ideas #12 + #16** (Emotional Memory + Trust Graph v1)
- Weeks 19-20: **Ideas #20 + #21** (Graduated Trust + Audit Log)

### Phase 3 — Unique Excellence (Weeks 21-36)
- Weeks 21-24: **Idea #34** (Voice-First Arabic with dialects)
- Weeks 25-28: **Ideas #1 + #3** (Self-Building + Self-Healing)
- Weeks 29-32: **Ideas #8 + #9 + #10** (Intent + Buying Window + Early Warning)
- Weeks 33-36: **Ideas #5 + #18** (MENA Agents Marketplace)

### Phase 4 — Expansion (Weeks 37-52)
- Weeks 37-40: **Idea #4** (Offline-First) + Mobile App
- Weeks 41-44: **Ideas #13 + #15** (Live Whisperer + Memory Graph)
- Weeks 45-48: **Ideas #29 + #35** (Market Sensing + Ambient)
- Weeks 49-52: **Ideas #23 + #38** + Launch

---

## 💎 الأفكار السبع الاستراتيجية (Priority Top 7)

من مجموع الـ 40 فكرة الإبداعية، هذه السبعة تصنع الفجوة الحقيقية:

| الرقم | الفكرة | لماذا قاتلة | الأسبوع |
|-------|--------|-------------|---------|
| **#11** ⭐ | Predictive Cash Crisis | Moat استراتيجي — Zyrix الوحيد (CRM+Pay+FinSuite) | 15-16 |
| **#2** | Zero-Input via WhatsApp | نقطة الدخول الحقيقية لـ MENA | 9-10 |
| **#34** ⭐ | Voice Arabic Dialects | لا أحد يفعلها — كل AI الحالي فصحى | 21-24 |
| **#16** ⭐ | Arab Trust Graph | Moat ثقافي — لا يمكن لـ Salesforce نسخه | 17-18 |
| **#38** ⭐ | Federated Intelligence | Moat بيانات — ينمو مع الوقت | 49-52 |
| **#20** | Graduated Trust | يميزك عن Agentforce | 19-20 |
| **#12** | Emotional Memory | تكلفة منخفضة، أثر ضخم | 17-18 |

---

## 📚 الوثائق المرجعية

1. **`docs/Zyrix_CRM_Master_Plan.docx`** — الخطة الشاملة الكاملة (39 صفحة)
2. **`docs/Zyrix_CRM_40_Ideas_Roadmap.docx`** — الـ40 فكرة الإبداعية التفصيلية
3. **`docs/Platforms_Filtered.md`** — تحليل المنافسين (Salesforce, HubSpot, Zoho, Bitrix24)
4. **`docs/API_Spec.md`** — مواصفات الـ API (سيُنشأ أثناء Phase 1)
5. **`docs/PROGRESS.md`** — ملف متابعة أسبوعي (سيُنشأ)

---

## 🔧 كيف تكمل العمل (للشات الجديد)

### الخطوة 1: اقرأ هذه الوثائق بالترتيب
1. هذا الملف (PROJECT_STATUS.md)
2. `docs/Zyrix_CRM_Master_Plan.docx` (الأقسام 0-5 على الأقل)
3. `docs/Platforms_Filtered.md`

### الخطوة 2: اسأل الأسئلة التالية
- ما الأسبوع الحالي؟ (`PROGRESS.md` يجيب)
- هل تم إصلاح الأسبوع 0؟
- هل Backend Repo موجود؟
- ما الميزة قيد البناء الآن؟
- هل هناك blockers؟

### الخطوة 3: التزم بالقواعد
- الألوان سماوية فقط
- Backend منفصل
- كل ملف كامل جاهز
- الثلاث لغات دائماً

### الخطوة 4: حدّث PROGRESS.md
في نهاية كل session:
```markdown
## Week [N] - [Phase]
### Completed:
- ...
### In Progress:
- ...
### Next Session:
- ...
```

---

## 💰 نموذج التسعير المعتمد

| الخطة | السعر | الاستراتيجية |
|-------|-------|--------------|
| Free | $0 | 3 مستخدمين + 100 عميل — adoption |
| Starter | **$19/شركة/شهر** | 10 مستخدمين — SMBs |
| Business | **$49/شركة/شهر** | 50 مستخدم — الأكثر مبيعاً |
| Enterprise | Custom | غير محدود — شركات كبيرة |

**الفكرة:** per-company pricing (مثل Bitrix24) وليس per-seat (مثل HubSpot) — توفير 50-80% للعميل.

---

## 🌍 أسواق الاستهداف

### Wave 1 (0-6 شهور)
- 🇸🇦 السعودية — SMEs تجزئة وخدمات
- 🇦🇪 الإمارات — وكالات، استشاريون
- 🇹🇷 تركيا — تجارة ترانزيت للعرب

### Wave 2 (6-12 شهور)
- 🇪🇬 مصر — حساس للسعر → Free-heavy
- 🇮🇶 العراق — Offline mode يميزنا
- 🇰🇼🇧🇭🇶🇦🇴🇲 بقية الخليج

### Wave 3 (12+ شهور)
- 🇲🇦🇹🇳🇩🇿 شمال أفريقيا
- 🇯🇴🇱🇧 الشام
- 🇵🇰🇧🇩🇲🇾 الجالية المسلمة (بسبب Shariah Layer)

---

## 🚨 ما لا يجب فعله أبداً

1. ❌ استخدام ألوان داكنة أو بنفسجية
2. ❌ ربط backend هذا المشروع بباك اند Zyrix Pay أو FinSuite
3. ❌ تسليم ملف ناقص أو partial snippet
4. ❌ تجاهل لغة من الثلاث
5. ❌ بناء feature بدون التحقق إن كانت موجودة
6. ❌ تقليد UI من Salesforce أو HubSpot — ابنِ هويتنا الخاصة
7. ❌ استخدام Anthropic SDK في الـ backend (سبب build failures سابقاً — استخدم Gemini)

---

## 📞 للتواصل

- **Owner:** Mehmet (mehfatih على GitHub)
- **المقر:** Istanbul, Turkey
- **اللغات المفضلة:** العربية، الإنجليزية، التركية

---

## 📅 سجل التحديثات

- **2026-04:** إنشاء الملف + تحديد الخطة الكاملة على 12 شهر
- **2026-04-25:** اعتماد Sky Blue #0EA5E9 كقاعدة موحدة للموبايل والويب
  (يحل محل Cyan #0891B2 السابق). تطابق كامل مع تطبيق الموبايل
  وWeb AI Spec v1.
- **[تحديثات لاحقة تُضاف هنا]**

---

*هذا الملف هو العقد بين الرؤية والتنفيذ. حدّثه دائماً ليعكس الحقيقة.*
