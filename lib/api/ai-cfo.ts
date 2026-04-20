"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// AI CFO — TYPES + API CLIENT
// ============================================================================

export type Locale = "en" | "ar" | "tr";

export interface BusinessSnapshot {
  company: {
    id: string;
    name: string;
    plan: string;
    country: string | null;
    industry: string | null;
  };
  customers: {
    total: number;
    new30d: number;
    new7d: number;
    byStatus: Record<string, number>;
  };
  deals: {
    total: number;
    open: number;
    wonLast30d: number;
    wonValueLast30d: number;
    lostLast30d: number;
    inPipelineValue: number;
    weightedPipelineValue: number;
    byStage: Record<string, { count: number; value: number }>;
    avgDealSize: number;
  };
  quotes: {
    total: number;
    acceptedValueLast30d: number;
    pendingValue: number;
    acceptRate: number;
  };
  loyalty: {
    activeMembers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
  };
  activities: {
    last30d: number;
    byType: Record<string, number>;
  };
  tasks: {
    open: number;
    overdue: number;
    completedLast30d: number;
  };
  followup: {
    staleCustomers: number;
    criticalStale: number;
  };
  generatedAt: string;
}

export interface AIInsight {
  question: string;
  answer: string;
  snapshot: BusinessSnapshot;
  model: string;
  locale: Locale;
  generatedAt: string;
}

export interface PromptTemplate {
  id: string;
  label: string;
}

export async function fetchSnapshot(): Promise<BusinessSnapshot> {
  const { data } = await apiClient.get<ApiSuccess<BusinessSnapshot>>(
    "/api/ai-cfo/snapshot"
  );
  return data.data;
}

export async function fetchPromptTemplates(
  locale: Locale = "en"
): Promise<PromptTemplate[]> {
  const { data } = await apiClient.get<ApiSuccess<PromptTemplate[]>>(
    "/api/ai-cfo/templates",
    { params: { locale } }
  );
  return data.data;
}

export async function askAICFO(
  question: string,
  locale: Locale = "en"
): Promise<AIInsight> {
  const { data } = await apiClient.post<ApiSuccess<AIInsight>>(
    "/api/ai-cfo/ask",
    { question, locale }
  );
  return data.data;
}
