# Sprint B Phase 2 — Implementation Plan

**Sprint:** B (Design System + Identity Migration)
**Phase:** 2 — Implementation (commit-by-commit)
**Author:** Claude (with Mehmet)
**Date:** 2026-04-25
**Last commit on main at plan time:** `ea22e22` — `docs(sprint-b): record approved decisions on open questions`
**Prerequisite:** Phase 1 discovery complete and signed off (commits `7456f78` + `ea22e22`)
**Source documents:**
- `docs/sprint-b-discovery.md` §6–§10 (proposed design language, migration approach)
- `docs/sprint-b-discovery.md` §13 (approved decisions on Q1–Q6)
- `D:\Zyrix Hub\Sprints\audit-package\MASTER_GUIDE.md` §4 (golden rules)
- `D:\Zyrix Hub\Sprints\audit-package\audit_sprint_B_design_system.md` §"Special design rule" (additive-first)

**Status:** Plan finalized 2026-04-25 (all clarifications resolved — see "Decisions on plan clarifications" at end). Awaiting Mehmet approval to author Commit `2a.1`.

---

## How to read this plan

- Each phase contains one or more **commits**, identified `<phase>.<index>` (e.g., `2c.2`, `2k.7`).
- Each commit entry lists: **files**, **token swaps** (referenced from §A legend below), **depth elements** (referenced from §B legend), and **verification gate** (referenced from §C).
- Token-swap and depth-element legends are normative — every commit refers back to them rather than re-listing mappings inline. If a swap rule needs refinement during implementation, the legend gets updated (own commit) and all dependent commits inherit the new rule.
- Commits are intentionally small. Mehmet reviews `git diff HEAD~1` between each one. If a diff looks wrong: `git reset --hard HEAD~1` → fix → re-commit.

---

## §A. Token-swap legend (canonical mappings — Sprint B)

This table is the single source of truth for old→new color/border/text/shadow conversions. Every Phase 2 commit applies a *subset* of these — never invents a new mapping inline.

### A.1 Surfaces (backgrounds)

