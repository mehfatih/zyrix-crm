"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================
export interface EmailTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  variables: string[];
  isShared: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; fullName: string };
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  category?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  isShared?: boolean;
}

export async function listTemplates(category?: string): Promise<EmailTemplate[]> {
  const { data } = await apiClient.get<ApiSuccess<EmailTemplate[]>>(
    "/api/advanced/templates",
    { params: category ? { category } : {} }
  );
  return data.data;
}
export async function createTemplate(dto: CreateTemplateDto): Promise<EmailTemplate> {
  const { data } = await apiClient.post<ApiSuccess<EmailTemplate>>(
    "/api/advanced/templates",
    dto
  );
  return data.data;
}
export async function updateTemplate(id: string, dto: Partial<CreateTemplateDto>): Promise<EmailTemplate> {
  const { data } = await apiClient.put<ApiSuccess<EmailTemplate>>(
    `/api/advanced/templates/${id}`,
    dto
  );
  return data.data;
}
export async function deleteTemplate(id: string): Promise<void> {
  await apiClient.delete(`/api/advanced/templates/${id}`);
}
export async function markTemplateUsed(id: string): Promise<void> {
  await apiClient.post(`/api/advanced/templates/${id}/use`);
}

// ============================================================================
// CUSTOM FIELDS
// ============================================================================
export interface CustomField {
  id: string;
  entityType: "customer" | "deal";
  fieldKey: string;
  label: string;
  fieldType: "text" | "number" | "date" | "select" | "multi_select" | "boolean" | "url" | "email";
  options: string[] | null;
  required: boolean;
  defaultValue: string | null;
  position: number;
  isActive: boolean;
}

export interface CreateFieldDto {
  entityType: "customer" | "deal";
  fieldKey: string;
  label: string;
  fieldType: CustomField["fieldType"];
  options?: string[];
  required?: boolean;
  defaultValue?: string;
  position?: number;
}

export async function listCustomFields(entityType?: "customer" | "deal"): Promise<CustomField[]> {
  const { data } = await apiClient.get<ApiSuccess<CustomField[]>>(
    "/api/advanced/custom-fields",
    { params: entityType ? { entityType } : {} }
  );
  return data.data;
}
export async function createCustomField(dto: CreateFieldDto): Promise<CustomField> {
  const { data } = await apiClient.post<ApiSuccess<CustomField>>(
    "/api/advanced/custom-fields",
    dto
  );
  return data.data;
}
export async function updateCustomField(id: string, dto: Partial<CreateFieldDto> & { isActive?: boolean }): Promise<CustomField> {
  const { data } = await apiClient.put<ApiSuccess<CustomField>>(
    `/api/advanced/custom-fields/${id}`,
    dto
  );
  return data.data;
}
export async function deleteCustomField(id: string): Promise<void> {
  await apiClient.delete(`/api/advanced/custom-fields/${id}`);
}

// ============================================================================
// BULK ACTIONS
// ============================================================================
export type BulkActionType =
  | "delete"
  | "assignOwner"
  | "changeStatus"
  | "changeStage"
  | "addTag"
  | "removeTag";

export interface BulkActionResult {
  action: BulkActionType;
  entityType: "customers" | "deals";
  total: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

export async function bulkAction(
  entityType: "customers" | "deals",
  action: BulkActionType,
  ids: string[],
  params?: { ownerId?: string; status?: string; stage?: string; tagId?: string }
): Promise<BulkActionResult> {
  const { data } = await apiClient.post<ApiSuccess<BulkActionResult>>(
    "/api/advanced/bulk",
    { entityType, action, ids, params }
  );
  return data.data;
}

// ============================================================================
// CSV IMPORT
// ============================================================================
export interface ImportResult {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: { row: number; message: string }[];
  duplicates: { row: number; email?: string; phone?: string }[];
}

export async function importCustomers(
  csvText: string,
  options?: { ownerId?: string; skipDuplicates?: boolean }
): Promise<ImportResult> {
  const { data } = await apiClient.post<ApiSuccess<ImportResult>>(
    "/api/advanced/import/customers",
    { csvText, ...options }
  );
  return data.data;
}

// ============================================================================
// EXPORT
// ============================================================================
export type ExportEntityType =
  | "customers"
  | "deals"
  | "quotes"
  | "contracts"
  | "commissions";
export type ExportFormat = "csv" | "xlsx" | "pdf";

export async function exportData(
  entityType: ExportEntityType,
  format: ExportFormat,
  filters?: Record<string, any>
): Promise<void> {
  const response = await apiClient.post(
    "/api/advanced/export",
    { entityType, format, filters },
    { responseType: "blob" }
  );
  const blob = response.data;
  const contentDisposition = response.headers["content-disposition"] || "";
  let filename = `${entityType}-${new Date().toISOString().split("T")[0]}.${format}`;
  const match = contentDisposition.match(/filename="([^"]+)"/);
  if (match) filename = match[1];

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// TIMELINE
// ============================================================================
export interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  userName: string | null;
  metadata?: Record<string, any>;
}

