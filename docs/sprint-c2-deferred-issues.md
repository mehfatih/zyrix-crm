# Sprint C-2 Deferred Issues — Cleanup Sprint Brief

> **Document purpose:** Self-contained brief for a future Claude Code session (or human engineer) to run the cleanup sprint without referring to any prior chat history. All decisions, evidence, and verification steps are recorded inline.

---

## 0. Reading instructions

- **Audience:** A future Claude Code session (or human engineer) starting fresh on the Zyrix CRM frontend repo.
- **Self-containment guarantee:** All context needed to act is inside this document. Do not rely on external chat history.
- **All architectural decisions referenced are recorded in §4 and §8 of this doc.**
- **If something is unknown, it is marked explicitly as "TBD in cleanup" with verification steps.**

---

## 1. Project context (full re-statement)

### 1.1 Repository

- **Repo name:** `zyrix-crm` (frontend)
- **Path on disk:** `D:\Zyrix Hub\zyrix-crm`
- **Origin:** `https://github.com/mehfatih/zyrix-crm.git`
- **Tech stack:**
  - Next.js 16.2.4 (App Router)
  - React 19.0.0
  - TypeScript 5.7.2
  - Tailwind CSS 3.4.17
  - next-intl 4.4.0 (i18n: en / ar / tr)
  - @tanstack/react-query 5.99+
  - @tanstack/react-table 8.21+
  - @dnd-kit (drag & drop)
- **Package manager:** npm (Node ≥20)
- **Build script:** `next build --no-lint` with 8GB heap (per `package.json`)
- **Custom files at root:** `proxy.ts` (middleware-like), `vercel.json`, custom path alias `@/` → repo root

### 1.2 Production deployment

- **URL:** `https://crm.zyrix.co`
- **Host:** Vercel
- **Auto-deploy:** push to `main` triggers Vercel deploy automatically

### 1.3 Backend

- **Repo name:** `zyrix-crm-backend` (separate repo, not in this workspace)
- **Path on disk:** `D:\Zyrix Hub\zyrix-crm-backend`
- **Production URL:** `https://api.crm.zyrix.co` (Railway)
- **Tech:** Node.js / Express / TypeScript / Prisma / PostgreSQL
- **Status as of report date (2026-04-26):** Sprint C-1 complete; all 48 migrations applied; brand endpoints (/api/brand, /api/brands, /api/brands/stats) returning 200; hardening commits applied (`5995151` errorHandler, `5a42de2` start fail-closed)

### 1.4 Audit program context

This is a multi-sprint audit program led by Mehmet Fatih (founder, full-stack developer):

- **Sprint A:** Backend audit + initial fixes (DONE; ref: prior backend commits ending at `16be5ed`)
- **Sprint B:** Dark Navy theme migration (Phase 2c.1 deferred; ref: `docs/sprint-b-followup.md` and last commit `3bb74ce`)
- **Sprint C-1:** Backend migration recovery (DONE; full report in backend repo `docs/sprint-c1-discovery.md`)
- **Sprint C-2:** Frontend demo data removal (IN PROGRESS — see §2)
- **Future:** Sprint C-3 (AI Decision Engine, deferred from C-2.J)

### 1.5 Working conventions

- Mehmet replies in Arabic; commit messages and code comments in English
- Discovery reports before implementation, every sprint
- Micro-commits with `git diff` review between each
- "Stop on any unexpected output" hard constraint
- No mock/demo/fake/placeholder data in new code (the goal of C-2 is to REMOVE these)
- Read files before editing
- No JWT/secret printing in chat
- Snapshots before destructive ops on production
- One concept per sub-sprint
- Auto-proceed allowed within mechanical batches (e.g., 12-file refactors); STOP on first unexpected pattern

### 1.6 Two-pattern insight (from C-2.A discovery)

All demo data in this codebase falls into one of two categories:

1. **`lib/ai/*` modules (10 files)** — use raw axios with no auth → 401 on every call → silent demo fallback in catch block
2. **Pure stubs (4 components)** — `AISmartKPIGrid`, merchant `NotificationsPanel.SAMPLE`, `/status` page, `AISidePanel` — hardcoded data with no API call

**39+ feature areas are already correctly wired through `apiClient`** (the auth-aware axios instance at `lib/api/client.ts`).

The C-2 sprint's job is to surgically remove the demo fallbacks in pattern #1 by re-routing consumers to existing real endpoints (`/api/customers`, `/api/deals`, `/api/deals/pipeline`, `/api/advanced/reports/*`), and either build out or feature-flag pattern #2.

---

