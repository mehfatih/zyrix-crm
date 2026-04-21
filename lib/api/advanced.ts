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
