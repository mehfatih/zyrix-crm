"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface Deal {
  id: string;
  companyId: string;
  customerId: string;
  ownerId: string | null;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  description: string | null;
  lostReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    fullName: string;
    companyName: string | null;
    email?: string | null;
  };
  owner?: { id: string; fullName: string } | null;
}

export interface CreateDealDto {
  customerId: string;
  title: string;
  value?: number;
  currency?: string;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: string;
  description?: string;
}

export interface DealsListResponse {
  deals: Deal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PipelineData {
  pipeline: Record<string, Deal[]>;
  summary: Array<{
    stage: string;
    count: number;
    totalValue: number;
    weightedValue: number;
  }>;
}

export async function listDeals(params?: {
  page?: number;
  limit?: number;
  stage?: string;
  customerId?: string;
  brandId?: string; // UUID or 'unbranded'; undefined = all brands
}): Promise<DealsListResponse> {
  const { data } = await apiClient.get<ApiSuccess<DealsListResponse>>(
    "/api/deals",
    { params }
  );
  return data.data;
}

export async function getDeal(id: string): Promise<Deal> {
  const { data } = await apiClient.get<ApiSuccess<Deal>>(`/api/deals/${id}`);
  return data.data;
}

export async function createDeal(dto: CreateDealDto): Promise<Deal> {
  const { data } = await apiClient.post<ApiSuccess<Deal>>("/api/deals", dto);
  return data.data;
}

export async function updateDeal(
  id: string,
  dto: Partial<CreateDealDto> & { lostReason?: string }
): Promise<Deal> {
  const { data } = await apiClient.patch<ApiSuccess<Deal>>(
    `/api/deals/${id}`,
    dto
  );
  return data.data;
}

export async function deleteDeal(id: string): Promise<void> {
  await apiClient.delete(`/api/deals/${id}`);
}

export async function getPipeline(): Promise<PipelineData> {
  const { data } = await apiClient.get<ApiSuccess<PipelineData>>(
    "/api/deals/pipeline"
  );
  return data.data;
}