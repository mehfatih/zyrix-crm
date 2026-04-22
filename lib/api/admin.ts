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

export async function requestAdminPasswordReset(email: string) {
  await adminApi.post("/api/admin/forgot-password", { email });
}

export async function confirmAdminPasswordReset(
  token: string,
  newPassword: string
) {
  await adminApi.post("/api/admin/reset-password", { token, newPassword });
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
  baseCurrency: string | null;
  idleTimeoutMinutes: number | null;
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
    baseCurrency?: string | null;
    idleTimeoutMinutes?: number | null;
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

export interface ImpersonateTokenResult {
  accessToken: string;
  expiresIn: number;
  targetUser: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    companyId: string;
    emailVerified: boolean;
  };
  company: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

export async function impersonateCompanyToken(id: string) {
  const { data } = await adminApi.post<ApiEnvelope<ImpersonateTokenResult>>(
    `/api/admin/companies/${id}/impersonate-token`
  );
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

// ─────────────────────────────────────────────────────────────────────────
// Announcements
// ─────────────────────────────────────────────────────────────────────────
export interface AdminAnnouncement {
  id: string;
  title: string;
  titleAr: string | null;
  titleTr: string | null;
  content: string;
  contentAr: string | null;
  contentTr: string | null;
  type: string; // info | warn | critical
  target: string; // all | plan | company
  targetValue: string | null;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  titleAr?: string;
  titleTr?: string;
  content: string;
  contentAr?: string;
  contentTr?: string;
  type?: string;
  target?: string;
  targetValue?: string;
  startsAt?: string;
  endsAt?: string | null;
  isActive?: boolean;
}

export async function fetchAnnouncements(params: {
  page?: number;
  limit?: number;
  active?: boolean;
  target?: string;
}) {
  const { data } = await adminApi.get<ApiEnvelope<Paginated<AdminAnnouncement>>>(
    "/api/admin/announcements",
    { params }
  );
  return data.data;
}

export async function createAnnouncement(dto: CreateAnnouncementDto) {
  const { data } = await adminApi.post<ApiEnvelope<AdminAnnouncement>>(
    "/api/admin/announcements",
    dto
  );
  return data.data;
}

export async function updateAnnouncement(
  id: string,
  dto: Partial<CreateAnnouncementDto>
) {
  const { data } = await adminApi.patch<ApiEnvelope<AdminAnnouncement>>(
    `/api/admin/announcements/${id}`,
    dto
  );
  return data.data;
}

export async function deleteAnnouncement(id: string) {
  const { data } = await adminApi.delete<ApiEnvelope<{ deleted: boolean }>>(
    `/api/admin/announcements/${id}`
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Support tickets
// ─────────────────────────────────────────────────────────────────────────
export interface SupportTicket {
  id: string;
  companyId: string;
  createdById: string;
  subject: string;
  description: string;
  category: string;
  priority: string; // low | medium | high | urgent
  status: string; // open | in_progress | resolved | closed
  assignedToId: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: { id: string; name: string; slug: string; plan: string };
  createdBy: { id: string; email: string; fullName: string };
  assignedTo: { id: string; email: string; fullName: string } | null;
}

export interface TicketStats {
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  urgent: number;
}

export async function fetchTicketStats() {
  const { data } = await adminApi.get<ApiEnvelope<TicketStats>>(
    "/api/admin/tickets/stats"
  );
  return data.data;
}

export async function fetchTickets(params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  companyId?: string;
  assignedToId?: string;
}) {
  const { data } = await adminApi.get<ApiEnvelope<Paginated<SupportTicket>>>(
    "/api/admin/tickets",
    { params }
  );
  return data.data;
}

export async function updateTicket(
  id: string,
  dto: {
    status?: string;
    priority?: string;
    category?: string;
    assignedToId?: string | null;
  }
) {
  const { data } = await adminApi.patch<ApiEnvelope<SupportTicket>>(
    `/api/admin/tickets/${id}`,
    dto
  );
  return data.data;
}

export async function closeTicket(id: string) {
  const { data } = await adminApi.post<ApiEnvelope<SupportTicket>>(
    `/api/admin/tickets/${id}/close`
  );
  return data.data;
}

export async function assignTicket(id: string, assigneeId: string) {
  const { data } = await adminApi.post<ApiEnvelope<SupportTicket>>(
    `/api/admin/tickets/${id}/assign`,
    { assigneeId }
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Settings — super admins
// ─────────────────────────────────────────────────────────────────────────
export interface SuperAdminRow {
  id: string;
  email: string;
  fullName: string;
  status: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export async function fetchSuperAdmins() {
  const { data } = await adminApi.get<ApiEnvelope<SuperAdminRow[]>>(
    "/api/admin/super-admins"
  );
  return data.data;
}

export async function inviteSuperAdmin(dto: {
  email: string;
  fullName?: string;
}) {
  const { data } = await adminApi.post<
    ApiEnvelope<{
      id: string;
      email: string;
      fullName: string;
      tempPassword: string;
      inviteToken: string;
    }>
  >("/api/admin/super-admins/invite", dto);
  return data.data;
}

export async function revokeSuperAdmin(id: string) {
  const { data } = await adminApi.delete<
    ApiEnvelope<{ id: string; email: string; role: string }>
  >(`/api/admin/super-admins/${id}`);
  return data.data;
}

export async function changeAdminPassword(dto: {
  currentPassword: string;
  newPassword: string;
}) {
  const { data } = await adminApi.post<ApiEnvelope<{ changed: boolean }>>(
    "/api/admin/change-password",
    dto
  );
  return data.data;
}

// ─────────────────────────────────────────────────────────────────────────
// Network rules (P8) — super-admin only
// ─────────────────────────────────────────────────────────────────────────

export type NetworkRuleType = "geo_block" | "rate_limit" | "ddos_heuristic";

export interface NetworkRule {
  id: string;
  type: string;
  label: string;
  config: Record<string, unknown>;
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchNetworkRules(): Promise<NetworkRule[]> {
  const { data } = await adminApi.get<ApiEnvelope<NetworkRule[]>>(
    "/api/admin/network-rules"
  );
  return data.data;
}

export async function createNetworkRule(input: {
  type: NetworkRuleType;
  label: string;
  config: Record<string, unknown>;
  active?: boolean;
}): Promise<NetworkRule> {
  const { data } = await adminApi.post<ApiEnvelope<NetworkRule>>(
    "/api/admin/network-rules",
    input
  );
  return data.data;
}

export async function updateNetworkRule(
  id: string,
  input: {
    label?: string;
    config?: Record<string, unknown>;
    active?: boolean;
  }
): Promise<NetworkRule> {
  const { data } = await adminApi.patch<ApiEnvelope<NetworkRule>>(
    `/api/admin/network-rules/${id}`,
    input
  );
  return data.data;
}

export async function deleteNetworkRule(
  id: string
): Promise<{ deleted: boolean }> {
  const { data } = await adminApi.delete<ApiEnvelope<{ deleted: boolean }>>(
    `/api/admin/network-rules/${id}`
  );
  return data.data;
}
