# Audit Log Completion Proposal

**Date:** 2026-04-25
**Author:** Claude (read-only proposal — no code changes in this doc)
**Sprint:** A v2, Task 5
**Predecessor:** `docs/sprint-a-discovery.md` §5 (commit `329a3f0`,
follow-up `f00685f`); `docs/rbac-proposal.md` (commit `85e0bff`).
**Reframe basis:** Open question Q4 in the discovery report —
approved by Mehmet 2026-04-25.

---

## 0. Status at a glance

The audit log is in an unusual state for a Zyrix subsystem: **the
frontend is over-built relative to what the backend currently
populates**. The merchant viewer is forensic-quality (before/after
snapshots, IP, user-agent, session, metadata, expandable details,
JSON/CSV export, paginated filtering). What we don't know without
opening the backend repo is **whether the backend writes an audit
entry for every important domain action** — only auth/2FA actions
are explicitly catalogued on the FE side.

| Layer | Status |
|---|---|
| Merchant `AuditLogEntry` types (forensic shape) | ✅ Complete (`lib/api/advanced.ts:1157-1190`) |
| Merchant client (`listAuditLogs`, `listAuditActions`, `downloadAuditExport`) | ✅ Complete (`lib/api/advanced.ts:1192-1245`) |
| Merchant viewer UI (filter, paginate, detail expand, JSON/CSV export) | ✅ Complete (`app/[locale]/(dashboard)/settings/audit/page.tsx`, 699 lines) |
| Platform-admin `AuditLog` types + `fetchAuditLogs` | ✅ Complete (`lib/api/admin.ts:572-598`) |
| Platform-admin viewer (`AdminAuditView` with 14 admin action types) | ✅ Complete (`components/admin/AdminAuditView.tsx`) |
| Compliance audit report API + type | ✅ Complete (`lib/api/advanced.ts:962`) |
| Data-retention infrastructure (per-entity windows incl. `audit_log`) | ✅ Complete (`app/[locale]/(dashboard)/settings/data-retention/page.tsx`) |
| Plan-gating (audit_log is a `FEATURE` enum entry) | ✅ Complete via BE `FEATURE_DISABLED` 403 |
| Marketing/help docs (Business+ feature) | ✅ Complete (`content/docs/{en,ar,tr}/features/security/audit-log.md`) |
| **Permission gate on `/settings/audit`** | ❌ Missing — anyone in workspace can view |
| **Permission gate on `/settings/data-retention`** | ❌ Missing |
| **Localised labels for domain actions (CRUD)** | ❌ Missing — only 9 auth/2FA labels |
| **"My events only" view for non-admin users** | ❌ Missing |
| **Retention banner on the audit log page itself** | ❌ Missing |
| **Per-record audit history link from customer/deal pages** | ❌ Missing |
| **Backend write-population coverage on domain actions** | ❓ Unknown from this repo (BE repo separate) |

Two of the ❌ rows (`/settings/audit` and `/settings/data-retention`
gates) are already covered by §3.3 of the RBAC proposal. They are
re-listed here so this document stands alone, but should be
implemented under the RBAC sprint to avoid double-touching the same
files.

---

## 1. Inventory of what already exists

### 1.1 Merchant audit log — data shape (`lib/api/advanced.ts:1157-1190`)

```ts
interface AuditLogEntry {
  id: string;
  userId: string | null;
  companyId: string | null;
  action: string;                                      // e.g. "user.login", "customer.update"
  entityType: string | null;                           // e.g. "Customer", "Deal"
  entityId: string | null;
  changes: Record<string, { before; after }> | null;   // field-level diff
  metadata: Record<string, unknown> | null;            // free-form context
  before: Record<string, unknown> | null;              // full snapshot
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  sessionId: string | null;
  createdAt: string;
  user: { id; fullName; email } | null;
}
interface AuditLogPage  { items: AuditLogEntry[]; pagination: { total; limit; offset }; }
interface AuditLogQuery { limit?, offset?, action?, actionPrefix?,
                          entityType?, entityId?, userId?, since?, until? }
```

This is **forensic-grade** — the shape covers everything a compliance
auditor would ask for. No fields are missing.

### 1.2 Merchant client functions (`lib/api/advanced.ts:1192-1245`)

| Function | Backend endpoint | Purpose |
|---|---|---|
| `listAuditLogs(query)` | `GET /api/audit-logs` | Paginated list with filters |
| `listAuditActions()` | `GET /api/audit-logs/actions` | Distinct action types (populates filter dropdown) |
| `downloadAuditExport("csv"\|"json", filters)` | `GET /api/audit-logs/export.{csv,json}` | Triggers browser download via blob |

