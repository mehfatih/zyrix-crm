import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

// ============================================================================
// ZYRIX CRM — Tailwind Configuration
// ============================================================================
// Brand rule: NO dark or gloomy colors anywhere.
// Palette is exclusively cyan / sky / azure tones.
// ============================================================================

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Enable dark mode via class (NOT media) — but we won't use dark colors
  // This is just for potential future toggle of slightly cooler palette
  darkMode: "class",

  theme: {
    // ───────────────────────────────────────────────────────────────────
    // Container
    // ───────────────────────────────────────────────────────────────────
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },

    extend: {
      // ─────────────────────────────────────────────────────────────────
      // ZYRIX BRAND COLORS
      // ─────────────────────────────────────────────────────────────────
      colors: {
        // Primary brand color
        primary: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2", // ⭐ KERNEL — main brand color
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
          DEFAULT: "#0891B2",
        },

        // Sky (light blue)
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },

        // Azure (medium blue-cyan)
        azure: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          DEFAULT: "#38BDF8",
        },

        // Cyan (pure cyan scale)
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },

        // Semantic colors
        success: {
          light: "#D1FAE5",
          DEFAULT: "#059669",
          dark: "#047857",
        },
        warning: {
          light: "#FEF3C7",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
        danger: {
          light: "#FEE2E2",
          DEFAULT: "#DC2626",
          dark: "#B91C1C",
        },
        info: {
          light: "#DBEAFE",
          DEFAULT: "#0EA5E9",
          dark: "#0369A1",
        },

        // Background tokens (named semantically)
        bg: {
          base: "#F0F9FF",
          card: "#ECFEFF",
          subtle: "#F8FAFC",
          elevated: "#FFFFFF",
          muted: "#F1F5F9",
        },

        // Text tokens
        ink: {
          DEFAULT: "#164E63",
          mid: "#0E7490",
          light: "#475569",
          muted: "#64748B",
          inverse: "#FFFFFF",
        },

        // Border tokens
        line: {
          DEFAULT: "#BAE6FD",
          soft: "#E0F2FE",
          strong: "#7DD3FC",
        },
      },

      // ─────────────────────────────────────────────────────────────────
      // FONTS
      // ─────────────────────────────────────────────────────────────────
      fontFamily: {
        cairo: [
          "Cairo",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        inter: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "Cairo",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      // ─────────────────────────────────────────────────────────────────
      // TYPOGRAPHY (prose customization)
      // ─────────────────────────────────────────────────────────────────
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#164E63",
            "--tw-prose-headings": "#0E7490",
            "--tw-prose-lead": "#0E7490",
            "--tw-prose-links": "#0891B2",
            "--tw-prose-bold": "#164E63",
            "--tw-prose-counters": "#0E7490",
            "--tw-prose-bullets": "#67E8F9",
            "--tw-prose-hr": "#BAE6FD",
            "--tw-prose-quotes": "#0E7490",
            "--tw-prose-quote-borders": "#67E8F9",
            "--tw-prose-captions": "#475569",
            "--tw-prose-code": "#0891B2",
            "--tw-prose-pre-code": "#164E63",
            "--tw-prose-pre-bg": "#ECFEFF",
            "--tw-prose-th-borders": "#BAE6FD",
            "--tw-prose-td-borders": "#E0F2FE",
          },
        },
      },

      // ─────────────────────────────────────────────────────────────────
      // SHADOWS (cyan-tinted, never harsh black)
      // ─────────────────────────────────────────────────────────────────
      boxShadow: {
        xs: "0 1px 2px 0 rgba(8, 145, 178, 0.05)",
        sm: "0 1px 3px 0 rgba(8, 145, 178, 0.08), 0 1px 2px -1px rgba(8, 145, 178, 0.06)",
        DEFAULT:
          "0 4px 6px -1px rgba(8, 145, 178, 0.08), 0 2px 4px -2px rgba(8, 145, 178, 0.06)",
        md: "0 6px 12px -2px rgba(8, 145, 178, 0.10), 0 3px 7px -3px rgba(8, 145, 178, 0.08)",
        lg: "0 10px 20px -3px rgba(8, 145, 178, 0.12), 0 4px 8px -4px rgba(8, 145, 178, 0.08)",
        xl: "0 20px 32px -5px rgba(8, 145, 178, 0.14), 0 8px 12px -6px rgba(8, 145, 178, 0.10)",
        "2xl": "0 25px 50px -12px rgba(8, 145, 178, 0.20)",
        glow: "0 0 24px rgba(34, 211, 238, 0.35)",
        "glow-lg": "0 0 48px rgba(34, 211, 238, 0.45)",
        inner: "inset 0 2px 4px 0 rgba(8, 145, 178, 0.05)",
        none: "none",
      },

      // ─────────────────────────────────────────────────────────────────
      // BORDER RADIUS
      // ─────────────────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─────────────────────────────────────────────────────────────────
      // BACKGROUND IMAGES (gradients)
      // ─────────────────────────────────────────────────────────────────
      backgroundImage: {
        "zyrix-gradient":
          "linear-gradient(135deg, #ECFEFF 0%, #F0F9FF 50%, #E0F2FE 100%)",
        "zyrix-hero":
          "linear-gradient(135deg, #F0F9FF 0%, #ECFEFF 40%, #BAE6FD 100%)",
        "zyrix-cta":
          "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        "zyrix-accent":
          "linear-gradient(90deg, #22D3EE 0%, #0891B2 100%)",
        "zyrix-soft":
          "linear-gradient(180deg, #ECFEFF 0%, #F0F9FF 100%)",
        "shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(186, 230, 253, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(186, 230, 253, 0.3) 1px, transparent 1px)",
      },

      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "48px 48px",
        "grid-lg": "96px 96px",
      },

      // ─────────────────────────────────────────────────────────────────
      // ANIMATIONS & KEYFRAMES
      // ─────────────────────────────────────────────────────────────────
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-out": "fadeOut 0.3s ease-in forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right":
          "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left":
          "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      // ─────────────────────────────────────────────────────────────────
      // TRANSITIONS
      // ─────────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },

      // ─────────────────────────────────────────────────────────────────
      // Z-INDEX scale
      // ─────────────────────────────────────────────────────────────────
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },

      // ─────────────────────────────────────────────────────────────────
      // SPACING (extended)
      // ─────────────────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "128": "32rem",
        "144": "36rem",
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // PLUGINS
  // ─────────────────────────────────────────────────────────────────────
  plugins: [
    typography,
    forms({ strategy: "class" }),
    aspectRatio,
  ],
};

export default config;