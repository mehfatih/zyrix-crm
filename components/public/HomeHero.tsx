"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";

// ============================================================================
// HOMEPAGE HERO — WEB Sprint 1 redesign
// ----------------------------------------------------------------------------
// Vibrant, welcoming above-the-fold:
//   • Celebration gradient (coral→peach) at 15% over white for warm glow
//   • Left: badge, headline, subtitle, two CTAs, trust row (60% on desktop)
//   • Right: device mock + 3 floating stat cards, each a different accent
//   • Generous vertical breathing room (80-120px); subtle grain texture
// ============================================================================

export default function HomeHero({ locale }: { locale: string }) {
  const t = useTranslations("Home.hero");
  const isArabic = locale === "ar";

  const headline = t("title");
  const highlight = t("titleHighlight");
  const parts = headline.split(highlight);

  return (
    <section
      className="hero-celebration-bg relative overflow-hidden"
      style={{
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div className="grain-texture" />

      <div
        className="container-zyrix"
        style={{ position: "relative", maxWidth: 1200, zIndex: 1 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 48,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* LEFT COLUMN — 60% on desktop */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* "New" badge with sunshine tint */}
            <span
              style={{
                alignSelf: isArabic ? "flex-end" : "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 9999,
                background: "rgba(252, 211, 77, 0.18)",
                color: "#B45309",
                fontSize: 13,
                fontWeight: 700,
                border: "1px solid rgba(252, 211, 77, 0.45)",
                boxShadow: "0 1px 3px rgba(252, 211, 77, 0.25)",
              }}
            >
              <Sparkles size={13} style={{ color: "#F59E0B" }} />
              {t("badge")}
            </span>

            {/* H1 — 48-56px, with highlight span that fills the celebration gradient */}
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                color: "#0C4A6E",
                letterSpacing: "-0.02em",
                margin: 0,
                textWrap: "balance",
              }}
            >
              {parts[0]}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #FB7185 0%, #FDBA74 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {highlight}
              </span>
              {parts.slice(1).join(highlight)}
            </h1>

            {/* Subtitle — 18-20px, 2 lines */}
            <p
              style={{
                fontSize: "clamp(16px, 1.3vw, 20px)",
                lineHeight: 1.55,
                color: "#475569",
                maxWidth: 560,
                margin: 0,
              }}
            >
              {t("subtitle")}
            </p>

            {/* Two CTAs side-by-side */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 8,
              }}
            >
              <Link
                href={`/${locale}/signup`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #0EA5E9 0%, #22D3EE 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 8px 24px rgba(8, 145, 178, 0.3)",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  textDecoration: "none",
                }}
              >
                {t("ctaPrimary")}
                <ArrowRight
                  size={18}
                  style={{
                    transform: isArabic ? "rotate(180deg)" : undefined,
                  }}
                />
              </Link>

              <Link
                href={`/${locale}/signin`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  color: "#0EA5E9",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "1.5px solid #0EA5E9",
                  boxShadow: "0 1px 3px rgba(8, 145, 178, 0.08)",
                  transition: "background-color 180ms ease",
                  textDecoration: "none",
                }}
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            {/* Trust row */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
                color: "#475569",
                fontSize: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: -6,
                }}
              >
                <Avatar color="#FB7185" />
                <Avatar color="#FDBA74" offset />
                <Avatar color="#34D399" offset />
                <Avatar color="#A78BFA" offset />
              </span>
              <span style={{ fontWeight: 500 }}>{t("trustIndicator")}</span>
            </div>
          </div>

          {/* RIGHT COLUMN — device mock + floating stat cards (40%) */}
          <div
            className="hero-right"
            style={{
              position: "relative",
              minHeight: 440,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeviceMock locale={locale} isArabic={isArabic} />

            {/* Floating stat cards — each a different accent */}
            <StatCard
              accent="#34D399"
              glow="rgba(52, 211, 153, 0.25)"
              label={t("stats.whatsapp")}
              style={{
                position: "absolute",
                top: 30,
                ...(isArabic ? { right: -10 } : { left: -10 }),
                animationDelay: "0s",
              }}
            />
            <StatCard
              accent="#A78BFA"
              glow="rgba(167, 139, 250, 0.25)"
              label={t("stats.speed")}
              style={{
                position: "absolute",
                bottom: 100,
                ...(isArabic ? { left: -20 } : { right: -20 }),
                animationDelay: "0.4s",
              }}
            />
            <StatCard
              accent="#FB7185"
              glow="rgba(251, 113, 133, 0.25)"
              label={t("stats.live")}
              style={{
                position: "absolute",
                bottom: 10,
                ...(isArabic ? { right: 20 } : { left: 20 }),
                animationDelay: "0.8s",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.hero-grid) {
            grid-template-columns: 60% 40% !important;
          }
        }
        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Decorative glassmorphism stat card
// ────────────────────────────────────────────────────────────────────────────
function StatCard({
  accent,
  glow,
  label,
  style,
}: {
  accent: string;
  glow: string;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        border: `1px solid ${accent}30`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: `0 8px 28px ${glow}, 0 2px 6px rgba(8, 145, 178, 0.08)`,
        fontSize: 13,
        fontWeight: 700,
        color: "#0C4A6E",
        whiteSpace: "nowrap",
        animation: "floatCard 4s ease-in-out infinite",
        ...style,
      }}
    >
      {label}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Simple CSS device frame with mock dashboard inside.
// (Swap for a real product screenshot when available.)
// ────────────────────────────────────────────────────────────────────────────
function DeviceMock({
  locale,
  isArabic,
}: {
  locale: string;
  isArabic: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        aspectRatio: "9 / 10",
        background: "#0C4A6E",
        borderRadius: 32,
        padding: 10,
        boxShadow:
          "0 40px 80px -20px rgba(8, 145, 178, 0.35), 0 10px 20px -10px rgba(12, 74, 110, 0.25)",
        transform: isArabic ? "rotate(1.5deg)" : "rotate(-1.5deg)",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          background: "linear-gradient(160deg, #F0F9FF 0%, #E0F2FE 100%)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
            borderBottom: "1px solid #E0F2FE",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            <Dot color="#FB7185" />
            <Dot color="#FDBA74" />
            <Dot color="#34D399" />
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0EA5E9",
              letterSpacing: "0.05em",
            }}
          >
            ZYRIX CRM
          </div>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #A78BFA, #7DD3FC)",
            }}
          />
        </div>

        {/* Mock content */}
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 10,
              color: "#0284C7",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {locale === "ar" ? "لوحة التحكم" : locale === "tr" ? "GÖSTERGE PANELİ" : "DASHBOARD"}
          </div>

          {[
            { w: "86%", c: "linear-gradient(90deg, #FB7185, #FDBA74)" },
            { w: "62%", c: "linear-gradient(90deg, #34D399, #5EEAD4)" },
            { w: "78%", c: "linear-gradient(90deg, #A78BFA, #7DD3FC)" },
          ].map((row, i) => (
            <div key={i}>
              <div
                style={{
                  height: 10,
                  width: "40%",
                  borderRadius: 3,
                  background: "#BAE6FD",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 8,
                  width: row.w,
                  borderRadius: 4,
                  background: row.c,
                }}
              />
            </div>
          ))}

          {/* Mini KPI grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginTop: 6,
            }}
          >
            <MiniCard label="WhatsApp" value="98%" accent="#34D399" />
            <MiniCard label="Deals" value="+24" accent="#FB7185" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 10,
        padding: "8px 10px",
        border: `1px solid ${accent}30`,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#64748B",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "9999px",
        background: color,
      }}
    />
  );
}

function Avatar({ color, offset }: { color: string; offset?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 24,
        height: 24,
        borderRadius: "9999px",
        background: color,
        border: "2px solid #FFFFFF",
        marginLeft: offset ? -8 : 0,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
      aria-hidden="true"
    />
  );
}
