"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// SMART FOLLOW-UP — TYPES + API CLIENT
// ============================================================================

export interface FollowupSettings {
  id: string | null;
  companyId: string;
  isEnabled: boolean;
  warningDays: number;
  criticalDays: number;
  includeStatuses: string[] | null;
  excludeInactive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface StaleCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  lastContactAt: string | null;
  lastActivityAt: string | null;
  daysSinceContact: number;
  severity: "warning" | "critical";
  hasOpenDeal: boolean;
  openDealValue: number;
  ownerId: string | null;
  ownerName: string | null;
}

export interface StaleResponse {
  warning: StaleCustomer[];
  critical: StaleCustomer[];
  stats: {
    totalStale: number;
    warningCount: number;
    criticalCount: number;
    openDealValue: number;
  };
}

export interface FollowupSettingsDto {
  isEnabled?: boolean;
  warningDays?: number;
  criticalDays?: number;
  includeStatuses?: string[];
  excludeInactive?: boolean;
}

export interface BulkResult {
  created: number;
  skipped: number;
  total: number;
}

export async function fetchFollowupSettings(): Promise<FollowupSettings> {
  const { data } = await apiClient.get<ApiSuccess<FollowupSettings>>(
    "/api/followup/settings"
  );
  return data.data;
}

export async function upsertFollowupSettings(
  dto: FollowupSettingsDto
): Promise<FollowupSettings> {
  const { data } = await apiClient.put<ApiSuccess<FollowupSettings>>(
    "/api/followup/settings",
    dto
  );
  return data.data;
}

export async function fetchStaleCustomers(): Promise<StaleResponse> {
  const { data } = await apiClient.get<ApiSuccess<StaleResponse>>(
    "/api/followup/stale"
  );
  return data.data;
}

export async function createFollowupTask(
  customerId: string
): Promise<unknown> {
  const { data } = await apiClient.post<ApiSuccess<unknown>>(
    `/api/followup/tasks/${customerId}`,
    {}
  );
  return data.data;
}

export async function bulkCreateFollowupTasks(
  customerIds: string[]
): Promise<BulkResult> {
  const { data } = await apiClient.post<ApiSuccess<BulkResult>>(
    "/api/followup/tasks/bulk",
    { customerIds }
  );
  return data.data;
}