export async function fetchCustomerTimeline(
  customerId: string,
  opts?: { types?: string[]; limit?: number }
): Promise<TimelineEvent[]> {
  const params: Record<string, any> = {};
  if (opts?.types) params.types = opts.types;
  if (opts?.limit) params.limit = opts.limit;
  const { data } = await apiClient.get<ApiSuccess<TimelineEvent[]>>(
    `/api/advanced/timeline/customer/${customerId}`,
    { params }
  );
  return data.data;
}

// ============================================================================
// SHOPIFY
// ============================================================================
export interface ShopifyStore {
  id: string;
  shopDomain: string;
  isActive: boolean;
  lastSyncAt: string | null;
  syncStatus: "idle" | "syncing" | "success" | "error";
  syncError: string | null;
  totalCustomersImported: number;
  totalOrdersImported: number;
  createdAt: string;
}

export async function listShopifyStores(): Promise<ShopifyStore[]> {
  const { data } = await apiClient.get<ApiSuccess<ShopifyStore[]>>(
    "/api/advanced/shopify/stores"
  );
  return data.data;
}
export async function connectShopifyStore(
  shopDomain: string,
  accessToken: string
): Promise<ShopifyStore> {
  const { data } = await apiClient.post<ApiSuccess<ShopifyStore>>(
    "/api/advanced/shopify/connect",
    { shopDomain, accessToken }
  );
  return data.data;
}
export async function disconnectShopifyStore(id: string): Promise<void> {
  await apiClient.delete(`/api/advanced/shopify/stores/${id}`);
}
export async function syncShopifyStore(id: string): Promise<{ imported: number; orders: number }> {
  const { data } = await apiClient.post<ApiSuccess<{ imported: number; orders: number }>>(
    `/api/advanced/shopify/stores/${id}/sync`
  );
  return data.data;
}

// ============================================================================
// GLOBAL SEARCH + ADVANCED FILTER
// ============================================================================
export interface GlobalSearchResult {
  customers: Array<{
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    status: string;
  }>;
  deals: Array<{
    id: string;
    title: string;
    stage: string;
    value: string;
    currency: string;
    customerId: string;
    customerName: string;
  }>;
  quotes: Array<{
    id: string;
    quoteNumber: string;
    title: string;
    status: string;
    total: string;
    currency: string;
    customerName: string;
  }>;
  contracts: Array<{
    id: string;
    contractNumber: string;
    title: string;
    status: string;
    value: string;
    currency: string;
    customerName: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
  }>;
  totalMatches: number;
}

export async function globalSearch(q: string): Promise<GlobalSearchResult> {
  const { data } = await apiClient.get<ApiSuccess<GlobalSearchResult>>(
    "/api/advanced/search",
    { params: { q } }
  );
  return data.data;
}

export type FilterOperator =
  | "equals"
  | "contains"
  | "starts_with"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal"
  | "in"
  | "not_in"
  | "is_empty"
  | "is_not_empty"
  | "between";

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value?: any;
  value2?: any;
}

