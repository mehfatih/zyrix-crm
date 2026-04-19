import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(self), geolocation=(self), interest-cohort=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",

  // Next.js 16: typedRoutes moved OUT of experimental
  typedRoutes: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.zyrix.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "sonner",
    ],
  },

  turbopack: {
    resolveAlias: {},
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/home",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/ar/home",
        destination: "/ar",
        permanent: true,
      },
      {
        source: "/tr/home",
        destination: "/tr",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [];
  },

  env: {
    NEXT_PUBLIC_APP_NAME: "Zyrix CRM",
    NEXT_PUBLIC_APP_VERSION: "0.1.0",
  },
};

export default withNextIntl(nextConfig);