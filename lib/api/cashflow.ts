"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// CASH FLOW FORECAST — TYPES + API CLIENT
// ============================================================================

export type Horizon = 30 | 60 | 90;

export interface ForecastBucket {
  label: string;
  startDate: string;
  endDate: string;
  weightedValue: number;
  dealCount: number;
  totalValue: number;
}

export interface TopDeal {
  id: string;
  title: string;
  value: number;
  currency: string;
  probability: number;
  weightedValue: number;
  stage: string;
  expectedCloseDate: string | null;
  customer: {
    id: string;
    fullName: string;
    companyName: string | null;
  };
}

export interface StageBreakdown {
  stage: string;
  count: number;
  weightedValue: number;
}

export interface ForecastSummary {
  horizon: Horizon;
  totalWeightedValue: number;
  totalPotentialValue: number;
  dealCount: number;
  avgProbability: number;
  currency: string;
  buckets: ForecastBucket[];
  topDeals: TopDeal[];
  byStage: StageBreakdown[];
}

export interface HistoricalContext {
  wonLast30dCount: number;
  wonLast30dValue: number;
  lostLast30dCount: number;
  winRatePercent: number;
  historicalAvgDealSize: number;
}

export async function fetchForecast(
  horizon: Horizon = 30,
  currency = "TRY"
): Promise<ForecastSummary> {
  const { data } = await apiClient.get<ApiSuccess<ForecastSummary>>(
    "/api/cashflow/forecast",
    { params: { horizon, currency } }
  );
  return data.data;
}

export async function fetchHistorical(): Promise<HistoricalContext> {
  const { data } = await apiClient.get<ApiSuccess<HistoricalContext>>(
    "/api/cashflow/historical"
  );
  return data.data;
}