export interface AdvancedFilterRequest {
  entityType: "customers" | "deals" | "quotes" | "contracts" | "tasks";
  conditions: FilterCondition[];
  logic?: "AND" | "OR";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AdvancedFilterResult {
  items: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function advancedFilter(
  req: AdvancedFilterRequest
): Promise<AdvancedFilterResult> {
  const { data } = await apiClient.post<ApiSuccess<AdvancedFilterResult>>(
    "/api/advanced/filter",
    req
  );
  return data.data;
}

export async function getFilterFields(): Promise<Record<string, string[]>> {
  const { data } = await apiClient.get<ApiSuccess<Record<string, string[]>>>(
    "/api/advanced/filter/fields"
  );
  return data.data;
}

// ============================================================================
// ECOMMERCE (MULTI-PLATFORM)
// ============================================================================
export type PlatformRegion = "mena" | "turkey" | "global";
export type AuthScheme =
  | "access_token"
  | "api_key"
  | "api_key_secret"
  | "oauth"
  | "basic_auth";

export interface PlatformDefinition {
  id: string;
  name: string;
  region: PlatformRegion;
  country: string;
  website: string;
  authScheme: AuthScheme;
  authHelpUrl?: string;
  apiBase?: string | null;
  apiDocs?: string;
  supports: {
    customers: boolean;
    orders: boolean;
    products: boolean;
    webhooks: boolean;
  };
  brandColor: string;
  description: { en: string; ar: string; tr: string };
  status: "native" | "api" | "csv_only" | "planned";
  popularity: number;
}

export interface EcommerceStore {
  id: string;
  platform: string;
  shopDomain: string;
  isActive: boolean;
  region: string | null;
  currency: string | null;
  lastSyncAt: string | null;
  syncStatus: string;
  syncError: string | null;
  totalCustomersImported: number;
  totalOrdersImported: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  platformInfo: {
    name: string;
    brandColor: string;
    country: string;
    region: PlatformRegion;
  } | null;
}

export interface ConnectEcommerceDto {
  platform: string;
  shopDomain: string;
  accessToken: string;
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export async function listPlatformCatalog(
  region?: PlatformRegion
): Promise<PlatformDefinition[]> {
  const { data } = await apiClient.get<ApiSuccess<PlatformDefinition[]>>(
    "/api/advanced/ecommerce/catalog",
    { params: region ? { region } : {} }
  );
  return data.data;
}

export async function listEcommerceStores(): Promise<EcommerceStore[]> {
  const { data } = await apiClient.get<ApiSuccess<EcommerceStore[]>>(
    "/api/advanced/ecommerce/stores"
  );
  return data.data;
}

export async function connectEcommerceStore(dto: ConnectEcommerceDto) {
  const { data } = await apiClient.post<ApiSuccess<any>>(
    "/api/advanced/ecommerce/connect",
    dto
  );
  return data.data;
}

export async function disconnectEcommerceStore(id: string) {
  const { data } = await apiClient.delete<ApiSuccess<any>>(
    `/api/advanced/ecommerce/stores/${id}`
  );
  return data.data;
}

export async function syncEcommerceStore(id: string) {
  const { data } = await apiClient.post<ApiSuccess<{ imported: number; orders: number }>>(
    `/api/advanced/ecommerce/stores/${id}/sync`
  );
  return data.data;
}

// ============================================================================
// WEBHOOKS — inbound delivery management
// ============================================================================
export interface WebhookSubscription {
  id: string;
  platform: string;
  storeId: string | null;
  topic: string;
  isActive: boolean;
  lastReceivedAt: string | null;
  receivedCount: number;
  failedCount: number;
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookSubscriptionWithSecret extends WebhookSubscription {
  secret: string; // returned ONLY from create + rotateSecret; never from list
}

export interface WebhookEvent {
  id: string;
  platform: string;
  topic: string;
  externalId: string | null;
  status: "pending" | "processing" | "done" | "failed" | "skipped" | "dead_letter";
  attempts: number;
  lastError: string | null;
  signatureOk: boolean;
  receivedAt: string;
  processedAt: string | null;
  nextRetryAt: string | null;
}

export async function getSupportedWebhookPlatforms(): Promise<string[]> {
  const { data } = await apiClient.get<ApiSuccess<string[]>>(
    "/api/webhooks/platforms"
  );
  return data.data;
}

export async function listWebhookSubscriptions(
  storeId?: string
): Promise<WebhookSubscription[]> {
  const { data } = await apiClient.get<ApiSuccess<WebhookSubscription[]>>(
    "/api/webhooks/subscriptions",
    { params: storeId ? { storeId } : {} }
  );
  return data.data;
}

export async function createWebhookSubscription(input: {
  platform: string;
  topic: string;
  storeId?: string | null;
}): Promise<WebhookSubscriptionWithSecret> {
  const { data } = await apiClient.post<ApiSuccess<WebhookSubscriptionWithSecret>>(
    "/api/webhooks/subscriptions",
    input
  );
  return data.data;
}

export async function updateWebhookSubscription(
  id: string,
  input: { isActive: boolean }
): Promise<WebhookSubscription> {
  const { data } = await apiClient.patch<ApiSuccess<WebhookSubscription>>(
    `/api/webhooks/subscriptions/${id}`,
    input
  );
  return data.data;
}

export async function deleteWebhookSubscription(id: string): Promise<void> {
  await apiClient.delete(`/api/webhooks/subscriptions/${id}`);
}

export async function rotateWebhookSecret(
  id: string
): Promise<{ id: string; secret: string; updatedAt: string }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ id: string; secret: string; updatedAt: string }>
  >(`/api/webhooks/subscriptions/${id}/rotate-secret`);
  return data.data;
}

export async function listWebhookEvents(params?: {
  limit?: number;
  platform?: string;
  status?: string;
}): Promise<WebhookEvent[]> {
  const { data } = await apiClient.get<ApiSuccess<WebhookEvent[]>>(
    "/api/webhooks/events",
    { params: params || {} }
  );
  return data.data;
}

export async function retryWebhookEvent(
  id: string
): Promise<{ eventId: string; status: string }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ eventId: string; status: string }>
  >(`/api/webhooks/events/${id}/retry`);
  return data.data;
}

