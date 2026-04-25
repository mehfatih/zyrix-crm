# Sprint A Discovery Report

**Date:** 2026-04-25
**Author:** Claude (read-only discovery on behalf of Mehmet)
**Scope:** Sprint A v2, Task 1 (Discovery only — no existing files modified).
**Last commit on `main` at start of Task 1:** `ba5b6af`.

---

## 0. Methodology and guard-rails

This report was produced by reading the repo only. No existing file was
edited, no schema was changed, no package was added. The only new file
created by Task 1 is this report at `docs/sprint-a-discovery.md`.

Areas explicitly **not** read or modified, per the rules in MASTER_GUIDE
Section 4 and the user's confirmation:

- `lib/ai/`
- `components/ai/`, `components/dashboard/`, `components/pipeline/`, `components/messaging/`, `components/deals/`
- `prisma/schema.prisma` (does not exist in this repo — see §1)
- `next.config.ts`, `package.json`, all `messages/*.json`

Browser-side console errors were **not** captured here. As agreed, that
field is marked "to be captured by Mehmet via DevTools" — this discovery
environment has no browser to drive.

---

## 1. Data layer (in lieu of Prisma models)

There is **no `prisma/` directory** in this repo. `prisma/schema.prisma`
does not exist. `PROJECT_STATUS.md` confirms the backend lives in a
separate repository (`zyrix-crm-backend`). The frontend talks to an
external HTTP backend via the Axios client at `lib/api/client.ts`,
hitting `process.env.NEXT_PUBLIC_API_URL` (default
`https://api.crm.zyrix.co`, falling back to `http://localhost:4000`).

The "schema" — i.e. the data shapes the frontend depends on — lives in
TypeScript interfaces inside `lib/api/` and `lib/auth/`. The interfaces
relevant to Sprint A:

| Concept | File | Symbol(s) |
|---|---|---|
| User | `lib/auth/types.ts` | `User` (`role`, `customRoleId?`), `UserRole = "owner" \| "admin" \| "manager" \| "member"` |
| Company | `lib/auth/types.ts` | `Company` (`plan`, `enabledFeatures?`) |
| Branding settings | `lib/api/advanced.ts:2097` | `BrandSettings`, `UpdateBrandInput`, `CustomDomainSetupResult` |
| Brand (multi-brand) | `lib/api/advanced.ts:2444` | `Brand`, `BrandStats` |
| Audit log (merchant) | `lib/api/advanced.ts:1157` | `AuditLogEntry`, `AuditLogPage`, `AuditLogQuery` |
| Audit log (admin) | `lib/api/admin.ts:572` | `AuditLog` |
| Compliance audit | `lib/api/advanced.ts:962` | `ComplianceAuditReport` |
| Role / permission | `lib/api/roles.ts` | `Role`, `Permission` (25 keys), `PermissionEntry`, `PermissionModule`, `TeamMember` |

Implication for the rest of Sprint A: any "schema" question is answered
by reading `lib/api/*` (and ultimately the backend repo), **not** by
reading a `schema.prisma` in this repo.

---

## 2. /branding page

### 2.1 Actual file location

There is **no top-level `/branding` route** in this repo. The page that
the audit doc colloquially calls "/branding" is the white-label brand
settings page at:

  `app/[locale]/(dashboard)/settings/brand/page.tsx`

URL: `/{locale}/settings/brand`. Linked from
`components/layout/DashboardShell.tsx:406`.

### 2.2 Imports

- `react` — `useEffect`, `useState`, `useCallback`
- `next/navigation` — `useParams`
- `next/link` — `Link`
- `lucide-react` — 14 icons
- `@/components/layout/DashboardShell` — `DashboardShell`
- `@/lib/auth/context` — `useAuth`
- `@/lib/api/advanced` — `getBrandSettings`, `updateBrandSettings`, `resetBrandSettings`, `setCustomDomain`, `verifyCustomDomain`, `removeCustomDomain`, types `BrandSettings`, `CustomDomainSetupResult`