## 2. Sprint C-2 sub-sprint sequence (the planned trajectory)

Decided in `docs/sprint-c2-discovery.md` §9.3 (commit `a15ea64`):

| Step | Description | Status |
|---|---|---|
| **C-2.A** | Discovery report + decisions on demo data removal | ✅ DONE — commit `a15ea64` |
| **C-2.B** | Auth wiring through apiClient (12 files) | ⚠️ PARTIALLY REVERTED — see §3.1 |
| **C-2.G** | Integrations status verification (Drive + Microsoft) | ⏭️ NEXT after this report is committed |
| **C-2.C** | KPI grid reshape + recommendations rename | Pending |
| **C-2.D** | Customers + Deals: route to real endpoints, drop AI fields | Pending |
| **C-2.E** | Pipeline: align to canonical PATCH endpoint | Pending |
| **C-2.F** | Reports: route AI narrative types to advanced reports | Pending |
| **C-2.H** | Notifications: bell shows 0, sample data dropped | Pending |
| **C-2.I** | Bulk actions + composer: disable buttons + coming-soon tooltip | Pending |
| **C-2.J** | Dashboard AI hero widgets | ⏭️ DEFERRED to Sprint C-3 |
| **C-2.K** | Status page: 1-line link to status.zyrix.co | Pending |
| **C-2.L** | Closing: PROJECT_STATUS.md + .env cleanup + final report | Pending |
| **C-2-CLEANUP** | This document's issues (5 items) | ⏭️ AFTER C-2.L |

---

## 3. Open issues (full detail per issue)

**5 deferred issues total: 2 P0 + 3 P1.**

---

### 3.1 P0-1 — Latent FEATURE_DISABLED redirect on AiBuildModal endpoints

- **ID:** P0-1
- **Severity:** P0 (production-blocker for users on plans without `ai_build_modes` entitlement; low-frequency because button-triggered, not page-load)
- **Title:** AiBuildModal "AI Architect" / "AI Builder" / "AI Report" buttons redirect non-entitled users to `/feature-disabled` instead of showing in-modal error
- **Symptom:** User on a plan without `ai_build_modes` entitlement clicks "AI Architect" / "AI Builder" / "AI Report" button (likely inside an `AiBuildModal` component). Backend returns `403` with body `{ error: { code: "FEATURE_DISABLED", feature: "ai_build_modes" } }`. The apiClient response interceptor at `lib/api/client.ts:96-117` catches this and navigates the browser via `window.location.href` to `/{locale}/feature-disabled?feature=ai_build_modes`. User is yanked out of their workflow. Expected behavior: in-modal error banner saying "Upgrade your plan to access AI Build" or similar, with the modal staying open and the user staying on their original page.
- **Where it fires:** Three endpoint methods in `lib/api/advanced.ts`:
  - `aiArchitect` (~line 2769) → `POST /api/ai/architect`
  - `aiBuilder` (~line 2787) → `POST /api/ai/builder`
  - `aiReport` (~line 2812) → `POST /api/ai/report`
  All three are called from `AiBuildModal` component (exact file path TBD — search `components/` for `AiBuildModal*` or `AiBuild*Modal*`).
- **Suspected root cause:** Pre-existing latent issue, **not** introduced by C-2.B. These three endpoints have always gone through `apiClient` (unlike `lib/ai/*` which were on raw axios pre-C-2.B). The 403 redirect interceptor was added at some point and these calls have been hitting it all along — just rarely, because the buttons require explicit user clicks. The C-2.B regression investigation surfaced this as a "latent twin" of the broader `lib/ai/*` problem.
- **Files / commits to investigate:**
  - `lib/api/client.ts` (interceptor at lines 96-117 — full code in §4 below)
  - `lib/api/advanced.ts` (the three aiBuild methods)
  - `components/` — search for `AiBuildModal*` or `AiBuild*Modal*`
  - `app/[locale]/(dashboard)/feature-disabled/page.tsx` (the landing page, for context only)
  - **No commits to revert** — this is pre-existing, unrelated to C-2.B revert (`d3c7ba2`)
- **Verification step for cleanup:**
  1. Sign in as a user on the Free plan (test account: `levanaarab@gmail.com` / Levana Cosmetic — confirmed Free plan)
  2. Navigate to a page that exposes the AI Build modal (TBD — likely Dashboard, Customers, or Deals — verify by hunting for "AI Architect" / "AI Builder" / "AI Report" buttons until one fires)
  3. Click the AI Build button
  4. Observe: browser navigates to `/en/feature-disabled?feature=ai_build_modes`
  5. Verify in DevTools Network tab: the `/api/ai/architect` (or `/builder` / `/report`) request returned `403`
  6. After fix: clicking the button should show an in-modal error banner; URL should NOT change
