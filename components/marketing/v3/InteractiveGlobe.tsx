// components/marketing/v3/InteractiveGlobe.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load Globe.gl on the client only — three.js needs window.
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

// MENA + Türkiye anchor points (lat, lng)
const POINTS = [
  { name: "Istanbul", lat: 41.0082, lng: 28.9784, color: "#22D3EE" },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753, color: "#A78BFA" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, color: "#22D3EE" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, color: "#A78BFA" },
  { name: "Doha", lat: 25.2854, lng: 51.5310, color: "#22D3EE" },
  { name: "Kuwait City", lat: 29.3759, lng: 47.9774, color: "#A78BFA" },
  { name: "Baghdad", lat: 33.3152, lng: 44.3661, color: "#22D3EE" },
  { name: "Amman", lat: 31.9539, lng: 35.9106, color: "#A78BFA" },
  { name: "Beirut", lat: 33.8938, lng: 35.5018, color: "#22D3EE" },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898, color: "#A78BFA" },
];

// Connection arcs between Istanbul (HQ) and other capitals
const ARCS = POINTS.slice(1).map((p) => ({
  startLat: POINTS[0].lat,
  startLng: POINTS[0].lng,
  endLat: p.lat,
  endLng: p.lng,
  color: p.color,
}));

export function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = Math.min(el.offsetWidth, 600);
      setSize({ w, h: w });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden"
      style={{
        maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
      }}
    >
      {mounted ? (
        <Globe
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          atmosphereColor="#22D3EE"
          atmosphereAltitude={0.22}
          pointsData={POINTS}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.02}
          pointRadius={0.6}
          pointLabel={(d: any) => `<div style="background:#0A1530;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600">${d.name}</div>`}
          arcsData={ARCS}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcStroke={0.4}
          arcDashLength={0.5}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcAltitudeAutoScale={0.4}
          rendererConfig={{ antialias: true, alpha: true }}
        />
      ) : (
        <GlobeFallback />
      )}

      {/* Glow ring overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 50%, rgba(34,211,238,0.08) 70%, transparent 80%)",
        }}
      />
    </div>
  );
}

function GlobeFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div
        className="aspect-square w-3/4 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #1E40AF 0%, #1E3A8A 40%, #0F172A 100%)",
          boxShadow: "inset 0 0 60px rgba(34,211,238,0.30), 0 0 80px rgba(124,58,237,0.20)",
        }}
      />
    </div>
  );
}
