"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// LOYALTY — TYPES + API CLIENT
// ============================================================================

export type LoyaltyTxnType = "earn" | "redeem" | "adjust" | "expire";

export interface LoyaltyTier {
  name: string;
  threshold: number;
  multiplier: number;
}

export interface LoyaltyProgram {
  id: string | null;
  companyId: string;
  name: string;
  isActive: boolean;
  pointsPerUnit: string;
  currency: string;
  minRedeem: number;
  redeemValue: string;
  tiers: LoyaltyTier[] | null;
  rules: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LoyaltyCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
  email?: string | null;
}

export interface LoyaltyTransaction {
  id: string;
  companyId: string;
  customerId: string;
  programId: string;
  createdById: string | null;
  points: number;
  type: LoyaltyTxnType;
  reason: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
  customer: LoyaltyCustomer;
  createdBy: { id: string; fullName: string; email: string } | null;
}

export interface LoyaltyStats {
  activeMembers: number;
  totalEarned: number;
  totalRedeemed: number;
  txnsLast30d: number;
}

export interface TopMember {
  customer: LoyaltyCustomer;
  balance: number;
}

export interface CustomerLoyaltyView {
  customer: LoyaltyCustomer;
  balance: number;
  tier: LoyaltyTier | null;
  transactions: LoyaltyTransaction[];
  program: LoyaltyProgram | null;
}

export interface UpsertProgramDto {
  name?: string;
  isActive?: boolean;
  pointsPerUnit?: number;
  currency?: string;
  minRedeem?: number;
  redeemValue?: number;
  tiers?: LoyaltyTier[];
  rules?: Record<string, unknown>;
}

export interface CreateTxnDto {
  customerId: string;
  points: number;
  type: LoyaltyTxnType;
  reason?: string;
  referenceType?: string;
  referenceId?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────
export async function fetchLoyaltyProgram(): Promise<LoyaltyProgram> {
  const { data } = await apiClient.get<ApiSuccess<LoyaltyProgram>>(
    "/api/loyalty/program"
  );
  return data.data;
}

export async function upsertLoyaltyProgram(
  dto: UpsertProgramDto
): Promise<LoyaltyProgram> {
  const { data } = await apiClient.put<ApiSuccess<LoyaltyProgram>>(
    "/api/loyalty/program",
    dto
  );
  return data.data;
}

export async function fetchLoyaltyStats(): Promise<LoyaltyStats> {
  const { data } = await apiClient.get<ApiSuccess<LoyaltyStats>>(
    "/api/loyalty/stats"
  );
  return data.data;
}

export async function fetchTopMembers(limit = 20): Promise<TopMember[]> {
  const { data } = await apiClient.get<ApiSuccess<TopMember[]>>(
    "/api/loyalty/top-members",
    { params: { limit } }
  );
  return data.data;
}

export async function fetchLoyaltyTransactions(
  params: { page?: number; limit?: number; customerId?: string; type?: LoyaltyTxnType } = {}
): Promise<Paginated<LoyaltyTransaction>> {
  const { data } = await apiClient.get<
    ApiSuccess<Paginated<LoyaltyTransaction>>
  >("/api/loyalty/transactions", { params });
  return data.data;
}

export async function createLoyaltyTransaction(
  dto: CreateTxnDto
): Promise<LoyaltyTransaction> {
  const { data } = await apiClient.post<ApiSuccess<LoyaltyTransaction>>(
    "/api/loyalty/transactions",
    dto
  );
  return data.data;
}

export async function deleteLoyaltyTransaction(
  id: string
): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/loyalty/transactions/${id}`
  );
  return data.data;
}

export async function fetchCustomerLoyalty(
  customerId: string
): Promise<CustomerLoyaltyView> {
  const { data } = await apiClient.get<ApiSuccess<CustomerLoyaltyView>>(
    `/api/loyalty/customer/${customerId}`
  );
  return data.data;
}
