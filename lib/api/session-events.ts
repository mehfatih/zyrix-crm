// ============================================================================
// SESSION EVENTS — idle timeout telemetry + KPIs
// ============================================================================

import { apiClient } from "./client";

type ApiSuccess<T> = { success: true; data: T };

export type SessionEventType =
  | "login"
  | "manual_logout"
  | "auto_logout_idle"
  | "session_expired";

export async function recordSessionEvent(
  eventType: SessionEventType,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await apiClient.post("/api/session-events", { eventType, metadata });
  } catch {
    // Swallow — telemetry must never block logout
  }
}

// ──────────────────────────────────────────────────────────────────
// KPIs
// ──────────────────────────────────────────────────────────────────

export interface SessionKpiRow {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  totalCloses: number;
  manualLogouts: number;
  autoLogouts: number;
  sessionExpired: number;
  logins: number;
}

export interface SessionKpiSummary {
  from: string;
  to: string;
  perUser: SessionKpiRow[];
  totals: {
    totalCloses: number;
    manualLogouts: number;
    autoLogouts: number;
    sessionExpired: number;
    logins: number;
    autoLogoutRatio: number;
  };
}

export async function getSessionKpis(params?: {
  from?: string;
  to?: string;
  userId?: string;
}): Promise<SessionKpiSummary> {
  const { data } = await apiClient.get<ApiSuccess<SessionKpiSummary>>(
    "/api/session-events/kpis",
    { params }
  );
  return data.data;
}
