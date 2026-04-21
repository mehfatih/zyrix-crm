"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// useDraggableSplit — resizable sidebar sections
// ----------------------------------------------------------------------------
// Maintains a split percentage between two stacked vertical panels. The
// consumer renders its own handle element and hooks up its onMouseDown
// to the returned startDrag. Split is persisted to localStorage so the
// user's preferred position survives page refreshes.
//
// Returns:
//   topFlexPercent  — number 10..90, the % height of the top panel
//   startDrag       — mousedown handler for the handle
//   isDragging      — true while the user is dragging (for cursor UX)
//   resetToDefault  — snap back to 55% (the initial value)
// ============================================================================

const STORAGE_KEY = "zyrix_sidebar_split_percent";
const DEFAULT_PERCENT = 55; // 55% top (nav) / 45% bottom (settings)
const MIN_PERCENT = 15;
const MAX_PERCENT = 85;

export function useDraggableSplit(containerRef: React.RefObject<HTMLElement | null>) {
  const [topFlexPercent, setTopFlexPercent] = useState(DEFAULT_PERCENT);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{ startY: number; startPercent: number } | null>(
    null
  );

  // Hydrate from localStorage on mount (client-only; avoids SSR mismatch)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const n = Number(saved);
      if (!Number.isNaN(n) && n >= MIN_PERCENT && n <= MAX_PERCENT) {
        setTopFlexPercent(n);
      }
    }
  }, []);

  // Persist (debounced via rAF to avoid localStorage thrash during drag)
  const persist = useCallback((pct: number) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, String(pct));
    } catch {
      // quota exceeded or disabled — silently ignore
    }
  }, []);

  const onMove = useCallback(
    (clientY: number) => {
      if (!dragStateRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaY = clientY - dragStateRef.current.startY;
      const deltaPercent = (deltaY / rect.height) * 100;
      let next = dragStateRef.current.startPercent + deltaPercent;
      next = Math.max(MIN_PERCENT, Math.min(MAX_PERCENT, next));
      setTopFlexPercent(next);
    },
    [containerRef]
  );

  const endDrag = useCallback(() => {
    if (!dragStateRef.current) return;
    setIsDragging(false);
    dragStateRef.current = null;
    // Persist the final position, not each frame's intermediate
    setTopFlexPercent((current) => {
      persist(current);
      return current;
    });
    // Clean up the document-level body styling
    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, [persist]);

  // Attach document-level listeners while dragging so the drag
  // continues even if the cursor leaves the handle.
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientY);
    };
    const handleUp = () => endDrag();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleUp);
    document.addEventListener("touchcancel", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchcancel", handleUp);
    };
  }, [isDragging, onMove, endDrag]);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const clientY =
        "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      dragStateRef.current = {
        startY: clientY,
        startPercent: topFlexPercent,
      };
      setIsDragging(true);
      // Prevent text selection + show grabbing cursor over the entire
      // page for the duration of the drag
      if (typeof document !== "undefined") {
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";
      }
    },
    [topFlexPercent]
  );

  const resetToDefault = useCallback(() => {
    setTopFlexPercent(DEFAULT_PERCENT);
    persist(DEFAULT_PERCENT);
  }, [persist]);

  return {
    topFlexPercent,
    startDrag,
    isDragging,
    resetToDefault,
  };
}
