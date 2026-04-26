# Sprint B Follow-up Items

Captures work that was identified during Sprint B (Design System + Identity Migration) but explicitly deferred to a future sprint. Each item below is **out of scope for Sprint B** — do not start any of it until Sprint B is signed off and the parent follow-up sprint named below is opened.

**Created:** 2026-04-25
**Source:** Sprint B Phase 2 implementation plan (`docs/sprint-b-implementation-plan.md`) — decisions on plan clarifications, items Q1, Q5
**Owner:** Mehmet Fatih
**Linked sprint plan:** `docs/sprint-b-implementation-plan.md` (the canonical Phase 2 plan)
**Linked discovery:** `docs/sprint-b-discovery.md` (the upstream design proposal)

---

## 1. Status badges on `/ai-agents` (deferred from Sprint B Q5)

**Why deferred:** Sprint B is about color/surface/depth identity, not semantic-token redesign. The status badges are a *category* of element (semantic state pills) used in many places beyond `/ai-agents` — flipping them in isolation here would either (a) create inconsistency with all the other places they appear or (b) balloon Sprint B's scope to a project-wide semantic-pill audit. Cleaner to do it as its own focused sprint.

**Future sprint name:** "Semantic tokens" (proposed — exact name TBD when sprint is opened).

### Current state (as of Sprint B start, file: `app/[locale]/(dashboard)/ai-agents/page.tsx`, `StatusBadge` component)

```tsx
const tones: Record<AgentOutput['status'], string> = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  edited: 'bg-sky-50 text-sky-700',
  dismissed: 'bg-slate-50 text-slate-600',
  executed: 'bg-emerald-100 text-emerald-800',
};
```

Each badge uses a light-tone background (`bg-<color>-50` / `bg-<color>-100`) with a darker text (`text-<color>-700` / `text-<color>-800`). This pattern reads well on the legacy light theme but renders washed-out / low-contrast on the new Dark Navy surfaces (`bg-navy-800`).

### Proposed dark-tone equivalents (for future-sprint reference, not to be applied in Sprint B)

| Status | Current (light) | Proposed (dark) | Rationale |
|---|---|---|---|
| `pending` | `bg-amber-50 text-amber-700` | `bg-amber-500/15 text-amber-300` | "waiting on review" — soft amber alert |
| `approved` | `bg-emerald-50 text-emerald-700` | `bg-emerald-500/15 text-emerald-300` | "user approved" — calm emerald positive |
| `edited` | `bg-sky-50 text-sky-700` | `bg-neon-500/15 text-neon-300` | AI-touched state — neon brand tone signals "AI altered" |
| `dismissed` | `bg-slate-50 text-slate-600` | `bg-navy-700 text-navy-muted` | Neutral / inactive — recedes against canvas |
| `executed` | `bg-emerald-100 text-emerald-800` | `bg-emerald-500/25 text-emerald-200` | "completed" — slightly more saturated than `approved` to distinguish |

### Other places this badge pattern appears (audit before the future sprint starts)

The same `bg-<color>-50 text-<color>-700` pattern is used widely across the app for semantic states. Before opening the "Semantic tokens" sprint, run a discovery to catalogue all such usages so the sprint covers the full set, not just `/ai-agents`. Likely surfaces include: deal stage chips, customer segment chips, task priority dots, integration sync states, audit-log event-type chips.

### Acceptance criteria for the future sprint