### 2.3 Backend endpoints called

- `GET /api/brand`
- `PATCH /api/brand`
- `DELETE /api/brand`
- `POST /api/brand/domain`
- `POST /api/brand/domain/verify`
- `DELETE /api/brand/domain`

### 2.4 Error reproduction (server-side)

`npm run dev` was started in the background and three URLs were curled.
Server-side observations:

```
GET /en/branding         → HTTP 404 (size 21 573 bytes — Next.js 404 page)
GET /en/settings/brand   → HTTP 200 (size 127 045 bytes)
```

The dev server stdout shows **zero stack traces** for either URL:

```
○ Compiling /_not-found/page ...
 GET /en/branding 404 in 5.1s
○ Compiling /[locale]/settings/brand ...
 GET /en/settings/brand 200 in 10.1s
```

That tells us:
- `/en/branding` is a hard 404 — the route does not exist.
- `/en/settings/brand` server-renders cleanly. Any "runtime error"
  Mehmet reports must therefore appear **client-side after hydration**,
  in the path:
  1. `useAuth()` reads cached session (likely `user=null` for a fresh
     visit),
  2. `getBrandSettings()` fires `apiClient.get("/api/brand")`,
  3. axios interceptors at `lib/api/client.ts:67-188` handle 401 →
     refresh, 403 `FEATURE_DISABLED` → redirect to
     `/feature-disabled`, anything else → reject and surface in the
     page's red error banner.

### 2.5 Browser-side capture (deferred)

**To be captured by Mehmet via DevTools.** Required: (a) the exact
axios call that fails, (b) HTTP status, (c) response body, (d) any
React error overlay text. Without this, picking the right minimal fix
in Task 2 is a guess.

### 2.6 Hypotheses for the root cause (ranked, unresolved)

1. **Auth state**: visiting without a live session triggers the 401
   refresh chain in `lib/api/client.ts:120-186` and the user perceives
   "blank page → /signin" as an error.
2. **Backend unreachable / wrong shape**: production `NEXT_PUBLIC_API_URL`
   may be unset or `api.crm.zyrix.co` may be down or returning a body
   shape that doesn't match `BrandSettings`.
3. **Naming gap**: there is no `/branding` route at all. If the audit
   actually meant `/branding` (top-level shortcut), it's a 404 by
   design, not a bug to fix in code.

The page itself uses raw `tr(...)` literals, not `useTranslations`, so
a `MISSING_MESSAGE` error is unlikely to be the cause on this specific
page.

### 2.7 Proposed minimal fix (gated on Mehmet's input)

Three sub-options depending on which hypothesis is real:

- **(a) Add a top-level alias.** Create
  `app/[locale]/branding/page.tsx` that re-exports the existing
  component or `redirect()`s to `/{locale}/settings/brand`. ~5 lines.
  Picks (3) above as the cause.
- **(b) Frontend is fine; backend is the problem.** No frontend
  change. Ticket would move to the backend repo. Picks (2).
- **(c) Add an unauth-guard on the page.** Wrap with a sign-in stub
  rather than letting axios bounce the user. Picks (1).

I cannot pick (a)/(b)/(c) without the DevTools capture. This is open
question Q2 in §6.

---

## 3. /brands page

### 3.1 Actual file location

Same colloquial-naming pattern. The actual file is:

  `app/[locale]/(dashboard)/settings/brands/page.tsx`

URL: `/{locale}/settings/brands`. Linked from
`components/layout/DashboardShell.tsx:413` and
`components/layout/BrandSwitcher.tsx:210`.

### 3.2 Imports

- `react` — `useCallback`, `useEffect`, `useState`
- `next/navigation` — `useParams`
- `next/link` — `Link`
- `lucide-react` — 13 icons
- `@/components/layout/DashboardShell` — `DashboardShell`
- `@/lib/api/advanced` — `listBrands`, `getBrandStats`, `createBrand`, `updateBrand`, `setDefaultBrand`, `deleteBrand`, types `Brand`, `BrandStats`

