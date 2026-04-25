# Backend: `/api/brand`, `/api/brands`, `/api/brands/stats` return HTTP 500

> **This file is a draft.** It lives in the frontend repo `zyrix-crm` as
> a self-contained brief, ready to be copy-pasted into the backend repo
> `zyrix-crm-backend` as a GitHub issue (or equivalent). When that issue
> is opened, link it back from `docs/sprint-a-final-report.md` §9.1 in
> the frontend repo so the loop is closed.

---

## Metadata

| | |
|---|---|
| **Status** | Open (drafted 2026-04-25) |
| **Severity** | High — blocks Sprint A user-visible completion (`/settings/brand` and `/settings/brands` pages on production) |
| **Backend repo** | `zyrix-crm-backend` (Railway-hosted) |
| **Frontend repo** | `zyrix-crm` |
| **Production frontend** | https://crm.zyrix.co |
| **Production backend** | https://api.crm.zyrix.co |
| **Filed by** | Drafted from frontend repo after Sprint A discovery |
| **First observed** | 2026-04-25 via browser DevTools on production |
| **Related FE work** | Sprint A redirect routes (commit `d8ba0f7` in `zyrix-crm`) |

---

## 1. Summary

Three backend `GET` endpoints return **HTTP 500 Internal Server Error**
in production, blocking the white-label branding settings page and the
multi-brand CRUD page from loading data. The frontend pages themselves
are functioning correctly — they render the localised "An unexpected
error occurred" banner that is designed to fire on backend errors.

This is the only thing currently preventing users on `crm.zyrix.co`
from successfully using `/settings/brand` and `/settings/brands` after
Sprint A's redirect fixes landed.

---

## 2. Affected endpoints

All on production backend `https://api.crm.zyrix.co`.

| Method | Path | Calling FE page(s) |
|---|---|---|
| `GET` | `/api/brand` | `/{locale}/settings/brand` (white-label settings) |
| `GET` | `/api/brands` | `/{locale}/settings/brand` AND `/{locale}/settings/brands` |
| `GET` | `/api/brands/stats` | `/{locale}/settings/brands` |

All three return `500 Internal Server Error` for an authenticated
merchant account.

Sibling endpoints under the same prefixes were **not** verified to be
broken in this round; they may also be affected:

- `PATCH /api/brand`, `DELETE /api/brand`
- `POST /api/brand/domain`, `POST /api/brand/domain/verify`, `DELETE /api/brand/domain`
- `POST /api/brands`, `PATCH /api/brands/:id`, `POST /api/brands/:id/default`, `DELETE /api/brands/:id`

If the root cause is shared (e.g. a missing migration, missing
controller registration), these will probably fail the same way and
should be fixed in the same PR.

---

## 3. Reproduction

1. Sign in to `https://crm.zyrix.co` with a valid merchant account.
2. Open browser DevTools → Network tab.
3. Navigate to `/en/settings/brand`. Observe `GET /api/brand` and
   `GET /api/brands` requests — both return 500.
4. Navigate to `/en/settings/brands`. Observe `GET /api/brands/stats`
   and `GET /api/brands` requests (the latter fires twice on this page)
   — both return 500.
5. Tested on `en`, `ar`, `tr` locales — locale doesn't affect the
   failure (route prefix only).

DevTools capture by Mehmet on 2026-04-25 confirmed all 5 distinct
requests fail with status 500.

---

## 4. Expected behaviour

The frontend's TypeScript types describe the contract that the backend
needs to fulfil. References are to file paths in the frontend repo
(`zyrix-crm`).

### 4.1 `GET /api/brand`

Returns `ApiSuccess<BrandSettings | null>`. Source:
`lib/api/advanced.ts:2097-2129`.

```ts
{
  success: true,
  data: BrandSettings | null    // null when no settings row exists for this company
}

interface BrandSettings {
  id: string;
  companyId: string;
  displayName: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  emailFromName: string | null;
  emailFromAddress: string | null;
  customDomain: string | null;
  customDomainVerifiedAt: string | null;
  customDomainVerificationToken: string | null;
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}
```

### 4.2 `GET /api/brands`

Returns `ApiSuccess<Brand[]>`. Accepts optional query
`?includeArchived=true|false` (defaults to false). Source:
`lib/api/advanced.ts:2444-2472`.

```ts
{
  success: true,
  data: Brand[]                 // [] when no brands exist
}

interface Brand {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string | null;
  description: string | null;
  isDefault: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 4.3 `GET /api/brands/stats`

Returns `ApiSuccess<BrandStats[]>`. Source:
`lib/api/advanced.ts:2458-2479`.

```ts
{
  success: true,
  data: BrandStats[]            // [] when no brand-tagged rows exist
}