### 1.3 Merchant viewer UI (`app/[locale]/(dashboard)/settings/audit/page.tsx`)

Single file, 699 lines, all in one component tree. Features observed:

- **Filter bar:** action, user, entity type, since, until — all
  re-fetch on change with `setOffset(0)`.
- **Pagination:** 50/page with prev/next; total count surfaced.
- **JSON + CSV export:** uses `downloadAuditExport`; drops pagination
  params so export covers the full filter window (BE caps at 10k rows
  per the inline comment).
- **Action humaniser** (`humanizeAction`, lines 71-114): hard-coded
  9-action label catalogue (`user.login`, `user.login_failed`,
  `user.2fa_challenge_failed`, `user.logout`, plus 4 `2fa.*`
  variants). Unknown actions fall through to the raw string.
- **Action icon mapper** (`iconForAction`, lines 53-69): pattern-based
  icon/colour per action class — covers create/add/delete/remove/
  update/edit/invite/password/token/key + auth + 2FA.
- **Expandable detail row** (`EventRow`, lines 495-697): shows IP, UA,
  session ID, metadata as JSON, field-level `changes` (red − before /
  green + after), full `before`/`after` snapshots in side-by-side
  panes.
- **Empty-state UI** with localised "no events yet" copy.
- **No permission gate.**

### 1.4 Platform-admin audit log (`lib/api/admin.ts:572-598`, `components/admin/AdminAuditView.tsx`)

Simpler, separate axis:

- Different axios client (`adminApi`) — admin auth flow lives in its
  own context.
- Endpoint: `GET /api/admin/audit-logs?page&limit&action&companyId&userId`.
- `AuditLog` type is **simpler than the merchant shape**: no
  separate `before`/`after`, no `metadata`, no `sessionId` — just
  `changes`, IP, UA, plus `user` and `company` references.
- 14 known admin action types in `AdminAuditView.tsx:24-39`:

  ```
  admin.company.update | suspend | resume | delete | impersonate
  admin.user.update | disable | enable | force_reset_password
  admin.plan.update
  admin.plan_override.create | delete
  admin.bootstrap
  admin.login
  ```

This separation is intentional — platform admins look across many
tenants, so they don't need per-record forensic detail. Customers
look within one tenant and need the full forensic shape. Don't merge
these.

### 1.5 Compliance audit report (`lib/api/advanced.ts:962-980`)

Separate from the audit log — produces a high-level report
(`ComplianceAuditReport`) suitable for sharing with external
auditors. Endpoint: `GET /api/compliance/audit-report`. UI not seen
in this discovery — assume it lives near `/settings/data-retention`
or `/settings/compliance`.

### 1.6 Data-retention infrastructure (`app/[locale]/(dashboard)/settings/data-retention/page.tsx`)

Separate page for retention windows. Covers four entity types,
including `audit_log`:

| Entity | Description |
|---|---|
| `audit_log` | Who did what, when, and from where |
| `activity` | Customer interactions, calls, notes, meetings |
| `session_event` | Sign-ins, idle lockouts, session expirations |
| `message` | Internal chat and WhatsApp message history |

Presets: 30 / 90 / 180 / 365 / 730 / 2555 days, plus "Forever" (`days: 0`).
Backend: `getRetentionStatus`, `upsertRetentionPolicy`. The audit log
is therefore **already pruned per company policy** — no FE work
needed for retention itself.

### 1.7 Plan-gating

`ALL_FEATURES` in `lib/api/admin.ts:604-636` includes `"audit_log"`.
This is the BE feature-flag mechanism: when a Free/Starter merchant
hits `/api/audit-logs`, the BE returns `403 FEATURE_DISABLED` and the
existing axios interceptor at `lib/api/client.ts:101-117` redirects
the user to `/feature-disabled?feature=audit_log` (the friendly page
in `app/[locale]/(dashboard)/feature-disabled/page.tsx`).

Marketing copy in `audit-log.md` says `plans: ["business",
"enterprise"]` — consistent with the FE flow above.

---

## 2. Recommended approach

### 2.1 Headline

**Same shape as the RBAC proposal: extend, don't rebuild.** The
merchant viewer is already production-quality. The completion work
is mostly:

1. Lock down access (RBAC gate),
2. Localise more actions (label catalogue),
3. Surface contextual links from domain pages,
4. Verify and (likely) extend the BE write-population — though this
   work belongs in the **backend repo**, not here.

No new infrastructure, no new abstraction, no new packages.

