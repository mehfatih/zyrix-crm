"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// RBAC (P1) — frontend API client
// ----------------------------------------------------------------------------
// Keep the Permission union literal-synced with the backend's
// src/constants/permissions.ts. TypeScript treats it as a string union
// so typos in hasPermission('customers:reed') fail at compile time.
// ============================================================================

export const PERMISSION_KEYS = [
  "customers:read",
  "customers:write",
  "customers:delete",
  "deals:read",
  "deals:write",
  "deals:delete",
  "quotes:read",
  "quotes:write",
  "quotes:issue",
  "contracts:read",
  "contracts:write",
  "contracts:sign",
  "invoices:read",
  "invoices:issue",
  "invoices:void",
  "reports:view_own",
  "reports:view_all",
  "settings:billing",
  "settings:users",
  "settings:roles",
  "settings:branding",
  "settings:integrations",
  "admin:impersonate",
  "admin:audit",
  "admin:compliance",
] as const;

export type Permission = (typeof PERMISSION_KEYS)[number];

export type PermissionModule =
  | "customers"
  | "deals"
  | "quotes"
  | "contracts"
  | "invoices"
  | "reports"
  | "settings"
  | "admin";

export interface PermissionEntry {
  key: Permission;
  module: PermissionModule;
  action: string;
  label: { en: string; ar: string; tr: string };
  description: { en: string; ar: string; tr: string };
}

export interface Role {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────────────────────────────
// Catalog + my-permissions
// ──────────────────────────────────────────────────────────────────────

export async function fetchPermissionCatalog(): Promise<{
  permissions: Permission[];
  catalog: PermissionEntry[];
}> {
  const { data } = await apiClient.get<
    ApiSuccess<{ permissions: Permission[]; catalog: PermissionEntry[] }>
  >("/api/permissions");
  return data.data;
}

export async function fetchMyPermissions(): Promise<Permission[]> {
  const { data } = await apiClient.get<
    ApiSuccess<{ permissions: Permission[] }>
  >("/api/permissions/me");
  return data.data.permissions;
}