interface BrandStats {
  brandId: string | null;       // null entry represents un-tagged rows
  customerCount: number;
  dealCount: number;
  activityCount: number;
}
```

---

## 5. Frontend behaviour on 500

The frontend's axios client at `lib/api/client.ts:89-188` (frontend
repo) handles error responses as follows:

- `401 Unauthorized` → triggers refresh-token retry flow.
- `403 FEATURE_DISABLED` → redirects the browser to
  `/feature-disabled?feature={featureKey}` (a friendly explainer page).
- **Anything else (including 500)** → axios rejects; the calling page
  catches the error, runs `extractErrorMessage(e)` (`lib/errors.ts`),
  and surfaces the result via `setError(...)`. The page's UI then
  renders a red banner with the localised string.

So on the live site today the user sees:
- Page chrome and shell render normally.
- A red banner across the top with text **"An unexpected error
  occurred"** (en), **"حدث خطأ غير متوقع"** (ar), or **"Beklenmeyen bir
  hata oluştu"** (tr).
- All form fields are empty / disabled, action buttons do nothing
  useful.

This is the expected error path from the FE side. It is not a frontend
bug.

---

## 6. User impact

- Sprint A v2 added redirect routes
  `/[locale]/branding → /[locale]/settings/brand` and
  `/[locale]/brands → /[locale]/settings/brands` (frontend commit
  `d8ba0f7`). The redirects work on production and have been verified
  live.
- The audit report's claim that "`/branding` and `/brands` have
  errors" remains **true at the user-experience level** until this
  ticket is resolved, even though the routing layer is now correct.
- White-label customers currently cannot view or edit their branding
  settings. Custom domain setup also blocked.
- Multi-brand merchants currently cannot manage their brand list.

---

## 7. Likely investigation areas (from Sprint A discovery)

These are the three areas flagged in `docs/sprint-a-discovery.md` §9
and `docs/sprint-a-final-report.md` §9.1 as likely root causes. Listed
in the same order as the discovery docs.

1. **Authorization header handling.** The FE always sets
   `Authorization: Bearer <accessToken>` via
   `lib/api/client.ts:67-76`. Confirm the BE middleware is parsing
   that header correctly and not throwing inside the auth pipeline.
   If parsing throws, every authenticated route would return 500 —
   easy to test by hitting a known-good endpoint like
   `/api/permissions/me` (used by the FE auth context after every
   login).

2. **DB tables / rows for brand records.** Confirm the `Brand` and
   `BrandSettings` (or whatever the BE models them as) tables and
   columns exist on the production Railway database and match the
   shapes in §4. If a recent migration is missing on prod, this is a
   likely cause.

3. **Recent deployment regression.** Compare the timestamp of the
   most recent `zyrix-crm-backend` deploy on Railway against the
   first observed 500 (2026-04-25). If they're close, scan the deploy
   diff for anything touching `/api/brand*` or its dependencies.

---

## 8. Acceptance criteria

The ticket is resolved when **all** of these are true:

- [ ] All three endpoints return `200 OK` on production
      (`https://api.crm.zyrix.co`) for an authenticated merchant.
- [ ] A merchant account with **no brand records** receives:
  - `GET /api/brand` → `200` with body `{ success: true, data: null }`
  - `GET /api/brands` → `200` with body `{ success: true, data: [] }`
  - `GET /api/brands/stats` → `200` with body `{ success: true, data: [] }`
- [ ] A merchant account with **populated brand records** receives
      shape-conforming arrays/objects per §4.
- [ ] `/en/settings/brand` and `/en/settings/brands` on
      `crm.zyrix.co` render without showing the red "An unexpected
      error occurred" banner.
- [ ] Verified by Mehmet via browser DevTools after the BE fix
      deploys to production.
- [ ] If sibling endpoints listed in §2 turn out to share the same
      root cause, they are fixed in the same PR.

---

## 9. References

### Frontend repo (`zyrix-crm`)

- `docs/sprint-a-discovery.md` — §9.1 (the original DevTools capture
  that triggered this ticket)
- `docs/sprint-a-final-report.md` — §3.3, §9.1
- `docs/audit-log-proposal.md` — §3.7 (related backend
  write-coverage gap, separate but adjacent)
- `lib/api/client.ts` — axios instance, error handling,
  Authorization header behaviour
- `lib/api/advanced.ts` — TypeScript type contracts referenced in §4
- `lib/auth/types.ts` — `ApiSuccess` / `ApiError` envelope contracts
- Sprint A redirect commit on `main`: `d8ba0f7`

### Backend repo (`zyrix-crm-backend`)

- The fix lives here. No specific files referenced — the BE structure
  is unknown to the frontend repo.

---

## 10. Notes for the BE engineer

- This ticket is **not** about the redirect route work — the routing
  layer is solved. It is purely about the GET endpoints returning the
  expected shapes.
- The frontend deliberately does **not** write audit log entries
  itself (audit writes are the BE's responsibility). This ticket is
  separate from the audit log write-coverage survey suggested in
  `docs/audit-log-proposal.md` §3.7. The two can be worked in either
  order.
- Once this ticket is closed, the FE side requires no follow-up work
  — the existing pages will simply start showing data.
