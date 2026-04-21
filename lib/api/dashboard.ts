"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// DASHBOARD — TYPES + API
// ============================================================================

export type DashboardRole =
  | "super_admin"
  | "owner"
  | "admin"
  | "manager"
  | "member";
export type DashboardScope = "personal" | "team" | "company";

export interface BaseDashboardStats {
  customers: { total: number; new30d: number };
  deals: {
    total: number;
    open: number;
    wonLast30d: number;
    lostLast30d: number;
    wonValueLast30d: number;
    pipelineValue: number;
    weightedPipelineValue: number;
    byStage: Record<string, { count: number; value: number }>;
  };
  tasks: { open: number; overdue: number; completedLast7d: number };
  activities: { last7d: number };
}

export interface MemberDashboard extends BaseDashboardStats {
  role: DashboardRole;
  scope: "personal";
  upcomingTasks: {
    id: string;
    title: string;
    priority: string;
    dueDate: string | null;
    customer: { id: string; fullName: string } | null;
  }[];
  myOpenDeals: {
    id: string;
    title: string;
    stage: string;
    value: string;
    currency: string;
    customer: { id: string; fullName: string };
  }[];
}

export interface TeamLeaderboardEntry {
  user: { id: string; fullName: string; email: string; role: string };
  dealsWon: number;
  revenue: number;
}

export interface ManagerDashboard extends BaseDashboardStats {
  role: DashboardRole;
  scope: "team";
  teamLeaderboard: TeamLeaderboardEntry[];
}

export interface CompanyDashboard extends BaseDashboardStats {
  role: DashboardRole;
  scope: "company";
  company: {
    totalUsers: number;
    acceptedQuotesValue30d: number;
    activeContracts: number;
  };
  topCustomers: {
    id: string;
    fullName: string;
    companyName: string | null;
    lifetimeValue: number;
  }[];
  teamLeaderboard: TeamLeaderboardEntry[];
}

export type DashboardStats =
  | MemberDashboard
  | ManagerDashboard
  | CompanyDashboard;

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<ApiSuccess<DashboardStats>>(
    "/api/dashboard/stats"
  );
  return data.data;
}
