# Sprint C-2.A — Discovery Report

> **Status:** Discovery only — read-only audit. No code changes, no commits.
> **Goal of Sprint C-2:** Replace ALL demo / mock / placeholder data fallbacks in the
> frontend with real Prisma-backed API calls. Kill "demo mode" everywhere it lives.
> **This file:** the inventory + triage + recommended sub-sprint structure.
> **Date:** 2026-04-26

---

## 1. Environment + proxy summary

### Environment variables driving API behavior
- `NEXT_PUBLIC_API_URL` — backend base URL.
  - `.env.local.example` defaults: `https://api.crm.zyrix.co` (prod) / `http://localhost:4000` (dev).
  - Read in code via `process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"` (or equivalent fallback).
  - Used by: `lib/api/client.ts`, `lib/api/admin.ts`, `lib/api/portal.ts`, `lib/api/payments.ts`,
    all 10 `lib/ai/*.ts` modules, both `lib/integrations/*.ts` modules,
    `components/public/ContactView.tsx`, `components/merchant/sidebar/GlobalSearch.tsx`,
    and the two `app/api/docs/*/route.ts` server-side proxies.
- `NEXT_PUBLIC_APP_*` — branding/version metadata (no API impact).
- `NEXT_PUBLIC_ENABLE_*` — feature flags (read in components but no demo-data toggles seen).

### Auth surfaces (4 separate client realms)
1. **Main user auth** — `lib/api/client.ts::apiClient`
   - `axios.create({ baseURL: API_URL, timeout: 15000 })`
   - Request interceptor injects `Bearer` from `getAccessToken()`.
   - Response interceptor handles `401` (refresh + retry, with queue), `403 FEATURE_DISABLED`
     (redirects to `/feature-disabled?feature=…`), and admin-route detection
     (does NOT bounce to `/signin` if user is on `/admin/*`).
   - Refresh path uses raw `axios.post` to `/api/auth/refresh`; on failure clears auth +
     redirects to `/signin` and fires a `keepalive` `session_expired` telemetry POST.
2. **Admin auth** — `lib/api/admin.ts`
   - Separate token storage keys (`zyrix_admin_*`) so admin and tenant tokens don't collide.
   - Uses raw `axios` (legitimate — own auth header chain).
3. **Customer portal** — `lib/api/portal.ts::portalClient`
   - `axios.create()` with `zyrix_portal_session` localStorage token.
4. **Public payments** — `lib/api/payments.ts`
   - Raw `axios` to `/api/payments/checkout/*`. Auth optional — caller may pass a bearer.

### proxy.ts (Next.js 16 middleware replacement)
- Handles country/Accept-Language locale detection, `zyrix_locale` cookie persistence,
  redirect-to-locale-prefix for non-prefixed paths.
- Skips `/api`, `_next`, `_vercel`, asset extensions.
- **Does NOT proxy or rewrite to backend.** Frontend talks to backend directly via
  `NEXT_PUBLIC_API_URL`. CORS is the backend's job.

### Next.js app/api routes (only 3)
- `app/api/geo/route.ts` — server-side geo lookup (independent of backend).
- `app/api/docs/feedback/route.ts` — server-side proxy to `${API_URL}/api/docs/feedback`.
- `app/api/docs/analytics/route.ts` — server-side proxy to `${API_URL}/api/docs/analytics`.

### `next.config.ts` — relevant
- `redirects()` already removes legacy `/demo` paths → `/signup` (for all locales).
  This confirms a prior "demo mode" page existed and was decommissioned in favor of the
  free plan. No `/demo` route exists in `app/[locale]/*` anymore.

---

## 2. Demo data surface map (grouped by feature)

### Category A — `lib/ai/*` "try-then-fallback-to-demo" services (the core target)