| Legacy token (light) | New token (dark) | Notes |
|---|---|---|
| `bg-white` (card surface) | `bg-navy-800` | Most common card swap |
| `bg-bg-base` (body canvas) | *(implicit via canvas flip in 2c.2)* | Body bg defined once at base layer |
| `bg-bg-subtle` (#F8FAFC) | `bg-navy-700` | Hover row / nav hover |
| `bg-bg-card` (#ECFEFF) | `bg-navy-800` | Same as card |
| `bg-zyrix-cardBg` (#FFFFFF) | `bg-navy-800` | Same as card |
| `bg-zyrix-cardBgAlt` (#F8FAFC) | `bg-navy-700` | Hover / alt surface |
| `bg-zyrix-aiSurface` (#F0F9FF) | `bg-navy-800/60` *(see depth element D.2)* | AI hero surface — pair with halo |
| `bg-sky-50` (chip / icon tile) | `bg-neon-500/10` | Soft accent backgrounds |
| `bg-sky-50/30` (row hover) | `bg-navy-700/40` | Subtle row hover |
| `bg-sky-100` (sidebar splitter active) | `bg-neon-500/15` | Active interaction surface |
| `bg-primary-50` (active nav) | `bg-neon-500/15` | Active nav item bg |

### A.2 Text

| Legacy token (light) | New token (dark) | Notes |
|---|---|---|
| `text-zyrix-textHeading` (#0C4A6E) | `text-navy-ink` (#F1F5F9) | All H1/H2/H3 |
| `text-sky-900` | `text-navy-ink` | Page titles on legacy pages |
| `text-ink` (#164E63) | `text-navy-ink` | Sidebar nav primary text |
| `text-zyrix-textBody` (#1E293B) | `text-navy-body` (#CBD5E1) | Body text |
| `text-slate-700` | `text-navy-body` | Same role |
| `text-zyrix-textMuted` (#64748B) | `text-navy-muted` (#94A3B8) | Captions / labels / timestamps |
| `text-slate-500`, `text-slate-400` | `text-navy-muted` | Same role |
| `text-ink-muted`, `text-ink-light` | `text-navy-muted` | Same role |
| `text-sky-500`, `text-sky-600` | `text-neon-500` | Icon tints |
| `text-sky-700` | `text-neon-300` | Link / soft accent text |
| `text-primary-700` | `text-neon-300` | Active nav text |
| `text-zyrix-primary` | `text-neon-500` | AI accent text |
| `text-zyrix-primaryDark` | `text-neon-500` | AI accent text (collapsed) |

### A.3 Borders / dividers

| Legacy token (light) | New token (dark) | Notes |
|---|---|---|
| `border-line-soft` (#E0F2FE) | `border-navy-700` | Subtle dividers |
| `border-line` (#BAE6FD) | `border-navy-700` | Standard borders |
| `border-sky-100` | `border-navy-700` | Card borders |
| `border-sky-300` | `border-neon-500/40` | Hover border |
| `border-zyrix-border` | `border-navy-700` | Modern card border |
| `border-zyrix-aiBorder` | `border-neon-500/30` | AI surface border |
| `border-zyrix-primary` (left accent) | `border-neon-500` | AI left-accent stripe |
| `divide-sky-50` | `divide-navy-700` | Row dividers |
| `border-2 border-dashed border-zyrix-border` | `border-2 border-dashed border-navy-700` | Empty drop zones |

### A.4 Hover / focus / active states

| Legacy pattern | New pattern | Notes |
|---|---|---|
| `hover:bg-sky-50/30` | `hover:bg-navy-700/40` | Row hover |
| `hover:bg-bg-subtle` | `hover:bg-navy-700` | Nav hover |
| `hover:bg-zyrix-cardBgAlt` | `hover:bg-navy-700` | Alt hover |
| `hover:bg-sky-50` | `hover:bg-neon-500/10` | Chip hover |
| `hover:text-sky-900` | `hover:text-neon-300` | Link hover |
| `hover:text-ink` | `hover:text-navy-ink` | Nav text hover |
| `hover:border-sky-300` | `hover:border-neon-500/40` | Card hover border |
| `:focus-visible` global outline | `.ring-neon` *(see depth element D.3)* | Replaces global rule at Phase 2c.2 |

### A.5 Shadows

| Legacy token (light-cyan tinted) | New token (dark) | Notes |
|---|---|---|
| `shadow-zyrix-card` | preserved as-is | Subtle sky shadow reads as gentle elevation on dark too — keep |
| `shadow-zyrix-card-hover` | preserved as-is | Same |
| `shadow-zyrix-ai-glow` | `shadow-zyrix-ai-glow-dark` *(new in 2a)* | The named "AI glow" cards |
| `shadow-md`, `shadow-lg` | preserved as-is | Same — sky-tinted shadows still read on dark |
| `shadow-glow`, `shadow-glow-lg` | preserved as-is | Cyan-tinted halo shadows still work on dark |

### A.6 Gradients (largely preserved)

| Existing gradient | Action | Notes |
|---|---|---|
| `bg-zyrix-ai-gradient` (sky→cyan→cyan) | **Replace opportunistically** with `bg-gradient-ai-primary` (Q4 decision — adds the violet "AI" signal) | Each commit performing the swap MUST note it in the message footer (e.g., `(Sprint B Phase 2e.1; +bg-gradient-ai-primary swap)`) |
| `bg-zyrix-cta`, `bg-zyrix-accent` | **Keep** | Cyan-on-cyan, fine on navy |
| `bg-hero-gradient`, `bg-celebration-gradient`, etc. | **Keep**, audit didn't request changes | Marketing-tone gradients |
| `bg-gradient-ai-primary` *(new in 2a)* | **Add** — sky→cyan→violet (#7C3AED endpoint approved Q1) | Primary AI hero buttons |
| `bg-gradient-ai-glow` *(new in 2a)* | **Add** — radial wash for hero card backgrounds | See depth element D.2 |
| `bg-gradient-ai-edge` *(new in 2a)* | **Add** — top-edge highlight on cards | See depth element D.5 |
| `bg-gradient-page-aurora` *(new in 2a)* | **Add** — page-canvas atmospheric wash | Composed onto body in 2c.2 |

---

## §B. Depth-element legend (per discovery §7.3)

The four utilities defined in Phase 2b. Each commit specifies which (if any) it introduces to a component.

| ID | Utility class | Where defined | When to add |
|---|---|---|---|
| **D.1** | `.bg-navy-dots` | `globals.css` `@layer components` (Phase 2b) | Page canvas (2c.2), AI hero card backgrounds, empty-state focal areas |
| **D.2** | `.halo-cyan`, `.halo-violet` | `globals.css` `@layer components` (Phase 2b) | AI hero cards (one halo top-right or bottom-left), primary CTA hover state, empty-state focal points. Promote via reusable abs-positioned `<div>` |
| **D.3** | `.ring-neon` | `globals.css` `@layer base` (Phase 2b — replaces `:focus-visible` rule at Phase 2c.2) | Global; every focusable element inherits |
| **D.4** | `shadow-zyrix-ai-glow-dark` | `tailwind.config.ts` `boxShadow` (Phase 2a) | AI Pipeline cards, KPI grid, primary AI hero cards on hover |
| **D.5** | `gradient-ai-edge` (1px top-edge highlight) | `tailwind.config.ts` `backgroundImage` (Phase 2a), applied via thin `<div>` or `::before` | Card top-edge "lit from above" effect (Linear pattern) |
| **D.6** | `gradient-page-aurora` | `tailwind.config.ts` (Phase 2a), applied to `body::before` (Phase 2c.2) | One large soft wash at canvas level (Resend pattern) |

---

## §C. Verification gate (per commit)

Every Phase 2 commit MUST pass this gate before the next commit begins:

1. **Type-check:** `npm run type-check` exits 0.
2. **Lint:** skipped — pre-existing tooling issue (Next.js 16 removed `next lint` subcommand; ESLint v9 needs flat-config migration). Tracked in `docs/sprint-b-followup.md` §4. Type-check (`tsc --noEmit`) plus visual review carries the gate.
3. **Diff review:** Mehmet runs `git diff HEAD~1` and confirms only expected changes appear.
4. **Visual check (en):** Mehmet opens the affected page(s) in a browser at locale `en` and confirms layout/legibility/contrast.
5. **Visual check (ar):** For any commit touching translated UI strings or layout flow, Mehmet opens at locale `ar` (RTL) and confirms mirroring is correct (no halo/icon flipped wrong, no text-overflow).
6. **Visual check (tr):** For any commit touching pages with TR-specific copy length, sanity-check at `tr`.
7. **Pre-existing pages still render:** Spot-check one un-migrated page (any of the §4 long-tail) renders without breakage on the new dark canvas.

If any step fails: `git reset --hard HEAD~1`, diagnose, re-attempt as a corrected new commit.

For Phase 2c.2 (canvas flip) the visual check is special — see commit entry.

---

## §D. Commit message convention

`<type>(<scope>): <imperative summary> (Sprint B Phase <id>)`

- `<type>`: `feat` (new tokens / utilities) | `style` (color/class swaps) | `chore` (deprecation comments)
- `<scope>`: `theme` | `layout` | `ai` | `dashboard` | `pipeline` | `customers` | `deals` | `messaging` | `reports` | `agents` | `settings` | `admin` | `merchant` | etc.
- `<imperative summary>`: 50–72 chars, no period at end
- Trailer: `(Sprint B Phase <id>)` — always present, identifies which commit in this plan

Examples:
- `feat(theme): add navy + neon tokens (Sprint B Phase 2a)`
- `style(layout): migrate DashboardShell to Dark Navy (Sprint B Phase 2c.1)`
- `style(theme): activate Dark Navy canvas globally (Sprint B Phase 2c.2)`

---

# Phase 2a — Token addition

**Goal:** Add every new token (`navy-*`, `neon-*`, `navy-ink/body/muted`, new gradients, new shadow) to `tailwind.config.ts`. Nothing visual changes — additive only.

### Commit `2a.1` — `feat(theme): add navy + neon tokens (Sprint B Phase 2a)`

- **Files:** `tailwind.config.ts` (only)
- **Additions to `theme.extend.colors`:**
  - `navy.canvas` = `#0A1530`
  - `navy.900` = `#112044` *(brand base — locked)*
  - `navy.800` = `#182A55`
  - `navy.700` = `#243766`
  - `navy.600` = `#324A82`
  - `navy.ink` = `#F1F5F9`
  - `navy.body` = `#CBD5E1`
  - `navy.muted` = `#94A3B8`
  - `neon.300` = `#7DDFFF`
  - `neon.500` = `#38BDF8` *(DEFAULT)*
  - `neon.600` = `#0EA5E9` *(equals existing `zyrix.primary` — kept as alias)*
- **Additions to `theme.extend.backgroundImage`:**
  - `gradient-ai-primary` = `linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #7C3AED 100%)`
  - `gradient-ai-edge` = `linear-gradient(180deg, rgba(56,189,248,0.12), rgba(56,189,248,0))`
  - `gradient-ai-glow` = `radial-gradient(circle at 30% 20%, rgba(56,189,248,0.18), transparent 60%)`
  - `gradient-page-aurora` = `radial-gradient(60% 80% at 70% 0%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(50% 60% at 20% 100%, rgba(56,189,248,0.10), transparent 70%)`
- **Additions to `theme.extend.boxShadow`:**
  - `zyrix-ai-glow-dark` = `0 0 0 1px rgba(56,189,248,0.25), 0 8px 32px -8px rgba(56,189,248,0.35)`
- **Header comment edit:** rewrite the file's "NO dark or gloomy colors anywhere" rule (lines 7–11) to read "As of Sprint B (Apr 2026): brand identity is Dark Navy #112044 + neon blue gradient. The legacy sky/cyan tokens remain for backward-compat during the migration window — do not remove without explicit follow-up sprint approval."
- **No deletions. No modifications to existing tokens.**
- **Token swaps applied:** none (additive)
- **Depth elements added:** none (definitions only — utilities come in 2b)
- **Verification gate (§C):** type-check + lint + visual check that nothing changed (additive only). Pull `crm.zyrix.co/dashboard` locally — should look identical.

---

# Phase 2b — Utility addition

**Goal:** Add the new dark-friendly utility classes to `globals.css`. Nothing visual changes — utilities exist but no element uses them yet.

### Commit `2b.1` — `feat(theme): add dark depth utilities (Sprint B Phase 2b)`

- **Files:** `app/globals.css` (only)
- **Additions to `@layer components`:**
  - `.bg-navy-canvas` — `background-color: #0A1530;`
  - `.bg-navy-dots` — `background-image: radial-gradient(rgba(125,223,255,0.05) 1px, transparent 1px); background-size: 24px 24px;` (composes with bg color)
  - `.halo-cyan` — abs-positioned helper rule: `position: absolute; width: 24rem; height: 24rem; border-radius: 9999px; background: rgba(56,189,248,0.20); filter: blur(48px); pointer-events: none;`
  - `.halo-violet` — same shape, `background: rgba(124,58,237,0.20);`
  - `.ai-card-edge` — pseudo-rule for cards needing the top-edge highlight: `position: relative;` and `&::before { content:""; position:absolute; inset:0 0 auto 0; height:1px; background: var(--gradient-ai-edge, linear-gradient(180deg, rgba(56,189,248,0.30), rgba(56,189,248,0))); }`
- **Addition to `@layer utilities`:**
  - `.ring-neon` — `box-shadow: 0 0 0 2px #112044, 0 0 0 4px rgba(56,189,248,0.55);`
- **No deletions. The light-tone `.grain-texture`, `.glass`, `.hero-bg`, etc. are preserved unchanged.**
- **Token swaps applied:** none (additive)
- **Depth elements added:** definitions only — D.1, D.2, D.3, D.5
- **Verification gate (§C):** type-check + lint + visual check that nothing changed. The new utilities have no consumers yet.

---

# Phase 2c — Shell chrome (2 commits)

**Goal:** Migrate `DashboardShell.tsx` to dark surfaces (no canvas flip yet — body still light), then in a separate commit flip the body canvas globally so every page lands on Dark Navy.

### Commit `2c.1` — `style(layout): migrate DashboardShell to Dark Navy (Sprint B Phase 2c.1)`

- **Files:** `components/layout/DashboardShell.tsx`
- **Token swaps (per §A):**
  - Sidebar `<aside>`: `bg-white border-line-soft` → `bg-navy-900 border-navy-700`
  - Sidebar header dividers: `border-line-soft` → `border-navy-700`
  - Active nav: `bg-primary-50 text-primary-700` → `bg-neon-500/15 text-neon-300`
  - Inactive nav: `text-ink-light hover:bg-bg-subtle hover:text-ink` → `text-navy-body hover:bg-navy-700 hover:text-navy-ink`
  - Sidebar splitter resting: `bg-line-soft border-transparent hover:bg-sky-50 hover:border-sky-200` → `bg-navy-700 border-transparent hover:bg-neon-500/10 hover:border-neon-500/30`
  - Sidebar splitter dragging: `bg-sky-100 border-sky-300` → `bg-neon-500/15 border-neon-500/40`
  - Splitter grip dots: `bg-slate-400` → `bg-navy-muted`
  - Avatar circle bg: `bg-primary-600` → `bg-neon-500` *(white initials kept)*
  - Logout button: `text-ink-light hover:text-danger hover:bg-danger-light` → `text-navy-muted hover:text-danger hover:bg-danger-light/20`
  - Top bar: `bg-white/80 backdrop-blur-md border-b border-line-soft` → `bg-navy-900/80 backdrop-blur-md border-b border-navy-700`
  - Settings sub-nav badge "AI"/"Beta" pill: `bg-sky-100 text-sky-600` → `bg-neon-500/15 text-neon-300`
  - User name / email text: `text-ink` / `text-ink-muted` → `text-navy-ink` / `text-navy-muted`
  - Loading spinner shell: `bg-bg-base` + `border-primary-600` → `bg-navy-canvas` + `border-neon-500`
- **Opportunistic gradient swap (Q4):** the "Ask AI" pill swaps `bg-zyrix-ai-gradient` → `bg-gradient-ai-primary` (sky-cyan-violet) in this commit. Pill's `shadow-zyrix-ai-glow` also swaps to `shadow-zyrix-ai-glow-dark`. Commit message footer: `(Sprint B Phase 2c.1; +bg-gradient-ai-primary swap)`.
- **Depth elements added:** none (chrome is structural; depth lives on content cards)
- **Verification gate (§C):** type-check + lint + visual check. Note: at this commit the *page canvas is still light* (#F0F9FF) but the sidebar and top-bar are dark navy. The result is a "split" appearance — that's expected and only lasts one commit. Confirm sidebar nav active/inactive/hover/dragging states all read clearly. Check ar (RTL): sidebar mirrors to the right, splitter grip remains centered, AI/Beta pills don't push past edge.

### Commit `2c.2` — `style(theme): activate Dark Navy canvas globally (Sprint B Phase 2c.2)`

- **Files:** `app/globals.css` (only)
- **Edits:**
  - `body` rule: change `@apply bg-bg-base text-ink antialiased;` → `@apply bg-navy-canvas bg-navy-dots text-navy-body antialiased;`
  - Add `body::before { content:""; position:fixed; inset:0; pointer-events:none; background-image: var(--gradient-page-aurora-bg, theme('backgroundImage.gradient-page-aurora')); z-index:-1; }` for the page-aurora wash
  - Replace `:focus-visible { outline: 2px solid rgb(var(--color-primary-500)); outline-offset: 2px; border-radius: var(--radius-sm); }` with `:focus-visible { @apply ring-neon; outline: none; }`
  - Update `::selection` and scrollbar tones: scrollbar-track → `bg-navy-800`, scrollbar-thumb → `bg-neon-500/30 hover:bg-neon-500/50`; `::selection` → `background: rgba(56,189,248,0.25); color: #F1F5F9;`
- **Token swaps applied:** A.1 (canvas), A.4 (focus)
- **Depth elements added:** D.1 (canvas dots), D.6 (page aurora), D.3 (global focus ring)
- **Verification gate (§C) — EXTENDED:**
  - Type-check + lint
  - Mehmet visits **every page in the dashboard tree** in `en` and confirms no layout breakage:
    - `/dashboard`, `/customers`, `/deals`, `/pipeline`, `/messaging`, `/reports`, `/ai-agents`, `/settings/integrations`, `/settings/templates`, `/settings/audit`, `/settings/api`, `/settings/billing`, `/settings/security`, `/settings/users`, `/settings/roles`, `/settings/brand`, `/settings/brands`, `/settings/custom-fields`, `/settings/data-retention`, `/settings/compliance`, `/settings/scim`, `/settings/integrations/file-storage`, `/loyalty`, `/quotes`, `/commission`, `/campaigns`, `/contracts`, `/tax-invoices`, `/tax`, `/cashflow`, `/onboarding`, `/ai-cfo`, `/ai/sales`, `/ai/meetings`, `/ai/content`, `/whatsapp`, `/chat`, `/tasks`, `/templates`, `/templates/applied`, `/notifications`, `/followup`, `/session-kpis`, `/analytics`, `/analytics/builder`, `/analytics/scheduled`, `/reports/funnel`, `/reports/cohort`, `/reports/ecommerce`, `/customers/import`, `/customers/[id]` (open one), `/workflows`, `/workflows/[id]`, `/workflows/[id]/edit`, `/workflows/executions`, `/workflows/executions/[id]`
  - Quick spot-check at `ar` of `/dashboard` and `/pipeline` (the two with most flow-sensitive layout)
  - Expected outcome: every page renders against Dark Navy. Pages whose components haven't migrated yet (most of them) appear as "white card stack on dark canvas" — readable and intentional.
  - **Rollback:** if any single page totally breaks, `git reset --hard HEAD~1` is sufficient — the rest of Phase 2 remains intact.

---

# Phase 2d — AI primitives (2 commits)

**Goal:** Migrate the two reused AI building blocks before any dashboard widget that consumes them.

**Opportunistic gradient swap (Q4):** any `bg-zyrix-ai-gradient` usage encountered in this phase is replaced with `bg-gradient-ai-primary` (sky-cyan-violet). Each commit performing the swap notes it in the message footer (e.g., `+bg-gradient-ai-primary swap`).

### Commit `2d.1` — `style(ai): migrate AISidePanel to Dark Navy (Sprint B Phase 2d.1)`

- **Files:** `components/ai/AISidePanel.tsx`
- **Token swaps (per §A):** card surface, headings, body text, borders, hover row, link colors. Discover specific class set when reading the file in commit-time.
- **Depth elements added:** D.2 — one `.halo-cyan` placed at panel header top-right (absolute, behind content, masked by the panel's existing rounded clip)
- **Verification gate (§C):** type-check + lint + visual check. Open AI side panel via "Ask AI" pill on `/dashboard`. Confirm halo is visible behind the header gradient, panel surface is `navy-800`, scrollable content area is legible. Check ar — panel slides from start side correctly, halo positioned via logical inset (not `right-0`).

### Commit `2d.2` — `style(ai): migrate AITrustBadge to Dark Navy (Sprint B Phase 2d.2)`

- **Files:** `components/ai/AITrustBadge.tsx`
- **Token swaps (per §A):** confidence-tier colors stay semantic (high=emerald, medium=amber, low=red) but switch to `bg-<color>-500/15 text-<color>-300` style for dark legibility. Background of the wrapper chip → `bg-navy-700/40`, border → `border-navy-700`.
- **Depth elements added:** none
- **Verification gate (§C):** type-check + lint + visual check on `/reports` (where the badge appears alongside the AI narrative card) and on `/pipeline` deal cards. Confirm all three confidence states (high/med/low) read clearly on `bg-navy-800` cards.

---

# Phase 2e — Dashboard widgets (6 commits)

**Goal:** Migrate the six widgets composed inside `/dashboard`. Order is bottom-up: small standalone widgets first, hero last — reduces diff size for the page wrapper itself in Phase 2k.10.

**Opportunistic gradient swap (Q4):** any `bg-zyrix-ai-gradient` usage in these widgets (most likely on AIExecutiveSummary's hero accent) is replaced with `bg-gradient-ai-primary`. Each commit performing the swap notes it in the message footer.

### Commit `2e.1` — `style(dashboard): migrate AIExecutiveSummary to Dark Navy (Sprint B Phase 2e.1)`

- **Files:** `components/dashboard/AIExecutiveSummary.tsx`
- **Token swaps (per §A):** all surfaces, text, borders. Hero gradient backdrop kept (uses `bg-zyrix-ai-gradient` per A.6).
- **Depth elements added:** D.2 (`.halo-cyan` top-right), D.4 (`shadow-zyrix-ai-glow-dark` on the card), D.5 (`.ai-card-edge` for top highlight)
- **Verification gate (§C):** check on `/dashboard`. The hero card should now feel "the centerpiece" — halo glow visible, edge highlight catches at the top, AI gradient text on title still readable.

### Commit `2e.2` — `style(dashboard): migrate AIPriorityActions to Dark Navy (Sprint B Phase 2e.2)`

- **Files:** `components/dashboard/AIPriorityActions.tsx`
- **Token swaps (per §A):** card, list rows, action buttons. Priority-tag colors use the same `bg-<color>-500/15 text-<color>-300` pattern.
- **Depth elements added:** D.4 (`shadow-zyrix-ai-glow-dark` on card hover only — not resting state)
- **Verification gate (§C):** check on `/dashboard`. Action rows hover-lift slightly with the dark glow.

### Commit `2e.3` — `style(dashboard): migrate AISmartKPIGrid to Dark Navy (Sprint B Phase 2e.3)`

- **Files:** `components/dashboard/AISmartKPIGrid.tsx`
- **Token swaps (per §A):** KPI tiles, value text, hint text, icon tints, trend indicators (up = emerald-300, down = red-300, flat = neon-300).
- **Depth elements added:** D.5 (`.ai-card-edge` on each tile — the consistent top highlight gives the grid visual rhythm)
- **Verification gate (§C):** check on `/dashboard`. All tiles same height; trend chips legible; numbers stand out against `navy-800`.

### Commit `2e.4` — `style(dashboard): migrate AIRevenueBrainPanel to Dark Navy (Sprint B Phase 2e.4)`

- **Files:** `components/dashboard/AIRevenueBrainPanel.tsx`
- **Token swaps (per §A):** card, narrative text, prediction chips, sparkline colors (line stroke → `#38BDF8`, fill → `rgba(56,189,248,0.12)`).
- **Depth elements added:** D.2 (`.halo-violet` bottom-left — distinguishes from AIExecutiveSummary's cyan halo), D.4 (`shadow-zyrix-ai-glow-dark`)
- **Verification gate (§C):** check on `/dashboard`. Side-by-side with AIPriorityActions, the violet halo on RevenueBrain creates a clear "AI strategy vs. AI tactics" visual contrast.

### Commit `2e.5` — `style(dashboard): migrate AgentsWidget to Dark Navy (Sprint B Phase 2e.5)`

- **Files:** `components/dashboard/AgentsWidget.tsx`
- **Token swaps (per §A):** card, agent rows, status pills.
- **Depth elements added:** D.4 (`shadow-zyrix-ai-glow-dark` on agent rows on hover)
- **Verification gate (§C):** check on `/dashboard`. Up to 3 pending outputs displayed; each row hover-glows distinctly.

### Commit `2e.6` — `style(dashboard): migrate ConnectedStoresWidget to Dark Navy (Sprint B Phase 2e.6)`

- **Files:** `components/dashboard/ConnectedStoresWidget.tsx`
- **Token swaps (per §A):** card, store cards, sync-status indicators.
- **Depth elements added:** none (this is a content-density widget, not a hero)
- **Verification gate (§C):** check on `/dashboard`. Store cards readable; sync states (connected/syncing/error) clearly differentiated.

---

# Phase 2f — Pipeline (2 commits)

**Goal:** Migrate the Kanban board surfaces and the deal card.

**Opportunistic gradient swap (Q4):** any `bg-zyrix-ai-gradient` usage encountered (none expected on Pipeline today, but verify when reading the file at commit time) is replaced with `bg-gradient-ai-primary`. Each commit performing the swap notes it in the message footer.

### Commit `2f.1` — `style(pipeline): migrate AIPipelineBoard columns to Dark Navy (Sprint B Phase 2f.1)`

- **Files:** `components/pipeline/AIPipelineBoard.tsx` (only `StageColumn` portion)
- **Token swaps (per §A):**
  - Column header card: `bg-white border-zyrix-border` → `bg-navy-800 border-navy-700`
  - Stage tone top borders preserved as semantic accents (the 5 colored stage indicators) — kept as-is
  - Header text / count chip: text → navy-ink, chip bg → `bg-navy-700 text-navy-muted`
  - Stage value text: `text-zyrix-primary` → `text-neon-500`
  - Bottleneck warning (kept semantic): `bg-amber-50 text-amber-700` → `bg-amber-500/15 text-amber-300`
  - Stuck-deals callout: `text-red-600` → `text-red-300`
  - Drop zone resting: `bg-zyrix-cardBgAlt` → `bg-navy-700/40`
  - Drop zone over-state: `bg-zyrix-aiSurface` → `bg-neon-500/10`
  - Empty drop zone dashed border: `border-zyrix-border` → `border-navy-700`
- **Depth elements added:** D.1 (`.bg-navy-dots` overlay on resting drop zone — subtle 24px grid behind cards)
- **Verification gate (§C):** check on `/pipeline`. Drag a card to confirm drop-zone over-state glows (neon tint). Empty stage column shows the dashed-border empty hint clearly.

### Commit `2f.2` — `style(pipeline): migrate DealCard to Dark Navy (Sprint B Phase 2f.2)`

- **Files:** `components/pipeline/AIPipelineBoard.tsx` (only `DealCard` portion)
- **Token swaps (per §A):**
  - Card surface: `bg-white border-zyrix-border` → `bg-navy-800 border-navy-700`
  - Risk-tinted left border: kept as semantic (red-500 / amber-500 / emerald-500), but adjust opacity if too aggressive on dark — likely `border-l-<color>-400` for better contrast
  - Title text: → `text-navy-ink`
  - Customer name / days-in-stage: → `text-navy-muted`
  - AI score chip: `bg-zyrix-aiSurface text-zyrix-primary` → `bg-neon-500/15 text-neon-300`
  - Value text: `text-zyrix-textBody` → `text-navy-body`
- **Depth elements added:** D.4 (`shadow-zyrix-ai-glow-dark` on hover — replaces existing `hover:shadow-zyrix-card`)
- **Verification gate (§C):** check on `/pipeline`. Hover any card → glow halo around it. AITrustBadge inside the card (already migrated 2d.2) reads correctly. Open the deal drawer (Phase 2g.3 won't be migrated yet) — confirm the drawer still functions even though it's still on light styling at this stage.

---

# Phase 2g — Customers / Deals / Table (3 commits)

### Commit `2g.1` — `style(ai): migrate AITable to Dark Navy (Sprint B Phase 2g.1)`

- **Files:** `components/ai/AITable.tsx`
- **Token swaps (per §A):** wrapper, header row, body rows, sortable header chevrons, selection checkboxes, empty state, loading skeleton.
- **Depth elements added:** D.4 (`shadow-zyrix-ai-glow-dark` on row hover) — but **only** if the table's existing hover styling is hover-elevation; if it's a colored hover only (no shadow), keep the colored hover and skip the glow
- **Verification gate (§C):** check on `/customers` and `/deals` (both use AITable). Sort by a column → header chevron readable. Click a row → click-feedback visible.

### Commit `2g.2` — `style(customers): migrate customers/page to Dark Navy (Sprint B Phase 2g.2)`

- **Files:** `app/[locale]/(dashboard)/customers/page.tsx`
- **Token swaps (per §A):** title, subtitle, primary CTA (`bg-zyrix-ai-gradient` → `bg-gradient-ai-primary` per Q4 — note in commit footer), search input, filter button. Segment chip pattern: `bg-zyrix-aiSurface text-zyrix-primaryDark` → `bg-neon-500/15 text-neon-300`.
- **Depth elements added:** none
- **Verification gate (§C):** check on `/customers`. Open create modal (already on legacy styles, don't migrate it here — that's Sprint B long-tail). Search input focus uses the new `.ring-neon`.

### Commit `2g.3` — `style(deals): migrate AIDealTimelineDrawer to Dark Navy (Sprint B Phase 2g.3)`

- **Files:** `components/deals/AIDealTimelineDrawer.tsx`
- **Token swaps (per §A):** drawer surface, header, timeline event cards, inline AI insights, close button.
- **Depth elements added:** D.2 (`.halo-cyan` at drawer top — same pattern as AISidePanel from 2d.1, drawer is conceptually a side surface)
- **Verification gate (§C):** open drawer from `/pipeline` (click a deal card). Timeline events readable. Halo visible at top; doesn't interfere with content scroll. Check ar — drawer slides from start side, halo logical-inset.

---

# Phase 2h — Messaging (1 commit)

### Commit `2h.1` — `style(messaging): migrate AIMessageComposer to Dark Navy (Sprint B Phase 2h.1)`

- **Files:** `components/messaging/AIMessageComposer.tsx`
- **Token swaps (per §A):** composer wrapper, textarea, tone-variant chips, AI suggestion area, send button (`bg-zyrix-ai-gradient` → `bg-gradient-ai-primary` per Q4 — note in commit footer).
- **Depth elements added:** D.2 (`.halo-cyan` behind the AI-suggestion area — signals "this is AI-generated" visually)
- **Verification gate (§C):** check on `/messaging`. Type a message, switch tone variants, generate AI suggestion. Halo only visible when AI suggestion is shown.

---

# Phase 2i — Reports (2 commits)

### Commit `2i.1` — `style(reports): migrate reports/page to Dark Navy (Sprint B Phase 2i.1)`

- **Files:** `app/[locale]/(dashboard)/reports/page.tsx`
- **Token swaps (per §A):** title, subtitle, AI-narrative hero card (the gradient `bg-gradient-to-br from-zyrix-aiSurface via-white to-zyrix-aiSurface` becomes `bg-navy-800 bg-navy-dots` with the existing `shadow-zyrix-ai-glow` swapped to `shadow-zyrix-ai-glow-dark`), type tabs (active = `bg-neon-500 text-white`, inactive = `border-navy-700 bg-navy-800 text-navy-body hover:bg-navy-700`), insight cards, chart card wrappers, per-chart AI interpretation footer (`bg-zyrix-aiSurface border-l-zyrix-primary` → `bg-navy-700 border-l-neon-500`).
- **Depth elements added:** D.2 (`.halo-cyan` on the AI-narrative hero), D.5 (`.ai-card-edge` on the AI-narrative hero), D.4 (`shadow-zyrix-ai-glow-dark` already covered above)
- **Verification gate (§C):** check on `/reports`. Switch report types (sales/pipeline/customers/revenue) — each renders the hero + insights + charts. Charts at this commit will still render with legacy hex colors — that's fixed in 2i.2.

### Commit `2i.2` — `style(reports): migrate recharts inline hex colors to Dark Navy (Sprint B Phase 2i.2)`

- **Files:** `app/[locale]/(dashboard)/reports/page.tsx` (the `ChartCard` portion only)
- **Hex swaps:**
  - `CartesianGrid stroke="#E2E8F0"` → `stroke="#243766"` *(navy-700)*
  - `XAxis stroke="#64748B"` and `YAxis stroke="#64748B"` → `stroke="#94A3B8"` *(navy-muted)*
  - `Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#BAE6FD' }}` → `backgroundColor: '#182A55', borderColor: '#243766', color: '#F1F5F9'` *(navy-800 / navy-700 / navy-ink)*
  - `Bar fill="#0EA5E9"` → `fill="#38BDF8"` *(neon-500 — Q2 decision: upgrade for more pop on dark)*
  - `Line stroke="#0EA5E9" dot={{ fill: '#0EA5E9' }}` → `stroke="#38BDF8" dot={{ fill: '#38BDF8' }}` *(neon-500 — Q2)*
- **Token swaps applied:** none (these are hard-coded hex strings, not Tailwind classes — separate commit because they're a different mechanism)
- **Depth elements added:** none
- **Verification gate (§C):** check on `/reports`. Hover a bar/line → tooltip dark background, neon-tinted axis labels, grid lines visible but recede.

---

# Phase 2j — AI Agents (1 commit)

### Commit `2j.1` — `style(agents): migrate ai-agents/page to Dark Navy (Sprint B Phase 2j.1)`

- **Files:** `app/[locale]/(dashboard)/ai-agents/page.tsx`
- **Token swaps (per §A):** title/subtitle, tab strip (active text → `text-neon-500`, underline indicator `bg-neon-500`), tab badge (`bg-neon-500 text-white`), filter chips (active = `bg-neon-500 text-white`, inactive = `border-navy-700 bg-navy-800 text-navy-body hover:bg-navy-700`), settings cards, permission selector (selected = `border-neon-500 bg-neon-500/10 text-neon-300`, unselected = `bg-navy-700`), logs table (header `bg-navy-700`, body rows `bg-navy-800` with `border-navy-700` separators), empty state.
- **Status badges** (`bg-amber-50/text-amber-700` etc.) — **per Q5 decision: leave as-is for Sprint B**, deferred to a future "semantic tokens" sprint. Add an inline `// TODO(sprint-b-followup): migrate semantic status badges to dark-friendly tokens — see docs/sprint-b-followup.md §1` comment above the `tones` constant. Full deferred-work spec (current badges + proposed dark-tone equivalents) lives in `docs/sprint-b-followup.md` §1.
- **Depth elements added:** D.2 (`.halo-cyan` on the empty state — gives the "all caught up" empty state a focal point)
- **Verification gate (§C):** check on `/ai-agents`. All 3 tabs (pending/settings/logs) render. Filter chips work. Permission selectors highlight correctly. The Q5 status badges visibly contrast as "old style" against the new dark surface — this is intentional and documented.

---

# Phase 2k — High-density legacy pages (19 commits, Tier 1)

**Goal:** Sweep the top-density pages identified in discovery §4.1, plus `/ai-cfo` and `/whatsapp` (per Q4).

**Pattern:** each commit = one file. Token swaps only (per §A). **No new depth elements** — keeps each commit small and reviewable. Halo/dot/glow elements remain confined to AI-hero surfaces (Phase 2d–2j).

**Common message format:** `style(<scope>): migrate <route> to Dark Navy (Sprint B Phase 2k.N)`

| ID | File | Occurrences | Notes |
|---|---|---|---|
| `2k.1` | `app/[locale]/(dashboard)/loyalty/page.tsx` | 65 | Largest swap — review extra carefully |
| `2k.2` | `app/[locale]/(dashboard)/quotes/page.tsx` | 62 | |
| `2k.3` | `app/[locale]/(dashboard)/commission/page.tsx` | 58 | |
| `2k.4` | `app/[locale]/(dashboard)/campaigns/page.tsx` | 56 | |
| `2k.5` | `app/[locale]/(dashboard)/contracts/page.tsx` | 51 | |
| `2k.6` | `app/[locale]/(dashboard)/tax-invoices/page.tsx` | 48 | |
| `2k.7` | `components/workflows/WorkflowBuilder.tsx` | 46 | Used by `/workflows/[id]/edit` — visual-check that route |
| `2k.8` | `app/[locale]/onboarding/page.tsx` | 44 | Hero gradient banner — confirm contrast for AR copy |
| `2k.9` | `app/[locale]/(dashboard)/reports/ecommerce/page.tsx` | 41 | Note: separate from `reports/page.tsx` (Phase 2i) |
| `2k.10` | `app/[locale]/(dashboard)/dashboard/page.tsx` | 40 | Wraps Phase 2e widgets — confirm whole `/dashboard` reads as one cohesive screen after this lands |
| `2k.11` | `components/settings/WebhooksPanel.tsx` | 38 | Used by `/settings/integrations` |
| `2k.12` | `app/[locale]/(dashboard)/settings/integrations/page.tsx` | 37 | |
| `2k.13` | `app/[locale]/(dashboard)/settings/templates/page.tsx` | 33 | |
| `2k.14` | `app/[locale]/(dashboard)/settings/custom-fields/page.tsx` | 31 | |
| `2k.15` | `app/[locale]/(dashboard)/settings/audit/page.tsx` | 31 | |
| `2k.16` | `app/[locale]/(dashboard)/settings/api/page.tsx` | 31 | |
| `2k.17` | `app/[locale]/(dashboard)/customers/import/page.tsx` | 30 | |
| `2k.18` | `app/[locale]/(dashboard)/ai-cfo/page.tsx` | 25 | Per Q4 |
| `2k.19` | `app/[locale]/(dashboard)/whatsapp/page.tsx` | 23 | Per Q4 |

**Verification gate per commit (§C):** type-check + lint + diff review + open the affected page in `en` (and `ar` for any commit changing copy-flow-sensitive elements).

---

## Phase 2k Tier 2 — out of Sprint B (deferred to future "shared chrome" sprint)

**Decision (Mehmet, 2026-04-25):** Both groups are **out of Sprint B**. Deferred to a dedicated future "shared chrome" sprint. See `docs/sprint-b-followup.md` §2 for the deferred work item.

| File | Count | Cluster size | Notes |
|---|---|---|---|
| `app/[locale]/portal/dashboard/page.tsx` | 36 | ~3 files (`portal/page`, `portal/callback`, `portal/dashboard`) | Customer-facing portal (the merchant's customer logs in here) |
| `components/admin/AdminCompanyDetailsView.tsx` | 35 | ~25 files in `components/admin/*` | Zyrix-internal staff admin (Mehmet & team manage merchants here) |

Audit-scope rationale: the audit's "AI Business OS" framing targets the *merchant* product surface. Portal is for the merchant's customers; admin is for Zyrix-internal staff. Both have legitimate visual-identity questions of their own and should be planned in a separate sprint.

---

# Phase 2l — RTL / i18n visual QA (2–3 commits, opportunistic)

**Goal:** systematic walk through every migrated page in en / ar / tr, fix RTL-specific issues only.

**Pattern:** one commit per cluster of related fixes. May be 0 commits if Phases 2c–2k pass cleanly.

### Commit `2l.1` — `style(rtl): fix logical-inset positioning on halos (Sprint B Phase 2l.1)` *(if needed)*

- **Files:** any component where a halo or icon was positioned with physical `right-N` / `left-N` instead of `inset-inline-start` / `inset-inline-end`. Found by visual QA on `ar` pages.
- **Verification gate (§C):** confirm halo/icon position is mirrored correctly in ar.

### Commit `2l.2` — `style(rtl): suppress gradient-text on AR letterforms (Sprint B Phase 2l.2)` *(if needed)*

- **Files:** any component where `.text-gradient` (or analogous) was inadvertently applied to a translatable string that includes Arabic characters.
- **Verification gate (§C):** confirm AR text renders as solid `text-navy-ink`, not as gradient-clipped.

### Commit `2l.3` — `style(i18n): targeted layout fixes for tr copy length (Sprint B Phase 2l.3)` *(if needed)*

- **Files:** any component where a button/label overflows in `tr` because Turkish words run longer.
- **Verification gate (§C):** confirm at `tr` no text-overflow.

---

# Phase 2m — Deprecation pass (1 commit)

### Commit `2m.1` — `chore(theme): mark legacy light-bg tokens as deprecated (Sprint B Phase 2m)`

- **Files:** `tailwind.config.ts`, `lib/theme/zyrixTheme.ts`
- **Edits:**
  - In `tailwind.config.ts`: above each of `primary.*`, `sky.*`, `azure.*`, `cyan.*`, `bg.*`, `ink.*`, `line.*`, `zyrix.bg`, `zyrix.cardBg`, `zyrix.cardBgAlt`, `zyrix.aiSurface`, `zyrix.aiBorder`, `zyrix.textHeading`, `zyrix.textMid`, `zyrix.textBody`, `zyrix.textMuted`, `zyrix.border`, `zyrix.borderSky`, add `// @deprecated — Sprint B migration (Apr 2026). Use navy-* / neon-* equivalents (see §A token-swap legend in docs/sprint-b-implementation-plan.md).`
  - In `lib/theme/zyrixTheme.ts`: add file-header note `// @deprecated for new code as of Sprint B. Existing JS-side consumers preserved during migration window. New JS-side consumers should reach for the (forthcoming) navyTheme export added in a follow-up sprint.`
- **No deletions.** Migration cleanup (token removal) deferred to a post-Sprint-F follow-up sprint, after long-tail mid-density components and remaining 100+ low-density files have been opportunistically swept.
- **Token swaps applied:** none (comment-only)
- **Depth elements added:** none
- **Verification gate (§C):** type-check + lint. Confirm the deprecation comments are picked up by editor tooling (TypeScript LSP shows strikethrough on hover for deprecated members).

---

# Phase 2 — Summary

| Phase | Commits | Description |
|---|---|---|
| 2a | 1 | Token addition (`tailwind.config.ts`) |
| 2b | 1 | Utility addition (`globals.css`) |
| 2c | 2 | Shell chrome migration + canvas global flip |
| 2d | 2 | AI primitives (Side Panel, Trust Badge) |
| 2e | 6 | Dashboard widgets (one per widget) |
| 2f | 2 | Pipeline (board + deal card) |
| 2g | 3 | Customers / AI Table / Deal Drawer |
| 2h | 1 | Messaging composer |
| 2i | 2 | Reports (page + recharts hex) |
| 2j | 1 | AI Agents page |
| 2k | 19 | High-density legacy pages (Tier 1) |
| 2l | 0–3 | RTL/i18n QA (opportunistic) |
| 2m | 1 | Deprecation pass |
| **Total** | **41–44** | |

Tier 2 (portal/admin) excluded by recommendation; if approved, adds ~3 commits (portal cluster) and ~15–20 commits (admin cluster).

---

# Decisions on plan clarifications (approved by Mehmet 2026-04-25)

1. **Tier 2 (`/portal/*`, `/components/admin/*`):** **Out of Sprint B.** Deferred to a dedicated future "shared chrome" sprint. Captured in `docs/sprint-b-followup.md` §2. Phase 2k holds at **19 commits**.
2. **Recharts color upgrade (Phase 2i.2):** **Upgrade to `#38BDF8`** (`neon-500`) for bars and lines. Phase 2i.2 entry above is now locked to the new hex; no "keep `#0EA5E9`" fallback.
3. **Phase 2c.2 verification approach:** **Manual route walk by Mehmet only.** No Playwright commit. The ~50-route walk list is documented in the Phase 2c.2 entry above.
4. **`bg-zyrix-ai-gradient` swap policy:** **Replace opportunistically** with `bg-gradient-ai-primary` (sky-cyan-violet) as each component is migrated. Every commit performing the swap notes it explicitly in the message footer (e.g., `(Sprint B Phase 2e.1; +bg-gradient-ai-primary swap)`). §A.6 entry, Phase 2c.1 entry, Phase 2d/2e/2f preambles, and Phase 2g.2 / 2h.1 entries all updated accordingly.
5. **Status-badge follow-up doc:** **Both** — `docs/sprint-b-followup.md` is created alongside this plan, AND inline `// TODO(sprint-b-followup):` comments are added at the relevant code sites (e.g., `ai-agents/page.tsx` `tones` constant in commit 2j.1). The plan and the followup doc commit together so they're never out of sync.

---

**End of Sprint B Phase 2 Implementation Plan.**
**Plan finalized 2026-04-25. Awaiting Mehmet approval to author Commit `2a.1`.**