### 2.2 Why not "build new"

- The merchant `AuditLogEntry` shape is already a near-superset of
  what compliance frameworks (SOC 2, ISO 27001, ISCA/SOCPA per
  marketing copy) ask for. Replacing it would invalidate every row
  the BE has already written.
- The viewer UI took ~700 lines to get right (filtering, pagination,
  expansion, before/after rendering, RTL handling, three-language
  labels). Throwing it out is wasteful.

### 2.3 Why not split merchant + admin types

They serve different audiences (single-tenant forensic vs
multi-tenant overview) and live in separate axios clients. Merging
would couple unrelated UIs and force one of them to lose detail.

### 2.4 Why not centralise audit-write helpers in the FE

Audit writes happen on the **backend**. The FE never writes an
audit entry. Adding a "client-side audit emitter" would create
trust issues (a user could fake events) and duplicate BE work. Out
of scope.

---

## 3. Required changes (drafted, NOT applied)

### 3.1 Permission gate `/settings/audit` (RBAC sprint, not this one)

Already covered by RBAC proposal §3.3. Recommended pattern: full deny
via `<Unauthorized />` for users without `admin:audit`, since the
audit log is a security tool — read-only mode would expose data the
user has no business seeing. Drafted there; do not duplicate work.

### 3.2 Permission gate `/settings/data-retention` (RBAC sprint, not this one)

Same — covered by RBAC proposal §3.3 for `admin:compliance`.

### 3.3 Expand `humanizeAction` label catalogue

Today (`page.tsx:71-114`) only 9 auth/2FA actions are localised.
Domain actions fall through to the raw string `customer.create`.