10 modules. Every module:
- Reads `process.env.NEXT_PUBLIC_API_URL` directly into `this.baseURL`.
- Uses **raw `axios`** (not `apiClient`) → **no JWT injected** → backend would respond
  `401` (or `404` if route doesn't exist) → `try/catch` swallows the error and returns
  hardcoded demo data.
- Effect today: even if a backend route existed, the request would 401 because no auth
  header is attached. The fallback is therefore unconditional in practice.

| # | Module | Endpoint(s) attempted | Demo content & line range | Used as |
|---|---|---|---|---|
| A1 | `lib/ai/customersAI.ts` | GET `/api/ai/customers` | 6-row `pool` of fake customers (Khalid, Sara, Levant, Ahmed, Fatima, Yusuf), lines 60-157 | Primary source for `(dashboard)/customers` |
| A2 | `lib/ai/dealsAI.ts` | GET `/api/ai/deals` | 5-row `deals` array, lines 56-142 | Primary source for `(dashboard)/deals` |
| A3 | `lib/ai/pipelineAI.ts` | GET `/api/ai/pipeline`; PATCH `/api/deals/:id/stage` (raw axios — broken auth) | 6-row `deals` + computed `stageHealth`, lines 45-187 | Primary source for `(dashboard)/pipeline` board |
| A4 | `lib/ai/revenueBrain.ts` | GET `/api/ai/revenue-brain` | Hardcoded scenarios + leakage + recommended actions, lines 42-83 | `AIRevenueBrainPanel` on dashboard |
| A5 | `lib/ai/agents.ts` | POST `/api/ai/agents/run`, /outputs/:id/{approve,dismiss,edit}, /:role/permission, GET /logs | 3-row `AgentOutput` array, lines 171-233 (plus 8-agent `agentDefinitions` registry which is intentional UI metadata) | `AgentsWidget` on dashboard + `(dashboard)/ai-agents` page |
| A6 | `lib/ai/reportsAI.ts` | GET `/api/ai/reports/:type` | Hardcoded narrative + 3 insights + 2 charts, lines 43-100 | `(dashboard)/reports` page |
| A7 | `lib/ai/messagingAI.ts` | POST `/api/ai/messages/{draft,improve-tone,translate}` | 3 hardcoded `AIMessageDraft` samples (also `improveTone`/`translate` no-op fall back to original content), lines 67-87 | `AIMessageComposer` |
| A8 | `lib/ai/decisionEngine.ts` | POST `/api/ai/{executive-summary,priority-actions}` | Trilingual greetings + 5 trilingual priority items (en/ar/tr), lines 63-287 | `AIExecutiveSummary` + `AIPriorityActions` on dashboard |
| A9 | `lib/ai/dealTimeline.ts` | GET `/api/ai/deals/:id/timeline` | 4-event timeline + recovery plan, lines 36-71 | `AIDealTimelineDrawer` (opened from pipeline) |
| A10 | `lib/ai/bulkActions.ts` | POST `/api/ai/bulk-actions` | Fake-success result with `Math.random` confidence, lines 49-70 | `AIBulkActionBar` (over selected customers/deals) |

### Category B — `lib/services/recommendations.ts`

| # | File | Endpoint attempted | Bug | Demo content | Used as |
|---|---|---|---|---|---|
| B1 | `lib/services/recommendations.ts` | `fetch('/api/recommendations?locale=…')` — **RELATIVE URL** | Hits the Next.js server (no such app/api route) → ALWAYS 404 → ALWAYS falls back | `getFallbackRecommendations(locale)` returns 5 hardcoded recs × 3 locales (15 entries), lines 51-181 | Primary source for `AIRecommendationsStrip` rendered on `MerchantHome` |

### Category C — Pure stubs (no API call at all — 100% hardcoded)

| # | File | Demo content | Comment in code |
|---|---|---|---|
| C1 | `components/dashboard/AISmartKPIGrid.tsx` | 4 hardcoded KPI cards (revenue $388k, customers 247, pipeline $1.2M, activity 94%) — lines 30-71 | Line 28: `// Demo data — replace with API call when backend is wired.` |
| C2 | `components/merchant/NotificationsPanel.tsx` | 4 hardcoded `SAMPLE` notifications — lines 23-64 | Lines 21-22: `Local-only sample data for now. When /api/notifications is ready, swap the useEffect to fetch from that endpoint — shape matches MerchantNotification already.` |
| C3 | `app/[locale]/status/page.tsx` | Hardcoded `SERVICES` array (Web, REST API, DB, WhatsApp, Email, AI Services + more) all `status: "operational"` — lines 43+ | Lines 21-22: `Currently shows all services as operational. Evolves into live Uptime integration.` |

### Category D — Soft fallback (raw axios, returns neutral default on failure)

These don't lie — they show "not connected" / zero-state defaults — but they currently
can't authenticate either, so they always show the empty state.

| # | File | Endpoint | Fallback | Risk |
|---|---|---|---|---|
| D1 | `lib/integrations/googleDrive.ts` | GET `/api/integrations/google-drive/status` (raw axios) | `{ connected: false, lastSync: null, itemsSynced: 0, errors: 0 }` | Even if user IS connected, this will show "not connected" because no JWT is attached |
| D2 | `lib/integrations/microsoft.ts` | GET `/api/integrations/microsoft/status` (raw axios) | Same shape, same issue | Same |

### Category E — "Coming Soon" stubs (NOT C-2 scope — these are unbuilt features)

All `app/[locale]/merchant/*/page.tsx` (except `MerchantHome` and `notifications/NotificationsAllView`)
delegate to `<ComingSoonPage titleKey="…" />` which is a static "feature in progress"
banner. There is no data layer to demolish — these need feature-build work, not a demo
swap. Confirmed for: `contacts`, `companies`, `deals`, `dashboards`, `conversations`,
`tasks`, `tickets`, `segments`, `marketing-email`, `meeting-links`, `calls`, `feeds`,
`help`, `settings`. Also `notifications/page.tsx` → `NotificationsAllView` is a
Coming-Soon stub. `merchant/create/[entity]` likewise renders a placeholder.

### Category F — Intentional hardcoded reference data (NOT demo, NOT in C-2 scope)

These are static config / docs / nav arrays — they are NOT customer data and should
remain in code:

- `app/[locale]/(dashboard)/settings/api/docs/page.tsx::ENDPOINTS` — API reference docs
- `app/[locale]/api-reference/page.tsx::ENDPOINTS` — public API reference
- `app/[locale]/sitemap/page.tsx::NODES` — sitemap nav
- `app/[locale]/features/page.tsx::categories` — marketing features list
- `app/[locale]/onboarding/page.tsx::STEPS` — wizard step keys
- `components/admin/AdminShell.tsx::NAV` — admin nav
- `components/admin/AdminPlansView.tsx::PLAN_ORDER` — plan ordering enum
- `components/merchant/KeyboardShortcutsModal.tsx::SHORTCUTS` — keyboard reference
- `components/pipeline/AIPipelineBoard.tsx::STAGES` — pipeline column ordering
- `app/[locale]/(dashboard)/reports/page.tsx::REPORT_TYPES`,
  `tasks/page.tsx::STATUS_ORDER`, `settings/users/page.tsx::ROLE_ORDER`,
  `settings/roles/page.tsx::MODULE_ORDER`, `settings/templates/page.tsx::CATEGORIES` —
  all enum-ordering arrays
- `lib/ai/agents.ts::agentDefinitions` (lines 41-106) — 8-agent UI metadata registry
- `app/[locale]/portal/page.tsx::TOPICS` (if present) — form topic list

---

## 3. API call inventory

### 3.1 Real backend client (`lib/api/*.ts`, uses `apiClient` with auth)

22 modules. Each exports typed request functions hitting real `/api/...` routes through
the auth-aware `apiClient`. Only modules using `apiClient` (verified via direct read or
import grep) are listed as real:

| Module | Confirmed endpoints |
|---|---|
| `auth.ts` | `/api/auth/{signup,signin,refresh,logout,me}`, `/api/auth/2fa/challenge`, plus password/email helpers |
| `customers.ts` | GET `/api/customers`, GET/PATCH/DELETE `/api/customers/:id`, POST `/api/customers`, GET `/api/customers/stats` |
| `deals.ts` | GET/POST `/api/deals`, GET/PATCH/DELETE `/api/deals/:id`, GET `/api/deals/pipeline` |
| `dashboard.ts` | GET `/api/dashboard/stats` (role-aware: member/manager/company shapes) |
| `tasks.ts` | `/api/tasks/*` (typed list/create/update/delete) |
| `quotes.ts` | `/api/quotes/*` |
| `contracts.ts` | `/api/contracts/*` (incl. reminders) |
| `commission.ts` | `/api/commission/*` |
| `cashflow.ts` | `/api/cashflow/*` |
| `loyalty.ts` | `/api/loyalty/*` (program, stats, transactions, top-members, tiers) |
| `campaigns.ts` | `/api/campaigns/*` (create/list/send/stats) |
| `chat.ts` | `/api/chat/*` (incl. `fetchUnreadCount`) |
| `whatsapp.ts` | `/api/whatsapp/*` (inbox, thread, send, AI reply suggest) |
| `tax.ts` | `/api/tax/*` |
| `followup.ts` | `/api/followup/*` |
| `ai-cfo.ts` | `/api/ai-cfo/*` (snapshot, prompt-templates, ask) |
| `roles.ts` | `/api/permissions/me`, list company users |
| `session-events.ts` | POST `/api/session-events` |
| `advanced.ts` | `/api/advanced/*` — large surface: templates, custom-fields, brands, search, comments, notifications, exports, workflows, audit, data-retention, security/IP allowlist, billing, SCIM, integrations (incl. ecommerce stores), dashboard widgets, scheduled analytics, cohort/funnel/ecommerce reports, AI architect/builder/report (real ones — different from `lib/ai/*`!), email templates |
| `admin.ts` | `/api/admin/*` (companies, users, plans, support, audit, billing, network, announcements, docs CMS) — separate auth realm |
| `portal.ts` | `/api/portal/*` (magic link, customer self-serve dashboard, quotes/contracts) — separate session |
| `payments.ts` | POST `/api/payments/checkout/{create-session,confirm-stub}` — public flow with optional bearer |

### 3.2 Direct `fetch()` calls

| Location | Endpoint | Notes |
|---|---|---|
| `lib/api/client.ts:47` | POST `${API_URL}/api/session-events` | Fire-and-forget on session_expired (`keepalive: true`) |
| `lib/services/recommendations.ts:35` | GET `/api/recommendations?locale=…` (relative) | **Bug — relative URL → wrong host → always falls back** (Category B) |
| `components/docs/WasThisHelpful.tsx:27` | POST `/api/docs/feedback` | Goes through Next.js `app/api/docs/feedback/route.ts` proxy → backend |
| `components/docs/ArticleViewTracker.tsx:30,56` | POST `/api/docs/analytics` | Same pattern |
| `components/pricing/PricingView.tsx:71` | GET `/api/geo` | Next.js route only (no backend) |
| `app/api/docs/feedback/route.ts:17` | server-side fetch to `${API_URL}/api/docs/feedback` | Real backend |
| `app/api/docs/analytics/route.ts:18` | server-side fetch to `${API_URL}/api/docs/analytics` | Real backend |
| `components/merchant/sidebar/GlobalSearch.tsx` (read partial — `${API_URL}/api/docs/search` referenced) | Public docs search | OK, no auth required |

### 3.3 Direct `axios.*(…)` calls (outside `apiClient`)

| Location | Realm | Status |
|---|---|---|
| `lib/api/client.ts` (`axios.create` + raw `axios.post` on refresh) | Main user | Legitimate (defines apiClient) |
| `lib/api/admin.ts` (raw axios) | Admin | Legitimate (own token chain) |
| `lib/api/portal.ts` (`axios.create` on `portalClient`) | Portal | Legitimate (own session) |
| `lib/api/payments.ts` (raw axios) | Public checkout | Legitimate |
| `lib/ai/*.ts` × 10 | — (no auth) | **DEMO-FALLBACK LAYER (Category A)** |
| `lib/integrations/googleDrive.ts` | — (no auth) | **Soft fallback (Category D)** |
| `lib/integrations/microsoft.ts` | — (no auth) | **Soft fallback (Category D)** |
| `components/public/ContactView.tsx:53` | Public form | Legitimate (no auth needed for public contact) |

### 3.4 React Query / `useQuery` consumers

The dashboard widgets and AI table pages all wrap their service calls in
`useQuery` from `@tanstack/react-query`. The query layer is real — it's the underlying
service module that decides whether the data is real or demo. Notable consumer pattern:

```ts
const { data } = useQuery({
  queryKey: ['ai-customers', search],
  queryFn: () => customersAI.list({ search }),  // <- this is the demo-fallback layer
});
```

vs. the real pages (loyalty/campaigns/contracts/etc.) which use `useEffect` + setState
directly with `lib/api/*` modules and have proper loading/error states.

---

## 4. Triage table (master view)

Status legend:
- **REAL** — wired to a real backend endpoint via `apiClient`, no demo fallback in code path.
- **FALLBACK** — wired but silently swallows errors and returns demo data; will appear "real" but currently always lies because raw axios → no auth → 401 → demo.
- **STUB** — pure hardcoded data, no API attempt.
- **DUAL** — page mixes real and demo widgets side by side.
- **STUB-UI** — Coming Soon page (no data layer at all).
- **UNKNOWN** — couldn't determine without running.

Backend endpoint column: `?` = uncertain (likely doesn't exist post-C-1 because frontend client doesn't reference it via `apiClient`).

| # | Feature area | Demo data location | Real API call wired? | Backend endpoint exists? | Status |
|---|---|---|---|---|---|
| 1 | Dashboard hero — Executive summary | `lib/ai/decisionEngine.ts::demoSummary` (en/ar/tr) | YES via `decisionEngine.getExecutiveSummary` POST `/api/ai/executive-summary` (raw axios) | `?` (not in `lib/api/*`) | FALLBACK |
| 2 | Dashboard hero — Priority actions | `lib/ai/decisionEngine.ts::demoActions` (5 × 3-locale) | YES via `decisionEngine.getPriorityActions` POST `/api/ai/priority-actions` (raw) | `?` | FALLBACK |
| 3 | Dashboard hero — Smart KPIs | `components/dashboard/AISmartKPIGrid.tsx` (revenue/customers/pipeline/activity) | NO — pure hardcoded | n/a (no fetch attempted) | STUB |
| 4 | Dashboard hero — Revenue brain | `lib/ai/revenueBrain.ts::demo` | YES GET `/api/ai/revenue-brain` (raw) | `?` | FALLBACK |
| 5 | Dashboard hero — Agents widget | `lib/ai/agents.ts::demo` | YES POST `/api/ai/agents/run` (raw) | `?` | FALLBACK |
| 6 | Dashboard real KPIs (bottom) | n/a | YES `fetchDashboardStats` GET `/api/dashboard/stats` | YES (used by C-1 era) | REAL |
| 7 | Dashboard onboarding banner + checklist | n/a | YES `getOnboardingStatus` GET `/api/advanced/onboarding/status` | YES | REAL |
| 8 | Dashboard custom widget grid | n/a | YES `lib/api/advanced` (DashboardLayout, widgets) | YES | REAL |
| 9 | Dashboard connected stores widget | n/a | YES `listEcommerceStores` via `lib/api/advanced` | YES | REAL |
| 10 | **Dashboard page (overall)** | top half AI + bottom half real | mixed | mixed | **DUAL** |
| 11 | Customers list | `lib/ai/customersAI.ts::demo` (6 customers) | YES GET `/api/ai/customers` (raw) | `?` (real `/api/customers` exists in `lib/api/customers.ts` but page doesn't use it) | FALLBACK |
| 12 | Customer detail (`customers/[id]`) | n/a | YES `getCustomer` GET `/api/customers/:id` | YES (C-1) | REAL |
| 13 | Customer create modal | n/a | YES `createCustomer` POST `/api/customers` | YES | REAL |
| 14 | Customer import | n/a | YES `importCustomers` via `advanced` | YES | REAL |
| 15 | Deals list | `lib/ai/dealsAI.ts::demo` (5 deals) | YES GET `/api/ai/deals` (raw) | `?` (real `/api/deals` exists but page doesn't use it) | FALLBACK |
| 16 | Deals create modal | n/a | YES `createDeal` POST `/api/deals` | YES | REAL |
| 17 | Pipeline board (drag/drop) | `lib/ai/pipelineAI.ts::demo` (6 deals) | YES GET `/api/ai/pipeline` + PATCH `/api/deals/:id/stage` (raw) | `/api/ai/pipeline`: `?`. PATCH stage: needs verification — `lib/api/deals.ts::updateDeal` is PATCH `/api/deals/:id` with stage in body. Endpoint mismatch! | FALLBACK |
| 18 | Pipeline deal timeline drawer | `lib/ai/dealTimeline.ts::demo` | YES GET `/api/ai/deals/:id/timeline` (raw) | `?` | FALLBACK |
| 19 | Reports page | `lib/ai/reportsAI.ts::demo` | YES GET `/api/ai/reports/:type` (raw) | `?` (real reports under `/api/advanced/reports/*` exist for cohort/funnel/ecommerce) | FALLBACK |
| 20 | Reports — cohort/funnel/ecommerce | n/a | YES via `lib/api/advanced` | YES | REAL |
| 21 | AI Agents page (`/ai-agents`) | `lib/ai/agents.ts::demo` | YES POST `/api/ai/agents/run` + outputs/perms (raw) | `?` | FALLBACK |
| 22 | AI bulk action bar | `lib/ai/bulkActions.ts::demo` | YES POST `/api/ai/bulk-actions` (raw) | `?` | FALLBACK |
| 23 | AI message composer | `lib/ai/messagingAI.ts::demo` (3 drafts) | YES POST `/api/ai/messages/{draft,improve-tone,translate}` (raw) | `?` | FALLBACK |
| 24 | AI side panel | n/a (Zustand UI store + static help text) | n/a — no data fetch | n/a | STUB (acceptable — pure UI scaffold) |
| 25 | AI build modal (architect/builder/report) | n/a | YES `aiArchitect`, `aiBuilder`, `aiReport` from `lib/api/advanced` | YES | REAL |
| 26 | AI CFO page | n/a | YES `fetchSnapshot`, `askAICFO` from `lib/api/ai-cfo` | YES | REAL |
| 27 | AI/sales | n/a | YES `lib/api/advanced` | YES | REAL |
| 28 | AI/meetings | n/a | YES `lib/api/advanced` | YES | REAL |
| 29 | AI/content | n/a | YES `generateAiContent` from `lib/api/advanced` | YES | REAL |
| 30 | WhatsApp inbox + thread | n/a | YES `lib/api/whatsapp` (incl. `suggestAIReply`) | YES (C-1) | REAL |
| 31 | Loyalty | n/a | YES `lib/api/loyalty` + `lib/api/customers` | YES | REAL |
| 32 | Campaigns | n/a | YES `lib/api/campaigns` + `lib/api/advanced` | YES | REAL |
| 33 | Contracts | n/a | YES `lib/api/contracts` + `lib/api/customers` | YES | REAL |
| 34 | Commission | n/a | YES `lib/api/commission` | YES | REAL |
| 35 | Cashflow | n/a | YES `lib/api/cashflow` | YES | REAL |
| 36 | Quotes | n/a | YES `lib/api/quotes` + `lib/api/customers` | YES | REAL |
| 37 | Tasks | n/a | YES `lib/api/tasks` + `lib/api/customers` | YES | REAL |
| 38 | Tax | n/a | YES `lib/api/tax` | YES | REAL |
| 39 | Tax invoices | n/a | YES `lib/api/advanced` | YES | REAL |
| 40 | Followup | n/a | YES `lib/api/followup` | YES | REAL |
| 41 | Chat (internal) | n/a | YES `lib/api/chat` | YES | REAL |
| 42 | Templates (email) | n/a | YES `lib/api/advanced::listTemplates` | YES | REAL |
| 43 | Notifications (`/notifications` dashboard route) | n/a | YES `lib/api/advanced` | YES | REAL |
| 44 | Workflows (list/builder/executions) | n/a | YES `lib/api/advanced` | YES | REAL |
| 45 | Analytics (builder/scheduled) | n/a | YES `lib/api/advanced` | YES | REAL |
| 46 | Session KPIs | n/a | YES `lib/api/session-events` | YES | REAL |
| 47 | Settings — Brand (single) | n/a | YES `lib/api/advanced` | YES (C-1 fixed) | REAL |
| 48 | Settings — Brands (multi) | n/a | YES `lib/api/advanced` | YES (C-1 fixed) | REAL |
| 49 | Settings — Users / Roles | n/a | YES `lib/api/roles` | YES | REAL |
| 50 | Settings — API tokens / API docs | n/a (docs static) + tokens REAL | YES `lib/api/advanced` for tokens | YES | REAL (+ docs static = Category F) |
| 51 | Settings — Audit log | n/a | YES `lib/api/advanced` + `roles` | YES | REAL |
| 52 | Settings — Compliance / Data retention / Security / IP allowlist / SCIM / Custom fields / Templates / Billing / Integrations | n/a | YES `lib/api/advanced` | YES | REAL |
| 53 | Settings — Integrations / file-storage (Google Drive, Microsoft) | uses `lib/integrations/googleDrive.ts` + `microsoft.ts` (raw axios, soft default) | Partially — settings page itself uses `lib/api/advanced`; status checks bypass apiClient | `/api/integrations/{google-drive,microsoft}/status` likely exists | FALLBACK (soft) |
| 54 | Onboarding banner + wizard | n/a | YES `lib/api/advanced` | YES | REAL |
| 55 | Auth (signup, signin, forgot, reset, verify, 2FA) | n/a | YES `lib/api/auth` via `lib/auth/context.tsx` | YES | REAL |
| 56 | Pricing public page | n/a (geo via Next route) | YES `fetchPublicPlans` from `lib/api/admin` | YES | REAL |
| 57 | Checkout | n/a | YES `lib/api/payments` | YES | REAL |
| 58 | Public contact form | n/a | YES POST `/api/public/contact` (raw axios, public — fine) | `?` (worth verifying backend route exists) | REAL (assumed) |
| 59 | Public docs / blog / changelog / features / about / security / privacy / terms / api-reference / sitemap | static markdown / hardcoded copy (Category F) | n/a | n/a | REAL static content |
| 60 | Customer portal (magic link → dashboard) | n/a | YES `lib/api/portal` | YES | REAL |
| 61 | Admin console (all sub-pages) | n/a | YES `lib/api/admin` | YES | REAL |
| 62 | Public quote view `/q/[token]` | n/a | YES `lib/api/quotes` | YES | REAL |
| 63 | Status page | `app/[locale]/status/page.tsx::SERVICES` (all "operational") | NO | n/a — no fetch | STUB |
| 64 | Merchant home (`/merchant`) | n/a (cards static) + AIRecommendationsStrip (Category B) | mixed | partial | DUAL (strip is FALLBACK) |
| 65 | Merchant notifications panel (header bell) | `components/merchant/NotificationsPanel.tsx::SAMPLE` | NO | `?` (`/api/notifications` planned per code comment) | STUB |
| 66 | Merchant — contacts/companies/deals/dashboards/conversations/tasks/tickets/segments/marketing-email/meeting-links/calls/feeds/help/settings (all sub-pages) | no data layer — Coming Soon stub | NO | n/a | STUB-UI (defer to future "build merchant" sprint) |
| 67 | Merchant — `/merchant/notifications/all` | no data layer — Coming Soon stub | NO | n/a | STUB-UI |
| 68 | Merchant create entity placeholder | no data layer | NO | n/a | STUB-UI |
| 69 | Merchant — global search (sidebar) | docs results REAL via `${API_URL}/api/docs/search`; CRM-side (contacts/deals/tasks) intentionally unwired per code comment | partial | docs YES; CRM search `?` | DUAL |

### Summary of triage statuses

- **REAL:** 39 areas (#6-9, 12-14, 16, 25-50 (most), 54-62, 59 static content)
- **FALLBACK:** 12 areas (#1, 2, 4, 5, 11, 15, 17-19, 21-23, 53)
- **STUB:** 4 areas (#3, 24, 63, 65)
- **DUAL:** 3 areas (#10 dashboard, #64 merchant home, #69 global search)
- **STUB-UI (Coming Soon, defer):** 14+ areas (#66-68)

---

## 5. Blast-radius estimation

Per finding requiring action in C-2 (excludes Coming Soon stub-UI and intentional reference data):

| ID | Area | Files affected if wired | Risk | Shape compatibility (component expects ↔ likely backend) |
|---|---|---|---|---|
| F1 | Dashboard Executive Summary (decisionEngine) | 2 (`AIExecutiveSummary.tsx`, `decisionEngine.ts`) | LOW once endpoint exists. Shape is well-typed (`AIExecutiveSummary` interface). Greeting/narrative are computed strings — backend must return localized text or compute client-side. | Need backend POST `/api/ai/executive-summary` returning `{greeting, oneLineNarrative, topPriorities, revenueAtRisk, opportunities, confidence, cta[]}` |
| F2 | Dashboard Priority Actions (decisionEngine) | 2 (`AIPriorityActions.tsx`, `decisionEngine.ts`) | LOW. Trilingual content is the bulk of the demo — backend must handle locale param. | Need POST `/api/ai/priority-actions` returning `AIPriorityAction[]` |
| F3 | Dashboard Smart KPI Grid (STUB) | 1 (`AISmartKPIGrid.tsx`) | LOW. Already overlaps with `fetchDashboardStats` data. | Two options: (a) compute client-side from existing dashboard stats + locale-aware contextual strings; (b) need new `/api/ai/kpi-grid` endpoint. Option (a) requires zero backend work. |
| F4 | Dashboard Revenue Brain (revenueBrain) | 2 (`AIRevenueBrainPanel.tsx`, `revenueBrain.ts`) | LOW. Self-contained shape. | Need GET `/api/ai/revenue-brain` returning `RevenueBrainData` |
| F5 | Dashboard Agents Widget + `/ai-agents` page (agents) | 4 (`AgentsWidget.tsx`, `ai-agents/page.tsx`, `AIAgentCard.tsx`, `agents.ts`) | MEDIUM — agent permission writes (`updatePermission`) currently silently no-op. If backend exists but mutation fails silently, user thinks setting saved when it didn't. | Need POST/run + 4 mutation endpoints |
| F6 | Customers list (customersAI) | 1 (`customers/page.tsx`) | MEDIUM — page expects AI-augmented shape (`segment`, `aiScore`, `riskLevel`, `nextAction`, `signals`, `lastContactDays`). The real `/api/customers` returns the raw shape (`fullName`, `lifetimeValue`, …). Two options: backend adds `/api/ai/customers` that augments, OR client transforms the real shape and drops AI fields until ready. | Shape gap — see options |
| F7 | Deals list (dealsAI) | 1 (`deals/page.tsx`) | MEDIUM — same AI-augmentation gap |
| F8 | Pipeline board (pipelineAI) | 2 (`AIPipelineBoard.tsx`, `pipelineAI.ts`) | HIGH — drag-and-drop optimistic mutation calls `PATCH /api/deals/:id/stage` which doesn't match the real `PATCH /api/deals/:id` (with stage in body) used by `lib/api/deals.ts::updateDeal`. Endpoint alignment required. Stage health is computed; could move client-side. | Needs alignment + GET `/api/ai/pipeline` (or compute pipeline shape from `getPipeline` already in `lib/api/deals.ts`) |
| F9 | Pipeline deal timeline drawer (dealTimeline) | 2 (`AIDealTimelineDrawer.tsx`, `dealTimeline.ts`) | LOW. | Need GET `/api/ai/deals/:id/timeline` |
| F10 | Reports page (reportsAI) | 2 (`reports/page.tsx`, `reportsAI.ts`) | LOW–MEDIUM — narrative + 2 charts × 4 report types. Already-real `lib/api/advanced` has cohort/funnel/ecommerce reports — sales/pipeline/customers/revenue would be new. | Need 4 new endpoints OR compute charts client-side from existing data |
| F11 | AI bulk actions (bulkActions) | 2 (`AIBulkActionBar.tsx`, `bulkActions.ts`) | MEDIUM — actions claim success even when nothing happened. User selects 50 customers, clicks "Draft messages", sees 50 fake drafts. | Need POST `/api/ai/bulk-actions` |
| F12 | AI message composer (messagingAI) | 2 (`AIMessageComposer.tsx`, `messagingAI.ts`) | MEDIUM — silent fallback returns 3 placeholder drafts unrelated to context. | Need 3 endpoints |
| F13 | Recommendations strip on `/merchant` (recommendations) | 2 (`AIRecommendationsStrip.tsx`, `recommendations.ts`) | LOW. The relative-URL bug means it never reaches backend. Either fix URL + build endpoint, or commit to static tips. | Need GET `/api/recommendations?locale=…` OR drop fetch |
| F14 | Notifications panel SAMPLE on merchant header | 1 (`NotificationsPanel.tsx`) | MEDIUM — bell badge currently always shows 3 unread → confuses real users about whether they have actual notifications. | Need GET `/api/notifications` (or wire to existing `/api/advanced/notifications` if it covers merchant scope) |
| F15 | Status page hardcoded SERVICES | 1 (`status/page.tsx`) | LOW. Marketing surface — most CRMs use a 3rd party probe (StatusCake/UptimeRobot) for this. Could keep static for launch. | Either external uptime service or backend `/api/status` |
| F16 | Integrations status (Drive/Microsoft) | 2 (`googleDrive.ts`, `microsoft.ts`) | MEDIUM — current code shows "not connected" even when user IS connected, because no JWT. After C-1 the backend likely answers; we just need to attach auth. | Mechanical: replace raw axios with `apiClient` |
| F17 | Merchant global search (CRM-side) | 1 (`merchant/sidebar/GlobalSearch.tsx`) | LOW. Code comment explicitly says "still a placeholder until backend search index lands." | Defer until backend search index is built |

---

## 6. Recommended C-2 sub-sprint structure

Ordered by **safety + value** — earliest sub-sprints unlock subsequent ones and don't
require new backend work. Each sub-sprint is sized to be one PR or one micro-commit
sequence with diff review.

### **C-2.B — Foundation: route all AI services through `apiClient` (no backend dependency)** ★ DO FIRST

> **Why first:** Currently every `lib/ai/*` and `lib/integrations/*` module uses raw
> `axios` with no auth interceptor. Even if backends existed, they'd 401 100% of the
> time. This is purely mechanical (replace `axios` import + base-URL string with the
> auth-aware `apiClient`) and unblocks all later observation: with auth attached, the
> 401 becomes a 404 (telling us which endpoints don't exist) or a 200 (telling us
> they DO exist and we should drop the demo fallback).

- Files: 10 × `lib/ai/*.ts` + 2 × `lib/integrations/*.ts` = **12 files**
- Risk: LOW — strict refactor, no behavior change for end-users (still falls back).
- Output: each module imports `apiClient` and replaces the `try { axios.get(`${baseURL}…`) }`
  blocks. The fallback stays in place during this sub-sprint.
- Verify by hand: open Network tab on dashboard, confirm Bearer is now attached.

### **C-2.C — Dashboard hero cleanup: smart KPI grid + recommendations** ★ HIGH VALUE, NO NEW BACKEND

> Targets the two pure-stub items that don't need new backend endpoints.

1. `AISmartKPIGrid` — reshape to consume `fetchDashboardStats` (already real). Compute
   the "context" strings client-side from those numbers (or via i18n lookups).
   Deletes 70+ lines of hardcoded data. **F3 closed.**
2. `lib/services/recommendations.ts` — fix the relative-URL bug to use
   `${API_URL}/api/recommendations`, OR (if `/api/recommendations` won't be built
   soon) remove the fetch attempt entirely and rename `fetchRecommendations` to
   `getRecommendations(locale)` returning the localized tips synchronously. **F13 resolved.**

- Files: 2–3
- Risk: LOW for #1 (existing data, new mapping); LOW for #2 either way.

### **C-2.D — Customers + Deals: drop AI fallbacks, augment client-side**

> Goal: kill the demo customer pool and demo deals list. Two paths per item:
> (a) Backend already has `/api/customers` (real, C-1). Strategy: convert pages to call
>     `listCustomers`/`listDeals` directly, drop AI-augmentation fields (segment,
>     aiScore, riskLevel, nextAction, signals, lastContactDays) from the AITable
>     until the backend has scoring.
> (b) Keep the AI shape but compute aggregation fields client-side
>     (`lastContactDays = days since lastContactAt`).

- Files: `customers/page.tsx`, `deals/page.tsx`, `pipeline/page.tsx` (DealStage type),
  + delete or stub `customersAI.ts`, `dealsAI.ts`
- Risk: MEDIUM — UI columns and badges must degrade gracefully when AI fields are absent.
- Decision needed: see Open Question §8.3.

### **C-2.E — Pipeline board: align stage-update endpoint and demote AI fallback**

> Pipeline drag-and-drop today calls `PATCH /api/deals/:id/stage` (raw, no auth) which
> may not match the real `PATCH /api/deals/:id` exposed by `lib/api/deals.ts::updateDeal`.
> Even worse, the optimistic UI silently swallows failure → user moves a card, sees
> success toast, but server never received the update.

- Files: `pipelineAI.ts`, `AIPipelineBoard.tsx`, possibly `lib/api/deals.ts`
- Risk: HIGH if shape mismatch; LOW once aligned. Shape compatibility verification
  needed against backend.
- Subtasks:
  1. Confirm with backend whether `PATCH /api/deals/:id/stage` exists or whether
     `PATCH /api/deals/:id { stage }` is the canonical path.
  2. Use `getPipeline` (already in `lib/api/deals.ts`) for the snapshot read; compute
     `stageHealth` client-side OR add a backend endpoint.
  3. Drop demo fallback once read path is real.

### **C-2.F — Reports + AI Build modal already real** (mostly cleanup)

> The "AI build modal" (architect/builder/report) already uses real `lib/api/advanced`.
> Reports page is the FALLBACK item. Strategy: prefer cohort/funnel/ecommerce reports
> already in `lib/api/advanced/reports/*` for the four narrative types until a true AI
> narrative endpoint lands.

- Files: `reports/page.tsx`, `reportsAI.ts`
- Risk: LOW — change data source, same chart components.

### **C-2.G — Integrations status auth fix**

> Mechanical (already covered by C-2.B if we go that route, but worth calling out
> separately to verify Google Drive / Microsoft status reads correctly with JWT).

- Files: 2 (`lib/integrations/{googleDrive,microsoft}.ts`) + `settings/integrations/file-storage` consumers
- Risk: LOW once C-2.B is done.

### **C-2.H — Merchant header notifications (SAMPLE → real)**

> Backend dependency: `/api/notifications` (or extend `/api/advanced/notifications`
> to cover merchant scope). If merchant area itself is paused, the header bell may
> still want to show real CRM-wide notifications.

- Files: `components/merchant/NotificationsPanel.tsx`
- Risk: LOW once endpoint exists. Until then this can stay flagged but bell badge should
  say `0` instead of `3` to avoid misleading users.

### **C-2.I — AI message composer + bulk actions**

> Both currently silently lie — high deception risk for users. If backend isn't ready,
> recommendation: gate behind a feature flag or replace the silent toast with an
> explicit "coming soon" empty state.

- Files: `AIMessageComposer.tsx`, `AIBulkActionBar.tsx`, `messagingAI.ts`, `bulkActions.ts`
- Risk: MEDIUM. If backend isn't ready, prefer disabling the buttons over showing
  fake drafts.

### **C-2.J — Dashboard hero AI widgets (decisionEngine, revenueBrain, agents)**

> The hardest because they require real backend `/api/ai/*` endpoints. Until those
> exist, recommended approach:
> 1. Hide them behind a feature flag (`NEXT_PUBLIC_ENABLE_AI_DASHBOARD`).
> 2. If flag off, dashboard renders only the real KPI/leaderboard/onboarding sections
>    (#6-9 in triage). The dashboard is still useful and 100% real.
> 3. Flag flips on as each backend endpoint ships.

- Files: `dashboard/page.tsx`, `AIExecutiveSummary.tsx`, `AIPriorityActions.tsx`,
  `AIRevenueBrainPanel.tsx`, `AgentsWidget.tsx`, `decisionEngine.ts`, `revenueBrain.ts`,
  `agents.ts`, `(dashboard)/ai-agents/page.tsx`
- Risk: HIGH — large surface, multiple endpoints, many mutations.

### **C-2.K — Status page → live uptime**

> Lowest priority. Acceptable to defer to a marketing-side sub-sprint or wire up a 3rd
> party probe later. Static-and-honest is better than fake-and-wrong but currently
> renders 100% green which is deceptive on outages. Recommendation: at minimum, replace
> the hardcoded "operational" array with a build-time deploy timestamp + a "see live
> status at status.zyrix.co" link until a probe lands.

- Files: `app/[locale]/status/page.tsx`
- Risk: LOW.

### Recommended ordering

```
C-2.B (auth wiring)           ── unblocks observation of true backend gaps
   ↓
C-2.C (KPI grid + recs)       ── pure win, no backend dep
   ↓
C-2.G (integrations)          ── mechanical, validates C-2.B
   ↓
C-2.D (customers/deals)       ── visible feature
   ↓
C-2.E (pipeline)              ── needs backend alignment
   ↓
C-2.F (reports)               ── route to existing advanced reports
   ↓
C-2.H (notifications) ──┐
C-2.I (composer + bulk) ─┴──   ── parallel; both depend on backend
   ↓
C-2.J (dashboard hero)        ── biggest, do last (or feature-flag)
   ↓
C-2.K (status page)           ── optional / deferrable
```

---

## 7. Deferred items (out of C-2 scope)

These are findings that surfaced during discovery but are NOT pure demo-data
replacement. Capture them for follow-up sprints:

1. **Merchant area is `ComingSoonPage` everywhere except home.** 14 sub-pages
   (`contacts`, `companies`, `deals`, `dashboards`, `conversations`, `tasks`, `tickets`,
   `segments`, `marketing-email`, `meeting-links`, `calls`, `feeds`, `help`, `settings`,
   plus `notifications/all` and `create/[entity]`) need actual feature work. Suggest a
   "Sprint D — Merchant" track. Out of C-2 because there's no demo data layer to
   demolish.

2. **`AISidePanel` renders contextual help via static descriptions** keyed off page
   context (Zustand store). Not demo data per se, but if the AI assistant is supposed
   to give live answers, this needs an LLM-backed `/api/ai/ask` endpoint someday.
   Defer.

3. **`AIBuildModal::aiArchitect/aiBuilder/aiReport`** are already wired to
   `lib/api/advanced` — but no proof these endpoints exist on the backend post-C-1.
   Worth asking the backend team. Out of C-2 demo-data scope.

4. **`pipelineAI.updateDealStage` endpoint mismatch** — `PATCH /api/deals/:id/stage`
   vs. `PATCH /api/deals/:id`. Whichever lands in C-2.E, the OTHER should be removed
   on the backend to avoid two paths to the same mutation.

5. **`components/merchant/sidebar/GlobalSearch.tsx`** — comment says "CRM-side results
   are still a placeholder until the backend search index lands." Defer until backend
   search service exists.

6. **`AISmartKPIGrid` will largely duplicate the real KPI cards on the dashboard once
   wired** — consider consolidating into a single KPI strip (real + AI context) instead
   of two side-by-side strips.

7. **`PROJECT_STATUS.md` is stale** — claims `next-intl 3.26` but `package.json` has
   `4.4.0`. Mentions 4 demo pages (customers, whatsapp, loyalty, campaigns) that are
   no longer demo (loyalty/whatsapp/campaigns are fully wired; customers is the AI
   fallback case). Update at end of C-2.

8. **Two `Math.random()` calls in `lib/ai/messagingAI.ts:84` and
   `lib/ai/bulkActions.ts:66`** generate fake confidence scores in demo data. Will be
   removed when those modules' demos are dropped — no separate action needed, but
   noted.

9. **`SKIP_SSL_VERIFY` and `DISABLE_RATE_LIMITS`** env vars defined in
   `.env.local.example` — need to verify they're actually consumed somewhere, or
   delete them from the template if dead.

10. **`AISmartKPIGrid` uses i18n key `ai.dashboard.kpi.*` — confirm those keys exist in
    `messages/en.json`/`ar.json`/`tr.json`** when reshaping. (Most likely they do; just
    verify during implementation.)

11. **`packages` mismatch with PROJECT_STATUS.md:** doc says backend uses
    "Anthropic SDK forbidden — use Gemini" but no AI package is in the frontend
    `package.json`. The frontend doesn't directly call any LLM. So the constraint
    applies to backend only; no frontend action.

12. **`/demo` legacy redirects in `next.config.ts`** — already redirected to `/signup`
    for all locales. Once C-2 is complete and "demo mode" is a concept of the past,
    consider whether to keep these redirects (yes, keep for SEO) or eventually drop.

13. **No `isDemo` / `DEMO_MODE` flags exist anywhere** — confirmed by grep. There's no
    central toggle to flip; C-2 is about removing the implicit per-module fallbacks.

---

## 8. Open questions for Mehmet

These need decisions before / during C-2 implementation. Numbered for easy reference.

1. **Backend `/api/ai/*` endpoints — what's the truth post-C-1?**
   None of the 11 demo-fallback endpoints (`/api/ai/customers`, `/api/ai/deals`,
   `/api/ai/pipeline`, `/api/ai/revenue-brain`, `/api/ai/agents/run` + 4 mutations,
   `/api/ai/reports/:type`, `/api/ai/messages/{draft,improve-tone,translate}`,
   `/api/ai/executive-summary`, `/api/ai/priority-actions`,
   `/api/ai/deals/:id/timeline`, `/api/ai/bulk-actions`) appear in `lib/api/*.ts`,
   suggesting they don't exist on the backend yet. Confirm: are these planned? When?

2. **Dashboard composition strategy.**
   The dashboard currently has 5 AI hero widgets ABOVE 4 real KPI cards — both feed
   off similar data. Options:
   - (a) Keep both: top = AI narrative, bottom = raw KPIs.
   - (b) Merge: AI summary becomes the single KPI strip when wired.
   - (c) Feature-flag the AI widgets so the dashboard renders cleanly without them
        until backends exist.
   Which direction?

3. **Customers/Deals AI augmentation strategy.**
   Customer pages today expect `segment / aiScore / riskLevel / nextAction / signals /
   lastContactDays / totalRevenue`. Real `/api/customers` returns
   `fullName / lifetimeValue / lastContactAt / status (new|qualified|customer|lost)`.
   Options:
   - (a) Drop AI fields from the table until backend scoring exists; rely on `status`.
   - (b) Compute lite AI fields client-side (`lastContactDays` from `lastContactAt`,
        a simple segment from `lifetimeValue`).
   - (c) Block C-2.D until backend ships `/api/ai/customers`.
   Which?

4. **Recommendations endpoint.**
   `/api/recommendations` is referenced by frontend but with the relative-URL bug.
   Will it exist on the backend? Or do we drop the fetch attempt and treat
   `getFallbackRecommendations` as the canonical source (renaming + cleaning the
   misleading "fallback" naming)?

5. **Notifications scope.**
   The merchant notifications panel comment says "swap when /api/notifications is
   ready". Is this on the backend roadmap, or should we wait for the merchant feature
   build sprint? In the meantime, what should the bell show — `0` unread or hidden?

6. **Status page strategy.**
   Live uptime via 3rd-party probe (StatusCake / UptimeRobot — recommended) or wait
   for in-house `/api/status`? Currently always-green is misleading on real outages.

7. **Pipeline drag-and-drop endpoint alignment.**
   `pipelineAI.updateDealStage` calls `PATCH /api/deals/:id/stage`. The real
   `lib/api/deals.ts::updateDeal` calls `PATCH /api/deals/:id` with stage in body.
   Which is canonical on the backend? (We'll align frontend to that.)

8. **Integrations soft-fallback policy.**
   Should `googleDrive.ts` / `microsoft.ts` go through `apiClient` so they show real
   connection status? Or is "always-show-disconnected on unauthenticated check" the
   desired behavior? (Recommendation: through `apiClient`. Confirm.)

9. **AI bulk actions UX while backend is unbuilt.**
   Right now selecting 50 customers + clicking "Draft messages" silently returns 50
   fake drafts. Options for the C-2.I window:
   - (a) Disable the action buttons entirely.
   - (b) Show a "coming soon" toast with no fake drafts.
   - (c) Wait for backend.
   Which?

10. **C-2 vs C-3 split.**
    Some of the AI hero work in C-2.J might be better delivered as a separate
    "Sprint C-3 — AI Decision Engine" track once the backend AI services exist.
    Should we scope C-2 to: B + C + D + E + F + G + H + cleanup parts of I + K, and
    park C-2.J under C-3?

---

## 9. Decisions and revised sub-sprint structure

> Decisions issued by Mehmet on 2026-04-26 in response to Section 8 open questions.
> Verbatim. Where an answer references "you" or "we", that is Mehmet speaking.

### 9.1 Answers to Section 8 open questions

**§8.1 — Backend /api/ai/* endpoints status:**

CONFIRMED — none of the 11 demo-fallback /api/ai/* endpoints exist on the backend. They are frontend illusions. We will NOT build them. Instead, frontend will route to existing real endpoints (/api/customers, /api/deals, /api/deals/pipeline, /api/advanced/reports/*) directly. Drop the AI variants.

**§8.2 — Dashboard composition strategy:**

Option (c) — feature-flag the AI hero widgets. Set NEXT_PUBLIC_ENABLE_AI_DASHBOARD=false by default. Dashboard renders ONLY real KPI / leaderboard / onboarding sections. AI widgets stay hidden until backend AI services are built (separate sprint, scoped as C-3).

**§8.3 — Customers/Deals AI augmentation strategy:**

Option (a) — DROP AI fields from the tables (segment / aiScore / riskLevel / nextAction / signals / lastContactDays / totalRevenue). Use only the real shape from /api/customers (fullName / lifetimeValue / lastContactAt / status) and from /api/deals. No client-side computed AI fields. We are not faking AI. The tables will be cleaner and honest.

**§8.4 — Recommendations endpoint:**

DROP the fetch attempt entirely. Rename fetchRecommendations to getRecommendations(locale) returning the localized tips synchronously. The "fallback" was always the canonical source — there's no backend behind it. Clean up the misleading naming.

**§8.5 — Notifications scope:**

DEFER. Backend doesn't have /api/notifications for merchant area, and merchant feature work is out of C-2 scope anyway. The bell badge should show 0 unread (visible, not hidden — users should see "0 unread" not a phantom bell). Component stays in C-2.H scope but the implementation is "show 0, drop the SAMPLE array, await real wiring in a future merchant sprint".

**§8.6 — Status page strategy:**

Replace hardcoded "operational" with a single static line linking to status.zyrix.co. C-2.K becomes a 1-line change. Real uptime monitoring is a separate ops sprint, not C-2. If status.zyrix.co doesn't exist yet either, the link can point to a placeholder page or be dropped entirely — your call during C-2.K implementation.

**§8.7 — Pipeline drag-and-drop endpoint alignment:**

ALIGN frontend to the canonical real endpoint: PATCH /api/deals/:id with stage in body (the one in lib/api/deals.ts::updateDeal). Drop pipelineAI's PATCH /api/deals/:id/stage call entirely — the /stage sub-route is dead and we will not add it to the backend. If the backend later wants a dedicated stage endpoint for performance reasons, that's a future decision and a separate sprint. For C-2.E: one path, lib/api/deals.ts::updateDeal. Period.

**§8.8 — Integrations soft-fallback policy:**

THROUGH apiClient. We want real connection status. The "always-show-disconnected" behavior was a bug masquerading as a feature. C-2.B/G fixes this.

**§8.9 — AI bulk actions UX while backend is unbuilt:**

Option (a) — DISABLE the action buttons entirely. Tooltip: "Coming soon — AI features are in active development." No fake drafts, no fake successes. Honest UX.

**§8.10 — C-2 vs C-3 split:**

SPLIT confirmed. C-2 scope: B + G + C + D + E + F + H + I + K. The dashboard AI hero widgets (C-2.J) move to a future "Sprint C-3 — AI Decision Engine" once backend AI services land. For C-2, we add a feature flag (per §8.2) and the widgets render hidden by default. Don't delete the components — just gate them.

### 9.2 Additional calls on Section 7 deferred items

- Deferred items #1 (merchant area), #2 (AISidePanel LLM), #3 (AIBuildModal endpoints) — all stay deferred. Note them in PROJECT_STATUS.md update at end of C-2.
- Deferred item #6 (AISmartKPIGrid duplicating real cards) — fold into C-2.C: when reshaping AISmartKPIGrid, consolidate visually with the existing real KPI cards if natural. If awkward, leave as separate strips.
- Deferred item #7 (PROJECT_STATUS.md stale) — update at end of C-2 in a final commit.
- Deferred item #9 (SKIP_SSL_VERIFY / DISABLE_RATE_LIMITS) — quick grep during C-2.B; if dead, delete from .env.local.example.
- Deferred item #13 (no DEMO_MODE flag) — confirms our approach is correct: per-module surgical removal, not global toggle.

### 9.3 Revised final C-2 sequence (approved)

| Step | Description | Visible wins |
|---|---|---|
| **C-2.A** | Discovery commit (current state) | — |
| **C-2.B** | Auth wiring through apiClient (12 files) | 0 visible wins, foundation |
| **C-2.G** | Integrations status verification | 2 visible wins (Drive + Microsoft) |
| **C-2.C** | KPI grid reshape + recommendations rename | 2 visible wins |
| **C-2.D** | Customers + Deals: route to real endpoints, drop AI fields | 2 visible wins |
| **C-2.E** | Pipeline: align to canonical PATCH endpoint | 1 visible win |
| **C-2.F** | Reports: route AI narrative types to advanced reports | 1 visible win |
| **C-2.H** | Notifications: bell shows 0, sample data dropped | cosmetic win |
| **C-2.I** | Bulk actions + composer: disable buttons + coming-soon tooltip | UX honesty |
| **C-2.J** | → **DEFERRED to Sprint C-3** (separate). Add feature flag in C-2 closing commit. | — |
| **C-2.K** | Status page: 1-line link to status.zyrix.co | — |
| **C-2.L** | Closing: PROJECT_STATUS.md update, .env cleanup, final report | — |

This kills demo mode visibly across 8+ feature areas without a single new backend endpoint.

---

*End of Sprint C-2.A discovery report.*