Notable: this page does **not** import `useAuth`. So the "useAuth
outside AuthProvider" failure mode is not possible here.

### 3.3 Backend endpoints called

- `GET /api/brands`
- `GET /api/brands/stats`
- `POST /api/brands`
- `PATCH /api/brands/:id`
- `POST /api/brands/:id/default`
- `DELETE /api/brands/:id`

### 3.4 Error reproduction (server-side)

```
GET /en/brands           → HTTP 404
GET /en/settings/brands  → HTTP 200 (size 127 052 bytes)
```

Same shape as /branding: top-level URL is a 404, real route renders
cleanly server-side.

### 3.5 Browser-side capture

**To be captured by Mehmet via DevTools.**

### 3.6 Hypotheses

Same as §2.6, minus hypothesis (1) — without `useAuth`, the page
doesn't depend on a live session at render time, but its first axios
call will still hit 401 if the user isn't signed in.

### 3.7 Proposed minimal fix

Same shape as §2.7. **Likely shares a root cause with /branding.** If
Task 2 fixes /branding via option (a) or (b), Task 3's work for /brands
may collapse to the same single-line change.

---

## 4. RBAC infrastructure status

### 4.1 What's already in this repo

The audit doc says "RBAC not enabled". The code says otherwise — the
RBAC contract is fully defined on the frontend. Highlights:

**`lib/api/roles.ts`** declares:

- 25 permission keys in `PERMISSION_KEYS`, covering 8 modules:
  `customers:read|write|delete`, `deals:read|write|delete`,
  `quotes:read|write|issue`, `contracts:read|write|sign`,
  `invoices:read|issue|void`, `reports:view_own|view_all`,
  `settings:billing|users|roles|branding|integrations`,
  `admin:impersonate|audit|compliance`.
- `Role` type (`id, companyId, name, description, isSystem,
  permissions, createdAt, updatedAt`).
- `PermissionEntry` (key, module, action, label/description in en+ar+tr).
- `TeamMember` type with `customRoleId`.
- Built-in roles: `owner | admin | manager | member`.

**`lib/auth/types.ts`** adds `customRoleId?: string | null` to `User`.

### 4.2 Frontend client functions

- `fetchPermissionCatalog()` → `GET /api/permissions`
- `fetchMyPermissions()` → `GET /api/permissions/me`
- `listRoles()` / `getRole(id)` → `GET /api/roles[/{id}]`
- `createRole()` / `updateRole()` / `deleteRole()` →
  `POST/PATCH/DELETE /api/roles[/{id}]`
- `assignUserRole(userId, dto)` → `PATCH /api/users/:id/role`
- `listCompanyUsers()` → `GET /api/users`

### 4.3 Auth-context exposure (`lib/auth/context.tsx`)

- `permissions: Permission[]` (cached + auto-refetched after every
  login, signup, 2FA, Google sign-in)
- `hasPermission(p)`
- `hasAllPermissions(...ps)`
- `hasAnyPermission(...ps)`

### 4.4 UI surfaces

- `app/[locale]/(dashboard)/settings/roles/page.tsx` — full role-CRUD
  page using the permission catalog.
- `app/[locale]/(dashboard)/settings/users/page.tsx` — uses
  `hasPermission` / role helpers.
- Docs: `content/docs/{en,ar,tr}/features/security/rbac.md`.
- i18n: dedicated `role` namespace in
  `messages/{en,ar,tr}.json`.

### 4.5 Enforcement model

- HTTP-side: the axios response interceptor in
  `lib/api/client.ts:101-117` redirects to `/feature-disabled` when the
  backend returns `403 FEATURE_DISABLED`. There is **no route-level
  RBAC middleware** in `proxy.ts` — `proxy.ts` only handles locale
  routing.
- Component-side: pages that gate on permissions do so by calling
  `hasPermission(...)`/`hasAllPermissions(...)` returned from
  `useAuth()`. Adoption is partial: 11 files in this repo reference one
  of `hasPermission`, `hasAllPermissions`, `hasAnyPermission`,
  `customRoleId`, etc. (grep). Most pages do not yet gate.

