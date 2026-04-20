"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// QUOTES — TYPES + API CLIENT
// ============================================================================

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired";

export interface QuoteRelatedUser {
  id: string;
  email: string;
  fullName: string;
}

export interface QuoteRelatedCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string | null;
}

export interface QuoteRelatedDeal {
  id: string;
  title: string;
  stage: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  name: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
  taxPercent: string;
  lineTotal: string;
  position: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  companyId: string;
  customerId: string;
  dealId: string | null;
  createdById: string;
  quoteNumber: string;
  title: string;
  status: QuoteStatus;
  issuedAt: string | null;
  validUntil: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  sentAt: string | null;
  currency: string;
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  total: string;
  notes: string | null;
  terms: string | null;
  publicToken: string | null;
  viewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: QuoteRelatedCustomer;
  deal: QuoteRelatedDeal | null;
  createdBy: QuoteRelatedUser;
  items: QuoteItem[];
}

export interface QuoteStats {
  total: number;
  byStatus: {
    draft: number;
    sent: number;
    viewed: number;
    accepted: number;
    rejected: number;
    expired: number;
  };
  acceptedValue: number;
  pendingValue: number;
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

export interface QuoteItemInput {
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  position?: number;
}

export interface CreateQuoteDto {
  customerId: string;
  dealId?: string | null;
  title: string;
  status?: QuoteStatus;
  currency?: string;
  issuedAt?: string | null;
  validUntil?: string | null;
  notes?: string | null;
  terms?: string | null;
  items: QuoteItemInput[];
}

export type UpdateQuoteDto = Partial<CreateQuoteDto>;

export interface ListQuotesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: QuoteStatus;
  customerId?: string;
  dealId?: string;
  createdById?: string;
  sortBy?: "createdAt" | "validUntil" | "total" | "quoteNumber";
  sortOrder?: "asc" | "desc";
}

// ─────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────
export async function fetchQuoteStats(): Promise<QuoteStats> {
  const { data } =
    await apiClient.get<ApiSuccess<QuoteStats>>("/api/quotes/stats");
  return data.data;
}

export async function fetchQuotes(
  params: ListQuotesParams = {}
): Promise<Paginated<Quote>> {
  const { data } = await apiClient.get<ApiSuccess<Paginated<Quote>>>(
    "/api/quotes",
    { params }
  );
  return data.data;
}

export async function fetchQuote(id: string): Promise<Quote> {
  const { data } = await apiClient.get<ApiSuccess<Quote>>(`/api/quotes/${id}`);
  return data.data;
}

export async function createQuote(dto: CreateQuoteDto): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>("/api/quotes", dto);
  return data.data;
}

export async function updateQuote(
  id: string,
  dto: UpdateQuoteDto
): Promise<Quote> {
  const { data } = await apiClient.patch<ApiSuccess<Quote>>(
    `/api/quotes/${id}`,
    dto
  );
  return data.data;
}

export async function sendQuote(id: string): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>(
    `/api/quotes/${id}/send`,
    {}
  );
  return data.data;
}

export async function acceptQuote(id: string): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>(
    `/api/quotes/${id}/accept`,
    {}
  );
  return data.data;
}

export async function rejectQuote(id: string): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>(
    `/api/quotes/${id}/reject`,
    {}
  );
  return data.data;
}

export async function deleteQuote(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/quotes/${id}`
  );
  return data.data;
}

// Public (no auth)
export async function fetchPublicQuote(token: string): Promise<Quote> {
  const { data } = await apiClient.get<ApiSuccess<Quote>>(
    `/api/public/quotes/${token}`
  );
  return data.data;
}

export async function acceptPublicQuote(token: string): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>(
    `/api/public/quotes/${token}/accept`,
    {}
  );
  return data.data;
}

export async function rejectPublicQuote(token: string): Promise<Quote> {
  const { data } = await apiClient.post<ApiSuccess<Quote>>(
    `/api/public/quotes/${token}/reject`,
    {}
  );
  return data.data;
}
