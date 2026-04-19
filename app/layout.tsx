// ============================================================================
// ZYRIX CRM — Root Layout
// ============================================================================
// This is the minimal root layout required by Next.js App Router.
// All actual HTML structure (<html>, <body>, fonts, metadata) lives in
// app/[locale]/layout.tsx — because we need per-locale `lang` and `dir`
// attributes for proper RTL/LTR handling.
// ============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}