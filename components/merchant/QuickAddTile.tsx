"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface QuickAddTileProps {
  icon: LucideIcon;
  label: string;
  shortcut: string;
  accent: string;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export const QuickAddTile = forwardRef<HTMLButtonElement, QuickAddTileProps>(
  function QuickAddTile(
    { icon: Icon, label, shortcut, accent, isActive, onClick, onMouseEnter },
    ref,
  ) {
    const bgSoft = hexToRgba(accent, isActive ? 0.22 : 0.12);
    const bgHover = hexToRgba(accent, 0.2);

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        style={{
          backgroundColor: bgSoft,
          borderColor: isActive ? accent : "transparent",
        }}
        className={`group relative w-full h-[110px] rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${
          isActive
            ? "scale-[1.02] shadow-[0_8px_24px_rgba(8,145,178,0.12)]"
            : "hover:scale-[1.02]"
        } active:scale-[0.97]`}
        onMouseDown={(e) => {
          // ensure focus ring-like behaviour visually via accent border on active
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgHover;
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgSoft;
        }}
      >
        <Icon className="w-7 h-7" style={{ color: accent }} strokeWidth={2} />
        <span className="text-[13px] font-semibold text-[#0C4A6E] leading-tight text-center px-2">
          {label}
        </span>
        <span
          className="absolute bottom-1.5 text-[10px] font-semibold text-slate-400 tracking-wider"
        >
          {shortcut}
        </span>
      </button>
    );
  },
);

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