- **Acceptance criteria:**
  - Clicking any of the three AI Build buttons does NOT navigate the browser
  - User stays on the page they triggered from
  - An in-modal or in-page error banner explains the upgrade path

---

### 3.2 P0-2 — FEATURE_DISABLED redirect on `ai_workflows` gate (Automations / Audit log / Roles / Team)

- **ID:** P0-2
- **Severity:** P0 (production-blocker; multiple feature pages completely inaccessible to Free plan users; happens on page load, not button-click — so users hit it the moment they navigate)
- **Title:** Automations, Audit log, Roles, and Team pages immediately redirect to `/feature-disabled?feature=ai_workflows` on page load
- **Symptom:** User on Free plan clicks "Automations" (or "Audit log", "Roles", "Team") in the sidebar. The page begins to render, then immediately redirects to `/en/feature-disabled?feature=ai_workflows`. The redirect is so fast it appears as if the menu item is broken.
- **Mehmet's exact words (Arabic, original):** "في مشكلة في automations section. لما بحاول افتحها بتتقفل بسرعة والصفحة تنتقل لصفحة feature-disabled. وكذلك صفحة Audit log وصفحة roles وصفحة Team."
- **English paraphrase:** "There's an issue with the Automations section. When I try to open it, it closes quickly and the page navigates to the feature-disabled screen. Same thing for Audit log, Roles, and Team pages."
- **Date observed:** 2026-04-26 ~16:45 Istanbul time, after the C-2.B revert (`d3c7ba2`) was deployed.
- **Where it fires:** Page load. Suspected request chain (TBD per page in cleanup):
  - **Automations** page calls some `lib/api/*` method (TBD — search `lib/api/` for "automation" or "workflow")
  - **Audit log** calls a `lib/api/audit.ts` method (or similar)
  - **Roles** calls `lib/api/roles.ts` method (confirmed exists from C-2.A discovery)
  - **Team** calls some user-management endpoint (likely `lib/api/team.ts` or `lib/api/users.ts`)
  All four likely hit endpoints that the backend gates behind the `ai_workflows` feature key for the Free plan.
- **Suspected root cause:** Same architectural cause as P0-1: `apiClient` interceptor at `lib/api/client.ts:96-117` redirects on any `403 FEATURE_DISABLED` with **no per-call opt-out and no endpoint allowlist**. Different feature key (`ai_workflows` vs `ai_build_modes`), same redirect mechanism.
- **Why this matters more than P0-1:** P0-2 affects whole pages on first navigation, not button clicks. Free plan users cannot even SEE the Roles or Team management pages — they're forcibly bounced to `/feature-disabled` before the page paints.
- **Files / commits to investigate:**
  - `lib/api/client.ts` (interceptor — same as P0-1)
  - `lib/api/*` — search for which methods feed Automations, Audit log, Roles, Team pages
  - `app/[locale]/(dashboard)/automations/*` (or wherever the Automations page lives — TBD path)
  - `app/[locale]/(dashboard)/settings/audit/*` (Audit log)
  - `app/[locale]/(dashboard)/settings/roles/*` (Roles)
  - `app/[locale]/(dashboard)/settings/team/*` (Team — also called Users in some contexts)
  - **No commits to revert** — pre-existing OR possibly introduced by an earlier sprint (TBD when cleanup investigates with `git blame`)
- **Verification step for cleanup:**
  1. Sign in as a Free plan user (Levana Cosmetic on production qualifies — `levanaarab@gmail.com`)
  2. Click "Automations" in left sidebar (if visible)
  3. Observe: browser ends up at `/en/feature-disabled?feature=ai_workflows` within ~500ms
  4. Repeat for Audit log, Roles, Team — same redirect
  5. Verify in DevTools Network tab on each page: identify the FIRST request that returned `403` with `body.error.code === "FEATURE_DISABLED"` and `body.error.feature === "ai_workflows"`
  6. After fix: pages should render normally with the user's data, OR show an in-page upsell banner, but should NOT navigate the browser away
- **Architectural fix recommended:** Option A from §4 below — add `{ _skipFeatureRedirect: true }` config support to the apiClient interceptor, opt-in the affected modules.
- **Acceptance criteria:**
  - All 4 pages (Automations, Audit log, Roles, Team) load without browser navigation
  - Free plan users see either the actual page (if backend tolerates the call) or an in-page upgrade prompt
  - No `/feature-disabled` redirect fires on these page loads

