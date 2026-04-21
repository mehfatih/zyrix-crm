"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// useIdleTimeout — auto-lock the dashboard after N minutes of inactivity
// ----------------------------------------------------------------------------
// Wires up global mousemove/keydown/click/touchstart listeners (throttled via
// requestAnimationFrame so we don't rAF every pointer move), resets a
// countdown on each activity, and fires a warning modal at T-60s plus a
// real logout at T-0. The logout path calls a telemetry POST BEFORE
// clearing tokens so the 'auto_logout_idle' event is attributable.
//
// Usage (inside DashboardShell):
//   const { warningOpen, secondsLeft, dismissWarning, forceLogout } =
//     useIdleTimeout({
//       enabled: isAuthenticated && (company?.idleTimeoutMinutes ?? 0) > 0,
//       idleMinutes: company?.idleTimeoutMinutes ?? 10,
//       onAutoLogout: async () => {
//         await recordSessionEvent('auto_logout_idle');
//         await logout();
//       },
//     });
// ============================================================================

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

// Warning appears this long before the actual logout
const WARNING_LEAD_SECONDS = 60;

export interface UseIdleTimeoutOptions {
  /** Master switch — pass false to no-op (e.g. user not signed in yet) */
  enabled: boolean;
  /** Merchant's configured timeout length. 0 or falsy = disabled. */
  idleMinutes: number;
  /** Called when the timer hits zero AFTER warning dismissal expired */
  onAutoLogout: () => Promise<void> | void;
}

export interface UseIdleTimeoutResult {
  /** Is the warning modal currently visible? */
  warningOpen: boolean;
  /** Seconds remaining until auto-logout (0..WARNING_LEAD_SECONDS) */
  secondsLeft: number;
  /** Dismiss the warning — resets the idle counter fresh */
  dismissWarning: () => void;
  /** User clicked "Logout now" in the warning — immediate logout */
  forceLogout: () => void;
}

export function useIdleTimeout({
  enabled,
  idleMinutes,
  onAutoLogout,
}: UseIdleTimeoutOptions): UseIdleTimeoutResult {
  const [warningOpen, setWarningOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_LEAD_SECONDS);

  // Refs hold timer IDs + the last activity timestamp so handlers
  // don't need to be recreated on every render (which would churn
  // the addEventListener/removeEventListener pair).
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingActivityRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current !== null) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (logoutTimerRef.current !== null) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // Schedules the warning + logout based on the current time
  const scheduleTimers = useCallback(() => {
    clearTimers();
    if (!enabled || !idleMinutes || idleMinutes <= 0) return;

    const totalMs = idleMinutes * 60 * 1000;
    const warningMs = Math.max(totalMs - WARNING_LEAD_SECONDS * 1000, 0);

    // Warning fires WARNING_LEAD_SECONDS before the real logout
    warningTimerRef.current = window.setTimeout(() => {
      setSecondsLeft(WARNING_LEAD_SECONDS);
      setWarningOpen(true);

      // Countdown interval updates the displayed number every second.
      // Each tick we check if we've hit zero; if so, the logout fires
      // from the logoutTimer below rather than from here — this
      // countdown is purely visual.
      countdownTimerRef.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(s - 1, 0));
      }, 1000);
    }, warningMs);

    // Auto-logout fires exactly at totalMs. Separate timer rather than
    // deriving from the countdown so drift in setInterval doesn't
    // push the actual logout later than the user expects.
    logoutTimerRef.current = window.setTimeout(() => {
      // Fire and forget — we don't await because the user might
      // already be disconnected (network dropped) and we still want
      // the UI to lock out.
      void onAutoLogout();
    }, totalMs);
  }, [clearTimers, enabled, idleMinutes, onAutoLogout]);

  // Called on every activity event, but only does real work once per
  // animation frame (via the pendingActivityRef flag) so rapid
  // mousemoves don't hammer the scheduler.
  const handleActivity = useCallback(() => {
    if (pendingActivityRef.current) return;
    pendingActivityRef.current = true;
    rafRef.current = window.requestAnimationFrame(() => {
      pendingActivityRef.current = false;
      // If the warning is open, we intentionally IGNORE activity —
      // the user has to explicitly click 'Continue' to confirm
      // presence. Otherwise a stray mouse twitch (e.g. from the
      // cleaning crew or a cat) could keep the session alive
      // indefinitely.
      if (warningOpen) return;
      scheduleTimers();
    });
  }, [warningOpen, scheduleTimers]);

  // Attach / detach the activity listeners
  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setWarningOpen(false);
      return;
    }
    // Start the first countdown immediately
    scheduleTimers();

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }
    return () => {
      clearTimers();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, handleActivity);
      }
    };
  }, [enabled, handleActivity, scheduleTimers, clearTimers]);

  const dismissWarning = useCallback(() => {
    setWarningOpen(false);
    clearTimers();
    scheduleTimers();
  }, [clearTimers, scheduleTimers]);

  const forceLogout = useCallback(() => {
    clearTimers();
    setWarningOpen(false);
    void onAutoLogout();
  }, [clearTimers, onAutoLogout]);

  return { warningOpen, secondsLeft, dismissWarning, forceLogout };
}
