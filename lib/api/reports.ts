"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// REPORTS — TYPES + API
// ============================================================================

export interface ExchangeRate {
  id: string;
  companyId: string;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  effectiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueReport {
  baseCurrency: string;
  totalRevenue: number;
  dealCount: number;
  byCurrency: Record<
    string,
    { count: number; native: number; converted: number }
  >;
  unconvertibleCurrencies: string[];
  deals: any[];
  generatedAt: string;
}

export interface PipelineReport {
  baseCurrency: string;
  totalOpenValue: number;
  totalWeightedValue: number;
  dealCount: number;
  byStage: Record<
    string,
    { count: number; value: number; weightedValue: number }
  >;
  generatedAt: string;
}

export interface FinancialSummary {
  baseCurrency: string;
  revenue30d: { total: number; dealCount: number };
  revenue90d: { total: number; dealCount: number };
  openPipeline: { total: number; weighted: number; dealCount: number };
  currenciesInUse: string[];
  hasUnconvertible: boolean;
  generatedAt: string;
}

export async function fetchRates(): Promise<ExchangeRate[]> {
  const { data } = await apiClient.get<ApiSuccess<ExchangeRate[]>>(
    "/api/reports/rates"
  );
  return data.data;
}

export async function upsertRate(
  fromCurrency: string,
  toCurrency: string,
  rate: number
): Promise<ExchangeRate> {
  const { data } = await apiClient.post<ApiSuccess<ExchangeRate>>(
    "/api/reports/rates",
    { fromCurrency, toCurrency, rate }
  );
  return data.data;
}

export async function deleteRate(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/reports/rates/${id}`
  );
  return data.data;
}

export async function fetchRevenueReport(
  baseCurrency: string = "USD",
  since?: string
): Promise<RevenueReport> {
  const { data } = await apiClient.get<ApiSuccess<RevenueReport>>(
    "/api/reports/revenue",
    { params: { baseCurrency, since } }
  );
  return data.data;
}

export async function fetchPipelineReport(
  baseCurrency: string = "USD"
): Promise<PipelineReport> {
  const { data } = await apiClient.get<ApiSuccess<PipelineReport>>(
    "/api/reports/pipeline",
    { params: { baseCurrency } }
  );
  return data.data;
}

export async function fetchFinancialSummary(
  baseCurrency: string = "USD"
): Promise<FinancialSummary> {
  const { data } = await apiClient.get<ApiSuccess<FinancialSummary>>(
    "/api/reports/summary",
    { params: { baseCurrency } }
  );
  return data.data;
}