// ============================================================================
// E-COMMERCE ANALYTICS
// ============================================================================
export interface EcommerceAnalytics {
  baseCurrency: string;
  windowDays: number;
  generatedAt: string;
  totals: {
    storesConnected: number;
    totalCustomers: number;
    totalCustomersInWindow: number;
    totalCustomersInPriorWindow: number;
    customerGrowthPct: number;
    totalOrders: number;
    totalWonRevenue: number;
  };
  platforms: Array<{
    platform: string;
    storesConnected: number;
    customers: number;
    customersInWindow: number;
    customersInPriorWindow: number;
    orders: number;
    ordersInWindow: number;
    wonOrders: number;
    wonRevenue: number;
    avgOrderValue: number;
  }>;
  topCustomers: Array<{
    id: string;
    fullName: string;
    email: string | null;
    source: string | null;
    lifetimeValue: number;
  }>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  stores: Array<{
    id: string;
    platform: string;
    shopDomain: string;
    lastSyncAt: string | null;
    syncStatus: string;
    totalCustomersImported: number;
    totalOrdersImported: number;
  }>;
}

export async function getEcommerceAnalytics(params?: {
  baseCurrency?: string;
  windowDays?: number;
}): Promise<EcommerceAnalytics> {
  const { data } = await apiClient.get<ApiSuccess<EcommerceAnalytics>>(
    "/api/reports/ecommerce",
    { params: params || {} }
  );
  return data.data;
}

/**
 * Download the e-commerce analytics report as CSV or PDF.
 *
 * Uses a raw axios request with responseType:'blob' so we get the binary
 * body intact (apiClient's default interceptor tries to unwrap JSON, which
 * would corrupt a PDF). The returned Blob is handed to the browser via
 * a dynamically-created anchor tag — standard pattern for programmatic
 * downloads that works across Chrome/Safari/Firefox without popups.
 */
export async function exportEcommerceAnalytics(params: {
  format: "csv" | "pdf";
  baseCurrency?: string;
  windowDays?: number;
}): Promise<void> {
  const resp = await apiClient.get("/api/reports/ecommerce/export", {
    params,
    responseType: "blob",
  });

  // Try to get filename from Content-Disposition header; fall back to sensible default.
  const disposition = resp.headers["content-disposition"] as string | undefined;
  let filename = `zyrix-ecommerce-${params.windowDays || 30}d.${params.format}`;
  if (disposition) {
    const match = disposition.match(/filename="([^"]+)"/);
    if (match) filename = match[1];
  }

  const blob = resp.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  // Give the browser a moment to start the download before cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// ============================================================================
// ONBOARDING — 7-step wizard
// ============================================================================

export interface OnboardingStatus {
  completed: boolean;
  company: {
    id: string;
    name: string;
    country: string | null;
    baseCurrency: string | null;
    onboardingCompletedAt: string | null;
  };
  user: {
    id: string;
    fullName: string;
    preferredLocale: string | null;
  };
  signals: {
    storesConnected: number;
    teamMembers: number;
  };
}

export interface CompleteOnboardingDto {
  companyName?: string;
  country?: string;
  baseCurrency?: string;
  preferredLocale?: "en" | "ar" | "tr";
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const { data } = await apiClient.get<ApiSuccess<OnboardingStatus>>(
    "/api/onboarding/status"
  );
  return data.data;
}

