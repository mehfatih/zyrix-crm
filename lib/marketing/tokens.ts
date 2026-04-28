// lib/marketing/tokens.ts
// Zyrix v2 design tokens — premium dark identity.
// Do not hardcode brand colors elsewhere; import from here.

export const ZX_COLORS = {
  navy900: "#0A1530",
  navy800: "#112044",
  navy700: "#08111F",
  neonBlue: "#1A56DB",
  cyan: "#22D3EE",
  violet: "#7C3AED",
  mint: "#2DD4BF",
  amber: "#F59E0B",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.72)",
  textMuted: "rgba(255,255,255,0.55)",
  glassBg: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.16)",
} as const;

export const ZX_GRADIENTS = {
  primaryCta: "linear-gradient(135deg, #22D3EE 0%, #1A56DB 100%)",
  textHighlight:
    "linear-gradient(90deg, #67E8F9 0%, #60A5FA 50%, #A78BFA 100%)",
  darkCanvas:
    "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.20), transparent 28%), radial-gradient(circle at 80% 10%, rgba(124,58,237,0.22), transparent 26%), linear-gradient(135deg, #0A1530 0%, #112044 55%, #08111F 100%)",
  glassCard:
    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.045))",
} as const;

export const ZX_SHADOWS = {
  glassCard:
    "0 24px 80px rgba(34,211,238,0.10), inset 0 1px 0 rgba(255,255,255,0.16)",
  ctaGlow: "0 20px 60px rgba(34,211,238,0.28)",
  heroPanel: "0 30px 120px rgba(34,211,238,0.18)",
} as const;

export type ZxColor = keyof typeof ZX_COLORS;
