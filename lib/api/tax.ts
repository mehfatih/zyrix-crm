"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// TAX — TYPES + API CLIENT
// ============================================================================

export interface TaxRate {
  id: string;
  companyId: string;
  name: string;
  code: string | null;
  countryCode: string | null;
  ratePercent: string;
  isDefault: boolean;
  isActive: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxRateDto {
  name: string;
  code?: string;
  countryCode?: string;
  ratePercent: number;
  isDefault?: boolean;
  isActive?: boolean;
  description?: string;
}

export type UpdateTaxRateDto = Partial<CreateTaxRateDto>;

export interface PresetRate {
  name: string;
  code: string;
  ratePercent: number;
  isDefault?: boolean;
}

export interface PresetCountry {
  countryCode: string;
  rateCount: number;
  rates: PresetRate[];
}

export interface SeedResult {
  country: string;
  created: number;
  skipped: number;
  total: number;
}

export async function fetchTaxRates(params: {
  countryCode?: string;
  activeOnly?: boolean;
} = {}): Promise<TaxRate[]> {
  const { data } = await apiClient.get<ApiSuccess<TaxRate[]>>("/api/tax", {
    params,
  });
  return data.data;
}

export async function createTaxRate(dto: CreateTaxRateDto): Promise<TaxRate> {
  const { data } = await apiClient.post<ApiSuccess<TaxRate>>("/api/tax", dto);
  return data.data;
}

export async function updateTaxRate(
  id: string,
  dto: UpdateTaxRateDto
): Promise<TaxRate> {
  const { data } = await apiClient.patch<ApiSuccess<TaxRate>>(
    `/api/tax/${id}`,
    dto
  );
  return data.data;
}

export async function deleteTaxRate(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/tax/${id}`
  );
  return data.data;
}

export async function fetchTaxPresets(): Promise<PresetCountry[]> {
  const { data } = await apiClient.get<ApiSuccess<PresetCountry[]>>(
    "/api/tax/presets"
  );
  return data.data;
}

export async function seedTaxPresets(countryCode: string): Promise<SeedResult> {
  const { data } = await apiClient.post<ApiSuccess<SeedResult>>(
    "/api/tax/seed",
    { countryCode }
  );
  return data.data;
}