---

### 3.3 P1-1 — Quotes page returns 422 "Request failed with status code 422"

- **ID:** P1-1
- **Severity:** P1 (visible error, page partially functional — header + KPI cards render with zeros, but data list shows error)
- **Title:** `/en/quotes` shows red error banner "Request failed with status code 422" instead of empty state or quotes list
- **Symptom:** User navigates to `crm.zyrix.co/en/quotes`. The page header ("Quotes & Proposals"), description, KPI cards (Total / Pending / Accepted / Accepted Value, all showing 0), search bar, and "All statuses" filter all render correctly. Below the filter row, a red banner displays:
  ```
  ⚠️ Request failed with status code 422
  ```
  No quotes list appears.
- **Date observed:** 2026-04-26 ~16:44 Istanbul time, after C-2.B revert deploy.
- **Where it fires:** Page load. Likely the initial quotes-list fetch from `app/[locale]/(dashboard)/quotes/page.tsx` via `lib/api/quotes.ts`. Backend returned 422 (likely Zod validation failure on query params).
- **Suspected root cause:** Mismatch between query params/body shape that frontend sends and Zod schema that backend expects. Common 422 causes:
  - Frontend sends a parameter that backend doesn't allow (e.g., extra field that fails `.strict()` schema)
  - Frontend sends wrong type (e.g., string where number expected)
  - Frontend sends value out of range
  - Frontend omits a required field
- **Files / commits to investigate:**
  - `app/[locale]/(dashboard)/quotes/page.tsx` (the consumer)
  - `lib/api/quotes.ts` (the client)
  - Zyrix backend route `GET /api/quotes` (separate repo `zyrix-crm-backend`) — schema definition needed for comparison
- **Verification step for cleanup:**
  1. Open DevTools Network tab, Filter: Fetch/XHR, Preserve log enabled
  2. Navigate to `/en/quotes`
  3. Find the request that returned 422 (likely `GET /api/quotes` or similar)
  4. Click the request → **Headers** tab → copy Request URL with full query string
  5. Click **Payload** / **Request body** if POST; or inspect query params if GET
  6. Click **Response** tab → copy the backend's exact validation error message
  7. Compare against backend Zod schema in `zyrix-crm-backend`
  8. Fix the mismatch on the frontend side (preferred) or document a backend schema relaxation if the frontend shape is canonical
- **Acceptance criteria:** `/en/quotes` loads without the red banner; if no quotes exist, an empty state ("No quotes yet" or similar) appears instead.

---

### 3.4 P1-2 — "Validation failed: limit Number must be less than or equal to 100"

- **ID:** P1-2
- **Severity:** P1 (visible error, page partially functional)
- **Title:** `/en/contracts` and `/en/loyalty` show red error banner "Validation failed: limit: Number must be less than or equal to 100"
- **Symptom:**
  - **On `/en/contracts`:** page header ("Contracts"), description, KPI cards (Total / Active / Pending Signature / Expiring in 30d, all showing 0), search bar, "All statuses" filter, "Only expiring (30d)" checkbox all render correctly. Below the filter row, red banner:
    ```
    ⚠️ Validation failed: • limit: Number must be less than or equal to 100
    ```
  - **On `/en/loyalty`:** page header ("Customer Loyalty"), description, tab strip (Overview / Members / Transactions / Program), and "+ New Transaction" button all render. Below tabs, same red banner:
    ```
    ⚠️ Validation failed: • limit: Number must be less than or equal to 100
    ```
- **Date observed:** 2026-04-26 ~16:44 Istanbul time, after C-2.B revert deploy.
- **Where it fires:** Page load on Contracts; tab change (or initial load) on Loyalty. Frontend is sending a `limit` parameter > 100 in the API request, and backend's Zod schema enforces a maximum of 100.
- **Suspected root cause:** Frontend client (likely `lib/api/contracts.ts` and `lib/api/loyalty.ts`) hardcodes a limit value > 100 (common values: 200, 250, 500, 1000) for "load all at once" pagination behavior. Backend recently added or tightened a `.max(100)` constraint on the Zod schema, breaking this assumption.
- **Files / commits to investigate:**
  - `lib/api/contracts.ts` (search for `limit:` literal)
  - `lib/api/loyalty.ts` (search for `limit:` literal)
  - `app/[locale]/(dashboard)/contracts/page.tsx` (callsite)
  - `app/[locale]/(dashboard)/loyalty/*` (callsites — multiple tabs)
  - Backend schemas: `zyrix-crm-backend/src/routes/contracts.ts` and `loyalty.ts` (or similar)