export async function completeOnboarding(
  dto: CompleteOnboardingDto
): Promise<OnboardingStatus> {
  const { data } = await apiClient.post<ApiSuccess<OnboardingStatus>>(
    "/api/onboarding/complete",
    dto
  );
  return data.data;
}

export interface InviteColleagueDto {
  email: string;
  role: "manager" | "member";
  fullName?: string;
}

export async function inviteColleague(
  dto: InviteColleagueDto
): Promise<{ invited: true; userId: string; email: string }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ invited: true; userId: string; email: string }>
  >("/api/onboarding/invite-colleague", dto);
  return data.data;
}

// ============================================================================
// SECURITY — 2FA + Audit Log
// ============================================================================

// ─── 2FA ──────────────────────────────────────────────────────────────

export interface TwoFactorStatus {
  enabled: boolean;
  backupCodesRemaining: number;
}

export async function get2FAStatus(): Promise<TwoFactorStatus> {
  const { data } = await apiClient.get<ApiSuccess<TwoFactorStatus>>(
    "/api/security/2fa/status"
  );
  return data.data;
}

export interface BeginEnroll2FAResult {
  qrDataUrl: string;
  secret: string;
  otpauthUrl: string;
}

export async function begin2FAEnroll(): Promise<BeginEnroll2FAResult> {
  const { data } = await apiClient.post<ApiSuccess<BeginEnroll2FAResult>>(
    "/api/security/2fa/begin-enroll"
  );
  return data.data;
}

export async function confirm2FAEnroll(
  code: string
): Promise<{ enabled: true; backupCodes: string[] }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ enabled: true; backupCodes: string[] }>
  >("/api/security/2fa/confirm-enroll", { code });
  return data.data;
}

export async function disable2FA(
  password: string
): Promise<{ disabled: true }> {
  const { data } = await apiClient.post<ApiSuccess<{ disabled: true }>>(
    "/api/security/2fa/disable",
    { password }
  );
  return data.data;
}

export async function regenerate2FABackupCodes(): Promise<{
  backupCodes: string[];
}> {
  const { data } = await apiClient.post<
    ApiSuccess<{ backupCodes: string[] }>
  >("/api/security/2fa/regenerate-backup-codes");
  return data.data;
}

// ─── 2FA challenge (login step 2) ─────────────────────────────────────

export interface TwoFAChallengeResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    companyId: string;
    emailVerified: boolean;
  };
  company: { id: string; name: string; slug: string; plan: string };
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export async function complete2FAChallenge(
  challengeToken: string,
  code: string
): Promise<TwoFAChallengeResponse> {
  const { data } = await apiClient.post<ApiSuccess<TwoFAChallengeResponse>>(
    "/api/auth/2fa-challenge",
    { challengeToken, code }
  );
  return data.data;
}

// ─── Audit log ────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  companyId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  changes: Record<string, { before: unknown; after: unknown }> | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string } | null;
}

export interface AuditLogPage {
  items: AuditLogEntry[];
  pagination: { total: number; limit: number; offset: number };
}

export async function listAuditLogs(params?: {
  limit?: number;
  offset?: number;
  action?: string;
  actionPrefix?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  since?: string;
  until?: string;
}): Promise<AuditLogPage> {
  const { data } = await apiClient.get<ApiSuccess<AuditLogPage>>(
    "/api/security/audit",
    { params: params || {} }
  );
  return data.data;
}

export async function listAuditActions(): Promise<string[]> {
  const { data } = await apiClient.get<ApiSuccess<string[]>>(
    "/api/security/audit/actions"
  );
  return data.data;
}

// ============================================================================
// BILLING — merchant self-service
// ============================================================================

export interface BillingPlan {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  nameTr: string;
  description: string | null;
  descriptionAr: string | null;
  descriptionTr: string | null;
  priceMonthlyUsd: string;
  priceYearlyUsd: string;
  priceMonthlyTry: string;
  priceYearlyTry: string;
  priceMonthlySar: string;
  priceYearlySar: string;
  maxUsers: number;
  maxCustomers: number;
  maxDeals: number;
  features: string[];
  isFeatured: boolean;
  sortOrder: number;
  color: string;
}

