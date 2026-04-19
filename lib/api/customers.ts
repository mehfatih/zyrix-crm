"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// CUSTOMER TYPES + API
// ============================================================================

export interface Customer {
  id: string;
  companyId: string;
  ownerId: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  whatsappPhone: string | null;
  companyName: string | null;
  position: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  source: string | null;
  status: "new" | "qualified" | "customer" | "lost";
  lifetimeValue: number;
  notes: string | null;
  aiExtracted: Record<string, unknown> | null;
  lastContactAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; fullName: string; email: string } | null;
  _count?: { deals: number; activities: number };
}

export interface CreateCustomerDto {
  fullName: string;
  email?: string;
  phone?: string;
  whatsappPhone?: string;
  companyName?: string;
  position?: string;
  country?: string;
  city?: string;
  address?: string;
  source?: string;
  status?: string;
  notes?: string;
}

export interface CustomersListResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerStats {
  total: number;
  recent30Days: number;
  byStatus: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────
export async function listCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<CustomersListResponse> {
  const { data } = await apiClient.get<ApiSuccess<CustomersListResponse>>(
    "/api/customers",
    { params }
  );
  return data.data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const { data } = await apiClient.get<ApiSuccess<Customer>>(
    `/api/customers/${id}`
  );
  return data.data;
}

export async function createCustomer(
  dto: CreateCustomerDto
): Promise<Customer> {
  const { data } = await apiClient.post<ApiSuccess<Customer>>(
    "/api/customers",
    dto
  );
  return data.data;
}

export async function updateCustomer(
  id: string,
  dto: Partial<CreateCustomerDto>
): Promise<Customer> {
  const { data } = await apiClient.patch<ApiSuccess<Customer>>(
    `/api/customers/${id}`,
    dto
  );
  return data.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiClient.delete(`/api/customers/${id}`);
}

export async function getCustomerStats(): Promise<CustomerStats> {
  const { data } = await apiClient.get<ApiSuccess<CustomerStats>>(
    "/api/customers/stats"
  );
  return data.data;
}