"use client";

import axios from "axios";

// ============================================================================
// CUSTOMER PORTAL — API CLIENT (separate from admin apiClient)
// Portal uses its own zyrix_portal_session token, NOT the admin JWT
// ============================================================================

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.crm.zyrix.co";

const SESSION_KEY = "zyrix_portal_session";

// Session storage
export function getPortalSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setPortalSession(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, token);
}

export function clearPortalSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// Client
const portalClient = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

portalClient.interceptors.request.use((config) => {
  const token = getPortalSession();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface PortalCustomer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  companyId: string;
  lifetimeValue?: string;
  company: { id: string; name: string };
}

export interface PortalQuote {
  id: string;
  quoteNumber: string;
  title: string;
  status: string;
  total: string;
  currency: string;
  validUntil: string | null;
  issuedAt: string | null;
  publicToken: string;
}

export interface PortalContract {
  id: string;
  contractNumber: string;
  title: string;
  status: string;
  value: string;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  fileUrl: string | null;
}

export interface PortalDashboard {
  customer: PortalCustomer;
  quotes: PortalQuote[];
  contracts: PortalContract[];
  loyaltyBalance: number;
}

// API calls
export async function requestMagicLink(
  email: string,
  portalUrl: string
): Promise<void> {
  await portalClient.post("/api/portal/magic-link", { email, portalUrl });
}

export async function verifyMagicToken(
  token: string
): Promise<{ sessionToken: string; customer: PortalCustomer }> {
  const { data } = await portalClient.post<{
    success: boolean;
    data: { sessionToken: string; customer: PortalCustomer };
  }>("/api/portal/verify", { token });
  return data.data;
}

export async function fetchPortalMe(): Promise<PortalCustomer> {
  const { data } = await portalClient.get<{
    success: boolean;
    data: PortalCustomer;
  }>("/api/portal/me");
  return data.data;
}

export async function fetchPortalDashboard(): Promise<PortalDashboard> {
  const { data } = await portalClient.get<{
    success: boolean;
    data: PortalDashboard;
  }>("/api/portal/dashboard");
  return data.data;
}

export async function portalLogout(): Promise<void> {
  try {
    await portalClient.post("/api/portal/logout", {});
  } catch {
    /* ignore */
  }
  clearPortalSession();
}
