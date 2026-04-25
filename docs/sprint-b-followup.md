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

## How this doc evolves

When a deferred item gets picked up by a future sprint:

1. The future sprint's discovery doc references this file's relevant section.
2. When the sprint is signed off, the corresponding section here gets a footer line: `**Status:** Resolved by <sprint name>, signed off <date>. See <sprint signoff doc>.`
3. Sections are not deleted — they remain as historical context for why a future change happened.

If a *new* deferred item is identified during Sprint B implementation (Phases 2a–2m), append it as a new section here in the same commit that surfaced it.

---

**End of Sprint B Follow-up Items.**
