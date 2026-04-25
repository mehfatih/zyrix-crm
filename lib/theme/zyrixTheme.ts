/**
 * Zyrix Sky Blue Theme — Unified Mobile + Web Standard
 * Adopted: 2026-04-25
 * Replaces previous Cyan #0891B2 standard.
 */

export const zyrixTheme = {
  primary: '#0EA5E9',
  primaryDark: '#0284C7',
  primaryLight: '#7DD3FC',
  accent: '#22D3EE',
  azure: '#38BDF8',
  sky: '#BAE6FD',

  bg: '#F0F9FF',
  cardBg: '#FFFFFF',
  cardBgAlt: '#F8FAFC',
  aiSurface: '#F0F9FF',
  aiBorder: '#BAE6FD',

  textHeading: '#0C4A6E',
  textMid: '#0369A1',
  textBody: '#1E293B',
  textMuted: '#64748B',

  border: '#E2E8F0',
  borderSky: '#BAE6FD',

  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
} as const;

export const zyrixGradients = {
  ai: 'linear-gradient(135deg, #22D3EE 0%, #0EA5E9 50%, #0284C7 100%)',
  soft: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
  primary: 'linear-gradient(135deg, #7DD3FC 0%, #0EA5E9 100%)',
} as const;

export const zyrixShadows = {
  card: '0 1px 3px rgba(14,165,233,0.08), 0 1px 2px rgba(14,165,233,0.04)',
  cardHover: '0 4px 12px rgba(14,165,233,0.12), 0 2px 6px rgba(14,165,233,0.06)',
  aiGlow: '0 0 0 1px rgba(14,165,233,0.15), 0 4px 12px rgba(14,165,233,0.08)',
} as const;
