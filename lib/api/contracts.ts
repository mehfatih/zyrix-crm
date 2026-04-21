"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// CONTRACTS — TYPES + API CLIENT
// ============================================================================

export type ContractStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "active"
  | "expired"
  | "terminated";

export interface Contract {
  id: string;
  companyId: string;
  customerId: string;
  dealId: string | null;
  createdById: string;
  contractNumber: string;
  title: string;
  description: string | null;
  status: ContractStatus;
  startDate: string | null;
  endDate: string | null;
  renewalDate: string | null;
  signedAt: string | null;
  value: string;
  currency: string;
  fileUrl: string | null;
  fileName: string | null;
  notes: string | null;
  terms: string | null;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    fullName: string;
    companyName: string | null;
    email: string | null;
  };
  deal: { id: string; title: string; stage?: string } | null;
  createdBy: { id: string; fullName: string; email: string };
}

export interface ContractStats {
  total: number;
  byStatus: { draft: number; active: number; pending: number };
  expiringSoon: number;
  totalActiveValue: number;
}

export interface CreateContractDto {
  customerId: string;
  dealId?: string | null;
  title: string;
  description?: string;
  status?: ContractStatus;
  startDate?: string | null;
  endDate?: string | null;
  renewalDate?: string | null;
  signedAt?: string | null;
  value?: number;
  currency?: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  terms?: string;
}

export type UpdateContractDto = Partial<CreateContractDto>;

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchContracts(
  params: {
    status?: ContractStatus;
    customerId?: string;
    expiringWithinDays?: number;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<Paginated<Contract>> {
  const { data } = await apiClient.get<ApiSuccess<Paginated<Contract>>>(
    "/api/contracts",
    { params }
  );
  return data.data;
}

export async function fetchContract(id: string): Promise<Contract> {
  const { data } = await apiClient.get<ApiSuccess<Contract>>(
    `/api/contracts/${id}`
  );
  return data.data;
}

export async function createContract(
  dto: CreateContractDto
): Promise<Contract> {
  const { data } = await apiClient.post<ApiSuccess<Contract>>(
    "/api/contracts",
    dto
  );
  return data.data;
}

export async function updateContract(
  id: string,
  dto: UpdateContractDto
): Promise<Contract> {
  const { data } = await apiClient.patch<ApiSuccess<Contract>>(
    `/api/contracts/${id}`,
    dto
  );
  return data.data;
}

export async function deleteContract(
  id: string
): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/contracts/${id}`
  );
  return data.data;
}

export async function createContractReminder(id: string): Promise<unknown> {
  const { data } = await apiClient.post<ApiSuccess<unknown>>(
    `/api/contracts/${id}/reminder`,
    {}
  );
  return data.data;
}

export async function fetchContractStats(): Promise<ContractStats> {
  const { data } = await apiClient.get<ApiSuccess<ContractStats>>(
    "/api/contracts/stats"
  );
  return data.data;
}
