# RBAC Completion Proposal

**Date:** 2026-04-25
**Author:** Claude (read-only proposal — no code changes in this doc)
**Sprint:** A v2, Task 4
**Predecessor:** `docs/sprint-a-discovery.md` (commit `329a3f0`, with §9
follow-up in `f00685f`)
**Reframe basis:** Open question Q4 in the discovery report —
approved by Mehmet 2026-04-25.

---

## 0. Status at a glance

This is **not** a from-scratch RBAC design. The frontend already has
the contract, the catalog, the role CRUD, the auth-context helpers,
and the role-management UI. What's missing is **systematic
enforcement** — only 2 pages out of the dashboard's surface area
actually call `hasPermission`. The sidebar shows every menu item to
every user.

| Layer | Status |
|---|---|
| Permission catalog (25 keys, 8 modules) | ✅ Complete (`lib/api/roles.ts:14-40`) |
| Role CRUD client | ✅ Complete (`lib/api/roles.ts:98-143`) |
| Auth context exposure (`hasPermission`/`hasAllPermissions`/`hasAnyPermission`) | ✅ Complete (`lib/auth/context.tsx:231-242`) |
| Role-management UI | ✅ Complete (`app/[locale]/(dashboard)/settings/roles/page.tsx`) |
| User-role assignment UI | ✅ Complete (`app/[locale]/(dashboard)/settings/users/page.tsx`) |
| Backend `403 FEATURE_DISABLED` redirect | ✅ Complete (`lib/api/client.ts:101-117`) |
| Marketing/help docs | ✅ Complete (`content/docs/{en,ar,tr}/features/security/rbac.md`) |
| **Sidebar permission filtering** | ❌ Missing |
| **SettingsTabs permission filtering** | ❌ Missing |
| **Per-page gates (other than settings/users + settings/roles)** | ❌ Mostly missing |
| **`<Unauthorized />` page / component for permission denials** | ❌ Missing |
| **`<RequirePermission>` wrapper component** | ❌ Missing |
| **Backend permission enforcement on API endpoints** | ❓ Unknown from this repo (backend lives separately) |

---

## 1. Inventory of what already exists

### 1.1 Permission catalog (`lib/api/roles.ts:14-40`)

25 keys across 8 modules — kept as a TypeScript string literal union so
that typos like `hasPermission("customers:reed")` fail at compile time:

| Module | Keys |
|---|---|
| customers | `customers:read`, `customers:write`, `customers:delete` |
| deals | `deals:read`, `deals:write`, `deals:delete` |
| quotes | `quotes:read`, `quotes:write`, `quotes:issue` |
| contracts | `contracts:read`, `contracts:write`, `contracts:sign` |
| invoices | `invoices:read`, `invoices:issue`, `invoices:void` |
| reports | `reports:view_own`, `reports:view_all` |
| settings | `settings:billing`, `settings:users`, `settings:roles`, `settings:branding`, `settings:integrations` |
| admin | `admin:impersonate`, `admin:audit`, `admin:compliance` |

> **Discovery-doc correction:** `docs/sprint-a-discovery.md` §1 and
> §4.1 said "24 permission keys". The correct count is **25** —
> `admin:compliance` was missed in my count. The marketing copy in
> `rbac.md` ("25 granular permissions") is correct. **Fix applied in
> this same commit** (§3.6).

### 1.2 Role types (`lib/api/roles.ts`)

```ts
type Permission = (typeof PERMISSION_KEYS)[number];   // string union
interface Role { id; companyId; name; description; isSystem;
                 permissions: Permission[]; createdAt; updatedAt; }
interface PermissionEntry { key; module; action;
                            label: { en; ar; tr };
                            description: { en; ar; tr }; }
type UserRole = "owner" | "admin" | "manager" | "member";   // built-in
```

`User.customRoleId?: string | null` (`lib/auth/types.ts:28`) overrides
the built-in `role` when set.

### 1.3 Auth-context surface (`lib/auth/context.tsx:231-242`)

