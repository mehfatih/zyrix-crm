"use client";

import axios, { type AxiosError, type AxiosInstance } from "axios";

// ============================================================================
// ADMIN API CLIENT
// ============================================================================
// Uses separate token storage keys to avoid colliding with regular user auth.
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ADMIN_ACCESS_KEY = "zyrix_admin_access_token";
const ADMIN_REFRESH_KEY = "zyrix_admin_refresh_token";
const ADMIN_USER_KEY = "zyrix_admin_user";

// ─────────────────────────────────────────────────────────────────────────
// Token storage
// ─────────────────────────────────────────────────────────────────────────
export function getAdminAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ADMIN_ACCESS_KEY);
  } catch {
    return null;
  }
}

export function setAdminAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_ACCESS_KEY, token);
  } catch {
    // ignore
  }
}

export function setAdminRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_REFRESH_KEY, token);
  } catch {
    // ignore
  }
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export function setAdminUser(user: AdminUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_ACCESS_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────
export const adminApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // On 401 from admin endpoints, clear auth and let component redirect
    if (error.response?.status === 401) {
      clearAdminAuth();
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────
// Admin API surface
// ─────────────────────────────────────────────────────────────────────────
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string; details?: unknown };
}

export async function adminLogin(email: string, password: string) {
  const { data } = await adminApi.post<
    ApiEnvelope<{
      user: AdminUser;
      tokens: { accessToken: string; refreshToken: string; expiresIn: number };
    }>
  >("/api/admin/login", { email, password });

  if (!data.success) {
    throw new Error(data.error?.message ?? "Login failed");
  }

  setAdminAccessToken(data.data.tokens.accessToken);
  setAdminRefreshToken(data.data.tokens.refreshToken);
  setAdminUser(data.data.user);
  return data.data;
}

export async function fetchMe() {
  const { data } = await adminApi.get<ApiEnvelope<{ user: AdminUser }>>(
    "/api/admin/me"
  );
  return data.data.user;
}

export interface AdminStats {
  companies: {
    total: number;
    active: number;
    suspended: number;
    trial: number;
    recentSignups30d: number;
  };
  users: { total: number; active: number };
  dataCounts: { customers: number; deals: number };
  subscriptions: { total: number; active: number };
  plansDistribution: Array<{ plan: string; count: number }>;
}

export async function fetchStats() {
  const { data } = await adminApi.get<ApiEnvelope<AdminStats>>(
    "/api/admin/stats"
  );
  return data.data;
}

export interface AdminCompanyListItem {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  trialEndsAt: string | null;
  suspendedAt: string | null;
  billingEmail: string | null;
  country: string | null;
  industry: string | null;
  size: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { users: number; customers: number; deals: number };
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchCompanies(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
}) {
  const { data } = await adminApi.get<
    ApiEnvelope<Paginated<AdminCompanyListItem>>
  >("/api/admin/companies", { params });
  return data.data;
}

export async function suspendCompany(id: string, reason?: string) {
  const { data } = await adminApi.post<ApiEnvelope<unknown>>(
    `/api/admin/companies/${id}/suspend`,
    { reason }
  );
  return data.data;
}

export async function resumeCompany(id: string) {
  const { data } = await adminApi.post<ApiEnvelope<unknown>>(
    `/api/admin/companies/${id}/resume`
  );
  return data.data;
}

export async function deleteCompany(id: string) {
  const { data } = await adminApi.delete<ApiEnvelope<unknown>>(
    `/api/admin/companies/${id}`
  );
  return data.data;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  company: { id: string; name: string; slug: string; plan: string };
}

export async function fetchUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const { data } = await adminApi.get<
    ApiEnvelope<Paginated<AdminUserListItem>>
  >("/api/admin/users", { params });
  return data.data;
}

export async function disableUser(id: string, reason?: string) {
  const { data } = await adminApi.post<ApiEnvelope<unknown>>(
    `/api/admin/users/${id}/disable`,
    { reason }
  );
  return data.data;
}

export async function enableUser(id: string) {
  const { data } = await adminApi.post<ApiEnvelope<unknown>>(
    `/api/admin/users/${id}/enable`
  );
  return data.data;
}

export async function forceResetPassword(id: string) {
  const { data } = await adminApi.post<ApiEnvelope<{ tempPassword: string }>>(
    `/api/admin/users/${id}/force-reset-password`
  );
  return data.data;
}

export interface AdminPlan {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  nameTr: string;
  description: string | null;
  descriptionAr: string | null;
  descriptionTr: string | null;
  priceMonthlyUsd: number | string;
  priceYearlyUsd: number | string;
  priceMonthlyTry: number | string;
  priceYearlyTry: number | string;
  priceMonthlySar: number | string;
  priceYearlySar: number | string;
  maxUsers: number;
  maxCustomers: number;
  maxDeals: number;
  maxStorageGb: number;
  maxWhatsappMsg: number;
  maxAiTokens: number;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  color: string;
}