**Proposed additions** (drafted, NOT applied — list ~30 actions
covering the standard CRUD vocabulary observed in
`iconForAction`'s patterns):

```ts
// Customers
"customer.create"  → en: "Created customer",   ar: "...", tr: "..."
"customer.update"  → en: "Updated customer",   ...
"customer.delete"  → en: "Deleted customer",   ...
"customer.import"  → en: "Imported customers", ...
"customer.export"  → en: "Exported customers", ...
// Deals
"deal.create" / "deal.update" / "deal.delete" / "deal.stage_change"
// Quotes
"quote.create" / "quote.update" / "quote.issue" / "quote.void"
// Contracts
"contract.create" / "contract.update" / "contract.sign"
// Invoices
"invoice.create" / "invoice.issue" / "invoice.void" / "invoice.pay"
// Settings / admin
"role.create" / "role.update" / "role.delete"
"user.invite" / "user.role_change"
"brand.update" / "brand.reset" / "brand.domain_change"
"api_key.create" / "api_key.revoke"
// Bulk
"bulk.export" / "bulk.update" / "bulk.delete"
```

Three new translation strings per action, ×3 locales = ~270 strings
total. Mechanical work. Could be split: implement as a shared
`AUDIT_ACTION_LABELS` map next to the existing one, then move
mechanically into `messages/{en,ar,tr}.json` as a flat namespace.

**Open question:** keep labels inline in TS (current pattern) or move
to `messages/*.json` for translator workflow consistency? The current
inline approach trades one global file for type safety on action
strings. Defer to §7.

### 3.4 "My events only" view for non-admin users

When `admin:audit` is denied, instead of `<Unauthorized />`, show a
filtered view limited to `userId === me.id`. Compliance frameworks
(GDPR Art. 15, "right of access") frequently require users to see
their own audit trail.

**Draft:**

```tsx
const { user, hasPermission } = useAuth();
const canSeeAll = hasPermission("admin:audit");
const effectiveQuery = canSeeAll ? currentQuery : { ...currentQuery, userId: user?.id };
```

UX: hide the "User" filter dropdown in the non-admin variant; show a
banner "Showing only your events. Ask an admin for the full log."

This contradicts §3.1's "full deny" pattern. **Pick one.** The two
options are mutually exclusive — see §7.

### 3.5 Retention banner on the audit log page

Currently the page doesn't tell the user that events older than X
days are pruned per the data-retention policy. Discoverability gap —
users may panic-export thinking the page lost data when in fact it's
expired by policy.

**Draft:** small chip near the header, e.g.:

```
Audit log    [Events kept for 365 days]    [CSV] [JSON] [Filter]
```

with a tooltip linking to `/settings/data-retention`. Reads
`getRetentionStatus()` once on mount.

### 3.6 Per-record audit history link from domain pages

Customer/Deal/Quote/Contract/Invoice detail pages should have an
"Audit history" button that opens the audit log filtered by
`entityType={Customer|Deal|...}&entityId={id}`. Today this filter
combination requires manually setting two filter dropdowns; UX gap.

**Draft URL pattern:**

```
/{locale}/settings/audit?entityType=Customer&entityId={uuid}
```

The merchant viewer already supports both filters in its
`AuditLogQuery`. Adds <50 LOC of `<Link>` buttons across detail
pages — but those pages live under areas that include
`components/dashboard/` etc. that Sprint A doesn't touch. Defer the
component-side wiring to its own sprint; today just decide whether
the audit page should accept query-string-driven filter
initialisation (it doesn't yet — initial filter state is empty in
`page.tsx:131-137`).

### 3.7 Backend write-population gap (out of frontend scope)

This is the **largest unknown**. The FE can recognise these action
prefixes (per `iconForAction`):

- Auth/2FA: 9 explicit labels
- CRUD: anything matching `*.create`, `*.add`, `*.delete`, `*.remove`,
  `*.update`, `*.edit`, `*.invite`
- Security-sensitive: anything containing `password`, `token`, `key`

But **whether the BE actually emits all of these** is unknown. If the
BE only writes auth events today, the audit page will look mostly
empty in production. This is the biggest risk to the marketing claim
"Complete forensic record of every action" in `audit-log.md`.

Action items belong in the **`zyrix-crm-backend` repo**, not here.
The proposed BE-side audit including (but not limited to):

| Domain | Likely write-points |
|---|---|
| Auth | login, logout, login_failed, 2fa.* (already done — only 9 labelled) |
| Users | invite, accept invite, password reset, role change, deactivate, MFA change |
| Customers | create, update, delete, import, export, merge, restore |
| Deals | create, update, delete, stage change, won, lost |
| Quotes / Contracts / Invoices | create, update, issue, void, sign, pay |
| Settings | branding, integrations, billing, custom-fields changes |
| API keys | create, revoke, regenerate |
| Bulk ops | export, update, delete |
| Compliance | data export, data deletion (GDPR), retention policy change |

**Verification step (when BE work starts):** snapshot
`GET /api/audit-logs/actions` against a freshly-seeded production
tenant; if it returns only auth-prefixed actions, BE write-coverage
is the ticket.

---

## 4. Estimated commit count

Splitting "things this repo can do alone" from "things that need BE
coordination":

### 4.1 FE-only work (this repo)

| # | Commit | Files | Approx LOC |
|---|---|---|---|
| 1 | `feat(audit): expand humanizeAction with domain action labels` | 1 (audit page) or 4 (page + en/ar/tr) | ~150 if inline / ~250 if i18n-moved |
| 2 | `feat(audit): retention banner linking to data-retention` | 1 (audit page) | ~25 |
| 3 | `feat(audit): seed query state from URL params` (enables §3.6) | 1 (audit page) | ~15 |
| 4 | `feat(audit): per-record "audit history" link from customer detail` | 1 (customer page) | ~20 |
| 5 | `feat(audit): per-record link from deal detail` | 1 | ~20 |
| 6 | `feat(audit): per-record link from quote/contract/invoice` | 3 | ~50 |
| 7 | `feat(audit): "my events only" view for non-admin users` | 1 (audit page) | ~30 |

**FE-only total:** 7 commits, ~310 LOC, no new packages.

Commits 4-6 touch domain detail pages that Sprint A is not allowed to
modify — deferring those to their own sprint is fine; the audit log
remains fully usable without them.

### 4.2 RBAC-shared work

Permission gates on `/settings/audit` and `/settings/data-retention`
should land under the RBAC sprint to avoid double-touching the same
files. Counted under §4 of the RBAC proposal.

### 4.3 Backend work (separate repo, separate sprint)

Out of scope here. Estimate when BE survey lands.

---

## 5. Risks and breaking changes

### 5.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| BE write-coverage is much lower than the FE assumes | High (per §3.7) | High — audit page looks empty in prod for non-auth events | BE survey is the prerequisite; don't ship FE labels for actions BE never emits |
| `humanizeAction` label drift from BE-emitted action strings | Med — if BE renames an action, FE label silently no-op | Low (just falls through to raw string) | Add a CI check that diffs FE label keys against BE-exported action vocabulary |
| Retention banner shows wrong number when BE retention policy changes mid-session | Low | Low | Re-fetch `getRetentionStatus` on visibility-change |
| "My events only" view hides legitimately-needed events for users without `admin:audit` | Med | Med | Keep §3.4's banner explicit: "Ask an admin for the full log" |
| Performance: `listAuditLogs` returning >5k rows for a busy tenant | Low (already paginates 50/page; 10k cap on export) | Low | Existing limits are sane |
| GDPR/right-of-access compliance not met because §3.4 not implemented | Med | Med (legal exposure) | Either implement §3.4 or document an offline export channel |

### 5.2 Breaking changes

**None for end users.** All proposed FE changes are additive (more
labels, banners, links) or strictly access-control (gates from RBAC
sprint, which only hide affordances the user couldn't use anyway).

**One subtle compat note:** if §3.4 is chosen instead of full-deny,
the URL `/settings/audit` would resolve for everyone but render
different data. Make sure URL-shareable filter state from §3.3
includes a hint that the receiver may see less than the sender did.

---

## 6. What this proposal does NOT cover

- **No backend work.** `zyrix-crm-backend` audit emission is out of
  scope. Verification of write-coverage belongs in a BE survey.
- **No new audit shape fields.** The existing `AuditLogEntry` is
  sufficient; adding e.g. `geo` requires BE work.
- **No real-time / streaming audit.** SSE/websocket audit
  subscription is a future feature, not an audit-completeness gap.
- **No anomaly detection.** Marketing copy mentions "Insider threat
  detection" — that's a BE/ML feature, not in this proposal.
- **No automated tests.** Same posture as the RBAC proposal — repo
  has no test framework wired up.
- **No reconciliation of merchant vs admin types.** They serve
  different audiences and should stay separate.

---

## 7. Open questions — DEFERRED TO AUDIT LOG IMPLEMENTATION SPRINT KICKOFF

The questions below do **not** block the merge of this proposal. They
are the decisions that will need to be made when the audit-log
enforcement sprint actually starts. Treat this section as the agenda
for that sprint's kickoff conversation, not as blockers for Sprint A.

1. **Inline TS labels vs `messages/*.json` for `humanizeAction`.**
   Current pattern is inline; moving to messages improves translator
   workflow but loses TypeScript-checked action keys. Pick.
2. **§3.1 vs §3.4 — full deny or "my events only" for non-admin users?**
   Mutually exclusive. Compliance posture vs UX/right-of-access.
3. **Per-record audit history button placement.** Detail-page header
   icon vs in-context menu vs new "Activity" tab? Decision should
   come from the customer-detail / deal-detail UX redesign — likely
   Sprint D (Unified Communication Hub) or beyond.
4. **Retention banner wording.** "Events kept for X days" is
   defensive; "Older events automatically pruned" is informative.
   Pick. Or A/B test if traffic warrants.
5. **Backend write-survey ownership.** Who runs the BE audit
   write-coverage survey (§3.7)? Mehmet directly, or filed as a
   ticket in `zyrix-crm-backend`?
6. **Plan-gating verification.** Is the existing
   `FEATURE_DISABLED` → `/feature-disabled` flow tested for
   `feature=audit_log` on Free-tier accounts in production? Quick
   smoke test before claiming the feature gate works.
7. **Compliance audit report UI (`ComplianceAuditReport` from
   `lib/api/advanced.ts:962`).** Does a UI exist for it that I
   missed? If not, does Sprint A scope cover discovering it, or is
   it its own follow-up?

---

## 8. Files I read for this proposal (read-only)

- `app/[locale]/(dashboard)/settings/audit/page.tsx` (full, 699 lines)
- `app/[locale]/(dashboard)/settings/data-retention/page.tsx` (head, 80 lines)
- `app/[locale]/admin/audit/page.tsx` (full, 19 lines — already in discovery)
- `components/admin/AdminAuditView.tsx` (head, 100 lines)
- `lib/api/advanced.ts` — slices 962–980 (compliance), 1155–1245 (merchant audit), 844 (entity enum row)
- `lib/api/admin.ts` — slices 560–636 (admin audit + feature catalog)
- `content/docs/en/features/security/audit-log.md` (full)
- `messages/{en,ar,tr}.json` — grep for `audit` keys

Greps used: `audit_log|audit-log|AuditLog|admin:audit|audit:`.

No file under `lib/ai/`, `components/ai/`, `components/dashboard/`,
`components/pipeline/`, `components/messaging/`, or `components/deals/`
was read or referenced for this proposal.

---

**This document changes no code.** It is a written plan only. Any
audit-log implementation should be its own dedicated sprint after
Mehmet has approved §3, §7's deferred questions, and §6's scope cuts.
The two RBAC-shared items (§3.1 and §3.2) should land under the RBAC
sprint, not under an audit-specific sprint.