export interface CurrentSubscription {
  id: string;
  planId: string;
  status: string;
  billingCycle: string;
  currency: string;
  amount: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAt: string | null;
  cancelledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  gateway: string | null;
  createdAt: string;
  plan: {
    id: string;
    slug: string;
    name: string;
    nameAr: string;
    nameTr: string;
    priceMonthlyUsd: string;
    priceYearlyUsd: string;
    priceMonthlyTry: string;
    priceYearlyTry: string;
    priceMonthlySar: string;
    priceYearlySar: string;
    features: string[];
  };
}

export interface CurrentBilling {
  company: {
    id: string;
    plan: string;
    trialEndsAt: string | null;
    status: string;
    baseCurrency: string | null;
  };
  subscription: CurrentSubscription | null;
}

export interface Invoice {
  id: string;
  amount: string;
  currency: string;
  status: string;
  gateway: string;
  gatewayPaymentId: string | null;
  method: string | null;
  last4: string | null;
  cardBrand: string | null;
  description: string | null;
  failureReason: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  subscription: {
    billingCycle: string;
    plan: { name: string; slug: string };
  } | null;
}

export interface InvoicePage {
  items: Invoice[];
  pagination: { total: number; limit: number; offset: number };
}

export async function listBillingPlans(): Promise<BillingPlan[]> {
  const { data } = await apiClient.get<ApiSuccess<BillingPlan[]>>(
    "/api/billing/plans"
  );
  return data.data;
}

export async function getCurrentBilling(): Promise<CurrentBilling> {
  const { data } = await apiClient.get<ApiSuccess<CurrentBilling>>(
    "/api/billing/current"
  );
  return data.data;
}

export async function listInvoices(
  limit = 50,
  offset = 0
): Promise<InvoicePage> {
  const { data } = await apiClient.get<ApiSuccess<InvoicePage>>(
    "/api/billing/invoices",
    { params: { limit, offset } }
  );
  return data.data;
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<{ cancelled: true; immediate: boolean }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ cancelled: true; immediate: boolean }>
  >(`/api/billing/subscriptions/${subscriptionId}/cancel`);
  return data.data;
}

export async function resumeSubscription(
  subscriptionId: string
): Promise<{ resumed: true }> {
  const { data } = await apiClient.post<ApiSuccess<{ resumed: true }>>(
    `/api/billing/subscriptions/${subscriptionId}/resume`
  );
  return data.data;
}

// Checkout session creation — hits the public endpoint (no auth required
// since the gateway flow starts before the user's session is fully
// established for plan upgrades).
export async function createCheckoutSession(dto: {
  companyId: string;
  planSlug: string;
  billingCycle: "monthly" | "yearly";
  currency: "USD" | "TRY" | "SAR" | "AED";
  buyerCountry?: string;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ gatewaySessionId: string; redirectUrl: string; expiresAt: string }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ gatewaySessionId: string; redirectUrl: string; expiresAt: string }>
  >("/api/payments/checkout/create-session", dto);
  return data.data;
}

// ============================================================================
// COHORT + FUNNEL ANALYTICS
// ============================================================================

export interface CohortRetention {
  monthOffset: number;
  activeCount: number;
  retentionPct: number;
}

export interface CohortRow {
  cohortMonth: string;
  cohortSize: number;
  retention: CohortRetention[];
}

export interface CohortReport {
  baseCurrency: string;
  monthsBack: number;
  cohorts: CohortRow[];
  generatedAt: string;
}

export async function getCohortReport(params?: {
  monthsBack?: number;
}): Promise<CohortReport> {
  const { data } = await apiClient.get<ApiSuccess<CohortReport>>(
    "/api/reports/cohort",
    { params: params || {} }
  );
  return data.data;
}

export interface FunnelStage {
  stage: string;
  totalDeals: number;
  conversionToNext: number | null;
  avgDaysInStage: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalValue: number;
  currency: string;
}

export interface FunnelReport {
  windowDays: number;
  stages: FunnelStage[];
  overallConversionRate: number;
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  avgDealCycleDays: number | null;
  generatedAt: string;
}

export async function getFunnelReport(params?: {
  windowDays?: number;
}): Promise<FunnelReport> {
  const { data } = await apiClient.get<ApiSuccess<FunnelReport>>(
    "/api/reports/funnel",
    { params: params || {} }
  );
  return data.data;
}

// ============================================================================
// CUSTOM DASHBOARDS — widget layouts
// ============================================================================

export type WidgetWidth = "full" | "half" | "third" | "quarter";

export interface DashboardWidget {
  id: string;
  type: string;
  width: WidgetWidth;
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  source: "user" | "company" | "default";
}

