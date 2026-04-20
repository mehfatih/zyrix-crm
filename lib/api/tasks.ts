"use client";

import { apiClient } from "./client";
import type { ApiSuccess } from "../auth/types";

// ============================================================================
// TASKS — TYPES + API CLIENT
// ============================================================================

export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface TaskRelatedUser {
  id: string;
  email: string;
  fullName: string;
}

export interface TaskRelatedCustomer {
  id: string;
  fullName: string;
  companyName: string | null;
}

export interface TaskRelatedDeal {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  companyId: string;
  createdById: string;
  assignedToId: string | null;
  customerId: string | null;
  dealId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  createdBy: TaskRelatedUser;
  assignedTo: TaskRelatedUser | null;
  customer: TaskRelatedCustomer | null;
  deal: TaskRelatedDeal | null;
}

export interface TaskStats {
  totalOpen: number;
  myOpen: number;
  overdue: number;
  dueToday: number;
  byStatus: {
    todo: number;
    inProgress: number;
    done: number;
    cancelled: number;
  };
  urgent: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
  customerId?: string | null;
  dealId?: string | null;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

export interface ListTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  customerId?: string;
  dealId?: string;
  dueBefore?: string;
  dueAfter?: string;
  overdueOnly?: boolean;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

// ─────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────
export async function fetchTaskStats(): Promise<TaskStats> {
  const { data } = await apiClient.get<ApiSuccess<TaskStats>>("/api/tasks/stats");
  return data.data;
}

export async function fetchTasks(
  params: ListTasksParams = {}
): Promise<Paginated<Task>> {
  const { data } = await apiClient.get<ApiSuccess<Paginated<Task>>>(
    "/api/tasks",
    { params }
  );
  return data.data;
}

export async function fetchTask(id: string): Promise<Task> {
  const { data } = await apiClient.get<ApiSuccess<Task>>(`/api/tasks/${id}`);
  return data.data;
}

export async function createTask(dto: CreateTaskDto): Promise<Task> {
  const { data } = await apiClient.post<ApiSuccess<Task>>("/api/tasks", dto);
  return data.data;
}

export async function updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
  const { data } = await apiClient.patch<ApiSuccess<Task>>(
    `/api/tasks/${id}`,
    dto
  );
  return data.data;
}

export async function deleteTask(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/api/tasks/${id}`
  );
  return data.data;
}