- **Verification step for cleanup:**
  1. Open DevTools Network tab on `/en/contracts`
  2. Find the failing request and inspect the query string — confirm it contains `limit=<some-value>` where value > 100
  3. Same for `/en/loyalty`
  4. Fix: reduce the limit to 100 (or smaller); add proper pagination if dataset can exceed 100; OR raise the backend max if 100 is genuinely too restrictive (architecture decision — defer to a backend review if so)
- **Acceptance criteria:** Both pages load without the red banner; if data exists, the first 100 records (or configured page size) display normally; if more exist, pagination controls appear.

---

### 3.5 P1-3 — Settings UX regression: sidebar + topbar + back navigation missing on Settings landing

- **ID:** P1-3
- **Severity:** P1 (UX issue, not a functional break — user can still use browser back button or type URL — but actively painful and disorienting)
- **Title:** Entering `/en/settings` (the settings hub landing page) hides the global left sidebar AND the global topbar (with search) AND there is no back-navigation arrow within the Settings shell, leaving the user with no in-app way to return to the rest of the CRM
- **Symptom (Mehmet's words, originally Arabic):** "عاوز يكون في سهم عودة من صفحة الاعدادات الرئيسية لاني لما بادخلها وببقي عاوز اخرج منها مش بلاقي سهم العودة بالاضافة ان القائمة كلها وخانة البحث بالاعلي كلهم بيختفوا في صفحة الاعدادات الرئيسية، عاوزهم يرجعوا"
- **English paraphrase:** "I want a back arrow on the main Settings page because when I enter it and want to leave, I can't find a back arrow. Also the entire sidebar AND the search bar at the top all disappear on the main Settings page. I want them back."
- **Date observed:** 2026-04-26 ~16:45 Istanbul time, after C-2.B revert deploy.
- **Where it fires:** Navigation to `/en/settings` (or any locale equivalent — `/ar/settings`, `/tr/settings`). The deeper Settings sub-pages (e.g., `/en/settings/api`, `/en/settings/audit`) MAY or MAY NOT exhibit the same issue — TBD in cleanup.
- **Important data point:** Earlier screenshots from C-2.B verification show `/en/settings/api` WITH the sidebar visible. This suggests the issue might be specific to the parent `/en/settings` landing route only, NOT the sub-pages. **Cleanup must verify which exact Settings routes are affected.**
- **Suspected root cause:** A layout boundary. Likely candidates:
  - `app/[locale]/(dashboard)/settings/layout.tsx` — if this file exists and renders without wrapping in `DashboardShell`, that's the culprit
  - A route group boundary (e.g., a `(settings)` group without the shared `(dashboard)` wrapper)
  - A conditional in `DashboardShell` that hides chrome on Settings routes
- **Pre-existing or new?** UNCONFIRMED. Mehmet did not have time to verify in incognito mode. Could be:
  - Pre-existing (always been this way, just noticed during C-2.B verification)
  - Introduced by Sprint B Phase 2c.1 layout migration (commit `c07bab7` — see `docs/sprint-b-followup.md`, this was the most recent layout work and was deferred without full sign-off)
  - Introduced by an even earlier sprint
- **Files / commits to investigate:**
  - `app/[locale]/(dashboard)/settings/page.tsx` (the landing)
  - `app/[locale]/(dashboard)/settings/layout.tsx` (if exists)
  - `components/layout/DashboardShell.tsx` (or wherever the global shell is defined — exact path TBD)
  - `components/layout/Sidebar.tsx` and `Topbar.tsx` (or equivalents)
  - Sprint B Phase 2c.1 commit `c07bab7` (Dark Navy migration)
  - `docs/sprint-b-followup.md` (Phase 2c.1 deferred follow-up notes)
- **Verification step for cleanup:**
  1. Sign in
  2. Click "Settings" in the left sidebar
  3. Observe: sidebar disappears, topbar disappears, no back button visible — landing on `/en/settings` shows ONLY the settings landing (whatever it shows)
  4. Try `/en/settings/api` directly via URL — does the chrome reappear? (Hypothesis: yes, only the landing route is affected)
  5. Run `git log --oneline -- "app/\[locale\]/\(dashboard\)/settings/"` to see what's been touched recently
  6. Run `git blame app/\[locale\]/\(dashboard\)/settings/layout.tsx` (if it exists) to identify when current behavior was introduced
  7. Compare against the chrome wrapping on a working route like `/en/customers` — what's different?
- **Implementation hint:** Most likely fix is one of:
  - (a) Deleting `app/[locale]/(dashboard)/settings/layout.tsx` if it exists and overrides the parent layout incorrectly
  - (b) Wrapping the settings landing in `DashboardShell`
  - (c) Removing a conditional in `DashboardShell` that excludes Settings routes
- **Acceptance criteria:** `/en/settings` landing shows the global sidebar AND the global topbar (search) AND any sub-page navigation chrome the rest of the app uses. User can navigate away to any other section via the sidebar.

---

## 4. The architectural question to settle in cleanup

**P0-1 and P0-2 share root cause.** Fixing both requires one architectural decision.

### 4.1 The current apiClient interceptor (verbatim from `lib/api/client.ts:96-117`)

```typescript
// 403 FEATURE_DISABLED → redirect to the friendly feature-disabled page,
// preserving the feature key so the page can display what specifically is
// unavailable. Only run in the browser; SSR render loops if we navigate
// during a server-side axios call.
if (error.response?.status === 403 && typeof window !== "undefined") {
  const body = error.response.data as {
    error?: { code?: string; feature?: string };
  } | undefined;
  if (body?.error?.code === "FEATURE_DISABLED") {
    const feature = body.error.feature ?? "";
    const currentPath = window.location.pathname;
    // Avoid infinite redirect loop if we're already there
    if (!currentPath.includes("/feature-disabled")) {
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      const locale = localeMatch?.[1] ?? "en";
      window.location.href = `/${locale}/feature-disabled?feature=${encodeURIComponent(
        feature
      )}`;
    }
    return Promise.reject(error);
  }
}
```

### 4.2 Why this is a problem

- **No per-request opt-out.** Every caller of apiClient is force-redirected on 403 FEATURE_DISABLED.
- **No endpoint allowlist.** The interceptor doesn't differentiate between "feature gate the user genuinely can't use" and "feature gate that should show in-page upsell instead of bouncing the user."
- **Browser navigation is uncancelable.** Once `window.location.href = ...` fires, no downstream try/catch can stop it. So the affected modules CANNOT solve this in their own code — the fix must be in the interceptor or via a separate axios instance.

### 4.3 Two architectural options considered

#### Option A — Per-call opt-out config flag (RECOMMENDED)

Add a `_skipFeatureRedirect` flag to the per-call config object. The interceptor checks for it before redirecting:

```typescript
if (
  body?.error?.code === "FEATURE_DISABLED" &&
  !(error.config as { _skipFeatureRedirect?: boolean })?._skipFeatureRedirect
) {
  // existing redirect logic
}
```

Then opt-in callers pass `_skipFeatureRedirect: true`:

```typescript
await apiClient.post('/api/ai/architect', payload, { _skipFeatureRedirect: true });
```

**Pros:**
- Surgical (one if-condition added; ~5-10 call sites updated)
- Preserves the redirect for every other caller (60+ wired modules keep their behavior)
- Fixes BOTH P0s in one motion
- Mechanical work — same shape as C-2.B itself

**Cons:**
- 5-10 call-site updates needed
- Slight pollution of per-call config

**Estimated diff size:** ~10 lines in client.ts + ~1 line per call site (~15 lines total across ~6-8 files)

#### Option E — Separate axios instance for opt-out modules

Create `lib/api/ai-client.ts` exporting a new `aiClient` — `axios.create()` with same baseURL + auth interceptor, but no FEATURE_DISABLED redirect. Affected modules import `aiClient` instead of `apiClient`.

**Pros:**
- Architecturally cleanest — matches existing pattern of `adminApi` (separate auth realm) and `portalClient` (separate session realm)
- One import-line change per file
- Future-proof

**Cons:**
- New file (~80 lines) with some interceptor duplication
- More complex review surface

**Estimated diff size:** ~80-line new file + ~6-8 import-line changes

### 4.4 Recommendation locked in this report: **Option A**

**Reason:** Minimal surface change, surgical, fixes both P0s in one motion. Option E was rejected because the duplication cost outweighs the readability win for ~5-8 modules.

If the cleanup engineer disagrees after implementation begins, they have authority to switch to Option E without reopening this discussion — the issue list and architectural finding stand either way.

---

## 5. Cleanup sprint plan

### 5.1 Sprint name

**Sprint C-2-CLEANUP** (chronologically after C-2.L closes)

### 5.2 Sub-sprints

| ID | Description | Files (estimated) |
|---|---|---|
| **CLEANUP.A** | Implement Option A — add `_skipFeatureRedirect` flag in apiClient interceptor + opt-in call sites | `lib/api/client.ts`, `lib/api/advanced.ts` (aiBuild trio), and the automations/audit/roles/team modules that hit feature-gated endpoints |
| **CLEANUP.B** | Fix P1-1 (Quotes 422) — DevTools-driven: capture failing request, fix payload shape | `lib/api/quotes.ts`, `app/[locale]/(dashboard)/quotes/page.tsx` |
| **CLEANUP.C** | Fix P1-2 (limit > 100) — Grep + reduce | `lib/api/contracts.ts`, `lib/api/loyalty.ts`, callsites |
| **CLEANUP.D** | Fix P1-3 (Settings UX) — Layout investigation; restore DashboardShell wrapper | `app/[locale]/(dashboard)/settings/layout.tsx` (if exists), `app/[locale]/(dashboard)/settings/page.tsx` |

### 5.3 Recommended execution order

```
CLEANUP.A  (P0-1 + P0-2 together — biggest user impact)
   ↓
CLEANUP.D  (P1-3 — most visible UX win, no backend dependency)
   ↓
CLEANUP.B  (P1-1 Quotes 422 — single page, contained)
   ↓
CLEANUP.C  (P1-2 limit fix — multiple pages, mechanical)
```

### 5.4 Acceptance criteria for the cleanup sprint

- All 5 issues no longer reproducible in production
- No new regressions introduced (smoke test all pages affected by C-2 sub-sprints)
- All commits pushed and Vercel deploy green
- `PROJECT_STATUS.md` updated to reflect cleanup completion
- This document (`docs/sprint-c2-deferred-issues.md`) marked as ✅ resolved with a closing summary appended

---

## 6. Files / commits / SHAs reference

### 6.1 Commit history relevant to this report (in chronological order)

| SHA | Description | Status |
|---|---|---|
| `16be5ed` | Sprint A — backend ticket #1 docs | Sprint A |
| `8955c44` | Sprint A — backend ticket draft | Sprint A |
| `7456f78` | Sprint B discovery | Sprint B |
| `ea22e22` | Sprint B decisions | Sprint B |
| `1b0d997` | Sprint B Phase 2 plan + deferred follow-ups | Sprint B |
| `85999e7` | Sprint B Phase 2a — navy + neon tokens | Sprint B |
| `7278931` | Sprint B Phase 2b — dark depth utilities | Sprint B |
| `c07bab7` | Sprint B Phase 2c.1 — DashboardShell Dark Navy migration | Sprint B (deferred) |
| `82d6b46` | Sprint B Phase 2c.1 — force rebuild | Sprint B |
| `3bb74ce` | Sprint B Phase 2c.1 deferred (rendering investigation) | Sprint B (deferred) |
| `a15ea64` | **C-2.A — Discovery report + decisions** | C-2 |
| `160510a` | C-2.B — customers-ai refactor | **REVERTED** |
| `c813e52` | C-2.B — reports-ai refactor | **REVERTED** |
| `0383a20` | C-2.B — revenue-brain refactor | **REVERTED** |
| `9e51437` | C-2.B — deal-timeline refactor | **REVERTED** |
| `92aa6cb` | C-2.B — bulk-actions refactor | **REVERTED** |
| `aa39875` | C-2.B — messaging-ai refactor | **REVERTED** |
| `12dfd84` | C-2.B — decision-engine refactor | **REVERTED** |
| `f20c610` | C-2.B — deals-ai refactor | **REVERTED** |
| `34428eb` | C-2.B — pipeline-ai refactor | **REVERTED** |
| `47fef62` | C-2.B — agents refactor | **REVERTED** |
| `0eea72d` | **C-2.B — Drive integration auth wiring** | **KEPT** |
| `b3a33a6` | **C-2.B — Microsoft integration auth wiring** | **KEPT** |
| `d3c7ba2` | **Selective revert (production restore)** | C-2 |

### 6.2 Key file locations

| Path | Purpose |
|---|---|
| `lib/api/client.ts` | apiClient definition + interceptors (THE source of P0 redirects) |
| `lib/api/advanced.ts` | aiBuildModal endpoints (lines ~2769, 2787, 2812) |
| `lib/ai/*` | All 10 demo-fallback modules (currently on raw axios after revert) |
| `lib/integrations/googleDrive.ts` | Auth-wired (kept from C-2.B) |
| `lib/integrations/microsoft.ts` | Auth-wired (kept from C-2.B) |
| `app/[locale]/(dashboard)/settings/*` | Settings pages with the UX issue |
| `app/[locale]/(dashboard)/feature-disabled/page.tsx` | Landing page when 403 redirect fires |
| `docs/sprint-c2-discovery.md` | Master discovery doc (§1-9 all decided) |
| `docs/sprint-b-followup.md` | Sprint B deferred items (may be relevant to P1-3) |
| `docs/sprint-c2-deferred-issues.md` | This document |

### 6.3 Backend gate keys referenced

| Feature key | Gates these endpoints | Affects |
|---|---|---|
| `ai_build_modes` | `/api/ai/architect`, `/api/ai/builder`, `/api/ai/report` | P0-1 (AiBuildModal) |
| `ai_workflows` | TBD — likely Automations / Audit log / Roles / Team endpoints | P0-2 |

**Note:** During the C-2.B push, before the revert, the `ai_build_modes` key was ALSO redirecting users on Dashboard / Customers / Deals / Pipeline / Reports because the (now-reverted) lib/ai/* refactor caused those calls to authenticate. After revert (`d3c7ba2`), those pages no longer redirect — they fall back to raw axios + 401 + silent demo fallback. P0-1 only affects the legitimately-wired-via-apiClient aiBuildModal trio.

### 6.4 Test environment

- **Test account:** `levanaarab@gmail.com` (Levana Cosmetic — Free plan)
- **Production CRM URL:** `https://crm.zyrix.co`
- **Production backend URL:** `https://api.crm.zyrix.co`

---

## 7. Open questions for cleanup sprint

| ID | Question | Why it matters |
|---|---|---|
| Q1 | Does `ai_workflows` gate apply at router middleware level or per-route? | Determines whether Option A opt-in is per-method or can be applied at module level (e.g., import once, applies to all calls in lib/api/automations.ts) |
| Q2 | Are there other feature gate keys we haven't surfaced yet? | A grep of the codebase for `feature=` URLs hit during testing, plus a backend audit, may reveal more redirects waiting to fire |
| Q3 | Should the cleanup sprint also address the latent issue in `lib/api/advanced::aiBuild` even if no user is hitting it today? | Answer: YES per current recommendation (Option A is mechanical and covers it for free) |
| Q4 | Should P1-3 Settings UX be moved to a larger UX cleanup that's currently deferred from Sprint B Phase 2c.1? | Decision deferred; cleanup engineer can choose to roll it into a Sprint B Phase 2c.2 follow-up if scope expands |
| Q5 | Is `ai_workflows` the same gate keying Audit log + Roles + Team, or are those gated separately? | TBD — DevTools verification per page in CLEANUP.A will reveal exact mappings |

---

## 8. Decision log

| Date | Decision | Outcome |
|---|---|---|
| 2026-04-26 | C-2.A discovery committed | `a15ea64` |
| 2026-04-26 | C-2.B push (`b3a33a6`) deployed | Caused production redirect regression on Dashboard / Customers / Deals / Pipeline / Reports (4-widget race triggered `ai_build_modes` redirect) |
| 2026-04-26 | Selective revert decision | Option D chosen: revert 10 lib/ai/* commits, keep 2 lib/integrations/* commits |
| 2026-04-26 | Selective revert executed | Commit `d3c7ba2` — production restored |
| 2026-04-26 | Browser verification of revert | 5 deferred issues identified during testing |
| 2026-04-26 | Decision to defer all 5 issues to a dedicated cleanup sprint after C-2.G/C/D/E/F/H/I/K/L | This document created to capture full context |
| 2026-04-26 | Architectural decision for P0 fixes locked: Option A (per-call `_skipFeatureRedirect` flag) | See §4.4 |

---

## 9. Quick-start for the cleanup sprint engineer

When you (future Claude or human) pick this up:

1. **Read this document end-to-end first.** Don't skip.
2. **Read `docs/sprint-c2-discovery.md` Section 9** for the decided sub-sprint plan and §8 answers.
3. **Confirm Sprint C-2 has reached C-2.L close** (PROJECT_STATUS.md should reflect this). If not, this cleanup is premature.
4. **Verify production state:**
   ```
   git log --oneline -5
   git status
   ```
   Working tree should be clean. HEAD should be at or after `d3c7ba2` (revert) plus all C-2.G through C-2.L commits.
5. **Reproduce each issue in production** before touching code. Use the verification steps in §3 per issue.
6. **Implement CLEANUP.A first** (P0-1 + P0-2 together via Option A from §4) — biggest impact, highest urgency.
7. **Then CLEANUP.D, B, C** in §5.3 order.
8. **Test each fix in isolation** with a Vercel preview deploy before merging to main.
9. **Update PROJECT_STATUS.md and this document** at the end with a closing summary.

---

*End of Sprint C-2 Deferred Issues report.*