### 4.6 Conclusion

**Infrastructure exists; enforcement is partial.** The audit's "RBAC
not enabled" framing is misleading. The right Sprint A output for
Task 4 is therefore a **gap analysis + completion proposal** (e.g.
"audit which pages should gate on which permission, surface a
consistent UnauthorizedView component"), not a from-scratch design.
This re-framing is open question Q4 in §6.

---

## 5. Audit Log infrastructure status

### 5.1 Models / types present

The audit log is built at three levels:

- **Merchant audit log** — `lib/api/advanced.ts:1157`:
  `AuditLogEntry`, `AuditLogPage`, `AuditLogQuery`.
- **Platform-admin audit log** — `lib/api/admin.ts:572`: `AuditLog`,
  `fetchAuditLogs(params)` → `GET /api/admin/audit-logs`.
- **Compliance audit report** — `lib/api/advanced.ts:962`:
  `ComplianceAuditReport` → `GET /api/compliance/audit-report`.

### 5.2 Frontend client functions (merchant level)

- `listAuditLogs(params)` → `GET /api/audit-logs`
- `listAuditActions()` → `GET /api/audit-logs/actions`
- `downloadAuditExport(format, params)` → `GET /api/audit-logs/{path}`
  with format `json` or `csv`, file download via blob.

### 5.3 Audit-write call sites in this repo

The frontend doesn't write audit entries — that's the backend's job.
The frontend has only read + filter + export. No "write audit log"
function appears in `lib/api/`.

### 5.4 UI surfaces

- `app/[locale]/(dashboard)/settings/audit/page.tsx` — Settings → Audit
  log: filter by action type + date window, paginated, JSON/CSV export.
- `app/[locale]/admin/audit/page.tsx` → renders
  `components/admin/AdminAuditView.tsx` inside `AdminShell` (platform
  admin console).
- `app/[locale]/(dashboard)/settings/data-retention/page.tsx`
  references audit logs.
- Docs: `content/docs/{en,ar,tr}/features/security/audit-log.md`.
- i18n: `audit` keys in `messages/{en,ar,tr}.json`, plus the
  per-action localised labels inside the audit page itself.

### 5.5 Action types known

Recognised inside `app/[locale]/(dashboard)/settings/audit/page.tsx`:
`user.login`, `user.login_failed`, `user.logout`,
`user.2fa_challenge_failed`, `2fa.*`, `*.create` / `.add`,
`*.delete` / `.remove`, `*.update` / `.edit`, `*.invite`, plus
password / token / key events. Unknown actions fall back to a generic
`History` icon — so the UI is open-ended.

### 5.6 Conclusion

**Infrastructure exists; population is unverified.** Same shape as
RBAC. The unknown is whether the backend is **actually writing** audit
log rows on every important action — that's a question for the backend
repo, not solvable from here. Task 5's Sprint A output should also be
a **gap-analysis + write-points proposal**, not a from-scratch model
design.

---

## 6. Open questions for Mehmet (must be resolved before Task 2)

1. **Naming.** The audit doc says "/branding" and "/brands" have
   runtime errors, but those URLs are 404 (don't exist in `app/`). The
   actual pages are at `/settings/brand` (singular) and `/settings/brands`.
   Confirm whether Sprint A's target is:
     - the existing pages `/settings/brand` + `/settings/brands`, or
     - new top-level `/branding` + `/brands` routes that should be
       created (e.g. as redirects), or
     - both.

2. **Real client-side error capture.** My curl reproduction shows
   HTTP 200 on `/settings/brand` and `/settings/brands` with no SSR
   error. Open DevTools on `crm.zyrix.co` for both pages and paste
   back: (a) the failing axios request URL, (b) status code,
   (c) response body, (d) any React error overlay text. Without that,
   I cannot pick the correct minimal fix in Task 2.

3. **Backend availability.** Is `https://api.crm.zyrix.co` deployed
   and serving `/api/brand` and `/api/brands` in production right now?
   If the backend is down or unconfigured, every dashboard page will
   appear "broken" and the fix isn't in this repo.

4. **Re-frame Tasks 4–5.** The frontend RBAC + audit-log
   infrastructure is mostly built. Confirm that Task 4 (`docs/rbac-proposal.md`)
   and Task 5 (`docs/audit-log-proposal.md`) should be **gap-analysis
   + completion proposals** ("here is what exists; here is what's
   missing; here is the plan to finish") rather than from-scratch
   designs. If yes, the proposals will list (a) ungated pages that
   should gate, (b) likely missing audit write-points in the backend
   (only inferable, not provable from this repo), (c) UX gaps such as
   no `Unauthorized` component.

5. **Color-scheme conflict (out-of-scope flag).** `PROJECT_STATUS.md`
   mandates Sky Blue `#0EA5E9` and forbids dark/purple, while
   `MASTER_GUIDE.md` §5 says Sprint B should migrate to dark navy
   `#112044` + neon blue. Sprint A doesn't act on this; flagging now
   so it's resolved before Sprint B starts.

---

## 7. Inventory of files I read during discovery

- `prisma/schema.prisma` — does not exist (recorded as a finding in §1)
- `package.json`
- `.env.local.example`
- `proxy.ts`
- `app/[locale]/layout.tsx`
- `app/[locale]/(dashboard)/settings/page.tsx`
- `app/[locale]/(dashboard)/settings/brand/page.tsx`
- `app/[locale]/(dashboard)/settings/brands/page.tsx`
- `app/[locale]/(dashboard)/settings/audit/page.tsx` (head only)
- `app/[locale]/(dashboard)/settings/roles/page.tsx` (head only)
- `app/[locale]/admin/audit/page.tsx`
- `lib/api/advanced.ts` — slices 2080–2200 (brand settings) and
  2435–2545 (multi-brand) only; full file is 30 k tokens
- `lib/api/roles.ts`
- `lib/api/client.ts`
- `lib/auth/context.tsx`
- `lib/auth/types.ts`

Greps used: `/branding|/brand|/brands` references, `rbac|hasPermission|
hasAllPermissions|hasAnyPermission|customRoleId|can(|cannot(`,
`auditLog|audit_log|audit-log|AuditLog`, branding/audit/role keys in
`messages/`.

## 8. Inventory of files I deliberately did NOT touch

- All files under `lib/ai/`, `components/ai/`,
  `components/dashboard/`, `components/pipeline/`,
  `components/messaging/`, `components/deals/`.
- `prisma/schema.prisma` (does not exist).
- `next.config.ts`, `package.json`.
- All `messages/*.json` (read-only greps only — no edits).
- All existing source files were read-only.

---

**Single new file produced by Task 1:** this file (`docs/sprint-a-discovery.md`).
Nothing else was added, edited, or staged. `git status` and `git diff`
output follows in chat after this report is saved.

---

## 9. Follow-up after DevTools console capture (2026-04-25, post Commit Point 1)

After Commit Point 1 (`329a3f0`), Mehmet captured the actual
client-side errors from `crm.zyrix.co` via DevTools. The findings:

### 9.1 What was captured

**`/{locale}/settings/brand`** (the page colloquially called "/branding"):

- `GET https://api.crm.zyrix.co/api/brand` → **500 Internal Server Error**
- `GET https://api.crm.zyrix.co/api/brands` → **500 Internal Server Error**
- UI displays the page's red error banner: "An unexpected error occurred".

**`/{locale}/settings/brands`** (the page colloquially called "/brands"):

- `GET https://api.crm.zyrix.co/api/brands/stats` → **500 Internal Server Error**
- `GET https://api.crm.zyrix.co/api/brands` → **500 Internal Server Error** (twice)
- UI displays the page's red error banner: "An unexpected error occurred".

### 9.2 Resolution of the open questions in §6

- **Q1 (naming):** RESOLVED — Mehmet chose redirect-only. The Sprint A
  fix adds `/[locale]/branding → /[locale]/settings/brand` and
  `/[locale]/brands → /[locale]/settings/brands` as 307 redirects. No
  new pages.
- **Q2 (DevTools capture):** RESOLVED — see §9.1.
- **Q3 (backend availability):** RESOLVED — backend at
  `https://api.crm.zyrix.co` IS deployed and reachable, but the brand
  endpoints (`/api/brand`, `/api/brands`, `/api/brands/stats`) all
  return HTTP 500. Backend is up; these endpoints are erroring.
- **Q4 (re-frame Tasks 4–5):** APPROVED — `docs/rbac-proposal.md` and
  `docs/audit-log-proposal.md` will be gap-analysis + completion
  proposals, not from-scratch designs.
- **Q5 (color conflict):** still out of scope for Sprint A; deferred
  to Sprint B.

### 9.3 Root cause and re-scope

The frontend code at
`app/[locale]/(dashboard)/settings/brand/page.tsx` and
`app/[locale]/(dashboard)/settings/brands/page.tsx` is functioning
correctly: it calls the backend, the backend returns 500, the page
catches the error in its `try/catch`, sets `setError`, and renders the
red banner with the localised "An unexpected error occurred" string.

This **confirms hypothesis (2)** from §2.6 — backend unreachable /
wrong shape — and **rules out (1) and (3)**. Therefore Sprint A v2
Tasks 2 and 3 cannot fix the user-visible "page broken" experience by
changing **this** repo's frontend code. The backend 500s live in the
separate `zyrix-crm-backend` repository (Railway-hosted, per
`PROJECT_STATUS.md`) and are explicitly **out of scope for Sprint A**.

### 9.4 Sprint A re-scoped fix

Per Mehmet's decision after seeing the captured errors:

- **In scope for Sprint A (this repo):** add audit-doc shortcut routes
  `/[locale]/branding` → `/[locale]/settings/brand` and
  `/[locale]/brands` → `/[locale]/settings/brands` as 307 redirects.
  This resolves the literal "404 on /branding and /brands" finding
  from §2.4 and §3.4 — those URLs now resolve to the real pages
  instead of returning a 404. Type-check passes; six locale × route
  combinations have been verified locally to redirect with HTTP 307
  followed by HTTP 200 on the canonical settings URL.
- **Out of scope for Sprint A:** the backend 500 errors. These need a
  separate ticket against `zyrix-crm-backend`. Likely investigation
  starting points (NOT acted on from this repo): missing
  Authorization-header handling, missing DB tables/rows for brand
  records, or a recent deployment regression. None of this is provable
  from the frontend repo alone.

### 9.5 Implication for the Sprint A final report (Task 8)

The Sprint A final report should record honestly:

- **Frontend:** redirect routes added, type-check passes, both
  audit-doc URLs now resolve cleanly to the canonical settings pages.
- **User-visible "page errors":** NOT resolved by Sprint A. They are
  backend 500s. A follow-up ticket against `zyrix-crm-backend` is the
  prerequisite for declaring the dashboard branding pages production-
  ready. Until that ticket lands, visiting either `/branding` or
  `/brands` will redirect successfully but the destination page will
  still display the red error banner.

### 9.6 Tooling note (separate observation)

While running the Sprint A v2 verification gate, two pre-existing
tooling issues surfaced that are **not** introduced by Sprint A:

- `npm run lint` is broken because Next.js 16 removed the `next lint`
  subcommand; the script tries to lint a non-existent `lint/`
  directory.
- `npx eslint .` is broken because ESLint 9 requires the new flat-config
  (`eslint.config.js`) and this repo has no ESLint config file at all.

`npm run type-check` runs cleanly and was used as the verification
gate for Sprint A's redirect changes. Restoring lint should be its
own small cleanup ticket; doing it inside Sprint A would violate the
"don't improve code outside the assigned task" rule.