export async function getDashboardLayout(): Promise<DashboardLayout> {
  const { data } = await apiClient.get<ApiSuccess<DashboardLayout>>(
    "/api/dashboard/layout"
  );
  return data.data;
}

export async function saveDashboardLayout(
  widgets: DashboardWidget[]
): Promise<{ widgets: DashboardWidget[] }> {
  const { data } = await apiClient.put<
    ApiSuccess<{ widgets: DashboardWidget[] }>
  >("/api/dashboard/layout", { widgets });
  return data.data;
}

export async function resetDashboardLayout(): Promise<DashboardLayout> {
  const { data } = await apiClient.delete<ApiSuccess<DashboardLayout>>(
    "/api/dashboard/layout"
  );
  return data.data;
}

// ============================================================================
// TEMPLATES MARKETPLACE
// ============================================================================

export interface TemplateCard {
  id: string;
  slug: string;
  industry: string;
  region: string;
  locale: string;
  name: string;
  nameAr: string | null;
  nameTr: string | null;
  tagline: string | null;
  taglineAr: string | null;
  taglineTr: string | null;
  description: string | null;
  descriptionAr: string | null;
  descriptionTr: string | null;
  icon: string;
  color: string;
  isFeatured: boolean;
  sortOrder: number;
  setupMinutes: number;
  hasSeedData: boolean;
}

export interface TemplateBundle {
  pipelineStages?: string[];
  tags?: string[];
  customerStatuses?: string[];
  dealSources?: string[];
  customFields?: Array<{
    entityType: string;
    name: string;
    slug: string;
    type: string;
    options?: string[];
  }>;
  emailTemplates?: Array<{
    subject: string;
    body: string;
    purpose?: string;
  }>;
  seedCustomers?: Array<{
    fullName: string;
    email?: string;
    phone?: string;
    companyName?: string;
    status?: string;
    source?: string;
  }>;
  seedDeals?: Array<{
    title: string;
    value: number;
    currency: string;
    stage: string;
    customerIdx: number;
  }>;
}

export interface TemplateDetail extends TemplateCard {
  bundle: TemplateBundle;
}

export interface TemplateApplication {
  id: string;
  templateId: string;
  appliedAt: string;
  status: "completed" | "failed" | "reverted";
  createdRecords: Record<string, string[]>;
  slug: string;
  name: string;
  nameAr: string | null;
  nameTr: string | null;
  icon: string;
  industry: string;
}

export async function listMarketplaceTemplates(filters?: {
  industry?: string;
  region?: string;
}): Promise<TemplateCard[]> {
  const { data } = await apiClient.get<ApiSuccess<TemplateCard[]>>(
    "/api/templates",
    { params: filters || {} }
  );
  return data.data;
}

export async function getMarketplaceTemplate(slug: string): Promise<TemplateDetail> {
  const { data } = await apiClient.get<ApiSuccess<TemplateDetail>>(
    `/api/templates/${encodeURIComponent(slug)}`
  );
  return data.data;
}

export async function applyMarketplaceTemplate(
  slug: string
): Promise<{
  applicationId: string;
  summary: Record<string, number>;
}> {
  const { data } = await apiClient.post<
    ApiSuccess<{
      applicationId: string;
      summary: Record<string, number>;
    }>
  >(`/api/templates/${encodeURIComponent(slug)}/apply`);
  return data.data;
}

export async function listMarketplaceApplications(): Promise<
  TemplateApplication[]
> {
  const { data } = await apiClient.get<ApiSuccess<TemplateApplication[]>>(
    "/api/templates/applications"
  );
  return data.data;
}

export async function revertMarketplaceApplication(
  id: string
): Promise<{ reverted: true }> {
  const { data } = await apiClient.post<ApiSuccess<{ reverted: true }>>(
    `/api/templates/applications/${encodeURIComponent(id)}/revert`
  );
  return data.data;
}

// ============================================================================
// WORKFLOW AUTOMATION
// ============================================================================

export interface WorkflowSpecField {
  key: string;
  label: { en: string; ar: string; tr: string };
  type: "text" | "number" | "select" | "textarea" | "boolean" | "cron";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: { en: string; ar: string; tr: string };
}

export interface WorkflowTriggerSpec {
  type: string;
  label: { en: string; ar: string; tr: string };
  description: { en: string; ar: string; tr: string };
  category: "crm" | "schedule" | "external";
  configFields: WorkflowSpecField[];
  payloadFields: string[];
}