```ts
const hasPermission     = (p)        => permissions.includes(p);
const hasAllPermissions = (...ps)    => ps.every(p => permissions.includes(p));
const hasAnyPermission  = (...ps)    => ps.some(p  => permissions.includes(p));
```

`permissions` is fetched from `GET /api/permissions/me` after every
login/signup/2FA/Google sign-in (lines 95-104), cached in
localStorage (`setCachedPermissions`), and re-hydrated on page reload.

### 1.4 Existing in-page gate pattern

Two pages currently gate, both with the same idiom:

`app/[locale]/(dashboard)/settings/users/page.tsx:47-48`

```ts
const { hasPermission } = useAuth();
const canEdit = hasPermission("settings:users");
// later: {canEdit && <Edit-button .../>}
//        {!canEdit && <ReadOnly banner .../>}
```

`app/[locale]/(dashboard)/settings/roles/page.tsx:83-84` is identical
in shape (`hasPermission("settings:roles")`, with a localised "you can
view roles but only owners can edit" amber banner at lines 202-213).

This pattern is good — it shows the page so the user understands what
exists, but disables edit affordances. Any completion work should
**reuse** this pattern, not invent a new one.

### 1.5 What does NOT yet enforce permissions

| Surface | File | Current behaviour |
|---|---|---|
| Sidebar nav (28+ links) | `components/layout/DashboardShell.tsx:350-418` | Every link rendered for every user |
| Settings tabs (Profile / Company / Security) | `components/settings/SettingsTabs.tsx` | All 3 tabs always visible; no `useAuth` import |
| `/settings/billing` | (not read in detail) | No gate observed |
| `/settings/audit` | `app/[locale]/(dashboard)/settings/audit/page.tsx` | No `hasPermission` call (head-of-file read in §1.4 of discovery doc) |
| `/settings/brand` | `app/[locale]/(dashboard)/settings/brand/page.tsx` | No `hasPermission` call |
| `/settings/brands` | `app/[locale]/(dashboard)/settings/brands/page.tsx` | No `hasPermission` call |
| `/settings/integrations` | (not read in detail) | No gate observed |
| `/admin/*` | `app/[locale]/admin/*` | Has its own AdminShell auth flow but admin-permission checks not verified from this repo |

---

## 2. Recommended approach

### 2.1 Headline

**Extend, don't rebuild.** Reuse the existing patterns. No new
packages, no schema change, no abstraction layer beyond a thin
`<RequirePermission>` wrapper for ergonomics.

### 2.2 Why not "build new"

- Permission catalog is settled (25 keys, 3 years' worth of product
  decisions baked in) — replacing it would invalidate every existing
  Role row in the backend.
- The auth-context API (`hasPermission`/`hasAll`/`hasAny`) is already
  optimal for component-level gating. Anything more elaborate (e.g.
  `<Can>` libraries like CASL) would add a dependency for no real win.
- Server-side enforcement is the backend's job and lives in
  `zyrix-crm-backend`. Nothing to design here.

### 2.3 Why not "use a library"

- CASL (`@casl/react`) is overkill for 25 string keys and a
  `permissions: string[]` array. It would add ~30 KB and a learning
  curve for marginal value.
- The current `hasPermission(key)` pattern is so simple that wrapping
  it in a library would obscure rather than clarify.

### 2.4 Why not block routes via middleware

- `proxy.ts` is already deliberately minimal — it only handles locale
  routing. Adding RBAC there would (a) duplicate every backend
  permission check on the frontend (wasteful, brittle), (b) still
  require the backend to enforce, and (c) leave the user staring at
  a redirect with no explanation of what they lack.
- Component-level gating with a friendly UI (read-only mode +
  `<Unauthorized />` for full denial) is better UX than blanket
  redirects.

---

## 3. Required changes (drafted, NOT applied)

### 3.1 Sidebar permission filtering — `components/layout/DashboardShell.tsx`

**What:** convert the static list of `<Link>` elements into a
data-driven list with a `permission?: Permission` field, then filter
before render.

**Drafted shape (do not apply):**

```tsx
import { useAuth } from "@/lib/auth/context";
import type { Permission } from "@/lib/api/roles";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;      // omit = visible to all
  permissionAny?: Permission[]; // visible if user has ANY of these
}

const SETTINGS_NAV: NavItem[] = [
  { href: "settings",                        label: "Profile",       icon: User },
  { href: "settings/billing",                label: "Billing",       icon: CreditCard,  permission: "settings:billing" },
  { href: "settings/security",               label: "Security",      icon: Shield },
  { href: "settings/users",                  label: "Team",          icon: Users,       permission: "settings:users" },
  { href: "settings/roles",                  label: "Roles",         icon: ShieldCheck, permission: "settings:roles" },
  { href: "settings/audit",                  label: "Audit log",     icon: History,     permission: "admin:audit" },
  { href: "settings/api",                    label: "API keys",      icon: Key },
  { href: "settings/brand",                  label: "Branding",      icon: Palette,     permission: "settings:branding" },
  { href: "settings/brands",                 label: "Brands",        icon: Store,       permission: "settings:branding" },
  { href: "settings/integrations",           label: "E-commerce",    icon: Sparkles,    permission: "settings:integrations" },
  // ... etc.
];

// Inside the component:
const { hasPermission, hasAnyPermission } = useAuth();
const visibleSettingsNav = SETTINGS_NAV.filter(item =>
  !item.permission && !item.permissionAny
    ? true
    : item.permission
      ? hasPermission(item.permission)
      : hasAnyPermission(...item.permissionAny!)
);
```

**Open questions for Mehmet:**
- Should "Security" tab require a permission? It exposes 2FA + session
  management, which is per-user — currently no perm exists for it.
- Should "API keys" require `settings:integrations` or its own new key
  (e.g. `settings:api_keys`)? Currently no perm exists for API keys.

### 3.2 SettingsTabs permission filtering — `components/settings/SettingsTabs.tsx`

**What:** add per-tab permission, drop tabs the user lacks.

```tsx
const tabs: Array<{ id: TabId; label: string; icon: ElementType; permission?: Permission }> = [
  { id: "profile",  label: t("profile"),  icon: User,       /* no perm */ },
  { id: "company",  label: t("company"),  icon: Building2,  permission: "settings:billing" /* TBD */ },
  { id: "security", label: t("security"), icon: Lock,       /* no perm */ },
];
const visibleTabs = tabs.filter(t => !t.permission || hasPermission(t.permission));
```

**Open question:** which permission gates the Company tab? Probably
`settings:billing` since it shows plan info, but could also be a new
`settings:company` key.

### 3.3 Per-page gates for the 6 ungated settings pages

Apply the existing `canEdit` pattern (§1.4) to:

| Page | Gate permission | Affordance pattern |
|---|---|---|
| `/settings/billing` | `settings:billing` | Hide upgrade/downgrade buttons; show "ask owner" banner |
| `/settings/audit` | `admin:audit` | If denied, show `<Unauthorized />` (it's a security tool — read-only is not enough) |
| `/settings/brand` | `settings:branding` | Show form read-only; hide Save + Reset; banner |
| `/settings/brands` | `settings:branding` | Hide New/Edit/Archive/Delete; banner; allow viewing |
| `/settings/integrations` | `settings:integrations` | Hide Connect/Disconnect; show banner |
| `/settings/data-retention` | `admin:compliance` | Full deny via `<Unauthorized />` |

**Decision rule:** read pages get **read-only mode + amber banner**.
Pages that expose sensitive info (audit log, data-retention) get
**full deny** via `<Unauthorized />`. Discuss before applying.

### 3.4 New `<Unauthorized />` component (drafted, NOT applied)

A new file `components/auth/Unauthorized.tsx` modelled on the
existing FeatureDisabled page (`app/[locale]/(dashboard)/feature-disabled/page.tsx`)
for visual consistency. Different copy + icon (a closed lock instead
of `ShieldOff`), different reason ("requires permission X"), same
"go back to dashboard" CTA. Wrapped in `DashboardShell` so navigation
stays consistent.

### 3.5 New `<RequirePermission>` wrapper (drafted, NOT applied — optional)

Optional ergonomics improvement: a tiny client-component that takes a
permission and either renders children or `<Unauthorized />`.

```tsx
"use client";
import { useAuth } from "@/lib/auth/context";
import type { Permission } from "@/lib/api/roles";
import { Unauthorized } from "@/components/auth/Unauthorized";

interface Props {
  permission?: Permission;
  any?: Permission[];
  all?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RequirePermission({ permission, any, all, fallback, children }: Props) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useAuth();
  if (isLoading) return null;            // or <Spinner />
  const ok = permission ? hasPermission(permission)
           : any        ? hasAnyPermission(...any)
           : all        ? hasAllPermissions(...all)
           : true;
  return ok ? <>{children}</> : (fallback ?? <Unauthorized />);
}
```

This is a quality-of-life thing — not strictly required. If
introduced, the per-page gates (§3.3) become 3-line wraps:

```tsx
<RequirePermission permission="admin:audit">
  <AuditLogPage />
</RequirePermission>
```

### 3.6 Documentation correction (applied in this commit)

`docs/sprint-a-discovery.md` is patched in this same commit to fix two
"24 keys" → "25 keys" mentions:

- §1 data-layer table row for `Role / permission` (line 52)
- §4.1 inventory bullet (line 235)

This is folded in here because it's the same logical change (RBAC fact
correctness) and avoids a noise commit.

### 3.7 i18n keys

Three new strings (en/ar/tr) for the `<Unauthorized />` component:

```json
"Unauthorized": {
  "title": "Permission required" | "إذن مطلوب" | "İzin gerekli",
  "body": "You need the {{permission}} permission to view this page. Ask your account owner to grant it." | "..." | "...",
  "back": "Back to dashboard" | "العودة إلى لوحة التحكم" | "Panele dön"
}
```

Plus 1–2 strings for the new amber "you can view but not edit" banner
that doesn't duplicate the existing settings/users one.

---

## 4. Estimated commit count

| # | Commit | Files | Approx LOC |
|---|---|---|---|
| 1 | `feat(rbac): add Unauthorized component + i18n keys` | 4 (component, en/ar/tr) | ~80 |
| 2 | `feat(rbac): add RequirePermission wrapper` (optional) | 1 | ~25 |
| 3 | `feat(rbac): filter sidebar nav by permission` | 1 (DashboardShell) | ~60 (refactor + filter) |
| 4 | `feat(rbac): filter settings tabs by permission` | 1 (SettingsTabs) | ~10 |
| 5 | `feat(rbac): gate /settings/billing` | 1 | ~15 |
| 6 | `feat(rbac): gate /settings/audit (full deny)` | 1 | ~5 |
| 7 | `feat(rbac): gate /settings/brand and /settings/brands` | 2 | ~30 |
| 8 | `feat(rbac): gate /settings/integrations` | 1 | ~15 |
| 9 | `feat(rbac): gate /settings/data-retention (full deny)` | 1 | ~5 |
| 10 | `docs(rbac): correct permission count in discovery doc` | 1 | 1 |

**Total:** 10 commits, ~250 LOC, no new packages, no schema change.

If commit 2 (RequirePermission) is dropped, the per-page commits
(5–9) become slightly more verbose but the count stays the same.

---

## 5. Risks and breaking changes

### 5.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Backend permission shape drifts from frontend `Permission` union | Low (already kept in sync via `// must mirror backend` comment in `lib/api/roles.ts:9-12`) | High (compile error after BE change) | Add a CI check that diffs the FE `PERMISSION_KEYS` against a BE-exported JSON snapshot |
| User logs in but `/api/permissions/me` 404s or 500s on stale BE | Currently catches and uses cache — good, but a fresh user with no cache sees `permissions = []` and is locked out of everything | Med | Add a "permissions still loading" UI state to `<RequirePermission>` instead of returning `null` |
| Sidebar filter hides items the user could legitimately access via direct URL | Low | Low | Per-page gate in §3.3 catches this — defence in depth |
| Plan-gating ("RBAC custom roles only on Business+") not enforced anywhere FE | Unknown — backend may already 403 with `FEATURE_DISABLED` | Med | Verify FE displays existing FeatureDisabled page when plan is Free/Starter; no FE work needed if so |

### 5.2 Breaking changes

**None for end users.** Existing users keep all functionality they
have today. The sidebar shrinks for low-permission users, which is
the desired behaviour — but they were never *able* to use those pages
anyway (the backend would 403 their write attempts).

**One subtle BE compat note:** `customRoleId` lookups currently call
`/api/users/:id/role`. Sprint A doesn't change that. Make sure that
endpoint still works on the BE — already verified in §9.1 of
discovery? No — the discovery only verified `/api/brand` and `/api/brands`.
If the BE 500 from §9 is endpoint-specific, RBAC endpoints might be
fine; if it's a deployment-wide issue, the whole sprint stalls.
**Suggest verifying `/api/permissions/me` returns 200 in production
before starting RBAC work.**

---

## 6. What this proposal does NOT cover

To stay disciplined and within Q4's reframe scope:

- **No backend work.** All BE permission enforcement, role seeding,
  permission catalog API, etc., are out of scope. Backend repo:
  `zyrix-crm-backend` (Railway).
- **No new permission keys.** Adding `settings:api_keys`,
  `settings:security`, etc. is a follow-up if §3.1/§3.2 surface
  needs.
- **No plan-gating logic.** Whether RBAC is gated to Business/Enterprise
  plans (per `rbac.md`) is enforced by the BE today via
  `FEATURE_DISABLED`. FE just needs to show the existing
  `/feature-disabled` page, which it does.
- **No automated tests.** The codebase has no test framework wired
  up; introducing one is a separate decision.
- **No migration of existing users.** Built-in role mapping in the BE
  doesn't change.

---

## 7. Open questions — DEFERRED TO RBAC IMPLEMENTATION SPRINT KICKOFF

The questions below do **not** block the merge of this proposal. They
are the decisions that will need to be made when the RBAC enforcement
sprint actually starts. Treat this section as the agenda for that
sprint's kickoff conversation, not as blockers for Sprint A.

1. **Adopt `<RequirePermission>`** (commit #2 in §4) or skip and use
   inline `hasPermission` everywhere?
2. **Permission for the Settings → Security tab.** Self-only?
   `settings:billing`? New key?
3. **Permission for the Settings → Company tab.** Same question.
4. **Permission for `/settings/api` (API keys).** New key
   `settings:api_keys`?
5. **Per-page gate decision matrix in §3.3.** Approve the read-only-vs-
   full-deny split, or change?
6. **Order of work.** Sprint B (theme migration) is still on the
   roadmap. Should RBAC completion go before, after, or interleaved
   with Sprint B? (RBAC doesn't touch styles, so they're orthogonal.)

---

## 8. Files I read for this proposal (read-only)

- `lib/api/roles.ts` (full)
- `lib/auth/context.tsx` (full)
- `lib/auth/types.ts` (full)
- `lib/api/client.ts` (full — for axios interceptor reference)
- `app/[locale]/(dashboard)/settings/users/page.tsx` (head, 120 lines)
- `app/[locale]/(dashboard)/settings/roles/page.tsx` (head + 80–280)
- `components/layout/DashboardShell.tsx` (slice 350–470 + grep for `useAuth`)
- `components/settings/SettingsTabs.tsx` (full, 57 lines)
- `app/[locale]/(dashboard)/feature-disabled/page.tsx` (head, 80 lines)
- `content/docs/en/features/security/rbac.md` (full)

Greps used: `hasPermission|hasAllPermissions|hasAnyPermission|customRoleId|permissions:`.

No file under `lib/ai/`, `components/ai/`, `components/dashboard/`,
`components/pipeline/`, `components/messaging/`, or `components/deals/`
was read or referenced for this proposal.

---

**This document changes no code.** It is a written plan only. Any
RBAC implementation should be its own dedicated sprint after Mehmet
has approved §3, §7, and §6's scope cuts.
