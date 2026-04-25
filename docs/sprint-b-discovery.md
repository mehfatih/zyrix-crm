# Sprint B Discovery Report — Design System + Identity Migration

**Sprint:** B (Design System + Identity Migration)
**Phase:** 1 — Discovery (read-only)
**Author:** Claude (with Mehmet)
**Date:** 2026-04-25
**Last commit on main at start of discovery:** `16be5ed` — `docs(sprint-a): link backend ticket #1 in final report §9.1`
**Status:** Awaiting Mehmet review before any Phase 2 implementation

---

## 1. Current color tokens

### 1.1 `tailwind.config.ts` — `theme.extend.colors`

The Tailwind config currently exposes **eleven** color namespaces. The header comment (lines 7–11) explicitly states "Brand rule: NO dark or gloomy colors anywhere. Palette is exclusively cyan / sky / azure tones." This rule is in direct conflict with the Sprint B target (Dark Navy #112044) and will need to be rewritten as part of Phase 2a — flagged here so it doesn't trip a future reader.

| Namespace | Stops | Notes |
|---|---|---|
| `primary` | 50–950 + DEFAULT (#0891B2) | Cyan scale — KERNEL = `primary.600` (#0891B2) |
| `sky` | 50–900 | Tailwind-default sky scale |
| `azure` | 50–700 + DEFAULT (#38BDF8) | Bright blue scale |
| `cyan` | 50–900 | Cyan scale (large overlap with `primary`) |
| `success` / `warning` / `danger` / `info` | `light`, DEFAULT, `dark` | Semantic tones |
| `bg` | `base` (#F0F9FF), `card` (#ECFEFF), `subtle`, `elevated` (#FFF), `muted` | Light surfaces only |
| `ink` | DEFAULT (#164E63), `mid`, `light`, `muted`, `inverse` (#FFF) | Dark-cyan text on light bg |
| `line` | DEFAULT (#BAE6FD), `soft` (#E0F2FE), `strong` (#7DD3FC) | Sky-tinted borders |
| Mobile accent palette (flat) | `coral` `peach` `mint` `lavender` `sunshine` `sky-bright` `rose-accent` `teal-bright` | Single shades each |
| `zyrix.*` (NEW STANDARD — Apr 2026) | 21 keys | The current "modern" namespace — see below |

The `zyrix.*` namespace, introduced 2026-04-25 alongside `lib/theme/zyrixTheme.ts`, exposes:
`primary` `primaryDark` `primaryLight` `accent` `azure` `sky` `bg` `cardBg` `cardBgAlt` `aiSurface` `aiBorder` `textHeading` `textMid` `textBody` `textMuted` `border` `borderSky` `success` `warning` `danger`. Anchors: `primary` = `#0EA5E9`, `bg` = `#F0F9FF`, `cardBg` = `#FFFFFF`, `aiSurface` = `#F0F9FF`, `aiBorder` = `#BAE6FD`, `textHeading` = `#0C4A6E`.

### 1.2 Other relevant `theme.extend` entries

- **boxShadow** — cyan-tinted only: `xs`/`sm`/DEFAULT/`md`/`lg`/`xl`/`2xl`/`inner`/`none`, plus `glow` and `glow-lg` (cyan rgba), plus `zyrix-card`, `zyrix-card-hover`, `zyrix-ai-glow` (all rgba(14,165,233,…) — sky-tinted).
- **backgroundImage** — 13 gradients: `zyrix-gradient`, `zyrix-hero`, `zyrix-cta`, `zyrix-accent`, `zyrix-soft`, `shimmer`, `grid-pattern`, `hero-gradient`, `premium-gradient`, `celebration-gradient`, `success-gradient`, `zyrix-ai-gradient`, `zyrix-soft-gradient`. All use cyan/sky/violet stops; none target dark navy.
- **fontFamily** — `cairo`, `inter`, `sans` (Inter→Cairo→fallbacks), `mono` (JetBrains Mono).
- **keyframes** — `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideInRight`, `slideInLeft`, `scaleIn`, `pulseSoft`, `shimmer`, `float`. Animation easings via `transitionTimingFunction.{out-expo, in-out-expo, smooth}`.
- **borderRadius** — extras: `4xl` (2rem), `5xl` (2.5rem).
- **spacing** — `18`, `22`, `26`, `30`, `128`, `144` extras.
- **container** — centered with breakpoints up to `2xl: 1400px`.
- **darkMode** — `"class"` is enabled but unused (the comment notes "we won't use dark colors").

---

## 2. `lib/theme/zyrixTheme.ts` — exports

File header: *"Zyrix Sky Blue Theme — Unified Mobile + Web Standard. Adopted: 2026-04-25. Replaces previous Cyan #0891B2 standard."*

Three named exports (all `as const`):

- **`zyrixTheme`** — flat object, 21 keys: `primary` `primaryDark` `primaryLight` `accent` `azure` `sky` `bg` `cardBg` `cardBgAlt` `aiSurface` `aiBorder` `textHeading` `textMid` `textBody` `textMuted` `border` `borderSky` `success` `warning` `danger` `info`. Mirrors the `zyrix.*` namespace in `tailwind.config.ts` exactly (single source of truth duplicated in two places — relevant for migration since both must be updated together).
- **`zyrixGradients`** — `ai`, `soft`, `primary`. Used wherever JS-side gradient strings are needed (e.g., inline `style.background`).
- **`zyrixShadows`** — `card`, `cardHover`, `aiGlow`. Same role.

---

## 3. `app/globals.css` — full inventory

### 3.1 CSS custom properties (`:root`)

- **Color triplets (RGB, used with `rgb(var(--…))`)**: `--color-primary-50..900`, `--color-sky-50..500`, `--color-bg-{base,card,subtle,elevated}`, `--color-ink`, `--color-ink-mid`, `--color-ink-light`, `--color-line`, `--color-line-soft`, `--color-{success,warning,danger,info}`.
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow` (all cyan-tinted).
- **Brand gradients**: `--gradient-hero`, `--gradient-cta`, `--gradient-accent`.
- **Mobile accent palette**: `--primary` (#0EA5E9), `--primary-light`, `--primary-lighter`, `--bg`, `--surface`, `--coral`, `--peach`, `--mint`, `--lavender`, `--sunshine`, `--sky-bright`, `--rose`, `--teal-bright`.
- **Decorative gradients**: `--hero-gradient`, `--premium-gradient`, `--celebration-gradient`, `--success-gradient`.
- **Easings**: `--ease-out-expo`, `--ease-smooth`.
- **Layout**: `--header-height: 72px`, `--container-max: 1400px`.
- **Radii**: `--radius-{sm,md,lg,xl,2xl}`.

### 3.2 Custom utility classes (`@layer components`)

`.glass`, `.glass-soft`, `.text-gradient`, `.hero-bg` (with `::before` containing two radial gradients — already a "depth element" pattern but in light tones), `.btn-cta`, `.btn-secondary`, `.card`, `.card-gradient`, `.badge`, `.badge-dot`, `.section`, `.container-zyrix`, `.shimmer` (with local `@keyframes shimmer`), `.bg-{hero,premium,celebration,success}-gradient`, `.text-{coral,peach,mint,lavender,sunshine,rose-accent,teal-bright}`, `.bg-{coral,peach,mint,lavender,sunshine,sky-bright,rose,teal-bright}-soft`, `.hero-celebration-bg` (with `::before` 15%-opacity gradient overlay), `.grain-texture` (radial-dot pattern at 24px — already an existing "dots" depth element, but at light tone), `.divider`, `.divider-gradient`.

### 3.3 Utility helpers (`@layer utilities`)

`.no-scrollbar`, `.ms-auto-rtl`, `.me-auto-rtl`, `.text-balance`, `.text-pretty`, `.pt-safe` / `.pb-safe` / `.ps-safe` / `.pe-safe` (iOS notch logical insets), and a `prefers-reduced-motion` global override that clamps animation/transition durations to `0.01ms`.

### 3.4 Base layer behaviors worth knowing before touching styles

- `body` defaults to `bg-bg-base` (#F0F9FF) + `text-ink` — the page canvas is locked to a light sky tint at the base layer; switching to dark navy means **rewriting this rule**, not just adding new utilities.
- `html[lang="ar"]` switches the body font to Cairo. `html[lang="en"]` and `html[lang="tr"]` use Inter. RTL is handled via `[dir="rtl"]` text-align rule and the `.ms-*-rtl` / `.me-*-rtl` / `.ps-safe` / `.pe-safe` logical-property utilities.
- `:focus-visible` global outline is `2px solid rgb(var(--color-primary-500))` with 2px offset — this needs to migrate to a neon/navy double-ring (proposal in §6).
- `::selection` and scrollbar are also cyan-tinted.

### 3.5 Keyframes

Defined globally via Tailwind config (§1.2). Inside `globals.css`, only `shimmer` keyframes are re-declared (inside `.shimmer`'s component block).

---

## 4. Files using `sky-*` / `cyan-*` / `zyrix-*` classes

Pattern grepped (TS/TSX/JS/JSX): `(bg|text|border|ring|from|to|via|fill|stroke|placeholder|divide|outline|shadow|decoration|caret|accent)-(sky|cyan|zyrix)-?\w*`.

**Total: 2,600 occurrences across 170 files.**

### 4.1 Top 20 files by occurrence count (migration priority list)

| # | Count | File |
|---|---|---|
| 1 | 65 | `app/[locale]/(dashboard)/loyalty/page.tsx` |
| 2 | 62 | `app/[locale]/(dashboard)/quotes/page.tsx` |
| 3 | 58 | `app/[locale]/(dashboard)/commission/page.tsx` |
| 4 | 56 | `app/[locale]/(dashboard)/campaigns/page.tsx` |
| 5 | 51 | `app/[locale]/(dashboard)/contracts/page.tsx` |
| 6 | 48 | `app/[locale]/(dashboard)/tax-invoices/page.tsx` |
| 7 | 46 | `components/workflows/WorkflowBuilder.tsx` |
| 8 | 44 | `app/[locale]/onboarding/page.tsx` |
| 9 | 41 | `app/[locale]/(dashboard)/reports/ecommerce/page.tsx` |
| 10 | 40 | `app/[locale]/(dashboard)/dashboard/page.tsx` |
| 11 | 38 | `components/settings/WebhooksPanel.tsx` |
| 12 | 37 | `app/[locale]/(dashboard)/settings/integrations/page.tsx` |
| 13 | 36 | `app/[locale]/portal/dashboard/page.tsx` |
| 14 | 35 | `components/admin/AdminCompanyDetailsView.tsx` |
| 15 | 34 | `app/[locale]/(dashboard)/ai-agents/page.tsx` |
| 16 | 33 | `app/[locale]/(dashboard)/settings/templates/page.tsx` |
| 17 | 31 | `app/[locale]/(dashboard)/settings/custom-fields/page.tsx` |
| 18 | 31 | `app/[locale]/(dashboard)/settings/audit/page.tsx` |
| 19 | 31 | `app/[locale]/(dashboard)/settings/api/page.tsx` |
| 20 | 30 | `app/[locale]/(dashboard)/customers/import/page.tsx` |

### 4.2 Distribution observations

- The 170-file footprint divides into roughly three buckets:
  1. **Top-20 high-density pages (~700 occurrences total)** — mostly raw `bg-sky-*` / `text-sky-*` patterns. These are the legacy *light-cyan* surfaces.
  2. **Mid-density components (~50 files at 10–30 occurrences each)** — a mix of `zyrix-*` (newer) and `sky-*` (older). The dashboard widgets, AI side panel, AI table, brand switcher live here.
  3. **Long tail (~100 files at 1–10 occurrences each)** — small leaks of `bg-sky-50` for badges, `text-sky-700` for labels, etc. These are quick wins per file but high in count.
- **Two visual generations coexist today**: pages that were touched in the "Apr 2026 Sky Blue Theme" upgrade (Pipeline, Customers, Reports, AI-Agents — all already on `zyrix.*` tokens) feel one generation newer than the older pages still using raw `sky-*`. Phase 2 is the right opportunity to consolidate everything onto a single new namespace.
- Out of scope for Sprint B (only flagged so we don't accidentally move them): `lib/ai/*` (Sprint C), Prisma layer, anything in `messages/*.json` (string content, not styling).

---

## 5. Current visual style — five target pages

Descriptions are based on reading `page.tsx` files plus the chrome (`DashboardShell.tsx`) and the pipeline board component.

### 5.1 Shell chrome (`DashboardShell.tsx`) — applies to all five

- Page canvas: `bg-bg-base` (#F0F9FF, very light sky).
- Sidebar: white background, `border-line-soft` (#E0F2FE) right border, fixed 16rem width.
- Active nav item: `bg-primary-50` background + `text-primary-700` text (cyan). Hover: `bg-bg-subtle` (#F8FAFC).
- Avatar bubble: solid `bg-primary-600` (#0891B2) circle with white initials.
- Top bar: `bg-white/80 backdrop-blur-md`, `border-b border-line-soft`. Hosts a `GlobalSearchBar` and an "Ask AI" pill that uses `bg-zyrix-ai-gradient` + `shadow-zyrix-card hover:shadow-zyrix-ai-glow` — this single pill is the only modern AI-gradient element on the entire chrome.
- Sidebar splitter (resizable region): `bg-line-soft` resting, `bg-sky-100 border-sky-300` while dragging — drags between two scroll regions (main nav vs. settings sub-tree).
- Badge chip in nav (e.g., AI / Beta): `bg-sky-100 text-sky-600` — legacy sky.
- Verdict: chrome is squarely in the *legacy light-cyan* generation.

### 5.2 `/dashboard`

- Heavy use of `bg-white`, `border border-sky-100`, `rounded-xl` cards laid out in 2/3/4-column grids on `lg`.
- Loading spinner: `text-sky-500`. Error block: `bg-red-50 text-red-700`.
- Hero title: `text-2xl font-bold text-sky-900`; subtitle in `text-slate-500`.
- Onboarding banner (when active): `bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500` (light sky gradient), white text, with a single `w-48 h-48 bg-white/10 rounded-full blur-3xl` decorative circle pinned top-right. **This single blur-circle is the only depth element on the dashboard today.**
- KPI cards: `bg-white border border-sky-100 rounded-xl p-4`, icon tile in `bg-sky-50 text-sky-500`, value in `text-sky-900`.
- Mini KPI strip: `bg-gradient-to-br from-white to-sky-50/30 border border-sky-100`.
- Panels: `bg-white border border-sky-100`, header bar `bg-sky-50/50`, section dividers `divide-y divide-sky-50`, hover row `hover:bg-sky-50/30`.
- Mixed semantic accents: `bg-emerald-50 text-emerald-600` (revenue), `bg-amber-50 text-amber-600` (overdue), `from-amber-400 to-orange-500` gradient avatars (rank #1), `from-sky-300 to-sky-400` (default rank).
- Verdict: classic light-SaaS aesthetic. No glow, no dot grid, single decorative blur. The audit's "feels weaker than mobile" critique is well-founded.

### 5.3 `/pipeline`

- Layout: `space-y-5 p-4 sm:p-6 lg:p-8` (the modern padding pattern).
- Title: `text-zyrix-textHeading` (#0C4A6E); subtitle: `text-zyrix-textMuted`.
- Board rows: 5 stage columns at `w-72`, each with a colored top border (`border-t-slate-400` / `border-t-sky-500` / `border-t-cyan-500` / `border-t-amber-500` / `border-t-emerald-500`) — these are the only raw `sky-*` / `cyan-*` references left in this file.
- Column header: white card, count chip in `bg-zyrix-cardBgAlt text-zyrix-textMuted`, total-value in `text-zyrix-primary`. Bottleneck warning in `bg-amber-50 text-amber-700`.
- Drop zone: `bg-zyrix-cardBgAlt` (#F8FAFC) resting, `bg-zyrix-aiSurface` (#F0F9FF) when something hovers over it.
- Deal cards: `bg-white border-zyrix-border border-l-[3px]` with risk-tinted left border (`border-l-red-500` / `border-l-amber-500` / `border-l-emerald-500`), `hover:shadow-zyrix-card`. Score chip uses `bg-zyrix-aiSurface text-zyrix-primary`.
- Verdict: already on `zyrix.*` tokens, pipeline is the most modern of the five. Still light. No depth elements beyond the subtle `shadow-zyrix-card` hover lift.

### 5.4 `/customers`

- Same modern padding rhythm as Pipeline.
- Primary CTA ("Create"): `bg-zyrix-ai-gradient text-white shadow-zyrix-card hover:shadow-zyrix-card-hover` — the AI gradient pill (sky-cyan-blue) is reused here.
- Search input: `border-zyrix-border bg-white focus:border-zyrix-primary` — search icon positioned with `start-3` (RTL-safe).
- Filter button: white surface, `border-zyrix-border`, `hover:bg-zyrix-cardBgAlt`.
- AI table rows use the segment chip pattern: `bg-zyrix-aiSurface text-zyrix-primaryDark`.
- Verdict: already migrated to `zyrix.*`. Clean and modern *for the Sky standard* — but exactly the kind of light surface the audit is asking us to retire.

### 5.5 `/reports`

- Hero AI-narrative card: `bg-gradient-to-br from-zyrix-aiSurface via-white to-zyrix-aiSurface border-zyrix-aiBorder shadow-zyrix-ai-glow` — the cleanest example of the "AI surface" pattern in the app today. The Sparkles label is in `text-zyrix-primary`.
- Type tabs: active = `bg-zyrix-primary text-white`, inactive = `border-zyrix-border bg-white text-zyrix-textBody`.
- Insight cards: `border-zyrix-border bg-white rounded-xl p-4` (3-column on `lg`).
- Charts: white cards with bar/line plotted in `#0EA5E9`, axes in `#64748B` slate, grid lines `#E2E8F0`, tooltip border `#BAE6FD` — these hex values are inline in the recharts JSX and will need a coordinated migration sweep.
- Per-chart AI interpretation footer: `bg-zyrix-aiSurface border-l-[3px] border-zyrix-primary` — the recurring "AI interpretation" pattern.
- Verdict: this page sets the tone for what an "AI Surface" feels like in the current Sky standard. It's the closest existing analogue to what the dark-navy version should aspire to.

### 5.6 `/ai-agents`

- Tab strip: `border-b border-zyrix-border`. Active tab: `text-zyrix-primary` with an `absolute bottom-[-1px] h-0.5 bg-zyrix-primary` underline indicator. Tab badge: `bg-zyrix-primary text-white` rounded-md pill.
- Filter chips: active = `bg-zyrix-primary text-white`, inactive = `border border-zyrix-border bg-white text-zyrix-textBody hover:bg-zyrix-cardBgAlt`. Inactive chip count nested in `bg-zyrix-aiSurface text-zyrix-primary`.
- Settings cards: `bg-white border border-zyrix-border rounded-xl p-5`. Permission level buttons: selected = `border-zyrix-primary bg-zyrix-aiSurface text-zyrix-primary`, unselected = `bg-zyrix-cardBgAlt`.
- Logs table: white surface, header in `bg-zyrix-cardBgAlt`. Status badges still use legacy `bg-amber-50 text-amber-700`, `bg-emerald-50 text-emerald-700`, `bg-sky-50 text-sky-700`, `bg-slate-50 text-slate-600` — a place where the "two visual generations" mix shows up most clearly.
- Empty state uses `Sparkles` icon in `text-zyrix-primary` — same recurring AI motif.
- Verdict: most consistent on the new tokens; the only residue is the status-badge color block.

---

## 6. Reference design assets received

**None.** Mehmet has explicitly stated that no mobile-app screenshots or audit-design references will be supplied. Sprint B will instead operate from a written design proposal (§7 below), grounded in:

- MASTER_GUIDE §5 directive: Dark Navy (#112044) base + neon blue gradient + depth elements (circles, dots, glow).
- The audit's stated direction: "AI Business OS" visual language.
- Industry conventions for dark-navy SaaS dashboards — specifically Linear, Vercel, Stripe Dashboard, and Resend (referenced where each contributes a specific decision).
- The hard constraint that Arabic (RTL) must remain pixel-correct.

This is documented as a deviation from the original Sprint B skeleton (which assumed reference assets would arrive). Mehmet's approval of the proposal in §7 stands in for the missing screenshots.

---

## 7. Proposed design language *(D1.6 — written, in lieu of reference screenshots)*

### 7.1 Palette spec — Dark Navy + Neon Blue (additive to existing tokens)

**Surface ladder** (4 navy stops + 1 page canvas):

| Token | Hex | Role |
|---|---|---|
| `navy-canvas` | `#0A1530` | Page canvas — one notch darker than the brand base, gives content room to breathe |
| `navy-900` | `#112044` | **THE BRAND BASE — locked by audit.** Dashboard surface the eye lands on |
| `navy-800` | `#182A55` | Card surface — sits on canvas with visible elevation |
| `navy-700` | `#243766` | Elevated card / hover state / popover |
| `navy-600` | `#324A82` | Border on dark / disabled chip / divider on dark |

> *Rationale:* Five stops give Stripe-Dashboard-style depth without the muddy-gray feel of a single dark surface. Two cards stacked on the same surface should still be visually separable — the `navy-800 → navy-700` transition does that. (Stripe uses ~4 surface levels in their signed-in dashboard for the same reason.)

**Neon blue accents** (3 stops):

| Token | Hex | Role |
|---|---|---|
| `neon-300` | `#7DDFFF` | Highlight / link-hover / icon glints / glow halo |
| `neon-500` | `#38BDF8` | **DEFAULT primary action** — the new "neon" anchor. Already exists today as `azure.DEFAULT` |
| `neon-600` | `#0EA5E9` | Equals today's `zyrix.primary` — kept as alias so the migration doesn't break in flight |

> *Rationale:* `#38BDF8` lifts off `#112044` with clear AA+ contrast and reads as "neon" without crossing into the saturated cyan that current AI badges use. Keeping `neon-600 = #0EA5E9` lets every existing `bg-zyrix-primary` and `text-zyrix-primary` keep working through the migration window.

**Inverted text tokens for dark surfaces**:

| Token | Hex | Role | Replaces (light-bg equivalent) |
|---|---|---|---|
| `navy-ink` | `#F1F5F9` (slate-100) | H1/H2 on dark | `text-zyrix-textHeading` (#0C4A6E) |
| `navy-body` | `#CBD5E1` (slate-300) | Body text on dark | `text-zyrix-textBody` (#1E293B) |
| `navy-muted` | `#94A3B8` (slate-400) | Captions, labels, time stamps | `text-zyrix-textMuted` (#64748B) |

> *Rationale:* Pure white shimmers against navy for Arabic readers (Cairo's heavier strokes amplify it). Slate-100 sits one step softer and tests cleanly against `#112044` at AA. Body and muted tones are dropped two steps each so the visual hierarchy stays the same shape it has on the light theme.

### 7.2 Gradient spec — the "AI Business OS" signature

| Name | Definition | Where it lives |
|---|---|---|
| `gradient-ai-primary` | `linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #7C3AED 100%)` | Primary AI buttons, "Ask AI" pill, hero card edges |
| `gradient-ai-glow` | `radial-gradient(circle at 30% 20%, rgba(56,189,248,0.18), transparent 60%)` | Hero card backgrounds (sits behind content) |
| `gradient-ai-edge` | `linear-gradient(180deg, rgba(56,189,248,0.12), rgba(56,189,248,0))` | Top-edge highlight on cards (mimics light hitting glass) |
| `gradient-page-aurora` | Two stacked radial gradients at low opacity, applied once at the page-canvas level | Whole-page atmospheric wash |

> *Rationale:* The violet endpoint (`#7C3AED`) on `gradient-ai-primary` is a *new* accent — it carries the "AI" signal that pure blue can't (Vercel and Resend both lean into a blue→violet transition for AI-marked features). The page-aurora pattern (one big subtle wash at the canvas, then content cards on top of it) is the Resend marketing-page pattern adapted to a logged-in dashboard. The edge highlight is borrowed from Linear's elevated cards, where a 1px top-edge gradient gives every card the "lit from above" feel without needing real shadows.

### 7.3 Depth elements (the audit's "circles, dots, glow")

1. **Dot grid background** — new utility `.bg-navy-dots`
   - `background-image: radial-gradient(rgba(125,223,255,0.05) 1px, transparent 1px); background-size: 24px 24px;`
   - The dark equivalent of the existing `.grain-texture` (which is light-tone). Used on page canvas, AI hero cards, and empty-state focal areas.
   - *Reference:* Linear uses ~32px grids at ~5% opacity to add depth without distraction.

2. **Soft circle halos** — new utilities `.halo-cyan`, `.halo-violet`
   - Single absolutely-positioned `<div>`, ~400×400px, `blur-3xl`, opacity 0.20–0.30.
   - Promotes the existing one-off pattern (the dashboard banner already uses `w-48 h-48 bg-white/10 rounded-full blur-3xl`) to a reusable component-layer utility, in dark-friendly tones.
   - Used on: AI hero cards (one halo top-right), CTA hover states, empty-state focal points.

3. **Ring-glow on focus** — new utility `.ring-neon`
   - `box-shadow: 0 0 0 2px #112044, 0 0 0 4px rgba(56,189,248,0.55);`
   - Double-ring trick: inner ring matches the surface so the outer neon ring "floats" — Linear and Vercel both use this pattern.
   - **Replaces** the global `:focus-visible { outline: 2px solid var(--color-primary-500) }` in `globals.css` §3.4.

4. **Card edge glow on hover** — extends `shadow-zyrix-ai-glow`
   - New variant `shadow-zyrix-ai-glow-dark` = `0 0 0 1px rgba(56,189,248,0.25), 0 8px 32px -8px rgba(56,189,248,0.35)`.
   - Used on: AI Pipeline cards, Smart KPI grid, primary AI hero cards.

### 7.4 Typography decisions

- **No font change.** Inter (EN/TR) and Cairo (AR) stay exactly as wired in `globals.css` §3.4 — the audit doesn't request a font swap, and changing fonts mid-migration would compound RTL risk.
- **Heading color flip only**: `text-zyrix-textHeading` → `text-navy-ink`, `text-zyrix-textBody` → `text-navy-body`, `text-zyrix-textMuted` → `text-navy-muted` (see §7.1 table).
- **No gradient-text on Arabic letterforms.** Gradient text (`.text-gradient` and analogues) only applied to icons, numerals, and Latin labels — Arabic glyphs render unevenly under `-webkit-background-clip: text` because of the connecting strokes. Verified pattern: keep AR labels in solid `text-navy-ink`.
- All `tracking-tight` already declared on `h1`/`h2` in base layer — no change needed.

### 7.5 Focus / hover / active state spec

| State | Pattern | Notes |
|---|---|---|
| Focus | `.ring-neon` (§7.3.3) | Replaces global `:focus-visible` outline |
| Hover (interactive surfaces) | `hover:bg-navy-700` + `hover:shadow-zyrix-ai-glow-dark` | Surface ladder up one notch, plus glow |
| Hover (text links) | `hover:text-neon-300` | Replaces `hover:text-sky-900` (which only worked on light bg) |
| Active (pressed) | `active:scale-[0.98]` | Preserved from current `.btn-cta` pattern |
| Disabled | `opacity-50 cursor-not-allowed` | Preserved from current base layer |

### 7.6 RTL preservation strategy

- All depth-element utilities use `inset-0` or symmetric positioning — never `left-N` / `right-N` literals — so the Arabic mirror happens automatically.
- Halos placed off-center use `inset-inline-start` / `inset-inline-end` (logical properties) rather than physical `left` / `right`.
- No gradient text on Arabic content (§7.4).
- Arrow-icon flipping pattern already used in the codebase (`-scale-x-100` for `locale === "ar"`) is preserved.
- Dashboard splitter, sidebar, AI side panel — all already use `ms-*` / `me-*` / `start-*` / `end-*`. No mirroring regressions expected from the dark-mode swap alone.

---

## 8. Migration approach proposal — additive, file-by-file

The core principle (per Sprint B skeleton §"Special design rule"): **the new palette must be additive at first.** No `sky-*` / `primary-*` / `zyrix.*` token gets removed in Phase 2a–2k. Removal happens only in Phase 2l, after every targeted file has migrated and the visual QA gate is green.

### Phase 2a — Token addition (1 commit)
Add `navy-*` + `neon-*` namespaces to `tailwind.config.ts`. Add inverted text tokens (`navy-ink`, `navy-body`, `navy-muted`). Add `gradient-ai-edge`, `gradient-ai-glow`, `gradient-page-aurora` to `backgroundImage`. Add `shadow-zyrix-ai-glow-dark`. Update the file header comment to remove the "NO dark colors" rule and note that the brand has migrated to Dark Navy as of Sprint B. **No file outside `tailwind.config.ts` changes.**

### Phase 2b — Utility addition (1 commit)
Add `.bg-navy-canvas`, `.bg-navy-dots`, `.halo-cyan`, `.halo-violet`, `.ring-neon` to `globals.css` `@layer components`. Add the dark-canvas body rule (gated by a toggle class on `<html>` so it can be flipped in the next commit, *not* applied implicitly). **No component file changes yet.**

### Phase 2c — Shell chrome (2 commits)
1. `DashboardShell.tsx` — sidebar surfaces, top bar, splitter, badge chips swap to navy ladder. The "Ask AI" button keeps `bg-zyrix-ai-gradient` (it already maps).
2. Flip the `<html>` class to activate `bg-navy-canvas` globally. After this commit, every page renders against navy.

### Phase 2d — AI primitives (2 commits)
1. `AISidePanel.tsx` — surface, header, row hover.
2. `AITrustBadge.tsx` — badge tones for confidence levels.

### Phase 2e — Dashboard widgets (6 commits, one per widget)
`AIExecutiveSummary`, `AIPriorityActions`, `AISmartKPIGrid`, `AIRevenueBrainPanel`, `AgentsWidget`, `ConnectedStoresWidget`. Each gets its dark-surface swap plus one targeted depth element (halo on the executive summary, edge-glow on KPI grid, etc.).

### Phase 2f — Pipeline (2 commits)
`AIPipelineBoard.tsx` columns + drop zones, then `DealCard` surfaces and risk-border tones.

### Phase 2g — Customers / Deals / Table (3 commits)
`AITable.tsx`, `customers/page.tsx`, `AIDealTimelineDrawer.tsx`.

### Phase 2h — Messaging (1 commit)
`AIMessageComposer.tsx`.

### Phase 2i — Reports (2 commits)
`reports/page.tsx` (cards + tabs), then a separate commit for the inline recharts hex colors (axis stroke, grid stroke, tooltip styling).

### Phase 2j — AI Agents (1 commit)
`ai-agents/page.tsx` — tabs, chips, settings cards, logs table.

### Phase 2k — High-density legacy pages (~15–20 commits)
Top-20 list from §4.1, one file per commit. Each commit: read file, swap tokens, run `npm run type-check`, hand back to Mehmet for `git diff` review before next file.

### Phase 2l — RTL/i18n visual QA (2–3 commits)
Pages reviewed in en/ar/tr. Targeted fixes only (e.g., specific halo positioned wrongly in RTL).

### Phase 2m — Deprecation pass (1 commit)
Mark `sky-*`, `primary-*`, and now-unused `zyrix.*` light-bg tokens as `// @deprecated — Sprint B migration` in `tailwind.config.ts` comments. **Do not delete.** Cleanup deletion can happen in a future sprint (likely after Sprint F) once long-tail leaks have been swept.

**Estimated total: ~38–46 commits.**

---

## 9. Backward-compat strategy

1. **Token coexistence:** Every `bg-sky-*`, `text-sky-*`, `border-line`, `text-zyrix-textHeading`, `bg-zyrix-aiSurface`, etc. continues to compile and work throughout Phase 2. A page in flight keeps rendering correctly even if half its components have migrated and half haven't.
2. **Aliases:** `neon-600` resolves to `#0EA5E9` (same as `zyrix.primary`) so any inline-style usage (`zyrixGradients`, `zyrixShadows`) continues to function until it gets explicitly migrated.
3. **`lib/theme/zyrixTheme.ts`** stays untouched in Phase 2a–2b. It gets new-token additions (a sibling `navyTheme` export) only when the first JS-side consumer actually needs the dark tokens — not speculatively.
4. **The `<html>` canvas toggle** (Phase 2c step 2) is the only "all at once" moment in the migration. Until that flip, every change is invisible to the user. After it, every unmigrated component still renders cleanly (white card on navy canvas → reads as "old card style" but doesn't break layout). This contains the blast radius if anything goes wrong: `git revert` of just the canvas-toggle commit returns the app to the original light theme without rolling back any of the additive token work.
5. **Recharts hex colors** (Reports page) are isolated to a single commit (Phase 2i step 2). Until that commit lands, charts render in the legacy `#0EA5E9` palette on a dark surface — readable but visibly the "old style," which is the right signal during a rolling migration.

---

## 10. Estimated number of commits to complete

**~38–46 commits**, breaking down:

| Phase | Commits |
|---|---|
| 2a — Token addition | 1 |
| 2b — Utility addition | 1 |
| 2c — Shell chrome | 2 |
| 2d — AI primitives | 2 |
| 2e — Dashboard widgets | 6 |
| 2f — Pipeline | 2 |
| 2g — Customers/Deals/Table | 3 |
| 2h — Messaging | 1 |
| 2i — Reports | 2 |
| 2j — AI Agents | 1 |
| 2k — Top-20 legacy pages | 15–20 |
| 2l — RTL/i18n QA | 2–3 |
| 2m — Deprecation pass | 1 |
| **Total** | **39–45** |

Long-tail mid-density components (~50 files at 10–30 occurrences) and the long tail (~100 files at 1–10) are deliberately *not* counted in Phase 2 — they migrate opportunistically when other sprints touch them, or in a dedicated sweep after Sprint F. Sprint B's bar is "every page the user lands on feels Dark Navy"; it is **not** "every `bg-sky-50` in the repo is gone."

---

## 11. Open questions for Mehmet

1. **Violet endpoint on `gradient-ai-primary` (#7C3AED)** — this is a new color not present in the current palette. Approve the addition, swap it for a different endpoint (e.g., a deeper neon blue like `#1E40AF`), or drop the third stop entirely and keep the gradient blue-on-blue?
2. **Page canvas tone — `#0A1530` (one notch darker than #112044)** — is the slight darker canvas acceptable, or should the canvas itself be exactly `#112044` and cards lift to `#182A55`?
3. **Phase 2c canvas-toggle commit** — confirm we activate the dark canvas globally as a single commit (and accept that until Phase 2l, ~50 mid-density files will look "stylistically older but functional" against the new canvas). The alternative is per-route gating, which is more code and slower to roll out.
4. **`ai-cfo` and `whatsapp` pages** — both are in the dashboard but not in the §4.1 top-20. Include them in Phase 2k or treat them as long tail?
5. **Status badges on `/ai-agents`** — they currently use `bg-amber-50` / `bg-emerald-50` / `bg-sky-50` etc. (semantic light-tone badges). Should these flip to dark-tone equivalents (`bg-amber-500/15` style) during Sprint B, or stay as-is for now and be addressed in a "semantic tokens" follow-up?
6. **`docs/` route and any landing/marketing pages** — out of scope per MASTER_GUIDE §3 (Sprint B targets the dashboard), correct?

---

## 12. Files NOT touched during discovery

Discovery was strictly read-only. No code, no config, no theme files, no component files were modified. No `git add` / `git commit` / `git push` was run. The only file written was this report (`docs/sprint-b-discovery.md`).

---

## 13. Decisions on §11 open questions (approved by Mehmet 2026-04-25)

- **Q1:** Approved #7C3AED violet endpoint on gradient-ai-primary.
- **Q2:** Page canvas = #0A1530 (one notch darker than #112044).
- **Q3:** Phase 2c canvas-toggle = single commit (global flip).
- **Q4:** /ai-cfo and /whatsapp — include in Phase 2k.
- **Q5:** /ai-agents status badges (amber/emerald/sky) — leave as-is, address in a future "semantic tokens" follow-up.
- **Q6:** /docs and marketing pages — out of scope, dashboard only.

---

**End of Sprint B Phase 1 Discovery Report.**
**Awaiting Mehmet review and explicit go/no-go on §11 open questions before Phase 2a begins.**
