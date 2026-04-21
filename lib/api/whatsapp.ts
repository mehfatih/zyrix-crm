"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// WHATSAPP CRM — TYPES + API CLIENT
// ============================================================================

export interface InboxCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string | null;
  status: string;
}

export interface InboxConversation {
  phoneNumber: string;
  lastMessage: string;
  lastDirection: string;
  lastTimestamp: string;
  customerId: string | null;
  messageCount: number;
  customer: InboxCustomer | null;
}

export interface WhatsappMessage {
  id: string;
  companyId: string;
  customerId: string | null;
  phoneNumber: string;
  messageText: string;
  direction: string; // "incoming" | "outgoing"
  messageId: string | null;
  mediaUrl: string | null;
  aiProcessed: boolean;
  aiExtracted: any;
  timestamp: string;
  createdAt: string;
}

export interface WhatsappThreadCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  whatsappPhone: string | null;
  status: string;
}

export interface WhatsappThread {
  phoneNumber: string;
  customer: WhatsappThreadCustomer | null;
  messages: WhatsappMessage[];
}

export interface SendResult {
  success: boolean;
  messageId: string | null;
  error?: string;
}

export async function fetchInbox(): Promise<InboxConversation[]> {
  const { data } = await apiClient.get<ApiSuccess<InboxConversation[]>>(
    "/api/whatsapp/inbox"
  );
  return data.data;
}

export async function fetchThread(
  phoneNumber: string
): Promise<WhatsappThread> {
  const { data } = await apiClient.get<ApiSuccess<WhatsappThread>>(
    `/api/whatsapp/thread/${encodeURIComponent(phoneNumber)}`
  );
  return data.data;
}

export async function sendWhatsappMessage(
  phoneNumber: string,
  text: string
): Promise<SendResult> {
  const { data } = await apiClient.post<ApiSuccess<SendResult>>(
    "/api/whatsapp/send",
    { phoneNumber, text }
  );
  return data.data;
}

export async function suggestAIReply(
  messageText: string,
  customerName?: string,
  language: "ar" | "en" | "tr" = "en"
): Promise<string> {
  const { data } = await apiClient.post<
    ApiSuccess<{ suggestion: string }>
  >("/api/whatsapp/ai/suggest-reply", {
    messageText,
    customerName,
    language,
  });
  return data.data.suggestion;
}