export async function fetchPlansAdmin() {
  const { data } = await adminApi.get<ApiEnvelope<AdminPlan[]>>(
    "/api/admin/plans?includeInactive=true"
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Company details (single)
// ─────────────────────────────────────────────────────────────────────────
export interface AdminCompanyDetails extends AdminCompanyListItem {
  suspendReason: string | null;
  deletedAt: string | null;
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    lastLoginAt: string | null;
    createdAt: string;
  }>;
  subscriptions?: Array<{
    id: string;
    planSlug: string;
    status: string;
    billingCycle: string;
    currency: string;
    amount: number | string;
    startedAt: string;
    endsAt: string | null;
  }>;
  planOverrides?: Array<{
    id: string;
    featureSlug: string;
    enabled: boolean;
    expiresAt: string | null;
    reason: string | null;
    createdAt: string;
  }>;
}

export async function fetchCompany(id: string) {
  const { data } = await adminApi.get<ApiEnvelope<AdminCompanyDetails>>(
    `/api/admin/companies/${id}`
  );
  return data.data;
}

export async function updateCompany(
  id: string,
  dto: {
    name?: string;
    plan?: string;
    billingEmail?: string;
    country?: string;
    industry?: string;
    size?: string;
  }
) {
  const { data } = await adminApi.patch<ApiEnvelope<AdminCompanyListItem>>(
    `/api/admin/companies/${id}`,
    dto
  );
  return data.data;
}

export async function impersonateCompany(id: string) {
  const { data } = await adminApi.post<
    ApiEnvelope<{ user: AdminUser; company: { id: string; name: string } }>
  >(`/api/admin/companies/${id}/impersonate`);
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// User details (single)
// ─────────────────────────────────────────────────────────────────────────
export async function fetchUser(id: string) {
  const { data } = await adminApi.get<ApiEnvelope<AdminUserListItem>>(
    `/api/admin/users/${id}`
  );
  return data.data;
}

export async function updateUser(
  id: string,
  dto: { fullName?: string; phone?: string; role?: string }
) {
  const { data } = await adminApi.patch<ApiEnvelope<AdminUserListItem>>(
    `/api/admin/users/${id}`,
    dto
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Plan update
// ─────────────────────────────────────────────────────────────────────────
export async function fetchPlanAdmin(id: string) {
  const { data } = await adminApi.get<ApiEnvelope<AdminPlan>>(
    `/api/admin/plans/${id}`
  );
  return data.data;
}

export async function updatePlan(id: string, dto: Partial<AdminPlan>) {
  const { data } = await adminApi.patch<ApiEnvelope<AdminPlan>>(
    `/api/admin/plans/${id}`,
    dto
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Plan overrides
// ─────────────────────────────────────────────────────────────────────────
export interface PlanOverride {
  id: string;
  companyId: string;
  featureSlug: string;
  enabled: boolean;
  expiresAt: string | null;
  reason: string | null;
  grantedBy: string | null;
  createdAt: string;
}

export async function fetchPlanOverrides(companyId?: string) {
  const { data } = await adminApi.get<ApiEnvelope<PlanOverride[]>>(
    "/api/admin/plan-overrides",
    { params: companyId ? { companyId } : undefined }
  );
  return data.data;
}

export async function createPlanOverride(dto: {
  companyId: string;
  featureSlug: string;
  enabled?: boolean;
  expiresAt?: string;
  reason?: string;
}) {
  const { data } = await adminApi.post<ApiEnvelope<PlanOverride>>(
    "/api/admin/plan-overrides",
    dto
  );
  return data.data;
}

export async function deletePlanOverride(id: string) {
  const { data } = await adminApi.delete<ApiEnvelope<unknown>>(
    `/api/admin/plan-overrides/${id}`
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Audit logs
// ─────────────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string | null;
  companyId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: { email: string; fullName: string } | null;
  company?: { name: string } | null;
}

export async function fetchAuditLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  companyId?: string;
  userId?: string;
}) {
  const { data } = await adminApi.get<ApiEnvelope<Paginated<AuditLog>>>(
    "/api/admin/audit-logs",
    { params }
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Feature catalog (used by plan overrides UI)
// ─────────────────────────────────────────────────────────────────────────
export const ALL_FEATURES = [
  "contacts",
  "deals",
  "pipeline",
  "tasks",
  "notes",
  "whatsapp_basic",
  "whatsapp_api",
  "email_sync",
  "live_chat",
  "ai_extract",
  "ai_cfo",
  "ai_insights",
  "ai_dialects",
  "ai_voice",
  "quotes",
  "invoices",
  "commission",
  "loyalty",
  "dashboards",
  "forecasts",
  "reports_advanced",
  "workflows_basic",
  "workflows_advanced",
  "customer_portal",
  "tickets",
  "sso",
  "audit_log",
  "white_label",
  "dedicated_support",
  "custom_domain",
  "api_access",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// Public plans (no auth)
// ─────────────────────────────────────────────────────────────────────────
export async function fetchPublicPlans(): Promise<AdminPlan[]> {
  const res = await axios.get<ApiEnvelope<AdminPlan[]>>(
    `${API_URL}/api/public/plans`
  );
  return res.data.data;
}