- All semantic-state badges across the app use a single token convention (`bg-<semantic>-500/15 text-<semantic>-300` or equivalent).
- Migration is done in a single sprint via a discovery-first pattern (mirror Sprint B's structure).
- Existing prop signatures and JSX shape preserved — only class strings change.
- The TODO comment added in `ai-agents/page.tsx` `tones` constant (Sprint B Phase 2j.1) is removed in the same sprint that does the migration.

### Inline TODO marker added during Sprint B

In Sprint B Phase 2j.1, this comment is added above the `tones` constant in `app/[locale]/(dashboard)/ai-agents/page.tsx`:

```ts
// TODO(sprint-b-followup): migrate semantic status badges to dark-friendly tokens — see docs/sprint-b-followup.md §1
```

Grep `TODO(sprint-b-followup)` to find every code site that points back here.

---

## 2. Tier 2 chrome migration — `/portal/*` and `/components/admin/*`

**Why deferred:** Sprint B targets the merchant CRM dashboard (per audit framing — "AI Business OS for merchants"). The portal and admin trees serve different audiences with their own visual-identity questions:

- `/portal/*` — customer-facing portal (the merchant's *customer* logs in here, not the merchant). Visual identity may need to subordinate to the merchant's per-tenant brand (`/settings/brand`) rather than carry Zyrix's Dark Navy.
- `/components/admin/*` — Zyrix-internal staff admin (Mehmet & team manage merchants here). Could match Dark Navy for consistency, OR could intentionally look distinct so staff visually distinguish "I'm in admin mode" vs. "I'm impersonating a merchant". Worth a deliberate design decision.

Both are non-trivial scope and merit a dedicated sprint each (or a single "shared chrome" sprint) — not a tail-end of Sprint B.

**Future sprint name:** "Shared chrome" (proposed — exact name TBD when sprint is opened).

### File-count snapshot (as of Sprint B discovery)

| Cluster | Top file | Top-file count | Cluster size (rough) | Cluster total occurrences (rough) |
|---|---|---|---|---|
| `/portal/*` | `app/[locale]/portal/dashboard/page.tsx` | 36 | ~3 files | ~90 |
| `/components/admin/*` | `components/admin/AdminCompanyDetailsView.tsx` | 35 | ~25 files | ~280 |

### Open design questions to resolve in the future sprint

1. **Portal:** does it inherit the merchant's per-tenant brand, Zyrix's Dark Navy, or its own neutral palette? Stakeholder: the merchant's customer (typically B2B end-user, may be on mobile, may be over a fragile network).
2. **Admin:** does it match Dark Navy (consistency) or carry a deliberately distinct surface (mode-awareness for Zyrix staff)? Stakeholder: Mehmet + Zyrix staff during impersonation/support workflows.
3. **Single sprint or two:** `/portal/*` and `/components/admin/*` are independent — the "Shared chrome" sprint name implies both, but they could be split if their design answers diverge sharply.

### Acceptance criteria for the future sprint

- Both clusters either fully migrated to a coherent identity (Dark Navy or alternative) or explicitly documented as "intentionally different — here's why".
- No cross-contamination of legacy `sky-*` / `primary-*` tokens left behind in either cluster.
- The Sprint B `Phase 2k Tier 2` section in `docs/sprint-b-implementation-plan.md` is updated to point at the new sprint's signoff doc.

---

## 3. Long-tail file migration (~150 files at 1–30 occurrences)

**Why deferred:** Sprint B's Phase 2k explicitly targets the top-density 19 files (and the 6 dashboard widgets in Phase 2e, plus the AI primitives in Phase 2d, and so on — ~40 specific commits total). The remaining ~150 files in the codebase that contain at least one `bg-sky-*` / `text-sky-*` / `border-sky-*` / `zyrix-*` reference are too low-density to justify dedicated commits in Sprint B without bloating the sprint to 200+ commits.

**No dedicated sprint planned.** Migration is **opportunistic** — when any future sprint touches one of these files for unrelated reasons (a feature addition, a bug fix, a refactor), the developer migrates the styling at the same time using §A token-swap legend in `docs/sprint-b-implementation-plan.md`.

### Long-tail snapshot (as of Sprint B discovery)

- **Total files with sky/cyan/zyrix usage:** ~170 (per `docs/sprint-b-discovery.md` §4)
- **Sprint B Phase 2 covers (directly):** ~30 files (dashboard widgets, AI primitives, target pages, top-20 high-density)
- **Sprint B Tier 2 (deferred to "Shared chrome" sprint, this doc §2):** ~28 files (`/portal/*` + `/components/admin/*`)
- **Long-tail (this section):** ~112 files — each at 1–30 occurrences, scattered across `components/admin` (post-Tier-2 leftovers if any), `components/merchant`, `components/dashboard-widgets`, `components/docs`, `components/auth`, `components/checkout`, `components/public`, `components/onboarding`, `components/collab`, `components/advanced`, etc.

### Migration pattern (when a developer touches a long-tail file)

1. Read the file's existing class usage.
2. Apply the §A token-swap legend (`docs/sprint-b-implementation-plan.md`) — surfaces, text, borders, hover/focus, etc.
3. **Do not** add new depth elements (halos, dot grids, edge highlights) — those are reserved for AI-hero surfaces and were sized into Sprint B intentionally. Long-tail files get token swaps only.
4. Verify type-check + lint pass.
5. Commit with footer `(Sprint B long-tail migration)` so the migration is traceable in `git log`.

### Acceptance criteria (soft target, not a sprint)

- By end of Sprint F, total `bg-sky-*` / `text-sky-*` / `border-sky-*` / `zyrix-*` occurrences in the codebase should be **< 200** (down from 2,600 at Sprint B start).
- After that point, the legacy tokens can be deleted from `tailwind.config.ts` (rolling back the deprecation comments added in Sprint B Phase 2m) in a final cleanup commit.

---

## 4. Lint tooling restoration (surfaced during Sprint B Phase 2a — NOT scoped to Sprint B)

**Why deferred:** During Phase 2a verification on 2026-04-25, the plan §C "lint exits 0" gate could not be satisfied. Two pre-existing tooling issues were uncovered. Both pre-date Sprint B and have nothing to do with the Dark Navy migration.

### Broken script

`package.json` defines `"lint": "next lint"`. Running `npm run lint` produces:

```
> next lint
Invalid project directory provided, no such directory: D:\Zyrix Hub\zyrix-crm\lint
```

Next.js is interpreting "lint" as a positional path argument because the `lint` subcommand no longer exists in Next 16+.

### Two root causes

1. **Next.js 16 removed the `next lint` subcommand.** The project is on Next 16.2.4. The `next lint` invocation no longer dispatches to ESLint — Next now expects users to run their linter directly. (The project's `package.json` `build` script already routes around this with `next build --no-lint`, confirming the dysfunction is known.)
2. **ESLint v9 flat-config migration not done.** Running `npx eslint` directly fails with "ESLint couldn't find an eslint.config.(js|mjs|cjs) file." ESLint 9 (installed in this project) requires the new flat-config format; the project still has a legacy `.eslintrc.*` file that hasn't been migrated.

### Proposed fix — one commit, separate task

`chore(tooling): restore lint` — outside any Sprint B commit, can be run any time:

1. Replace `package.json` `lint` script: `"lint": "next lint"` → `"lint": "eslint ."`
2. Write a minimal `eslint.config.js` flat-config that mirrors the rules from the existing `.eslintrc.*` (use the [ESLint v9 migration guide](https://eslint.org/docs/latest/use/configure/migration-guide); for projects with `eslint-config-next`, consume it via `import nextPlugin from 'eslint-config-next'` in flat-config form).
3. Delete the legacy `.eslintrc.*` file(s).
4. Verify `npm run lint` exits 0 (warnings tolerated, errors blocking) on a clean checkout.
5. Optionally remove `--no-lint` from the `build` script in `package.json` and re-test the build.
6. Update `docs/sprint-b-implementation-plan.md` §C step #2 to re-include lint as a blocking gate; this section in the followup doc gets a `**Status: Resolved by chore(tooling): restore lint, 20XX-XX-XX**` footer.

### Sprint B impact

§C step #2 of the implementation plan is amended to skip lint. Type-check + diff review + visual check carry the gate for every Sprint B commit. The §C amendment lands in the same commit as Phase 2a (`feat(theme): add navy + neon tokens (Sprint B Phase 2a)`) — the gate update is the justification for why that commit ships without lint.

### NOT scoped to Sprint B

This is a tooling-infrastructure task, not a design-system task. Mixing it into Sprint B would inflate scope and pull in unrelated review surface (the ESLint flat-config rewrite is its own focused review). Pick it up opportunistically — anyone doing CI/tooling work can knock it out in 30–60 minutes.

---

## 5. Phase 2c.1 (DashboardShell migration) — deferred pending rendering investigation

**Status:** Code committed as `c07bab7` and pushed (subsequently rebuilt via empty commit `82d6b46` and a manual "Redeploy without cache" via Vercel dashboard). Both Vercel rebuilds succeeded. However, the deployed DOM on `crm.zyrix.co/en/dashboard` still renders the sidebar `<aside>` element with the pre-migration class string (`bg-white` / `border-line-soft` / etc.) instead of the migrated string (`bg-navy-800` / `border-navy-700`). The visual outcome was supposed to be a dark-navy sidebar against a still-light page canvas (intentional Phase 2c.1 "split appearance" before 2c.2's canvas flip). Instead the chrome still reads as the pre-migration light-cyan theme.

**Why deferred:** the migration code itself is verified correct — by direct file read, by `git show c07bab7`, and by the fact that the pre-migration string `border-line-soft` does not appear anywhere else in the codebase (so the rendered DOM cannot be coming from another component in this repo). The disconnect is between source-of-truth (origin/main HEAD) and what the deployed runtime actually renders. Diagnosing it requires deployment-side investigation that exceeds a typical in-flight implementation commit; better to defer Phase 2c rather than block Sprint B end-to-end on it.

### What was tried (chronologically, 2026-04-26)

1. **Browser cache rule-out.** Tested in Incognito with cache cleared. Sidebar still renders white. Rules out browser cache and service workers initiated from prior sessions.
2. **CDN cache rule-out via `curl`.** Curled the deployed CSS bundle (`/_next/static/chunks/0xx1m1gtylmmd.css`, ETag `a8819dbe9142d2090055ce2b0299b380`, Last-Modified Sat 25 Apr 2026 18:26:53 GMT — matches Phase 2c.1 deploy). Verified `.bg-navy-800 { background-color: rgb(24 42 85) }` IS present in the bundle (2 occurrences including the `/80` opacity variant). DevTools Network → Response confirmed the same rule is in the bundle the browser actually receives. CSS side is correct.
3. **Tailwind content-glob rule-out.** Verified `tailwind.config.ts` `content:` array includes `./components/**/*.{js,ts,jsx,tsx,mdx}`. DashboardShell.tsx falls in scope.
4. **JIT static-detection rule-out.** Confirmed both `bg-navy-800` references in `components/layout/DashboardShell.tsx` (lines 202 and 455) are plain static string literals — no template interpolation, no `cn()` wrapping, no concatenation, no variable. Tailwind JIT must detect them.
5. **Force-rebuild via empty commit.** Pushed `82d6b46` (`chore(deploy): force rebuild for Phase 2c.1 JS bundle`). Vercel rebuilt and redeployed. Symptom unchanged.
6. **Vercel "Redeploy without cache".** Triggered manually from the Vercel dashboard. Full clean rebuild ignoring all per-chunk caches. Symptom still unchanged.
7. **Duplicate-shell rule-out.** `find . -name "DashboardShell*"` returns exactly one file (`./components/layout/DashboardShell.tsx`). `grep -rn "border-line-soft" components/ app/` returns zero matches anywhere in the current codebase. So no other component in the repo can be producing the pre-migration class string the DOM is showing.

### Hypotheses to investigate when we resume

1. **Vercel project is building from a different git ref than `origin/main`.** Possible if the Vercel ↔ GitHub integration is pinned to a specific branch/commit, the project is in a monorepo subdir misconfig, or the production target points somewhere unexpected. Verify by reading the Vercel deployment log's source SHA and comparing to `git rev-parse origin/main`.
2. **A second component renders the aside that we haven't found.** The literal `<aside class="...">` string from the rendered DOM was described but never literally captured byte-for-byte in this debugging session. Capturing it is the first follow-up step. If the rendered class is actually `bg-navy-800 border-navy-700`, the bug is CSS cascade / specificity (something later overriding our rule on this specific element), not a source/runtime mismatch.
3. **Service worker / corporate proxy / CDN edge anomaly.** Unlikely given the Incognito test, but if a service worker registered against this domain is serving a cached old `_next/static/chunks/page.js`, it would explain the symptom precisely. Check `Application` → `Service Workers` in DevTools.
4. **Wrong production URL.** The user observed on `crm.zyrix.co` (correct per MASTER_GUIDE), but a Vercel preview-deploy URL or staging variant could explain a stale deploy if it's been opened by accident.

### Resume condition

After Sprint C is signed off. Reopening Phase 2c.1 means:

1. Capture the literal `<aside>` `class` attribute from the rendered DOM in Incognito (single source of truth — paraphrase doesn't suffice).
2. Compare Vercel's most recent deployment log's source commit SHA against `git rev-parse origin/main`. They must match exactly.
3. Run `git show origin/main:components/layout/DashboardShell.tsx | grep -n "bg-navy-800\|bg-white"` to confirm the remote-side source matches local.
4. If all three confirm source ↔ deploy alignment, the issue is downstream of the application code — escalate to Vercel support and check for service workers / proxies.

### Sprint B impact

Phase 2c.2 (global canvas flip) was scheduled to land immediately after Phase 2c.1 visual sign-off. **Both 2c.1 and 2c.2 are blocked** until the rendering issue is resolved. Phase 2a (token addition, commit `85999e7`) and Phase 2b (utility addition, commit `7278931`) remain landed and have **no observable effect on production** — both are purely additive (no consumers yet for any new token or utility), so there is no functional regression on `crm.zyrix.co` from leaving them in place.

The implementation plan's `Commit 2c.1` entry is marked **DEFERRED** with a pointer back to this section.

---

## How this doc evolves

When a deferred item gets picked up by a future sprint:

1. The future sprint's discovery doc references this file's relevant section.
2. When the sprint is signed off, the corresponding section here gets a footer line: `**Status:** Resolved by <sprint name>, signed off <date>. See <sprint signoff doc>.`
3. Sections are not deleted — they remain as historical context for why a future change happened.

If a *new* deferred item is identified during Sprint B implementation (Phases 2a–2m), append it as a new section here in the same commit that surfaced it.

---

**End of Sprint B Follow-up Items.**
