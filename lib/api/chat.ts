"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// INTERNAL CHAT — TYPES + API CLIENT
// ============================================================================

export interface ChatUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface ChatThread {
  partnerId: string;
  user: ChatUser;
  lastMessage: string;
  lastMessageAt: string;
  lastFromMe: boolean;
  unread: number;
}

export interface ChatMessage {
  id: string;
  companyId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  partner: ChatUser;
  messages: ChatMessage[];
}

export async function fetchThreads(): Promise<ChatThread[]> {
  const { data } = await apiClient.get<ApiSuccess<ChatThread[]>>(
    "/api/chat/threads"
  );
  return data.data;
}

export async function fetchTeam(): Promise<ChatUser[]> {
  const { data } = await apiClient.get<ApiSuccess<ChatUser[]>>(
    "/api/chat/team"
  );
  return data.data;
}

export async function fetchConversation(
  partnerId: string,
  since?: string
): Promise<Conversation> {
  const params: Record<string, string> = {};
  if (since) params.since = since;
  const { data } = await apiClient.get<ApiSuccess<Conversation>>(
    `/api/chat/conversation/${partnerId}`,
    { params }
  );
  return data.data;
}

export async function sendChatMessage(
  toUserId: string,
  content: string
): Promise<ChatMessage> {
  const { data } = await apiClient.post<ApiSuccess<ChatMessage>>(
    "/api/chat/send",
    { toUserId, content }
  );
  return data.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<ApiSuccess<{ unread: number }>>(
    "/api/chat/unread"
  );
  return data.data.unread;
}