export interface WorkflowActionSpec {
  type: string;
  label: { en: string; ar: string; tr: string };
  description: { en: string; ar: string; tr: string };
  category: "messaging" | "crm" | "external";
  configFields: WorkflowSpecField[];
}

export interface WorkflowCatalog {
  triggers: WorkflowTriggerSpec[];
  actions: WorkflowActionSpec[];
  conditionOperators: string[];
}

export interface WorkflowTrigger {
  type: string;
  config: Record<string, unknown>;
}

export interface WorkflowAction {
  id: string;
  type: string;
  config: Record<string, unknown>;
  stopOnError?: boolean;
  delaySeconds?: number;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: unknown;
}

export interface Workflow {
  id: string;
  companyId: string;
  createdById: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  runCount: number;
  successCount: number;
  failureCount: number;
  lastRunAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionStep {
  actionId: string;
  actionType: string;
  status: "success" | "failed" | "skipped";
  startedAt: string;
  finishedAt: string;
  error?: string;
  output?: unknown;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName?: string;
  companyId: string;
  triggerPayload: unknown;
  status: "pending" | "running" | "completed" | "failed" | "skipped_conditions";
  stepResults: WorkflowExecutionStep[];
  attempts: number;
  lastError: string | null;
  nextRetryAt: string | null;
  queuedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface WorkflowExecutionsPage {
  items: WorkflowExecution[];
  pagination: { total: number; limit: number; offset: number };
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  actions?: WorkflowAction[];
  conditions?: WorkflowCondition[];
  isEnabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// API functions
// ─────────────────────────────────────────────────────────────────────

export async function getWorkflowCatalog(): Promise<WorkflowCatalog> {
  const { data } = await apiClient.get<ApiSuccess<WorkflowCatalog>>(
    "/api/workflows/catalog"
  );
  return data.data;
}

export async function listWorkflows(filters?: {
  isEnabled?: boolean;
  triggerType?: string;
}): Promise<Workflow[]> {
  const params: Record<string, string> = {};
  if (filters?.isEnabled !== undefined)
    params.isEnabled = String(filters.isEnabled);
  if (filters?.triggerType) params.triggerType = filters.triggerType;
  const { data } = await apiClient.get<ApiSuccess<Workflow[]>>(
    "/api/workflows",
    { params }
  );
  return data.data;
}

export async function getWorkflow(id: string): Promise<Workflow> {
  const { data } = await apiClient.get<ApiSuccess<Workflow>>(
    `/api/workflows/${encodeURIComponent(id)}`
  );
  return data.data;
}

export async function createWorkflow(
  dto: CreateWorkflowDto
): Promise<Workflow> {
  const { data } = await apiClient.post<ApiSuccess<Workflow>>(
    "/api/workflows",
    dto
  );
  return data.data;
}

export async function updateWorkflow(
  id: string,
  patch: Partial<CreateWorkflowDto>
): Promise<Workflow> {
  const { data } = await apiClient.patch<ApiSuccess<Workflow>>(
    `/api/workflows/${encodeURIComponent(id)}`,
    patch
  );
  return data.data;
}

export async function deleteWorkflow(id: string): Promise<{ deleted: true }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: true }>>(
    `/api/workflows/${encodeURIComponent(id)}`
  );
  return data.data;
}

export async function testRunWorkflow(
  id: string,
  payload?: Record<string, unknown>
): Promise<{ executionId: string }> {
  const { data } = await apiClient.post<
    ApiSuccess<{ executionId: string }>
  >(`/api/workflows/${encodeURIComponent(id)}/test`, { payload: payload ?? {} });
  return data.data;
}

export async function listWorkflowExecutions(filters?: {
  workflowId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<WorkflowExecutionsPage> {
  const params: Record<string, string | number> = {};
  if (filters?.workflowId) params.workflowId = filters.workflowId;
  if (filters?.status) params.status = filters.status;
  if (filters?.limit) params.limit = filters.limit;
  if (filters?.offset) params.offset = filters.offset;
  const { data } = await apiClient.get<ApiSuccess<WorkflowExecutionsPage>>(
    "/api/workflows/executions",
    { params }
  );
  return data.data;
}

export async function getWorkflowExecution(
  id: string
): Promise<WorkflowExecution> {
  const { data } = await apiClient.get<ApiSuccess<WorkflowExecution>>(
    `/api/workflows/executions/${encodeURIComponent(id)}`
  );
  return data.data;
}
