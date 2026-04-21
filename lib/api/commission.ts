"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// COMMISSION — TYPES + API CLIENT
// ============================================================================

export type CommissionType = "flat" | "percent" | "tiered";
export type EntryStatus = "pending" | "approved" | "paid" | "cancelled";
export type AppliesTo = "all" | "deal_stage" | "min_value";

export interface CommissionConfig {
  rate?: number;
  amount?: number;
  tiers?: { from: number; to?: number; rate: number }[];
}

export interface CommissionRule {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  type: CommissionType;
  config: CommissionConfig;
  appliesTo: AppliesTo;
  appliesToValue: string | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  _count?: { entries: number };
}

export interface CommissionEntry {
  id: string;
  companyId: string;
  ruleId: string;
  userId: string;
  dealId: string;
  baseValue: string;
  rate: string;
  amount: string;
  currency: string;
  status: EntryStatus;
  approvedAt: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; fullName: string; email: string };
  deal: { id: string; title: string; value?: string; currency?: string };
  rule: { id: string; name: string; type: CommissionType };
}

export interface CommissionStats {
  pendingAmount: number;
  pendingCount: number;
  approvedAmount: number;
  approvedCount: number;
  paidAmount: number;
  paidCount: number;
  topUsers: {
    user: { id: string; fullName: string; email: string };
    amount: number;
    count: number;
  }[];
}

export interface CreateRuleDto {
  name: string;
  description?: string;
  type: CommissionType;
  config: CommissionConfig;
  appliesTo?: AppliesTo;
  appliesToValue?: string;
  isActive?: boolean;
  priority?: number;
}

export type UpdateRuleDto = Partial<CreateRuleDto>;

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Rules
export async function fetchRules(): Promise<CommissionRule[]> {
  const { data } = await apiClient.get<ApiSuccess<CommissionRule[]>>(
    "/api/commission/rules"
  );
  return data.data;
}

export async function createRule(
  dto: CreateRuleDto
): Promise<CommissionRule> {
  const { data } = await apiClient.post<ApiSuccess<CommissionRule>>(
    "/api/commission/rules",
    dto
  );
  return data.data;
}

export async function updateRule(
  id: string,
  dto: UpdateRuleDto
): Promise<CommissionRule> {
  const { data } = await apiClient.patch<ApiSuccess<CommissionRule>>(
    `/api/commission/rules/${id}`,
    dto
  );
  return data.data;
}

export async function deleteRule(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/commission/rules/${id}`
  );
  return data.data;
}

// Entries
export async function fetchEntries(
  params: {
    userId?: string;
    status?: EntryStatus;
    page?: number;
    limit?: number;
  } = {}
): Promise<Paginated<CommissionEntry>> {
  const { data } = await apiClient.get<ApiSuccess<Paginated<CommissionEntry>>>(
    "/api/commission/entries",
    { params }
  );
  return data.data;
}

export async function updateEntryStatus(
  id: string,
  status: EntryStatus,
  notes?: string
): Promise<CommissionEntry> {
  const { data } = await apiClient.patch<ApiSuccess<CommissionEntry>>(
    `/api/commission/entries/${id}/status`,
    { status, notes }
  );
  return data.data;
}

export async function deleteEntry(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/commission/entries/${id}`
  );
  return data.data;
}

export async function recomputeAll(): Promise<{
  dealsProcessed: number;
  entriesCreated: number;
}> {
  const { data } = await apiClient.post<
    ApiSuccess<{ dealsProcessed: number; entriesCreated: number }>
  >("/api/commission/recompute", {});
  return data.data;
}

export async function fetchStats(): Promise<CommissionStats> {
  const { data } = await apiClient.get<ApiSuccess<CommissionStats>>(
    "/api/commission/stats"
  );
  return data.data;
}
