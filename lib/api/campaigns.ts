"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// CAMPAIGNS — TYPES + API CLIENT
// ============================================================================

export type Channel = "email" | "whatsapp" | "sms";
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";
export type TargetType = "all" | "status" | "tag" | "manual";
export type RecipientStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed";

export interface Campaign {
  id: string;
  companyId: string;
  createdById: string;
  name: string;
  subject: string | null;
  channel: Channel;
  status: CampaignStatus;
  bodyHtml: string | null;
  bodyText: string | null;
  fromName: string | null;
  fromEmail: string | null;
  replyTo: string | null;
  targetType: TargetType;
  targetValue: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; fullName: string; email: string };
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  customerId: string;
  email: string | null;
  phone: string | null;
  status: RecipientStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  errorMessage: string | null;
  messageId: string | null;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    email: string | null;
    companyName: string | null;
  };
}

export interface CampaignDetail extends Campaign {
  recipients: CampaignRecipient[];
}

export interface CampaignStats {
  total: number;
  byStatus: {
    draft: number;
    sent: number;
    sending: number;
    scheduled: number;
  };
  totalMessagesSent: number;
  totalOpens: number;
  openRatePercent: number;
}

export interface CreateCampaignDto {
  name: string;
  subject?: string;
  channel: Channel;
  bodyHtml?: string;
  bodyText?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  targetType?: TargetType;
  targetValue?: string;
  scheduledAt?: string | null;
  customerIds?: string[];
}

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchCampaigns(
  params: {
    status?: CampaignStatus;
    channel?: Channel;
    page?: number;
    limit?: number;
  } = {}
): Promise<Paginated<Campaign>> {
  const { data } = await apiClient.get<ApiSuccess<Paginated<Campaign>>>(
    "/api/campaigns",
    { params }
  );
  return data.data;
}

export async function fetchCampaign(id: string): Promise<CampaignDetail> {
  const { data } = await apiClient.get<ApiSuccess<CampaignDetail>>(
    `/api/campaigns/${id}`
  );
  return data.data;
}

export async function createCampaign(
  dto: CreateCampaignDto
): Promise<Campaign> {
  const { data } = await apiClient.post<ApiSuccess<Campaign>>(
    "/api/campaigns",
    dto
  );
  return data.data;
}

export async function updateCampaign(
  id: string,
  dto: UpdateCampaignDto
): Promise<Campaign> {
  const { data } = await apiClient.patch<ApiSuccess<Campaign>>(
    `/api/campaigns/${id}`,
    dto
  );
  return data.data;
}

export async function sendCampaign(id: string): Promise<Campaign> {
  const { data } = await apiClient.post<ApiSuccess<Campaign>>(
    `/api/campaigns/${id}/send`,
    {}
  );
  return data.data;
}

export async function deleteCampaign(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/campaigns/${id}`
  );
  return data.data;
}

export async function fetchCampaignStats(): Promise<CampaignStats> {
  const { data } = await apiClient.get<ApiSuccess<CampaignStats>>(
    "/api/campaigns/stats"
  );
  return data.data;
}
