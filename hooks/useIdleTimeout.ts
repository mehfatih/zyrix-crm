"use client";

import { useCallback, useEffect, useRef } from "react";

// ============================================================================
// useIdleTimeout — silent auto-logout after N minutes of inactivity
// ----------------------------------------------------------------------------
// Wires up global mousemove/keydown/click/touchstart listeners (throttled via
// requestAnimationFrame so we don't rAF every pointer move), resets a single
// timer on each activity, and fires onAutoLogout silently at T-0. No warning
// modal, no countdown UI — the user is logged straight out and routed to
// /signin. The logout path calls a telemetry POST BEFORE clearing tokens
// so the 'auto_logout_idle' event is attributable.
//
// Usage (inside DashboardShell):
//   useIdleTimeout({
//     enabled: isAuthenticated && (company?.idleTimeoutMinutes ?? 0) > 0,
//     idleMinutes: company?.idleTimeoutMinutes ?? 15,
//     onAutoLogout: async () => {
//       await recordSessionEvent('auto_logout_idle');
//       await logout();
//     },
//   });
// ============================================================================

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

export interface UseIdleTimeoutOptions {
  /** Master switch — pass false to no-op (e.g. user not signed in yet) */
  enabled: boolean;
  /** Merchant's configured timeout length. 0 or falsy = disabled. */
  idleMinutes: number;
  /** Called when the timer hits zero — fire-and-forget */
  onAutoLogout: () => Promise<void> | void;
}

export function useIdleTimeout({
  enabled,
  idleMinutes,
  onAutoLogout,
}: UseIdleTimeoutOptions): void {
  // Refs hold the timer ID + activity throttle flag so handlers don't
  // need to be recreated on every render (which would churn the
  // addEventListener/removeEventListener pair).
  const logoutTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingActivityRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (logoutTimerRef.current !== null) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  // (Re)schedules the silent logout based on the current time.
  const scheduleTimer = useCallback(() => {
    clearTimer();
    if (!enabled || !idleMinutes || idleMinutes <= 0) return;
    const totalMs = idleMinutes * 60 * 1000;
    logoutTimerRef.current = window.setTimeout(() => {
      // Fire and forget — the user might already be disconnected
      // (network dropped) and we still want the UI to lock out.
      void onAutoLogout();
    }, totalMs);
  }, [clearTimer, enabled, idleMinutes, onAutoLogout]);

  // Called on every activity event, but only does real work once per
  // animation frame (via the pendingActivityRef flag) so rapid
  // mousemoves don't hammer the scheduler.
  const handleActivity = useCallback(() => {
    if (pendingActivityRef.current) return;
    pendingActivityRef.current = true;
    rafRef.current = window.requestAnimationFrame(() => {
      pendingActivityRef.current = false;
      scheduleTimer();
    });
  }, [scheduleTimer]);

  // Attach / detach the activity listeners
  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }
    // Start the first countdown immediately
    scheduleTimer();

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }
    return () => {
      clearTimer();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, handleActivity);
      }
    };
  }, [enabled, handleActivity, scheduleTimer, clearTimer]);
}
